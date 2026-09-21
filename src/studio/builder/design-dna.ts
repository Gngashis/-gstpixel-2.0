import { z } from "zod";

/**
 * DesignDNA — the design identity layer.
 *
 * The blueprint decides *what* a website is (business, sections, pages). The
 * DesignDNA decides *how the whole site looks and behaves*: one coherent
 * identity — visual personality, composition, typography character, rhythm,
 * density, radius, borders, palette, contrast, background treatment, imagery
 * character, button language, navigation treatment, section rhythm, motion
 * level and mobile interpretation.
 *
 * Every page of a generated site is rendered from the same DNA, which is what
 * stops the home page reading as luxury editorial while a secondary page drifts
 * into a generic template.
 *
 * The DNA is *derived*, never authored: raw visitor text never reaches it, so
 * every token is a bounded, lowercase design id (safe for class names and CSS
 * variables). The DNA module deliberately imports nothing from the blueprint so
 * the blueprint can depend on it without a cycle; it reads a structural source
 * instead.
 */

export const DESIGN_DNA_VERSION = 1 as const;

export const motionLevels = ["none", "subtle", "premium", "cinematic"] as const;
export type MotionLevel = (typeof motionLevels)[number];

const dnaToken = z
  .string()
  .regex(/^[a-z][a-z0-9-]{0,39}$/, "Design token is not allowed.");

const dnaText = (max: number, min = 1) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(z.string().min(min).max(max));

export const designDnaSchema = z
  .object({
    version: z.literal(DESIGN_DNA_VERSION),
    identity: z
      .object({
        /** Business-appropriate creative name, e.g. "Editorial Atelier". */
        name: dnaText(48),
        personality: dnaToken,
        register: dnaToken,
        premium: dnaToken,
        sophistication: dnaToken,
        keywords: z.array(dnaText(34)).min(1).max(5),
      })
      .strict(),
    hero: z
      .object({
        family: dnaToken,
        height: dnaToken,
        media: dnaToken,
        placement: dnaToken,
        cta: dnaToken,
        motion: dnaToken,
      })
      .strict(),
    composition: z
      .object({
        family: dnaToken,
        container: dnaToken,
        symmetry: dnaToken,
        density: dnaToken,
        viewportUse: dnaToken,
        alignment: dnaToken,
      })
      .strict(),
    typography: z
      .object({
        display: dnaToken,
        body: dnaToken,
        scale: dnaToken,
        contrast: dnaToken,
        rhythm: dnaToken,
        treatment: dnaToken,
        /** Mobile typography cap — the largest heading scale allowed on phones. */
        cap: dnaToken,
      })
      .strict(),
    spacing: z
      .object({
        rhythm: dnaToken,
        density: dnaToken,
        sectionRhythm: dnaToken,
      })
      .strict(),
    radius: z
      .object({ language: dnaToken, buttons: dnaToken, corners: dnaToken })
      .strict(),
    borders: z.object({ weight: dnaToken, dividers: dnaToken }).strict(),
    palette: z
      .object({
        id: dnaToken,
        mood: dnaToken,
        environment: dnaToken,
        contrast: dnaToken,
        accent: dnaToken,
        surfaces: dnaToken,
      })
      .strict(),
    background: z
      .object({ treatment: dnaToken, geometry: dnaToken, depth: dnaToken })
      .strict(),
    imagery: z
      .object({ direction: dnaToken, treatment: dnaToken, density: dnaToken })
      .strict(),
    buttons: z.object({ language: dnaToken, presence: dnaToken }).strict(),
    navigation: z
      .object({
        family: dnaToken,
        density: dnaToken,
        treatment: dnaToken,
        ctaPosition: dnaToken,
      })
      .strict(),
    motion: z
      .object({
        level: z.enum(motionLevels),
        family: dnaToken,
        intensity: dnaToken,
        choreography: dnaToken,
      })
      .strict(),
    mobile: z
      .object({
        strategy: dnaToken,
        hero: dnaToken,
        navigation: dnaToken,
        density: dnaToken,
        typographyCap: dnaToken,
        decoration: dnaToken,
        ctaPriority: dnaToken,
      })
      .strict(),
  })
  .strict();

export type DesignDNA = z.infer<typeof designDnaSchema>;

