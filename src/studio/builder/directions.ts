import {
  applyBlueprintPatch,
  blueprintToDesignSpec,
  planCreativeBlueprint,
  varyBlueprint,
  type CreativeBlueprint,
  type CreativeBlueprintPatch,
} from "./blueprint";
import { designDnaFromBlueprint, type DesignDNA } from "./design-dna";
import type { DesignSpec } from "./domain";
import { planSitePages } from "./site-pages";

/**
 * Three creative directions.
 *
 * After Studio understands the business it must propose genuinely different
 * design directions — not three colour schemes. Each direction is a complete
 * blueprint: a different hero family, composition system, typography character,
 * density, section rhythm, art direction, navigation treatment, decorative
 * geometry, motion character and page layout.
 *
 * Direction 0 is the category's signature reading of the business, so it is
 * always a legitimate answer. Directions 1 and 2 are deliberate departures
 * built by patching named axes rather than by randomising.
 *
 * If the AI provider is unavailable nothing changes: these directions are
 * deterministic and are exactly what the visitor sees.
 */

export const CREATIVE_DIRECTION_VERSION = 1 as const;

export type CreativeDirection = {
  id: string;
  /** 1-based position shown to the visitor as "01". */
  index: number;
  name: string;
  summary: string;
  /** Customer-language chips, e.g. "Immersive hero", "Tight rhythm". */
  character: string[];
  blueprint: CreativeBlueprint;
  dna: DesignDNA;
  pages: string[];
};

/**
 * Creative names per business category.
 *
 * Names are the business's own language — a jeweller gets atelier vocabulary, a
 * construction firm gets engineering vocabulary. Nothing is shared universally,
 * and a visitor never sees a schema term.
 */
const directionNames: Record<string, readonly [string, string, string]> = {
  jewellery: ["Editorial Atelier", "Immersive Vitrine", "Heritage Gilt"],
  fashion: ["Editorial Look", "Immersive Commerce", "Bold Street Energy"],
  retail: ["Shopfront Editorial", "Immersive Commerce", "Bold Local Energy"],
  supplements: ["Clinical Precision", "Immersive Commerce", "Everyday Clarity"],
  healthcare: ["Calm Authority", "Reassuring Warmth", "Clinical Precision"],
  wellness: ["Serene Ritual", "Immersive Sanctuary", "Warm Welcome"],
  beauty: ["Editorial Beauty", "Immersive Glow", "Fresh Modern"],
  fitness: ["Bold Performance", "Immersive Energy", "Precision Training"],
  hospitality: ["Cinematic Escape", "Editorial Retreat", "Warm Welcome"],
  travel: ["Cinematic Journey", "Editorial Atlas", "Immersive Discovery"],
  food: ["Editorial Table", "Warm Kitchen Story", "Evening Atmosphere"],
  construction: [
    "Engineered Trust",
    "Terrain Documentary",
    "Bold Local Energy",
  ],
  professional: [
    "Editorial Precision",
    "Assured Authority",
    "Clear Practicality",
  ],
  technology: ["Precision Systems", "Immersive Product", "Technical Editorial"],
  creative: ["Editorial Portfolio", "Immersive Studio", "Expressive Poster"],
  education: ["Clear Structure", "Warm Campus Story", "Modern Academic"],
  realestate: [
    "Architectural Editorial",
    "Immersive Space",
    "Considered Practicality",
  ],
  automotive: ["Engineering Focus", "Immersive Showroom", "Bold Performance"],
  events: ["Editorial Occasion", "Immersive Celebration", "Bold Energy"],
  logistics: ["Precision Network", "Technical Editorial", "Assured Authority"],
  nonprofit: ["Human Story", "Documentary Truth", "Clear Purpose"],
  agriculture: ["Grounded Provenance", "Field Documentary", "Earthly Warmth"],
  personal: ["Editorial Portrait", "Immersive Personal", "Bold Statement"],
  generic: ["Editorial Precision", "Immersive Story", "Bold Energy"],
};

/** Art direction pools: direction 1 is atmospheric, direction 2 structural. */
const atmosphericArt: CreativeBlueprint["hero"]["artDirection"][] = [
  "light-shafts",
  "organic-halo",
  "grain-field",
  "gradient-field",
  "layered-surfaces",
];
const structuralArt: CreativeBlueprint["hero"]["artDirection"][] = [
  "grid-technical",
  "monolith",
  "geometric-composition",
  "typographic-art",
  "editorial-rule",
];

