import { describe, expect, it } from "vitest";
import {
  applyStudioChangePlan,
  getContextualSuggestions,
  planStudioChange,
  studioChangePlanSchema,
  type StudioChangeContext,
  type StudioChangePlan,
  type StudioConversationTurn,
} from "./change-plan";
import {
  createSectionForType,
  generateFallbackDesignSpec,
  getHomePage,
  parseDesignSpec,
  type DesignSpec,
  type SectionType,
} from "./domain";

const prompt =
  "Create a premium luxury resort website near Jaigaon with 15 rooms, mountain views, a restaurant and booking enquiries.";

function findSection(spec: DesignSpec, type: SectionType) {
  return spec.pages
    .flatMap((page) => page.sections)
    .find((section) => section.type === type);
}

function context(options?: {
  spec?: DesignSpec;
  selectedType?: SectionType;
  viewport?: "desktop" | "mobile";
  recentTurns?: StudioConversationTurn[];
  previousThemes?: DesignSpec["theme"][];
}): StudioChangeContext {
  const spec = options?.spec ?? generateFallbackDesignSpec(prompt);
  const page = getHomePage(spec);
  const selected =
    page.sections.find(
      (section) => section.type === (options?.selectedType ?? "hero"),
    ) ?? page.sections[0]!;
  return {
    spec,
    activePageSlug: page.slug,
    selectedSectionId: selected.id,
    viewport: options?.viewport ?? "desktop",
    recentTurns: options?.recentTurns ?? [],
    previousThemes: options?.previousThemes ?? [],
  };
}

function run(instruction: string, options?: Parameters<typeof context>[0]) {
  const current = context(options);
  const plan = planStudioChange(instruction, current);
  const result = applyStudioChangePlan(current, plan);
  return { before: current.spec, ...result };
}

function withTestimonials() {
  const spec = generateFallbackDesignSpec(prompt);
  const page = getHomePage(spec);
  page.sections.splice(
    page.sections.length - 1,
    0,
    createSectionForType("testimonials", spec),
  );
  return parseDesignSpec(spec);
}

