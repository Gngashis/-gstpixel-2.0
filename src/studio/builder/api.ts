import { z } from "zod";
import type { WorkersAiBinding } from "../personalization/cloudflare-provider";
import { refineDesignSpecWithWorkersAi } from "./cloudflare-provider";
import {
  generateFallbackDesignSpec,
  modifyDesignSpec,
  parseDesignSpec,
  type DesignSpec,
} from "./domain";
import {
  STUDIO_BUILD_MAX_REQUEST_BYTES,
  STUDIO_BUILD_TIMEOUT_MS,
} from "./config";

export type StudioBuildEnv = { AI?: WorkersAiBinding };

const safeText = (max: number, min: number) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(min)
        .max(max)
        .refine(
          (value) =>
            !/<\/?[a-z][^>]*>/i.test(value) &&
            !/\bjavascript\s*:/i.test(value) &&
            !/```/.test(value),
          "Text contains unsupported content.",
        ),
    );

const generateRequestSchema = z
  .object({ action: z.literal("generate"), prompt: safeText(1_200, 10) })
  .strict();

const modifyRequestSchema = z
  .object({
    action: z.literal("modify"),
    instruction: safeText(600, 2),
    spec: z.unknown(),
  })
  .strict();

const buildRequestSchema = z.discriminatedUnion("action", [
  generateRequestSchema,
  modifyRequestSchema,
]);

type RequestGuard = { enter(): boolean; leave(): void };

const sharedGuard = (() => {
  let active = 0;
  let recent: number[] = [];
  return {
    enter() {
      const now = Date.now();
      recent = recent.filter((timestamp) => now - timestamp < 60_000);
      if (active >= 4 || recent.length >= 30) return false;
      active += 1;
      recent.push(now);
      return true;
    },
    leave() {
      active = Math.max(0, active - 1);
    },
  } satisfies RequestGuard;
})();

class BodyTooLargeError extends Error {}

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'",
    },
  });
}

async function readBoundedBody(request: Request): Promise<string> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > STUDIO_BUILD_MAX_REQUEST_BYTES) {
    throw new BodyTooLargeError();
  }
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > STUDIO_BUILD_MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }
  return body + decoder.decode();
}

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Studio build timed out.")),
      STUDIO_BUILD_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function createStudioBuildHandler(options?: { guard?: RequestGuard }) {
  return async function handleStudioBuild(
    request: Request,
    env?: StudioBuildEnv,
  ): Promise<Response> {
    if (request.method !== "POST")
      return jsonResponse({ error: "Method not allowed." }, 405);
    if (
      !(request.headers.get("content-type") ?? "")
        .toLowerCase()
        .startsWith("application/json")
    ) {
      return jsonResponse({ error: "JSON is required." }, 415);
    }
    const requestUrl = new URL(request.url);
    const origin = request.headers.get("origin");
    if (origin && origin !== requestUrl.origin) {
      return jsonResponse({ error: "Request origin is not allowed." }, 403);
    }

    let rawBody: string;
    try {
      rawBody = await readBoundedBody(request);
    } catch (error) {
      return error instanceof BodyTooLargeError
        ? jsonResponse({ error: "Request is too large." }, 413)
        : jsonResponse({ error: "Request could not be read." }, 400);
    }

    let json: unknown;
    try {
      json = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: "Request JSON is invalid." }, 400);
    }

    const parsed = buildRequestSchema.safeParse(json);
    if (!parsed.success) {
      return jsonResponse(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Check the request and try again.",
        },
        400,
      );
    }

    let fallback: DesignSpec;
    try {
      fallback =
        parsed.data.action === "generate"
          ? generateFallbackDesignSpec(parsed.data.prompt)
          : modifyDesignSpec(
              parseDesignSpec(parsed.data.spec),
              parsed.data.instruction,
            );
    } catch {
      return jsonResponse(
        { error: "The website request could not be validated." },
        400,
      );
    }

    const guard = options?.guard ?? sharedGuard;
    if (!guard.enter())
      return jsonResponse({ spec: fallback, source: "fallback" }, 200);
    try {
      if (!env?.AI)
        return jsonResponse({ spec: fallback, source: "fallback" }, 200);
      try {
        const spec = await withTimeout(
          refineDesignSpecWithWorkersAi({
            ai: env.AI,
            action: parsed.data.action,
            visitorText:
              parsed.data.action === "generate"
                ? parsed.data.prompt
                : parsed.data.instruction,
            candidate: fallback,
          }),
        );
        spec.metadata.source = "ai";
        return jsonResponse({ spec: parseDesignSpec(spec), source: "ai" }, 200);
      } catch {
        return jsonResponse({ spec: fallback, source: "fallback" }, 200);
      }
    } finally {
      guard.leave();
    }
  };
}

export const handleStudioBuild = createStudioBuildHandler();
