/**
 * Stable identifiers for the premium template registry.
 *
 * Kept in a leaf module so both the CreativeBlueprint schema (allowlist) and
 * the registry can import the ids without a circular dependency. These ids are
 * internal metadata only — they are never presented to visitors.
 */
export const templateIds = [
  "cinematic-dark",
  "editorial-luxury",
  "architectural-minimal",
  "immersive-media",
  "bold-poster",
  "premium-commerce",
  "energetic-performance",
  "warm-hospitality",
  "modern-professional",
  "clinical-trust",
  "fashion-editorial",
  "creative-portfolio",
  "technology-future",
  "brutalist-contemporary",
  "soft-premium",
  "local-modern",
  "high-contrast-monochrome",
  "elegant-serif",
  "motion-first-showcase",
  "clean-conversion",
] as const;

export type TemplateId = (typeof templateIds)[number];
