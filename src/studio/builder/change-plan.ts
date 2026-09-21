import { z } from "zod";
import {
  createAlternateDesignSpec,
  createSectionForType,
  designSpecSchema,
  getHomePage,
  heroVariants,
  moods,
  paletteIds,
  parseDesignSpec,
  sectionTypes,
  sectionVariantRegistry,
  typographyIds,
  type DesignSection,
  type DesignSpec,
  type PaletteId,
  type SectionType,
} from "./domain";

export const STUDIO_CHANGE_PLAN_VERSION = 1 as const;

const studioChangeOperationTypes = [
  "setTheme",
  "setSectionStyle",
  "rewriteSection",
  "addSection",
  "removeSection",
  "moveSection",
  "duplicateSection",
  "addPage",
  "setNavigation",
  "setMobile",
  "alternate",
  "restoreTheme",
] as const;

const scopeSchema = z
  .object({
    kind: z.enum([
      "site",
      "page",
      "section",
      "navigation",
      "mobile",
      "desktop",
    ]),
    pageSlug: z
      .string()
      .regex(/^\/[a-z0-9\-/]*$/)
      .optional(),
    sectionId: z
      .string()
      .regex(/^[a-z][a-z0-9-]{1,48}$/)
      .optional(),
  })
  .strict();

const sectionTargetSchema = z
  .object({
    pageSlug: z
      .string()
      .regex(/^\/[a-z0-9\-/]*$/)
      .optional(),
    sectionId: z
      .string()
      .regex(/^[a-z][a-z0-9-]{1,48}$/)
      .optional(),
    sectionType: z.enum(sectionTypes).optional(),
  })
  .strict();

const setThemeOperation = z
  .object({
    type: z.literal("setTheme"),
    palette: z.enum(paletteIds).optional(),
    mood: z.enum(moods).optional(),
    typography: z.enum(typographyIds).optional(),
    spacing: z.enum(["compact", "balanced", "expansive"]).optional(),
    radius: z.enum(["sharp", "subtle", "rounded"]).optional(),
    surface: z.enum(["matte", "soft", "glass", "layered"]).optional(),
    motion: z.enum(["quiet", "fluid", "cinematic", "energetic"]).optional(),
    headingScale: z.enum(["compact", "balanced", "expressive"]).optional(),
    bodyScale: z.enum(["small", "balanced", "large"]).optional(),
    buttonStyle: z.enum(["sharp", "subtle", "rounded", "pill"]).optional(),
  })
  .strict();

const setSectionStyleOperation = z
  .object({
    type: z.literal("setSectionStyle"),
    target: sectionTargetSchema,
    variant: z.string().min(1).max(40).optional(),
    alignment: z.enum(["left", "center", "right"]).optional(),
    density: z.enum(["airy", "balanced", "compact"]).optional(),
    height: z.enum(["compact", "balanced", "immersive"]).optional(),
    textScale: z.enum(["compact", "balanced", "expressive"]).optional(),
    media: z
      .enum(["panoramic", "portrait", "mosaic", "abstract", "none"])
      .optional(),
    contrast: z.enum(["low", "medium", "high"]).optional(),
    surface: z.enum(["plain", "elevated", "outlined", "immersive"]).optional(),
    motion: z.enum(["quiet", "reveal", "drift", "snap"]).optional(),
    tone: z.enum(["inherit", "dark", "light", "accent"]).optional(),
  })
  .strict();

const rewriteSectionOperation = z
  .object({
    type: z.literal("rewriteSection"),
    target: sectionTargetSchema,
    title: z.string().min(1).max(110).optional(),
    body: z.string().max(420).optional(),
    primaryCta: z.string().max(50).optional(),
    secondaryCta: z.string().max(50).optional(),
    contentDensity: z.enum(["less", "balanced", "more"]).optional(),
  })
  .strict();

const addSectionOperation = z
  .object({
    type: z.literal("addSection"),
    pageSlug: z
      .string()
      .regex(/^\/[a-z0-9\-/]*$/)
      .default("/"),
    sectionType: z.enum(sectionTypes).exclude(["hero"]),
    afterSectionId: z
      .string()
      .regex(/^[a-z][a-z0-9-]{1,48}$/)
      .optional(),
    afterSectionType: z.enum(sectionTypes).optional(),
  })
  .strict();

const removeSectionOperation = z
  .object({ type: z.literal("removeSection"), target: sectionTargetSchema })
  .strict();

const moveSectionOperation = z
  .object({
    type: z.literal("moveSection"),
    target: sectionTargetSchema,
    relation: z.enum(["before", "after", "up", "down"]),
    anchor: sectionTargetSchema.optional(),
  })
  .strict();

const duplicateSectionOperation = z
  .object({ type: z.literal("duplicateSection"), target: sectionTargetSchema })
  .strict();

const addPageOperation = z
  .object({
    type: z.literal("addPage"),
    pageType: z.enum(["about", "services", "contact"]),
  })
  .strict();

const setNavigationOperation = z
  .object({
    type: z.literal("setNavigation"),
    style: z.enum(["minimal", "floating", "editorial", "solid"]).optional(),
    ctaLabel: z.string().min(1).max(40).optional(),
  })
  .strict();

const setMobileOperation = z
  .object({
    type: z.literal("setMobile"),
    simplified: z.boolean().optional(),
    heroHeight: z.enum(["compact", "balanced"]).optional(),
    headingScale: z.enum(["compact", "balanced"]).optional(),
    navigation: z.enum(["minimal", "standard"]).optional(),
    density: z.enum(["compact", "balanced"]).optional(),
  })
  .strict();

const alternateOperation = z
  .object({
    type: z.literal("alternate"),
    target: z.enum(["site", "section"]),
    section: sectionTargetSchema.optional(),
  })
  .strict();

const restoreThemeOperation = z
  .object({
    type: z.literal("restoreTheme"),
    aspect: z.enum([
      "palette",
      "typography",
      "spacing",
      "surface",
      "motion",
      "all",
    ]),
  })
  .strict();

