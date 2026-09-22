import { describe, expect, it } from "vitest";
import { generateFallbackDesignSpec } from "./blueprint";
import {
  describeDesignDnaFacets,
  designDnaClasses,
  readDesignDna,
} from "./design-dna";
import { parseDesignSpec } from "./domain";

const prompts = [
  "Create a luxury jewellery business in Bhutan",
  "Create a local clothing store in Jaigaon",
  "Create an online protein supplement and multivitamin shop",
  "I run a dental clinic and want patients to book appointments",
];

describe("design identity facets", () => {
  it("names every aspect in the visitor's language, never a schema token", () => {
    for (const prompt of prompts) {
      const dna = readDesignDna(
        parseDesignSpec(generateFallbackDesignSpec(prompt)),
      );
      const facets = describeDesignDnaFacets(dna);
      expect(facets.length).toBeGreaterThanOrEqual(15);
      for (const facet of facets) {
        expect(facet.label).not.toMatch(/[a-z]-[a-z]/);
        // Raw tokens are hyphenated; customer language never is.
        expect(facet.value).not.toContain("-");
        expect(facet.value.trim().length).toBeGreaterThan(0);
      }
      const labels = facets.map((facet) => facet.label);
      expect(new Set(labels).size).toBe(labels.length);
    }
  });

  it("reports the identity the site actually renders", () => {
    const spec = parseDesignSpec(generateFallbackDesignSpec(prompts[0]!));
    const dna = readDesignDna(spec);
    const facets = describeDesignDnaFacets(dna);
    const hero = facets.find((facet) => facet.label === "Hero");
    const motion = facets.find((facet) => facet.label === "Motion");
    expect(hero?.value.toLowerCase()).toContain(
      dna.hero.family.replaceAll("-", " "),
    );
    expect(motion?.value.toLowerCase()).toContain(dna.motion.level);
  });
});

describe("mobile interpretation", () => {
  it("exposes the identity's own mobile decisions to the preview", () => {
    for (const prompt of prompts) {
      const dna = readDesignDna(
        parseDesignSpec(generateFallbackDesignSpec(prompt)),
      );
      const classes = designDnaClasses(dna);
      for (const token of [
        "dna-mobile-hero-",
        "dna-mobile-nav-",
        "dna-mobile-density-",
        "dna-mobile-cap-",
        "dna-mobile-cta-",
        "dna-mobile-decoration-",
      ]) {
        expect(classes).toContain(token);
      }
      expect(classes).toContain(`dna-mobile-hero-${dna.mobile.hero}`);
      expect(classes).toContain(`dna-mobile-cap-${dna.mobile.typographyCap}`);
    }
  });

  it("keeps page navigation reachable on a phone", () => {
    /*
     * A minimal mobile navigation must stay a slim, scrollable strip. Hiding it
     * would strand the visitor on one page of a multi-page concept.
     */
    const dna = readDesignDna(
      parseDesignSpec(generateFallbackDesignSpec(prompts[0]!)),
    );
    expect(designDnaClasses(dna)).toContain(
      `dna-mobile-nav-${dna.mobile.navigation}`,
    );
    expect(dna.mobile.hero).toMatch(/^(compact|balanced)$/);
    expect(dna.mobile.density).toMatch(/^(compact|balanced)$/);
    expect(dna.mobile.typographyCap).toMatch(/^(compact|balanced)$/);
  });
});
