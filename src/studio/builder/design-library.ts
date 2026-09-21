import {
  applyBlueprintPatch,
  applyBlueprintToSpec,
  blueprintFromSpec,
  generateFallbackDesignSpec,
  type ArtDirection,
  type BusinessCategory,
  type CompositionFamily,
  type CreativeBlueprintPatch,
  type HeroFamily,
  type MotionFamily,
  type NavigationFamily,
  type SpacingRhythm,
  type SurfaceSystem,
  type TypographyCharacter,
} from "./blueprint";
import {
  sectionVariantRegistry,
  type DesignSpec,
  type PaletteId,
  type SectionType,
} from "./domain";

/**
 * Premium design library.
 *
 * A curated registry of complete design directions. Every preset is expressed
 * in Studio's own design grammar (hero family, composition, typography, palette,
 * motion, art direction, section sequence) and is applied through the same
 * validated blueprint pipeline a visitor's own description uses — so a preset
 * can never introduce markup, script or styling the renderer does not own.
 *
 * The registry is internal-only: `license` and `source` are recorded so that
 * third-party (for example MIT-licensed) templates can be adapted into the same
 * shape later, once their licence and compatibility have been verified.
 */

export const designCategories = [
  "Luxury",
  "Fashion",
  "Restaurant",
  "Hospitality",
  "Technology",
  "Professional",
  "Healthcare",
  "Ecommerce",
  "Fitness",
  "Travel",
  "Creative",
  "Local Business",
] as const;

export type DesignCategory = (typeof designCategories)[number];

export type DesignGrammar = {
  /** Business category the preview is generated from. */
  category: BusinessCategory;
  /** A plain business description used to seed the preview (never personal). */
  examplePrompt: string;
  hero: HeroFamily;
  navigation: NavigationFamily;
  composition: CompositionFamily;
  typography: TypographyCharacter;
  palette: PaletteId;
  art: ArtDirection;
  motion: MotionFamily;
  spacing: SpacingRhythm;
  surface: SurfaceSystem;
  /** Intended section order, applied through the validated section grammar. */
  sectionOrder: SectionType[];
  /** How the direction is meant to feel on a large screen. */
  desktop: string;
  /** How the same direction simplifies on a phone. */
  mobile: string;
};

export type DesignPreset = {
  id: string;
  name: string;
  category: DesignCategory;
  tags: string[];
  summary: string;
  grammar: DesignGrammar;
  license: "internal";
  source: "gstpixel";
};

const preset = (
  id: string,
  name: string,
  category: DesignCategory,
  tags: string[],
  summary: string,
  grammar: DesignGrammar,
): DesignPreset => ({
  id,
  name,
  category,
  tags,
  summary,
  grammar,
  license: "internal",
  source: "gstpixel",
});

