import { z } from "zod";
import {
  artDirections,
  applyBlueprintPatch,
  applyBlueprintToSpec,
  blueprintFromSpec,
  compositionFamilies,
  ctaCharacters,
  contentDensities,
  createAlternateDesignSpec,
  heroFamilies,
  mobileStrategies,
  motionFamilies,
  navigationFamilies,
  premiumLevels,
  shapeLanguages,
  spacingRhythms,
  surfaceSystems,
  typographyCharacters,
  visualIntensities,
  type CreativeBlueprintPatch,
} from "./blueprint";
import {
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
  "setCreativeDirection",
  "regenerateVariation",
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
    /** Optional layout variant, so "add a FAQ section" lands as a FAQ. */
    variant: z.string().min(1).max(40).optional(),
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
    decoration: z.enum(["keep", "simplified", "hidden"]).optional(),
  })
  .strict();

/** A single piece of list content the visitor asked for. */
const changeListItemSchema = z
  .object({
    title: z.string().min(1).max(60),
    body: z.string().max(180).optional(),
    meta: z.string().max(28).optional(),
  })
  .strict();

/**
 * CONTENT — "create a list of multivitamin items and protein supplements",
 * "add a list of features". Writes real, visitor-named items into a section
 * instead of silently ignoring the request.
 */
const addListItemsOperation = z
  .object({
    type: z.literal("addListItems"),
    target: sectionTargetSchema,
    heading: z.string().min(1).max(110).optional(),
    items: z.array(changeListItemSchema).min(1).max(6),
    mode: z.enum(["replace", "append"]).default("replace"),
  })
  .strict();

/**
 * COMMERCE — "add a product section for whey protein", "add categories",
 * "add sample products". Products are always clearly marked samples: the
 * Studio never invents prices, stock or specifications.
 */
const addProductsOperation = z
  .object({
    type: z.literal("addProducts"),
    pageSlug: z
      .string()
      .regex(/^\/[a-z0-9\-/]*$/)
      .default("/"),
    kind: z.enum(["products", "categories"]),
    subject: z.string().min(1).max(40).optional(),
    afterSectionType: z.enum(sectionTypes).optional(),
    /** When present, products are added to this existing section. */
    target: sectionTargetSchema.optional(),
  })
  .strict();

/**
 * MEDIA — "add an image area", "add an illustration area", "add a logo or
 * emblem area". Maps to supported artwork rather than refusing the request.
 */
const addMediaAreaOperation = z
  .object({
    type: z.literal("addMediaArea"),
    pageSlug: z
      .string()
      .regex(/^\/[a-z0-9\-/]*$/)
      .default("/"),
    mediaKind: z.enum(["image", "illustration", "emblem"]),
    /** What the visitor asked for, e.g. "lion" in a lion logo request. */
    subject: z.string().min(1).max(40).optional(),
    afterSectionType: z.enum(sectionTypes).optional(),
  })
  .strict();