export const studioChangeOperationSchema = z.discriminatedUnion("type", [
  setThemeOperation,
  setSectionStyleOperation,
  rewriteSectionOperation,
  addSectionOperation,
  removeSectionOperation,
  moveSectionOperation,
  duplicateSectionOperation,
  addPageOperation,
  setNavigationOperation,
  setMobileOperation,
  alternateOperation,
  restoreThemeOperation,
]);

export const studioChangePlanSchema = z
  .object({
    version: z.literal(STUDIO_CHANGE_PLAN_VERSION),
    scope: scopeSchema,
    operations: z.array(studioChangeOperationSchema).max(16),
    summary: z.string().min(1).max(240),
    unsupported: z.array(z.string().min(1).max(180)).max(5).default([]),
  })
  .strict();

export type StudioChangeOperation = z.infer<typeof studioChangeOperationSchema>;
export type StudioChangePlan = z.infer<typeof studioChangePlanSchema>;

export type StudioConversationTurn = {
  instruction: string;
  summary: string;
  pageSlug: string;
  sectionId: string | null;
  operationTypes: StudioChangeOperation["type"][];
  operations: StudioChangeOperation[];
};

export const studioConversationTurnSchema = z
  .object({
    instruction: z.string().min(1).max(600),
    summary: z.string().min(1).max(240),
    pageSlug: z.string().regex(/^\/[a-z0-9\-/]*$/),
    sectionId: z
      .string()
      .regex(/^[a-z][a-z0-9-]{1,48}$/)
      .nullable(),
    operationTypes: z.array(z.enum(studioChangeOperationTypes)).max(16),
    operations: z.array(studioChangeOperationSchema).max(16),
  })
  .strict();

export type StudioChangeContext = {
  spec: DesignSpec;
  activePageSlug: string;
  selectedSectionId: string | null;
  viewport: "desktop" | "mobile";
  recentTurns: StudioConversationTurn[];
  previousThemes: DesignSpec["theme"][];
};

export type StudioChangeResult = {
  spec: DesignSpec;
  plan: StudioChangePlan;
  changed: boolean;
};

export const studioThemeSnapshotSchema = z
  .object({
    palette: z.enum(paletteIds),
    mood: z.enum(moods),
    typography: z.enum(typographyIds),
    spacing: z.enum(["compact", "balanced", "expansive"]),
    radius: z.enum(["sharp", "subtle", "rounded"]),
    surface: z.enum(["matte", "soft", "glass", "layered"]),
    motion: z.enum(["quiet", "fluid", "cinematic", "energetic"]),
    headingScale: z.enum(["compact", "balanced", "expressive"]),
    bodyScale: z.enum(["small", "balanced", "large"]),
    buttonStyle: z.enum(["sharp", "subtle", "rounded", "pill"]),
  })
  .strict();

export const studioEditorContextSchema = z
  .object({
    activePageSlug: z.string().regex(/^\/[a-z0-9\-/]*$/),
    selectedSectionId: z
      .string()
      .regex(/^[a-z][a-z0-9-]{1,48}$/)
      .nullable(),
    viewport: z.enum(["desktop", "mobile"]),
    recentTurns: z.array(studioConversationTurnSchema).max(4),
    previousThemes: z.array(studioThemeSnapshotSchema).max(10),
  })
  .strict();

function includesAny(value: string, terms: readonly string[]) {
  return terms.some((term) => value.includes(term));
}