/**
 * The subset of a creative blueprint the DNA needs. Declared structurally so
 * this module never imports the blueprint (no cycle) while a real blueprint
 * still type-checks against it.
 */
export type DnaSource = {
  business: {
    category: string;
    sophistication: string;
    personality: string;
    name: string;
  };
  direction: {
    concept: string;
    intensity: string;
    balance: string;
    premium: string;
    density: string;
    shape: string;
    surface: string;
    whitespace: string;
    layering: string;
  };
  typography: {
    display: string;
    body: string;
    scale: string;
    contrast: string;
    rhythm: string;
    treatment: string;
  };
  colour: {
    palette: string;
    mood: string;
    environment: string;
    contrast: string;
    accent: string;
    surfaces: string;
  };
  layout: {
    composition: string;
    container: string;
    symmetry: string;
    rhythm: string;
    density: string;
    viewportUse: string;
    alignment: string;
  };
  navigation: {
    family: string;
    density: string;
    ctaPosition: string;
    treatment: string;
  };
  hero: {
    family: string;
    height: string;
    media: string;
    typographyPlacement: string;
    cta: string;
    motion: string;
    artDirection: string;
  };
  sections: ReadonlyArray<{ type: string; purpose: string; density: string }>;
  motion: { family: string; intensity: string };
  mobile: {
    strategy: string;
    heroHeight: string;
    navigation: string;
    density: string;
    simplification: readonly string[];
  };
};

const clone = <T>(value: T): T => structuredClone(value);

/** Motion characters are mapped to the four formalised motion levels. */
export function motionLevelFor(family: string): MotionLevel {
  switch (family) {
    case "quiet":
      return "none";
    case "editorial":
    case "technical":
      return "subtle";
    case "luxury":
      return "premium";
    case "cinematic":
    case "playful":
      return "cinematic";
    default:
      return "subtle";
  }
}

/**
 * The declared `theme.motion` vocabulary mapped onto the four formalised
 * levels, so a whole-website motion change and a generated identity agree.
 */
export function motionLevelForTheme(motion: string): MotionLevel {
  switch (motion) {
    case "quiet":
      return "none";
    case "cinematic":
    case "energetic":
      return "cinematic";
    default:
      return "subtle";
  }
}

/**
 * A copy of the identity with one motion level.
 *
 * Motion is declared on the theme, but the identity is stored alongside the
 * spec, so a motion change reconciles the stored identity instead of
 * re-deriving it — re-deriving would discard the choices the visitor made by
 * hand on every other axis.
 */
export function withMotionLevel(dna: DesignDNA, level: MotionLevel): DesignDNA {
  const next = clone(dna);
  const previous = next.motion.level;
  next.motion.level = level;
  next.identity.keywords = next.identity.keywords.map((keyword) =>
    keyword === previous ? level : keyword,
  );
  return designDnaSchema.parse(next);
}

/** Border language follows the shape language: sharp brands get real rules. */
function borderWeight(shape: string, intensity: string): string {
  if (shape === "sharp") return intensity === "dramatic" ? "strong" : "defined";
  if (shape === "organic") return "none";
  return intensity === "restrained" ? "hairline" : "hairline";
}

function dividerStyle(treatment: string, rhythm: string): string {
  if (treatment === "technical") return "grid";
  if (rhythm === "spacious") return "offset";
  return "rule";
}

function containerFor(layout: DnaSource["layout"]): string {
  return layout.container;
}

function sectionRhythm(blueprint: DnaSource): string {
  const purposes = blueprint.sections.map((section) => section.purpose);
  const converts = purposes.filter(
    (purpose) => purpose === "convert" || purpose === "invite",
  ).length;
  if (converts >= 2) return "punctuated";
  if (blueprint.direction.whitespace === "spacious") return "spacious";
  if (blueprint.direction.whitespace === "tight") return "dense";
  return "even";
}

function imageryTreatment(hero: DnaSource["hero"]): string {
  switch (hero.media) {
    case "typographic":
      return "typographic-lead";
    case "geometric":
      return "geometric";
    case "framed":
      return "framed";
    case "grid-panel":
      return "technical";
    case "panoramic-field":
      return "panoramic";
    case "layered-cards":
      return "layered";
    case "abstract-gradient":
      return "abstract";
    case "none":
      return "none";
    default:
      return "abstract";
  }
}