/** STRUCTURE — "replace this section with a gallery". */
const replaceSectionOperation = z
  .object({
    type: z.literal("replaceSection"),
    target: sectionTargetSchema,
    sectionType: z.enum(sectionTypes).exclude(["hero"]),
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

/**
 * Creative direction changes map visitor language onto the CreativeBlueprint:
 * composition families, hero family, typography character, colour
 * environment, motion and mobile interpretation.
 */
const setCreativeDirectionOperation = z
  .object({
    type: z.literal("setCreativeDirection"),
    premium: z.enum(premiumLevels).optional(),
    intensity: z.enum(visualIntensities).optional(),
    balance: z.enum(["editorial", "commercial", "hybrid"]).optional(),
    density: z.enum(contentDensities).optional(),
    shape: z.enum(shapeLanguages).optional(),
    surface: z.enum(surfaceSystems).optional(),
    whitespace: z.enum(spacingRhythms).optional(),
    layering: z.enum(["flat", "depth", "overlap"]).optional(),
    typographyDisplay: z.enum(typographyCharacters).optional(),
    typographyTreatment: z
      .enum(["editorial", "technical", "expressive", "functional"])
      .optional(),
    palette: z.enum(paletteIds).optional(),
    mood: z.string().min(1).max(24).optional(),
    environment: z.enum(["light", "dark", "tinted"]).optional(),
    composition: z.enum(compositionFamilies).optional(),
    heroFamily: z.enum(heroFamilies).optional(),
    navigationFamily: z.enum(navigationFamilies).optional(),
    artDirection: z.enum(artDirections).optional(),
    motionFamily: z.enum(motionFamilies).optional(),
    ctaCharacter: z.enum(ctaCharacters).optional(),
    mobileStrategy: z.enum(mobileStrategies).optional(),
  })
  .strict();

const regenerateVariationOperation = z
  .object({
    type: z.literal("regenerateVariation"),
    scale: z.enum(["composition", "full"]),
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
  setCreativeDirectionOperation,
  regenerateVariationOperation,
  addListItemsOperation,
  addProductsOperation,
  addMediaAreaOperation,
  replaceSectionOperation,
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
    rhythm: z
      .enum(["even", "cadenced", "escalating", "measured"])
      .default("measured"),
    composition: z.string().min(1).max(32).default("editorial-single-column"),
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

/**
 * Words that describe the artefact or the request itself, never the subject of
 * a logo. "create a huge original lion logo" leaves "lion".
 */
const logoNoise = new Set([
  "a",
  "an",
  "and",
  "awesome",
  "beautiful",
  "big",
  "brand",
  "branding",
  "clean",
  "company",
  "cool",
  "create",
  "created",
  "custom",
  "design",
  "designed",
  "for",
  "fresh",
  "generate",
  "generated",
  "give",
  "great",
  "huge",
  "icon",
  "iconic",
  "large",
  "logo",
  "make",
  "me",
  "modern",
  "monogram",
  "my",
  "need",
  "new",
  "nice",
  "original",
  "our",
  "own",
  "professional",
  "simple",
  "small",
  "some",
  "the",
  "unique",
  "us",
  "want",
  "with",
  "wordmark",
]);

/** The subject of a logo or artwork request, if the visitor named one. */
function artworkSubject(instruction: string): string | undefined {
  const motif = instruction.match(
    /([A-Za-z][A-Za-z0-9'/-]*(?:\s+[A-Za-z][A-Za-z0-9'/-]*){0,3})\s+(?:logo|emblem|monogram|wordmark|icon)\b/i,
  )?.[1];
  if (!motif) return undefined;
  const kept = motif
    .split(/\s+/)
    .filter((word) => !logoNoise.has(word.toLowerCase()))
    .slice(-3)
    .join(" ");
  return kept.length > 1 ? kept : undefined;
}

/**
 * Turn "a list of multivitamin items and protein supplements" into clean list
 * items the renderer can show, without inventing content the visitor did not
 * ask for.
 */
function requestedListItems(
  instruction: string,
): { title: string; body?: string; meta?: string }[] {
  const quoted = quotedText(instruction);
  const source = (quoted ?? instruction)
    .replace(
      /^.*?\b(?:list of|list with|list:|items like|such as|including)\s+/i,
      "",
    )
    .replace(/\b(?:section|please|in the site|on the page)\b.*$/i, "")
    .trim();
  const parts = source
    .split(/\s*(?:,|;|\band\b|\bplus\b|\/)\s*/i)
    .map((part) => part.replace(/^\s*and\s+/i, "").trim())
    .filter((part) => part.length > 1 && part.length <= 60)
    .slice(0, 6);
  return parts.map((part) => ({
    title: `${part[0]!.toUpperCase()}${part.slice(1)}`,
    body: "Editable content — replace this with the real detail.",
    meta: "List item",
  }));
}

/** The product name in "add a product section for whey protein". */
function productSubject(instruction: string): string | undefined {
  const quoted = quotedText(instruction);
  if (quoted) return quoted.slice(0, 40);
  const match = instruction.match(
    /\b(?:for|of|with|about|selling|sells|sell)\s+([A-Za-z0-9][A-Za-z0-9 '&/-]{2,38})$/i,
  )?.[1];
  if (!match) return undefined;
  const cleaned = match
    .replace(/\b(?:section|page|please|products?|items?)\b.*$/i, "")
    .replace(/[.?!]+$/, "")
    .trim();
  return cleaned.length > 1 ? cleaned : undefined;
}

/** Section types already present on the page being edited. */
function pageSectionTypes(context: StudioChangeContext): SectionType[] {
  return pageFor(context).sections.map((section) => section.type);
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
    case "setCreativeDirection":
      return "shifted the creative direction";
    case "regenerateVariation":
      return "built a different version of the whole site";
    case "addListItems":
      return `added the list you asked for to the ${operation.target.sectionType ?? "selected"} section`;
    case "addProducts":
      return operation.kind === "categories"
        ? "added a category section"
        : "added a product section";
    case "addMediaArea":
      return operation.mediaKind === "emblem"
        ? "added a logo and emblem area"
        : `added an ${operation.mediaKind} area`;
    case "replaceSection":
      return `replaced the section with a ${operation.sectionType} section`;
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

  /* ------------------------------------------------------------------
     MEDIA, ARTWORK AND LOGO REQUESTS

     A visitor asking for an original logo gets a supported outcome plus a
     clear statement about what needs a real image source — never the generic
     "could not map this request" message.
     ------------------------------------------------------------------ */
  const mentionsArtwork =
    /\b(?:logo|emblem|monogram|wordmark|illustration|artwork|image|photo|picture|visual)\b/.test(
      value,
    );
  const wantsArtworkCreated =
    /\b(?:create|make|generate|design|add|need|want|include|give|build)\b/.test(
      value,
    ) && mentionsArtwork;
  const aboutSizing =
    /\b(?:bigger|smaller|larger|resize|move|position|top|centre|center|bottom)\b/.test(
      value,
    ) && !/\b(?:create|generate|original|new|custom)\b/.test(value);

  if (wantsArtworkCreated && !aboutSizing) {
    const subject = artworkSubject(instruction);
    const kind = /\b(?:logo|emblem|monogram|wordmark|icon)\b/.test(value)
      ? "emblem"
      : /\b(?:illustration|artwork|drawing)\b/.test(value)
        ? "illustration"
        : "image";
    operations.push({
      type: "addMediaArea",
      pageSlug: context.activePageSlug,
      mediaKind: kind,
      ...(subject ? { subject } : {}),
    });
    if (kind === "emblem") {
      unsupported.push(
        subject
          ? `Custom logo artwork ("${subject}") needs a real image source or upload; a typed emblem area was added in its place.`
          : "Custom logo artwork needs a real image source or upload; an emblem placeholder area was added instead.",
      );
    } else {
      unsupported.push(
        /\b(?:original|custom|unique|generate|create)\b/.test(value)
          ? "Generated photography and illustration need an image source or generator; an art-directed media area was added instead."
          : "Image upload is not available yet; the layout and art direction for the media area were prepared.",
      );
    }
  }

  /* ------------------------------------------------------------------
     CONTENT AND COMMERCE
     ------------------------------------------------------------------ */
  const wantsCategories =
    /\b(?:product )?categor(?:y|ies)\b/.test(value) &&
    /\b(?:add|create|include|need|want|show|build|make)\b/.test(value);
  const wantsProducts =
    /\b(?:products?|product grid|shop|store|checkout|catalogue|catalog|shelf|shelves)\b/.test(
      value,
    ) &&
    /\b(?:add|create|include|need|want|show|build|make|selling|sells|sell)\b/.test(
      value,
    );

  if (wantsCategories || wantsProducts) {
    const subject = productSubject(instruction);
    const onPage = pageSectionTypes(context);
    operations.push({
      type: "addProducts",
      pageSlug: context.activePageSlug,
      kind: wantsCategories ? "categories" : "products",
      ...(subject ? { subject } : {}),
      ...(onPage.includes("listings")
        ? {
            target: targetFor(
              "listings",
              context,
              selected?.type === "listings",
            ),
          }
        : {}),
    });
  }

  const wantsList =
    /\b(?:list|bullet|checklist|items)\b/.test(value) &&
    /\b(?:add|create|make|include|need|want|give|build)\b/.test(value);
  if (wantsList && !wantsProducts && !wantsCategories) {
    const items = requestedListItems(instruction);
    const productish =
      /\b(?:supplement|protein|vitamin|nutrition|product|package|gear|stock|menu)\b/.test(
        value,
      );
    const onPage = pageSectionTypes(context);
    const targetType: Exclude<SectionType, "hero"> =
      namedSection && namedSection !== "hero"
        ? namedSection
        : productish
          ? "listings"
          : "features";
    if (productish && !onPage.includes("listings")) {
      operations.push({
        type: "addProducts",
        pageSlug: context.activePageSlug,
        kind: "products",
        ...(items[0] ? { subject: items[0].title } : {}),
      });
    } else if (onPage.includes(targetType) && items.length) {
      operations.push({
        type: "addListItems",
        target: targetFor(targetType, context, selected?.type === targetType),
        items: items.slice(0, 6),
        mode: "replace",
      });
    } else {
      operations.push({
        type: "addSection",
        pageSlug: context.activePageSlug,
        sectionType: targetType,
      });
    }
  }

  /* FAQ sections land as an actual FAQ, not a generic feature grid. */
  if (
    /\b(?:faq|frequently asked|questions?)\b/.test(value) &&
    /\b(?:add|create|include|need|want|make)\b/.test(value)
  ) {
    operations.push({
      type: "addSection",
      pageSlug: context.activePageSlug,
      sectionType: "features",
      variant: "faq-list",
    });
  }

  /* ------------------------------------------------------------------
     STRUCTURE
     ------------------------------------------------------------------ */
  const replaceMatch = value.match(
    /replace (?:the |this )?(hero|about|services?|gallery|features?|listings?|testimonials?|contact|cta) (?:section )?with (?:a |an )?(hero|about|services?|gallery|features?|listings?|testimonials?|contact|cta)/,
  );
  if (replaceMatch) {
    const fromType = sectionTypeFromText(replaceMatch[1]!);
    const toType = sectionTypeFromText(replaceMatch[2]!);
    if (fromType && toType && toType !== "hero") {
      operations.push({
        type: "replaceSection",
        target: targetFor(fromType, context, fromType === selected?.type),
        sectionType: toType,
      });
    }
  }

  /* A completely different hero is a real hero replacement, not a recolour. */
  if (
    /\bhero\b/.test(value) &&
    /(?:replace (?:this |the )?hero|completely different hero|totally different hero|entirely different hero|new hero|another hero|different hero)/.test(
      value,
    ) &&
    !/\b(?:keep|preserve|don't change|do not change|same|shorter|taller|bigger|smaller|darker|brighter)\b/.test(
      value,
    )
  ) {
    operations.push({
      type: "alternate",
      target: "section",
      section: targetFor("hero", context, true),
    });
  }

  /* ------------------------------------------------------------------
     MOBILE SIMPLIFICATION
     ------------------------------------------------------------------ */
  /* Mobile adjustments share one operation: two setMobile entries would
     report the same work twice in the change summary. */
  const mobileOperation = operations.find(
    (operation) => operation.type === "setMobile",
  ) as Extract<StudioChangeOperation, { type: "setMobile" }> | undefined;
  const adjustMobile = (
    patch: Partial<Extract<StudioChangeOperation, { type: "setMobile" }>>,
  ) => {
    if (mobileOperation) {
      Object.assign(mobileOperation, patch);
      return;
    }
    operations.push({ type: "setMobile", ...patch });
  };

  if (
    /\b(?:decoration|decorative|effects?|animations?|artwork|ornaments?)\b/.test(
      value,
    ) &&
    /\b(?:hide|remove|reduce|simplify|less|drop|turn off|disable)\b/.test(value)
  ) {
    adjustMobile({
      simplified: true,
      decoration: /\b(?:hide|remove|drop|turn off|disable)\b/.test(value)
        ? "hidden"
        : "simplified",
    });
  }
  if (
    /\b(?:reduce|lower|less)\b/.test(value) &&
    /\b(?:density|crowded|busy|dense)\b/.test(value)
  ) {
    adjustMobile({ simplified: true, density: "compact" });
  }
  if (
    /\b(?:mobile)\b/.test(value) &&
    /\b(?:navigation|menu|nav)\b/.test(value) &&
    /\b(?:change|different|simplify|simpler|minimal)\b/.test(value)
  ) {
    adjustMobile({ navigation: "minimal" });
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

  const creativeDirection = creativeDirectionPlan(value, {
    sectionOnly: sectionOnly || mobileOnly || desktopOnly,
    heroTargeted: /\bhero\b/.test(value),
  });
  if (creativeDirection) operations.push(creativeDirection);

  const hero = context.spec.pages
    .flatMap((page) => page.sections)
    .find((section) => section.type === "hero");
  const keepOnly = includesAny(value, [
    "keep the",
    "keep this",
    "don't change",
    "do not change",
    "leave the",
  ]);
  if (
    hero &&
    !keepOnly &&
    /\b(?:completely )?(?:different|new|another|swap the|change the) hero\b/.test(
      value,
    )
  ) {
    const position = heroFamilies.indexOf(hero.variant as never);
    const next =
      heroFamilies[(Math.max(0, position) + 1) % heroFamilies.length]!;
    operations.push({
      type: "setSectionStyle",
      target: heroTarget,
      variant: next,
      ...(position < 0 ? { media: "abstract" as const } : {}),
    });
  }

  if (
    explicitSection === "about" &&
    includesAny(value, [
      "more visual",
      "more imagery",
      "image led",
      "visual story",
    ])
  ) {
    operations.push({
      type: "setSectionStyle",
      target: targetFor("about", context, true),
      variant: "image-led-story",
      media: "portrait",
      surface: "elevated",
    });
  }

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

/**
 * Sample commerce content.
 *
 * Everything is labelled as a sample so a visitor never mistakes placeholder
 * copy for a real product, price or claim. The subject the visitor named is
 * used verbatim so the section obviously answers what they asked for.
 */
function sampleCommerceItems(
  kind: "products" | "categories",
  subject?: string,
): DesignSection["content"]["items"] {
  const named = subject?.replace(/\s+/g, " ").trim() ?? "";
  const titled = named ? `${named[0]!.toUpperCase()}${named.slice(1)}` : "";
  if (kind === "categories") {
    return [
      {
        title: titled || "Protein powders",
        body: "Sample category — add your real category and what it covers.",
        meta: "Category",
        accent: "01",
      },
      {
        title: "Multivitamins",
        body: "Sample category for daily and targeted formulas.",
        meta: "Category",
        accent: "02",
      },
      {
        title: "Everyday nutrition",
        body: "Sample category for minerals, omega and general supplements.",
        meta: "Category",
        accent: "03",
      },
    ];
  }
  return [
    {
      title: titled ? `${titled} — sample item` : "Sample product",
      body: "Replace this with your real product name, size and price.",
      meta: "Sample item",
      accent: "01",
    },
    {
      title: "Sample product",
      body: "A second product entry so the grid reads as a real shelf.",
      meta: "Sample item",
      accent: "02",
    },
    {
      title: "Sample product",
      body: "Add brand, flavour, weight and label details from your own packaging.",
      meta: "Sample item",
      accent: "03",
    },
  ];
}

/** Adds a section just before the page's closing action section. */
function insertSectionBeforeClose(
  spec: DesignSpec,
  pageSlug: string,
  added: DesignSection,
  afterSectionType?: SectionType,
) {
  const page =
    spec.pages.find((entry) => entry.slug === pageSlug) ?? getHomePage(spec);
  if (afterSectionType) {
    const found = page.sections.findIndex(
      (section) => section.type === afterSectionType,
    );
    if (found >= 0) {
      page.sections.splice(found + 1, 0, added);
      return;
    }
  }
  page.sections.splice(Math.max(1, page.sections.length - 1), 0, added);
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
        if (
          operation.variant &&
          sectionVariantRegistry[operation.sectionType].includes(
            operation.variant as never,
          )
        ) {
          added.variant = operation.variant;
        }
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
          ...(operation.decoration ? { decoration: operation.decoration } : {}),
        });
        markChanged();
        break;
      }
      case "addListItems": {
        const resolved = resolveSection(spec, operation.target);
        if (!resolved) break;
        const items = operation.items.map((item, position) => ({
          title: item.title,
          body: item.body ?? "",
          meta: item.meta ?? "",
          accent: `0${position + 1}`.slice(-2),
        }));
        const existing =
          operation.mode === "append" ? resolved.section.content.items : [];
        resolved.section.content.items = [...existing, ...items].slice(0, 8);
        if (operation.heading)
          resolved.section.content.title = operation.heading;
        markChanged();
        break;
      }
      case "addProducts": {
        const items = sampleCommerceItems(operation.kind, operation.subject);
        const existing = operation.target
          ? resolveSection(spec, operation.target)
          : null;
        if (existing) {
          existing.section.content.items = [
            ...existing.section.content.items,
            ...items,
          ].slice(0, 8);
          if (operation.subject)
            existing.section.content.title = operation.subject;
          markChanged();
          break;
        }
        const added = createSectionForType("listings", spec);
        added.variant =
          operation.kind === "categories" ? "index-list" : "product-grid";
        added.content.eyebrow =
          operation.kind === "categories" ? "Categories" : "Products";
        added.content.title =
          operation.subject ??
          (operation.kind === "categories"
            ? "Shop by category."
            : "The product range.");
        added.content.items = items;
        insertSectionBeforeClose(
          spec,
          operation.pageSlug,
          added,
          operation.afterSectionType,
        );
        markChanged();
        break;
      }
      case "addMediaArea": {
        const added =
          operation.mediaKind === "emblem"
            ? createSectionForType("features", spec)
            : createSectionForType("gallery", spec);
        if (operation.mediaKind === "emblem") {
          added.variant = "icon-list";
          added.content.eyebrow = "Brand";
          added.content.title = operation.subject
            ? `${operation.subject} emblem — placeholder`
            : "Wordmark, emblem and icon set.";
          added.content.note =
            "Emblem placeholder — a custom logo needs an image source or upload.";
          added.content.items = [
            {
              title: "Wordmark",
              body: "Your business name set as a considered typographic mark.",
              meta: "Placeholder",
              accent: "01",
            },
            {
              title: "Emblem",
              body: "Reserved for the real emblem artwork once the file is supplied.",
              meta: "Placeholder",
              accent: "02",
            },
            {
              title: "Icon set",
              body: "A consistent icon language for services and features.",
              meta: "Placeholder",
              accent: "03",
            },
          ];
        } else {
          added.variant =
            operation.mediaKind === "illustration"
              ? "art-collage"
              : "editorial-grid";
          added.visualTreatment.media =
            operation.mediaKind === "illustration" ? "abstract" : "mosaic";
          added.content.eyebrow =
            operation.mediaKind === "illustration" ? "Illustration" : "Images";
          added.content.title =
            operation.mediaKind === "illustration"
              ? "An illustration-led area."
              : "An image-led area.";
          added.content.note =
            operation.mediaKind === "illustration"
              ? "Abstract artwork language — ready for commissioned illustration."
              : "Art-directed image area — ready for your own photography.";
        }
        insertSectionBeforeClose(
          spec,
          operation.pageSlug,
          added,
          operation.afterSectionType,
        );
        markChanged();
        break;
      }
      case "replaceSection": {
        const resolved = resolveSection(spec, operation.target);
        if (!resolved || resolved.index === 0) break;
        const replacement = createSectionForType(operation.sectionType, spec);
        // The replacement keeps the section slot, anchor and the copy the
        // visitor may have already written.
        replacement.id = resolved.section.id;
        if (resolved.section.content.title)
          replacement.content.title = resolved.section.content.title;
        if (resolved.section.content.body)
          replacement.content.body = resolved.section.content.body;
        resolved.page.sections.splice(resolved.index, 1, replacement);
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
      case "setCreativeDirection": {
        const patch: CreativeBlueprintPatch = {
          direction: compactObject({
            premium: operation.premium,
            intensity: operation.intensity,
            balance: operation.balance,
            density: operation.density,
            shape: operation.shape,
            surface: operation.surface,
            whitespace: operation.whitespace,
            layering: operation.layering,
          }),
          typography: compactObject({
            display: operation.typographyDisplay,
            treatment: operation.typographyTreatment,
          }),
          colour: compactObject({
            palette: operation.palette,
            mood: operation.mood,
            environment: operation.environment,
          }),
          layout: compactObject({ composition: operation.composition }),
          hero: compactObject({
            family: operation.heroFamily,
            artDirection: operation.artDirection,
          }),
          navigation: compactObject({ family: operation.navigationFamily }),
          motion: compactObject({ family: operation.motionFamily }),
          cta: compactObject({ character: operation.ctaCharacter }),
          mobile: compactObject({ strategy: operation.mobileStrategy }),
        };
        const responsiveBefore = structuredClone(spec.responsive);
        const nextBlueprint = applyBlueprintPatch(
          blueprintFromSpec(spec),
          patch,
        );
        spec = applyBlueprintToSpec(spec, nextBlueprint, {
          preservePresentation: true,
        });
        if (operation.heroFamily) {
          const heroSection = spec.pages
            .flatMap((page) => page.sections)
            .find((section) => section.type === "hero");
          if (heroSection) heroSection.variant = operation.heroFamily;
        }
        if (!operation.mobileStrategy) {
          spec.responsive = responsiveBefore;
        }
        spec.metadata.blueprint = nextBlueprint;
        markChanged();
        break;
      }
      case "regenerateVariation": {
        spec = createAlternateDesignSpec(spec, {
          structural: operation.scale === "full",
        });
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
      ...spec.metadata,
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
    if (
      operation.type === "setTheme" ||
      operation.type === "setCreativeDirection"
    ) {
      const entries = Object.entries(operation).filter(
        ([key, value]) => key !== "type" && value !== undefined,
      );
      if (!entries.length)
        throw new Error("Creative direction operation has no changes.");
    }
  }
  return plan;
}

export function parseContextSpec(value: unknown) {
  return designSpecSchema.parse(value);
}

/**
 * Free-AI efficiency: simple, literal commands stay entirely in the
 * deterministic local planner. Only genuinely semantic or creative requests
 * are escalated to the AI creative director, and one request never triggers
 * more than one inference call.
 */
export function shouldEscalateStudioInstruction(
  instruction: string,
  plan: StudioChangePlan,
): boolean {
  const value = instruction.toLowerCase();
  if (!plan.operations.length) return true;
  if (plan.unsupported.length) return true;
  const operations = plan.operations.map((operation) => operation.type);
  const creativeIntent = operations.some(
    (type) =>
      type === "setCreativeDirection" ||
      type === "alternate" ||
      type === "regenerateVariation",
  );
  const semanticMarkers = [
    "feel",
    "feels",
    "vibe",
    "mood",
    "inspired",
    "in the style",
    "art direction",
    "brand",
    "positioning",
    "personality",
    "less corporate",
    "more premium",
    "more expensive",
    "too generic",
    "generic",
    "story",
    "narrative",
    "copy",
    "tone",
    "rewrite",
    "reword",
    "like a",
    "feel like",
    "different direction",
    "fresh direction",
  ];
  const semantic = semanticMarkers.some((marker) => value.includes(marker));
  if (creativeIntent) {
    const explicitFields = new Set(
      plan.operations.flatMap((operation) =>
        Object.entries(operation)
          .filter(([key, entry]) => key !== "type" && entry !== undefined)
          .map(([key]) => key),
      ),
    );
    if (
      operations.includes("alternate") ||
      operations.includes("regenerateVariation")
    )
      return false;
    if (operations.includes("setCreativeDirection") && explicitFields.size < 3)
      return false;
  }
  return semantic;
}

function compactObject<T extends Record<string, unknown>>(
  source: T,
): T | undefined {
  const entries = Object.entries(source).filter(
    ([, value]) => value !== undefined,
  );
  if (!entries.length) return undefined;
  return Object.fromEntries(entries) as T;
}

const creativeMarkers = {
  cinematic: [
    "cinematic",
    "dramatic",
    "immersive",
    "atmospheric",
    "moody",
    "film-like",
    "epic",
  ],
  luxury: [
    "luxury",
    "luxurious",
    "expensive",
    "premium",
    "high-end",
    "five star",
    "5 star",
    "exclusive",
    "bespoke",
    "high end",
  ],
  hospitality: ["hotel", "resort", "hospitality", "boutique stay"],
  minimal: [
    "minimal",
    "minimalist",
    "simpler",
    "cleaner",
    "less busy",
    "understated",
    "quieter",
    "restrained",
    "less corporate",
    "swiss",
  ],
  playful: ["playful", "fun", "livelier", "friendlier", "youthful"],
  editorial: ["editorial", "magazine", "literary", "typographic", "serif"],
  technical: [
    "technical",
    "technological",
    "software",
    "apple",
    "saas",
    "engineering",
    "futuristic",
    "data-driven",
    "cyber",
  ],
  bold: [
    "bold",
    "graphic",
    "poster",
    "loud",
    "high contrast",
    "statement",
    "brutalist",
  ],
  organic: ["organic", "natural", "earthy", "botanical", "handmade", "rustic"],
  heritage: [
    "heritage",
    "traditional",
    "classic",
    "timeless",
    "artisan",
    "vintage",
  ],
  dark: ["dark", "darker", "black", "noir", "midnight"],
  light: ["light", "lighter", "bright", "airy", "white", "cleaner background"],
  warm: ["warm", "cosy", "cozy", "inviting", "terracotta"],
  premium: ["premium", "more expensive", "high-end", "high end"],
} as const;

/**
 * Deterministic interpretation of creative language into an allowlisted
 * blueprint change. Only structurally meaningful vocabulary counts as a
 * match, so simple colour commands keep using the literal theme planner.
 */
function creativeDirectionPlan(
  value: string,
  options: { sectionOnly: boolean; heroTargeted: boolean },
): z.infer<typeof setCreativeDirectionOperation> | null {
  if (options.sectionOnly) return null;
  const patch: Record<string, unknown> = {};
  let decisive = false;
  const has = (terms: readonly string[]) =>
    terms.some((term) => value.includes(term));
  const apply = (field: string, next: unknown, strong = true) => {
    patch[field] = next;
    if (strong) decisive = true;
  };

  const heroField = options.heroTargeted
    ? () => undefined
    : (field: string, next: unknown) => apply(field, next);
  const applyIfAbsent = (field: string, next: unknown) => {
    if (patch[field] === undefined) apply(field, next);
  };

  if (has(creativeMarkers.cinematic)) {
    apply("intensity", "dramatic");
    apply("motionFamily", "cinematic");
    apply("mood", "cinematic");
    heroField("heroFamily", "cinematic-media");
    heroField("composition", "full-bleed-immersive");
    apply("artDirection", "light-shafts");
    apply("environment", "dark", false);
  }
  if (has(creativeMarkers.luxury)) {
    apply("premium", "luxury");
    apply("mood", "luxury");
    apply("whitespace", "spacious");
    apply("surface", "layered");
    apply("typographyDisplay", "editorial-serif");
    apply("typographyTreatment", "editorial");
    apply("intensity", "dramatic");
    apply("layering", "overlap");
    apply("environment", "dark", false);
  }
  if (has(creativeMarkers.hospitality)) {
    heroField("heroFamily", "hospitality-image-led");
    apply("composition", "masonry-editorial", false);
    apply("premium", "luxury", false);
    apply("whitespace", "spacious", false);
  }
  if (has(creativeMarkers.minimal)) {
    apply("intensity", "restrained");
    apply("mood", "minimal");
    apply("density", "sparse");
    apply("composition", "editorial-single-column");
    apply("whitespace", "spacious");
    apply("shape", "sharp");
    apply("motionFamily", "quiet");
    apply("balance", "editorial");
    apply("typographyTreatment", "functional");
    apply("typographyDisplay", "grotesk-modern");
    apply("layering", "flat");
  }
  if (has(creativeMarkers.playful)) {
    apply("shape", "organic");
    apply("mood", "playful");
    applyIfAbsent("motionFamily", "playful");
    apply("typographyDisplay", "expressive-display");
    apply("balance", "editorial");
    apply("intensity", "expressive");
  }
  if (has(creativeMarkers.editorial)) {
    apply("mood", "editorial");
    apply("typographyDisplay", "editorial-serif");
    apply("balance", "editorial");
    apply("typographyTreatment", "editorial");
  }
  if (has(creativeMarkers.technical)) {
    apply("mood", "technical");
    apply("typographyDisplay", "geometric-technical");
    apply("typographyTreatment", "technical");
    apply("composition", "technical-grid");
    apply("surface", "glass");
    applyIfAbsent("motionFamily", "technical");
    apply("shape", "sharp");
    apply("artDirection", "grid-technical");
  }
  if (has(creativeMarkers.bold)) {
    apply("mood", "bold");
    apply("typographyDisplay", "condensed-poster");
    apply("intensity", "dramatic");
    apply("shape", "sharp");
  }
  if (has(creativeMarkers.organic)) {
    apply("mood", "organic");
    apply("shape", "organic");
    apply("surface", "grain");
    apply("palette", "sand-olive", false);
  }
  if (has(creativeMarkers.heritage)) {
    apply("mood", "heritage");
    apply("typographyDisplay", "editorial-serif");
    apply("premium", "luxury");
    apply("surface", "paper");
    apply("environment", "light", false);
  }
  if (has(creativeMarkers.premium)) {
    apply("mood", "luxury", false);
    apply("premium", "luxury");
  }
  if (has(creativeMarkers.dark)) {
    apply("environment", "dark", false);
    apply("palette", "midnight-champagne", false);
  }
  if (has(creativeMarkers.light)) {
    apply("environment", "light", false);
    apply("palette", "paper-ink", false);
  }
  if (has(creativeMarkers.warm)) {
    apply("mood", "warm", false);
    apply("palette", "ivory-terracotta", false);
    apply("typographyDisplay", "humanist-warm", false);
  }
  if (!decisive) return null;
  return { type: "setCreativeDirection", ...patch } as z.infer<
    typeof setCreativeDirectionOperation
  >;
}
