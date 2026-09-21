import { z } from "zod";

export const DESIGN_SPEC_VERSION = 2 as const;

export const businessKinds = [
  "hotel",
  "travel",
  "restaurant",
  "retail",
  "professional",
  "fitness",
  "generic",
] as const;
export const moods = [
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
] as const;
export const paletteIds = [
  "forest-gold",
  "ivory-terracotta",
  "midnight-champagne",
  "paper-ink",
  "ocean-copper",
  "sand-olive",
  "graphite-lime",
] as const;
export const typographyIds = [
  "editorial-serif",
  "modern-grotesk",
  "humanist",
  "high-contrast",
] as const;
export const heroVariants = [
  "cinematic-editorial",
  "immersive-image",
  "split-composition",
  "minimal-luxury",
  "bold-typographic",
  "product-focused",
  "hospitality-focused",
] as const;
export const sectionTypes = [
  "hero",
  "about",
  "services",
  "gallery",
  "listings",
  "testimonials",
  "features",
  "cta",
  "contact",
] as const;

export type BusinessKind = (typeof businessKinds)[number];
export type Mood = (typeof moods)[number];
export type PaletteId = (typeof paletteIds)[number];
export type TypographyId = (typeof typographyIds)[number];
export type HeroVariant = (typeof heroVariants)[number];
export type SectionType = (typeof sectionTypes)[number];

export const sectionVariantRegistry = {
  hero: heroVariants,
  about: [
    "editorial-story",
    "asymmetric-media",
    "founder-profile",
    "values",
    "minimal-intro",
  ],
  services: [
    "editorial-list",
    "visual-grid",
    "horizontal-showcase",
    "immersive-panels",
    "compact-cards",
  ],
  gallery: [
    "cinematic-mosaic",
    "full-bleed",
    "editorial-grid",
    "horizontal-gallery",
  ],
  listings: [
    "premium-listing",
    "comparison",
    "image-showcase",
    "featured-item",
  ],
  testimonials: ["minimal-quote", "editorial-quotes"],
  features: ["icon-list", "structured-editorial", "visual-blocks"],
  cta: ["minimal", "cinematic", "split", "contact-focused"],
  contact: ["concise", "detailed", "location-composition"],
} as const satisfies Record<SectionType, readonly string[]>;

const unsafeText = [
  /<\/?[a-z][^>]*>/i,
  /\bjavascript\s*:/i,
  /\bdata\s*:\s*text\/html/i,
  /<\s*script\b/i,
  /\bon(?:error|load|click|mouseover)\s*=/i,
  /```/,
  /\b(?:document|window|eval)\s*[.(]/i,
] as const;

function normalizedText(max: number, min = 0) {
  return z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(min)
        .max(max)
        .refine(
          (value) => !unsafeText.some((pattern) => pattern.test(value)),
          "Text contains unsupported content.",
        ),
    );
}

const safeTarget = z
  .string()
  .max(80)
  .regex(
    /^(?:#[a-z0-9-]+|\/[a-z0-9\-/]*)$/i,
    "Navigation target is not allowed.",
  );

const itemSchema = z
  .object({
    title: normalizedText(90, 1),
    body: normalizedText(220).default(""),
    meta: normalizedText(80).default(""),
    accent: normalizedText(50).default(""),
  })
  .strict();

const statSchema = z
  .object({ value: normalizedText(24, 1), label: normalizedText(60, 1) })
  .strict();

const contentSchema = z
  .object({
    eyebrow: normalizedText(70).default(""),
    title: normalizedText(110, 1),
    body: normalizedText(420).default(""),
    primaryCta: normalizedText(50).default(""),
    secondaryCta: normalizedText(50).default(""),
    items: z.array(itemSchema).max(8).default([]),
    stats: z.array(statSchema).max(4).default([]),
    note: normalizedText(140).default(""),
  })
  .strict();

const sectionSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]{1,48}$/),
    type: z.enum(sectionTypes),
    variant: z.string().min(1).max(40),
    content: contentSchema,
    layout: z
      .object({
        alignment: z.enum(["left", "center", "right"]),
        density: z.enum(["airy", "balanced", "compact"]),
        height: z
          .enum(["compact", "balanced", "immersive"])
          .default("balanced"),
        textScale: z
          .enum(["compact", "balanced", "expressive"])
          .default("balanced"),
        fullBleed: z.boolean(),
      })
      .strict(),
    visualTreatment: z
      .object({
        media: z.enum(["panoramic", "portrait", "mosaic", "abstract", "none"]),
        contrast: z.enum(["low", "medium", "high"]),
        surface: z.enum(["plain", "elevated", "outlined", "immersive"]),
      })
      .strict(),
    motion: z.enum(["quiet", "reveal", "drift", "snap"]),
    tone: z.enum(["inherit", "dark", "light", "accent"]).default("inherit"),
  })
  .strict();

const pageSchema = z
  .object({
    slug: z.string().regex(/^\/[a-z0-9\-/]*$/),
    title: normalizedText(70, 1),
    navigationLabel: normalizedText(30, 1),
    sections: z.array(sectionSchema).min(1).max(14),
  })
  .strict();

export const designSpecSchema = z
  .object({
    schemaVersion: z.literal(DESIGN_SPEC_VERSION),
    site: z
      .object({
        name: normalizedText(80, 1),
        descriptor: normalizedText(140, 1),
        businessKind: z.enum(businessKinds),
        location: normalizedText(80).default(""),
      })
      .strict(),
    brand: z
      .object({
        tagline: normalizedText(110, 1),
        voice: z.enum([
          "confident",
          "warm",
          "reserved",
          "energetic",
          "precise",
        ]),
      })
      .strict(),
    theme: z
      .object({
        palette: z.enum(paletteIds),
        mood: z.enum(moods),
        typography: z.enum(typographyIds),
        spacing: z.enum(["compact", "balanced", "expansive"]),
        radius: z.enum(["sharp", "subtle", "rounded"]),
        surface: z.enum(["matte", "soft", "glass", "layered"]),
        motion: z.enum(["quiet", "fluid", "cinematic", "energetic"]),
        headingScale: z
          .enum(["compact", "balanced", "expressive"])
          .default("balanced"),
        bodyScale: z.enum(["small", "balanced", "large"]).default("balanced"),
        buttonStyle: z
          .enum(["sharp", "subtle", "rounded", "pill"])
          .default("subtle"),
      })
      .strict(),
    navigation: z
      .object({
        style: z.enum(["minimal", "floating", "editorial", "solid"]),
        ctaLabel: normalizedText(40, 1),
        items: z
          .array(
            z
              .object({ label: normalizedText(30, 1), target: safeTarget })
              .strict(),
          )
          .min(1)
          .max(8),
      })
      .strict(),
    pages: z.array(pageSchema).min(1).max(6),
    footer: z
      .object({
        variant: z.enum(["minimal", "editorial", "columns", "statement"]),
        statement: normalizedText(160, 1),
      })
      .strict(),
    responsive: z
      .object({
        mobileHero: z.enum(["stacked", "cropped", "type-first"]),
        mobileDensity: z.enum(["compact", "balanced"]),
        collapseNavigation: z.boolean(),
        overrides: z
          .object({
            simplified: z.boolean(),
            heroHeight: z.enum(["compact", "balanced"]),
            headingScale: z.enum(["compact", "balanced"]),
            navigation: z.enum(["minimal", "standard"]),
          })
          .strict()
          .default({
            simplified: false,
            heroHeight: "balanced",
            headingScale: "balanced",
            navigation: "standard",
          }),
      })
      .strict(),
    metadata: z
      .object({
        source: z.enum(["fallback", "ai", "modified"]),
        conceptLabel: normalizedText(60, 1),
        revision: z.number().int().min(1).max(999),
      })
      .strict(),
  })
  .strict()
  .superRefine((spec, context) => {
    const slugs = new Set<string>();
    for (const page of spec.pages) {
      if (slugs.has(page.slug)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Page slugs must be unique.",
        });
      }
      slugs.add(page.slug);
      const ids = new Set<string>();
      page.sections.forEach((section, index) => {
        if (ids.has(section.id)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Section ids must be unique.",
          });
        }
        ids.add(section.id);
        if (
          !sectionVariantRegistry[section.type].includes(
            section.variant as never,
          )
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Section variant is not allowed for ${section.type}.`,
          });
        }
        if ((index === 0) !== (section.type === "hero")) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each page must begin with exactly one hero.",
          });
        }
      });
    }
  });

