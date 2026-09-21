import { describe, expect, it } from "vitest";
import {
  createAlternateDesignSpec,
  generateFallbackDesignSpec,
} from "./blueprint";
import { modifyDesignSpec, parseDesignSpec } from "./domain";

const resortPrompt =
  "Create a premium luxury resort website for a property near Jaigaon with rooms, mountain views, a restaurant and booking enquiries.";

describe("Website Studio V2 DesignSpec", () => {
  it("generates a complete, schema-valid flagship resort deterministically", () => {
    const spec = generateFallbackDesignSpec(resortPrompt);
    const again = generateFallbackDesignSpec(resortPrompt);
    expect(spec.site.businessKind).toBe("hotel");
    expect(spec.site.name.length).toBeGreaterThan(2);
    expect(JSON.stringify(spec)).toBe(JSON.stringify(again));
    expect(spec.pages[0]?.sections[0]?.type).toBe("hero");
    expect(spec.pages[0]?.sections.map((section) => section.type)).toEqual(
      expect.arrayContaining(["listings", "gallery", "contact", "about"]),
    );
  });

  it("rejects executable text and unknown renderer variants", () => {
    const spec = generateFallbackDesignSpec(resortPrompt);
    expect(() =>
      parseDesignSpec({
        ...spec,
        pages: [
          {
            ...spec.pages[0],
            sections: spec.pages[0]!.sections.map((section, index) =>
              index === 0
                ? {
                    ...section,
                    content: {
                      ...section.content,
                      title: "<script>alert(1)</script>",
                    },
                  }
                : section,
            ),
          },
        ],
      }),
    ).toThrow();
    expect(() =>
      parseDesignSpec({
        ...spec,
        pages: [
          {
            ...spec.pages[0],
            sections: spec.pages[0]!.sections.map((section, index) =>
              index === 1
                ? { ...section, variant: "visitor-component" }
                : section,
            ),
          },
        ],
      }),
    ).toThrow();
  });

  it("modifies palette, structure, copy and keeps undo-ready immutable specs", () => {
    const original = generateFallbackDesignSpec(resortPrompt);
    const dark = modifyDesignSpec(
      original,
      "Change the colors to black and champagne gold.",
    );
    const withoutGallery = modifyDesignSpec(
      dark,
      "Remove the gallery section.",
    );
    const withPage = modifyDesignSpec(withoutGallery, "Add an About page.");
    const renamed = modifyDesignSpec(
      withPage,
      'Change the headline to "A private horizon of your own."',
    );
    expect(dark.theme.palette).toBe("midnight-champagne");
    expect(
      withoutGallery.pages[0]?.sections.some(
        (section) => section.type === "gallery",
      ),
    ).toBe(false);
    expect(original.pages[0]?.sections.length).not.toBe(
      withoutGallery.pages[0]?.sections.length,
    );
    expect(withPage.pages.some((page) => page.slug === "/about")).toBe(true);
    expect(renamed.pages[0]?.sections[0]?.content.title).toBe(
      "A private horizon of your own.",
    );
  });

  it("cannot mutate the spec it derives from", () => {
    const original = generateFallbackDesignSpec(resortPrompt);
    const snapshot = JSON.stringify(original);
    modifyDesignSpec(original, "Make it darker and remove the gallery.");
    expect(JSON.stringify(original)).toBe(snapshot);
  });

  it("creates a substantially different alternate version", () => {
    const original = generateFallbackDesignSpec(resortPrompt);
    const alternate = createAlternateDesignSpec(original);
    const originalHero = original.pages[0]?.sections[0]?.variant;
    const alternateHero = alternate.pages[0]?.sections[0]?.variant;
    expect(alternateHero).not.toBe(originalHero);
    expect(alternate.theme.palette).not.toBe(original.theme.palette);
    expect(alternate.metadata.fingerprint).not.toBe(
      original.metadata.fingerprint,
    );
    expect(alternate.metadata.variation).toBe(1);
    expect(parseDesignSpec(alternate)).toBeTruthy();
  });
});
