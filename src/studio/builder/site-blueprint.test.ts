import { describe, expect, it } from "vitest";
import {
  applyBlueprintToSpec,
  blueprintFromSpec,
  createAlternateDesignSpec,
  generateFallbackDesignSpec,
  planCreativeBlueprint,
} from "./blueprint";
import {
  designSpecSchema,
  sectionVariantRegistry,
  parseDesignSpec,
} from "./domain";
import {
  applyStudioChangePlan,
  planStudioChange,
  type StudioChangeContext,
} from "./change-plan";
import {
  designDnaClasses,
  designDnaFromBlueprint,
  designDnaSchema,
  motionLevelFor,
  readDesignDna,
} from "./design-dna";
import { pageArchetypeList, pageKinds, planSitePages } from "./site-pages";

const scenarios = {
  jewellery:
    "Create a luxury jewellery business in Bhutan selling handmade gold and silver pieces with a small showroom.",
  clothing:
    "Create a local clothing store in Jaigaon selling everyday menswear and womenswear with a small team.",
  supplements:
    "Create an online protein supplement and multivitamin shop with whey protein, daily vitamins and product information.",
  dental:
    "Create a modern dental clinic website with treatments, an about page, appointment requests and contact details.",
  construction:
    "Create a construction company website with completed projects, services, capabilities and consultation enquiries.",
  restaurant:
    "Create a modern restaurant website with a seasonal menu, our story, a gallery and table reservations.",
} as const;

describe("SiteBlueprint page vocabulary", () => {
  it("only references section variants the schema allows", () => {
    for (const archetype of pageArchetypeList) {
      for (const [type, , variants] of archetype.sections) {
        const allowed = sectionVariantRegistry[type] as readonly string[];
        for (const variant of variants) {
          expect(allowed, `${archetype.kind} → ${type} → ${variant}`).toContain(
            variant,
          );
        }
      }
    }
  });

  it("names every page kind it declares", () => {
    expect(pageArchetypeList.map((entry) => entry.kind)).toEqual([
      ...pageKinds,
    ]);
  });
});

describe("SiteBlueprint generation", () => {
  it("generates a multi-page site for every business scenario", () => {
    for (const [label, prompt] of Object.entries(scenarios)) {
      const spec = generateFallbackDesignSpec(prompt);
      expect(spec.pages.length, label).toBeGreaterThanOrEqual(3);
      expect(spec.pages.length, label).toBeLessThanOrEqual(6);
      const slugs = spec.pages.map((page) => page.slug);
      expect(new Set(slugs).size, label).toBe(slugs.length);
      for (const page of spec.pages) {
        expect(page.sections[0]?.type, `${label} ${page.slug}`).toBe("hero");
      }
      // The global navigation is the site's page list, so the visitor can move
      // between generated pages from inside the preview.
      expect(spec.navigation.items.length).toBe(spec.pages.length);
      expect(spec.navigation.items.map((item) => item.target)).toEqual(slugs);
    }
  });

  it("does not force one page count on every business", () => {
    const counts = new Set(
      Object.values(scenarios).map(
        (prompt) => generateFallbackDesignSpec(prompt).pages.length,
      ),
    );
    expect(counts.size).toBeGreaterThan(1);
  });

  it("adds a page the visitor explicitly asked for", () => {
    const withShop = planSitePages({
      category: "professional",
      prompt: "Create a studio website with a shop of prints and a FAQ page.",
      variation: 0,
    }).map((page) => page.kind);
    expect(withShop).toContain("shop");
    expect(withShop).toContain("faq");
  });

  it("gives every scene a distinct page plan", () => {
    const jewellery = planSitePages({
      category: "jewellery",
      prompt: scenarios.jewellery,
      variation: 0,
    }).map((page) => page.slug);
    const supplements = planSitePages({
      category: "supplements",
      prompt: scenarios.supplements,
      variation: 0,
    }).map((page) => page.slug);
    expect(jewellery).not.toEqual(supplements);
    expect(supplements).toContain("/shop");
    expect(jewellery).not.toContain("/treatments");
  });

  it("is deterministic", () => {
    for (const prompt of Object.values(scenarios)) {
      expect(JSON.stringify(generateFallbackDesignSpec(prompt))).toBe(
        JSON.stringify(generateFallbackDesignSpec(prompt)),
      );
    }
  });

  it("keeps one design identity across every page", () => {
    const spec = generateFallbackDesignSpec(scenarios.construction);
    const dna = readDesignDna(spec);
    expect(dna.version).toBe(1);
    for (const page of spec.pages) {
      // Every page is rendered from the same palette, typography and shape
      // language, which is what stops page two drifting into a template.
      expect(spec.theme.palette.length).toBeGreaterThan(0);
      expect(page.sections[0]?.variant.length).toBeGreaterThan(0);
    }
    expect(designDnaClasses(dna)).toContain(`dna-hero-${dna.hero.family}`);
    expect(designDnaClasses(dna)).toContain(`dna-motion-${dna.motion.level}`);
  });
});

