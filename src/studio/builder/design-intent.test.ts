import { describe, expect, it } from "vitest";
import { generateFallbackDesignSpec } from "./blueprint";
import { planDesignIntent, relevantSectionChoices } from "./design-intent";

const spec = generateFallbackDesignSpec(
  "Create a local clothing store in Jaigaon",
);

function intent(instruction: string, sectionId: string | null = null) {
  return planDesignIntent(instruction, {
    spec,
    scope: sectionId ? "section" : "site",
    sectionId,
    activePageSlug: "/",
  });
}

describe("design intent", () => {
  it("turns shape language into an allowlisted theme operation", () => {
    const result = intent("make the buttons sharper");
    expect(result?.operations).toEqual([
      { type: "setTheme", buttonStyle: "sharp", radius: "sharp" },
    ]);
  });

  it("keeps selected section changes local", () => {
    const result = intent("make this section dark", "listings");
    expect(result?.operations[0]).toMatchObject({
      type: "setSectionStyle",
      target: { sectionId: "listings" },
      tone: "dark",
    });
  });

  it("interprets creative media requests without inventing an asset", () => {
    const result = intent("put a huge lion logo behind the hero");
    expect(result?.operations[0]).toMatchObject({
      type: "addMediaArea",
      mediaKind: "emblem",
      subject: "lion",
    });
    expect(result?.notes.join(" ")).toMatch(/placeholder|real logo/i);
  });

  it("offers business-relevant section choices", () => {
    const labels = relevantSectionChoices(spec).map((choice) => choice.label);
    expect(labels).toContain("Products");
    expect(labels).toContain("Contact or booking");
  });
});
