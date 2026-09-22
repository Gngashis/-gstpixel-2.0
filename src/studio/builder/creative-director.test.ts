import { describe, expect, it } from "vitest";
import {
  NVIDIA_MODEL_DEFAULT,
  planCreativeBlueprintWithNvidia,
} from "./nvidia-provider";
import { planCreativeBlueprintWithWorkersAi } from "./cloudflare-provider";
import { generateFallbackDesignSpec, planCreativeBlueprint } from "./blueprint";
import { planSitePages } from "./site-pages";

const prompt =
  "luxury boutique hotel in Bhutan with mountain views, suites and booking enquiries";

const validPatch = {
  direction: { intensity: "dramatic", premium: "luxury" },
  hero: { family: "cinematic-media" },
};

describe("AI creative director critique architecture", () => {
  it("asks NVIDIA for one internal critique and one revision, inside the same request", async () => {
    let body: { messages: Array<{ role: string; content: string }> } | null = null;
    const fetchImpl = (async (_input: unknown, init?: RequestInit) => {
      body = JSON.parse(String(init?.body));
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify(validPatch) } }],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as unknown as typeof fetch;

    await planCreativeBlueprintWithNvidia({
      visitorText: prompt,
      candidate: planCreativeBlueprint(prompt),
      apiKey: "nvapi-secret",
      model: NVIDIA_MODEL_DEFAULT,
      baseUrl: "https://integrate.api.nvidia.com/v1",
      fetchImpl,
    });

    const system = body!.messages[0]!.content;
    expect(system).toMatch(/critique your own draft once/i);
    expect(system).toMatch(/revise it once/i);
    expect(system).toMatch(/never mention the critique/i);
  });

  it("asks the Cloudflare provider for the same critique/revision behaviour", async () => {
    const calls: Array<{ messages: Array<{ role: string; content: string }> }> = [];
    const ai = {
      run: async (_model: string, params: { messages: Array<{ role: string; content: string }> }) => {
        calls.push(params);
        return { response: JSON.stringify(validPatch) };
      },
    };

    await planCreativeBlueprintWithWorkersAi({
      ai: ai as never,
      visitorText: prompt,
      candidate: planCreativeBlueprint(prompt),
      env: {},
    });

    const system = calls[0]!.messages[0]!.content;
    expect(system).toMatch(/critique your own draft once/i);
    expect(system).toMatch(/revise it once/i);
  });
});

describe("business-specific functional architecture", () => {
  const businesses = {
    hotel: { category: "hospitality", prompt },
    ecommerce: {
      category: "supplements",
      prompt: "protein and multivitamin ecommerce store with product range and delivery",
    },
    dental: {
      category: "healthcare",
      prompt: "premium dental clinic with treatments, results and appointment booking",
    },
    construction: {
      category: "construction",
      prompt: "luxury home construction company with projects and consultation",
    },
    ministry: {
      category: "faith",
      prompt: "modern Christian ministry with events, messages and giving",
    },
    service: {
      category: "technology",
      prompt: "AI automation company offering consulting and implementation services",
    },
  } as const;

  it("plans materially different page architecture for different businesses", () => {
    const plans = Object.fromEntries(
      Object.entries(businesses).map(([name, input]) => [
        name,
        planSitePages({ category: input.category, prompt: input.prompt, variation: 0 })
          .map((page) => page.kind)
          .join(","),
      ]),
    );
    const unique = new Set(Object.values(plans));
    expect(unique.size).toBe(Object.keys(businesses).length);
    expect(plans["hotel"]).toContain("experiences");
    expect(plans["ecommerce"]).toContain("shop");
    expect(plans["dental"]).toContain("treatments");
    expect(plans["construction"]).toContain("projects");
    expect(plans["ministry"]).toContain("programmes");
  });

  it("gives different businesses different heroes, palettes and section sequences", () => {
    const blueprints = Object.fromEntries(
      Object.entries(businesses).map(([name, input]) => [
        name,
        planCreativeBlueprint(input.prompt),
      ]),
    );
    const specs = Object.fromEntries(
      Object.entries(businesses).map(([name, input]) => [
        name,
        generateFallbackDesignSpec(input.prompt),
      ]),
    );
    const heroFamilies = new Set(
      Object.values(blueprints).map((blueprint) => blueprint.hero.family),
    );
    const palettes = new Set(
      Object.values(blueprints).map((blueprint) => blueprint.colour.palette),
    );
    const sectionOrders = new Set(
      Object.values(specs).map((spec) =>
        spec.pages[0]!.sections.map((section) => section.type).join(","),
      ),
    );
    expect(heroFamilies.size).toBeGreaterThan(3);
    expect(palettes.size).toBeGreaterThan(2);
    expect(sectionOrders.size).toBeGreaterThan(3);
  });
});