/**
 * Axis patches for the two departures.
 *
 * Direction 1 opens the site up: a wider, more immersive composition with a
 * cinematic hero, more air and stronger contrast.
 *
 * Direction 2 tightens and declaims: a poster-like layout, a heavier type
 * character, denser rhythm, defined geometry and a bolder accent.
 */
const departurePatches: readonly [
  CreativeBlueprintPatch,
  CreativeBlueprintPatch,
] = [
  {
    direction: {
      intensity: "expressive",
      balance: "editorial",
      density: "sparse",
      whitespace: "spacious",
      layering: "overlap",
      surface: "layered",
      shape: "soft",
    },
    layout: {
      composition: "full-bleed-immersive",
      container: "edge-to-edge",
      symmetry: "asymmetric",
      rhythm: "spacious",
      density: "sparse",
      viewportUse: "full",
    },
    colour: {
      environment: "dark",
      contrast: "bold",
      accent: "single",
      surfaces: "glow",
    },
    motion: { family: "cinematic", intensity: "expressive" },
  },
  {
    direction: {
      intensity: "dramatic",
      balance: "commercial",
      density: "rich",
      whitespace: "tight",
      layering: "flat",
      surface: "matte",
      shape: "sharp",
    },
    layout: {
      composition: "poster-stack",
      container: "wide",
      symmetry: "symmetric",
      rhythm: "cadenced",
      density: "rich",
      viewportUse: "balanced",
      alignment: "center",
    },
    colour: {
      environment: "light",
      contrast: "bold",
      accent: "dual",
      surfaces: "flat",
    },
    motion: { family: "playful", intensity: "medium" },
  },
];

/** Direction 1 opens the hero up; direction 2 declaims it. */
const heroFor = (
  base: CreativeBlueprint["hero"]["family"],
  blueprint: CreativeBlueprint,
  index: number,
): CreativeBlueprint["hero"]["family"] => {
  if (index === 0) return base;
  const order: CreativeBlueprint["hero"]["family"][] = [
    "immersive-viewport",
    "cinematic-media",
    "hospitality-image-led",
    "layered-spatial",
    "editorial-typography",
  ];
  const posterOrder: CreativeBlueprint["hero"]["family"][] = [
    "poster-brutalist",
    "technical-grid",
    "centered-luxury",
    "commerce-product",
    "split-composition",
  ];
  const pool = index === 1 ? order : posterOrder;
  const candidates = pool.filter(
    (family) => family !== base && blueprint.hero.family !== family,
  );
  return candidates[0] ?? base;
};

/** Typography character per departure: direction 1 softens, direction 2 sharpens. */
const typeFor = (
  base: CreativeBlueprint["typography"]["display"],
  index: number,
): CreativeBlueprint["typography"]["display"] => {
  if (index === 0) return base;
  const softened: CreativeBlueprint["typography"]["display"][] = [
    "humanist-warm",
    "editorial-serif",
    "grotesk-modern",
  ];
  const sharpened: CreativeBlueprint["typography"]["display"][] = [
    "condensed-poster",
    "geometric-technical",
    "expressive-display",
  ];
  const pool = index === 1 ? softened : sharpened;
  return pool.find((entry) => entry !== base) ?? base;
};

function nameFor(category: string, index: number): string {
  const names = directionNames[category] ?? directionNames["generic"]!;
  return names[Math.min(index, names.length - 1)]!;
}

function summaryFor(
  blueprint: CreativeBlueprint,
  dna: DesignDNA,
  pageCount: number,
  index: number,
): string {
  const pages =
    pageCount === 1 ? "a single-page concept" : `${pageCount} pages`;
  const framing =
    index === 0
      ? "The most direct reading of the business"
      : index === 1
        ? "A more open, cinematic reading"
        : "A tighter, more declarative reading";
  return `${framing} — ${dna.composition.family.replaceAll("-", " ")}, ${dna.typography.display.replaceAll("-", " ")} and ${describeMotion(dna)} across ${pages}.`;
}

function describeMotion(dna: DesignDNA): string {
  switch (dna.motion.level) {
    case "none":
      return "no motion";
    case "subtle":
      return "subtle motion";
    case "premium":
      return "premium motion";
    default:
      return "cinematic motion";
  }
}