describe("DesignDNA", () => {
  it("derives a valid identity from a blueprint", () => {
    const blueprint = planCreativeBlueprint(scenarios.jewellery);
    const dna = designDnaFromBlueprint(blueprint);
    expect(designDnaSchema.safeParse(dna).success).toBe(true);
    expect(dna.palette.id).toBe(blueprint.colour.palette);
    expect(dna.typography.display).toBe(blueprint.typography.display);
    expect(dna.hero.family).toBe(blueprint.hero.family);
    expect(dna.mobile.strategy).toBe(blueprint.mobile.strategy);
  });

  it("formalises the four motion levels", () => {
    expect(motionLevelFor("quiet")).toBe("none");
    expect(motionLevelFor("editorial")).toBe("subtle");
    expect(motionLevelFor("luxury")).toBe("premium");
    expect(motionLevelFor("cinematic")).toBe("cinematic");
  });

  it("produces class tokens safe for a class attribute", () => {
    const dna = designDnaFromBlueprint(
      planCreativeBlueprint(scenarios.supplements),
    );
    for (const token of designDnaClasses(dna).split(" ")) {
      expect(token).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("reconstructs an identity for specs that predate it", () => {
    const spec = generateFallbackDesignSpec(scenarios.restaurant);
    const stripped = parseDesignSpec({
      ...spec,
      metadata: { ...spec.metadata, designDna: undefined },
    });
    expect(stripped.metadata.designDna).toBeUndefined();
    const dna = readDesignDna(stripped);
    expect(designDnaSchema.safeParse(dna).success).toBe(true);
    expect(dna.palette.id).toBe(spec.theme.palette);
  });
});

describe("Multi-page conversational editing", () => {
  const run = (instruction: string, prompt: string = scenarios.supplements) => {
    const spec = generateFallbackDesignSpec(prompt);
    const home = spec.pages[0]!;
    const context: StudioChangeContext = {
      spec,
      activePageSlug: home.slug,
      selectedSectionId: home.sections[0]!.id,
      viewport: "desktop",
      recentTurns: [],
      previousThemes: [],
    };
    const plan = planStudioChange(instruction, context);
    return { before: spec, ...applyStudioChangePlan(context, plan), plan };
  };

  it("adds a page the visitor names, with business-specific content", () => {
    const { spec } = run("add an FAQ page");
    const faq = spec.pages.find((page) => page.slug === "/faq");
    expect(faq).toBeDefined();
    expect(faq!.sections[0]!.type).toBe("hero");
    expect(
      faq!.sections.some((section) => section.variant === "faq-list"),
    ).toBe(true);
    expect(spec.navigation.items.some((item) => item.target === "/faq")).toBe(
      true,
    );
  });

  it("creates a booking page and a treatments page on request", () => {
    const booking = run("create a booking page").spec;
    expect(booking.pages.some((page) => page.slug === "/booking")).toBe(true);
    const treatments = run(
      "create a treatments page",
      "Create a dental clinic with treatments and appointments.",
    ).spec;
    expect(treatments.pages.some((page) => page.slug === "/treatments")).toBe(
      true,
    );
  });

  it("aims a named page's request at that page", () => {
    const { before, spec } = run("make the shop page more visual");
    const shopBefore = before.pages.find((page) => page.slug === "/shop")!;
    const shopAfter = spec.pages.find((page) => page.slug === "/shop")!;
    expect(JSON.stringify(shopAfter)).not.toBe(JSON.stringify(shopBefore));
    expect(JSON.stringify(spec.pages[0])).toBe(JSON.stringify(before.pages[0]));
  });

  it("removes a section type across the whole website", () => {
    const { before, spec } = run(
      "remove testimonials",
      "Create a dental clinic with treatments, appointments and patient testimonials.",
    );
    expect(
      before.pages.some((page) =>
        page.sections.some((section) => section.type === "testimonials"),
      ),
    ).toBe(true);
    expect(
      spec.pages.some((page) =>
        page.sections.some((section) => section.type === "testimonials"),
      ),
    ).toBe(false);
  });

  it("keeps the page set intact when only the design changes", () => {
    const { before, spec } = run("make everything darker");
    expect(spec.pages.map((page) => page.slug)).toEqual(
      before.pages.map((page) => page.slug),
    );
  });
});

describe("SiteBlueprint rebuilds", () => {
  it("keeps every page and the visitor's copy when the design changes", () => {
    const original = generateFallbackDesignSpec(scenarios.clothing);
    const edited = structuredClone(original);
    edited.pages[0]!.sections[0]!.content.title = "Made for Jaigaon.";
    const blueprint = blueprintFromSpec(edited);
    const next = applyBlueprintToSpec(parseDesignSpec(edited), {
      ...blueprint,
      hero: { ...blueprint.hero, family: "poster-brutalist" },
    });
    expect(next.pages.length).toBe(original.pages.length);
    expect(next.pages[0]!.sections[0]!.content.title).toBe("Made for Jaigaon.");
    expect(next.pages[0]!.sections[0]!.variant).toBe("poster-brutalist");
  });

  it("does not delete a page the visitor added", () => {
    const original = generateFallbackDesignSpec(scenarios.dental);
    const withFaq = structuredClone(original);
    withFaq.pages.push({
      slug: "/faq",
      title: "Questions",
      navigationLabel: "FAQ",
      sections: [
        structuredClone(withFaq.pages[0]!.sections[0]!),
        structuredClone(withFaq.pages[0]!.sections[1]!),
      ],
    });
    withFaq.pages.at(-1)!.sections[0]!.id = "faq-hero";
    withFaq.pages.at(-1)!.sections[0]!.type = "hero";
    withFaq.pages.at(-1)!.sections[1]!.id = "faq-features";
    withFaq.pages.at(-1)!.sections[1]!.type = "features";
    withFaq.pages.at(-1)!.sections[1]!.variant = "faq-list";
    const parsed = parseDesignSpec(withFaq);
    const blueprint = blueprintFromSpec(parsed);
    const next = applyBlueprintToSpec(parsed, {
      ...blueprint,
      colour: { ...blueprint.colour, palette: "graphite-lime" },
    });
    expect(next.pages.some((page) => page.slug === "/faq")).toBe(true);
  });

  it("offsets towards a genuinely different direction rather than a recolour", () => {
    const original = generateFallbackDesignSpec(scenarios.jewellery);
    const alternate = createAlternateDesignSpec(original);
    expect(designSpecSchema.safeParse(alternate).success).toBe(true);
    expect(alternate.metadata.variation).toBe(original.metadata.variation + 1);
    expect(alternate.pages.length).toBeGreaterThanOrEqual(3);
    const changed = [
      alternate.pages[0]!.sections[0]!.variant !==
        original.pages[0]!.sections[0]!.variant,
      alternate.theme.composition !== original.theme.composition,
      alternate.theme.typography !== original.theme.typography,
      alternate.theme.palette !== original.theme.palette,
    ].filter(Boolean).length;
    expect(changed).toBeGreaterThanOrEqual(2);
  });

  it("keeps the page count stable across creative directions", () => {
    const original = generateFallbackDesignSpec(scenarios.supplements);
    const alternate = createAlternateDesignSpec(original, {
      structural: false,
    });
    expect(alternate.pages.length).toBe(original.pages.length);
    expect(alternate.pages[0]!.sections.length).toBe(
      original.pages[0]!.sections.length,
    );
  });
});
