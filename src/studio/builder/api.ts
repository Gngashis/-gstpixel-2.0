import { z } from "zod";
import type { WorkersAiBinding } from "../personalization/cloudflare-provider";
import {
  planCreativeBlueprintWithWorkersAi,
  planStudioChangeWithWorkersAi,
} from "./cloudflare-provider";
import {
  planCreativeBlueprintWithNvidia,
  resolveNvidiaRuntime,
} from "./nvidia-provider";
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
  NVIDIA_API_KEY?: string;
  NVIDIA_MODEL?: string;
  NVIDIA_BASE_URL?: string;
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

/**
 * Map schema failures to stable product-facing errors. Raw library messages
 * ("String must contain at least 10 character(s)") must never reach visitors.
 */
function friendlyValidationError(error: z.ZodError): {
  error: string;
  code: string;
} {
  const issue = error.issues[0];
  const field = issue?.path.join(".") ?? "";
  const message = issue?.message ?? "";
  if (field === "prompt" || field === "instruction") {
    if (/at least/i.test(message)) {
      return {
        error: "Please describe the website in a little more detail.",
        code: "PROMPT_TOO_SHORT",
      };
    }
    if (/at most|too big|too_big/i.test(message)) {
      return {
        error: "That description is a little too long. Please shorten it.",
        code: "PROMPT_TOO_LONG",
      };
    }
    if (/unsupported content/i.test(message)) {
      return {
        error: "Please remove any code or unsupported characters and try again.",
        code: "PROMPT_UNSUPPORTED",
      };
    }
  }
  return {
    error: "Check the request and try again.",
    code: "REQUEST_INVALID",
  };
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
      return jsonResponse(friendlyValidationError(parsed.error), 400);
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
              notes: result.notes,
              changed: result.changed,
              source: "fallback" as const,
            };
          })()
        : { spec: fallback, source: "fallback" as const };

    if (!guard.enter()) return jsonResponse(fallbackPayload, 200);
    try {
      const request = parsed.data;
      if (request.action === "modify") {
        const context = changeContext;
        const draftPlan = fallbackPlan;
        if (!env?.AI) return jsonResponse(fallbackPayload, 200);
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
              notes: result.notes,
              changed: result.changed,
              source: "ai",
            },
            200,
          );
        }
        const terms = extractPromptTerms(request.prompt);
        const candidate = planCreativeBlueprint(request.prompt);

        // 1. NVIDIA NIM — optional server-side intelligence. Any failure is
        //    discarded and we fall through to Cloudflare AI, then the
        //    deterministic planner. Generation can never break.
        const nvidia = resolveNvidiaRuntime(env);
        if (nvidia.configured) {
          try {
            const patch = await withTimeout(
              planCreativeBlueprintWithNvidia({
                visitorText: request.prompt,
                candidate,
                apiKey: nvidia.apiKey as string,
                model: nvidia.model,
                baseUrl: nvidia.baseUrl,
              }),
            );
            const blueprint = applyBlueprintPatch(candidate, patch);
            const refined = blueprintToDesignSpec(blueprint, terms);
            refined.metadata.source = "nvidia";
            return jsonResponse(
              { spec: parseDesignSpec(refined), source: "nvidia" },
              200,
            );
          } catch (error) {
            // Safe operational signal only: failure class, never prompt text.
            console.warn(
              "[studio] nvidia provider failed",
              error instanceof Error ? error.name : "unknown",
            );
            // fall through to Cloudflare Workers AI, then fallback
          }
        }

        // 2. Existing Cloudflare Workers AI provider.
        if (env?.AI) {
          try {
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
          } catch (error) {
            console.warn(
              "[studio] cloudflare provider failed",
              error instanceof Error ? error.name : "unknown",
            );
            return jsonResponse(fallbackPayload, 200);
          }
        }

        // 3. Deterministic engine always remains.
        return jsonResponse(fallbackPayload, 200);
      } catch {
        return jsonResponse(fallbackPayload, 200);
      }
    finally {
      guard.leave();
    }
  };
}

export const handleStudioBuild = createStudioBuildHandler();