export const designPresets: readonly DesignPreset[] = [
  preset(
    "champagne-atelier",
    "Champagne Atelier",
    "Luxury",
    ["luxury", "centred", "serif", "gold"],
    "A centred, ceremonial hero with generous white space and a single accent — for jewellery, couture and high-value services.",
    {
      category: "jewellery",
      examplePrompt:
        "Luxury jewellery house with bridal collections and private viewings",
      hero: "centered-luxury",
      navigation: "minimal-centered",
      composition: "centered-symmetric",
      typography: "editorial-serif",
      palette: "midnight-champagne",
      art: "light-shafts",
      motion: "luxury",
      spacing: "spacious",
      surface: "layered",
      sectionOrder: [
        "hero",
        "listings",
        "about",
        "gallery",
        "features",
        "cta",
        "contact",
      ],
      desktop: "Wide margins, centred headline, one product shelf per screen.",
      mobile: "Headline shrinks first, shelves become single-column cards.",
    },
  ),
  preset(
    "quiet-monolith",
    "Quiet Monolith",
    "Luxury",
    ["architectural", "asymmetric", "restrained"],
    "Architectural asymmetry with large single-colour fields and heavy type — for property, architecture and premium studios.",
    {
      category: "construction",
      examplePrompt:
        "Architecture and interior design studio delivering turnkey projects",
      hero: "layered-spatial",
      navigation: "compact-professional",
      composition: "asymmetric-grid",
      typography: "expressive-display",
      palette: "stone-sage",
      art: "monolith",
      motion: "cinematic",
      spacing: "cadenced",
      surface: "matte",
      sectionOrder: [
        "hero",
        "listings",
        "services",
        "features",
        "about",
        "cta",
        "contact",
      ],
      desktop: "Offset grid, oversized headings, images cropped by the layout.",
      mobile: "Single column with cropped media and reduced overlap.",
    },
  ),
  preset(
    "runway-poster",
    "Runway Poster",
    "Fashion",
    ["streetwear", "poster", "bold", "uppercase"],
    "Poster-scale type over a dark field with hard edges — for streetwear, drops and campaign-led brands.",
    {
      category: "fashion",
      examplePrompt: "Streetwear brand with seasonal drops and a lookbook",
      hero: "poster-brutalist",
      navigation: "utility-bar",
      composition: "poster-stack",
      typography: "condensed-poster",
      palette: "paper-ink",
      art: "typographic-art",
      motion: "playful",
      spacing: "tight",
      surface: "void",
      sectionOrder: ["hero", "gallery", "listings", "about", "cta", "contact"],
      desktop:
        "Full-bleed campaign frames, text over image, tight vertical rhythm.",
      mobile: "Campaign frames stack at native ratio with captions below.",
    },
  ),
  preset(
    "boutique-editorial",
    "Boutique Editorial",
    "Fashion",
    ["boutique", "editorial", "warm", "masonry"],
    "A warm masonry edit of collections and craft — for boutiques, tailoring houses and artisan makers.",
    {
      category: "fashion",
      examplePrompt: "Boutique clothing store selling curated everyday wear",
      hero: "editorial-typography",
      navigation: "editorial-split",
      composition: "masonry-editorial",
      typography: "humanist-warm",
      palette: "plum-brass",
      art: "framed-print",
      motion: "editorial",
      spacing: "even",
      surface: "paper",
      sectionOrder: [
        "hero",
        "listings",
        "gallery",
        "about",
        "features",
        "contact",
      ],
      desktop:
        "Editorial columns, framed imagery, product rails inline with copy.",
      mobile: "One column, images edge to edge, sticky enquiry button.",
    },
  ),
  preset(
    "warm-table",
    "Warm Table",
    "Restaurant",
    ["cafe", "warm", "menu", "paper"],
    "Paper-warm hospitality with an unmissable menu and an easy booking path — for cafés and everyday dining.",
    {
      category: "food",
      examplePrompt:
        "Neighbourhood cafe serving breakfast, coffee and light lunch",
      hero: "split-composition",
      navigation: "editorial-split",
      composition: "editorial-single-column",
      typography: "humanist-warm",
      palette: "ivory-terracotta",
      art: "grain-field",
      motion: "editorial",
      spacing: "cadenced",
      surface: "paper",
      sectionOrder: [
        "hero",
        "services",
        "about",
        "gallery",
        "features",
        "contact",
      ],
      desktop: "Menu beside a warm interior image, generous section breaks.",
      mobile: "Menu first, hours and directions within one thumb reach.",
    },
  ),
  preset(
    "chefs-counter",
    "Chef's Counter",
    "Restaurant",
    ["fine-dining", "cinematic", "dark", "amber"],
    "Low-lit cinematic dining with plated detail and a reservation-first rhythm — for fine dining and tasting rooms.",
    {
      category: "food",
      examplePrompt:
        "Fine dining restaurant with a seasonal tasting menu and reservations",
      hero: "asymmetric-story",
      navigation: "transparent-overlay",
      composition: "asymmetric-grid",
      typography: "editorial-serif",
      palette: "charcoal-amber",
      art: "editorial-rule",
      motion: "cinematic",
      spacing: "spacious",
      surface: "layered",
      sectionOrder: [
        "hero",
        "services",
        "gallery",
        "about",
        "features",
        "cta",
        "contact",
      ],
      desktop: "Dark field, amber accents, dish imagery at close crop.",
      mobile: "Reservation action stays sticky; gallery becomes a swipe rail.",
    },
  ),
  preset(
    "ridge-retreat",
    "Ridge Retreat",
    "Hospitality",
    ["resort", "immersive", "nature", "cinematic"],
    "A full-viewport landscape entrance with room shelves and a direct enquiry path — for resorts and retreats.",
    {
      category: "hospitality",
      examplePrompt:
        "Mountain resort with rooms, a restaurant and booking enquiries",
      hero: "hospitality-image-led",
      navigation: "transparent-overlay",
      composition: "full-bleed-immersive",
      typography: "editorial-serif",
      palette: "forest-gold",
      art: "light-shafts",
      motion: "cinematic",
      spacing: "spacious",
      surface: "layered",
      sectionOrder: [
        "hero",
        "about",
        "listings",
        "gallery",
        "features",
        "services",
        "contact",
      ],
      desktop: "Full-bleed imagery, rooms compared in a horizontal shelf.",
      mobile: "Hero condenses to a framed image; rooms stack as cards.",
    },
  ),
  preset(
    "city-stay",
    "City Stay",
    "Hospitality",
    ["hotel", "minimal", "cobalt", "grid"],
    "A crisp, business-ready hotel direction with quick facts and availability routes — for city hotels and serviced stays.",
    {
      category: "hospitality",
      examplePrompt:
        "Business hotel in the city centre with rooms and long-stay options",
      hero: "minimal-professional",
      navigation: "compact-professional",
      composition: "index-driven",
      typography: "grotesk-modern",
      palette: "cobalt-cream",
      art: "grid-technical",
      motion: "quiet",
      spacing: "even",
      surface: "soft",
      sectionOrder: [
        "hero",
        "listings",
        "features",
        "about",
        "gallery",
        "contact",
      ],
      desktop: "Fact-led hero, room index in a scannable grid.",
      mobile: "Key facts collapse into a single summary band.",
    },
  ),
  preset(
    "signal-grid",
    "Signal Grid",
    "Technology",
    ["saas", "technical", "lime", "product"],
    "A technical grid hero with capability blocks and a low-friction contact path — for software and data companies.",
    {
      category: "technology",
      examplePrompt:
        "Software company building automation tools for growing businesses",
      hero: "technical-grid",
      navigation: "utility-bar",
      composition: "technical-grid",
      typography: "geometric-technical",
      palette: "graphite-lime",
      art: "grid-technical",
      motion: "technical",
      spacing: "even",
      surface: "matte",
      sectionOrder: [
        "hero",
        "features",
        "services",
        "about",
        "features",
        "cta",
        "contact",
      ],
      desktop: "Grid-led layout, capability blocks, diagram-style artwork.",
      mobile: "Blocks become a vertical stack with one action per screen.",
    },
  ),
  preset(
    "product-story",
    "Product Story",
    "Technology",
    ["product", "calm", "split", "clean"],
    "A calm split hero that explains one product properly before anything else — for focused products and apps.",
    {
      category: "technology",
      examplePrompt: "Software product helping small teams manage their work",
      hero: "split-composition",
      navigation: "floating-capsule",
      composition: "split-dual",
      typography: "grotesk-modern",
      palette: "paper-ink",
      art: "geometric-composition",
      motion: "quiet",
      spacing: "spacious",
      surface: "soft",
      sectionOrder: ["hero", "features", "services", "about", "cta", "contact"],
      desktop: "Copy left, product panel right, calm spacing throughout.",
      mobile: "Product panel moves below the action, no horizontal scroll.",
    },
  ),
  preset(
    "case-file",
    "Case File",
    "Professional",
    ["consulting", "legal", "editorial", "precise"],
    "A precise, evidence-first direction with numbered services and FAQ depth — for consultants and professional practices.",
    {
      category: "professional",
      examplePrompt:
        "Accounting and advisory practice helping small businesses stay compliant",
      hero: "minimal-professional",
      navigation: "compact-professional",
      composition: "editorial-single-column",
      typography: "editorial-serif",
      palette: "paper-ink",
      art: "editorial-rule",
      motion: "quiet",
      spacing: "spacious",
      surface: "paper",
      sectionOrder: [
        "hero",
        "services",
        "about",
        "features",
        "features",
        "contact",
      ],
      desktop: "Numbered service index, wide margins, quiet rules.",
      mobile: "Numbers become anchors; FAQ stays collapsed and tappable.",
    },
  ),
  preset(
    "care-path",
    "Care Path",
    "Healthcare",
    ["clinic", "reassuring", "steps", "calm"],
    "A reassuring, step-by-step direction that answers patient questions before the visit — for clinics and practices.",
    {
      category: "healthcare",
      examplePrompt:
        "Dental clinic caring for families with clear appointment steps",
      hero: "editorial-typography",
      navigation: "compact-professional",
      composition: "split-dual",
      typography: "humanist-warm",
      palette: "cobalt-cream",
      art: "organic-halo",
      motion: "quiet",
      spacing: "spacious",
      surface: "soft",
      sectionOrder: [
        "hero",
        "services",
        "features",
        "about",
        "features",
        "cta",
        "contact",
      ],
      desktop:
        "Care steps laid out plainly with soft artwork and no alarm imagery.",
      mobile: "Appointment action stays reachable; FAQs open in place.",
    },
  ),
  preset(
    "shelf-first",
    "Shelf First",
    "Ecommerce",
    ["shop", "catalogue", "grid", "range"],
    "Category-first commerce with sample-labelled shelves and a simple enquiry path — for retailers and online shops.",
    {
      category: "supplements",
      examplePrompt:
        "Online store selling protein supplements and multivitamins",
      hero: "commerce-product",
      navigation: "utility-bar",
      composition: "modular-bento",
      typography: "grotesk-modern",
      palette: "stone-sage",
      art: "geometric-composition",
      motion: "technical",
      spacing: "even",
      surface: "soft",
      sectionOrder: [
        "hero",
        "listings",
        "listings",
        "listings",
        "features",
        "features",
        "cta",
        "contact",
      ],
      desktop: "Category rail, product grids, clearly labelled sample content.",
      mobile:
        "Two-up product grid with filters inline, nothing wider than the screen.",
    },
  ),
  preset(
    "local-goods",
    "Local Goods",
    "Local Business",
    ["local", "shop", "warm", "visit"],
    "A neighbourhood-first direction that makes visiting, hours and local delivery obvious — for shops serving a town.",
    {
      category: "retail",
      examplePrompt:
        "Local clothing store selling to customers in the neighbourhood",
      hero: "minimal-professional",
      navigation: "minimal-centered",
      composition: "index-driven",
      typography: "humanist-warm",
      palette: "sand-olive",
      art: "framed-print",
      motion: "editorial",
      spacing: "even",
      surface: "paper",
      sectionOrder: [
        "hero",
        "listings",
        "listings",
        "about",
        "features",
        "contact",
      ],
      desktop:
        "Shop identity first, collections second, visiting details third.",
      mobile: "Address, hours and call action stay above the fold.",
    },
  ),
  preset(
    "training-floor",
    "Training Floor",
    "Fitness",
    ["gym", "energetic", "programs", "bold"],
    "An energetic, program-led direction with schedule and contact always in reach — for gyms and trainers.",
    {
      category: "fitness",
      examplePrompt:
        "Gym offering personal training, group classes and membership plans",
      hero: "technical-grid",
      navigation: "utility-bar",
      composition: "asymmetric-grid",
      typography: "condensed-poster",
      palette: "graphite-lime",
      art: "monolith",
      motion: "playful",
      spacing: "tight",
      surface: "matte",
      sectionOrder: [
        "hero",
        "services",
        "features",
        "about",
        "gallery",
        "contact",
      ],
      desktop:
        "Bold program blocks, timetable-style artwork, energetic accents.",
      mobile: "Programs stack with the enquiry action pinned in reach.",
    },
  ),
  preset(
    "expedition",
    "Expedition",
    "Travel",
    ["travel", "immersive", "routes", "cinematic"],
    "A route-led immersive direction that sells the journey before the logistics — for tour operators and travel companies.",
    {
      category: "travel",
      examplePrompt:
        "Tour company running guided mountain journeys and holiday packages",
      hero: "immersive-viewport",
      navigation: "immersive-brand",
      composition: "full-bleed-immersive",
      typography: "condensed-poster",
      palette: "ocean-copper",
      art: "light-shafts",
      motion: "cinematic",
      spacing: "spacious",
      surface: "glass",
      sectionOrder: [
        "hero",
        "services",
        "listings",
        "gallery",
        "about",
        "features",
        "cta",
      ],
      desktop: "Full-bleed destination frames, routes summarised as cards.",
      mobile: "Frames crop to portrait; itinerary steps become an accordion.",
    },
  ),
  preset(
    "portfolio-bento",
    "Portfolio Bento",
    "Creative",
    ["studio", "bento", "expressive", "work"],
    "An expressive bento of selected work with a manifesto beat — for studios, agencies and creative practices.",
    {
      category: "creative",
      examplePrompt:
        "Design studio showing selected brand and digital projects",
      hero: "layered-spatial",
      navigation: "floating-capsule",
      composition: "modular-bento",
      typography: "expressive-display",
      palette: "plum-brass",
      art: "layered-surfaces",
      motion: "playful",
      spacing: "cadenced",
      surface: "layered",
      sectionOrder: [
        "hero",
        "services",
        "gallery",
        "about",
        "features",
        "cta",
        "contact",
      ],
      desktop: "Bento tiles of different sizes, oversized statement type.",
      mobile: "Tiles become a single column; decorative layers trimmed.",
    },
  ),
];

