import { describe, expect, it } from "vitest";
import {
  createAlternateDesignSpec,
  generateFallbackDesignSpec,
  modifyDesignSpec,
  parseDesignSpec,
} from "./domain";

const resortPrompt =
  "Create a premium luxury resort website for a property near Jaigaon with 15 rooms, mountain views, a restaurant and booking enquiries. Use deep forest green, warm ivory and refined gold accents. Make it elegant, cinematic and modern.";

describe("Website Studio V2 DesignSpec", () => {
  it("generates a complete flagship resort deterministically", () => {
    const spec = generateFallbackDesignSpec(resortPrompt);
    expect(spec.site.businessKind).toBe("hotel");
    expect(spec.theme.palette).toBe("forest-gold");
    expect(spec.pages[0]?.sections[0]?.variant).toBe("hospitality-focused");
    expect(spec.pages[0]?.sections.map((section) => section.id)).toEqual(
      expect.arrayContaining(["rooms", "gallery", "restaurant", "contact"]),
    );
  });

  it("makes the café structurally different rather than recolouring the resort", () => {
    const cafe = generateFallbackDesignSpec(
      "Create a bright modern premium café website with warm cream backgrounds, terracotta accents, editorial photography, friendly typography and a simple menu.",
    );
    const hotel = generateFallbackDesignSpec(resortPrompt);
    expect(cafe.theme.palette).toBe("ivory-terracotta");
    expect(cafe.pages[0]?.sections[0]?.variant).toBe("split-composition");
    expect(cafe.pages[0]?.sections.map((section) => section.type)).not.toEqual(
      hotel.pages[0]?.sections.map((section) => section.type),
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

  it("modifies palette, structure, mood, copy and supports undo-ready immutable specs", () => {
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
    expect(original.theme.palette).toBe("forest-gold");
    expect(dark.theme.palette).toBe("midnight-champagne");
    expect(
      withoutGallery.pages[0]?.sections.some(
        (section) => section.type === "gallery",
      ),
    ).toBe(false);
    expect(withPage.pages.some((page) => page.slug === "/about")).toBe(true);
    expect(renamed.pages[0]?.sections[0]?.content.title).toBe(
      "A private horizon of your own.",
    );
  });

  it("creates a substantial alternate version", () => {
    const original = generateFallbackDesignSpec(resortPrompt);
    const alternate = createAlternateDesignSpec(original);
    expect(alternate.theme.palette).not.toBe(original.theme.palette);
    expect(alternate.theme.typography).not.toBe(original.theme.typography);
    expect(alternate.pages[0]?.sections[0]?.variant).not.toBe(
      original.pages[0]?.sections[0]?.variant,
    );
  });

  it("art-directs substantially different structures for seven business types", () => {
    const prompts = [
      "Create a premium luxury resort near Jaigaon with rooms, mountain views and a restaurant.",
      "Create a bright editorial café with warm cream, terracotta and a simple menu.",
      "Create a bold high-energy fitness studio with programs, coaches and memberships.",
      "Create a minimal futuristic Apple-style technology company website for a software platform.",
      "Create a cinematic travel agency website with destinations and signature journeys.",
      "Create a sophisticated professional services website with expertise and contact.",
      "Create a premium online shop for considered home objects and product collections.",
    ];
    const specs = prompts.map(generateFallbackDesignSpec);
    const signatures = specs.map((spec) => ({
      kind: spec.site.businessKind,
      hero: spec.pages[0]?.sections[0]?.variant,
      sections: spec.pages[0]?.sections.map(
        (section) => `${section.type}:${section.variant}`,
      ),
      mood: spec.theme.mood,
    }));

    expect(
      new Set(signatures.map((signature) => signature.hero)).size,
    ).toBeGreaterThanOrEqual(6);
    expect(
      new Set(signatures.map((signature) => signature.sections?.join("|")))
        .size,
    ).toBe(7);
    expect(specs[3]?.site.name).toBe("SIGNAL SYSTEMS");
    expect(specs[3]?.theme.mood).toBe("technical");
    expect(specs[4]?.pages[0]?.sections[1]?.type).toBe("services");
    expect(specs[6]?.pages[0]?.sections[1]?.type).toBe("listings");
  });
});
