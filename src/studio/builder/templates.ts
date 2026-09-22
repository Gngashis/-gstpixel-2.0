/**
 * Premium template showroom — curated master design systems.
 *
 * The registry formalises the pivot: instead of the AI inventing every pixel
 * from a generic renderer, the Studio matches a curated premium design family
 * (a "master") to the business, applies that master's allowlisted visual
 * overrides on top of the safe deterministic blueprint, and lets the AI
 * customise content, colour, motion and structure on top.
 *
 * A master is data, not code: overrides use only allowlisted
 * CreativeBlueprintPatch values, so a master can never emit unsafe structure.
 * 20 masters × 5 curated blueprint variations ≈ 100 selectable experiences.
 */

import type { BusinessCategory, CreativeBlueprintPatch } from "./blueprint";
import {
  applyBlueprintPatch,
  blueprintToDesignSpec,
  extractPromptTerms,
  planCreativeBlueprint,
} from "./blueprint";
import type { MotionLevel } from "./design-dna";
import { templateIds, type TemplateId } from "./template-ids";

export const TEMPLATE_VARIANTS_PER_MASTER = 5;

export type TemplateMaster = {
  id: TemplateId;
  /** Internal label only — never shown to visitors. */
  label: string;
  affinities: BusinessCategory[];
  tags: string[];
  premium: "approachable" | "refined" | "luxury";
  motion: MotionLevel;
  mediaIntensity: "low" | "medium" | "high";
  overrides: CreativeBlueprintPatch;
};