function sectionTypeFromText(value: string): SectionType | null {
  if (includesAny(value, ["hero", "banner", "above the fold"])) return "hero";
  if (
    includesAny(value, ["room", "package", "product", "listing", "collection"])
  )
    return "listings";
  if (includesAny(value, ["testimonial", "review", "quote"]))
    return "testimonials";
  if (includesAny(value, ["gallery", "photo", "image showcase"]))
    return "gallery";
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

function pageFor(context: StudioChangeContext, slug?: string) {
  return (
    context.spec.pages.find(
      (page) => page.slug === (slug ?? context.activePageSlug),
    ) ?? getHomePage(context.spec)
  );
}

function selectedSection(context: StudioChangeContext) {
  const page = pageFor(context);
  return (
    page.sections.find((section) => section.id === context.selectedSectionId) ??
    null
  );
}

function resolveReferenceType(
  instruction: string,
  context: StudioChangeContext,
): SectionType | null {
  const explicit = sectionTypeFromText(instruction);
  if (explicit) return explicit;
  if (/\b(this|selected) section\b/i.test(instruction)) {
    return selectedSection(context)?.type ?? null;
  }
  if (
    /\b(same thing|more dramatic|keep that|keep it|keep the darkness|do that)\b/i.test(
      instruction,
    )
  ) {
    const recent = context.recentTurns.at(-1);
    if (recent?.sectionId) {
      return (
        context.spec.pages
          .flatMap((page) => page.sections)
          .find((section) => section.id === recent.sectionId)?.type ?? null
      );
    }
  }
  return null;
}

function targetFor(
  type: SectionType,
  context: StudioChangeContext,
  preferSelected = false,
): z.infer<typeof sectionTargetSchema> {
  const selected = selectedSection(context);
  if (preferSelected && selected?.type === type) {
    return {
      pageSlug: context.activePageSlug,
      sectionId: selected.id,
      sectionType: type,
    };
  }
  return { pageSlug: context.activePageSlug, sectionType: type };
}

function quotedText(instruction: string) {
  return instruction.match(/["“]([^"”]{1,420})["”]/)?.[1]?.trim();
}

function operationLabel(operation: StudioChangeOperation): string {
  switch (operation.type) {
    case "setTheme":
      return "updated the visual system";
    case "setSectionStyle":
      return `refined the ${operation.target.sectionType ?? "selected"} section`;
    case "rewriteSection":
      return `updated the ${operation.target.sectionType ?? "selected"} content`;
    case "addSection":
      return `added a ${operation.sectionType} section`;
    case "removeSection":
      return `removed the ${operation.target.sectionType ?? "selected"} section`;
    case "moveSection":
      return `reordered the ${operation.target.sectionType ?? "selected"} section`;
    case "duplicateSection":
      return `duplicated the ${operation.target.sectionType ?? "selected"} section`;
    case "addPage":
      return `added an ${operation.pageType} page`;
    case "setNavigation":
      return "refined the navigation";
    case "setMobile":
      return "cleaned up the mobile experience";
    case "alternate":
      return operation.target === "site"
        ? "created a new visual direction"
        : "created a different section direction";
    case "restoreTheme":
      return `restored the earlier ${operation.aspect}`;
  }
  return "updated the website";
}

function summaryFromOperations(operations: StudioChangeOperation[]) {
  const labels = [...new Set(operations.map(operationLabel))];
  if (!labels.length) return "No safe website change was applied.";
  if (labels.length === 1)
    return `${labels[0]![0]!.toUpperCase()}${labels[0]!.slice(1)}.`;
  const last = labels.pop()!;
  return `${labels.join(", ")}, and ${last}.`.replace(/^./, (letter) =>
    letter.toUpperCase(),
  );
}

function creativeTheme(
  value: string,
): z.infer<typeof setThemeOperation> | null {
  const theme: z.infer<typeof setThemeOperation> = { type: "setTheme" };
  let matched = false;
  if (
    includesAny(value, ["all black", "dark", "darker", "black", "night mode"])
  ) {
    theme.palette = "midnight-champagne";
    theme.surface = includesAny(value, ["glassy", "glass"])
      ? "glass"
      : "layered";
    matched = true;
  }
  if (
    includesAny(value, ["brighter", "lighter", "bright", "white background"])
  ) {
    theme.palette = "paper-ink";
    theme.surface = "matte";
    matched = true;
  }
  if (
    includesAny(value, [
      "luxury",
      "luxurious",
      "expensive",
      "classy",
      "high fashion",
      "premium",
    ])
  ) {
    theme.mood = "luxury";
    theme.typography = "editorial-serif";
    theme.spacing = "expansive";
    theme.surface = "layered";
    theme.motion = "cinematic";
    theme.headingScale = "expressive";
    theme.buttonStyle = "subtle";
    matched = true;
  }
  if (
    includesAny(value, [
      "minimal",
      "simpler",
      "cleaner",
      "less busy",
      "less crowded",
    ])
  ) {
    theme.mood = "minimal";
    theme.spacing = "expansive";
    theme.surface = "matte";
    theme.motion = "quiet";
    matched = true;
  }
  if (
    includesAny(value, [
      "futuristic",
      "technology company",
      "tech company",
      "apple-style",
      "apple like",
      "apple-like",
    ])
  ) {
    theme.mood = "technical";
    theme.palette ??= "paper-ink";
    theme.typography = "modern-grotesk";
    theme.spacing = "expansive";
    theme.surface = includesAny(value, ["glassy", "glass"]) ? "glass" : "soft";
    theme.motion = "fluid";
    theme.radius = "rounded";
    theme.buttonStyle = "pill";
    matched = true;
  }
  if (includesAny(value, ["warm", "warmer", "welcoming", "friendly"])) {
    theme.mood = "warm";
    theme.palette = "ivory-terracotta";
    theme.typography = "humanist";
    theme.surface = "soft";
    theme.buttonStyle = "rounded";
    matched = true;
  }
  if (
    includesAny(value, [
      "playful",
      "young",
      "fun",
      "personality",
      "make it pop",
    ])
  ) {
    theme.mood = "playful";
    theme.typography = "humanist";
    theme.motion = "energetic";
    theme.radius = "rounded";
    theme.buttonStyle = "pill";
    matched = true;
  }
  if (includesAny(value, ["editorial", "magazine", "magazine-like"])) {
    theme.mood = "editorial";
    theme.typography = "editorial-serif";
    theme.spacing = "expansive";
    theme.surface = "matte";
    matched = true;
  }
  if (
    includesAny(value, [
      "professional",
      "trustworthy",
      "corporate",
      "sophisticated",
    ])
  ) {
    theme.mood = "professional";
    theme.typography = "modern-grotesk";
    theme.motion = "quiet";
    theme.surface = "soft";
    matched = true;
  }
  if (includesAny(value, ["bold", "dramatic", "impressive", "visual impact"])) {
    theme.mood = includesAny(value, ["dramatic", "impressive"])
      ? "cinematic"
      : "bold";
    theme.headingScale = "expressive";
    theme.motion = "cinematic";
    matched = true;
  }
  if (
    includesAny(value, [
      "headings larger",
      "larger headings",
      "bigger headings",
    ])
  ) {
    theme.headingScale = "expressive";
    matched = true;
  }
  if (includesAny(value, ["body text smaller", "smaller body text"])) {
    theme.bodyScale = "small";
    matched = true;
  }
  if (
    includesAny(value, ["buttons rounder", "round buttons", "rounded buttons"])
  ) {
    theme.buttonStyle = "pill";
    matched = true;
  }
  if (
    includesAny(value, ["futuristic", "technology company", "tech company"]) &&
    includesAny(value, ["minimal", "simpler", "cleaner"])
  ) {
    theme.mood = "technical";
    theme.spacing = "expansive";
    theme.surface = "matte";
    theme.motion = "quiet";
  }
  return matched ? theme : null;
}

export function planStudioChange(
  rawInstruction: string,
  context: StudioChangeContext,
): StudioChangePlan {
  const instruction = rawInstruction.replace(/\s+/g, " ").trim();
  const value = instruction.toLowerCase();
  if (
    /<\/?[a-z][^>]*>/i.test(instruction) ||
    /\bjavascript\s*:/i.test(instruction) ||
    /```/.test(instruction) ||
    /\b(?:document|window|eval)\s*[.(]/i.test(instruction)
  ) {
    return studioChangePlanSchema.parse({
      version: STUDIO_CHANGE_PLAN_VERSION,
      scope: { kind: "site" },
      operations: [],
      summary: "No safe website change was applied.",
      unsupported: [
        "Executable code, scripts and raw markup are not supported in Website Studio instructions.",
      ],
    });
  }
  const operations: StudioChangeOperation[] = [];
  const unsupported: string[] = [];
  const namedSection = sectionTypeFromText(instruction);
  const explicitSection = resolveReferenceType(instruction, context);
  const selected = selectedSection(context);
  const conversationalReference =
    !namedSection &&
    includesAny(value, [
      "more dramatic",
      "keep that",
      "keep it",
      "keep the darkness",
      "same thing",
      "do the same",
    ]);
  const sectionOnly = includesAny(value, [
    "only this section",
    "this section only",
    "change only this section",
    "selected section",
    "this section",
  ]);
  const mobileOnly =
    includesAny(value, [
      "mobile only",
      "on mobile",
      "for mobile",
      "mobile cleaner",
      "don't change desktop",
      "do not change desktop",
    ]) ||
    (context.viewport === "mobile" && value.includes("this view"));
  const desktopOnly = includesAny(value, [
    "desktop only",
    "on desktop",
    "for desktop",
  ]);
  const explicitGlobalTheme = includesAny(value, [
    "all black",
    "entire site",
    "whole site",
    "site brighter",
    "site darker",
    "lighter design",
    "darker design",
    "global design",
    "global theme",
  ]);
  const inferredScope = sectionOnly
    ? {
        kind: "section" as const,
        pageSlug: context.activePageSlug,
        sectionId: selected?.id,
      }
    : mobileOnly
      ? { kind: "mobile" as const, pageSlug: context.activePageSlug }
      : desktopOnly
        ? { kind: "desktop" as const, pageSlug: context.activePageSlug }
        : { kind: "site" as const };

  if (
    includesAny(value, ["upload", "use my logo", "put my logo", "add my logo"])
  ) {
    unsupported.push(
      value.includes("logo")
        ? "An editable wordmark can be styled now, but an actual logo file must be uploaded when media uploads are available."
        : "Image and asset upload is not available yet; the layout and media treatment can still be prepared.",
    );
  }

  if (includesAny(value, ["same thing", "do the same", "apply that to"])) {
    const recent = context.recentTurns.at(-1);
    if (recent && explicitSection) {
      for (const recentOperation of recent.operations) {
        if (recentOperation.type === "setSectionStyle") {
          operations.push({
            ...recentOperation,
            target: targetFor(explicitSection, context),
          });
        }
        if (recentOperation.type === "rewriteSection") {
          operations.push({
            ...recentOperation,
            target: targetFor(explicitSection, context),
          });
        }
      }
    }
  }

  if (/add (?:a |an )?(?:customer )?testimonial/i.test(value)) {
    operations.push({
      type: "addSection",
      pageSlug: context.activePageSlug,
      sectionType: "testimonials",
    });
  }

  const theme = creativeTheme(value);
  if (theme) {
    const scopedType = sectionOnly
      ? selected?.type
      : conversationalReference
        ? explicitSection
        : namedSection &&
            !explicitGlobalTheme &&
            !includesAny(value, [
              "whole site",
              "entire site",
              "all sections",
              "global",
            ])
          ? namedSection
          : null;
    if (scopedType) {
      operations.push({
        type: "setSectionStyle",
        target: targetFor(scopedType, context, scopedType === selected?.type),
        ...(theme.palette
          ? {
              tone:
                theme.palette === "midnight-champagne"
                  ? ("dark" as const)
                  : theme.palette === "paper-ink"
                    ? ("light" as const)
                    : ("accent" as const),
            }
          : theme.mood === "luxury" ||
              theme.mood === "warm" ||
              theme.mood === "playful"
            ? { tone: "accent" as const }
            : {}),
        ...(theme.spacing
          ? {
              density:
                theme.spacing === "expansive"
                  ? ("airy" as const)
                  : theme.spacing === "compact"
                    ? ("compact" as const)
                    : ("balanced" as const),
            }
          : {}),
        ...(theme.surface
          ? {
              surface:
                theme.surface === "layered" || theme.surface === "glass"
                  ? ("elevated" as const)
                  : ("plain" as const),
            }
          : {}),
        ...(theme.motion
          ? {
              motion:
                theme.motion === "cinematic"
                  ? ("drift" as const)
                  : theme.motion === "energetic"
                    ? ("snap" as const)
                    : ("reveal" as const),
            }
          : {}),
      });
    } else if (!mobileOnly) {
      operations.push(theme);
    }
  }

  if (
    mobileOnly ||
    includesAny(value, [
      "make mobile cleaner",
      "improve mobile",
      "mobile friendly",
    ])
  ) {
    operations.push({
      type: "setMobile",
      simplified: true,
      density: "compact",
      heroHeight: "compact",
      headingScale: "compact",
      navigation: "minimal",
    });
  }

  if (desktopOnly && theme) {
    unsupported.push(
      "Desktop-only global theme overrides are not separated yet; the coordinated theme change was not applied to avoid changing mobile.",
    );
    const index = operations.indexOf(theme);
    if (index >= 0) operations.splice(index, 1);
  }

  const heroTarget = targetFor("hero", context, explicitSection === "hero");
  if (
    includesAny(value, [
      "hero shorter",
      "shorten the hero",
      "reduce the hero height",
    ])
  ) {
    operations.push({
      type: "setSectionStyle",
      target: heroTarget,
      height: "compact",
    });
  }
  if (includesAny(value, ["hero huge", "huge hero", "larger hero"])) {
    operations.push({
      type: "setSectionStyle",
      target: heroTarget,
      height: "immersive",
    });
  }
  if (
    includesAny(value, [
      "hero cinematic",
      "cinematic hero",
      "hero more cinematic",
    ])
  ) {
    operations.push({
      type: "setSectionStyle",
      target: heroTarget,
      variant: "cinematic-editorial",
      media: "panoramic",
      contrast: "high",
      surface: "immersive",
      motion: "drift",
    });
  }
  if (
    includesAny(value, [
      "animated hero",
      "animate the hero",
      "make the hero animated",
    ])
  ) {
    operations.push({
      type: "setSectionStyle",
      target: heroTarget,
      motion: "drift",
    });
    operations.push({ type: "setTheme", motion: "cinematic" });
  }
  if (/\bhero (?:dark|darker)\b|\bmake the hero dark/i.test(value)) {
    operations.push({
      type: "setSectionStyle",
      target: heroTarget,
      tone: "dark",
      contrast: "high",
      surface: "immersive",
    });
  }

  if (includesAny(value, ["more dramatic"]) && explicitSection) {
    operations.push({
      type: "setSectionStyle",
      target: targetFor(explicitSection, context, true),
      contrast: "high",
      surface: "immersive",
      motion: "drift",
      ...(explicitSection === "hero" ? { height: "immersive" as const } : {}),
      textScale: "expressive",
    });
  }

  if (explicitSection) {
    if (includesAny(value, ["easier to scan", "more scannable"])) {
      operations.push({
        type: "setSectionStyle",
        target: targetFor(
          explicitSection,
          context,
          explicitSection === selected?.type,
        ),
        variant:
          explicitSection === "services"
            ? "editorial-list"
            : explicitSection === "features"
              ? "icon-list"
              : undefined,
        density: "compact",
      });
    }
    if (
      includesAny(value, [
        "stronger visual identity",
        "more visual",
        "make this pop",
      ])
    ) {
      operations.push({
        type: "setSectionStyle",
        target: targetFor(
          explicitSection,
          context,
          explicitSection === selected?.type,
        ),
        contrast: "high",
        surface: "immersive",
        media: explicitSection === "gallery" ? "mosaic" : "abstract",
      });
    }
    if (includesAny(value, ["editorial layout", "more editorial layout"])) {
      const variants: Partial<Record<SectionType, string>> = {
        about: "editorial-story",
        services: "editorial-list",
        gallery: "editorial-grid",
        testimonials: "editorial-quotes",
        features: "structured-editorial",
      };
      operations.push({
        type: "setSectionStyle",
        target: targetFor(
          explicitSection,
          context,
          explicitSection === selected?.type,
        ),
        ...(variants[explicitSection]
          ? { variant: variants[explicitSection] }
          : {}),
        density: "airy",
      });
    }
    if (
      includesAny(value, ["more breathing room", "more space", "too crowded"])
    ) {
      operations.push({
        type: "setSectionStyle",
        target: targetFor(
          explicitSection,
          context,
          explicitSection === selected?.type,
        ),
        density: "airy",
      });
    }
    if (
      explicitSection === "gallery" &&
      includesAny(value, ["more cinematic", "cinematic"])
    ) {
      operations.push({
        type: "setSectionStyle",
        target: targetFor(
          "gallery",
          context,
          explicitSection === selected?.type,
        ),
        variant: "cinematic-mosaic",
        contrast: "high",
        surface: "immersive",
        motion: "drift",
      });
    }
    if (
      explicitSection === "contact" &&
      includesAny(value, ["more inviting", "inviting"])
    ) {
      operations.push({
        type: "setSectionStyle",
        target: targetFor(
          "contact",
          context,
          explicitSection === selected?.type,
        ),
        variant: "location-composition",
        tone: "accent",
        density: "airy",
      });
    }
  }

  if (
    includesAny(value, ["cta more prominent", "make the cta more prominent"])
  ) {
    const targetType = selected?.content.primaryCta ? selected.type : "cta";
    operations.push({
      type: "setSectionStyle",
      target: targetFor(targetType, context, targetType === selected?.type),
      tone: "accent",
      contrast: "high",
      surface: "elevated",
    });
  }

  if (
    includesAny(value, ["text smaller", "make the text smaller"]) &&
    explicitSection
  ) {
    operations.push({
      type: "setSectionStyle",
      target: targetFor(explicitSection, context, true),
      density: "compact",
      textScale: "compact",
    });
  }

  const quoted = quotedText(instruction);
  if (quoted && includesAny(value, ["headline", "heading", "title"])) {
    const type = explicitSection ?? "hero";
    operations.push({
      type: "rewriteSection",
      target: targetFor(type, context, type === selected?.type),
      title: quoted,
    });
  }

  if (
    includesAny(value, [
      "use less text",
      "less text",
      "reduce the text",
      "shorter copy",
    ])
  ) {
    const type = explicitSection ?? (sectionOnly ? selected?.type : null);
    if (type) {
      operations.push({
        type: "rewriteSection",
        target: targetFor(type, context, type === selected?.type),
        contentDensity: "less",
      });
    } else {
      for (const type of ["about", "services", "features"] as const) {
        operations.push({
          type: "rewriteSection",
          target: targetFor(type, context),
          contentDensity: "less",
        });
      }
    }
  }

  const addMatch = value.match(
    /add (?:a |an )?(gallery|contact|services?|features?|testimonials?|about)(?: section)?(?: after (services?|about|gallery|features?|contact))?/,
  );
  if (
    addMatch &&
    !(addMatch[1] === "testimonial" || addMatch[1] === "testimonials")
  ) {
    const type = sectionTypeFromText(addMatch[1]!) as Exclude<
      SectionType,
      "hero"
    > | null;
    const after = addMatch[2] ? sectionTypeFromText(addMatch[2]) : null;
    if (type) {
      operations.push({
        type: "addSection",
        pageSlug: context.activePageSlug,
        sectionType: type,
        ...(after ? { afterSectionType: after } : {}),
      });
    }
  }

  const removeType = sectionTypeFromText(value);
  if (
    removeType &&
    /\b(remove|delete|hide)\b/.test(value) &&
    removeType !== "hero"
  ) {
    operations.push({
      type: "removeSection",
      target: targetFor(removeType, context, removeType === selected?.type),
    });
  }

  const moveMatch = value.match(
    /(?:put|move) (gallery|about|rooms?|restaurant|services?|features?|contact|this section) (above|before|below|after) (gallery|about|rooms?|restaurant|services?|features?|contact)/,
  );
  if (moveMatch) {
    const from =
      moveMatch[1] === "this section"
        ? (selected?.type ?? null)
        : sectionTypeFromText(moveMatch[1]!);
    const anchor = sectionTypeFromText(moveMatch[3]!);
    if (from && anchor && from !== "hero") {
      operations.push({
        type: "moveSection",
        target: targetFor(from, context, moveMatch[1] === "this section"),
        relation:
          moveMatch[2] === "above" || moveMatch[2] === "before"
            ? "before"
            : "after",
        anchor: targetFor(anchor, context),
      });
    }
  } else if (
    /move (?:this|selected) section (up|down)/.test(value) &&
    selected
  ) {
    operations.push({
      type: "moveSection",
      target: targetFor(selected.type, context, true),
      relation: value.includes(" down") ? "down" : "up",
    });
  }

  if (/(?:add|create) (?:an? )?about page/.test(value))
    operations.push({ type: "addPage", pageType: "about" });
  if (/(?:add|create) (?:a )?contact page/.test(value))
    operations.push({ type: "addPage", pageType: "contact" });

  if (
    includesAny(value, [
      "different version of this section",
      "alternate version of this section",
      "try a completely different version of this section",
    ]) &&
    selected
  ) {
    operations.push({
      type: "alternate",
      target: "section",
      section: targetFor(selected.type, context, true),
    });
  } else if (
    includesAny(value, [
      "another version",
      "different version",
      "alternate version",
    ])
  ) {
    operations.push({ type: "alternate", target: "site" });
  }

  if (/undo (?:the )?colou?r changes?/.test(value)) {
    operations.push({ type: "restoreTheme", aspect: "palette" });
  }

  if (
    includesAny(value, [
      "improve everything",
      "less generic",
      "give it personality",
    ])
  ) {
    const keepPalette = includesAny(value, [
      "keep the current colour",
      "keep the current color",
      "keep the palette",
    ]);
    operations.push({
      type: "setTheme",
      mood:
        context.spec.site.businessKind === "professional"
          ? "professional"
          : "editorial",
      typography: "editorial-serif",
      spacing: "expansive",
      surface: "layered",
      motion: "fluid",
      headingScale: "expressive",
      ...(!keepPalette && context.spec.theme.palette === "paper-ink"
        ? { palette: "midnight-champagne" as PaletteId }
        : {}),
    });
  }

  if (!operations.length) {
    unsupported.push(
      "Studio could not map this request to a safe design change. Try naming the page, section, visual mood, layout, copy, or mobile behavior you want changed.",
    );
  }

  return studioChangePlanSchema.parse({
    version: STUDIO_CHANGE_PLAN_VERSION,
    scope: inferredScope,
    operations,
    summary: summaryFromOperations(operations),
    unsupported,
  });
}

function resolveSection(
  spec: DesignSpec,
  target: z.infer<typeof sectionTargetSchema>,
): {
  page: DesignSpec["pages"][number];
  section: DesignSection;
  index: number;
} | null {
  const page =
    spec.pages.find((entry) => entry.slug === target.pageSlug) ??
    getHomePage(spec);
  const index = target.sectionId
    ? page.sections.findIndex((section) => section.id === target.sectionId)
    : page.sections.findIndex((section) => section.type === target.sectionType);
  const section = page.sections[index];
  return index >= 0 && section ? { page, section, index } : null;
}

function truncateBody(body: string) {
  if (body.length <= 150) return body;
  const shortened = body
    .slice(0, 147)
    .replace(/\s+\S*$/, "")
    .trim();
  return `${shortened}.`;
}

function alternateSection(section: DesignSection) {
  const variants = sectionVariantRegistry[section.type] as readonly string[];
  const index = Math.max(0, variants.indexOf(section.variant));
  section.variant = variants[(index + 1) % variants.length]!;
  section.layout.density =
    section.layout.density === "airy" ? "balanced" : "airy";
  section.visualTreatment.surface =
    section.visualTreatment.surface === "immersive" ? "outlined" : "immersive";
  section.motion = section.motion === "drift" ? "reveal" : "drift";
}

function pageTemplate(
  type: "about" | "services" | "contact",
  spec: DesignSpec,
) {
  const page = structuredClone(getHomePage(spec));
  const title = type[0]!.toUpperCase() + type.slice(1);
  page.slug = `/${type}`;
  page.title = title;
  page.navigationLabel = title;
  page.sections = [
    structuredClone(page.sections[0]!),
    createSectionForType(type === "services" ? "services" : type, spec),
    createSectionForType(type === "contact" ? "contact" : "cta", spec),
  ];
  page.sections[0]!.id = `${type}-hero`;
  page.sections[0]!.content.eyebrow = title;
  page.sections[0]!.content.title =
    type === "about"
      ? `The story behind ${spec.site.name}.`
      : type === "services"
        ? "A clearer view of what we offer."
        : "Start a useful conversation.";
  page.sections[1]!.id = `${type}-primary`;
  page.sections[2]!.id = `${type}-cta`;
  return page;
}

export function applyStudioChangePlan(
  context: StudioChangeContext,
  planInput: StudioChangePlan,
): StudioChangeResult {
  const plan = studioChangePlanSchema.parse(planInput);
  let spec = structuredClone(context.spec);
  const original = structuredClone(context.spec);
  let changed = false;
  const markChanged = () => {
    changed = true;
  };

  for (const operation of plan.operations) {
    switch (operation.type) {
      case "setTheme": {
        if (operation.palette) spec.theme.palette = operation.palette;
        if (operation.mood) spec.theme.mood = operation.mood;
        if (operation.typography) spec.theme.typography = operation.typography;
        if (operation.spacing) spec.theme.spacing = operation.spacing;
        if (operation.radius) spec.theme.radius = operation.radius;
        if (operation.surface) spec.theme.surface = operation.surface;
        if (operation.motion) spec.theme.motion = operation.motion;
        if (operation.headingScale)
          spec.theme.headingScale = operation.headingScale;
        if (operation.bodyScale) spec.theme.bodyScale = operation.bodyScale;
        if (operation.buttonStyle)
          spec.theme.buttonStyle = operation.buttonStyle;
        markChanged();
        break;
      }
      case "setSectionStyle": {
        const resolved = resolveSection(spec, operation.target);
        if (!resolved) break;
        if (operation.variant) {
          const allowed = sectionVariantRegistry[
            resolved.section.type
          ] as readonly string[];
          if (allowed.includes(operation.variant))
            resolved.section.variant = operation.variant;
        }
        if (operation.alignment)
          resolved.section.layout.alignment = operation.alignment;
        if (operation.density)
          resolved.section.layout.density = operation.density;
        if (operation.height) resolved.section.layout.height = operation.height;
        if (operation.textScale)
          resolved.section.layout.textScale = operation.textScale;
        if (operation.media)
          resolved.section.visualTreatment.media = operation.media;
        if (operation.contrast)
          resolved.section.visualTreatment.contrast = operation.contrast;
        if (operation.surface)
          resolved.section.visualTreatment.surface = operation.surface;
        if (operation.motion) resolved.section.motion = operation.motion;
        if (operation.tone) resolved.section.tone = operation.tone;
        markChanged();
        break;
      }
      case "rewriteSection": {
        const resolved = resolveSection(spec, operation.target);
        if (!resolved) break;
        if (operation.title) resolved.section.content.title = operation.title;
        if (operation.body !== undefined)
          resolved.section.content.body = operation.body;
        if (operation.primaryCta !== undefined)
          resolved.section.content.primaryCta = operation.primaryCta;
        if (operation.secondaryCta !== undefined)
          resolved.section.content.secondaryCta = operation.secondaryCta;
        if (operation.contentDensity === "less") {
          resolved.section.content.body = truncateBody(
            resolved.section.content.body,
          );
          resolved.section.content.items = resolved.section.content.items
            .slice(0, 3)
            .map((item) => ({
              ...item,
              body: truncateBody(item.body),
            }));
          resolved.section.layout.density = "compact";
        }
        if (resolved.section.type === "hero" && operation.title) {
          spec.brand.tagline = operation.title;
        }
        markChanged();
        break;
      }
      case "addSection": {
        const page =
          spec.pages.find((entry) => entry.slug === operation.pageSlug) ??
          getHomePage(spec);
        const added = createSectionForType(operation.sectionType, spec);
        let index = Math.max(1, page.sections.length - 1);
        if (operation.afterSectionId) {
          const found = page.sections.findIndex(
            (section) => section.id === operation.afterSectionId,
          );
          if (found >= 0) index = found + 1;
        } else if (operation.afterSectionType) {
          const found = page.sections.findIndex(
            (section) => section.type === operation.afterSectionType,
          );
          if (found >= 0) index = found + 1;
        }
        page.sections.splice(index, 0, added);
        markChanged();
        break;
      }
      case "removeSection": {
        const resolved = resolveSection(spec, operation.target);
        if (
          !resolved ||
          resolved.index === 0 ||
          resolved.page.sections.length <= 2
        )
          break;
        resolved.page.sections.splice(resolved.index, 1);
        spec.navigation.items = spec.navigation.items.filter(
          (item) => item.target !== `#${resolved.section.id}`,
        );
        markChanged();
        break;
      }
      case "moveSection": {
        const resolved = resolveSection(spec, operation.target);
        if (!resolved || resolved.index === 0) break;
        let destination = resolved.index;
        if (operation.relation === "up")
          destination = Math.max(1, resolved.index - 1);
        if (operation.relation === "down")
          destination = Math.min(
            resolved.page.sections.length - 1,
            resolved.index + 1,
          );
        if (
          (operation.relation === "before" || operation.relation === "after") &&
          operation.anchor
        ) {
          const anchor = resolveSection(spec, operation.anchor);
          if (anchor && anchor.page.slug === resolved.page.slug) {
            destination =
              anchor.index + (operation.relation === "after" ? 1 : 0);
          }
        }
        if (destination !== resolved.index) {
          const [moved] = resolved.page.sections.splice(resolved.index, 1);
          const adjusted =
            operation.relation === "down"
              ? destination
              : destination > resolved.index
                ? destination - 1
                : destination;
          resolved.page.sections.splice(Math.max(1, adjusted), 0, moved!);
          markChanged();
        }
        break;
      }
      case "duplicateSection": {
        const resolved = resolveSection(spec, operation.target);
        if (!resolved || resolved.section.type === "hero") break;
        const copy = structuredClone(resolved.section);
        let suffix = 2;
        while (
          resolved.page.sections.some(
            (section) => section.id === `${copy.id}-${suffix}`,
          )
        )
          suffix += 1;
        copy.id = `${copy.id}-${suffix}`;
        resolved.page.sections.splice(resolved.index + 1, 0, copy);
        markChanged();
        break;
      }
      case "addPage": {
        const slug = `/${operation.pageType}`;
        if (!spec.pages.some((page) => page.slug === slug)) {
          spec.pages.push(pageTemplate(operation.pageType, spec));
          spec.navigation.items.push({
            label:
              operation.pageType[0]!.toUpperCase() +
              operation.pageType.slice(1),
            target: slug,
          });
          markChanged();
        }
        break;
      }
      case "setNavigation": {
        if (operation.style) spec.navigation.style = operation.style;
        if (operation.ctaLabel) spec.navigation.ctaLabel = operation.ctaLabel;
        markChanged();
        break;
      }
      case "setMobile": {
        if (operation.density)
          spec.responsive.mobileDensity = operation.density;
        Object.assign(spec.responsive.overrides, {
          ...(operation.simplified !== undefined
            ? { simplified: operation.simplified }
            : {}),
          ...(operation.heroHeight ? { heroHeight: operation.heroHeight } : {}),
          ...(operation.headingScale
            ? { headingScale: operation.headingScale }
            : {}),
          ...(operation.navigation ? { navigation: operation.navigation } : {}),
        });
        markChanged();
        break;
      }
      case "alternate": {
        if (operation.target === "site") {
          spec = createAlternateDesignSpec(spec);
        } else if (operation.section) {
          const resolved = resolveSection(spec, operation.section);
          if (resolved) alternateSection(resolved.section);
        }
        markChanged();
        break;
      }
      case "restoreTheme": {
        const previous = context.previousThemes.find((theme) => {
          if (operation.aspect === "palette")
            return theme.palette !== spec.theme.palette;
          return JSON.stringify(theme) !== JSON.stringify(spec.theme);
        });
        if (!previous) break;
        if (operation.aspect === "all") spec.theme = structuredClone(previous);
        else if (operation.aspect === "palette")
          spec.theme.palette = previous.palette;
        else if (operation.aspect === "typography")
          spec.theme.typography = previous.typography;
        else if (operation.aspect === "spacing")
          spec.theme.spacing = previous.spacing;
        else if (operation.aspect === "surface")
          spec.theme.surface = previous.surface;
        else if (operation.aspect === "motion")
          spec.theme.motion = previous.motion;
        markChanged();
        break;
      }
    }
  }

  const actualChanged =
    JSON.stringify({ ...original, metadata: null }) !==
    JSON.stringify({ ...spec, metadata: null });
  changed = changed && actualChanged;
  if (changed) {
    spec.metadata = {
      source: "modified",
      conceptLabel: `Intelligent ${spec.theme.mood} direction`,
      revision: Math.min(999, context.spec.metadata.revision + 1),
    };
  }
  return { spec: parseDesignSpec(spec), plan, changed };
}

