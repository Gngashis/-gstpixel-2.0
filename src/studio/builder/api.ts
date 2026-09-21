import { z } from "zod";
import type { WorkersAiBinding } from "../personalization/cloudflare-provider";
import {
  planCreativeBlueprintWithWorkersAi,
  planStudioChangeWithWorkersAi,
} from "./cloudflare-provider";
import {
  applyStudioChangePlan,
  planStudioChange,
  shouldEscalateStudioInstruction,
  studioEditorContextSchema,
  type StudioChangeContext,
} from "./change-plan";
import {
  applyBlueprintPatch,
  blueprintToDesignSpec,
  extractPromptTerms,
  generateFallbackDesignSpec,
  planCreativeBlueprint,
} from "./blueprint";
import { parseDesignSpec, type DesignSpec } from "./domain";
import {
  STUDIO_BUILD_MAX_REQUEST_BYTES,
  STUDIO_BUILD_TIMEOUT_MS,
} from "./config";

export type StudioBuildEnv = {
  AI?: WorkersAiBinding;
  STUDIO_AI_MODEL?: string;
  STUDIO_AI_PROVIDER?: string;
};

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
    context: studioEditorContextSchema.optional(),
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
    let changeContext: StudioChangeContext | null = null;
    let fallbackPlan: ReturnType<typeof planStudioChange> | null = null;
    try {
      if (parsed.data.action === "generate") {
        fallback = generateFallbackDesignSpec(parsed.data.prompt);
      } else {
        const currentSpec = parseDesignSpec(parsed.data.spec);
        const editorContext = parsed.data.context ?? {
          activePageSlug: "/",
          selectedSectionId: currentSpec.pages[0]?.sections[0]?.id ?? null,
          viewport: "desktop" as const,
          recentTurns: [],
          previousThemes: [],
        };
        changeContext = { spec: currentSpec, ...editorContext };
        fallbackPlan = planStudioChange(parsed.data.instruction, changeContext);
        fallback = applyStudioChangePlan(changeContext, fallbackPlan).spec;
      }
    } catch {
      return jsonResponse(
        { error: "The website request could not be validated." },
        400,
      );
    }

    const guard = options?.guard ?? sharedGuard;
    const fallbackPayload =
      parsed.data.action === "modify" && fallbackPlan && changeContext
        ? (() => {
            const result = applyStudioChangePlan(changeContext, fallbackPlan);
            return {
              spec: result.spec,
              plan: fallbackPlan,
              summary: fallbackPlan.summary,
              unsupported: fallbackPlan.unsupported,
              changed: result.changed,
              source: "fallback" as const,
            };
          })()
        : { spec: fallback, source: "fallback" as const };

    if (!guard.enter()) return jsonResponse(fallbackPayload, 200);
    try {
      if (!env?.AI) return jsonResponse(fallbackPayload, 200);
      try {
        const request = parsed.data;
        if (request.action === "modify") {
          const context = changeContext;
          const draftPlan = fallbackPlan;
          if (
            !context ||
            !draftPlan ||
            !shouldEscalateStudioInstruction(request.instruction, draftPlan)
          ) {
            return jsonResponse(fallbackPayload, 200);
          }
          const plan = await withTimeout(
            planStudioChangeWithWorkersAi({
              ai: env.AI,
              instruction: request.instruction,
              context,
              draftPlan,
              env,
            }),
          );
          const result = applyStudioChangePlan(context, plan);
          result.spec.metadata.source = "ai";
          return jsonResponse(
            {
              spec: parseDesignSpec(result.spec),
              plan,
              summary: plan.summary,
              unsupported: plan.unsupported,
              changed: result.changed,
              source: "ai",
            },
            200,
          );
        }
        const terms = extractPromptTerms(request.prompt);
        const candidate = planCreativeBlueprint(request.prompt);
        const patch = await withTimeout(
          planCreativeBlueprintWithWorkersAi({
            ai: env.AI,
            visitorText: request.prompt,
            candidate,
            env,
          }),
        );
        const blueprint = applyBlueprintPatch(candidate, patch);
        const refined = blueprintToDesignSpec(blueprint, terms);
        refined.metadata.source = "ai";
        return jsonResponse(
          { spec: parseDesignSpec(refined), source: "ai" },
          200,
        );
      } catch {
        return jsonResponse(fallbackPayload, 200);
      }
    } finally {
      guard.leave();
    }
  };
}

export const handleStudioBuild = createStudioBuildHandler();
