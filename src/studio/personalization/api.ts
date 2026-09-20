import { createCloudflareWorkersAiProvider } from "./cloudflare-provider";
import type { WorkersAiBinding } from "./cloudflare-provider";
import {
  STUDIO_PERSONALIZATION_MAX_REQUEST_BYTES,
  STUDIO_PERSONALIZATION_TIMEOUT_MS,
  studioPersonalizationRequestSchema,
} from "./schema";
import {
  personalizeStudioConcept,
  type StudioPersonalizationProvider,
} from "./provider";

export type StudioPersonalizationEnv = {
  AI?: WorkersAiBinding;
};

type NitroCloudflareRequest = Request & {
  runtime?: {
    cloudflare?: {
      env?: StudioPersonalizationEnv;
    };
  };
};

export function resolveStudioPersonalizationEnv(
  request: Request,
  directEnv?: StudioPersonalizationEnv,
): StudioPersonalizationEnv | undefined {
  return (
    directEnv ?? (request as NitroCloudflareRequest).runtime?.cloudflare?.env
  );
}

type RequestGuard = {
  enter(): boolean;
  leave(): void;
};

const sharedRequestGuard = (() => {
  let activeRequests = 0;
  let recentRequests: number[] = [];

  return {
    enter() {
      const now = Date.now();
      recentRequests = recentRequests.filter(
        (timestamp) => now - timestamp < 60_000,
      );
      if (activeRequests >= 4 || recentRequests.length >= 30) return false;
      activeRequests += 1;
      recentRequests.push(now);
      return true;
    },
    leave() {
      activeRequests = Math.max(0, activeRequests - 1);
    },
  } satisfies RequestGuard;
})();

class RequestBodyTooLargeError extends Error {}

function jsonResponse(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'",
    },
  });
}

async function readBoundedBody(request: Request): Promise<string> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (
    Number.isFinite(contentLength) &&
    contentLength > STUDIO_PERSONALIZATION_MAX_REQUEST_BYTES
  ) {
    throw new RequestBodyTooLargeError();
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > STUDIO_PERSONALIZATION_MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("Studio personalization timed out.")),
      STUDIO_PERSONALIZATION_TIMEOUT_MS,
    );
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function isQuotaOrRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as {
    status?: unknown;
    statusCode?: unknown;
    code?: unknown;
  };
  return [candidate.status, candidate.statusCode, candidate.code].some(
    (value) => value === 429 || value === "429",
  );
}

export function createStudioPersonalizationHandler(options?: {
  provider?: StudioPersonalizationProvider;
  guard?: RequestGuard;
}) {
  return async function handleStudioPersonalization(
    request: Request,
    env?: StudioPersonalizationEnv,
  ): Promise<Response> {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
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
      if (error instanceof RequestBodyTooLargeError) {
        return jsonResponse({ error: "Request is too large." }, 413);
      }
      return jsonResponse({ error: "Request could not be read." }, 400);
    }

    let json: unknown;
    try {
      json = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: "Request JSON is invalid." }, 400);
    }

    const parsedInput = studioPersonalizationRequestSchema.safeParse(json);
    if (!parsedInput.success) {
      return jsonResponse(
        {
          error:
            parsedInput.error.issues[0]?.message ??
            "Check the information and try again.",
        },
        400,
      );
    }

    const guard = options?.guard ?? sharedRequestGuard;
    if (!guard.enter()) {
      return jsonResponse(
        {
          error: "Personalization is busy right now. Please try again shortly.",
        },
        429,
      );
    }

    try {
      const provider =
        options?.provider ??
        (env?.AI ? createCloudflareWorkersAiProvider(env.AI) : null);

      if (!provider) {
        return jsonResponse(
          {
            error:
              "Personalization isn't available right now. Your selected concept is still ready.",
          },
          503,
        );
      }

      try {
        const personalization = await withTimeout(
          personalizeStudioConcept(provider, parsedInput.data),
        );
        return jsonResponse({ personalization }, 200);
      } catch (error) {
        if (isQuotaOrRateLimitError(error)) {
          return jsonResponse(
            {
              error:
                "Personalization is busy right now. Your selected concept is still ready.",
            },
            429,
          );
        }

        return jsonResponse(
          {
            error:
              "Personalization isn't available right now. Your selected concept is still ready.",
          },
          502,
        );
      }
    } finally {
      guard.leave();
    }
  };
}

export const handleStudioPersonalization = createStudioPersonalizationHandler();
