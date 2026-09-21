import { z } from "zod";
import {
  DESIGN_SPEC_VERSION,
  designSpecSchema,
  paletteIds,
  sectionTypes,
  type DesignSection,
  type DesignSpec,
  type Mood,
  type PaletteId,
  type SectionType,
  type TypographyId,
} from "./domain";
import {
  buildSectionCopy,
  buildSiteCopy,
  profiles,
  type Profile,
} from "./blueprint-copy";
import {
  canonicalBusinessText,
  domainsInText,
  extractLocationPhrase,
} from "./language";

/**
 * CreativeBlueprint — the art-direction layer that sits between the visitor's
 * description and the DesignSpec.
 *
 * The blueprint reasons about the business first (category, audience, offer,
 * information priorities) and only then chooses composition families,
 * typography character, colour environment, navigation, hero family, section
 * sequence and motion. Two unrelated prompts therefore produce genuinely
 * different websites rather than one template with different colours.
 *
 * It contains no executable content: every field is an allowlisted enum or a
 * bounded string, and the deterministic renderer remains the safety boundary.
 */

export const CREATIVE_BLUEPRINT_VERSION = 1 as const;

export const businessCategories = [
  "hospitality",
  "travel",
  "food",
  "retail",
  "fashion",
  "jewellery",
  "supplements",
  "construction",
  "professional",
  "technology",
  "creative",
  "fitness",
  "wellness",
  "healthcare",
  "education",
  "realestate",
  "automotive",
  "beauty",
  "events",
  "logistics",
  "nonprofit",
  "agriculture",
  "personal",
  "generic",
] as const;

export const heroFamilies = [
  "editorial-typography",
  "cinematic-media",
  "split-composition",
  "asymmetric-story",
  "centered-luxury",
  "immersive-viewport",
  "technical-grid",
  "poster-brutalist",
  "hospitality-image-led",
  "commerce-product",
  "minimal-professional",
  "layered-spatial",
] as const;

export const navigationFamilies = [
  "minimal-centered",
  "editorial-split",
  "floating-capsule",
  "transparent-overlay",
  "compact-professional",
  "immersive-brand",
  "utility-bar",
] as const;

export const compositionFamilies = [
  "editorial-single-column",
  "asymmetric-grid",
  "modular-bento",
  "centered-symmetric",
  "full-bleed-immersive",
  "technical-grid",
  "poster-stack",
  "split-dual",
  "masonry-editorial",
  "index-driven",
] as const;

export const artDirections = [
  "gradient-field",
  "geometric-composition",
  "typographic-art",
  "layered-surfaces",
  "grid-technical",
  "framed-print",
  "grain-field",
  "monolith",
  "editorial-rule",
  "organic-halo",
  "light-shafts",
] as const;

export const motionFamilies = [
  "quiet",
  "editorial",
  "cinematic",
  "technical",
  "playful",
  "luxury",
] as const;

export const typographyCharacters = [
  "editorial-serif",
  "humanist-warm",
  "grotesk-modern",
  "geometric-technical",
  "mono-technical",
  "expressive-display",
  "condensed-poster",
] as const;

export const surfaceSystems = [
  "matte",
  "paper",
  "soft",
  "glass",
  "layered",
  "grain",
  "void",
] as const;

export const spacingRhythms = [
  "tight",
  "even",
  "spacious",
  "cadenced",
] as const;
export const visualIntensities = [
  "restrained",
  "considered",
  "expressive",
  "dramatic",
] as const;
export const contentDensities = ["sparse", "measured", "rich"] as const;
export const premiumLevels = ["approachable", "refined", "luxury"] as const;
export const shapeLanguages = ["sharp", "soft", "rounded", "organic"] as const;
export const ctaCharacters = [
  "direct",
  "concierge",
  "booking",
  "consultation",
  "enquiry",
  "purchase",
] as const;
export const mobileStrategies = [
  "condense",
  "feature-first",
  "type-first",
  "card-stack",
] as const;
export const sectionPurposes = [
  "introduce",
  "establish",
  "showcase",
  "explain",
  "prove",
  "convert",
  "inform",
  "invite",
  "orient",
] as const;

export type BusinessCategory = (typeof businessCategories)[number];
export type HeroFamily = (typeof heroFamilies)[number];
export type NavigationFamily = (typeof navigationFamilies)[number];
export type CompositionFamily = (typeof compositionFamilies)[number];
export type ArtDirection = (typeof artDirections)[number];
export type MotionFamily = (typeof motionFamilies)[number];
export type TypographyCharacter = (typeof typographyCharacters)[number];
export type SurfaceSystem = (typeof surfaceSystems)[number];
export type SpacingRhythm = (typeof spacingRhythms)[number];
export type VisualIntensity = (typeof visualIntensities)[number];
export type PremiumLevel = (typeof premiumLevels)[number];
export type ShapeLanguage = (typeof shapeLanguages)[number];
export type CtaCharacter = (typeof ctaCharacters)[number];
export type MobileStrategy = (typeof mobileStrategies)[number];
export type SectionPurpose = (typeof sectionPurposes)[number];

const text = (max: number, min = 0) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(min).max(max));

const plannedSectionSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]{1,48}$/),
    type: z.enum(sectionTypes),
    variant: z.string().min(1).max(40),
    purpose: z.enum(sectionPurposes),
    density: z.enum(["airy", "balanced", "compact"]),
    treatment: z.enum(["plain", "elevated", "outlined", "immersive"]),
    motion: z.enum(["quiet", "reveal", "drift", "snap"]),
  })
  .strict();

export type PlannedSection = z.infer<typeof plannedSectionSchema>;

export const creativeBlueprintSchema = z
  .object({
    version: z.literal(CREATIVE_BLUEPRINT_VERSION),
    business: z
      .object({
        category: z.enum(businessCategories),
        kind: z.string().min(1).max(24),
        name: text(60, 1),
        descriptor: text(140, 1),
        location: text(60),
        offer: text(60, 1),
        audience: text(120, 1),
        intent: text(120, 1),
        personality: text(80, 1),
        lead: text(40),
        sophistication: z.enum([
          "approachable",
          "considered",
          "refined",
          "luxury",
        ]),
        priorities: z.array(text(28, 1)).min(1).max(6),
      })
      .strict(),
    direction: z
      .object({
        concept: text(60, 1),
        intensity: z.enum(visualIntensities),
        balance: z.enum(["editorial", "commercial", "hybrid"]),
        premium: z.enum(premiumLevels),
        density: z.enum(contentDensities),
        shape: z.enum(shapeLanguages),
        surface: z.enum(surfaceSystems),
        whitespace: z.enum(spacingRhythms),
        layering: z.enum(["flat", "depth", "overlap"]),
      })
      .strict(),
    typography: z
      .object({
        display: z.enum(typographyCharacters),
        body: z.enum(typographyCharacters),
        scale: z.enum(["restrained", "balanced", "dramatic"]),
        contrast: z.enum(["subtle", "clear", "high"]),
        rhythm: z.enum(spacingRhythms),
        treatment: z.enum([
          "editorial",
          "technical",
          "expressive",
          "functional",
        ]),
      })
      .strict(),
    colour: z
      .object({
        palette: z.enum(paletteIds),
        mood: z.string().min(1).max(24),
        environment: z.enum(["light", "dark", "tinted"]),
        contrast: z.enum(["soft", "clear", "bold"]),
        accent: z.enum(["restrained", "single", "dual"]),
        surfaces: z.enum(["flat", "stacked", "glow"]),
      })
      .strict(),
    layout: z
      .object({
        composition: z.enum(compositionFamilies),
        container: z.enum(["narrow", "standard", "wide", "edge-to-edge"]),
        symmetry: z.enum(["symmetric", "asymmetric"]),
        rhythm: z.enum(spacingRhythms),
        density: z.enum(contentDensities),
        viewportUse: z.enum(["modest", "balanced", "full"]),
        alignment: z.enum(["left", "center"]),
      })
      .strict(),
    navigation: z
      .object({
        family: z.enum(navigationFamilies),
        density: z.enum(["minimal", "standard", "rich"]),
        ctaPosition: z.enum(["left", "center", "right", "none"]),
        treatment: z.enum(["transparent", "solid", "glass", "editorial"]),
      })
      .strict(),
    hero: z
      .object({
        family: z.enum(heroFamilies),
        height: z.enum(["compact", "balanced", "immersive", "viewport"]),
        media: z.enum([
          "none",
          "abstract-gradient",
          "geometric",
          "typographic",
          "layered-cards",
          "framed",
          "grid-panel",
          "panoramic-field",
        ]),
        typographyPlacement: z.enum([
          "left",
          "center",
          "bottom-left",
          "split",
          "overlay",
          "offset",
        ]),
        cta: z.enum(["inline", "stacked", "bar", "split"]),
        motion: z.enum(["none", "reveal", "drift", "parallax", "type-in"]),
        artDirection: z.enum(artDirections),
      })
      .strict(),
    sections: z.array(plannedSectionSchema).min(4).max(12),
    motion: z
      .object({
        family: z.enum(motionFamilies),
        intensity: z.enum(["subtle", "medium", "expressive"]),
      })
      .strict(),
    cta: z
      .object({
        character: z.enum(ctaCharacters),
        label: text(40, 1),
        secondary: text(40),
      })
      .strict(),
    mobile: z
      .object({
        strategy: z.enum(mobileStrategies),
        heroHeight: z.enum(["compact", "balanced"]),
        navigation: z.enum(["minimal", "standard"]),
        density: z.enum(["compact", "balanced"]),
        simplification: z.array(text(24, 1)).min(1).max(5),
      })
      .strict(),
    fingerprint: z
      .object({
        id: z.string().min(4).max(48),
        composition: z.enum(compositionFamilies),
        hero: z.enum(heroFamilies),
        navigation: z.enum(navigationFamilies),
        typography: z.enum(typographyCharacters),
        spacing: z.enum(spacingRhythms),
        surface: z.enum(surfaceSystems),
        palette: z.enum(paletteIds),
        motion: z.enum(motionFamilies),
        artDirection: z.enum(artDirections),
        sequence: z.string().min(4).max(280),
      })
      .strict(),
  })
  .strict();

export type CreativeBlueprint = z.infer<typeof creativeBlueprintSchema>;

export function parseCreativeBlueprint(value: unknown): CreativeBlueprint {
  return creativeBlueprintSchema.parse(value);
}

/**
 * Patch returned by the AI creative director. Every field is optional so the
 * model can refine one dimension without having to restate the whole
 * blueprint. Patches are merged into the deterministic blueprint and the
 * merged result is re-validated.
 */
