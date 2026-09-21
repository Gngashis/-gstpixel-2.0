import { describe, expect, it } from "vitest";
import { generateFallbackDesignSpec } from "./blueprint";
import {
  applyStudioChangePlan,
  planStudioChange,
  type StudioChangeContext,
} from "./change-plan";
import { getHomePage, type DesignSpec, type SectionType } from "./domain";

/**
 * Regression coverage for the commands the owner tried that used to fail
 * silently: list content, product sections, hero replacement, mobile
 * simplification, and asking for a custom logo.
 */

const supplementsPrompt =
  "create me a website that sells health supplements specifically protein nutritions and multivitamins";
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
    expect(
      productSection!.content.items.every(
        (item) => item.meta === "Sample item",
      ),
    ).toBe(true);
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

  it("keeps ordinary commands working alongside the new capabilities", () => {
    const base = generateFallbackDesignSpec(supplementsPrompt);
    const plan = planStudioChange("make the site darker", context(base));
    const applied = applyStudioChangePlan(context(base), plan);
    expect(applied.changed).toBe(true);
    expect(types(applied.spec).length).toBeGreaterThan(0);
  });
});