export const templateMasters: TemplateMaster[] = [
  {
    id: "cinematic-dark",
    label: "Cinematic Dark",
    affinities: ["hospitality", "travel", "food", "fitness"],
    tags: ["dark", "cinematic", "immersive", "dramatic", "animated"],
    premium: "luxury",
    motion: "cinematic",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "dramatic", premium: "luxury", density: "measured" },
      typography: { display: "editorial-serif", body: "grotesk-modern" },
      colour: { palette: "midnight-champagne", environment: "dark" },
      hero: { family: "cinematic-media", height: "viewport" },
      motion: { family: "cinematic", intensity: "expressive" },
    },
  },
  {
    id: "editorial-luxury",
    label: "Editorial Luxury",
    affinities: ["hospitality", "fashion", "professional", "wellness"],
    tags: ["luxury", "editorial", "elegant", "serif", "minimal"],
    premium: "luxury",
    motion: "premium",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "considered", premium: "luxury", density: "sparse" },
      typography: { display: "editorial-serif", body: "humanist-warm" },
      colour: { palette: "paper-ink", environment: "light" },
      hero: { family: "editorial-typography", height: "balanced" },
      motion: { family: "luxury", intensity: "subtle" },
    },
  },
  {
    id: "architectural-minimal",
    label: "Architectural Minimal",
    affinities: ["construction", "realestate", "professional"],
    tags: ["architectural", "minimal", "structural", "sharp"],
    premium: "refined",
    motion: "subtle",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "restrained", premium: "refined", density: "sparse" },
      typography: { display: "geometric-technical", body: "grotesk-modern" },
      colour: { palette: "charcoal-amber", environment: "light" },
      hero: { family: "asymmetric-story", height: "balanced" },
      motion: { family: "technical", intensity: "subtle" },
      cta: { character: "consultation" },
    },
  },
  {
    id: "immersive-media",
    label: "Immersive Media",
    affinities: ["travel", "hospitality", "creative"],
    tags: ["immersive", "media", "cinematic", "travel"],
    premium: "refined",
    motion: "cinematic",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "expressive", premium: "refined", density: "rich" },
      typography: { display: "expressive-display", body: "grotesk-modern" },
      colour: { palette: "cobalt-cream", environment: "light" },
      hero: { family: "immersive-viewport", height: "viewport" },
      motion: { family: "cinematic", intensity: "expressive" },
    },
  },
  {
    id: "bold-poster",
    label: "Bold Poster",
    affinities: ["fashion", "creative", "fitness"],
    tags: ["bold", "poster", "expressive", "kinetic"],
    premium: "refined",
    motion: "premium",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "dramatic", premium: "refined", density: "rich" },
      typography: { display: "condensed-poster", body: "grotesk-modern" },
      colour: { palette: "graphite-lime", environment: "dark" },
      hero: { family: "poster-brutalist", height: "viewport" },
      motion: { family: "playful", intensity: "expressive" },
    },
  },
  {
    id: "premium-commerce",
    label: "Premium Commerce",
    affinities: ["retail", "fashion", "supplements", "jewellery"],
    tags: ["commerce", "premium", "product", "clean"],
    premium: "refined",
    motion: "subtle",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "considered", premium: "refined", density: "measured" },
      typography: { display: "grotesk-modern", body: "humanist-warm" },
      colour: { palette: "paper-ink", environment: "light" },
      hero: { family: "commerce-product", height: "balanced" },
      motion: { family: "quiet", intensity: "subtle" },
      cta: { character: "purchase" },
    },
  },
  {
    id: "energetic-performance",
    label: "Energetic Performance",
    affinities: ["fitness", "food"],
    tags: ["dark", "energetic", "kinetic", "bold", "performance"],
    premium: "refined",
    motion: "cinematic",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "dramatic", premium: "refined", density: "rich" },
      typography: { display: "condensed-poster", body: "grotesk-modern" },
      colour: { palette: "midnight-champagne", environment: "dark" },
      hero: { family: "cinematic-media", height: "viewport" },
      motion: { family: "cinematic", intensity: "expressive" },
    },
  },
  {
    id: "warm-hospitality",
    label: "Warm Hospitality",
    affinities: ["food", "hospitality", "retail"],
    tags: ["warm", "hospitality", "friendly", "local"],
    premium: "approachable",
    motion: "premium",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "considered", premium: "approachable", density: "measured" },
      typography: { display: "expressive-display", body: "humanist-warm" },
      colour: { palette: "ivory-terracotta", environment: "light" },
      hero: { family: "split-composition", height: "immersive" },
      motion: { family: "editorial", intensity: "medium" },
    },
  },
  {
    id: "modern-professional",
    label: "Modern Professional",
    affinities: ["professional", "technology", "education", "realestate", "logistics"],
    tags: ["clean", "professional", "modern", "corporate"],
    premium: "refined",
    motion: "subtle",
    mediaIntensity: "low",
    overrides: {
      direction: { intensity: "restrained", premium: "refined", density: "measured" },
      typography: { display: "grotesk-modern", body: "humanist-warm" },
      colour: { palette: "cobalt-cream", environment: "light" },
      hero: { family: "split-composition", height: "balanced" },
      motion: { family: "quiet", intensity: "subtle" },
    },
  },
  {
    id: "clinical-trust",
    label: "Clinical Trust",
    affinities: ["healthcare", "wellness", "beauty"],
    tags: ["trust", "clean", "clinical", "calm"],
    premium: "refined",
    motion: "subtle",
    mediaIntensity: "low",
    overrides: {
      direction: { intensity: "restrained", premium: "refined", density: "sparse" },
      typography: { display: "humanist-warm", body: "grotesk-modern" },
      colour: { palette: "paper-ink", environment: "light" },
      hero: { family: "editorial-typography", height: "balanced" },
      motion: { family: "quiet", intensity: "subtle" },
      cta: { character: "booking" },
    },
  },
  {
    id: "fashion-editorial",
    label: "Fashion Editorial",
    affinities: ["fashion", "retail"],
    tags: ["editorial", "fashion", "expressive", "elegant"],
    premium: "luxury",
    motion: "premium",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "expressive", premium: "luxury", density: "sparse" },
      typography: { display: "expressive-display", body: "editorial-serif" },
      colour: { palette: "midnight-champagne", environment: "light" },
      hero: { family: "editorial-typography", height: "viewport" },
      motion: { family: "luxury", intensity: "medium" },
    },
  },
  {
    id: "creative-portfolio",
    label: "Creative Portfolio",
    affinities: ["creative"],
    tags: ["portfolio", "gallery", "editorial", "creative"],
    premium: "refined",
    motion: "premium",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "expressive", premium: "refined", density: "sparse" },
      typography: { display: "condensed-poster", body: "grotesk-modern" },
      colour: { palette: "clay-indigo", environment: "dark" },
      hero: { family: "layered-spatial", height: "viewport" },
      motion: { family: "editorial", intensity: "medium" },
    },
  },
  {
    id: "technology-future",
    label: "Technology Future",
    affinities: ["technology"],
    tags: ["future", "technical", "dark", "grid"],
    premium: "refined",
    motion: "premium",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "restrained", premium: "refined", density: "measured" },
      typography: { display: "mono-technical", body: "geometric-technical" },
      colour: { palette: "graphite-lime", environment: "dark" },
      hero: { family: "technical-grid", height: "immersive" },
      motion: { family: "technical", intensity: "medium" },
    },
  },
  {
    id: "brutalist-contemporary",
    label: "Brutalist Contemporary",
    affinities: ["construction", "creative", "technology"],
    tags: ["brutalist", "sharp", "contemporary", "structural"],
    premium: "refined",
    motion: "premium",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "dramatic", premium: "refined", density: "rich" },
      typography: { display: "geometric-technical", body: "mono-technical" },
      colour: { palette: "paper-ink", environment: "light" },
      hero: { family: "poster-brutalist", height: "viewport" },
      motion: { family: "technical", intensity: "medium" },
      cta: { character: "direct" },
    },
  },
  {
    id: "soft-premium",
    label: "Soft Premium",
    affinities: ["wellness", "fashion", "education", "faith"],
    tags: ["soft", "premium", "calm", "elegant"],
    premium: "luxury",
    motion: "premium",
    mediaIntensity: "low",
    overrides: {
      direction: { intensity: "considered", premium: "luxury", density: "sparse" },
      typography: { display: "humanist-warm", body: "editorial-serif" },
      colour: { palette: "sand-olive", environment: "tinted" },
      hero: { family: "centered-luxury", height: "balanced" },
      motion: { family: "luxury", intensity: "subtle" },
    },
  },
  {
    id: "local-modern",
    label: "Local Modern",
    affinities: ["retail", "food", "personal"],
    tags: ["local", "clean", "friendly", "modern"],
    premium: "approachable",
    motion: "subtle",
    mediaIntensity: "low",
    overrides: {
      direction: { intensity: "considered", premium: "approachable", density: "measured" },
      typography: { display: "grotesk-modern", body: "humanist-warm" },
      colour: { palette: "paper-ink", environment: "light" },
      hero: { family: "commerce-product", height: "balanced" },
      motion: { family: "quiet", intensity: "subtle" },
    },
  },
  {
    id: "high-contrast-monochrome",
    label: "High-Contrast Monochrome",
    affinities: ["technology", "creative", "professional"],
    tags: ["monochrome", "high-contrast", "minimal"],
    premium: "refined",
    motion: "subtle",
    mediaIntensity: "medium",
    overrides: {
      direction: { intensity: "dramatic", premium: "refined", density: "sparse" },
      typography: { display: "grotesk-modern", body: "mono-technical" },
      colour: { palette: "paper-ink", environment: "light" },
      hero: { family: "minimal-professional", height: "viewport" },
      motion: { family: "technical", intensity: "subtle" },
    },
  },
  {
    id: "elegant-serif",
    label: "Elegant Serif",
    affinities: ["professional", "education", "hospitality", "faith"],
    tags: ["elegant", "serif", "editorial", "classic"],
    premium: "refined",
    motion: "subtle",
    mediaIntensity: "low",
    overrides: {
      direction: { intensity: "considered", premium: "refined", density: "sparse" },
      typography: { display: "editorial-serif", body: "humanist-warm" },
      colour: { palette: "ivory-terracotta", environment: "light" },
      hero: { family: "editorial-typography", height: "balanced" },
      motion: { family: "editorial", intensity: "subtle" },
    },
  },
  {
    id: "motion-first-showcase",
    label: "Motion-First Showcase",
    affinities: ["creative", "fitness", "travel"],
    tags: ["motion", "showcase", "animated", "immersive"],
    premium: "refined",
    motion: "cinematic",
    mediaIntensity: "high",
    overrides: {
      direction: { intensity: "expressive", premium: "refined", density: "rich" },
      typography: { display: "expressive-display", body: "grotesk-modern" },
      colour: { palette: "plum-brass", environment: "dark" },
      hero: { family: "immersive-viewport", height: "viewport" },
      motion: { family: "cinematic", intensity: "expressive" },
    },
  },
  {
    id: "clean-conversion",
    label: "Clean Conversion",
    affinities: ["education", "professional", "faith", "nonprofit", "logistics"],
    tags: ["conversion", "clean", "minimal", "clear"],
    premium: "approachable",
    motion: "subtle",
    mediaIntensity: "low",
    overrides: {
      direction: { intensity: "restrained", premium: "approachable", density: "measured" },
      typography: { display: "grotesk-modern", body: "humanist-warm" },
      colour: { palette: "cobalt-cream", environment: "light" },
      hero: { family: "minimal-professional", height: "balanced" },
      motion: { family: "quiet", intensity: "subtle" },
      cta: { character: "direct" },
    },
  },
];