export const creativeBlueprintPatchSchema = z
  .object({
    business: z
      .object({
        category: z.enum(businessCategories).optional(),
        offer: text(60, 1).optional(),
        audience: text(120, 1).optional(),
        intent: text(120, 1).optional(),
        personality: text(80, 1).optional(),
        descriptor: text(140, 1).optional(),
        location: text(60).optional(),
        sophistication: z
          .enum(["approachable", "considered", "refined", "luxury"])
          .optional(),
        priorities: z.array(text(28, 1)).min(1).max(6).optional(),
      })
      .strict()
      .optional(),
    direction: z
      .object({
        concept: text(60, 1).optional(),
        intensity: z.enum(visualIntensities).optional(),
        balance: z.enum(["editorial", "commercial", "hybrid"]).optional(),
        premium: z.enum(premiumLevels).optional(),
        density: z.enum(contentDensities).optional(),
        shape: z.enum(shapeLanguages).optional(),
        surface: z.enum(surfaceSystems).optional(),
        whitespace: z.enum(spacingRhythms).optional(),
        layering: z.enum(["flat", "depth", "overlap"]).optional(),
      })
      .strict()
      .optional(),
    typography: z
      .object({
        display: z.enum(typographyCharacters).optional(),
        body: z.enum(typographyCharacters).optional(),
        scale: z.enum(["restrained", "balanced", "dramatic"]).optional(),
        contrast: z.enum(["subtle", "clear", "high"]).optional(),
        rhythm: z.enum(spacingRhythms).optional(),
        treatment: z
          .enum(["editorial", "technical", "expressive", "functional"])
          .optional(),
      })
      .strict()
      .optional(),
    colour: z
      .object({
        palette: z.enum(paletteIds).optional(),
        mood: z.string().min(1).max(24).optional(),
        environment: z.enum(["light", "dark", "tinted"]).optional(),
        contrast: z.enum(["soft", "clear", "bold"]).optional(),
        accent: z.enum(["restrained", "single", "dual"]).optional(),
        surfaces: z.enum(["flat", "stacked", "glow"]).optional(),
      })
      .strict()
      .optional(),
    layout: z
      .object({
        composition: z.enum(compositionFamilies).optional(),
        container: z
          .enum(["narrow", "standard", "wide", "edge-to-edge"])
          .optional(),
        symmetry: z.enum(["symmetric", "asymmetric"]).optional(),
        rhythm: z.enum(spacingRhythms).optional(),
        density: z.enum(contentDensities).optional(),
        viewportUse: z.enum(["modest", "balanced", "full"]).optional(),
        alignment: z.enum(["left", "center"]).optional(),
      })
      .strict()
      .optional(),
    navigation: z
      .object({
        family: z.enum(navigationFamilies).optional(),
        density: z.enum(["minimal", "standard", "rich"]).optional(),
        ctaPosition: z.enum(["left", "center", "right", "none"]).optional(),
        treatment: z
          .enum(["transparent", "solid", "glass", "editorial"])
          .optional(),
      })
      .strict()
      .optional(),
    hero: z
      .object({
        family: z.enum(heroFamilies).optional(),
        height: z
          .enum(["compact", "balanced", "immersive", "viewport"])
          .optional(),
        media: z
          .enum([
            "none",
            "abstract-gradient",
            "geometric",
            "typographic",
            "layered-cards",
            "framed",
            "grid-panel",
            "panoramic-field",
          ])
          .optional(),
        typographyPlacement: z
          .enum(["left", "center", "bottom-left", "split", "overlay", "offset"])
          .optional(),
        cta: z.enum(["inline", "stacked", "bar", "split"]).optional(),
        motion: z
          .enum(["none", "reveal", "drift", "parallax", "type-in"])
          .optional(),
        artDirection: z.enum(artDirections).optional(),
      })
      .strict()
      .optional(),
    sections: z
      .array(
        z
          .object({
            type: z.enum(sectionTypes),
            variant: z.string().min(1).max(40),
            purpose: z.enum(sectionPurposes).optional(),
            density: z.enum(["airy", "balanced", "compact"]).optional(),
            treatment: z
              .enum(["plain", "elevated", "outlined", "immersive"])
              .optional(),
            motion: z.enum(["quiet", "reveal", "drift", "snap"]).optional(),
          })
          .strict(),
      )
      .min(4)
      .max(12)
      .optional(),
    motion: z
      .object({
        family: z.enum(motionFamilies).optional(),
        intensity: z.enum(["subtle", "medium", "expressive"]).optional(),
      })
      .strict()
      .optional(),
    cta: z
      .object({
        character: z.enum(ctaCharacters).optional(),
        label: text(40, 1).optional(),
        secondary: text(40).optional(),
      })
      .strict()
      .optional(),
    mobile: z
      .object({
        strategy: z.enum(mobileStrategies).optional(),
        heroHeight: z.enum(["compact", "balanced"]).optional(),
        navigation: z.enum(["minimal", "standard"]).optional(),
        density: z.enum(["compact", "balanced"]).optional(),
        simplification: z.array(text(24, 1)).min(1).max(5).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type CreativeBlueprintPatch = z.infer<
  typeof creativeBlueprintPatchSchema
>;

/* ------------------------------------------------------------------ *
 * Deterministic derivation
 * ------------------------------------------------------------------ */

function hashString(value: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 1;
}

function rotate<T>(list: readonly T[], seed: number, offset = 0): T {
  const index = Math.abs(seed + offset * 2_654_435) % list.length;
  return list[index]!;
}

const stopWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "be",
  "brand",
  "business",
  "by",
  "can",
  "company",
  "create",
  "design",
  "for",
  "from",
  "in",
  "is",
  "it",
  "its",
  "like",
  "make",
  "my",
  "near",
  "new",
  "of",
  "on",
  "or",
  "our",
  "please",
  "site",
  "studio",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "us",
  "use",
  "want",
  "website",
  "we",
  "with",
  "would",
  "you",
  "your",
  /*
   * Verb and framing forms are dropped everywhere, not just at the edges. A
   * visitor writes "a website that sells health supplements", so the lead must
   * never become the verb phrase "Sells Health": it would land inside adjectival
   * copy ("Everything for Sells Health, sorted the way people shop."). Keeping
   * these out of the candidate words protects headings, brand names and section
   * titles in every business bank at once.
   */
  "build",
  "builds",
  "building",
  "based",
  "help",
  "helping",
  "helps",
  "launch",
  "launches",
  "launching",
  "located",
  "make",
  "makes",
  "making",
  "manage",
  "managing",
  "need",
  "needs",
  "offering",
  "offerings",
  "offers",
  "operate",
  "operates",
  "operating",
  "provide",
  "provides",
  "providing",
  "run",
  "running",
  "runs",
  "sell",
  "selling",
  "sells",
  "sold",
  "serves",
  "serving",
  "wants",
]);

const categoryKeywords: ReadonlyArray<readonly [BusinessCategory, string[]]> = [
  [
    "technology",
    [
      "cybersecurity",
      "cyber",
      "software",
      "saas",
      "platform",
      "api",
      "cloud",
      "data",
      "app",
      "technology",
      "tech",
      "ai ",
      "it services",
      "devops",
      "fintech",
    ],
  ],
  [
    "hospitality",
    [
      "hotel",
      "resort",
      "resorts",
      "homestay",
      "guesthouse",
      "villa",
      "lodge",
      "retreat",
      "hostel",
      "hospitality",
      "rooms",
      "staycation",
    ],
  ],
  [
    "travel",
    [
      "travel",
      "tour",
      "tours",
      "journey",
      "journeys",
      "trek",
      "trekking",
      "expedition",
      "holiday",
      "packages",
      "destination",
      "itinerary",
      "safari",
    ],
  ],
  [
    "food",
    [
      "restaurant",
      "café",
      "cafe",
      "coffee",
      "bakery",
      "bistro",
      "kitchen",
      "diner",
      "eatery",
      "pizzeria",
      "food",
      "catering",
      "menu",
      "patisserie",
    ],
  ],
  [
    "retail",
    [
      "shop",
      "store",
      "retail",
      "ecommerce",
      "e-commerce",
      "online shop",
      "marketplace",
      "supermarket",
      "showroom",
      "outlet",
      "product",
      "products",
      "homeware",
      "merchandise",
    ],
  ],
  [
    "jewellery",
    [
      "jewellery",
      "jewelry",
      "gold jewellery",
      "gold shop",
      "gemstone",
      "bullion",
      "ornaments",
      "bridal set",
      "silverware shop",
    ],
  ],
  [
    "fashion",
    [
      "fashion",
      "streetwear",
      "clothing",
      "clothes",
      "apparel",
      "couture",
      "boutique label",
      "footwear",
      "jewellery",
      "jewelry",
      "accessories brand",
      "denim",
      "lookbook",
    ],
  ],
  [
    "beauty",
    [
      "salon",
      "beauty",
      "makeup",
      "cosmetic",
      "skincare",
      "barber",
      "spa",
      "nail",
      "hair",
    ],
  ],
  [
    "fitness",
    [
      "gym",
      "fitness",
      "trainer",
      "training",
      "crossfit",
      "pilates",
      "yoga",
      "coaching",
      "athletic",
      "sports academy",
    ],
  ],
  [
    "wellness",
    [
      "wellness",
      "therapy",
      "therapist",
      "meditation",
      "ayurveda",
      "massage",
      "detox",
      "mindfulness",
    ],
  ],
  [
    "supplements",
    [
      "supplement",
      "supplements",
      "protein",
      "whey",
      "multivitamin",
      "vitamin",
      "nutrition",
      "nutraceutical",
      "health drink",
      "mass gainer",
      "dietary supplement",
    ],
  ],
  [
    "healthcare",
    [
      "clinic",
      "hospital",
      "dental",
      "dentist",
      "doctor",
      "diagnostic",
      "physiotherapy",
      "health",
      "medical",
      "pharmacy",
    ],
  ],
  [
    "education",
    [
      "school",
      "college",
      "academy",
      "institute",
      "tuition",
      "course",
      "coaching class",
      "learning",
      "university",
      "preschool",
    ],
  ],
  [
    "construction",
    [
      "construction",
      "contractor",
      "contractors",
      "builder",
      "builders",
      "architecture",
      "architect",
      "interior work",
      "interior design",
      "renovation",
      "fabrication",
      "plumbing",
      "civil work",
      "structural work",
      "turnkey project",
    ],
  ],
  [
    "realestate",
    [
      "real estate",
      "realtor",
      "property",
      "properties",
      "builder",
      "construction",
      "architect",
      "interior",
      "developer",
      "apartments",
    ],
  ],
  [
    "automotive",
    [
      "car",
      "cars",
      "dealership",
      "garage",
      "automotive",
      "bike",
      "motorcycle",
      "auto service",
      "ev ",
      "detailing",
    ],
  ],
  [
    "logistics",
    [
      "logistics",
      "courier",
      "freight",
      "shipping",
      "transport",
      "supply chain",
      "warehouse",
      "movers",
      "packers",
    ],
  ],
  [
    "nonprofit",
    [
      "ngo",
      "non-profit",
      "nonprofit",
      "charity",
      "foundation",
      "trust",
      "social impact",
      "volunteer",
    ],
  ],
  [
    "agriculture",
    [
      "farm",
      "farming",
      "agriculture",
      "agro",
      "dairy",
      "orchard",
      "plantation",
      "organic produce",
      "nursery",
    ],
  ],
  [
    "events",
    [
      "wedding",
      "events",
      "event",
      "planner",
      "decor",
      "venue",
      "photography",
      "photographer",
      "caterer",
    ],
  ],
  [
    "professional",
    [
      "professional",
      "professional services",
      "consulting",
      "consultancy",
      "consultant",
      "law",
      "legal",
      "advocate",
      "attorney",
      "accounting",
      "accountant",
      "chartered",
      "advisory",
      "audit",
      "tax",
      "insurance",
      "wealth",
      "corporate",
      "expertise",
      "practice",
      "firm",
      "agency services",
      "b2b services",
    ],
  ],
  [
    "creative",
    [
      "agency",
      "design studio",
      "branding",
      "marketing",
      "advertising",
      "creative",
      "motion",
      "animation",
      "content",
      "pr ",
      "media",
      "production house",
    ],
  ],
  [
    "personal",
    [
      "personal brand",
      "influencer",
      "creator",
      "coach",
      "mentor",
      "author",
      "speaker",
      "portfolio",
      "freelancer",
    ],
  ],
];

export type PromptTerms = {
  prompt: string;
  seed: number;
  category: BusinessCategory;
  location: string;
  place: string;
  lead: string;
  words: string[];
};

/** Business categories that the phrase lexicon can name directly. */
const knownCategories = new Set<string>(businessCategories);

const keywordRegexCache = new Map<string, RegExp>();

/**
 * Whole-word keyword test. Substring matching used to make "ai" match inside
 * "Jaigaon" and "product" match inside "production", which misclassified real
 * descriptions.
 */
function keywordRegex(keyword: string): RegExp | null {
  const trimmed = keyword.trim();
  if (!trimmed) return null;
  let regex = keywordRegexCache.get(trimmed);
  if (!regex) {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    regex = new RegExp(`\\b${escaped}\\b`);
    keywordRegexCache.set(trimmed, regex);
  }
  return regex;
}

function hasKeyword(text: string, keyword: string): boolean {
  return keywordRegex(keyword)?.test(text) ?? false;
}

/**
 * Bounded, word-safe text for schema fields. Descriptions can now be long, so
 * every derived string is clamped rather than risking a validation failure.
 */
function clampText(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > max * 0.6 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

/**
 * Business categories are read from canonicalised text, so a description with
 * typos or colloquial wording ("sells clother locally") still resolves to the
 * right industry instead of falling through to the generic bank.
 */
function detectCategory(value: string): BusinessCategory {
  const canonical = canonicalBusinessText(value);
  const padded = ` ${canonical} `;
  /*
   * Score every category instead of stopping at the first keyword hit. A
   * description like "a gym with a supplement counter" names more than one
   * domain; the category with the strongest and earliest signal is the one the
   * visitor actually leads with.
   */
  let best: { category: BusinessCategory; score: number; at: number } | null =
    null;
  for (const [category, keywords] of categoryKeywords) {
    let score = 0;
    let at = Number.POSITIVE_INFINITY;
    for (const keyword of keywords) {
      const regex = keywordRegex(keyword);
      if (!regex) continue;
      const index = padded.search(regex);
      if (index < 0) continue;
      score += 1;
      if (index < at) at = index;
    }
    if (score === 0) continue;
    if (!best || score > best.score || (score === best.score && at < best.at)) {
      best = { category, score, at };
    }
  }
  /*
   * A shop is a shop first. When a description of a clothing or jewellery
   * *business* also names selling, a shop, a store or local custom, the retail
   * structure is the honest answer: it carries collections, new arrivals,
   * visiting details and local delivery, which a brand campaign page does not.
   */
  const sellingLocally =
    /\b(?:shop|store|sell|sells|selling|showroom|outlet|retail|local|locally|nearby|wholesale|distributor)\b/.test(
      canonical,
    );
  if (
    best &&
    sellingLocally &&
    (best.category === "fashion" || best.category === "jewellery")
  ) {
    return best.category === "jewellery" ? "jewellery" : "retail";
  }
  if (best) return best.category;
  if (/\b(resort|hotel|stay|rooms)\b/.test(padded)) return "hospitality";
  if (/\b(menu|coffee|food|dish|dining)\b/.test(padded)) return "food";
  if (/\b(shop|product|sell)\b/.test(padded)) return "retail";
  if (/\b(agency|studio|brand)\b/.test(padded)) return "creative";
  // Phrase-level fallback: multi-word signals the keyword scan cannot see.
  for (const domain of domainsInText(value)) {
    if (knownCategories.has(domain)) return domain as BusinessCategory;
  }
  return "generic";
}

function detectLocation(prompt: string): { location: string; place: string } {
  // Shared with the language layer so "in Jaigaon and also" never becomes a
  // place name.
  return extractLocationPhrase(prompt);
}

function extractLead(prompt: string, category: BusinessCategory): string {
  const tokens = prompt.split(/[^A-Za-z'-]+/).filter(Boolean);
  const keywords =
    categoryKeywords.find(([key]) => key === category)?.[1] ?? [];
  const stopIndex = tokens.findIndex((token) =>
    keywords.includes(token.toLowerCase()),
  );
  const head = stopIndex > 0 ? tokens.slice(0, stopIndex) : [];
  const chosen = head
    .filter((token) => !stopWords.has(token.toLowerCase()))
    .slice(-2)
    .join(" ");
  return chosen.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export function extractPromptTerms(prompt: string): PromptTerms {
  const normalized = prompt.replace(/\s+/g, " ").trim();
  const value = normalized.toLowerCase();
  const canonical = canonicalBusinessText(normalized);
  const category = detectCategory(value);
  const { location, place } = detectLocation(normalized);
  const lead = extractLead(canonical, category);
  return {
    prompt: normalized,
    seed: hashString(value),
    category,
    location,
    place,
    lead,
    words: canonical
      .split(/[^A-Za-z'-]+/)
      .filter((word) => word.length > 2 && !stopWords.has(word.toLowerCase())),
  };
}

type Bias = {
  kind: DesignSpec["site"]["businessKind"];
  hero: HeroFamily[];
  nav: NavigationFamily[];
  composition: CompositionFamily[];
  art: ArtDirection[];
  typography: TypographyCharacter[];
  palette: PaletteId[];
  mood: Mood;
  intensity: VisualIntensity;
  premium: PremiumLevel;
  balance: "editorial" | "commercial" | "hybrid";
  shape: ShapeLanguage;
  surface: SurfaceSystem;
  whitespace: SpacingRhythm;
  motion: MotionFamily;
  cta: CtaCharacter;
  environment: "light" | "dark" | "tinted";
};

const biases: Record<BusinessCategory, Bias> = {
  hospitality: {
    kind: "hotel",
    hero: [
      "hospitality-image-led",
      "cinematic-media",
      "centered-luxury",
      "layered-spatial",
    ],
    nav: ["transparent-overlay", "floating-capsule", "editorial-split"],
    composition: [
      "full-bleed-immersive",
      "masonry-editorial",
      "asymmetric-grid",
    ],
    art: ["light-shafts", "organic-halo", "layered-surfaces", "grain-field"],
    typography: ["editorial-serif", "expressive-display", "humanist-warm"],
    palette: ["forest-gold", "midnight-champagne", "stone-sage", "sand-olive"],
    mood: "cinematic",
    intensity: "expressive",
    premium: "luxury",
    balance: "editorial",
    shape: "soft",
    surface: "layered",
    whitespace: "spacious",
    motion: "cinematic",
    cta: "booking",
    environment: "dark",
  },
  travel: {
    kind: "travel",
    hero: [
      "immersive-viewport",
      "cinematic-media",
      "layered-spatial",
      "poster-brutalist",
    ],
    nav: ["transparent-overlay", "immersive-brand", "floating-capsule"],
    composition: ["full-bleed-immersive", "masonry-editorial", "modular-bento"],
    art: ["light-shafts", "geometric-composition", "grain-field"],
    typography: ["grotesk-modern", "condensed-poster", "editorial-serif"],
    palette: ["ocean-copper", "cobalt-cream", "forest-gold", "sand-olive"],
    mood: "cinematic",
    intensity: "dramatic",
    premium: "refined",
    balance: "commercial",
    shape: "soft",
    surface: "glass",
    whitespace: "spacious",
    motion: "cinematic",
    cta: "booking",
    environment: "tinted",
  },
  food: {
    kind: "restaurant",
    hero: [
      "split-composition",
      "editorial-typography",
      "asymmetric-story",
      "hospitality-image-led",
      "centered-luxury",
      "layered-spatial",
    ],
    nav: ["editorial-split", "minimal-centered", "floating-capsule"],
    composition: [
      "asymmetric-grid",
      "editorial-single-column",
      "masonry-editorial",
      "modular-bento",
    ],
    art: ["editorial-rule", "framed-print", "grain-field", "organic-halo"],
    typography: ["humanist-warm", "editorial-serif", "expressive-display"],
    palette: [
      "ivory-terracotta",
      "clay-indigo",
      "charcoal-amber",
      "sand-olive",
    ],
    mood: "warm",
    intensity: "considered",
    premium: "approachable",
    balance: "hybrid",
    shape: "rounded",
    surface: "paper",
    whitespace: "cadenced",
    motion: "editorial",
    cta: "booking",
    environment: "light",
  },
  retail: {
    kind: "retail",
    hero: [
      "commerce-product",
      "poster-brutalist",
      "minimal-professional",
      "asymmetric-story",
    ],
    nav: ["utility-bar", "compact-professional", "minimal-centered"],
    composition: ["modular-bento", "asymmetric-grid", "index-driven"],
    art: [
      "geometric-composition",
      "monolith",
      "framed-print",
      "typographic-art",
    ],
    typography: ["grotesk-modern", "geometric-technical", "condensed-poster"],
    palette: ["paper-ink", "graphite-lime", "slate-coral", "stone-sage"],
    mood: "modern",
    intensity: "considered",
    premium: "refined",
    balance: "commercial",
    shape: "sharp",
    surface: "matte",
    whitespace: "even",
    motion: "technical",
    cta: "purchase",
    environment: "light",
  },
  fashion: {
    kind: "fashion",
    hero: [
      "poster-brutalist",
      "editorial-typography",
      "centered-luxury",
      "layered-spatial",
    ],
    nav: ["minimal-centered", "utility-bar", "immersive-brand"],
    composition: ["poster-stack", "masonry-editorial", "full-bleed-immersive"],
    art: [
      "typographic-art",
      "monolith",
      "grain-field",
      "geometric-composition",
    ],
    typography: ["condensed-poster", "grotesk-modern", "expressive-display"],
    palette: ["midnight-champagne", "paper-ink", "plum-brass", "graphite-lime"],
    mood: "bold",
    intensity: "dramatic",
    premium: "refined",
    balance: "editorial",
    shape: "sharp",
    surface: "void",
    whitespace: "tight",
    motion: "playful",
    cta: "purchase",
    environment: "dark",
  },
  supplements: {
    kind: "wellness",
    hero: [
      "commerce-product",
      "split-composition",
      "minimal-professional",
      "technical-grid",
    ],
    nav: ["utility-bar", "compact-professional", "floating-capsule"],
    composition: ["modular-bento", "index-driven", "asymmetric-grid"],
    art: ["geometric-composition", "grid-technical", "organic-halo"],
    typography: ["grotesk-modern", "humanist-warm", "geometric-technical"],
    palette: ["paper-ink", "stone-sage", "cobalt-cream", "graphite-lime"],
    mood: "modern",
    intensity: "considered",
    premium: "refined",
    balance: "commercial",
    shape: "soft",
    surface: "soft",
    whitespace: "even",
    motion: "quiet",
    cta: "purchase",
    environment: "light",
  },
  construction: {
    kind: "realestate",
    hero: [
      "asymmetric-story",
      "technical-grid",
      "layered-spatial",
      "minimal-professional",
    ],
    nav: ["compact-professional", "utility-bar", "editorial-split"],
    composition: ["asymmetric-grid", "technical-grid", "split-dual"],
    art: ["geometric-composition", "monolith", "grid-technical"],
    typography: ["geometric-technical", "grotesk-modern", "condensed-poster"],
    palette: ["charcoal-amber", "graphite-lime", "stone-sage", "paper-ink"],
    mood: "modern",
    intensity: "considered",
    premium: "refined",
    balance: "hybrid",
    shape: "sharp",
    surface: "matte",
    whitespace: "even",
    motion: "technical",
    cta: "consultation",
    environment: "light",
  },
  jewellery: {
    kind: "retail",
    hero: [
      "centered-luxury",
      "commerce-product",
      "editorial-typography",
      "split-composition",
    ],
    nav: ["minimal-centered", "utility-bar", "floating-capsule"],
    composition: ["centered-symmetric", "index-driven", "modular-bento"],
    art: ["light-shafts", "monolith", "framed-print", "organic-halo"],
    typography: ["editorial-serif", "expressive-display", "humanist-warm"],
    palette: [
      "midnight-champagne",
      "ivory-terracotta",
      "plum-brass",
      "paper-ink",
    ],
    mood: "luxury",
    intensity: "expressive",
    premium: "luxury",
    balance: "commercial",
    shape: "soft",
    surface: "layered",
    whitespace: "spacious",
    motion: "luxury",
    cta: "enquiry",
    environment: "tinted",
  },
  professional: {
    kind: "professional",
    hero: [
      "minimal-professional",
      "editorial-typography",
      "split-composition",
      "technical-grid",
    ],
    nav: ["compact-professional", "minimal-centered", "editorial-split"],
    composition: ["editorial-single-column", "index-driven", "split-dual"],
    art: ["editorial-rule", "grid-technical", "geometric-composition"],
    typography: ["grotesk-modern", "editorial-serif", "geometric-technical"],
    palette: ["paper-ink", "cobalt-cream", "slate-coral", "midnight-champagne"],
    mood: "professional",
    intensity: "restrained",
    premium: "refined",
    balance: "hybrid",
    shape: "sharp",
    surface: "paper",
    whitespace: "spacious",
    motion: "quiet",
    cta: "consultation",
    environment: "light",
  },
  technology: {
    kind: "technology",
    hero: [
      "technical-grid",
      "minimal-professional",
      "split-composition",
      "layered-spatial",
      "immersive-viewport",
      "editorial-typography",
    ],
    nav: ["utility-bar", "floating-capsule", "compact-professional"],
    composition: [
      "technical-grid",
      "modular-bento",
      "split-dual",
      "index-driven",
    ],
    art: [
      "grid-technical",
      "geometric-composition",
      "gradient-field",
      "monolith",
    ],
    typography: ["geometric-technical", "mono-technical", "grotesk-modern"],
    palette: [
      "graphite-lime",
      "cobalt-cream",
      "midnight-champagne",
      "paper-ink",
    ],
    mood: "technical",
    intensity: "restrained",
    premium: "refined",
    balance: "commercial",
    shape: "sharp",
    surface: "glass",
    whitespace: "even",
    motion: "technical",
    cta: "direct",
    environment: "dark",
  },
  creative: {
    kind: "creative",
    hero: [
      "editorial-typography",
      "poster-brutalist",
      "layered-spatial",
      "asymmetric-story",
    ],
    nav: ["immersive-brand", "editorial-split", "minimal-centered"],
    composition: ["modular-bento", "poster-stack", "masonry-editorial"],
    art: [
      "geometric-composition",
      "typographic-art",
      "gradient-field",
      "layered-surfaces",
    ],
    typography: ["expressive-display", "grotesk-modern", "condensed-poster"],
    palette: ["clay-indigo", "graphite-lime", "plum-brass", "slate-coral"],
    mood: "playful",
    intensity: "expressive",
    premium: "refined",
    balance: "editorial",
    shape: "organic",
    surface: "layered",
    whitespace: "cadenced",
    motion: "playful",
    cta: "enquiry",
    environment: "tinted",
  },
  fitness: {
    kind: "fitness",
    hero: [
      "asymmetric-story",
      "poster-brutalist",
      "technical-grid",
      "split-composition",
    ],
    nav: ["compact-professional", "utility-bar", "minimal-centered"],
    composition: ["asymmetric-grid", "index-driven", "modular-bento"],
    art: ["monolith", "grid-technical", "light-shafts"],
    typography: ["condensed-poster", "grotesk-modern", "geometric-technical"],
    palette: [
      "charcoal-amber",
      "graphite-lime",
      "slate-coral",
      "midnight-champagne",
    ],
    mood: "bold",
    intensity: "expressive",
    premium: "approachable",
    balance: "commercial",
    shape: "sharp",
    surface: "matte",
    whitespace: "tight",
    motion: "playful",
    cta: "booking",
    environment: "dark",
  },
  wellness: {
    kind: "wellness",
    hero: [
      "centered-luxury",
      "editorial-typography",
      "layered-spatial",
      "split-composition",
    ],
    nav: ["minimal-centered", "floating-capsule", "editorial-split"],
    composition: [
      "centered-symmetric",
      "editorial-single-column",
      "masonry-editorial",
    ],
    art: ["organic-halo", "gradient-field", "grain-field"],
    typography: ["humanist-warm", "editorial-serif", "expressive-display"],
    palette: ["stone-sage", "sand-olive", "plum-brass", "ivory-terracotta"],
    mood: "serene",
    intensity: "restrained",
    premium: "luxury",
    balance: "editorial",
    shape: "organic",
    surface: "soft",
    whitespace: "spacious",
    motion: "luxury",
    cta: "booking",
    environment: "light",
  },
  healthcare: {
    kind: "healthcare",
    hero: [
      "editorial-typography",
      "minimal-professional",
      "split-composition",
      "commerce-product",
    ],
    nav: ["compact-professional", "minimal-centered", "utility-bar"],
    composition: [
      "editorial-single-column",
      "split-dual",
      "centered-symmetric",
    ],
    art: ["editorial-rule", "organic-halo", "grid-technical"],
    typography: ["humanist-warm", "grotesk-modern", "editorial-serif"],
    palette: ["cobalt-cream", "paper-ink", "stone-sage"],
    mood: "bright",
    intensity: "restrained",
    premium: "approachable",
    balance: "hybrid",
    shape: "soft",
    surface: "paper",
    whitespace: "spacious",
    motion: "quiet",
    cta: "booking",
    environment: "light",
  },
  education: {
    kind: "education",
    hero: [
      "editorial-typography",
      "asymmetric-story",
      "split-composition",
      "technical-grid",
    ],
    nav: ["compact-professional", "editorial-split", "minimal-centered"],
    composition: ["editorial-single-column", "modular-bento", "index-driven"],
    art: ["editorial-rule", "geometric-composition", "typographic-art"],
    typography: ["humanist-warm", "grotesk-modern", "mono-technical"],
    palette: ["cobalt-cream", "sand-olive", "paper-ink", "clay-indigo"],
    mood: "bright",
    intensity: "considered",
    premium: "approachable",
    balance: "hybrid",
    shape: "rounded",
    surface: "paper",
    whitespace: "even",
    motion: "editorial",
    cta: "enquiry",
    environment: "light",
  },
  realestate: {
    kind: "realestate",
    hero: [
      "split-composition",
      "minimal-professional",
      "cinematic-media",
      "technical-grid",
    ],
    nav: ["compact-professional", "utility-bar", "editorial-split"],
    composition: ["split-dual", "asymmetric-grid", "editorial-single-column"],
    art: ["geometric-composition", "grid-technical", "framed-print"],
    typography: ["grotesk-modern", "editorial-serif", "geometric-technical"],
    palette: ["charcoal-amber", "paper-ink", "stone-sage", "cobalt-cream"],
    mood: "modern",
    intensity: "considered",
    premium: "refined",
    balance: "commercial",
    shape: "sharp",
    surface: "matte",
    whitespace: "even",
    motion: "quiet",
    cta: "enquiry",
    environment: "light",
  },
  automotive: {
    kind: "automotive",
    hero: [
      "commerce-product",
      "cinematic-media",
      "technical-grid",
      "poster-brutalist",
    ],
    nav: ["utility-bar", "compact-professional", "immersive-brand"],
    composition: ["modular-bento", "technical-grid", "full-bleed-immersive"],
    art: [
      "monolith",
      "light-shafts",
      "grid-technical",
      "geometric-composition",
    ],
    typography: ["condensed-poster", "geometric-technical", "grotesk-modern"],
    palette: ["midnight-champagne", "graphite-lime", "charcoal-amber"],
    mood: "industrial",
    intensity: "expressive",
    premium: "refined",
    balance: "commercial",
    shape: "sharp",
    surface: "void",
    whitespace: "tight",
    motion: "technical",
    cta: "direct",
    environment: "dark",
  },
  beauty: {
    kind: "beauty",
    hero: [
      "centered-luxury",
      "asymmetric-story",
      "editorial-typography",
      "layered-spatial",
    ],
    nav: ["minimal-centered", "floating-capsule", "immersive-brand"],
    composition: ["centered-symmetric", "masonry-editorial", "asymmetric-grid"],
    art: ["organic-halo", "typographic-art", "gradient-field"],
    typography: ["expressive-display", "humanist-warm", "editorial-serif"],
    palette: ["plum-brass", "ivory-terracotta", "stone-sage", "slate-coral"],
    mood: "luxury",
    intensity: "expressive",
    premium: "luxury",
    balance: "editorial",
    shape: "organic",
    surface: "soft",
    whitespace: "spacious",
    motion: "luxury",
    cta: "booking",
    environment: "light",
  },
  events: {
    kind: "events",
    hero: [
      "layered-spatial",
      "cinematic-media",
      "poster-brutalist",
      "editorial-typography",
    ],
    nav: ["immersive-brand", "editorial-split", "minimal-centered"],
    composition: ["masonry-editorial", "poster-stack", "modular-bento"],
    art: ["light-shafts", "grain-field", "typographic-art"],
    typography: ["expressive-display", "editorial-serif", "condensed-poster"],
    palette: ["plum-brass", "ivory-terracotta", "midnight-champagne"],
    mood: "heritage",
    intensity: "expressive",
    premium: "luxury",
    balance: "editorial",
    shape: "soft",
    surface: "layered",
    whitespace: "cadenced",
    motion: "editorial",
    cta: "concierge",
    environment: "tinted",
  },
  logistics: {
    kind: "logistics",
    hero: [
      "technical-grid",
      "split-composition",
      "minimal-professional",
      "commerce-product",
    ],
    nav: ["utility-bar", "compact-professional", "minimal-centered"],
    composition: ["technical-grid", "index-driven", "split-dual"],
    art: ["grid-technical", "monolith", "geometric-composition"],
    typography: ["geometric-technical", "grotesk-modern", "mono-technical"],
    palette: ["cobalt-cream", "charcoal-amber", "graphite-lime"],
    mood: "industrial",
    intensity: "restrained",
    premium: "approachable",
    balance: "commercial",
    shape: "sharp",
    surface: "matte",
    whitespace: "even",
    motion: "technical",
    cta: "direct",
    environment: "light",
  },
  nonprofit: {
    kind: "nonprofit",
    hero: [
      "editorial-typography",
      "asymmetric-story",
      "layered-spatial",
      "split-composition",
    ],
    nav: ["editorial-split", "minimal-centered", "compact-professional"],
    composition: [
      "editorial-single-column",
      "asymmetric-grid",
      "masonry-editorial",
    ],
    art: ["organic-halo", "editorial-rule", "grain-field"],
    typography: ["humanist-warm", "editorial-serif", "grotesk-modern"],
    palette: ["sand-olive", "forest-gold", "stone-sage", "cobalt-cream"],
    mood: "organic",
    intensity: "considered",
    premium: "approachable",
    balance: "editorial",
    shape: "rounded",
    surface: "paper",
    whitespace: "cadenced",
    motion: "editorial",
    cta: "enquiry",
    environment: "light",
  },
  agriculture: {
    kind: "agriculture",
    hero: [
      "hospitality-image-led",
      "editorial-typography",
      "split-composition",
      "layered-spatial",
    ],
    nav: ["editorial-split", "minimal-centered", "utility-bar"],
    composition: [
      "asymmetric-grid",
      "editorial-single-column",
      "masonry-editorial",
    ],
    art: ["organic-halo", "grain-field", "editorial-rule"],
    typography: ["humanist-warm", "editorial-serif", "grotesk-modern"],
    palette: ["forest-gold", "sand-olive", "stone-sage"],
    mood: "organic",
    intensity: "considered",
    premium: "approachable",
    balance: "hybrid",
    shape: "rounded",
    surface: "grain",
    whitespace: "even",
    motion: "quiet",
    cta: "enquiry",
    environment: "light",
  },
  personal: {
    kind: "personal",
    hero: [
      "asymmetric-story",
      "editorial-typography",
      "layered-spatial",
      "poster-brutalist",
    ],
    nav: ["minimal-centered", "editorial-split", "immersive-brand"],
    composition: ["asymmetric-grid", "editorial-single-column", "poster-stack"],
    art: ["typographic-art", "framed-print", "gradient-field"],
    typography: ["expressive-display", "grotesk-modern", "editorial-serif"],
    palette: ["paper-ink", "clay-indigo", "plum-brass", "charcoal-amber"],
    mood: "editorial",
    intensity: "considered",
    premium: "refined",
    balance: "editorial",
    shape: "soft",
    surface: "matte",
    whitespace: "spacious",
    motion: "editorial",
    cta: "enquiry",
    environment: "light",
  },
  generic: {
    kind: "generic",
    hero: [
      "editorial-typography",
      "split-composition",
      "minimal-professional",
      "asymmetric-story",
    ],
    nav: ["minimal-centered", "compact-professional", "editorial-split"],
    composition: ["editorial-single-column", "asymmetric-grid", "index-driven"],
    art: ["editorial-rule", "geometric-composition", "gradient-field"],
    typography: ["grotesk-modern", "editorial-serif", "humanist-warm"],
    palette: ["paper-ink", "stone-sage", "cobalt-cream", "clay-indigo"],
    mood: "modern",
    intensity: "considered",
    premium: "refined",
    balance: "hybrid",
    shape: "soft",
    surface: "matte",
    whitespace: "even",
    motion: "quiet",
    cta: "enquiry",
    environment: "light",
  },
};

type PlannedStep = {
  type: SectionType;
  purpose: SectionPurpose;
  variants: string[];
};

const sequences: Record<BusinessCategory, PlannedStep[]> = {
  hospitality: [
    {
      type: "about",
      purpose: "establish",
      variants: ["split-media-story", "image-led-story", "editorial-narrative"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["room-collection", "image-showcase", "product-grid"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["cinematic-mosaic", "bento-mosaic", "art-collage"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["structured-editorial", "capability-grid", "trust-band"],
    },
    {
      type: "services",
      purpose: "explain",
      variants: ["horizontal-showcase", "editorial-list", "numbered-narrative"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "location-composition", "concierge-panel"],
    },
  ],
  travel: [
    {
      type: "services",
      purpose: "showcase",
      variants: ["immersive-panels", "horizontal-showcase", "bento-grid"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["package-cards", "collection-rail", "premium-listing"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["full-bleed", "gallery-strip", "cinematic-mosaic"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-narrative", "split-media-story", "image-led-story"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["process-timeline", "stats-band", "icon-list"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["cinematic", "booking-band", "conversion-band"],
    },
  ],
  food: [
    {
      type: "services",
      purpose: "showcase",
      variants: ["catalogue-list", "editorial-list", "split-offerings"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-story", "image-led-story", "editorial-narrative"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["editorial-grid", "gallery-strip", "art-collage"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["icon-list", "bento-grid", "trust-band"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["location-composition", "concise", "map-led"],
    },
  ],
  retail: [
    {
      type: "listings",
      purpose: "orient",
      variants: ["collection-rail", "index-list", "product-grid"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["product-grid", "premium-listing", "image-showcase"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["split-media-story", "editorial-narrative", "minimal-intro"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["bento-mosaic", "editorial-grid", "framed-print-series"],
    },
    {
      type: "features",
      purpose: "inform",
      variants: ["icon-list", "visual-blocks", "trust-band"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["split", "conversion-band", "booking-band"],
    },
    {
      type: "contact",
      purpose: "invite",
      variants: ["location-composition", "map-led", "concise"],
    },
  ],
  fashion: [
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "full-bleed", "horizontal-gallery"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["collection-rail", "product-grid", "featured-item"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: [
        "manifesto-statement",
        "editorial-narrative",
        "image-led-story",
      ],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["manifesto", "numbered-features", "capability-grid"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["statement-cta", "split", "conversion-band"],
    },
    {
      type: "contact",
      purpose: "invite",
      variants: ["concierge-panel", "detailed", "concise"],
    },
  ],
  professional: [
    {
      type: "services",
      purpose: "explain",
      variants: ["service-index", "editorial-list", "capability-columns"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-narrative", "founder-story", "split-media-story"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["capability-grid", "structured-editorial", "comparison-table"],
    },
    {
      type: "testimonials",
      purpose: "prove",
      variants: ["minimal-quote", "editorial-quotes", "statement-quote"],
    },
    {
      type: "features",
      purpose: "inform",
      variants: ["faq-list", "process-timeline", "numbered-features"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "concierge-panel", "detailed"],
    },
  ],
  technology: [
    {
      type: "features",
      purpose: "explain",
      variants: ["capability-grid", "bento-grid", "stats-band"],
    },
    {
      type: "services",
      purpose: "showcase",
      variants: ["capability-columns", "compact-cards", "bento-grid"],
    },
    {
      type: "features",
      purpose: "inform",
      variants: ["process-timeline", "faq-list", "comparison-table"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["split-media-story", "minimal-intro", "editorial-narrative"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["detailed", "concise", "concierge-panel"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["conversion-band", "minimal", "cinematic"],
    },
  ],
  creative: [
    {
      type: "services",
      purpose: "showcase",
      variants: ["bento-grid", "immersive-panels", "numbered-narrative"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "bento-mosaic", "full-bleed"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["manifesto-statement", "editorial-narrative", "founder-story"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["process-timeline", "numbered-features", "trust-band"],
    },
    {
      type: "testimonials",
      purpose: "prove",
      variants: ["statement-quote", "editorial-quotes"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["statement-cta", "conversion-band", "split"],
    },
  ],
  fitness: [
    {
      type: "services",
      purpose: "showcase",
      variants: [
        "numbered-narrative",
        "split-offerings",
        "horizontal-showcase",
      ],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["process-timeline", "icon-list", "stats-band"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["founder-story", "values-grid", "split-media-story"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["gallery-strip", "editorial-grid"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "concise", "concierge-panel"],
    },
  ],
  wellness: [
    {
      type: "services",
      purpose: "showcase",
      variants: ["editorial-list", "split-offerings", "bento-grid"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: [
        "image-led-story",
        "editorial-narrative",
        "manifesto-statement",
      ],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["gallery-strip", "art-collage", "full-bleed"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["icon-list", "trust-band", "structured-editorial"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "location-composition", "concierge-panel"],
    },
  ],
  healthcare: [
    {
      type: "services",
      purpose: "explain",
      variants: ["capability-columns", "service-index", "editorial-list"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["trust-band", "capability-grid", "structured-editorial"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-narrative", "founder-story"],
    },
    {
      type: "features",
      purpose: "inform",
      variants: ["process-timeline", "faq-list"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["booking-band", "split", "conversion-band"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "concise", "map-led"],
    },
  ],
  supplements: [
    {
      type: "listings",
      purpose: "orient",
      variants: ["index-list", "collection-rail", "product-grid"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["product-grid", "premium-listing", "image-showcase"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["product-grid", "collection-rail", "image-showcase"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["featured-item", "premium-listing", "product-grid"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["bento-grid", "capability-grid", "structured-editorial"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["trust-band", "faq-list", "comparison-table"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["conversion-band", "split", "minimal"],
    },
    {
      type: "contact",
      purpose: "invite",
      variants: ["concise", "detailed", "map-led"],
    },
  ],
  construction: [
    {
      type: "listings",
      purpose: "showcase",
      variants: ["image-showcase", "premium-listing", "collection-rail"],
    },
    {
      type: "services",
      purpose: "explain",
      variants: ["capability-columns", "service-index", "editorial-list"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["capability-grid", "bento-grid", "stats-band"],
    },
    {
      type: "features",
      purpose: "inform",
      variants: ["process-timeline", "numbered-features", "faq-list"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["trust-band", "stats-band", "comparison-table"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["founder-story", "editorial-narrative", "split-media-story"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["split", "conversion-band", "minimal"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "detailed", "concise"],
    },
  ],
  jewellery: [
    {
      type: "listings",
      purpose: "orient",
      variants: ["collection-rail", "index-list", "product-grid"],
    },
    {
      type: "listings",
      purpose: "showcase",
      variants: ["premium-listing", "featured-item", "product-grid"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-story", "image-led-story", "editorial-narrative"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "editorial-grid", "bento-mosaic"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["trust-band", "faq-list", "icon-list"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["statement-cta", "conversion-band", "split"],
    },
    {
      type: "contact",
      purpose: "invite",
      variants: ["concierge-panel", "detailed", "map-led"],
    },
  ],
  education: [
    {
      type: "services",
      purpose: "explain",
      variants: ["process-steps", "bento-grid", "capability-columns"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["stats-band", "numbered-features", "icon-list"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["split-media-story", "editorial-narrative"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["editorial-grid", "gallery-strip"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "detailed"],
    },
  ],
  realestate: [
    {
      type: "listings",
      purpose: "showcase",
      variants: ["premium-listing", "product-grid", "image-showcase"],
    },
    {
      type: "services",
      purpose: "explain",
      variants: ["capability-columns", "service-index", "process-steps"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["stats-band", "capability-grid", "comparison-table"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["split-media-story", "editorial-narrative"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["location-composition", "detailed", "booking-enquiry"],
    },
  ],
  automotive: [
    {
      type: "listings",
      purpose: "showcase",
      variants: ["product-grid", "collection-rail", "comparison"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["stats-band", "comparison-table", "capability-grid"],
    },
    {
      type: "services",
      purpose: "explain",
      variants: ["process-steps", "numbered-narrative", "service-index"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["gallery-strip", "editorial-grid"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "concise", "map-led"],
    },
  ],
  beauty: [
    {
      type: "services",
      purpose: "showcase",
      variants: ["editorial-list", "split-offerings", "catalogue-list"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "gallery-strip", "framed-print-series"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["image-led-story", "manifesto-statement"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["icon-list", "trust-band"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["booking-enquiry", "concierge-panel", "location-composition"],
    },
  ],
  events: [
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "bento-mosaic", "full-bleed"],
    },
    {
      type: "services",
      purpose: "explain",
      variants: ["process-steps", "numbered-narrative", "immersive-panels"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["manifesto-statement", "editorial-narrative"],
    },
    {
      type: "testimonials",
      purpose: "prove",
      variants: ["editorial-quotes", "minimal-quote"],
    },
    {
      type: "contact",
      purpose: "invite",
      variants: ["concierge-panel", "booking-enquiry", "detailed"],
    },
  ],
  logistics: [
    {
      type: "services",
      purpose: "explain",
      variants: ["capability-columns", "service-index", "process-steps"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["stats-band", "capability-grid", "comparison-table"],
    },
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-narrative", "split-media-story"],
    },
    {
      type: "features",
      purpose: "inform",
      variants: ["faq-list", "process-timeline"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["detailed", "booking-enquiry", "map-led"],
    },
  ],
  nonprofit: [
    {
      type: "about",
      purpose: "establish",
      variants: [
        "editorial-narrative",
        "manifesto-statement",
        "image-led-story",
      ],
    },
    {
      type: "services",
      purpose: "showcase",
      variants: ["editorial-list", "bento-grid", "numbered-narrative"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "gallery-strip"],
    },
    {
      type: "features",
      purpose: "prove",
      variants: ["stats-band", "icon-list", "trust-band"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["conversion-band", "split", "statement-cta"],
    },
  ],
  agriculture: [
    {
      type: "about",
      purpose: "establish",
      variants: ["image-led-story", "editorial-narrative", "split-media-story"],
    },
    {
      type: "services",
      purpose: "showcase",
      variants: ["catalogue-list", "editorial-list", "bento-grid"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["bento-mosaic", "editorial-grid", "gallery-strip"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["icon-list", "process-timeline", "trust-band"],
    },
    {
      type: "contact",
      purpose: "convert",
      variants: ["location-composition", "booking-enquiry", "concise"],
    },
  ],
  personal: [
    {
      type: "about",
      purpose: "establish",
      variants: ["founder-story", "manifesto-statement", "image-led-story"],
    },
    {
      type: "services",
      purpose: "showcase",
      variants: ["numbered-narrative", "editorial-list", "split-offerings"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["art-collage", "gallery-strip"],
    },
    {
      type: "testimonials",
      purpose: "prove",
      variants: ["editorial-quotes", "minimal-quote"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["concierge-teaser", "statement-cta", "split"],
    },
  ],
  generic: [
    {
      type: "about",
      purpose: "establish",
      variants: ["editorial-narrative", "split-media-story", "values-grid"],
    },
    {
      type: "services",
      purpose: "showcase",
      variants: ["visual-grid", "editorial-list", "bento-grid"],
    },
    {
      type: "features",
      purpose: "explain",
      variants: ["structured-editorial", "icon-list", "bento-grid"],
    },
    {
      type: "gallery",
      purpose: "showcase",
      variants: ["editorial-grid", "art-collage", "gallery-strip"],
    },
    {
      type: "cta",
      purpose: "convert",
      variants: ["minimal", "split", "cinematic"],
    },
    { type: "contact", purpose: "inform", variants: ["concise", "detailed"] },
  ],
};

const categoryAliases: Partial<Record<BusinessCategory, BusinessCategory>> = {
  realestate: "professional",
  logistics: "professional",
  automotive: "retail",
  nonprofit: "creative",
  agriculture: "food",
  events: "creative",
  beauty: "wellness",
};

type Insight = {
  luxury: boolean;
  minimal: boolean;
  playful: boolean;
  technical: boolean;
  cinematic: boolean;
  dark: boolean;
  light: boolean;
  organic: boolean;
  heritage: boolean;
  bold: boolean;
  editorial: boolean;
  warm: boolean;
  /** A hotel-grade luxury request, as opposed to the word "premium" alone. */
  luxuryStrong: boolean;
  /** Palette requested in plain language, e.g. "terracotta accents". */
  palette?: PaletteId | undefined;
};

/**
 * Explicit colour words in the visitor's own description. The earliest mention
 * wins, because people name the colour they care about first.
 */
const paletteHints: ReadonlyArray<readonly [RegExp, PaletteId]> = [
  [/\b(terracotta|cream|ivory|parchment)\b/, "ivory-terracotta"],
  [/\b(forest|evergreen|emerald|deep green|pine)\b/, "forest-gold"],
  [/\b(midnight|champagne|navy|deep blue|royal blue)\b/, "midnight-champagne"],
  [
    /\b(monochrome|paper|ink|black and white|grayscale|greyscale)\b/,
    "paper-ink",
  ],
  [/\b(ocean|coastal|teal|seaside)\b/, "ocean-copper"],
  [/\b(sand|desert|olive|khaki)\b/, "sand-olive"],
  [/\b(graphite|neon|lime)\b/, "graphite-lime"],
  [/\b(plum|brass|burgundy|wine|aubergine)\b/, "plum-brass"],
  [/\b(sage|stone|moss)\b/, "stone-sage"],
  [/\b(cobalt|electric blue)\b/, "cobalt-cream"],
  [/\b(amber|charcoal|smoky|smoke)\b/, "charcoal-amber"],
  [/\b(clay|indigo|violet)\b/, "clay-indigo"],
  [/\b(coral|slate)\b/, "slate-coral"],
];

function readPaletteHint(value: string): PaletteId | undefined {
  let best: { palette: PaletteId; at: number } | undefined;
  for (const [pattern, palette] of paletteHints) {
    const at = value.search(pattern);
    if (at < 0) continue;
    if (!best || at < best.at) best = { palette, at };
  }
  return best?.palette;
}

function readInsight(value: string, category: BusinessCategory): Insight {
  const has = (terms: string[]) => terms.some((term) => value.includes(term));
  return {
    palette: readPaletteHint(value),
    luxuryStrong: has([
      "luxury",
      "luxurious",
      "high-end",
      "five star",
      "5 star",
      "exclusive",
      "bespoke",
      "expensive",
    ]),
    luxury: has([
      "luxury",
      "luxurious",
      "premium",
      "high-end",
      "five star",
      "5 star",
      "exclusive",
      "bespoke",
      "expensive",
    ]),
    minimal: has([
      "minimal",
      "minimalist",
      "clean",
      "simple",
      "understated",
      "quiet",
      "restrained",
      "swiss",
    ]),
    playful: has([
      "playful",
      "fun",
      "vibrant",
      "bold colour",
      "bold color",
      "energetic",
      "cheerful",
      "streetwear",
      "youthful",
    ]),
    technical: has([
      "technical",
      "technology",
      "software",
      "saas",
      "cyber",
      "engineering",
      "data",
      "platform",
      "futuristic",
      "apple",
    ]),
    cinematic: has([
      "cinematic",
      "dramatic",
      "moody",
      "atmospheric",
      "film",
      "immersive",
    ]),
    dark: has(["black", "dark", "midnight", "noir", "charcoal"]),
    light: has([
      "white",
      "light",
      "bright",
      "airy",
      "cream",
      "ivory",
      "pastel",
    ]),
    organic: has([
      "organic",
      "natural",
      "botanical",
      "earthy",
      "handmade",
      "rustic",
      "farm",
    ]),
    heritage: has([
      "heritage",
      "traditional",
      "classic",
      "timeless",
      "artisan",
      "vintage",
    ]),
    bold: has([
      "bold",
      "loud",
      "graphic",
      "poster",
      "high contrast",
      "statement",
    ]),
    editorial: has([
      "editorial",
      "magazine",
      "typographic",
      "serif",
      "literary",
    ]),
    warm: has([
      "warm",
      "cosy",
      "cozy",
      "inviting",
      "friendly",
      "terracotta",
      "amber",
    ]),
  };
}

function shift<T>(list: readonly T[], item: T, index: number): T {
  const position = list.indexOf(item);
  if (position < 0) return list[Math.max(0, index)] ?? item;
  return list[position] ?? item;
}

function applyInsight(
  bias: Bias,
  insight: Insight,
  seed: number,
): Pick<
  CreativeBlueprint,
  "direction" | "typography" | "colour" | "layout" | "motion"
> {
  const typographyCharacter = rotate(bias.typography, seed, 1);
  const direction = {
    concept: "",
    intensity: bias.intensity,
    balance: bias.balance,
    premium: bias.premium,
    density: (bias.intensity === "restrained"
      ? "sparse"
      : bias.intensity === "dramatic"
        ? "rich"
        : "measured") as CreativeBlueprint["direction"]["density"],
    shape: bias.shape,
    surface: bias.surface,
    whitespace: bias.whitespace,
    layering: (bias.surface === "layered"
      ? "overlap"
      : bias.surface === "void"
        ? "flat"
        : "depth") as CreativeBlueprint["direction"]["layering"],
  };
  const typography = {
    display: typographyCharacter,
    body: rotate(bias.typography, seed, 2),
    scale: (bias.intensity === "dramatic"
      ? "dramatic"
      : bias.intensity === "restrained"
        ? "restrained"
        : "balanced") as CreativeBlueprint["typography"]["scale"],
    contrast: (bias.intensity === "restrained"
      ? "subtle"
      : bias.intensity === "dramatic"
        ? "high"
        : "clear") as CreativeBlueprint["typography"]["contrast"],
    rhythm: bias.whitespace,
    treatment: (bias.kind === "technology" || bias.kind === "logistics"
      ? "technical"
      : bias.mood === "playful" ||
          bias.mood === "bold" ||
          bias.mood === "heritage"
        ? "expressive"
        : "editorial") as CreativeBlueprint["typography"]["treatment"],
  };
  const colour = {
    palette:
      insight.palette && bias.palette.includes(insight.palette)
        ? insight.palette
        : rotate(bias.palette, seed, 3),
    mood: bias.mood,
    environment: bias.environment,
    contrast: (bias.intensity === "dramatic"
      ? "bold"
      : bias.intensity === "restrained"
        ? "soft"
        : "clear") as CreativeBlueprint["colour"]["contrast"],
    accent: (bias.premium === "luxury"
      ? "single"
      : bias.mood === "playful"
        ? "dual"
        : "restrained") as CreativeBlueprint["colour"]["accent"],
    surfaces: (bias.surface === "layered"
      ? "stacked"
      : bias.surface === "glass"
        ? "glow"
        : "flat") as CreativeBlueprint["colour"]["surfaces"],
  };
  const layout = {
    composition: rotate(bias.composition, seed, 4),
    container: (bias.intensity === "dramatic" || bias.balance === "editorial"
      ? "wide"
      : bias.intensity === "restrained"
        ? "standard"
        : "wide") as CreativeBlueprint["layout"]["container"],
    symmetry: (bias.kind === "wellness" ||
    bias.kind === "beauty" ||
    bias.premium === "luxury"
      ? "symmetric"
      : "asymmetric") as CreativeBlueprint["layout"]["symmetry"],
    rhythm: bias.whitespace,
    density: direction.density,
    viewportUse: (bias.intensity === "dramatic"
      ? "full"
      : bias.intensity === "restrained"
        ? "modest"
        : "balanced") as CreativeBlueprint["layout"]["viewportUse"],
    alignment: (bias.kind === "wellness" || bias.kind === "beauty"
      ? "center"
      : "left") as CreativeBlueprint["layout"]["alignment"],
  };
  const motion = {
    family: bias.motion,
    intensity: (bias.premium === "luxury" || bias.intensity === "dramatic"
      ? "expressive"
      : "subtle") as CreativeBlueprint["motion"]["intensity"],
  };

  if (insight.luxury) {
    direction.premium = "luxury";
    direction.whitespace = "spacious";
    direction.surface = "layered";
    colour.environment = "dark";
    typography.display = "editorial-serif";
    typography.scale = "dramatic";
    motion.family = "luxury";
  }
  if (insight.minimal) {
    direction.intensity = "restrained";
    direction.density = "sparse";
    direction.whitespace = "spacious";
    direction.shape = "sharp";
    typography.treatment = "functional";
    layout.composition = "editorial-single-column";
    layout.container = "standard";
    motion.family = "quiet";
  }
  if (insight.playful) {
    direction.shape = "organic";
    direction.intensity = "expressive";
    typography.display = "expressive-display";
    motion.family = "playful";
  }
  if (insight.technical) {
    direction.shape = "sharp";
    direction.surface = "glass";
    typography.display = "geometric-technical";
    typography.treatment = "technical";
    layout.composition = "technical-grid";
    motion.family = "technical";
  }
  if (insight.cinematic) {
    motion.family = "cinematic";
    direction.intensity = "dramatic";
    colour.contrast = "bold";
    colour.mood = "cinematic";
  }
  if (insight.dark) colour.environment = "dark";
  if (insight.light) colour.environment = "light";
  if (insight.organic) {
    direction.shape = "organic";
    direction.surface = "grain";
    typography.display = shift(typographyCharacters, "humanist-warm", 0);
  }
  if (insight.heritage) {
    typography.display = "editorial-serif";
    direction.premium = "luxury";
    colour.mood = "heritage";
  }
  if (insight.bold) {
    direction.intensity = "dramatic";
    typography.display = "condensed-poster";
    typography.scale = "dramatic";
  }
  if (insight.editorial) {
    typography.display = "editorial-serif";
    direction.balance = "editorial";
  }
  if (insight.warm) {
    // "Warm ivory" describes a colour, not a mood: only treat warmth as the
    // mood when the visitor has not asked for a stronger direction.
    const stronger =
      insight.cinematic ||
      insight.luxury ||
      insight.heritage ||
      insight.playful ||
      insight.technical;
    if (!stronger) colour.mood = "warm";
    direction.shape = "soft";
  }
  return { direction, typography, colour, layout, motion };
}

/**
 * When the visitor states a direction in plain language ("make it cinematic",
 * "minimal", "luxury"), the hero should follow that direction rather than a
 * seed rotation. Only families the category actually supports are considered.
 */
function preferredHeroFamily(
  bias: Bias,
  insight: Insight,
  category: BusinessCategory,
): HeroFamily | undefined {
  // Another category's signature family is off limits: a technology company
  // asking for "minimal" must not open with the law practice's hero.
  const ownedElsewhere = new Set<HeroFamily>();
  for (const [key, value] of Object.entries(biases)) {
    if (key !== category) ownedElsewhere.add(value.hero[0]!);
  }
  const wants: HeroFamily[] = [];
  if (insight.luxuryStrong) wants.push("centered-luxury");
  if (insight.minimal) wants.push("minimal-professional");
  if (insight.cinematic) wants.push("cinematic-media");
  if (insight.bold || insight.playful) wants.push("poster-brutalist");
  if (insight.technical) wants.push("technical-grid");
  return wants.find(
    (family) => bias.hero.includes(family) && !ownedElsewhere.has(family),
  );
}

function plannedSectionsFor(
  category: BusinessCategory,
  seed: number,
  variation: number,
): PlannedSection[] {
  const sequence =
    sequences[categoryAliases[category] ?? category] ?? sequences.generic;
  const used = new Map<string, number>();
  return sequence.map((step, index) => {
    const count = (used.get(step.type) ?? 0) + 1;
    // The first version of a site uses each section's signature family (the
    // second occurrence of a type takes its second family, and so on), so the
    // initial concept is deterministic and intentionally composed. Requesting
    // a different version rotates the families instead.
    const variant =
      variation === 0
        ? (step.variants[(count - 1) % step.variants.length] ??
          step.variants[0]!)
        : rotate(step.variants, seed, index + variation);
    used.set(step.type, count);
    return {
      id: count === 1 ? step.type : `${step.type}-${count}`,
      type: step.type,
      variant,
      purpose: step.purpose,
      density: (index % 3 === 0
        ? "balanced"
        : index % 3 === 1
          ? "airy"
          : "compact") as PlannedSection["density"],
      treatment: (step.purpose === "convert" || step.purpose === "prove"
        ? "elevated"
        : step.purpose === "showcase"
          ? "plain"
          : "outlined") as PlannedSection["treatment"],
      motion: (step.purpose === "convert"
        ? "reveal"
        : index % 2 === 0
          ? "quiet"
          : "reveal") as PlannedSection["motion"],
    };
  });
}

function fingerprintId(parts: string[]): string {
  return parts
    .map((part) =>
      part
        .split("-")
        .map((token) => token.slice(0, 2))
        .join(""),
    )
    .join("-");
}

function sequenceId(planned: PlannedSection[]): string {
  return planned.map((step) => `${step.type}:${step.variant}`).join("|");
}

export type PlanOptions = { variation?: number };

export function planCreativeBlueprint(
  prompt: string,
  options: PlanOptions = {},
): CreativeBlueprint {
  const variation = Math.max(0, Math.min(99, options.variation ?? 0));
  const terms = extractPromptTerms(prompt);
  const profile = profiles[terms.category];
  const bias = biases[terms.category];
  const seed = hashString(`${terms.prompt.toLowerCase()}#${variation}`);
  const insight = readInsight(terms.prompt.toLowerCase(), terms.category);
  const shifted = applyInsight(bias, insight, seed);
  // Variation 0 is the category's signature look (or the family the visitor
  // explicitly asked for); every later variation is a genuinely different hero.
  const signatureHero =
    (variation === 0
      ? preferredHeroFamily(bias, insight, terms.category)
      : undefined) ?? bias.hero[0]!;
  const heroFamily =
    variation === 0
      ? signatureHero
      : rotate(
          bias.hero.filter((family) => family !== signatureHero),
          seed,
          variation + 1,
        );
  const planned = plannedSectionsFor(terms.category, seed, variation);
  const navigationFamily = rotate(bias.nav, seed, 2);
  const artDirection = rotate(
    bias.art,
    seed,
    planned.findIndex((step) => step.type === "gallery") + variation,
  );
  const siteCopy = buildSiteCopy(profile, terms, variation);

  return parseCreativeBlueprint({
    version: CREATIVE_BLUEPRINT_VERSION,
    business: {
      category: terms.category,
      kind: bias.kind,
      name: clampText(siteCopy.name, 60),
      descriptor: clampText(siteCopy.descriptor, 140),
      location: clampText(terms.place, 60),
      offer: siteCopy.offer,
      audience: siteCopy.audience,
      intent: siteCopy.intent,
      personality: siteCopy.personality,
      lead: terms.lead,
      sophistication:
        shifted.direction.premium === "luxury"
          ? "luxury"
          : shifted.direction.premium === "refined"
            ? "refined"
            : "considered",
      priorities: siteCopy.priorities,
    },
    direction: {
      ...shifted.direction,
      concept: siteCopy.concept,
    },
    typography: shifted.typography,
    colour: shifted.colour,
    layout: shifted.layout,
    navigation: {
      family: navigationFamily,
      density: (shifted.direction.density === "sparse"
        ? "minimal"
        : shifted.direction.density === "rich"
          ? "rich"
          : "standard") as CreativeBlueprint["navigation"]["density"],
      ctaPosition: (shifted.layout.alignment === "center"
        ? "center"
        : "right") as CreativeBlueprint["navigation"]["ctaPosition"],
      treatment: (shifted.colour.environment === "dark"
        ? "transparent"
        : shifted.direction.surface === "glass"
          ? "glass"
          : shifted.direction.balance === "editorial"
            ? "editorial"
            : "solid") as CreativeBlueprint["navigation"]["treatment"],
    },
    hero: {
      family: heroFamily,
      height: (shifted.layout.viewportUse === "full"
        ? "viewport"
        : shifted.layout.viewportUse === "modest"
          ? "compact"
          : "immersive") as CreativeBlueprint["hero"]["height"],
      media: heroMediaFor(heroFamily, artDirection),
      typographyPlacement: heroPlacementFor(heroFamily),
      cta: (shifted.direction.premium === "luxury"
        ? "stacked"
        : shifted.layout.alignment === "center"
          ? "bar"
          : "inline") as CreativeBlueprint["hero"]["cta"],
      motion: (shifted.motion.family === "quiet"
        ? "reveal"
        : shifted.motion.family === "cinematic"
          ? "parallax"
          : shifted.motion.family === "technical"
            ? "type-in"
            : "drift") as CreativeBlueprint["hero"]["motion"],
      artDirection,
    },
    sections: planned,
    motion: shifted.motion,
    cta: {
      character: bias.cta,
      label: siteCopy.ctaLabel,
      secondary: siteCopy.ctaSecondary,
    },
    mobile: {
      strategy: (heroFamily === "poster-brutalist" ||
      heroFamily === "technical-grid"
        ? "type-first"
        : heroFamily === "commerce-product" ||
            heroFamily === "editorial-typography"
          ? "card-stack"
          : "feature-first") as CreativeBlueprint["mobile"]["strategy"],
      heroHeight: (shifted.layout.viewportUse === "full"
        ? "compact"
        : "balanced") as CreativeBlueprint["mobile"]["heroHeight"],
      navigation: (shifted.direction.density === "rich"
        ? "standard"
        : "minimal") as CreativeBlueprint["mobile"]["navigation"],
      density: (shifted.direction.density === "rich"
        ? "balanced"
        : "compact") as CreativeBlueprint["mobile"]["density"],
      simplification: siteCopy.mobileSimplification,
    },
    fingerprint: {
      id: fingerprintId([
        shifted.layout.composition,
        heroFamily,
        navigationFamily,
        shifted.typography.display,
        artDirection,
      ]),
      composition: shifted.layout.composition,
      hero: heroFamily,
      navigation: navigationFamily,
      typography: shifted.typography.display,
      spacing: shifted.direction.whitespace,
      surface: shifted.direction.surface,
      palette: shifted.colour.palette,
      motion: shifted.motion.family,
      artDirection,
      sequence: sequenceId(planned),
    },
  });
}

function heroMediaFor(
  family: HeroFamily,
  art: ArtDirection,
): CreativeBlueprint["hero"]["media"] {
  switch (family) {
    case "editorial-typography":
      return "typographic";
    case "cinematic-media":
      return "panoramic-field";
    case "immersive-viewport":
      return "panoramic-field";
    case "technical-grid":
      return "grid-panel";
    case "commerce-product":
      return "layered-cards";
    case "hospitality-image-led":
      return "framed";
    case "layered-spatial":
      return "layered-cards";
    case "minimal-professional":
      return "none";
    case "poster-brutalist":
      return "typographic";
    default:
      return art === "geometric-composition" || art === "grid-technical"
        ? "geometric"
        : "abstract-gradient";
  }
}

function heroPlacementFor(
  family: HeroFamily,
): CreativeBlueprint["hero"]["typographyPlacement"] {
  switch (family) {
    case "cinematic-media":
    case "immersive-viewport":
      return "overlay";
    case "centered-luxury":
    case "poster-brutalist":
      return "center";
    case "split-composition":
    case "commerce-product":
      return "split";
    case "asymmetric-story":
    case "layered-spatial":
      return "offset";
    case "hospitality-image-led":
      return "bottom-left";
    default:
      return "left";
  }
}

export function blueprintFingerprint(blueprint: CreativeBlueprint): string {
  return blueprint.fingerprint.id;
}

/**
 * A deliberately different variation of an existing concept: new hero family,
 * new navigation family, new composition, shifted section variants and a
 * different palette rotation. Used by "show me a completely different
 * version", where switching colours alone is not acceptable.
 */
export function varyBlueprint(
  blueprint: CreativeBlueprint,
  variation: number,
): CreativeBlueprint {
  const next = Math.max(0, Math.min(99, variation));
  const bias = biases[blueprint.business.category];
  const seed = hashString(`${blueprint.business.name}#${next}#vary`);
  const heroIndex = bias.hero.indexOf(blueprint.hero.family);
  const navIndex = bias.nav.indexOf(blueprint.navigation.family);
  const compositionIndex = bias.composition.indexOf(
    blueprint.layout.composition,
  );
  const artIndex = bias.art.indexOf(blueprint.hero.artDirection);
  const paletteIndex = paletteIds.indexOf(blueprint.colour.palette);
  const shiftedHero =
    bias.hero[(Math.max(0, heroIndex) + 1) % bias.hero.length]!;
  const shiftedNav = bias.nav[(Math.max(0, navIndex) + 1) % bias.nav.length]!;
  const shiftedComposition =
    bias.composition[
      (Math.max(0, compositionIndex) + 1) % bias.composition.length
    ]!;
  const shiftedArt = bias.art[(Math.max(0, artIndex) + 1) % bias.art.length]!;
  const shiftedPalette =
    paletteIds[(Math.max(0, paletteIndex) + 3) % paletteIds.length]!;

  const planned = blueprint.sections.map((step, index) => {
    const sequence =
      sequences[
        categoryAliases[blueprint.business.category] ??
          blueprint.business.category
      ] ?? sequences.generic;
    const pool = sequence.find((entry) => entry.type === step.type);
    const variants = pool?.variants ?? [step.variant];
    const position = Math.max(0, variants.indexOf(step.variant));
    return {
      ...step,
      variant: variants[(position + 1) % variants.length]!,
      id: step.id,
      motion: (index % 2 === 0
        ? "reveal"
        : "quiet") as PlannedSection["motion"],
    };
  });
  const reordered = reorderSections(planned, seed);

  return parseCreativeBlueprint({
    ...blueprint,
    layout: {
      ...blueprint.layout,
      composition: shiftedComposition,
      viewportUse:
        shiftedComposition === "full-bleed-immersive"
          ? "full"
          : blueprint.layout.viewportUse,
    },
    navigation: { ...blueprint.navigation, family: shiftedNav },
    hero: {
      ...blueprint.hero,
      family: shiftedHero,
      artDirection: shiftedArt,
      media: heroMediaFor(shiftedHero, shiftedArt),
      typographyPlacement: heroPlacementFor(shiftedHero),
    },
    colour: { ...blueprint.colour, palette: shiftedPalette },
    sections: reordered,
    fingerprint: {
      ...blueprint.fingerprint,
      id: fingerprintId([
        shiftedComposition,
        shiftedHero,
        shiftedNav,
        blueprint.typography.display,
        shiftedArt,
      ]),
      composition: shiftedComposition,
      hero: shiftedHero,
      navigation: shiftedNav,
      artDirection: shiftedArt,
      palette: shiftedPalette,
      sequence: sequenceId(reordered),
    },
  });
}

function reorderSections(
  planned: PlannedSection[],
  seed: number,
): PlannedSection[] {
  if (planned.length < 4) return planned;
  const copy = [...planned];
  const first = 1;
  const last = copy.length - 1;
  const index = first + (Math.abs(seed) % Math.max(1, last - first));
  const [moved] = copy.splice(index, 1);
  if (!moved) return planned;
  copy.splice(first, 0, moved);
  return copy;
}

/**
 * Merge an AI creative patch into the deterministic blueprint. The merged
 * result is re-validated, so an invalid or malicious patch can only ever fall
 * back to the safe candidate.
 */
function mergeDefined<T extends Record<string, unknown>>(
  base: T,
  patch?: { [K in keyof T]?: T[K] | undefined },
): T {
  if (!patch) return base;
  const output: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) output[key] = value;
  }
  return output as T;
}

export function applyBlueprintPatch(
  blueprint: CreativeBlueprint,
  patch: CreativeBlueprintPatch,
): CreativeBlueprint {
  // Re-validate at the boundary: AI-generated patches (and anything else that
  // reaches this function) must reject unknown keys instead of smuggling them in.
  const safePatch = creativeBlueprintPatchSchema.parse(patch);
  const merged: CreativeBlueprint = {
    ...blueprint,
    business: mergeDefined(blueprint.business, patch.business),
    direction: mergeDefined(blueprint.direction, patch.direction),
    typography: mergeDefined(blueprint.typography, patch.typography),
    colour: mergeDefined(blueprint.colour, patch.colour),
    layout: mergeDefined(blueprint.layout, patch.layout),
    navigation: mergeDefined(blueprint.navigation, patch.navigation),
    hero: mergeDefined(blueprint.hero, patch.hero),
    motion: mergeDefined(blueprint.motion, patch.motion),
    cta: mergeDefined(blueprint.cta, patch.cta),
    mobile: mergeDefined(blueprint.mobile, patch.mobile),
    sections: blueprint.sections,
    fingerprint: blueprint.fingerprint,
  };
  if (safePatch.sections) {
    const used = new Map<string, number>();
    merged.sections = safePatch.sections.map((step, index) => {
      const count = (used.get(step.type) ?? 0) + 1;
      used.set(step.type, count);
      return {
        id: count === 1 ? step.type : `${step.type}-${count}`,
        type: step.type,
        variant: step.variant,
        purpose: step.purpose ?? "showcase",
        density: step.density ?? "balanced",
        treatment: step.treatment ?? "plain",
        motion: step.motion ?? (index % 2 === 0 ? "quiet" : "reveal"),
      };
    });
  }
  const withFingerprint: CreativeBlueprint = {
    ...merged,
    fingerprint: {
      ...blueprint.fingerprint,
      id: fingerprintId([
        merged.layout.composition,
        merged.hero.family,
        merged.navigation.family,
        merged.typography.display,
        merged.hero.artDirection,
      ]),
      composition: merged.layout.composition,
      hero: merged.hero.family,
      navigation: merged.navigation.family,
      typography: merged.typography.display,
      spacing: merged.direction.whitespace,
      surface: merged.direction.surface,
      palette: merged.colour.palette,
      motion: merged.motion.family,
      artDirection: merged.hero.artDirection,
      sequence: sequenceId(merged.sections),
    },
  };
  return parseCreativeBlueprint(withFingerprint);
}

/* ------------------------------------------------------------------ *
 * Blueprint → DesignSpec
 * ------------------------------------------------------------------ */

function mapTypography(character: TypographyCharacter): TypographyId {
  const map: Record<TypographyCharacter, TypographyId> = {
    "editorial-serif": "editorial-serif",
    "humanist-warm": "humanist",
    "grotesk-modern": "modern-grotesk",
    "geometric-technical": "geometric-technical",
    "mono-technical": "mono-technical",
    "expressive-display": "expressive-display",
    "condensed-poster": "condensed-poster",
  };
  return map[character];
}

function mapMood(mood: string, environment: "light" | "dark" | "tinted"): Mood {
  const allowed: Mood[] = [
    "luxury",
    "editorial",
    "minimal",
    "cinematic",
    "warm",
    "modern",
    "bold",
    "playful",
    "professional",
    "organic",
    "technical",
    "bright",
    "serene",
    "industrial",
    "heritage",
  ];
  const candidate = allowed.find((entry) => entry === mood);
  if (candidate) return candidate;
  return environment === "dark" ? "cinematic" : "modern";
}

function sectionTone(
  blueprint: CreativeBlueprint,
  index: number,
): DesignSection["tone"] {
  const rhythm = blueprint.layout.rhythm;
  if (blueprint.colour.environment === "dark") {
    return index === 0 ? "inherit" : index % 3 === 0 ? "light" : "inherit";
  }
  if (rhythm === "cadenced") {
    return index % 3 === 2
      ? "accent"
      : index % 3 === 0 && index > 0
        ? "dark"
        : "inherit";
  }
  if (
    blueprint.motion.intensity === "expressive" &&
    index > 0 &&
    index % 2 === 0
  ) {
    return "accent";
  }
  return "inherit";
}

function sectionHeight(
  blueprint: CreativeBlueprint,
  planned: PlannedSection,
  index: number,
): DesignSection["layout"]["height"] {
  if (index === 0) {
    return blueprint.hero.height === "compact"
      ? "compact"
      : blueprint.hero.height === "balanced"
        ? "balanced"
        : "immersive";
  }
  if (
    planned.variant.includes("immersive") ||
    planned.variant.includes("full-bleed")
  ) {
    return "immersive";
  }
  return planned.density === "compact" ? "compact" : "balanced";
}

function mediaFor(
  blueprint: CreativeBlueprint,
  planned: PlannedSection,
): DesignSection["visualTreatment"]["media"] {
  const variant = planned.variant;
  if (
    variant.includes("gallery") ||
    variant.includes("mosaic") ||
    variant.includes("collage")
  ) {
    return "mosaic";
  }
  if (planned.type === "hero") {
    return blueprint.hero.media === "panoramic-field"
      ? "panoramic"
      : blueprint.hero.media === "none"
        ? "none"
        : blueprint.hero.media === "layered-cards" ||
            blueprint.hero.media === "framed"
          ? "portrait"
          : "abstract";
  }
  if (
    variant.includes("rail") ||
    variant.includes("strip") ||
    variant.includes("panoramic")
  ) {
    return "panoramic";
  }
  if (blueprint.hero.media === "none" && planned.type !== "gallery")
    return "none";
  return "portrait";
}

function buildSection(
  blueprint: CreativeBlueprint,
  profile: Profile,
  terms: PromptTerms,
  planned: PlannedSection,
  index: number,
): DesignSection {
  const copy = buildSectionCopy(profile, blueprint, planned, index, terms);
  const contentType = planned.type;
  return {
    id: planned.id,
    type: contentType,
    variant: planned.variant,
    content: {
      eyebrow: copy.eyebrow,
      title: copy.title,
      body: copy.body,
      primaryCta: copy.primaryCta,
      secondaryCta: copy.secondaryCta,
      items: copy.items.slice(0, 8).map((item, position) => ({
        title: item.title,
        body: item.body,
        meta: item.meta ?? "",
        accent: item.accent ?? String(position + 1).padStart(2, "0"),
      })),
      stats: copy.stats.slice(0, 4),
      note: copy.note,
    },
    layout: {
      alignment:
        index === 0
          ? blueprint.layout.alignment
          : planned.purpose === "convert"
            ? blueprint.layout.alignment
            : "left",
      density: planned.density,
      height: sectionHeight(blueprint, planned, index),
      textScale:
        blueprint.direction.intensity === "dramatic"
          ? "expressive"
          : blueprint.direction.intensity === "restrained"
            ? "compact"
            : "balanced",
      fullBleed:
        planned.treatment === "immersive" ||
        planned.variant.includes("full-bleed") ||
        (index === 0 && blueprint.hero.height === "viewport"),
    },
    visualTreatment: {
      media: mediaFor(blueprint, planned),
      contrast:
        blueprint.colour.contrast === "bold"
          ? "high"
          : blueprint.colour.contrast === "soft"
            ? "low"
            : "medium",
      surface: planned.treatment,
    },
    motion: planned.motion,
    tone: sectionTone(blueprint, index),
  };
}

const navStyleMap: Record<NavigationFamily, DesignSpec["navigation"]["style"]> =
  {
    "minimal-centered": "minimal-centered",
    "editorial-split": "editorial-split",
    "floating-capsule": "floating-capsule",
    "transparent-overlay": "transparent-overlay",
    "compact-professional": "compact-professional",
    "immersive-brand": "immersive-brand",
    "utility-bar": "utility-bar",
  };

export function blueprintToDesignSpec(
  blueprint: CreativeBlueprint,
  termsInput?: PromptTerms,
): DesignSpec {
  const terms: PromptTerms = termsInput ?? {
    prompt: blueprint.business.descriptor,
    seed: 0,
    category: blueprint.business.category,
    location: blueprint.business.location,
    place: blueprint.business.location,
    lead: blueprint.business.lead,
    words: [],
  };
  const profile = profiles[blueprint.business.category];
  const heroPlanned: PlannedSection = {
    id: "hero",
    type: "hero",
    variant: blueprint.hero.family,
    purpose: "introduce",
    density: blueprint.direction.density === "rich" ? "balanced" : "airy",
    treatment: "plain",
    motion:
      blueprint.hero.motion === "none" || blueprint.hero.motion === "reveal"
        ? "reveal"
        : "drift",
  };
  const sections = [heroPlanned, ...blueprint.sections].map((planned, index) =>
    buildSection(blueprint, profile, terms, planned, index),
  );
  const heroSection = sections[0]!;
  const navItems = sections
    .filter((section, index) => index > 0 && index <= 5)
    .map((section) => ({
      // Navigation labels have their own (short) limit: an eyebrow written for
      // a section heading can easily be twice as long.
      label: clampText(
        section.content.eyebrow ||
          section.content.title.split(" ").slice(0, 2).join(" "),
        30,
      ),
      target: `#${section.id}`,
    }));
  const siteCopy = buildSiteCopy(profile, terms, 0);

  return designSpecSchema.parse({
    schemaVersion: DESIGN_SPEC_VERSION,
    site: {
      name: blueprint.business.name,
      descriptor: blueprint.business.descriptor,
      businessKind: blueprint.business.kind,
      location: blueprint.business.location,
    },
    brand: {
      tagline: heroSection.content.title,
      voice:
        blueprint.direction.premium === "luxury"
          ? "reserved"
          : blueprint.motion.family === "playful"
            ? "energetic"
            : blueprint.typography.treatment === "technical"
              ? "precise"
              : blueprint.colour.mood === "warm"
                ? "warm"
                : "confident",
    },
    theme: {
      palette: blueprint.colour.palette,
      mood: mapMood(blueprint.colour.mood, blueprint.colour.environment),
      typography: mapTypography(blueprint.typography.display),
      spacing:
        blueprint.direction.whitespace === "spacious"
          ? "expansive"
          : blueprint.direction.whitespace === "tight"
            ? "compact"
            : "balanced",
      radius:
        blueprint.direction.shape === "sharp"
          ? "sharp"
          : blueprint.direction.shape === "rounded" ||
              blueprint.direction.shape === "organic"
            ? "rounded"
            : "subtle",
      surface:
        blueprint.direction.surface === "layered" ||
        blueprint.direction.surface === "void"
          ? "layered"
          : blueprint.direction.surface,
      motion:
        blueprint.motion.family === "cinematic"
          ? "cinematic"
          : blueprint.motion.family === "playful"
            ? "energetic"
            : blueprint.motion.family === "quiet"
              ? "quiet"
              : "fluid",
      headingScale:
        blueprint.typography.scale === "dramatic"
          ? "expressive"
          : blueprint.typography.scale === "restrained"
            ? "compact"
            : "balanced",
      bodyScale:
        blueprint.direction.density === "rich"
          ? "small"
          : blueprint.direction.density === "sparse"
            ? "large"
            : "balanced",
      buttonStyle:
        blueprint.direction.shape === "sharp"
          ? "sharp"
          : blueprint.direction.shape === "organic"
            ? "pill"
            : "subtle",
      rhythm:
        blueprint.layout.rhythm === "cadenced"
          ? "cadenced"
          : blueprint.layout.rhythm === "spacious"
            ? "measured"
            : "even",
      composition: blueprint.layout.composition,
    },
    navigation: {
      style: navStyleMap[blueprint.navigation.family],
      ctaLabel: blueprint.cta.label,
      items:
        navItems.length > 0
          ? navItems
          : [{ label: "Overview", target: `#${heroSection.id}` }],
    },
    pages: [
      {
        slug: "/",
        title: "Home",
        navigationLabel: "Home",
        sections,
      },
    ],
    footer: {
      variant:
        blueprint.direction.balance === "editorial"
          ? "statement"
          : blueprint.direction.premium === "luxury"
            ? "editorial"
            : "columns",
      statement: siteCopy.footerStatement,
    },
    responsive: {
      mobileHero:
        blueprint.mobile.strategy === "type-first"
          ? "type-first"
          : blueprint.mobile.strategy === "card-stack"
            ? "stacked"
            : "cropped",
      mobileDensity: blueprint.mobile.density,
      collapseNavigation: true,
      overrides: {
        simplified: blueprint.mobile.strategy === "condense",
        heroHeight: blueprint.mobile.heroHeight,
        headingScale:
          blueprint.typography.scale === "dramatic" ? "balanced" : "compact",
        navigation: blueprint.mobile.navigation,
      },
    },
    metadata: {
      source: "fallback",
      conceptLabel: siteCopy.conceptLabel,
      revision: 1,
      promptSeed: terms.seed,
      variation: termsInput ? 0 : 0,
      fingerprint: blueprint.fingerprint.id,
      blueprint,
    },
  });
}

/**
 * Deterministic entry point used when Workers AI is unavailable, when the
 * provider fails, or when its output is rejected by the schema.
 */
export function generateFallbackDesignSpec(
  prompt: string,
  options: PlanOptions = {},
): DesignSpec {
  const terms = extractPromptTerms(prompt);
  const blueprint = planCreativeBlueprint(prompt, options);
  const spec = blueprintToDesignSpec(blueprint, terms);
  return designSpecSchema.parse({
    ...spec,
    metadata: {
      ...spec.metadata,
      variation: Math.max(0, Math.min(99, options.variation ?? 0)),
    },
  });
}

export function blueprintFromSpec(spec: DesignSpec): CreativeBlueprint {
  const stored = spec.metadata.blueprint;
  if (stored) {
    const parsed = creativeBlueprintSchema.safeParse(stored);
    if (parsed.success) return parsed.data;
  }
  const category = categoryFromKind(spec.site.businessKind);
  const bias = biases[category];
  const hero = heroFamilyFromVariant(spec.pages[0]?.sections[0]?.variant ?? "");
  const planned: PlannedSection[] = (spec.pages[0]?.sections ?? [])
    .slice(1)
    .map((section): PlannedSection => ({
      id: section.id,
      type: section.type,
      variant: section.variant,
      purpose: "showcase",
      density: section.layout.density,
      treatment: section.visualTreatment.surface,
      motion: section.motion,
    }))
    .filter((step) => step.type !== "hero");
  const sequence =
    planned.length >= 4 ? planned : plannedSectionsFor(category, 0, 0);
  return parseCreativeBlueprint({
    version: CREATIVE_BLUEPRINT_VERSION,
    business: {
      category,
      kind: spec.site.businessKind,
      name: spec.site.name,
      descriptor: spec.site.descriptor,
      location: spec.site.location,
      offer: spec.navigation.items[0]?.label ?? "Overview",
      audience: "visitors deciding what to do next",
      intent: "understand the offer and take the next step",
      personality: spec.brand.voice,
      lead: "",
      sophistication: "considered",
      priorities: sequence.slice(0, 3).map((step) => step.type),
    },
    direction: {
      concept: spec.metadata.conceptLabel,
      intensity: "considered",
      balance: "hybrid",
      premium: "refined",
      density: "measured",
      shape: "soft",
      surface: "matte",
      whitespace: "even",
      layering: "depth",
    },
    typography: {
      display: "grotesk-modern",
      body: "grotesk-modern",
      scale: "balanced",
      contrast: "clear",
      rhythm: "even",
      treatment: "editorial",
    },
    colour: {
      palette: spec.theme.palette,
      mood: spec.theme.mood,
      environment: "light",
      contrast: "clear",
      accent: "restrained",
      surfaces: "flat",
    },
    layout: {
      composition: bias.composition[0]!,
      container: "standard",
      symmetry: "asymmetric",
      rhythm: "even",
      density: "measured",
      viewportUse: "balanced",
      alignment: "left",
    },
    navigation: {
      family: bias.nav[0]!,
      density: "standard",
      ctaPosition: "right",
      treatment: "solid",
    },
    hero: {
      family: hero,
      height: "balanced",
      media: "abstract-gradient",
      typographyPlacement: "left",
      cta: "inline",
      motion: "reveal",
      artDirection: bias.art[0]!,
    },
    sections: sequence,
    motion: { family: "quiet", intensity: "subtle" },
    cta: {
      character: "enquiry",
      label: spec.navigation.ctaLabel,
      secondary: "",
    },
    mobile: {
      strategy: "feature-first",
      heroHeight: "balanced",
      navigation: "minimal",
      density: "compact",
      simplification: ["Condense the hero", "Stack sections"],
    },
    fingerprint: {
      id: fingerprintId([
        bias.composition[0]!,
        hero,
        bias.nav[0]!,
        "grotesk-modern",
        bias.art[0]!,
      ]),
      composition: bias.composition[0]!,
      hero,
      navigation: bias.nav[0]!,
      typography: "grotesk-modern",
      spacing: "even",
      surface: "matte",
      palette: spec.theme.palette,
      motion: "quiet",
      artDirection: bias.art[0]!,
      sequence: sequenceId(sequence),
    },
  });
}

function categoryFromKind(
  kind: DesignSpec["site"]["businessKind"],
): BusinessCategory {
  switch (kind) {
    case "hotel":
      return "hospitality";
    case "restaurant":
      return "food";
    case "travel":
      return "travel";
    case "retail":
      return "retail";
    case "fashion":
      return "fashion";
    case "professional":
      return "professional";
    case "technology":
      return "technology";
    case "creative":
      return "creative";
    case "fitness":
      return "fitness";
    case "wellness":
    case "beauty":
      return "wellness";
    case "healthcare":
      return "healthcare";
    case "education":
      return "education";
    case "realestate":
      return "realestate";
    case "automotive":
      return "automotive";
    case "events":
      return "events";
    case "logistics":
      return "logistics";
    case "nonprofit":
      return "nonprofit";
    case "agriculture":
      return "agriculture";
    case "personal":
      return "personal";
    default:
      return "generic";
  }
}

function heroFamilyFromVariant(variant: string): HeroFamily {
  const direct = heroFamilies.find((family) => family === variant);
  if (direct) return direct;
  const legacy: Record<string, HeroFamily> = {
    "cinematic-editorial": "editorial-typography",
    "immersive-image": "immersive-viewport",
    "minimal-luxury": "centered-luxury",
    "bold-typographic": "poster-brutalist",
    "product-focused": "commerce-product",
    "hospitality-focused": "hospitality-image-led",
    "split-composition": "split-composition",
  };
  return legacy[variant] ?? "editorial-typography";
}

/**
 * Re-derives a spec from a (possibly changed) blueprint while preserving the
 * visitor's own copy wherever the section still exists. This is how
 * "use a completely different hero" or "make this feel more exclusive"
 * restructures the composition without discarding edited text.
 */
export function applyBlueprintToSpec(
  spec: DesignSpec,
  blueprint: CreativeBlueprint,
  options: { preserveCopy?: boolean; preservePresentation?: boolean } = {},
): DesignSpec {
  const preserveCopy = options.preserveCopy ?? true;
  const preservePresentation = options.preservePresentation ?? false;
  const previous = new Map<string, DesignSection>();
  for (const page of spec.pages) {
    for (const section of page.sections) {
      if (!previous.has(section.id)) previous.set(section.id, section);
      if (!previous.has(section.type)) previous.set(section.type, section);
    }
  }
  const terms: PromptTerms = {
    prompt: blueprint.business.descriptor,
    seed: spec.metadata.promptSeed,
    category: blueprint.business.category,
    location: blueprint.business.location,
    place: blueprint.business.location,
    lead: blueprint.business.lead,
    words: [],
  };
  const rebuilt = blueprintToDesignSpec(blueprint, terms);
  const sections: DesignSection[] = rebuilt.pages[0]!.sections.map((fresh) => {
    if (!preserveCopy) return fresh;
    const existing =
      previous.get(fresh.id) ?? previous.get(fresh.type) ?? undefined;
    if (!existing || existing.type !== fresh.type) return fresh;
    if (!preservePresentation) {
      return {
        ...fresh,
        content: existing.content,
      };
    }
    return {
      ...fresh,
      content: existing.content,
      variant: existing.variant,
      layout: existing.layout,
      visualTreatment: existing.visualTreatment,
      motion: existing.motion,
      tone: existing.tone,
    };
  });

  return designSpecSchema.parse({
    ...rebuilt,
    navigation: {
      ...rebuilt.navigation,
      items: rebuilt.navigation.items.map((item, index) => {
        const existing = spec.navigation.items[index];
        return existing ? { ...item, label: existing.label } : item;
      }),
    },
    pages: [{ ...rebuilt.pages[0]!, sections }],
    metadata: {
      source: "modified",
      conceptLabel: rebuilt.metadata.conceptLabel,
      revision: Math.min(999, spec.metadata.revision + 1),
      promptSeed: spec.metadata.promptSeed,
      variation: Math.max(spec.metadata.variation, 0),
      fingerprint: blueprint.fingerprint.id,
      blueprint,
    },
  });
}

/** "Show me a completely different version" — a new concept, not a recolour. */
export function createAlternateDesignSpec(
  input: DesignSpec,
  options: { structural?: boolean } = {},
): DesignSpec {
  const structural = options.structural ?? true;
  const blueprint = blueprintFromSpec(input);
  const next = varyBlueprint(blueprint, input.metadata.variation + 1);
  const rebuilt = blueprintToDesignSpec(next, {
    prompt: blueprint.business.descriptor,
    seed: input.metadata.promptSeed,
    category: next.business.category,
    location: next.business.location,
    place: next.business.location,
    lead: next.business.lead,
    words: [],
  });
  if (!structural) {
    return applyBlueprintToSpec(input, next);
  }
  return designSpecSchema.parse({
    ...rebuilt,
    metadata: {
      ...rebuilt.metadata,
      source: "modified",
      revision: Math.min(999, input.metadata.revision + 1),
      promptSeed: input.metadata.promptSeed,
      variation: input.metadata.variation + 1,
      conceptLabel: `New ${next.direction.concept} direction`,
      blueprint: next,
    },
  });
}