describe("Studio intelligent change planning matrix", () => {
  const cases: Array<{
    instruction: string;
    options?: Parameters<typeof context>[0];
    assert: (result: ReturnType<typeof run>) => void;
  }> = [
    {
      instruction: "make it all black",
      assert: ({ spec }) =>
        expect(spec.theme.palette).toBe("midnight-champagne"),
    },
    {
      instruction: "make the site brighter",
      assert: ({ spec }) => expect(spec.theme.palette).toBe("paper-ink"),
    },
    {
      instruction: "make it more luxurious",
      assert: ({ spec }) => {
        expect(spec.theme.mood).toBe("luxury");
        expect(spec.theme.typography).toBe("editorial-serif");
        expect(spec.theme.spacing).toBe("expansive");
      },
    },
    {
      instruction: "make it more minimal",
      assert: ({ spec }) => {
        expect(spec.theme.mood).toBe("minimal");
        expect(spec.theme.motion).toBe("quiet");
      },
    },
    {
      instruction: "make it futuristic",
      assert: ({ spec }) => {
        expect(spec.theme.mood).toBe("technical");
        expect(spec.theme.typography).toBe("modern-grotesk");
      },
    },
    {
      instruction: "make it warmer",
      assert: ({ spec }) => {
        expect(spec.theme.mood).toBe("warm");
        expect(spec.theme.palette).toBe("ivory-terracotta");
      },
    },
    {
      instruction: "make this section more premium",
      options: { selectedType: "services" },
      assert: ({ before, spec }) => {
        expect(spec.theme.palette).toBe(before.theme.palette);
        expect(findSection(spec, "services")?.tone).toBe("accent");
      },
    },
    {
      instruction: "change only this section to black",
      options: { selectedType: "about" },
      assert: ({ before, spec }) => {
        expect(spec.theme.palette).toBe(before.theme.palette);
        expect(findSection(spec, "about")?.tone).toBe("dark");
      },
    },
    {
      instruction: "make the hero shorter",
      assert: ({ spec }) =>
        expect(findSection(spec, "hero")?.layout.height).toBe("compact"),
    },
    {
      instruction: "make the hero cinematic",
      assert: ({ spec }) => {
        expect(findSection(spec, "hero")?.variant).toBe("cinematic-editorial");
        expect(findSection(spec, "hero")?.motion).toBe("drift");
      },
    },
    {
      instruction: "make an animated hero",
      assert: ({ spec }) =>
        expect(findSection(spec, "hero")?.motion).toBe("drift"),
    },
    {
      instruction: "put services above about",
      assert: ({ spec }) => {
        const types = getHomePage(spec).sections.map((section) => section.type);
        expect(types.indexOf("services")).toBeLessThan(types.indexOf("about"));
      },
    },
    {
      instruction: "remove testimonials",
      options: { spec: withTestimonials(), selectedType: "testimonials" },
      assert: ({ spec }) =>
        expect(findSection(spec, "testimonials")).toBeUndefined(),
    },
    {
      instruction: "add a gallery after services",
      assert: ({ before, spec }) => {
        const sections = getHomePage(spec).sections;
        const serviceIndex = sections.findIndex(
          (section) => section.type === "services",
        );
        expect(sections[serviceIndex + 1]?.type).toBe("gallery");
        expect(
          sections.filter((section) => section.type === "gallery"),
        ).toHaveLength(
          getHomePage(before).sections.filter(
            (section) => section.type === "gallery",
          ).length + 1,
        );
      },
    },
    {
      instruction: "make buttons rounder",
      assert: ({ spec }) => expect(spec.theme.buttonStyle).toBe("pill"),
    },
    {
      instruction: "make headings larger",
      assert: ({ spec }) => expect(spec.theme.headingScale).toBe("expressive"),
    },
    {
      instruction: "make body text smaller",
      assert: ({ spec }) => expect(spec.theme.bodyScale).toBe("small"),
    },
    {
      instruction: "use less text",
      assert: ({ before, spec }) => {
        expect(
          findSection(spec, "about")?.content.body.length,
        ).toBeLessThanOrEqual(
          findSection(before, "about")!.content.body.length,
        );
        expect(findSection(spec, "services")?.layout.density).toBe("compact");
      },
    },
    {
      instruction: "make mobile cleaner",
      options: { viewport: "mobile" },
      assert: ({ spec }) => {
        expect(spec.responsive.overrides.simplified).toBe(true);
        expect(spec.responsive.overrides.navigation).toBe("minimal");
      },
    },
    {
      instruction: "make mobile cleaner but don't change desktop",
      options: { viewport: "mobile" },
      assert: ({ before, spec }) => {
        expect(spec.theme).toEqual(before.theme);
        expect(spec.responsive.overrides.heroHeight).toBe("compact");
      },
    },
    {
      instruction: "create an About page",
      assert: ({ spec }) =>
        expect(spec.pages.some((page) => page.slug === "/about")).toBe(true),
    },
    {
      instruction: "add a contact section",
      assert: ({ before, spec }) => {
        expect(
          getHomePage(spec).sections.filter(
            (section) => section.type === "contact",
          ),
        ).toHaveLength(
          getHomePage(before).sections.filter(
            (section) => section.type === "contact",
          ).length + 1,
        );
      },
    },
    {
      instruction: "move this section down",
      options: { selectedType: "about" },
      assert: ({ before, spec }) => {
        expect(
          getHomePage(spec).sections.findIndex(
            (section) => section.type === "about",
          ),
        ).toBe(
          getHomePage(before).sections.findIndex(
            (section) => section.type === "about",
          ) + 1,
        );
      },
    },
    {
      instruction: "try a completely different version of this section",
      options: { selectedType: "services" },
      assert: ({ before, spec }) => {
        expect(findSection(spec, "services")?.variant).not.toBe(
          findSection(before, "services")?.variant,
        );
      },
    },
    {
      instruction: "undo the colour change but keep the new hero",
      options: (() => {
        const original = generateFallbackDesignSpec(prompt);
        const changed = structuredClone(original);
        changed.theme.palette = "midnight-champagne";
        changed.pages[0]!.sections[0]!.variant = "cinematic-editorial";
        return {
          spec: parseDesignSpec(changed),
          previousThemes: [original.theme],
        };
      })(),
      assert: ({ spec }) => {
        expect(spec.theme.palette).toBe("forest-gold");
        expect(findSection(spec, "hero")?.variant).toBe("cinematic-editorial");
      },
    },
    {
      instruction: "make it dark, futuristic and minimal",
      assert: ({ spec }) => {
        expect(spec.theme.palette).toBe("midnight-champagne");
        expect(spec.theme.mood).toBe("technical");
        expect(spec.theme.motion).toBe("quiet");
      },
    },
    {
      instruction: "shorten the hero and move services above about",
      assert: ({ plan, spec }) => {
        expect(plan.operations.length).toBeGreaterThanOrEqual(2);
        expect(findSection(spec, "hero")?.layout.height).toBe("compact");
        const types = getHomePage(spec).sections.map((section) => section.type);
        expect(types.indexOf("services")).toBeLessThan(types.indexOf("about"));
      },
    },
    {
      instruction:
        "make it all black, shorten the hero, move services above about, and add a gallery after services",
      assert: ({ plan, spec }) => {
        expect(plan.operations.length).toBeGreaterThanOrEqual(4);
        expect(spec.theme.palette).toBe("midnight-champagne");
        expect(findSection(spec, "hero")?.layout.height).toBe("compact");
        const types = getHomePage(spec).sections.map((section) => section.type);
        expect(types.indexOf("services")).toBeLessThan(types.indexOf("about"));
      },
    },
    {
      instruction: "use a lighter design and make the hero more cinematic",
      assert: ({ spec }) => {
        expect(spec.theme.palette).toBe("paper-ink");
        expect(findSection(spec, "hero")?.variant).toBe("cinematic-editorial");
      },
    },
    {
      instruction: "make this look less generic",
      assert: ({ spec }) => {
        expect(spec.theme.mood).toBe("editorial");
        expect(spec.theme.headingScale).toBe("expressive");
      },
    },
    {
      instruction: "make it feel much more expensive",
      assert: ({ spec }) => expect(spec.theme.mood).toBe("luxury"),
    },
    {
      instruction: "improve everything but keep the current colour palette",
      assert: ({ before, spec }) => {
        expect(spec.theme.palette).toBe(before.theme.palette);
        expect(spec.theme.headingScale).toBe("expressive");
        expect(spec.theme.surface).toBe("layered");
      },
    },
  ];

  it.each(cases)(
    "understands: $instruction",
    ({ instruction, options, assert }) => {
      const result = run(instruction, options);
      expect(studioChangePlanSchema.safeParse(result.plan).success).toBe(true);
      expect(result.changed).toBe(true);
      assert(result);
    },
  );
});