const masterById = new Map<TemplateId, TemplateMaster>(
  templateMasters.map((master) => [master.id, master]),
);

export function templateMasterById(id: TemplateId): TemplateMaster {
  return masterById.get(id) ?? templateMasters[0]!;
}

export type TemplateIntent = {
  category: BusinessCategory;
  prompt: string;
};

export type TemplateMatch = { master: TemplateMaster; score: number };

const styleSignals: ReadonlyArray<readonly [RegExp, string[]]> = [
  [/\b(dark|black|night|midnight)\b/, ["dark"]],
  [/\b(cinematic|film|movie)\b/, ["cinematic", "immersive", "animated"]],
  [/\b(animat(?:ed|ion)|motion|moving|kinetic)\b/, ["animated", "kinetic", "motion"]],
  [/\b(luxury|luxurious|high-?end|premium)\b/, ["luxury", "premium", "elegant"]],
  [/\b(elegant|editorial|serif)\b/, ["elegant", "editorial", "serif"]],
  [/\b(minimal|minimalist|clean|simple)\b/, ["minimal", "clean"]],
  [/\b(bold|energetic|dynamic|power)\b/, ["bold", "energetic", "kinetic"]],
  [/\b(warm|cozy|friendly)\b/, ["warm", "friendly", "local"]],
  [/\b(brutalist)\b/, ["brutalist", "sharp"]],
  [/\b(monochrome|black ?and ?white|b ?& ?w)\b/, ["monochrome", "high-contrast"]],
  [/\b(trust|clinic|medical|dental|doctor)\b/, ["trust", "clinical", "calm"]],
  [/\b(local|shop|store)\b/, ["local", "friendly"]],
  [/\b(modern|contemporary)\b/, ["modern", "contemporary"]],
  [/\b(performance|gym|fitness|workout)\b/, ["performance", "energetic", "dark"]],
];

