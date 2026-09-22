/**
 * Studio AI runtime configuration.
 *
 * The provider and model are configurable so the creative director can move
 * between Workers AI models without touching the Studio architecture.
 *
 *   STUDIO_AI_PROVIDER=cloudflare
 *   STUDIO_AI_MODEL=@cf/nvidia/nemotron-3-120b-a12b
 *
 * No credential ever reaches the client: inference happens on the server
 * through the Cloudflare Workers AI binding. When the binding is missing,
 * the model is unavailable, the free allowance is exhausted, the request is
 * rate-limited, the call times out or the response fails schema validation,
 * Studio silently falls back to the deterministic planner.
 */

export const STUDIO_AI_PROVIDER_DEFAULT = "cloudflare" as const;

/** Preferred free-plan candidate. */
export const STUDIO_AI_MODEL_DEFAULT =
  "@cf/meta/llama-3.1-8b-instruct" as const;

/** Used only if a deployment explicitly overrides the default. */
export const STUDIO_AI_MODEL_ALTERNATES = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/qwen/qwen2.5-coder-32b-instruct",
  "@cf/zai-org/glm-4.7-flash",
] as const;

export type StudioAiRuntime = {
  provider: string;
  model: string;
  /** Environment variable names accepted for each field, for documentation. */
  configurable: string[];
};

function envValue(
  env: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  const fromEnv = env?.[key];
  if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  if (typeof process !== "undefined" && process.env) {
    const fromProcess = process.env[key];
    if (typeof fromProcess === "string" && fromProcess.trim())
      return fromProcess.trim();
  }
  return undefined;
}

export function resolveStudioAiRuntime(
  env?: Record<string, unknown>,
): StudioAiRuntime {
  return {
    provider: envValue(env, "STUDIO_AI_PROVIDER") ?? STUDIO_AI_PROVIDER_DEFAULT,
    model: envValue(env, "STUDIO_AI_MODEL") ?? STUDIO_AI_MODEL_DEFAULT,
    configurable: ["STUDIO_AI_PROVIDER", "STUDIO_AI_MODEL"],
  };
}