export function getContextualSuggestions(
  context: StudioChangeContext,
): string[] {
  const selected = selectedSection(context);
  const suggestions: string[] = [];
  if (context.viewport === "mobile") {
    suggestions.push(
      "Simplify this for mobile",
      "Increase touch-target spacing",
      "Make the mobile navigation cleaner",
    );
  }
  switch (selected?.type) {
    case "hero":
      suggestions.push(
        "Make this hero more cinematic",
        "Reduce the hero height",
        "Give the headline more visual impact",
        "Make the CTA more prominent",
      );
      break;
    case "services":
      suggestions.push(
        "Make these services easier to scan",
        "Give each service a stronger visual identity",
        "Reduce this section’s text",
        "Try a more editorial layout",
      );
      break;
    case "gallery":
      suggestions.push(
        "Make this gallery more cinematic",
        "Try a more editorial gallery layout",
        "Give the images more breathing room",
      );
      break;
    case "contact":
      suggestions.push(
        "Make the contact section more inviting",
        "Simplify the contact details",
        "Make the enquiry CTA more prominent",
      );
      break;
    default:
      suggestions.push(
        "Make the site feel more premium",
        "Create a cleaner visual hierarchy",
        "Make this feel less generic",
      );
  }
  if (!context.spec.pages.some((page) => page.slug === "/about")) {
    suggestions.push("Create an About page");
  }
  return [...new Set(suggestions)].slice(0, 4);
}