function buttonsPresence(premium: string, alignment: string): string {
  if (premium === "luxury") return "understated";
  if (alignment === "center") return "prominent";
  return "clear";
}

/**
 * Derives the coherent design identity from a creative blueprint. Pure and
 * deterministic: the same blueprint always produces the same DNA.
 */
export function designDnaFromBlueprint(blueprint: DnaSource): DesignDNA {
  const { direction, typography, colour, layout, navigation, hero, motion } =
    blueprint;
  const level = motionLevelFor(motion.family);
  return designDnaSchema.parse({
    version: DESIGN_DNA_VERSION,
    identity: {
      name: dnaText(48).parse(`${capitalize(direction.concept)} direction`),
      personality: direction.intensity,
      register: direction.balance,
      premium: direction.premium,
      sophistication: blueprint.business.sophistication,
      keywords: [
        direction.intensity,
        direction.balance,
        level,
        layout.composition,
        typography.treatment,
      ].filter((value, index, list) => list.indexOf(value) === index),
    },
    hero: {
      family: hero.family,
      height: hero.height,
      media: hero.media,
      placement: hero.typographyPlacement,
      cta: hero.cta,
      motion: hero.motion,
    },
    composition: {
      family: layout.composition,
      container: containerFor(layout),
      symmetry: layout.symmetry,
      density: layout.density,
      viewportUse: layout.viewportUse,
      alignment: layout.alignment,
    },
    typography: {
      display: typography.display,
      body: typography.body,
      scale: typography.scale,
      contrast: typography.contrast,
      rhythm: typography.rhythm,
      treatment: typography.treatment,
      cap: typography.scale === "dramatic" ? "balanced" : typography.scale,
    },
    spacing: {
      rhythm: direction.whitespace,
      density: direction.density,
      sectionRhythm: sectionRhythm(blueprint),
    },
    radius: {
      language: direction.shape,
      buttons:
        direction.shape === "organic"
          ? "pill"
          : direction.shape === "rounded"
            ? "rounded"
            : direction.shape === "sharp"
              ? "square"
              : "subtle",
      corners:
        direction.shape === "sharp"
          ? "square"
          : direction.shape === "organic"
            ? "soft"
            : "subtle",
    },
    borders: {
      weight: borderWeight(direction.shape, direction.intensity),
      dividers: dividerStyle(typography.treatment, direction.whitespace),
    },
    palette: {
      id: colour.palette,
      mood: colour.mood,
      environment: colour.environment,
      contrast: colour.contrast,
      accent: colour.accent,
      surfaces: colour.surfaces,
    },
    background: {
      treatment: direction.surface,
      geometry: hero.artDirection,
      depth: direction.layering,
    },
    imagery: {
      direction: hero.artDirection,
      treatment: imageryTreatment(hero),
      density: direction.density === "rich" ? "abundant" : "selective",
    },
    buttons: {
      language:
        direction.shape === "organic"
          ? "pill"
          : direction.shape === "rounded"
            ? "rounded"
            : direction.shape === "sharp"
              ? "square"
              : "subtle",
      presence: buttonsPresence(direction.premium, layout.alignment),
    },
    navigation: {
      family: navigation.family,
      density: navigation.density,
      treatment: navigation.treatment,
      ctaPosition: navigation.ctaPosition,
    },
    motion: {
      level,
      family: motion.family,
      intensity: motion.intensity,
      choreography:
        hero.motion === "parallax"
          ? "depth"
          : hero.motion === "type-in"
            ? "type-led"
            : hero.motion === "drift"
              ? "drift"
              : "reveal",
    },
    mobile: {
      strategy: blueprint.mobile.strategy,
      hero: blueprint.mobile.heroHeight,
      navigation: blueprint.mobile.navigation,
      density: blueprint.mobile.density,
      typographyCap: typography.scale === "dramatic" ? "balanced" : "compact",
      decoration:
        direction.intensity === "dramatic"
          ? "simplified"
          : direction.intensity === "restrained"
            ? "keep"
            : "simplified",
      ctaPriority:
        navigation.ctaPosition === "center" ? "centred" : "first-action",
    },
  });
}

