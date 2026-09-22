import {
  paletteIds,
  sectionTypes,
  type DesignSpec,
  type PaletteId,
  type SectionType,
} from "./domain";
import type { StudioChangeOperation } from "./change-plan";
import { pageKinds, type SitePageKind } from "./site-pages";

/**
 * Design intent — the semantic layer that turns ordinary design language into
 * explicit structured operations.
 *
 * "make the buttons sharper", "make this section dark", "move this section
 * up", "put a huge lion logo behind the hero" are not templates to pattern-
 * match one by one. They are design intentions. This module reasons about the
 * intention once — shape, scale, colour, structure, media, motion — and emits
 * the same allowlisted operations the visual controls use. Nothing here
 * executes content: operations are still validated and applied through
 * applyStudioChangePlan.
 */

export type IntentScope = "section" | "site" | "mobile";

export type DesignIntent = {
  operations: StudioChangeOperation[];
  /** What actually changed, in plain language. */
  description: string;
  /** Requests recognised but better served by a real asset/upload. */
  notes: string[];
};

const SHAPE_SHARP =
  /\b(sharp|sharper|squared|crisp|angular|less round(ed)?|no round(ed)?|straight corners)\b/;
const SHAPE_ROUND = /\b(rounder|more round(ed)?|softer corners)\b/;
const SHAPE_PILL = /\b(pill|capsule)\b/;

const TYPE_SMALLER =
  /\b(typography|type|font|text|heading|headline)s?\b[^.]{0,24}\b(smaller|small|compact|tighter)\b|\b(smaller|reduce[d]?|tighten(ed)?)\b[^.]{0,24}\b(typography|type|font|text)\b/;
const TYPE_LARGER =
  /\b(typography|type|font|text|heading|headline)s?\b[^.]{0,24}\b(bigger|larger|expressive|grander)\b|\b(bigger|larger)\b[^.]{0,24}\b(typography|type|font|text)\b/;

const MOVE_UP =
  /\b(move|shift|bring|send|take)\b[^.]{0,24}\b(this|that|it)?\s*(section)?\b[^.]{0,24}\bup\b|\bup one\b|\bhigher up\b/;
const MOVE_DOWN =
  /\b(move|shift|bring|send|take)\b[^.]{0,24}\b(this|that|it)?\s*(section)?\b[^.]{0,24}\bdown\b|\bdown one\b|\blower down\b/;

const SECTION_NOUNS: ReadonlyArray<readonly [RegExp, SectionType]> = [
  [/\bfaq\b|\bfrequently asked\b|\bquestions?\b/, "features"],
  [/\btestimonials?\b|\breviews?\b|\bquotes?\b/, "testimonials"],
  [/\bgaller(?:y|ies)\b|\bphotos?\b|\bimages?\b|\blookbook\b/, "gallery"],
  [
    /\bproducts?\b|\bshop\b|\bcollections?\b|\brooms?\b|\bmenu\b|\bpackages?\b/,
    "listings",
  ],
  [
    /\bservices?\b|\btreatments?\b|\bofferings?\b|\bcapabilit(?:y|ies)\b/,
    "services",
  ],
  [/\bstory\b|\babout\b|\bteam\b|\bheritage\b/, "about"],
  [
    /\bcontact\b|\benquir(?:y|ies)\b|\bbook(?:ing)?\b|\bappointment\b|\breservation\b/,
    "contact",
  ],
];

/** Reads a section noun out of an instruction. Ordered, specific first. */
export function sectionTypeFromWords(value: string): SectionType | null {
  for (const [pattern, type] of SECTION_NOUNS) {
    if (pattern.test(value)) return type;
  }
  return null;
}

const darkPalette = (): PaletteId =>
  (paletteIds as readonly string[]).includes("charcoal-amber")
    ? "charcoal-amber"
    : "midnight-champagne";