export function compactStudioContext(context: StudioChangeContext) {
  return {
    site: context.spec.site,
    brand: context.spec.brand,
    theme: context.spec.theme,
    navigation: context.spec.navigation,
    footer: context.spec.footer,
    responsive: context.spec.responsive,
    metadata: context.spec.metadata,
    pages: context.spec.pages.map((page) => ({
      slug: page.slug,
      title: page.title,
      sections: page.sections.map((section) => ({
        id: section.id,
        type: section.type,
        variant: section.variant,
        content: {
          eyebrow: section.content.eyebrow,
          title: section.content.title,
          body: section.content.body,
          primaryCta: section.content.primaryCta,
          secondaryCta: section.content.secondaryCta,
          note: section.content.note,
          stats: section.content.stats,
          items: section.content.items.map((item) => ({
            title: item.title,
            body: item.body,
            meta: item.meta,
          })),
        },
        layout: section.layout,
        visualTreatment: section.visualTreatment,
        motion: section.motion,
        tone: section.tone,
      })),
    })),
    editor: {
      activePageSlug: context.activePageSlug,
      selectedSectionId: context.selectedSectionId,
      viewport: context.viewport,
    },
    recentTurns: context.recentTurns.slice(-4),
    recentThemes: context.previousThemes.slice(0, 3),
    available: {
      moods,
      palettes: paletteIds,
      typography: typographyIds,
      heroVariants,
      sectionVariants: sectionVariantRegistry,
    },
    safety: {
      noExecutableCode: true,
      noFabricatedProof: true,
      noPersistentVisitorText: true,
      responsiveAndAccessible: true,
    },
    vision: { screenshotAvailable: false },
  };
}

