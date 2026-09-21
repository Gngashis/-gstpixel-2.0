import { describe, expect, it } from "vitest";
import {
  directionDesignSpec,
  planAdditionalDirection,
  planCreativeDirections,
} from "./directions";
import { designSpecSchema } from "./domain";

const prompts = [
  "Create a luxury jewellery business in Bhutan selling handmade gold and silver pieces.",
  "Create a local clothing store in Jaigaon selling everyday menswear and womenswear.",
  "Create an online protein supplement and multivitamin shop with product information.",
] as const;

describe("Three creative directions", () => {
  it("offers exactly three named directions per business", () => {
    for (const prompt of prompts) {
      const directions = planCreativeDirections(prompt);
      expect(directions).toHaveLength(3);
      expect(new Set(directions.map((entry) => entry.name)).size).toBe(3);
      for (const direction of directions) {
        expect(direction.name.length).toBeGreaterThan(3);
        expect(direction.summary.length).toBeGreaterThan(20);
        expect(direction.character.length).toBeGreaterThanOrEqual(4);
        // Customer language only — no schema identifiers leak into the UI.
        for (const chip of direction.character) {
          expect(chip).not.toMatch(/[a-z]+-[a-z]+-/);
        }
      }
    }
  });

  it("uses business-specific names rather than one universal set", () => {
    const jewellery = planCreativeDirections(prompts[0]).map((d) => d.name);
    const supplements = planCreativeDirections(prompts[2]).map((d) => d.name);
    expect(jewellery).not.toEqual(supplements);
    expect(supplements.join(" ")).toMatch(
      /supplement|clinical|clarity|commerce/i,
    );
  });

  it("differs on real design axes, not just colour", () => {
    for (const prompt of prompts) {
      const [first, second, third] = planCreativeDirections(prompt) as [
        ReturnType<typeof planCreativeDirections>[number],
        ReturnType<typeof planCreativeDirections>[number],
        ReturnType<typeof planCreativeDirections>[number],
      ];
      const axes: Array<(entry: typeof first) => string> = [
        (entry) => entry.blueprint.hero.family,
        (entry) => entry.blueprint.layout.composition,
        (entry) => entry.blueprint.typography.display,
        (entry) => entry.blueprint.direction.density,
        (entry) => entry.blueprint.direction.whitespace,
        (entry) => entry.blueprint.motion.family,
        (entry) => entry.blueprint.hero.artDirection,
        (entry) => entry.blueprint.navigation.family,
        (entry) => entry.dna.motion.level,
      ];
      for (const [left, right] of [
        [first, second],
        [first, third],
        [second, third],
      ] as const) {
        const different = axes.filter(
          (read) => read(left) !== read(right),
        ).length;
        expect(different).toBeGreaterThanOrEqual(5);
      }
    }
  });

  it("renders each direction as a valid, multi-page website", () => {
    for (const prompt of prompts) {
      for (const direction of planCreativeDirections(prompt)) {
        const spec = directionDesignSpec(direction);
        expect(designSpecSchema.safeParse(spec).success).toBe(true);
        expect(spec.pages.length).toBeGreaterThanOrEqual(3);
        expect(spec.pages[0]!.sections[0]!.type).toBe("hero");
      }
    }
  });

  it("is deterministic", () => {
    for (const prompt of prompts) {
      expect(JSON.stringify(planCreativeDirections(prompt))).toBe(
        JSON.stringify(planCreativeDirections(prompt)),
      );
    }
  });

  it("can offer another direction on request", () => {
    const extra = planAdditionalDirection(prompts[0], 0);
    const base = planCreativeDirections(prompts[0]);
    expect(base.map((entry) => entry.id)).not.toContain(extra.id);
    expect(extra.summary.length).toBeGreaterThan(20);
    expect(designSpecSchema.safeParse(directionDesignSpec(extra)).success).toBe(
      true,
    );
  });
});