const lightPalette = (): PaletteId =>
  (paletteIds as readonly string[]).includes("paper-ink")
    ? "paper-ink"
    : "ivory-terracotta";

/**
 * Reads a design intention out of an instruction. Returns null when the
 * instruction is not design language this engine understands — the caller
 * then falls through to the rest of the planner untouched.
 */
export function planDesignIntent(
  instruction: string,
  context: {
    spec: DesignSpec;
    scope: IntentScope;
    sectionId: string | null;
    /** Page the intent should land on; defaults to the home page. */
    activePageSlug?: string;
  },
): DesignIntent | null {
  const value = instruction.toLowerCase().replace(/\s+/g, " ").trim();
  const operations: StudioChangeOperation[] = [];
  const notes: string[] = [];
  const parts: string[] = [];

  /* ---------- words that describe the whole instruction's atmosphere ----- */
  const wantsDark =
    /\b(darker|dark mode|moody|night)\b/.test(value) ||
    (/\b(dark(er)?|moody|night)\b/.test(value) &&
      /\b(make|everything|whole|all|site|background)\b/.test(value));
  const wantsLight =
    /\b(lighter|brighter|airy)\b/.test(value) ||
    (/\blight(er)?\b/.test(value) &&
      /\b(make|everything|whole|all|site|background)\b/.test(value));
  const luxury = /\b(luxur|premium|expensive|high[- ]end|upscale)\b/.test(
    value,
  );
  const minimal = /\b(minimal|cleaner|simpler|less cluttered|quieter)\b/.test(
    value,
  );
  const cinematic = /\b(cinematic|dramatic|theatrical|immersive)\b/.test(value);

  /* ---------- shape language: buttons, corners ---------- */
  if (SHAPE_SHARP.test(value)) {
    operations.push({
      type: "setTheme",
      buttonStyle: "sharp",
      radius: "sharp",
    });
    parts.push("sharper buttons and corners");
  } else if (SHAPE_PILL.test(value)) {
    operations.push({
      type: "setTheme",
      buttonStyle: "pill",
      radius: "rounded",
    });
    parts.push("pill-shaped buttons");
  } else if (SHAPE_ROUND.test(value)) {
    operations.push({
      type: "setTheme",
      buttonStyle: "rounded",
      radius: "rounded",
    });
    parts.push("rounder buttons and corners");
  }

  /* ---------- typography scale ---------- */
  if (TYPE_SMALLER.test(value)) {
    operations.push({
      type: "setTheme",
      headingScale: "compact",
      bodyScale: "small",
    });
    parts.push("smaller typography");
  } else if (TYPE_LARGER.test(value)) {
    operations.push({
      type: "setTheme",
      headingScale: "expressive",
      bodyScale: "large",
    });
    parts.push("larger typography");
  }

  /* ---------- global colour, mood, spacing ---------- */
  const isSelectionScoped =
    context.scope === "section" &&
    context.sectionId !== null &&
    /\b(this|that) (section|one)\b/.test(value);

  if (wantsDark || wantsLight || luxury || minimal || cinematic) {
    if (isSelectionScoped) {
      /* Section-scoped atmosphere: restyle that section, not the brand. */
      const style: Record<string, unknown> = {
        type: "setSectionStyle",
        target: { sectionId: context.sectionId },
      };
      const words: string[] = [];
      if (wantsDark || /\bdark(er)?\b/.test(value)) {
        style["tone"] = "dark";
        style["contrast"] = "high";
        style["surface"] = "immersive";
        words.push("a darker treatment");
      } else if (wantsLight) {
        style["tone"] = "light";
        words.push("a lighter treatment");
      }
      if (luxury) {
        style["surface"] = "elevated";
        style["density"] = "airy";
        style["textScale"] = "expressive";
        style["motion"] = "reveal";
        words.push("a more premium treatment");
      }
      if (minimal) {
        style["density"] = "airy";
        style["media"] = "none";
        words.push("a minimal treatment");
      }
      if (cinematic) {
        style["height"] = "immersive";
        style["media"] = "panoramic";
        style["motion"] = "drift";
        words.push("a cinematic treatment");
      }
      operations.push(style as StudioChangeOperation);
      parts.push(words.join(", "));
    } else {
      /* Site-scoped atmosphere. */
      const theme: Record<string, unknown> = { type: "setTheme" };
      const words: string[] = [];
      if (wantsDark) {
        theme["palette"] = darkPalette();
        theme["surface"] = "layered";
        theme["mood"] = "cinematic";
        words.push("a darker palette");
      } else if (wantsLight) {
        theme["palette"] = lightPalette();
        theme["surface"] = "matte";
        words.push("a lighter palette");
      }
      if (luxury) {
        theme["spacing"] = "expansive";
        theme["mood"] = "luxury";
        theme["buttonStyle"] = theme["buttonStyle"] ?? "subtle";
        words.push("a more luxurious feel");
      }
      if (minimal) {
        theme["spacing"] = "expansive";
        theme["surface"] = "matte";
        theme["motion"] = "quiet";
        words.push("a calmer, minimal feel");
      }
      if (cinematic) {
        theme["motion"] = "cinematic";
        theme["mood"] = "cinematic";
        theme["spacing"] = "expansive";
        words.push("a cinematic mood");
      }
      operations.push(theme as StudioChangeOperation);
      parts.push(words.join(", "));
    }
  }

  /* ---------- structure on the selected section ---------- */
  if (context.scope === "section" && context.sectionId) {
    const id = context.sectionId;
    if (MOVE_UP.test(value) && !MOVE_DOWN.test(value)) {
      operations.push({
        type: "moveSection",
        target: { sectionId: id },
        relation: "up",
      });
      parts.push("moved the section up");
    } else if (MOVE_DOWN.test(value)) {
      operations.push({
        type: "moveSection",
        target: { sectionId: id },
        relation: "down",
      });
      parts.push("moved the section down");
    }
    if (
      /\b(duplicate|copy)\b[^.]{0,20}\b(this|that|it)\b/.test(value) &&
      !sectionTypeFromWords(value)
    ) {
      operations.push({ type: "duplicateSection", target: { sectionId: id } });
      parts.push("duplicated the section");
    }
    if (
      /\b(remove|delete|drop|get rid of)\b\s*(this|that|it)\b/.test(value) &&
      !sectionTypeFromWords(value)
    ) {
      operations.push({ type: "removeSection", target: { sectionId: id } });
      parts.push("removed the section");
    }
    const replaceNoun =
      /\b(replace|swap|turn)\b[^.]{0,24}\b(this|that|it)\b[^.]{0,24}\b(with|into|to)\b/.test(
        value,
      )
        ? sectionTypeFromWords(value)
        : null;
    if (replaceNoun && replaceNoun !== "hero") {
      operations.push({
        type: "replaceSection",
        target: { sectionId: id },
        sectionType: replaceNoun as Exclude<SectionType, "hero">,
      });
      parts.push(`replaced it with a ${replaceNoun} section`);
    }
  }

  /* ---------- add a section by noun ---------- */
  if (
    /\b(add|include|put)\b[^.]{0,24}\b(a|an|the)?\s*(faq|testimonial|review|gallery|products?|services?|contact|story)\b/.test(
      value,
    ) &&
    !/\bpage\b/.test(value)
  ) {
    const noun = sectionTypeFromWords(value);
    if (noun && noun !== "hero") {
      const addable = noun as Exclude<SectionType, "hero">;
      operations.push({
        type: "addSection",
        pageSlug: context.activePageSlug ?? "/",
        sectionType: addable,
      });
      parts.push(`added a ${addable} section`);
    }
  }

  /* ---------- page management by noun ---------- */
  const pageNouns: ReadonlyArray<readonly [RegExp, SitePageKind]> = [
    [/\babout (?:us |page)|page for about|add (?:an? )?about\b/, "about"],
    [/\b(?:gallery|lookbook) page\b/, "gallery"],
    [/\bproducts? page|\bshop page|\bstore page\b/, "shop"],
    [/\b(?:faq|frequently asked) (?:page|questions)\b/, "faq"],
    [/\b(?:book|booking|appointment) page\b/, "booking"],
    [/\bcontact page\b/, "contact"],
  ];
  if (/\b(add|create|make|need)\b/.test(value)) {
    for (const [pattern, kind] of pageNouns) {
      if (pattern.test(value) && pageKinds.includes(kind)) {
        operations.push({ type: "addPage", pageType: kind });
        parts.push(`added a ${kind} page`);
        break;
      }
    }
  }

  /* ---------- media intent: named emblem or hero image ---------- */
  const emblemSubject = value.match(
    /\b(lion|eagle|tiger|elephant|bird|dragon|horse|lotus|monogram|crest|badge|emblem)\b/,
  )?.[1];
  if (
    emblemSubject &&
    /\b(behind|in|on|into|above)\b[^.]{0,24}\b(hero|header|banner)\b/.test(
      value,
    )
  ) {
    operations.push({
      type: "addMediaArea",
      pageSlug: "/",
      mediaKind: "emblem",
      subject: emblemSubject,
      afterSectionType: "hero",
    });
    parts.push(`added a ${emblemSubject} emblem treatment behind the hero`);
    notes.push(
      "The emblem is a decorative placeholder treatment — send the real logo or artwork to GSTPIXEL for the production build.",
    );
  } else if (/\b(hero|banner) (image|photo|picture|visual)\b/.test(value)) {
    operations.push({
      type: "addMediaArea",
      pageSlug: "/",
      mediaKind: "image",
      subject: "hero",
    });
    parts.push("added a hero media treatment");
  }

  /* ---------- mobile interpretation ---------- */
  if (
    context.scope === "mobile" ||
    (/\bmobile|phone\b/.test(value) &&
      /\b(cleaner|simpler|simplif|compact|less busy)\b/.test(value))
  ) {
    operations.push({
      type: "setMobile",
      simplified: true,
      heroHeight: "compact",
      headingScale: "compact",
      decoration: "simplified",
    });
    parts.push("a simpler mobile interpretation");
  }

  if (operations.length === 0) return null;
  return { operations, description: humanList(parts), notes };
}

