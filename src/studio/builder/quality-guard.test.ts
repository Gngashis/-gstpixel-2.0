import { describe, expect, it } from "vitest";
import { generateFallbackDesignSpec } from "./blueprint";
import { guardDesignSpec } from "./quality-guard";

function concept() {
  return generateFallbackDesignSpec(
    "Create a professional construction company website",
  );
}

describe("quality guard", () => {
  it("repairs an empty primary action and restores navigation", () => {
    const spec = concept();
    spec.navigation.items = [];
    spec.navigation.ctaLabel = "";
    const result = guardDesignSpec(spec);
    expect(result.spec.navigation.items.length).toBeGreaterThan(0);
    expect(result.spec.navigation.ctaLabel).not.toBe("");
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["empty-navigation", "missing-cta"]),
    );
  });

  it("keeps missing verified business contact data as an honest warning", () => {
    const spec = concept();
    for (const page of spec.pages) {
      page.sections = page.sections.filter(
        (section) => section.type !== "contact",
      );
    }
    const result = guardDesignSpec(spec);
    expect(
      result.issues.some((issue) => issue.code === "missing-contact-action"),
    ).toBe(true);
  });
});