export function parseStudioChangePlan(value: unknown) {
  return studioChangePlanSchema.parse(value);
}

export function validatePlanAgainstContext(
  planInput: StudioChangePlan,
  context: StudioChangeContext,
) {
  const plan = studioChangePlanSchema.parse(planInput);
  for (const operation of plan.operations) {
    if (
      operation.type === "setSectionStyle" ||
      operation.type === "rewriteSection" ||
      operation.type === "removeSection" ||
      operation.type === "moveSection" ||
      operation.type === "duplicateSection"
    ) {
      const existing = resolveSection(context.spec, operation.target);
      if (!existing) {
        throw new Error("Change plan targets a section that does not exist.");
      }
    }
    if (operation.type === "alternate" && operation.target === "section") {
      if (
        !operation.section ||
        !resolveSection(context.spec, operation.section)
      ) {
        throw new Error("Change plan targets a section that does not exist.");
      }
    }
    if (operation.type === "setSectionStyle" && operation.variant) {
      const existing = resolveSection(context.spec, operation.target);
      if (!existing) throw new Error("Change plan section does not exist.");
      const variants = sectionVariantRegistry[
        existing.section.type
      ] as readonly string[];
      if (!variants.includes(operation.variant)) {
        throw new Error(
          "Change plan contains a non-allowlisted section variant.",
        );
      }
    }
    if (operation.type === "setTheme") {
      const entries = Object.entries(operation).filter(
        ([key, value]) => key !== "type" && value !== undefined,
      );
      if (!entries.length) throw new Error("Theme operation has no changes.");
    }
  }
  return plan;
}

export function parseContextSpec(value: unknown) {
  return designSpecSchema.parse(value);
}
