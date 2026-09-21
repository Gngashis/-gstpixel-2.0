import { describe, expect, it } from "vitest";
import { generateFallbackDesignSpec } from "./blueprint";
import {
  applyStudioChangePlan,
  planStudioChange,
  type StudioChangeContext,
} from "./change-plan";
import { readDesignDna } from "./design-dna";
import {
  getHomePage,
  parseDesignSpec,
  type DesignSpec,
  type SectionType,
} from "./domain";

/**
 * Regression coverage for the commands the owner tried that used to fail
 * silently: list content, product sections, hero replacement, mobile
 * simplification, and asking for a custom logo.
 */

const supplementsPrompt =
  "create me a website that sells health supplements specifically protein nutritions and multivitamins";
const jewelleryPrompt = "Create a luxury jewellery business in Bhutan";
const specMotion = /^quiet$/;
const clothingPrompt =
  "I run a local clothing shop in Jaigaon selling everyday wear and school uniforms";

function context(spec: DesignSpec): StudioChangeContext {
  return {
    spec,
    activePageSlug: "/",
    selectedSectionId: null,
    viewport: "desktop",
    recentTurns: [],
    previousThemes: [],
  };
}

function run(prompt: string, instruction: string) {
  const base = generateFallbackDesignSpec(prompt);
  const plan = planStudioChange(instruction, context(base));
  const applied = applyStudioChangePlan(context(base), plan);
  const sections = getHomePage(applied.spec).sections;
  return { plan, applied, sections };
}

const types = (spec: DesignSpec): SectionType[] =>
  getHomePage(spec).sections.map((section) => section.type);