export type DesignSpec = z.infer<typeof designSpecSchema>;
export type DesignSection = DesignSpec["pages"][number]["sections"][number];

export function parseDesignSpec(value: unknown): DesignSpec {
  return designSpecSchema.parse(value);
}

function includesAny(value: string, terms: readonly string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function inferBusinessKind(prompt: string): BusinessKind {
  const value = prompt.toLowerCase();
  if (includesAny(value, ["hotel", "resort", "rooms", "stay", "hospitality"]))
    return "hotel";
  if (includesAny(value, ["tour", "travel", "journey", "destination"]))
    return "travel";
  if (
    includesAny(value, [
      "restaurant",
      "café",
      "cafe",
      "menu",
      "coffee",
      "bakery",
    ])
  )
    return "restaurant";
  if (includesAny(value, ["shop", "store", "retail", "product", "commerce"]))
    return "retail";
  if (includesAny(value, ["gym", "fitness", "training", "wellness", "yoga"]))
    return "fitness";
  if (
    includesAny(value, [
      "consult",
      "law",
      "agency",
      "professional",
      "corporate",
      "service",
    ])
  )
    return "professional";
  return "generic";
}

function inferPalette(prompt: string, kind: BusinessKind): PaletteId {
  const value = prompt.toLowerCase();
  if (includesAny(value, ["black", "champagne", "midnight"]))
    return "midnight-champagne";
  if (includesAny(value, ["green", "forest", "gold"])) return "forest-gold";
  if (includesAny(value, ["terracotta", "cream", "ivory"]))
    return "ivory-terracotta";
  if (includesAny(value, ["blue", "ocean", "coastal"])) return "ocean-copper";
  if (includesAny(value, ["lime", "electric"])) return "graphite-lime";
  if (includesAny(value, ["light", "white", "monochrome"])) return "paper-ink";
  return kind === "restaurant"
    ? "ivory-terracotta"
    : kind === "hotel"
      ? "forest-gold"
      : "paper-ink";
}

function inferMood(prompt: string, kind: BusinessKind): Mood {
  const value = prompt.toLowerCase();
  if (
    includesAny(value, [
      "technology",
      "software",
      "platform",
      "futuristic",
      "apple-style",
      "apple like",
      "apple-like",
    ])
  )
    return "technical";
  for (const mood of moods) if (value.includes(mood)) return mood;
  if (includesAny(value, ["elegant", "luxurious", "premium"])) return "luxury";
  if (kind === "restaurant") return "warm";
  if (kind === "hotel" || kind === "travel") return "cinematic";
  if (kind === "professional") return "professional";
  return "modern";
}

function section(
  id: string,
  type: SectionType,
  variant: string,
  content: Partial<DesignSection["content"]> &
    Pick<DesignSection["content"], "title">,
  options: Partial<Pick<DesignSection, "motion">> & {
    alignment?: DesignSection["layout"]["alignment"];
    density?: DesignSection["layout"]["density"];
    height?: DesignSection["layout"]["height"];
    textScale?: DesignSection["layout"]["textScale"];
    fullBleed?: boolean;
    media?: DesignSection["visualTreatment"]["media"];
    contrast?: DesignSection["visualTreatment"]["contrast"];
    surface?: DesignSection["visualTreatment"]["surface"];
    tone?: DesignSection["tone"];
  } = {},
): DesignSection {
  return {
    id,
    type,
    variant,
    content: {
      eyebrow: "",
      body: "",
      primaryCta: "",
      secondaryCta: "",
      items: [],
      stats: [],
      note: "",
      ...content,
    },
    layout: {
      alignment: options.alignment ?? "left",
      density: options.density ?? "balanced",
      height: options.height ?? "balanced",
      textScale: options.textScale ?? "balanced",
      fullBleed: options.fullBleed ?? false,
    },
    visualTreatment: {
      media: options.media ?? "abstract",
      contrast: options.contrast ?? "medium",
      surface: options.surface ?? "plain",
    },
    motion: options.motion ?? "reveal",
    tone: options.tone ?? "inherit",
  };
}

const hotelSections = (): DesignSection[] => [
  section(
    "hero",
    "hero",
    "hospitality-focused",
    {
      eyebrow: "A private retreat near Jaigaon",
      title: "Where the forest opens to the mountains.",
      body: "Fifteen considered rooms, long mountain views and unhurried dining — shaped into a stay that feels removed, yet easy to reach.",
      primaryCta: "Enquire about a stay",
      secondaryCta: "Explore the rooms",
      stats: [
        { value: "15", label: "rooms" },
        { value: "01", label: "mountain restaurant" },
        { value: "∞", label: "open views" },
      ],
      note: "Concept website — details can be tailored to the property.",
    },
    {
      fullBleed: true,
      media: "panoramic",
      contrast: "high",
      surface: "immersive",
      motion: "drift",
    },
  ),
  section(
    "story",
    "about",
    "asymmetric-media",
    {
      eyebrow: "The feeling of the place",
      title: "A slower rhythm at the edge of the hills.",
      body: "The experience is organised around quiet mornings, generous views and thoughtful hospitality. The website gives each part room to breathe before inviting a direct enquiry.",
      items: [
        {
          title: "Arrive gently",
          body: "A clear path from location and rooms to a simple booking conversation.",
          meta: "The welcome",
          accent: "01",
        },
        {
          title: "Stay connected to place",
          body: "Landscape, food and local discovery become one coherent story.",
          meta: "The experience",
          accent: "02",
        },
      ],
    },
    { media: "portrait", surface: "elevated" },
  ),
  section(
    "rooms",
    "listings",
    "image-showcase",
    {
      eyebrow: "Rooms & private stays",
      title: "Fifteen rooms. Three distinct ways to settle in.",
      body: "A concise room collection designed to help guests compare atmosphere and fit without invented claims or booking friction.",
      items: [
        {
          title: "Forest Room",
          body: "A calm, intimate room framed by deep green views.",
          meta: "Quiet side · 2 guests",
          accent: "01",
        },
        {
          title: "Ridge Room",
          body: "An open outlook and a generous place to pause.",
          meta: "Mountain side · 2 guests",
          accent: "02",
        },
        {
          title: "House Suite",
          body: "More space for longer stays and slower mornings.",
          meta: "Separate lounge · flexible stay",
          accent: "03",
        },
      ],
    },
    { media: "mosaic", surface: "plain" },
  ),
  section(
    "amenities",
    "features",
    "structured-editorial",
    {
      eyebrow: "Everything that matters",
      title: "Comfort, food and the landscape — considered together.",
      items: [
        {
          title: "Mountain-facing moments",
          body: "View-led spaces and outdoor pauses become a visual thread through the site.",
          meta: "Landscape",
          accent: "View",
        },
        {
          title: "Restaurant on the property",
          body: "A dedicated dining story with a clear route to menus and enquiries.",
          meta: "Dining",
          accent: "Taste",
        },
        {
          title: "Direct booking enquiries",
          body: "A confident call to action without pretending a booking engine already exists.",
          meta: "Enquiries",
          accent: "Stay",
        },
      ],
    },
    { surface: "outlined" },
  ),
  section(
    "gallery",
    "gallery",
    "cinematic-mosaic",
    {
      eyebrow: "A sense of arrival",
      title: "Light, timber, forest and far horizons.",
      body: "An art-directed gallery treatment gives the imagined property atmosphere while remaining clearly conceptual.",
      items: [
        { title: "Morning ridge", body: "", meta: "Landscape", accent: "01" },
        { title: "Quiet interior", body: "", meta: "Room", accent: "02" },
        {
          title: "Dinner after dusk",
          body: "",
          meta: "Restaurant",
          accent: "03",
        },
        { title: "Forest approach", body: "", meta: "Arrival", accent: "04" },
      ],
    },
    { fullBleed: true, media: "mosaic", contrast: "high" },
  ),
  section("restaurant", "services", "horizontal-showcase", {
    eyebrow: "The restaurant",
    title: "Evenings gathered around a warm table.",
    body: "A flexible dining section ready for the real menu, opening hours and reservation details when supplied.",
    items: [
      {
        title: "Breakfast with the view",
        body: "A quiet start designed around the pace of the stay.",
        meta: "Morning",
        accent: "01",
      },
      {
        title: "Season-led dinner",
        body: "A concise food story that can evolve with the kitchen.",
        meta: "Evening",
        accent: "02",
      },
      {
        title: "Private table enquiries",
        body: "An easy route for special occasions and group requests.",
        meta: "Gather",
        accent: "03",
      },
    ],
  }),
  section(
    "enquire",
    "cta",
    "cinematic",
    {
      eyebrow: "Plan the stay",
      title: "Come for the view. Stay for the quiet.",
      body: "Share preferred dates and the kind of stay you have in mind. Availability and details can be confirmed directly.",
      primaryCta: "Start a booking enquiry",
      secondaryCta: "Ask a question",
    },
    {
      alignment: "center",
      fullBleed: true,
      contrast: "high",
      surface: "immersive",
    },
  ),
  section(
    "contact",
    "contact",
    "location-composition",
    {
      eyebrow: "Near Jaigaon",
      title: "Close to the gateway. A world away in feeling.",
      body: "Use this section for verified directions, travel notes and direct contact details when the property is ready to publish.",
      items: [
        {
          title: "Booking enquiries",
          body: "Direct conversation for room and dining requests.",
          meta: "Contact",
          accent: "01",
        },
        {
          title: "Getting here",
          body: "Add accurate route guidance and transfer information.",
          meta: "Location",
          accent: "02",
        },
      ],
    },
    { media: "abstract", surface: "elevated" },
  ),
];

const cafeSections = (): DesignSection[] => [
  section(
    "hero",
    "hero",
    "split-composition",
    {
      eyebrow: "Coffee · Plates · Good company",
      title: "A bright corner for slow coffee and lively tables.",
      body: "A warm, editorial café website that puts today’s menu, the room and the next visit within easy reach.",
      primaryCta: "See the menu",
      secondaryCta: "Plan a visit",
      note: "Concept menu and imagery can be replaced with verified details.",
    },
    { media: "portrait", surface: "plain", motion: "reveal" },
  ),
  section("menu", "services", "editorial-list", {
    eyebrow: "A short, friendly menu",
    title: "Made for morning rituals and long lunches.",
    items: [
      {
        title: "Coffee & slow pours",
        body: "Espresso classics and a rotating filter selection.",
        meta: "All day",
        accent: "01",
      },
      {
        title: "Breakfast plates",
        body: "Simple, seasonal combinations made to order.",
        meta: "Morning",
        accent: "02",
      },
      {
        title: "Bakes from the counter",
        body: "A changing edit of warm, sweet and savoury things.",
        meta: "Daily",
        accent: "03",
      },
    ],
  }),
  section(
    "story",
    "about",
    "editorial-story",
    {
      eyebrow: "Why this place exists",
      title: "Neighbourhood energy, carefully made.",
      body: "Friendly typography, warm space and an uncomplicated story make the café feel human rather than over-designed.",
    },
    { alignment: "center", density: "airy" },
  ),
  section(
    "gallery",
    "gallery",
    "editorial-grid",
    {
      eyebrow: "Around the room",
      title: "Terracotta, cream and the colour of fresh coffee.",
      items: [
        {
          title: "The morning counter",
          body: "",
          meta: "Coffee",
          accent: "01",
        },
        { title: "A table in the sun", body: "", meta: "Space", accent: "02" },
        { title: "From the kitchen", body: "", meta: "Food", accent: "03" },
      ],
    },
    { media: "mosaic" },
  ),
  section(
    "visit",
    "contact",
    "concise",
    {
      eyebrow: "Come by",
      title: "Your next favourite table could be here.",
      body: "Add verified opening hours, address and contact details before publishing.",
      primaryCta: "Get directions",
      items: [
        {
          title: "Opening hours",
          body: "Add the café’s verified weekly schedule.",
          meta: "Visit",
          accent: "01",
        },
        {
          title: "Table enquiries",
          body: "Keep larger-group questions simple and direct.",
          meta: "Contact",
          accent: "02",
        },
      ],
    },
    { surface: "elevated" },
  ),
];

function genericSections(kind: BusinessKind, mood: Mood): DesignSection[] {
  const labels: Record<
    BusinessKind,
    { name: string; title: string; offer: string }
  > = {
    travel: {
      name: "NORTHBOUND JOURNEYS",
      title: "Go further, with every detail made clear.",
      offer: "Journeys",
    },
    retail: {
      name: "FIELD OBJECTS",
      title: "Useful things, chosen with a point of view.",
      offer: "Collections",
    },
    professional: {
      name: "MERIDIAN PRACTICE",
      title: "Clarity for decisions that matter.",
      offer: "Services",
    },
    fitness: {
      name: "FORM STUDIO",
      title: "Progress begins with a plan you can follow.",
      offer: "Programs",
    },
    generic: {
      name: "YOUR BUSINESS",
      title: "A clearer way to understand what you do.",
      offer: "What we offer",
    },
    hotel: {
      name: "MOUNTAIN HOUSE",
      title: "Stay where the horizon slows down.",
      offer: "Rooms",
    },
    restaurant: {
      name: "COMMON TABLE",
      title: "A table worth making time for.",
      offer: "Menu",
    },
  };
  const copy =
    kind === "generic" && mood === "technical"
      ? {
          name: "SIGNAL SYSTEMS",
          title: "Technology that disappears into the work.",
          offer: "Products",
        }
      : labels[kind];
  const hero = section(
    "hero",
    "hero",
    kind === "retail"
      ? "product-focused"
      : kind === "fitness"
        ? "bold-typographic"
        : kind === "travel"
          ? "immersive-image"
          : kind === "professional"
            ? "split-composition"
            : mood === "technical"
              ? "minimal-luxury"
              : "cinematic-editorial",
    {
      eyebrow: copy.name,
      title: copy.title,
      body: "A premium, adaptable website concept built from the business description — ready for real details and imagery.",
      primaryCta:
        kind === "retail" ? "Explore the collection" : "Start a conversation",
      secondaryCta: `Discover ${copy.offer.toLowerCase()}`,
    },
    {
      fullBleed: true,
      contrast: "high",
      surface: mood === "technical" ? "plain" : "immersive",
      media:
        kind === "travel"
          ? "panoramic"
          : kind === "retail"
            ? "portrait"
            : mood === "technical"
              ? "none"
              : "abstract",
      density: kind === "fitness" ? "compact" : "airy",
      height: mood === "technical" ? "compact" : "immersive",
      motion:
        kind === "fitness" ? "snap" : mood === "technical" ? "quiet" : "drift",
    },
  );
  const about = section(
    "about",
    "about",
    kind === "professional"
      ? "editorial-story"
      : kind === "fitness"
        ? "values"
        : mood === "technical"
          ? "minimal-intro"
          : "asymmetric-media",
    {
      eyebrow: "The point of view",
      title: "Designed to make the business understood and remembered.",
      body: "Clear hierarchy, deliberate pacing and useful calls to action create a website that feels specific rather than generic.",
    },
    {
      media:
        kind === "travel"
          ? "panoramic"
          : mood === "technical"
            ? "none"
            : "portrait",
      density: mood === "technical" ? "airy" : "balanced",
    },
  );
  const offerings = section(
    "offerings",
    kind === "retail" ? "listings" : "services",
    kind === "retail"
      ? "premium-listing"
      : kind === "travel"
        ? "immersive-panels"
        : kind === "fitness"
          ? "horizontal-showcase"
          : kind === "professional"
            ? "editorial-list"
            : mood === "technical"
              ? "compact-cards"
              : "visual-grid",
    {
      eyebrow: copy.offer,
      title: `A focused way to explore ${copy.offer.toLowerCase()}.`,
      items: [
        {
          title: `${copy.offer} one`,
          body: "Replace this conceptual description with a verified offering.",
          meta: "Featured",
          accent: "01",
        },
        {
          title: `${copy.offer} two`,
          body: "A second clear path for visitors with a different need.",
          meta: "Considered",
          accent: "02",
        },
        {
          title: `${copy.offer} three`,
          body: "A final supporting option without unnecessary complexity.",
          meta: "Flexible",
          accent: "03",
        },
      ],
    },
    {
      density:
        kind === "professional" || mood === "technical"
          ? "compact"
          : "balanced",
      surface: kind === "travel" ? "immersive" : "plain",
    },
  );
  const features = section(
    "features",
    "features",
    kind === "professional"
      ? "structured-editorial"
      : kind === "fitness"
        ? "icon-list"
        : "visual-blocks",
    {
      eyebrow: "Why it works",
      title: "The useful details, given visual presence.",
      items: [
        {
          title: "Easy to understand",
          body: "Visitors can see the offer and next step quickly.",
          meta: "Clarity",
          accent: "01",
        },
        {
          title: "Built for trust",
          body: "The design avoids claims that the business has not supplied.",
          meta: "Confidence",
          accent: "02",
        },
        {
          title: "Ready to evolve",
          body: "The structure can grow with new pages and sections.",
          meta: "Flexible",
          accent: "03",
        },
      ],
    },
    { density: kind === "fitness" ? "compact" : "balanced" },
  );
  const contact = section(
    "contact",
    "cta",
    mood === "technical"
      ? "minimal"
      : kind === "travel"
        ? "cinematic"
        : kind === "professional"
          ? "contact-focused"
          : "split",
    {
      eyebrow: "Next step",
      title: "Turn interest into a real conversation.",
      body: "Use a clear enquiry action and add verified contact details before publishing.",
      primaryCta: "Get in touch",
      secondaryCta: "Learn more",
    },
    {
      fullBleed: true,
      surface: "elevated",
      alignment: mood === "technical" ? "center" : "left",
    },
  );
  const gallery = section(
    "gallery",
    "gallery",
    kind === "travel" ? "full-bleed" : "editorial-grid",
    {
      eyebrow: kind === "travel" ? "The journey in view" : "In context",
      title:
        kind === "travel"
          ? "Places that make the route worth taking."
          : "Objects, details and the world around them.",
      items: [
        { title: "First impression", body: "", meta: "View", accent: "01" },
        { title: "A closer detail", body: "", meta: "Detail", accent: "02" },
        { title: "In use", body: "", meta: "Experience", accent: "03" },
      ],
    },
    { media: "mosaic", contrast: "high", surface: "immersive" },
  );

  if (kind === "travel")
    return [hero, offerings, gallery, about, features, contact];
  if (kind === "retail")
    return [hero, offerings, gallery, about, features, contact];
  if (kind === "fitness") return [hero, features, offerings, about, contact];
  if (kind === "professional")
    return [hero, offerings, about, features, contact];
  if (mood === "technical") return [hero, features, offerings, about, contact];
  return [hero, about, offerings, features, contact];
}

function extractLocation(prompt: string): string {
  const match = prompt.match(
    /\b(?:in|near|at)\s+([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+){0,2})/,
  );
  return match?.[1] ?? "";
}

export function generateFallbackDesignSpec(prompt: string): DesignSpec {
  const cleanPrompt = normalizedText(1200, 10).parse(prompt);
  const kind = inferBusinessKind(cleanPrompt);
  const palette = inferPalette(cleanPrompt, kind);
  const mood = inferMood(cleanPrompt, kind);
  const isCafe =
    kind === "restaurant" &&
    includesAny(cleanPrompt.toLowerCase(), [
      "café",
      "cafe",
      "coffee",
      "bright",
    ]);
  const sections =
    kind === "hotel"
      ? hotelSections()
      : isCafe
        ? cafeSections()
        : genericSections(kind, mood);
  const siteName =
    kind === "hotel"
      ? "MOUNTAIN HOUSE"
      : isCafe
        ? "COMMON GROUND CAFÉ"
        : sections[0]!.content.eyebrow;
  const navItems = sections
    .filter((entry) => entry.type !== "hero")
    .slice(0, 5)
    .map((entry) => ({
      label:
        entry.content.eyebrow ||
        entry.content.title.split(" ").slice(0, 2).join(" "),
      target: `#${entry.id}`,
    }));

  return parseDesignSpec({
    schemaVersion: DESIGN_SPEC_VERSION,
    site: {
      name: siteName,
      descriptor:
        kind === "hotel"
          ? "A conceptual luxury resort near the eastern Himalayan gateway"
          : isCafe
            ? "A bright modern neighbourhood café concept"
            : "A premium website concept shaped from your description",
      businessKind: kind,
      location: extractLocation(cleanPrompt),
    },
    brand: {
      tagline: sections[0]!.content.title,
      voice:
        mood === "warm" || mood === "playful"
          ? "warm"
          : mood === "bold"
            ? "energetic"
            : mood === "professional" || mood === "technical"
              ? "precise"
              : "reserved",
    },
    theme: {
      palette,
      mood,
      typography: isCafe
        ? "humanist"
        : mood === "luxury" || mood === "editorial" || mood === "cinematic"
          ? "editorial-serif"
          : mood === "bold"
            ? "high-contrast"
            : "modern-grotesk",
      spacing:
        mood === "minimal" || mood === "luxury" || mood === "cinematic"
          ? "expansive"
          : "balanced",
      radius:
        isCafe || mood === "warm" || mood === "playful"
          ? "rounded"
          : mood === "technical" || mood === "bold"
            ? "sharp"
            : "subtle",
      surface:
        mood === "cinematic" || mood === "luxury"
          ? "layered"
          : mood === "minimal" || mood === "editorial"
            ? "matte"
            : "soft",
      motion:
        mood === "cinematic"
          ? "cinematic"
          : mood === "bold" || mood === "playful"
            ? "energetic"
            : mood === "minimal" || mood === "professional"
              ? "quiet"
              : "fluid",
      headingScale: "balanced",
      bodyScale: "balanced",
      buttonStyle: isCafe ? "rounded" : "subtle",
    },
    navigation: {
      style: isCafe
        ? "editorial"
        : mood === "luxury" || mood === "cinematic"
          ? "floating"
          : mood === "bold"
            ? "solid"
            : "minimal",
      ctaLabel:
        kind === "hotel"
          ? "Booking enquiry"
          : isCafe
            ? "Plan a visit"
            : "Get in touch",
      items: navItems,
    },
    pages: [{ slug: "/", title: "Home", navigationLabel: "Home", sections }],
    footer: {
      variant:
        mood === "luxury" || mood === "editorial"
          ? "statement"
          : isCafe
            ? "editorial"
            : "columns",
      statement:
        kind === "hotel"
          ? "A quieter way to arrive."
          : isCafe
            ? "Coffee, food and room to stay awhile."
            : "A considered digital home for the business.",
    },
    responsive: {
      mobileHero: isCafe
        ? "stacked"
        : mood === "bold"
          ? "type-first"
          : "cropped",
      mobileDensity: "balanced",
      collapseNavigation: true,
      overrides: {
        simplified: false,
        heroHeight: "balanced",
        headingScale: "balanced",
        navigation: "standard",
      },
    },
    metadata: {
      source: "fallback",
      conceptLabel: isCafe
        ? "Warm editorial café"
        : kind === "hotel"
          ? "Cinematic mountain retreat"
          : `${mood} ${kind} concept`,
      revision: 1,
    },
  });
}

function cloneSpec(spec: DesignSpec): DesignSpec {
  return structuredClone(spec);
}

export function getHomePage(spec: DesignSpec) {
  return spec.pages.find((page) => page.slug === "/") ?? spec.pages[0]!;
}

function nextSectionId(
  page: DesignSpec["pages"][number],
  base: string,
): string {
  if (!page.sections.some((entry) => entry.id === base)) return base;
  let index = 2;
  while (page.sections.some((entry) => entry.id === `${base}-${index}`))
    index += 1;
  return `${base}-${index}`;
}

export function createSectionForType(
  type: Exclude<SectionType, "hero">,
  spec: DesignSpec,
): DesignSection {
  const page = getHomePage(spec);
  const id = nextSectionId(page, type);
  const copy: Record<Exclude<SectionType, "hero">, DesignSection> = {
    about: section(id, "about", "editorial-story", {
      eyebrow: "Our story",
      title: "A business with a clear point of view.",
      body: "Use this space for the verified story, people and purpose behind the business.",
    }),
    services: section(id, "services", "visual-grid", {
      eyebrow: "What we offer",
      title: "A focused selection, clearly explained.",
      items: [
        {
          title: "Signature offering",
          body: "Add the most important verified offering here.",
          meta: "Featured",
          accent: "01",
        },
        {
          title: "Supporting offering",
          body: "Give visitors another useful route into the business.",
          meta: "Flexible",
          accent: "02",
        },
      ],
    }),
    gallery: section(
      id,
      "gallery",
      "cinematic-mosaic",
      {
        eyebrow: "Gallery",
        title: "A visual sense of the experience.",
        items: [
          { title: "Atmosphere", body: "", meta: "View", accent: "01" },
          { title: "Detail", body: "", meta: "Close-up", accent: "02" },
          { title: "Experience", body: "", meta: "Moment", accent: "03" },
        ],
      },
      { media: "mosaic" },
    ),
    listings: section(id, "listings", "premium-listing", {
      eyebrow: spec.site.businessKind === "hotel" ? "Rooms" : "Featured",
      title:
        spec.site.businessKind === "hotel"
          ? "Places to stay, made easy to compare."
          : "The collection, brought into focus.",
      items: [
        {
          title: "Featured option",
          body: "Add verified details for this option.",
          meta: "Featured",
          accent: "01",
        },
        {
          title: "Second option",
          body: "Add verified details for this option.",
          meta: "Alternative",
          accent: "02",
        },
      ],
    }),
    testimonials: section(id, "testimonials", "minimal-quote", {
      eyebrow: "Kind words",
      title: "What clients or guests say.",
      body: "Add a real, approved testimonial before publishing.",
      items: [
        {
          title: "Approved testimonial placeholder",
          body: "Replace this conceptual text with a verified quote and attribution.",
          meta: "Verified name required",
          accent: "Quote",
        },
      ],
    }),
    features: section(id, "features", "icon-list", {
      eyebrow: "Highlights",
      title: "Useful details at a glance.",
      items: [
        {
          title: "Clear benefit",
          body: "Explain one real advantage in plain language.",
          meta: "01",
          accent: "Detail",
        },
        {
          title: "Simple next step",
          body: "Help the visitor know what to do next.",
          meta: "02",
          accent: "Action",
        },
      ],
    }),
    cta: section(
      id,
      "cta",
      "minimal",
      {
        eyebrow: "Ready when you are",
        title: "Take the next step with confidence.",
        body: "Add the right contact or enquiry action for the business.",
        primaryCta: "Get in touch",
      },
      { alignment: "center" },
    ),
    contact: section(id, "contact", "concise", {
      eyebrow: "Contact",
      title: "Make the first conversation easy.",
      body: "Add verified contact details, opening hours and location information before publishing.",
      primaryCta: "Send an enquiry",
    }),
  };
  return copy[type];
}

const paletteCycle: readonly PaletteId[] = paletteIds;
const moodCycle: readonly Mood[] = [
  "cinematic",
  "editorial",
  "minimal",
  "warm",
  "bold",
  "luxury",
];

export function createAlternateDesignSpec(input: DesignSpec): DesignSpec {
  const spec = cloneSpec(input);
  const paletteIndex = paletteCycle.indexOf(spec.theme.palette);
  const moodIndex = moodCycle.indexOf(spec.theme.mood);
  spec.theme.palette = paletteCycle[(paletteIndex + 2) % paletteCycle.length]!;
  spec.theme.mood = moodCycle[(Math.max(moodIndex, 0) + 1) % moodCycle.length]!;
  spec.theme.typography =
    spec.theme.typography === "editorial-serif"
      ? "modern-grotesk"
      : "editorial-serif";
  spec.theme.surface = spec.theme.surface === "layered" ? "matte" : "layered";
  spec.navigation.style =
    spec.navigation.style === "floating" ? "editorial" : "floating";
  const hero = getHomePage(spec).sections[0]!;
  const heroIndex = heroVariants.indexOf(hero.variant as HeroVariant);
  hero.variant =
    heroVariants[(Math.max(heroIndex, 0) + 2) % heroVariants.length]!;
  if (getHomePage(spec).sections.length > 4) {
    const page = getHomePage(spec);
    const moved = page.sections.splice(2, 1)[0];
    if (moved)
      page.sections.splice(Math.min(4, page.sections.length), 0, moved);
  }
  spec.metadata = {
    source: "modified",
    conceptLabel: `Alternate ${spec.theme.mood} direction`,
    revision: spec.metadata.revision + 1,
  };
  return parseDesignSpec(spec);
}

function findSectionType(
  instruction: string,
): Exclude<SectionType, "hero"> | null {
  const value = instruction.toLowerCase();
  if (
    includesAny(value, ["room", "package", "product", "listing", "collection"])
  )
    return "listings";
  if (includesAny(value, ["testimonial", "review", "quote"]))
    return "testimonials";
  if (includesAny(value, ["gallery", "photo", "image"])) return "gallery";
  if (includesAny(value, ["about", "story", "founder"])) return "about";
  if (
    includesAny(value, ["service", "menu", "restaurant", "offering", "program"])
  )
    return "services";
  if (includesAny(value, ["amenit", "feature", "highlight"])) return "features";
  if (includesAny(value, ["contact", "location", "visit"])) return "contact";
  if (includesAny(value, ["call to action", "cta", "enquiry"])) return "cta";
  return null;
}

export function modifyDesignSpec(
  input: DesignSpec,
  rawInstruction: string,
): DesignSpec {
  const instruction = normalizedText(600, 2).parse(rawInstruction);
  const value = instruction.toLowerCase();
  if (
    includesAny(value, [
      "another version",
      "alternate version",
      "different version",
      "new version",
    ])
  )
    return createAlternateDesignSpec(input);

  const spec = cloneSpec(input);
  const page = getHomePage(spec);
  const hero = page.sections[0]!;

  if (includesAny(value, ["black", "champagne"]))
    spec.theme.palette = "midnight-champagne";
  else if (includesAny(value, ["terracotta", "cream", "ivory"]))
    spec.theme.palette = "ivory-terracotta";
  else if (includesAny(value, ["forest", "dark green", "green and gold"]))
    spec.theme.palette = "forest-gold";
  else if (includesAny(value, ["lighter", "light design", "white background"]))
    spec.theme.palette = "paper-ink";
  else if (includesAny(value, ["ocean", "blue"]))
    spec.theme.palette = "ocean-copper";

  for (const mood of moods) if (value.includes(mood)) spec.theme.mood = mood;
  if (includesAny(value, ["more luxurious", "more luxury", "elegant"])) {
    spec.theme.mood = "luxury";
    spec.theme.typography = "editorial-serif";
    spec.theme.spacing = "expansive";
    spec.theme.surface = "layered";
    spec.navigation.style = "floating";
  }
  if (includesAny(value, ["more minimal", "simpler", "less busy"])) {
    spec.theme.mood = "minimal";
    spec.theme.spacing = "expansive";
    spec.theme.surface = "matte";
    spec.theme.motion = "quiet";
    spec.navigation.style = "minimal";
  }
  if (includesAny(value, ["less minimal", "more detail"])) {
    spec.theme.mood = "editorial";
    spec.theme.spacing = "balanced";
    spec.theme.surface = "soft";
  }
  if (includesAny(value, ["more cinematic", "cinematic hero"])) {
    spec.theme.mood = "cinematic";
    spec.theme.motion = "cinematic";
    hero.variant = "cinematic-editorial";
    hero.visualTreatment = {
      media: "panoramic",
      contrast: "high",
      surface: "immersive",
    };
    hero.motion = "drift";
  }
  if (value.includes("split hero")) hero.variant = "split-composition";
  if (includesAny(value, ["minimal hero", "simpler hero"]))
    hero.variant = "minimal-luxury";
  if (includesAny(value, ["bold hero", "typographic hero"]))
    hero.variant = "bold-typographic";
  if (includesAny(value, ["hospitality hero", "hotel hero"]))
    hero.variant = "hospitality-focused";

  const headlineMatch = instruction.match(
    /(?:headline|hero title|title)\s+(?:to|as)\s+["“]?([^"”]+)["”]?$/i,
  );
  if (headlineMatch?.[1]) {
    hero.content.title = normalizedText(110, 1).parse(headlineMatch[1]);
    spec.brand.tagline = hero.content.title;
  }

  const requestedType = findSectionType(value);
  if (requestedType && /\b(?:add|include|create)\b/i.test(value)) {
    const added = createSectionForType(requestedType, spec);
    page.sections.splice(Math.max(1, page.sections.length - 1), 0, added);
  }
  if (requestedType && /\b(?:remove|delete|hide)\b/i.test(value)) {
    const index = page.sections.findIndex(
      (entry) => entry.type === requestedType,
    );
    if (index > 0) page.sections.splice(index, 1);
  }

  const moveMatch = value.match(
    /move\s+(gallery|about|rooms?|restaurant|services?|features?|contact)\s+(above|before|below|after)\s+(gallery|about|rooms?|restaurant|services?|features?|contact)/,
  );
  if (moveMatch) {
    const tokenToType = (token: string): SectionType =>
      token.startsWith("room")
        ? "listings"
        : token === "restaurant"
          ? "services"
          : token.endsWith("s")
            ? (token.slice(0, -1) as SectionType)
            : (token as SectionType);
    const fromType = tokenToType(moveMatch[1]!);
    const toType = tokenToType(moveMatch[3]!);
    const fromIndex = page.sections.findIndex(
      (entry) => entry.type === fromType,
    );
    const toIndex = page.sections.findIndex((entry) => entry.type === toType);
    if (fromIndex > 0 && toIndex > 0 && fromIndex !== toIndex) {
      const moved = page.sections.splice(fromIndex, 1)[0]!;
      const updatedTarget = page.sections.findIndex(
        (entry) => entry.type === toType,
      );
      page.sections.splice(
        moveMatch[2] === "above" || moveMatch[2] === "before"
          ? updatedTarget
          : updatedTarget + 1,
        0,
        moved,
      );
    }
  }

  if (
    /add\s+(?:an?\s+)?about page/i.test(value) &&
    !spec.pages.some((entry) => entry.slug === "/about")
  ) {
    spec.pages.push({
      slug: "/about",
      title: "About",
      navigationLabel: "About",
      sections: [
        section(
          "about-hero",
          "hero",
          "minimal-luxury",
          {
            eyebrow: "About",
            title: "The story behind the experience.",
            body: "A dedicated page ready for the verified people, purpose and history of the business.",
          },
          { media: "portrait" },
        ),
        section("about-story", "about", "editorial-story", {
          eyebrow: "Our story",
          title: "Built with intention, told with clarity.",
          body: "Replace this conceptual narrative with the business’s approved story before publishing.",
        }),
        section(
          "about-contact",
          "cta",
          "minimal",
          {
            eyebrow: "Begin",
            title: "Start a conversation.",
            primaryCta: "Get in touch",
          },
          { alignment: "center" },
        ),
      ],
    });
    spec.navigation.items.push({ label: "About", target: "/about" });
  }

  if (includesAny(value, ["editorial typography", "more editorial"]))
    spec.theme.typography = "editorial-serif";
  if (includesAny(value, ["modern typography", "clean typography"]))
    spec.theme.typography = "modern-grotesk";
  if (
    includesAny(value, [
      "better on mobile",
      "mobile friendly",
      "improve mobile",
    ])
  ) {
    spec.responsive.mobileHero = "stacked";
    spec.responsive.mobileDensity = "compact";
    spec.theme.spacing = "balanced";
  }

  spec.metadata = {
    source: "modified",
    conceptLabel: `Refined ${spec.theme.mood} direction`,
    revision: spec.metadata.revision + 1,
  };
  return parseDesignSpec(spec);
}

export function updateSectionVariant(
  specInput: DesignSpec,
  sectionId: string,
  variant: string,
): DesignSpec {
  const spec = cloneSpec(specInput);
  for (const page of spec.pages) {
    const found = page.sections.find((entry) => entry.id === sectionId);
    if (!found) continue;
    if (!sectionVariantRegistry[found.type].includes(variant as never))
      throw new Error("Section variant is not allowed.");
    found.variant = variant;
    spec.metadata = {
      source: "modified",
      conceptLabel: spec.metadata.conceptLabel,
      revision: spec.metadata.revision + 1,
    };
    return parseDesignSpec(spec);
  }
  throw new Error("Section was not found.");
}

export function moveSection(
  specInput: DesignSpec,
  sectionId: string,
  direction: -1 | 1,
): DesignSpec {
  const spec = cloneSpec(specInput);
  for (const page of spec.pages) {
    const index = page.sections.findIndex((entry) => entry.id === sectionId);
    if (index < 1) continue;
    const nextIndex = Math.max(
      1,
      Math.min(page.sections.length - 1, index + direction),
    );
    if (nextIndex === index) return specInput;
    const moved = page.sections.splice(index, 1)[0]!;
    page.sections.splice(nextIndex, 0, moved);
    spec.metadata = {
      source: "modified",
      conceptLabel: spec.metadata.conceptLabel,
      revision: spec.metadata.revision + 1,
    };
    return parseDesignSpec(spec);
  }
  return specInput;
}

export function removeSection(
  specInput: DesignSpec,
  sectionId: string,
): DesignSpec {
  const spec = cloneSpec(specInput);
  for (const page of spec.pages) {
    const index = page.sections.findIndex((entry) => entry.id === sectionId);
    if (index < 1) continue;
    page.sections.splice(index, 1);
    spec.navigation.items = spec.navigation.items.filter(
      (entry) => entry.target !== `#${sectionId}`,
    );
    spec.metadata = {
      source: "modified",
      conceptLabel: spec.metadata.conceptLabel,
      revision: spec.metadata.revision + 1,
    };
    return parseDesignSpec(spec);
  }
  return specInput;
}

export function updatePalette(
  specInput: DesignSpec,
  palette: PaletteId,
): DesignSpec {
  const spec = cloneSpec(specInput);
  spec.theme.palette = palette;
  spec.metadata = {
    source: "modified",
    conceptLabel: spec.metadata.conceptLabel,
    revision: spec.metadata.revision + 1,
  };
  return parseDesignSpec(spec);
}

export function updateSectionCopy(
  specInput: DesignSpec,
  sectionId: string,
  field: "title" | "body",
  value: string,
): DesignSpec {
  const spec = cloneSpec(specInput);
  for (const page of spec.pages) {
    const section = page.sections.find((entry) => entry.id === sectionId);
    if (!section) continue;
    section.content[field] = normalizedText(
      field === "title" ? 110 : 420,
      field === "title" ? 1 : 0,
    ).parse(value);
    if (section.type === "hero" && field === "title")
      spec.brand.tagline = section.content.title;
    spec.metadata = {
      source: "modified",
      conceptLabel: spec.metadata.conceptLabel,
      revision: spec.metadata.revision + 1,
    };
    return parseDesignSpec(spec);
  }
  throw new Error("Section was not found.");
}