/** Ordered list for the browse grid, filtered by category when provided. */
export function listDesignPresets(
  category?: DesignCategory | "All",
): readonly DesignPreset[] {
  if (!category || category === "All") return designPresets;
  return designPresets.filter((entry) => entry.category === category);
}

export function designPresetById(id: string): DesignPreset | undefined {
  return designPresets.find((entry) => entry.id === id);
}

/**
 * Translate a preset into a validated CreativeBlueprint patch.
 *
 * Section order is expressed as a sequence of allowed section types; each step
 * takes a variant that already exists in the section grammar, so a preset can
 * change *composition* without inventing new component types.
 */
export function designPresetPatch(
  presetEntry: DesignPreset,
): CreativeBlueprintPatch {
  const grammar = presetEntry.grammar;
  const used = new Map<string, number>();
  // The hero is a blueprint field of its own (blueprint.hero) and is built
  // separately, so it is never part of the section sequence — which also keeps
  // a preset from ever producing two heroes.
  const sections = grammar.sectionOrder
    .filter((type) => type !== "hero")
    .map((type) => {
      const count = (used.get(type) ?? 0) + 1;
      used.set(type, count);
      const variants = sectionVariantRegistry[type];
      return { type, variant: variants[0]! };
    });

  return {
    direction: {
      premium: grammar.category === "jewellery" ? "luxury" : "refined",
      intensity: "considered",
      balance: "hybrid",
      density: "measured",
    },
    typography: {
      display: grammar.typography,
      body: grammar.typography,
      rhythm: grammar.spacing,
    },
    colour: { palette: grammar.palette },
    layout: {
      composition: grammar.composition,
      rhythm: grammar.spacing,
      symmetry:
        grammar.composition === "centered-symmetric"
          ? "symmetric"
          : "asymmetric",
    },
    navigation: { family: grammar.navigation },
    hero: { family: grammar.hero, artDirection: grammar.art },
    motion: { family: grammar.motion },
    sections,
  };
}

/**
 * Build a complete, validated spec for a preset. A preset is a *design*
 * direction, so the preview is generated from the preset's own example
 * business description and then locked to the preset's design grammar.
 */
export function designPresetSpec(presetEntry: DesignPreset): DesignSpec {
  const seed = generateFallbackDesignSpec(presetEntry.grammar.examplePrompt);
  return applyBlueprintToSpec(
    seed,
    applyBlueprintPatch(
      blueprintFromSpec(seed),
      designPresetPatch(presetEntry),
    ),
  );
}

/** Lightweight palette/art metadata for the browse grid thumbnails. */
export function designPresetSwatches(presetEntry: DesignPreset): {
  palette: PaletteId;
  art: ArtDirection;
} {
  return { palette: presetEntry.grammar.palette, art: presetEntry.grammar.art };
}
