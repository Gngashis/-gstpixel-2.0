import { z } from "zod";
import { studioExperienceModules } from "../catalog";
import type { StudioBusinessId } from "../types";

export const STUDIO_PERSONALIZATION_SCHEMA_VERSION = 1 as const;
export const STUDIO_PERSONALIZATION_MAX_REQUEST_BYTES = 2_048;
export const STUDIO_PERSONALIZATION_TIMEOUT_MS = 12_000;
export const STUDIO_PERSONALIZATION_CLIENT_TIMEOUT_MS = 14_000;
export const STUDIO_PERSONALIZATION_CLIENT_COOLDOWN_MS = 1_500;

const studioBusinessIds = [
  "hotel",
  "tours",
  "restaurant",
  "retail",
  "professional",
  "gym",
] as const;

const studioDirectionIds = ["cinematic", "refined", "bold"] as const;

const unsafeTextPatterns = [
  /<\/?[a-z][^>]*>/i,
  /\bjavascript\s*:/i,
  /\bdata\s*:\s*text\/html/i,
  /```/,
  /<\s*script\b/i,
  /\bon(?:error|load|click|mouseover)\s*=/i,
] as const;

const unsafeGeneratedTextPatterns = [
  /`/,
  /^\s*#{1,6}\s/m,
  /^\s*[-*+]\s+/m,
  /\[[^\]]+\]\([^)]+\)/,
  /\b(?:const|let|var|function|class)\s+[A-Za-z_$]/,
  /=>/,
  /\b(?:document|window)\s*\./i,
  /\b(?:eval|alert)\s*\(/i,
  /\b(?:https?|ftp):\/\//i,
  /\bwww\./i,
] as const;

function containsUnsafeText(value: string): boolean {
  return unsafeTextPatterns.some((pattern) => pattern.test(value));
}

function textLength(value: string): number {
  return Array.from(value).length;
}

function normalizedText(options: {
  min: number;
  max: number;
  label: string;
  generated?: boolean;
}) {
  return z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .refine(
          (value) => textLength(value) >= options.min,
          `${options.label} is too short.`,
        )
        .refine(
          (value) => textLength(value) <= options.max,
          `${options.label} is too long.`,
        )
        .refine(
          (value) =>
            !containsUnsafeText(value) &&
            (!options.generated ||
              !unsafeGeneratedTextPatterns.some((pattern) =>
                pattern.test(value),
              )),
          `${options.label} contains unsupported content.`,
        ),
    );
}

export const studioPersonalizationRequestSchema = z
  .object({
    category: z.enum(studioBusinessIds),
    direction: z.enum(studioDirectionIds),
    businessName: z
      .string()
      .transform((value) => value.replace(/\s+/g, " ").trim())
      .pipe(
        z
          .string()
          .refine(
            (value) => textLength(value) <= 80,
            "Business name must be 80 characters or fewer.",
          )
          .refine(
            (value) => !containsUnsafeText(value),
            "Business name contains unsupported content.",
          ),
      )
      .optional(),
    description: normalizedText({
      min: 20,
      max: 600,
      label: "Business description",
    }),
  })
  .strict();

const basePersonalizationSchema = z
  .object({
    schemaVersion: z.literal(STUDIO_PERSONALIZATION_SCHEMA_VERSION),
    headline: normalizedText({
      min: 1,
      max: 80,
      label: "Headline",
      generated: true,
    }),
    intro: normalizedText({
      min: 1,
      max: 220,
      label: "Introduction",
      generated: true,
    }),
    highlights: z
      .array(
        normalizedText({
          min: 1,
          max: 90,
          label: "Highlight",
          generated: true,
        }),
      )
      .min(1)
      .max(3),
    featuredModule: z.string().min(1).max(40),
    secondaryModule: z.string().min(1).max(40),
    ctaSupport: normalizedText({
      min: 1,
      max: 120,
      label: "CTA support",
      generated: true,
    }),
  })
  .strict();

export type StudioPersonalizationInput = z.infer<
  typeof studioPersonalizationRequestSchema
>;

export type StudioPersonalization = z.infer<typeof basePersonalizationSchema>;

export function getAllowedStudioModuleIds(
  category: StudioBusinessId,
): readonly string[] {
  return studioExperienceModules[category].sections.map(
    (section) => section.id,
  );
}

export function parseStudioPersonalization(
  category: StudioBusinessId,
  value: unknown,
): StudioPersonalization {
  const parsed = basePersonalizationSchema.parse(value);
  const allowedModules = getAllowedStudioModuleIds(category);

  if (!allowedModules.includes(parsed.featuredModule)) {
    throw new Error("Personalization featured module is not allowed.");
  }

  if (!allowedModules.includes(parsed.secondaryModule)) {
    throw new Error("Personalization secondary module is not allowed.");
  }

  if (parsed.featuredModule === parsed.secondaryModule) {
    throw new Error("Personalization modules must be distinct.");
  }

  return parsed;
}

export function formatPersonalizationValidationError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Check the information and try again.";
  }

  return "Check the information and try again.";
}