/**
 * Score every master against the business intent and pick the best matches.
 * Affinity with the business category dominates; the visitor's style words
 * ("dark cinematic premium gym") then re-rank within the affinity group.
 */
export function matchTemplates(
  intent: TemplateIntent,
  limit = 20,
): TemplateMatch[] {
  const prompt = intent.prompt.toLowerCase();
  const scored: TemplateMatch[] = templateMasters.map((master) => {
    let score = 0;
    if (master.affinities.includes(intent.category)) score += 40;
    const tagSet = new Set(master.tags);
    for (const [pattern, tags] of styleSignals) {
      if (!pattern.test(prompt)) continue;
      for (const tag of tags) {
        if (tagSet.has(tag)) score += 12;
      }
    }
    if (/\b(luxury|luxurious|high-?end)\b/.test(prompt) && master.premium === "luxury") {
      score += 8;
    }
    if (/much animation|lots of animation/.test(prompt) && master.motion === "cinematic") {
      score += 10;
    }
    return { master, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, Math.max(1, limit));
}

export function generateShowroomSpec(
  prompt: string,
  options: { masterId?: TemplateId; variation?: number } = {},
): ReturnType<typeof blueprintToDesignSpec> {
  const variation = Math.max(0, Math.min(4, options.variation ?? 0));
  const terms = extractPromptTerms(prompt);
  const master = options.masterId
    ? templateMasterById(options.masterId)
    : (matchTemplates({ category: terms.category, prompt }, 1)[0]?.master ??
      templateMasters[0]!);

  const blueprint = planCreativeBlueprint(prompt, { variation });
  const directed = applyBlueprintPatch(blueprint, master.overrides);
  const spec = blueprintToDesignSpec(directed, terms);
  spec.metadata.template = { masterId: master.id, variantId: variation };
  spec.metadata.motionLevel = master.motion;
  return spec;
}