function capitalize(value: string): string {
  return value.length ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

/** Structural shape of a stored spec, so the renderer can read DNA back out. */
export type DnaSpecSource = {
  theme: {
    palette: string;
    mood: string;
    typography: string;
    radius: string;
    surface: string;
    buttonStyle: string;
    spacing: string;
    composition: string;
    headingScale?: string;
  };
  responsive: {
    mobileDensity: string;
    overrides: {
      heroHeight: string;
      navigation: string;
      decoration?: string;
      headingScale: string;
    };
  };
  navigation: { style: string; ctaPosition?: string };
  metadata: { designDna?: unknown };
};

/**
 * Reads the stored DNA, or reconstructs an equivalent identity for specs that
 * predate it (curated library presets, saved sessions, older AI output).
 */
export function readDesignDna(spec: DnaSpecSource): DesignDNA {
  const stored = spec.metadata.designDna;
  if (stored) {
    const parsed = designDnaSchema.safeParse(stored);
    if (parsed.success) return parsed.data;
  }
  return synthesizeDna(spec);
}

function synthesizeDna(spec: DnaSpecSource): DesignDNA {
  const theme = spec.theme;
  const minimalist = theme.mood === "minimal";
  const cinematic = theme.mood === "cinematic" || theme.surface === "void";
  const motion: MotionLevel = cinematic
    ? "cinematic"
    : minimalist || theme.surface === "matte"
      ? "subtle"
      : "premium";
  return designDnaSchema.parse({
    version: DESIGN_DNA_VERSION,
    identity: {
      name: `${capitalize(theme.mood)} direction`,
      personality: cinematic
        ? "dramatic"
        : minimalist
          ? "restrained"
          : "considered",
      register:
        theme.composition === "editorial-single-column"
          ? "editorial"
          : "hybrid",
      premium: theme.mood === "luxury" ? "luxury" : "refined",
      sophistication: "considered",
      keywords: [theme.mood, theme.composition, motion],
    },
    hero: {
      family: theme.composition,
      height: spec.responsive.overrides.heroHeight,
      media: "abstract-gradient",
      placement: "left",
      cta: "inline",
      motion: cinematic ? "drift" : "reveal",
    },
    composition: {
      family: theme.composition,
      container: "standard",
      symmetry: "asymmetric",
      density: "measured",
      viewportUse: "balanced",
      alignment: "left",
    },
    typography: {
      display: theme.typography,
      body: theme.typography,
      scale:
        theme.headingScale === "expressive"
          ? "dramatic"
          : theme.headingScale === "compact"
            ? "restrained"
            : "balanced",
      contrast: "clear",
      rhythm: "even",
      treatment: "editorial",
      cap: "compact",
    },
    spacing: {
      rhythm: theme.spacing === "expansive" ? "spacious" : "even",
      density: "measured",
      sectionRhythm: "even",
    },
    radius: {
      language: theme.radius,
      buttons: theme.buttonStyle,
      corners: theme.radius,
    },
    borders: {
      weight: theme.radius === "sharp" ? "defined" : "hairline",
      dividers: "rule",
    },
    palette: {
      id: theme.palette,
      mood: theme.mood,
      environment: cinematic ? "dark" : "light",
      contrast: "clear",
      accent: "single",
      surfaces: theme.surface === "layered" ? "stacked" : "flat",
    },
    background: {
      treatment: theme.surface,
      geometry: "editorial-rule",
      depth: "depth",
    },
    imagery: {
      direction: "editorial-rule",
      treatment: "abstract",
      density: "selective",
    },
    buttons: { language: theme.buttonStyle, presence: "clear" },
    navigation: {
      family: spec.navigation.style,
      density: "standard",
      treatment: "solid",
      ctaPosition: "right",
    },
    motion: {
      level: motion,
      family: cinematic ? "cinematic" : "editorial",
      intensity: cinematic ? "expressive" : "subtle",
      choreography: "reveal",
    },
    mobile: {
      strategy: "condense",
      hero: spec.responsive.overrides.heroHeight,
      navigation: spec.responsive.overrides.navigation,
      density: spec.responsive.mobileDensity,
      typographyCap: spec.responsive.overrides.headingScale,
      decoration: spec.responsive.overrides.decoration ?? "keep",
      ctaPriority: "first-action",
    },
  });
}

/** Class tokens the renderer puts on the site root so CSS can honour the DNA. */
export function designDnaClasses(dna: DesignDNA): string {
  return [
    `dna-${dna.identity.personality}`,
    `dna-register-${dna.identity.register}`,
    `dna-premium-${dna.identity.premium}`,
    `dna-hero-${dna.hero.family}`,
    `dna-composition-${dna.composition.family}`,
    `dna-symmetry-${dna.composition.symmetry}`,
    `dna-container-${dna.composition.container}`,
    `dna-type-${dna.typography.display}`,
    `dna-type-treatment-${dna.typography.treatment}`,
    `dna-spacing-${dna.spacing.rhythm}`,
    `dna-section-rhythm-${dna.spacing.sectionRhythm}`,
    `dna-radius-${dna.radius.language}`,
    `dna-buttons-${dna.buttons.language}`,
    `dna-borders-${dna.borders.weight}`,
    `dna-dividers-${dna.borders.dividers}`,
    `dna-background-${dna.background.treatment}`,
    `dna-geometry-${dna.background.geometry}`,
    `dna-imagery-${dna.imagery.treatment}`,
    `dna-nav-${dna.navigation.family}`,
    `dna-nav-treatment-${dna.navigation.treatment}`,
    `dna-motion-${dna.motion.level}`,
    `dna-motion-choreography-${dna.motion.choreography}`,
    `dna-mobile-${dna.mobile.strategy}`,
    `dna-mobile-decoration-${dna.mobile.decoration}`,
  ].join(" ");
}

/** Numeric design tokens exposed to CSS as custom properties. */
export function designDnaVariables(dna: DesignDNA): Record<string, string> {
  const motionScale =
    dna.motion.level === "none"
      ? "0"
      : dna.motion.level === "subtle"
        ? "0.6"
        : dna.motion.level === "premium"
          ? "1"
          : "1.35";
  const densityScale =
    dna.spacing.density === "sparse"
      ? "1.22"
      : dna.spacing.density === "rich"
        ? "0.86"
        : "1";
  const rhythmScale =
    dna.spacing.rhythm === "spacious"
      ? "1.18"
      : dna.spacing.rhythm === "tight"
        ? "0.84"
        : "1";
  return {
    "--dna-motion-scale": motionScale,
    "--dna-density-scale": densityScale,
    "--dna-rhythm-scale": rhythmScale,
    "--dna-radius-scale":
      dna.radius.language === "sharp"
        ? "0"
        : dna.radius.language === "rounded"
          ? "1.6"
          : dna.radius.language === "organic"
            ? "2.2"
            : "0.7",
    "--dna-border-alpha":
      dna.borders.weight === "none"
        ? "0"
        : dna.borders.weight === "hairline"
          ? "0.28"
          : dna.borders.weight === "defined"
            ? "0.55"
            : "0.9",
  };
}

/** Customer-language chips describing the identity — never schema vocabulary. */
export function describeDesignDna(dna: DesignDNA): string[] {
  const personality: Record<string, string> = {
    restrained: "Restrained",
    considered: "Considered",
    expressive: "Expressive",
    dramatic: "Dramatic",
  };
  const premium: Record<string, string> = {
    approachable: "Approachable",
    refined: "Refined",
    luxury: "Luxury",
  };
  const density: Record<string, string> = {
    sparse: "Airy",
    measured: "Balanced",
    rich: "Rich",
  };
  const motion: Record<MotionLevel, string> = {
    none: "Still",
    subtle: "Subtle motion",
    premium: "Premium motion",
    cinematic: "Cinematic motion",
  };
  return [
    personality[dna.identity.personality] ??
      capitalize(dna.identity.personality),
    premium[dna.identity.premium] ?? capitalize(dna.identity.premium),
    capitalize(dna.composition.family.replaceAll("-", " ")),
    capitalize(dna.typography.treatment),
    density[dna.spacing.density] ?? "Balanced",
    motion[dna.motion.level],
  ];
}

/** Deep-copies the identity so a version can diverge without aliasing. */
export function cloneDesignDna(dna: DesignDNA): DesignDNA {
  return clone(dna);
}