describe("Studio conversational and safety behavior", () => {
  it("keeps a three-turn hero conversation scoped to the hero", () => {
    const first = run("make the hero dark");
    const firstTurn: StudioConversationTurn = {
      instruction: "make the hero dark",
      summary: first.plan.summary,
      pageSlug: "/",
      sectionId: findSection(first.spec, "hero")!.id,
      operationTypes: first.plan.operations.map((operation) => operation.type),
      operations: first.plan.operations,
    };
    const second = run("more dramatic", {
      spec: first.spec,
      selectedType: "hero",
      recentTurns: [firstTurn],
    });
    const secondTurn: StudioConversationTurn = {
      instruction: "more dramatic",
      summary: second.plan.summary,
      pageSlug: "/",
      sectionId: findSection(second.spec, "hero")!.id,
      operationTypes: second.plan.operations.map((operation) => operation.type),
      operations: second.plan.operations,
    };
    const third = run("keep the darkness but make the text smaller", {
      spec: second.spec,
      selectedType: "hero",
      recentTurns: [firstTurn, secondTurn],
    });

    expect(findSection(first.spec, "hero")?.tone).toBe("dark");
    expect(findSection(second.spec, "hero")?.tone).toBe("dark");
    expect(findSection(second.spec, "hero")?.layout.height).toBe("immersive");
    expect(findSection(third.spec, "hero")?.tone).toBe("dark");
    expect(findSection(third.spec, "hero")?.layout.textScale).toBe("compact");
    expect(third.spec.theme.palette).toBe(first.spec.theme.palette);
  });

  it("applies the previous section treatment to a named contact section", () => {
    const gallery = run("make this section more cinematic", {
      selectedType: "gallery",
    });
    const turn: StudioConversationTurn = {
      instruction: "make this section more cinematic",
      summary: gallery.plan.summary,
      pageSlug: "/",
      sectionId: findSection(gallery.spec, "gallery")!.id,
      operationTypes: gallery.plan.operations.map(
        (operation) => operation.type,
      ),
      operations: gallery.plan.operations,
    };
    const contact = run("do the same thing to the contact section", {
      spec: gallery.spec,
      selectedType: "gallery",
      recentTurns: [turn],
    });
    expect(findSection(contact.spec, "contact")?.visualTreatment.contrast).toBe(
      "high",
    );
    expect(findSection(contact.spec, "contact")?.motion).toBe("drift");
  });

  it("does not pretend malformed, malicious or unknown component requests succeeded", () => {
    for (const instruction of [
      "make",
      "<script>alert('x')</script>",
      "add a blockchain video carousel component",
    ]) {
      const result = run(instruction);
      expect(result.changed).toBe(false);
      expect(result.plan.operations).toHaveLength(0);
      expect(result.plan.unsupported.length).toBeGreaterThan(0);
    }
  });

  it("reports unavailable uploads without inventing a logo", () => {
    const result = run("put my logo in the navigation");
    expect(result.changed).toBe(false);
    expect(result.plan.unsupported.join(" ")).toContain("actual logo file");
    expect(result.spec.site.name).toBe(result.before.site.name);
  });

  it("adds only an explicitly labelled testimonial placeholder", () => {
    const result = run("add a customer testimonial");
    const testimonials = findSection(result.spec, "testimonials");
    expect(testimonials).toBeDefined();
    expect(JSON.stringify(testimonials)).toContain("placeholder");
    expect(JSON.stringify(testimonials)).toContain("verified");
    expect(JSON.stringify(testimonials)).not.toContain("five stars");
  });

  it("returns useful, grammatical, non-repeating contextual suggestions", () => {
    const heroContext = context({ selectedType: "hero" });
    const heroSuggestions = getContextualSuggestions(heroContext);
    expect(heroSuggestions).toContain("Make this hero more cinematic");
    expect(new Set(heroSuggestions).size).toBe(heroSuggestions.length);

    const mobileSuggestions = getContextualSuggestions(
      context({ selectedType: "services", viewport: "mobile" }),
    );
    expect(mobileSuggestions).toContain("Simplify this for mobile");
    expect(mobileSuggestions.join(" ").toLowerCase()).not.toContain(
      "testimpnoal",
    );
  });
});