/** "a, b and c" — the way people actually list things. */
export function humanList(parts: readonly string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/**
 * Business-relevant section options for the add-section control, so an
 * ecommerce concept offers products and a clinic offers services first.
 */
export function relevantSectionChoices(spec: DesignSpec): ReadonlyArray<{
  type: Exclude<SectionType, "hero">;
  label: string;
}> {
  const kind = spec.site.businessKind;
  const commerce =
    kind === "retail" ||
    kind === "fashion" ||
    /shop|store|supplement|clothing/i.test(spec.site.descriptor);
  const hospitality = kind === "hotel" || kind === "travel";
  const service =
    kind === "healthcare" ||
    kind === "professional" ||
    kind === "technology" ||
    kind === "wellness";
  const choices: Array<{
    type: Exclude<SectionType, "hero">;
    label: string;
  }> = [
    {
      type: "listings",
      label: commerce
        ? "Products"
        : hospitality
          ? "Rooms or packages"
          : "Featured collection",
    },
    { type: "services", label: service ? "Services" : "Offerings" },
    { type: "gallery", label: "Gallery" },
    { type: "features", label: "Highlights or FAQ" },
    { type: "testimonials", label: "Testimonials" },
    { type: "about", label: "Story" },
    { type: "contact", label: "Contact or booking" },
    { type: "cta", label: "Call to action" },
  ];
  return choices;
}
