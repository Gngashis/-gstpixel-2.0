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
  "technology",
  "creative",
  "wellness",
  "healthcare",
  "education",
  "fashion",
  "realestate",
  "construction",
  "automotive",
  "beauty",
  "events",
  "logistics",
  "nonprofit",
  "agriculture",
  "personal",
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
  "bright",
  "serene",
  "industrial",
  "heritage",
] as const;
export const paletteIds = [
  "forest-gold",
  "ivory-terracotta",
  "midnight-champagne",
  "paper-ink",
  "ocean-copper",
  "sand-olive",
  "graphite-lime",
  "plum-brass",
  "stone-sage",
  "cobalt-cream",
  "charcoal-amber",
  "clay-indigo",
  "slate-coral",
] as const;
export const typographyIds = [
  "editorial-serif",
  "modern-grotesk",
  "humanist",
  "high-contrast",
  "geometric-technical",
  "mono-technical",
  "expressive-display",
  "condensed-poster",
] as const;
/**
 * Hero families the creative blueprint may request. The trailing six are the
 * original families, retained so existing specs keep validating and rendering.
 */
export const heroVariants = [
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
  "cinematic-editorial",
  "immersive-image",
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
    "editorial-narrative",
    "split-media-story",
    "founder-story",
    "values-grid",
    "manifesto-statement",
    "immersive-feature",
    "story-timeline",
    "image-led-story",
  ],
  services: [
    "editorial-list",
    "visual-grid",
    "horizontal-showcase",
    "immersive-panels",
    "compact-cards",
    "numbered-narrative",
    "service-index",
    "catalogue-list",
    "process-steps",
    "bento-grid",
    "split-offerings",
    "capability-columns",
  ],
  gallery: [
    "cinematic-mosaic",
    "full-bleed",
    "editorial-grid",
    "horizontal-gallery",
    "gallery-strip",
    "art-collage",
    "bento-mosaic",
    "framed-print-series",
  ],
  listings: [
    "premium-listing",
    "comparison",
    "image-showcase",
    "featured-item",
    "product-grid",
    "room-collection",
    "package-cards",
    "collection-rail",
    "index-list",
  ],
  testimonials: ["minimal-quote", "editorial-quotes", "statement-quote"],
  features: [
    "icon-list",
    "structured-editorial",
    "visual-blocks",
    "stats-band",
    "process-timeline",
    "manifesto",
    "comparison-table",
    "bento-grid",
    "trust-band",
    "faq-list",
    "capability-grid",
    "numbered-features",
  ],
  cta: [
    "minimal",
    "cinematic",
    "split",
    "contact-focused",
    "conversion-band",
    "concierge-teaser",
    "booking-band",
    "statement-cta",
  ],
  contact: [
    "concise",
    "detailed",
    "location-composition",
    "booking-enquiry",
    "concierge-panel",
    "map-led",
  ],
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
        surface: z.enum([
          "matte",
          "soft",
          "glass",
          "layered",
          "paper",
          "grain",
          "void",
        ]),
        motion: z.enum(["quiet", "fluid", "cinematic", "energetic"]),
        rhythm: z
          .enum(["even", "cadenced", "escalating", "measured"])
          .default("measured"),
        composition: z
          .string()
          .min(1)
          .max(32)
          .default("editorial-single-column"),
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
        style: z.enum([
          "minimal-centered",
          "editorial-split",
          "floating-capsule",
          "transparent-overlay",
          "compact-professional",
          "immersive-brand",
          "utility-bar",
          "minimal",
          "floating",
          "editorial",
          "solid",
        ]),
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
    pages: z.array(pageSchema).min(1).max(8),
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
            /** How much decorative artwork survives on a phone screen. */
            decoration: z
              .enum(["keep", "simplified", "hidden"])
              .default("keep"),
          })
          .strict()
          .default({
            simplified: false,
            heroHeight: "balanced",
            headingScale: "balanced",
            navigation: "standard",
            decoration: "keep",
          }),
      })
      .strict(),
    metadata: z
      .object({
        source: z.enum(["fallback", "ai", "modified", "nvidia"]),
        conceptLabel: normalizedText(60, 1),
        revision: z.number().int().min(1).max(999),
        /**
         * Deterministic lineage of the generated concept. Numeric only — the
         * visitor's prompt is never stored in the spec or anywhere else.
         */
        promptSeed: z.number().int().min(0).max(2_147_483_647).default(0),
        variation: z.number().int().min(0).max(99).default(0),
        fingerprint: z.string().max(80).default(""),
        /** Validated CreativeBlueprint, attached only in memory for the session. */
        blueprint: z.unknown().optional(),
        /**
         * Validated DesignDNA — the coherent design identity every page of the
         * concept is rendered from. In-memory only, exactly like the blueprint.
         */
        designDna: z.unknown().optional(),
        /**
         * Premium template showroom selection (internal observability only —
         * never surfaced to visitors).
         */
        template: z
          .object({
            masterId: z.string().min(1).max(48),
            variantId: z.number().int().min(0).max(99).optional(),
          })
          .optional(),
        motionLevel: z
          .enum(["none", "subtle", "premium", "cinematic"])
          .optional(),
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
    ...spec.metadata,
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
      ...spec.metadata,
      source: "modified",
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
      ...spec.metadata,
      source: "modified",
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
      ...spec.metadata,
      source: "modified",
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
    ...spec.metadata,
    source: "modified",
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
      ...spec.metadata,
      source: "modified",
      revision: spec.metadata.revision + 1,
    };
    return parseDesignSpec(spec);
  }
  throw new Error("Section was not found.");
}