const motionChip: Record<DesignDNA["motion"]["level"], string> = {
  none: "Still",
  subtle: "Subtle motion",
  premium: "Premium motion",
  cinematic: "Cinematic motion",
};

const densityChip: Record<string, string> = {
  sparse: "Airy layout",
  measured: "Balanced layout",
  rich: "Dense layout",
};

function characterChips(dna: DesignDNA): string[] {
  return [
    `${titleCase(dna.hero.family)} hero`,
    titleCase(dna.composition.family) + " composition",
    densityChip[dna.spacing.density] ?? "Balanced layout",
    `${titleCase(dna.typography.display)} type`,
    motionChip[dna.motion.level],
    `${titleCase(dna.background.geometry)} geometry`,
  ];
}

function titleCase(value: string): string {
  return value
    .split("-")
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(" ");
}

/** Builds one direction: base blueprint + axis patch + hero/type character. */
function buildDirection(
  base: CreativeBlueprint,
  index: number,
  prompt: string,
): CreativeDirection {
  const variation = index;
  const basePlan = variation === 0 ? base : varyBlueprint(base, variation);
  const patched =
    variation === 0
      ? basePlan
      : applyBlueprintPatch(basePlan, departurePatches[variation - 1]!);
  const artPool = variation === 1 ? atmosphericArt : structuralArt;
  const withHero = applyBlueprintPatch(patched, {
    hero: {
      family: heroFor(patched.hero.family, base, variation),
      height:
        variation === 0
          ? patched.hero.height
          : variation === 1
            ? "viewport"
            : "compact",
      typographyPlacement:
        variation === 0
          ? patched.hero.typographyPlacement
          : variation === 1
            ? "overlay"
            : "offset",
      artDirection:
        variation === 0
          ? patched.hero.artDirection
          : (artPool.find((entry) => entry !== base.hero.artDirection) ??
            base.hero.artDirection),
      media:
        variation === 0
          ? patched.hero.media
          : variation === 1
            ? "panoramic-field"
            : "grid-panel",
    },
    typography: {
      display: typeFor(patched.typography.display, variation),
      body: typeFor(patched.typography.body, variation),
      scale:
        variation === 0
          ? patched.typography.scale
          : variation === 1
            ? "balanced"
            : "dramatic",
      contrast: variation === 0 ? patched.typography.contrast : "high",
    },
  });
  const dna = designDnaFromBlueprint(withHero);
  const pages = planSitePages({
    category: withHero.business.category,
    prompt,
    variation,
  }).map((page) => page.slug);
  return {
    id: `direction-${index + 1}`,
    index: index + 1,
    name: nameFor(withHero.business.category, index),
    summary: summaryFor(withHero, dna, pages.length + 1, index),
    character: characterChips(dna).slice(0, 6),
    blueprint: withHero,
    dna,
    pages: ["/", ...pages],
  };
}

/**
 * The three directions for a business. Deterministic: the same description
 * always yields the same three proposals.
 */
export function planCreativeDirections(prompt: string): CreativeDirection[] {
  const base = planCreativeBlueprint(prompt, { variation: 0 });
  return [0, 1, 2].map((index) => buildDirection(base, index, prompt));
}

/**
 * "Show me another direction" — extends the sequence beyond the first three,
 * still deterministic and still a genuine departure rather than a recolour.
 */
export function planAdditionalDirection(
  prompt: string,
  offset: number,
): CreativeDirection {
  const base = planCreativeBlueprint(prompt, { variation: 0 });
  const index = Math.max(3, Math.min(9, 3 + offset));
  const next = buildDirection(base, index % 3 === 0 ? 1 : 2, prompt);
  const rotated = varyBlueprint(next.blueprint, index);
  const dna = designDnaFromBlueprint(rotated);
  return {
    ...next,
    id: `direction-${index + 1}`,
    index: index + 1,
    name: `${next.name} ${String(index + 1).padStart(2, "0")}`,
    summary: summaryFor(rotated, dna, next.pages.length, index % 3),
    blueprint: rotated,
    dna,
  };
}

/** The exact site spec for a direction, so the visitor can preview it. */
export function directionDesignSpec(direction: CreativeDirection): DesignSpec {
  return blueprintToDesignSpec(direction.blueprint, undefined, {
    variation: Math.max(0, direction.index - 1),
  });
}