describe("Studio conversational capabilities", () => {
  it("turns a spoken list into real list content", () => {
    const { plan, applied, sections } = run(
      supplementsPrompt,
      "create a list of multivitamin items and protein supplements",
    );
    expect(plan.operations.map((operation) => operation.type)).toEqual([
      "addListItems",
    ]);
    const named = sections.find(
      (section) =>
        section.content.items.some((item) =>
          /multivitamin/i.test(item.title),
        ) && section.content.items.some((item) => /protein/i.test(item.title)),
    );
    expect(named).toBeDefined();
    expect(applied.changed).toBe(true);
    expect(plan.unsupported).toEqual([]);
  });

  it("adds a named product section with clearly-labelled samples", () => {
    const { plan, applied, sections } = run(
      supplementsPrompt,
      "add a product section for whey protein",
    );
    expect(plan.operations[0]!.type).toBe("addProducts");
    const productSection = sections.find(
      (section) =>
        section.type === "listings" &&
        /whey protein/i.test(section.content.title),
    );
    expect(productSection).toBeDefined();
    // Every entry is still unmistakably a sample...
    expect(
      productSection!.content.items.every((item) =>
        /sample/i.test(`${item.title} ${item.body}`),
      ),
    ).toBe(true);
    // ...and the shelf now carries group names, which is what lets the concept
    // preview a working category filter instead of one flat list.
    expect(
      new Set(productSection!.content.items.map((item) => item.meta)).size,
    ).toBeGreaterThan(1);
    expect(applied.changed).toBe(true);
  });

  it("adds category navigation when asked", () => {
    const { plan, applied } = run(supplementsPrompt, "add categories");
    expect(plan.operations[0]).toMatchObject({
      type: "addProducts",
      kind: "categories",
    });
    expect(applied.changed).toBe(true);
  });

  it("adds a FAQ section as an actual FAQ", () => {
    const { sections } = run(
      clothingPrompt,
      "add a FAQ section about sizing and exchanges",
    );
    expect(sections.some((section) => section.variant === "faq-list")).toBe(
      true,
    );
  });

  it("replaces the hero instead of recolouring it", () => {
    const base = generateFallbackDesignSpec(clothingPrompt);
    const beforeHero = getHomePage(base).sections[0]!.variant;
    for (const instruction of [
      "replace this hero completely",
      "use a completely different hero",
    ]) {
      const plan = planStudioChange(instruction, context(base));
      const applied = applyStudioChangePlan(context(base), plan);
      expect(getHomePage(applied.spec).sections[0]!.variant).not.toBe(
        beforeHero,
      );
    }
  });

  it("replaces one section type with another and keeps its content", () => {
    const base = generateFallbackDesignSpec(
      "dental clinic in Jaigaon offering family care",
    );
    const services = getHomePage(base).sections.find(
      (section) => section.type === "services",
    );
    const plan = planStudioChange(
      "replace the services section with a gallery",
      context(base),
    );
    expect(plan.operations[0]).toMatchObject({
      type: "replaceSection",
      sectionType: "gallery",
    });
    const applied = applyStudioChangePlan(context(base), plan);
    const gallery = getHomePage(applied.spec).sections.find(
      (section) => section.type === "gallery" && section.id === services?.id,
    );
    expect(gallery).toBeDefined();
    expect(gallery!.content.title).toBe(services!.content.title);
  });

  it("simplifies mobile including decorative layers", () => {
    const base = generateFallbackDesignSpec(clothingPrompt);
    const plan = planStudioChange(
      "make this much simpler on mobile and hide decorative effects",
      context(base),
    );
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.spec.responsive.overrides.simplified).toBe(true);
    expect(applied.spec.responsive.overrides.decoration).toBe("hidden");
  });

  it("answers a custom logo request with a supported outcome", () => {
    const { plan, applied, sections } = run(
      clothingPrompt,
      "create a huge original lion logo",
    );
    expect(plan.operations[0]).toMatchObject({
      type: "addMediaArea",
      mediaKind: "emblem",
      subject: "lion",
    });
    // Not the generic failure message — a clear statement about what is needed.
    expect(plan.unsupported.join(" ")).toMatch(/image source or upload/i);
    const emblem = sections.find((section) =>
      /lion emblem/i.test(section.content.title),
    );
    expect(emblem).toBeDefined();
    expect(applied.changed).toBe(true);
  });

  it("adds an art-directed media area for image requests", () => {
    const { plan, sections } = run(clothingPrompt, "add an image area");
    expect(plan.operations[0]).toMatchObject({
      type: "addMediaArea",
      mediaKind: "image",
    });
    expect(sections.some((section) => section.type === "gallery")).toBe(true);
  });

  it("understands a cinematic direction and a section-only scope", () => {
    const base = generateFallbackDesignSpec(clothingPrompt);
    const plan = planStudioChange(
      "make the homepage more cinematic",
      context(base),
    );
    expect(plan.operations.map((operation) => operation.type)).toContain(
      "setCreativeDirection",
    );
    const applied = applyStudioChangePlan(context(base), plan);
    expect(getHomePage(applied.spec).sections[0]!.variant).toContain(
      "cinematic",
    );
  });

  it("maps a named hero layout to that exact layout", () => {
    const cases: ReadonlyArray<readonly [string, string]> = [
      ["turn the hero into a split layout", "split-composition"],
      ["make the hero full-bleed", "immersive-viewport"],
      ["give the hero a typographic treatment", "editorial-typography"],
    ];
    for (const [instruction, expected] of cases) {
      const base = generateFallbackDesignSpec(supplementsPrompt);
      const plan = planStudioChange(instruction, context(base));
      const applied = applyStudioChangePlan(context(base), plan);
      expect(getHomePage(applied.spec).sections[0]!.variant).toBe(expected);
    }
  });

  it("sets one motion level for the whole website", () => {
    const base = generateFallbackDesignSpec(jewelleryPrompt);
    const plan = planStudioChange("reduce the motion", context(base));
    expect(plan.operations.map((operation) => operation.type)).toEqual([
      "setMotion",
    ]);
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.changed).toBe(true);
    expect(readDesignDna(applied.spec).motion.level).toBe("none");
    expect(specMotion.test(applied.spec.theme.motion)).toBe(true);
    // The request reaches the sections too, not just the declared level.
    for (const page of applied.spec.pages) {
      for (const section of page.sections) {
        expect(section.motion).toBe("quiet");
      }
    }
  });

  it("moves any named section against any other, not a fixed list", () => {
    const base = generateFallbackDesignSpec(supplementsPrompt);
    const plan = planStudioChange(
      "move testimonials below products",
      context(base),
    );
    const move = plan.operations.find(
      (operation) => operation.type === "moveSection",
    );
    expect(move).toBeDefined();
    const applied = applyStudioChangePlan(context(base), plan);
    const page = applied.spec.pages.find(
      (entry) => entry.slug === move!.target.pageSlug,
    )!;
    const order = page.sections.map((section) => section.type);
    expect(order.indexOf("testimonials")).toBeGreaterThan(
      order.indexOf("listings"),
    );
  });

  it("moves a section on the page that actually holds both sections", () => {
    const base = generateFallbackDesignSpec(supplementsPrompt);
    const plan = planStudioChange(
      "move testimonials below products",
      context(base),
    );
    const move = plan.operations.find(
      (operation) => operation.type === "moveSection",
    );
    expect(move!.target.pageSlug).not.toBe("/");
  });

  it("changes only the typography when the visitor says so", () => {
    const base = generateFallbackDesignSpec(supplementsPrompt);
    const before = readDesignDna(base);
    const plan = planStudioChange(
      "keep this design but make the typography more elegant",
      context(base),
    );
    expect(plan.unsupported).toEqual([]);
    expect(plan.operations.map((operation) => operation.type)).toEqual([
      "setCreativeDirection",
    ]);
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.changed).toBe(true);
    const after = readDesignDna(applied.spec);
    expect(after.typography.display).not.toBe(before.typography.display);
    // Everything the visitor liked stays put.
    expect(after.palette.id).toBe(before.palette.id);
    expect(after.motion.level).toBe(before.motion.level);
    expect(after.composition.family).toBe(before.composition.family);
  });

  it("replaces a named section with a different kind of section", () => {
    const base = generateFallbackDesignSpec(jewelleryPrompt);
    const copy = getHomePage(base).sections.find(
      (section) => section.type === "about",
    )!.content.title;
    const plan = planStudioChange(
      "replace the about section with testimonials",
      context(base),
    );
    expect(plan.unsupported).toEqual([]);
    const applied = applyStudioChangePlan(context(base), plan);
    const order = types(applied.spec);
    expect(order).toContain("testimonials");
    expect(order).not.toContain("about");
    expect(copy.length).toBeGreaterThan(0);
  });

  it("re-reads a same-family word as a different treatment", () => {
    const base = generateFallbackDesignSpec(jewelleryPrompt);
    const before = getHomePage(base).sections.find(
      (section) => section.type === "gallery",
    )!;
    const plan = planStudioChange(
      "replace the gallery with projects",
      context(base),
    );
    expect(plan.unsupported).toEqual([]);
    const applied = applyStudioChangePlan(context(base), plan);
    const after = getHomePage(applied.spec).sections.find(
      (section) => section.type === "gallery",
    )!;
    expect(after.variant).not.toBe(before.variant);
    expect(after.variant).toBe("editorial-grid");
  });

  it("redesigns everything while keeping the visitor's content", () => {
    const base = structuredClone(generateFallbackDesignSpec(jewelleryPrompt));
    getHomePage(base).sections[0]!.content.title = "Kept, word for word.";
    const edited = parseDesignSpec(base);
    const before = readDesignDna(edited);
    const plan = planStudioChange(
      "keep the content but completely redesign it",
      context(edited),
    );
    expect(plan.unsupported).toEqual([]);
    const applied = applyStudioChangePlan(context(edited), plan);
    expect(applied.changed).toBe(true);
    const after = readDesignDna(applied.spec);
    // The visitor's own words survive...
    expect(
      applied.spec.pages.some((page) =>
        page.sections.some(
          (section) => section.content.title === "Kept, word for word.",
        ),
      ),
    ).toBe(true);
    // ...while the design genuinely moves on every major axis.
    expect(after.hero.family).not.toBe(before.hero.family);
    expect(after.composition.family).not.toBe(before.composition.family);
    expect(after.typography.display).not.toBe(before.typography.display);
    expect(after.palette.id).not.toBe(before.palette.id);
  });

  it("does not invent a page when the visitor names one they have", () => {
    const base = generateFallbackDesignSpec(jewelleryPrompt);
    const plan = planStudioChange(
      "make the shop page more visual",
      context(base),
    );
    expect(plan.operations.map((operation) => operation.type)).not.toContain(
      "addPage",
    );
  });

  it("keeps ordinary commands working alongside the new capabilities", () => {
    const base = generateFallbackDesignSpec(supplementsPrompt);
    const plan = planStudioChange("make the site darker", context(base));
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.changed).toBe(true);
    expect(types(applied.spec).length).toBeGreaterThan(0);
  });

  it("reports a design-only restyle as a real change", () => {
    /*
     * "make the whole website feel more luxurious" moves the design blueprint
     * and its DesignDNA but can leave the legacy theme untouched. The visitor
     * must still see it accepted as a change.
     */
    const base = parseDesignSpec(generateFallbackDesignSpec(clothingPrompt));
    const before = readDesignDna(base);
    const plan = planStudioChange(
      "make the whole website feel more luxurious",
      context(base),
    );
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.changed).toBe(true);
    const after = readDesignDna(applied.spec);
    expect(after.typography.display).toBe("editorial-serif");
    expect(after.typography.display).not.toBe(before.typography.display);
    expect(after.mobile.strategy).toBeTruthy();
  });

  it("scopes a mobile-only request to mobile", () => {
    const base = parseDesignSpec(generateFallbackDesignSpec(jewelleryPrompt));
    const before = readDesignDna(base);
    const plan = planStudioChange(
      "make the mobile version simpler",
      context(base),
    );
    expect(plan.operations.map((operation) => operation.type)).toEqual([
      "setMobile",
    ]);
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.changed).toBe(true);
    expect(applied.spec.responsive.overrides.simplified).toBe(true);
    // The desktop design identity is left exactly as the visitor had it.
    const after = readDesignDna(applied.spec);
    expect(after.typography.display).toBe(before.typography.display);
    expect(after.motion.level).toBe(before.motion.level);
    expect(after.palette.id).toBe(before.palette.id);
  });

  it("treats a device noun as content, not a mobile restyle", () => {
    const base = generateFallbackDesignSpec(jewelleryPrompt);
    const plan = planStudioChange(
      "add my phone number to the contact page",
      context(base),
    );
    expect(plan.operations.map((operation) => operation.type)).not.toContain(
      "setMobile",
    );
  });

  it("explains a section command that has nothing to act on", () => {
    const base = generateFallbackDesignSpec(jewelleryPrompt);
    for (const instruction of [
      "remove testimonials",
      "move testimonials below products",
    ]) {
      const applied = applyStudioChangePlan(
        context(base),
        planStudioChange(instruction, context(base)),
      );
      expect(applied.changed).toBe(false);
      expect(applied.notes.join(" ")).toMatch(/testimonials/);
    }
  });
});
