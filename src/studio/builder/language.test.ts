import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  canonicalBusinessText,
  detectBusinessIdeas,
  extractLocationPhrase,
  STUDIO_PROMPT_MAX,
  STUDIO_PROMPT_MIN,
} from "./language";
import { generateFallbackDesignSpec, planCreativeBlueprint } from "./blueprint";
import { getHomePage } from "./domain";

/**
 * Regression coverage for the failures found in owner testing: typos,
 * colloquial phrasing, product businesses, long descriptions and one
 * description that names two unrelated businesses.
 */

function sectionsFor(prompt: string) {
  const blueprint = planCreativeBlueprint(prompt);
  const spec = generateFallbackDesignSpec(prompt);
  return {
    blueprint,
    types: getHomePage(spec).sections.map((section) => section.type),
    hero: getHomePage(spec).sections[0]!.variant,
  };
}

describe("prompt language layer", () => {
  it("repairs common typos without changing the visitor's meaning", () => {
    expect(canonicalBusinessText("clother")).toContain("clothes");
    expect(canonicalBusinessText("protien and vitimins")).toContain("protein");
    expect(canonicalBusinessText("resturant")).toContain("restaurant");
    expect(canonicalBusinessText("jewellry shop")).toContain("jewellery");
    expect(canonicalBusinessText("accountent")).toContain("accountant");
  });

  it("understands the owner's local clothing example", () => {
    const prompt = "create me a site that sells clother locally for jaigaon";
    const { blueprint, types } = sectionsFor(prompt);
    expect(blueprint.business.category).toBe("retail");
    expect(blueprint.business.location).toBe("Jaigaon");
    // A local shop needs shelves and a way to visit it.
    expect(types).toContain("listings");
    expect(types.filter((type) => type === "listings").length).toBeGreaterThan(
      1,
    );
    expect(types).toContain("contact");
  });

  it("understands the owner's supplement ecommerce example", () => {
    const prompt =
      "create me a website that sells health supplements specifically protein nutritions and multivitamins";
    const { blueprint, types } = sectionsFor(prompt);
    expect(blueprint.business.category).toBe("supplements");
    // Categories, protein, multivitamins, featured, information, trust, CTA.
    expect(types.filter((type) => type === "listings").length).toBe(4);
    expect(types.filter((type) => type === "features").length).toBe(2);
    expect(types).toContain("cta");
    expect(types).toContain("contact");
  });

  it("gives dental, construction and jewellery prompts their own structure", () => {
    const dental = sectionsFor("dental clinic in Jaigaon for families");
    expect(dental.blueprint.business.category).toBe("healthcare");
    expect(dental.types).toEqual([
      "hero",
      "services",
      "features",
      "about",
      "features",
      "cta",
      "contact",
    ]);

    const construction = sectionsFor(
      "construction company building homes and interiors",
    );
    expect(construction.blueprint.business.category).toBe("construction");
    expect(construction.types).toContain("listings");
    expect(construction.types).toContain("services");

    const jewellery = sectionsFor("luxury jewellery business in Kolkata");
    expect(jewellery.blueprint.business.category).toBe("jewellery");
    expect(jewellery.hero).toBe("centered-luxury");
    expect(jewellery.types).toContain("gallery");
  });

  it("keeps the leading business when a description mixes two related ones", () => {
    const { blueprint } = sectionsFor("I run a gym and also a supplement shop");
    expect(blueprint.business.category).toBe("fitness");
  });

  it("does not invent a place out of ordinary sentence words", () => {
    expect(extractLocationPhrase("website for my gym").place).toBe("");
    expect(extractLocationPhrase("restaurant in a small town").place).toBe("");
    expect(extractLocationPhrase("premium resort in the mountains").place).toBe(
      "",
    );
    expect(extractLocationPhrase("cafe in north bengal").place).toBe(
      "North Bengal",
    );
  });

  it("handles long, multi-sentence descriptions", () => {
    const long = [
      "I run a family clothing shop in Jaigaon that has been serving the town for years.",
      "We stock everyday wear, school uniforms, woollen clothes for winter and a small tailoring service.",
      "I would like a website that shows our collections, shop timings, and lets people ask about sizes on WhatsApp.",
      "Please keep it simple enough that my staff can update the products themselves later.",
      "The shop sits near the main market, so directions and opening hours should be easy to find.",
      "I also want a section for new arrivals each season and a short note about our tailoring turnaround.",
      "Payment is mostly cash and UPI at the counter, and we deliver inside the town on request.",
    ].join(" ");
    expect(long.length).toBeGreaterThan(STUDIO_PROMPT_MAX);
    const { blueprint, types } = sectionsFor(long.slice(0, STUDIO_PROMPT_MAX));
    expect(blueprint.business.category).toBe("retail");
    expect(types).toContain("listings");
    expect(types).toContain("contact");
  });

  it("accepts descriptions at the limits it advertises", () => {
    expect(STUDIO_PROMPT_MIN).toBeLessThan(STUDIO_PROMPT_MAX);
    const atLimit =
      `I run a clothing shop in Jaigaon. ${"Details ".repeat(60)}`.slice(
        0,
        STUDIO_PROMPT_MAX,
      );
    expect(() => generateFallbackDesignSpec(atLimit)).not.toThrow();
  });
});

describe("multiple business ambiguity", () => {
  it("detects two clearly different businesses", () => {
    const ideas = detectBusinessIdeas(
      "I want a site for my clothing shop in Jaigaon and also a website for my gym",
    );
    expect(ideas.map((idea) => idea.domain)).toEqual(["fashion", "fitness"]);
    expect(ideas[0]!.prompt).toContain("clothing shop");
    // The location is carried onto the idea that lost it in the split.
    expect(ideas[1]!.prompt).toContain("Jaigaon");
  });

  it("never interrupts an ordinary multi-service business", () => {
    const singleBusiness = [
      "restaurant and cafe in jaigaon",
      "premium cafe and bakery with coffee and cakes",
      "gym with supplement shop",
      "I sell clothes and shoes",
      "website design and SEO services agency",
      "hotel with rooms, restaurant and spa",
    ];
    for (const prompt of singleBusiness) {
      expect(detectBusinessIdeas(prompt)).toEqual([]);
    }
  });

  it("does not fire on a long description of one business", () => {
    const prompt =
      "Create a premium luxury resort website near Jaigaon with 15 rooms, mountain views, a restaurant and booking enquiries.";
    expect(detectBusinessIdeas(prompt)).toEqual([]);
  });
});

describe("typography safety guards", () => {
  const css = readFileSync(new URL("./v2-styles.css", import.meta.url), "utf8");

  it("sizes headlines against the preview frame, not the browser window", () => {
    expect(css).toContain("container-type: inline-size");
    expect(css).toMatch(/--site-h1-fluid:\s*\d/);
    expect(css).toMatch(/--site-h1-max:\s*\d/);
  });

  it("caps every hero headline and heading", () => {
    expect(css).toMatch(
      /\.studio-v2-section\.studio-v2-site-hero h1\s*\{[^}]*--site-h1-max/s,
    );
    expect(css).toMatch(/var\(--site-h1-max\)/);
    expect(css).toMatch(/var\(--site-h2-max\)/);
  });

  it("keeps long words and unbalanced lines from overflowing", () => {
    expect(css).toContain("overflow-wrap: break-word");
    expect(css).toContain("text-wrap: balance");
  });
});
