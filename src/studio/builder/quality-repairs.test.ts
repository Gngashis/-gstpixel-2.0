import { describe, expect, it } from "vitest";
import { createStudioBuildHandler } from "./api";
import {
  extractPromptTerms,
  generateFallbackDesignSpec,
  planCreativeBlueprint,
} from "./blueprint";
import { extractLocationPhrase } from "./language";

const prompt = (value: string) => value;

function request(body: unknown) {
  return new Request("https://gstpixel.test/api/studio-build", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://gstpixel.test",
    },
    body: JSON.stringify(body),
  });
}

const handler = createStudioBuildHandler({
  guard: { enter: () => true, leave: () => undefined },
});

describe("business classifier repairs", () => {
  it("reads a local clothing shop as retail, not a fashion brand", () => {
    const terms = extractPromptTerms(
      prompt("clothing shop in Jaigaon with tailoring and seasonal collections"),
    );
    expect(terms.category).toBe("retail");
    expect(planCreativeBlueprint("clothing shop in Jaigaon").business.kind).toBe(
      "retail",
    );
  });

  it("keeps a high-end fashion brand as fashion", () => {
    const terms = extractPromptTerms(
      prompt("high-end fashion brand with collections and lookbook"),
    );
    expect(terms.category).toBe("fashion");
  });

  it("classifies a construction company as construction, not real estate", () => {
    const terms = extractPromptTerms(
      prompt("luxury home construction company with projects and consultation"),
    );
    expect(terms.category).toBe("construction");
    expect(
      planCreativeBlueprint(
        "luxury home construction company with projects",
      ).business.kind,
    ).toBe("construction");
  });

  it("keeps real estate as real estate", () => {
    const terms = extractPromptTerms(
      prompt("real estate agency selling apartments and plots"),
    );
    expect(terms.category).toBe("realestate");
  });

  it("classifies a photographer as creative, not events", () => {
    const terms = extractPromptTerms(
      prompt("photographer portfolio with gallery and client booking"),
    );
    expect(terms.category).toBe("creative");
    expect(
      planCreativeBlueprint("wedding photographer portfolio").business.kind,
    ).toBe("creative");
  });

  it("keeps an event planner as events", () => {
    const terms = extractPromptTerms(
      prompt("wedding planner and event management company"),
    );
    expect(terms.category).toBe("events");
  });

  it("classifies a pharmacy as retail, not a clinic", () => {
    for (const value of [
      "local pharmacy with medicines and home delivery",
      "chemist shop near Jaigaon",
      "medical store with home delivery",
    ]) {
      expect(extractPromptTerms(prompt(value)).category).toBe("retail");
    }
  });

  it("keeps a dental clinic as healthcare", () => {
    const terms = extractPromptTerms(
      prompt("premium dental clinic with treatments and appointments"),
    );
    expect(terms.category).toBe("healthcare");
  });
});

describe("location extraction repairs", () => {
  it("stops at the descriptive clause", () => {
    expect(
      extractLocationPhrase(
        "luxury boutique hotel in Bhutan with mountain views, suites and booking",
      ).place,
    ).toBe("Bhutan");
    expect(
      extractLocationPhrase(
        "elegant restaurant in Siliguri with fine dining and reservations",
      ).place,
    ).toBe("Siliguri");
    expect(
      extractLocationPhrase(
        "clothing shop in Jaigaon with tailoring and seasonal collections",
      ).place,
    ).toBe("Jaigaon");
  });

  it("drops a trailing lowercase descriptor after a place", () => {
    expect(extractLocationPhrase("hotel in Bhutan mountains").place).toBe(
      "Bhutan",
    );
  });

  it("keeps genuine multi-word places", () => {
    expect(
      extractLocationPhrase("business website in West Bengal").place,
    ).toBe("West Bengal");
  });

  it("still returns nothing when no place is named", () => {
    expect(extractLocationPhrase("a bakery with cakes").place).toBe("");
  });
});

describe("section rhythm repairs", () => {
  it("never repeats the same section type and purpose back to back", () => {
    const categories = [
      "luxury home construction company with projects and consultation",
      "premium dental clinic with treatments and appointments",
      "law firm with practice areas and consultations",
    ];
    for (const value of categories) {
      const sections = planCreativeBlueprint(value).sections;
      for (let i = 1; i < sections.length; i += 1) {
        const previous = sections[i - 1]!;
        const current = sections[i]!;
        if (previous.type === current.type) {
          expect(
            previous.purpose,
            `${value} repeats ${current.type} with the same purpose`,
          ).not.toBe(current.purpose);
        }
      }
    }
  });

  it("gives the construction home page a varied rhythm", () => {
    const spec = generateFallbackDesignSpec(
      "luxury home construction company with projects and consultation",
    );
    const types = spec.pages[0]!.sections.map((section) => section.type);
    expect(types.join(",")).not.toContain("features,features,features");
  });
});

describe("identity and palette diversity", () => {
  it("gives unrelated businesses different concept names", () => {
    const clothing = planCreativeBlueprint(
      "clothing shop in Jaigaon with tailoring",
    );
    const fashion = planCreativeBlueprint(
      "high-end fashion brand with collections and lookbook",
    );
    const pharmacy = planCreativeBlueprint(
      "local pharmacy with medicines and home delivery",
    );
    const dental = planCreativeBlueprint(
      "premium dental clinic with treatments and appointments",
    );
    expect(clothing.business.name).not.toBe(fashion.business.name);
    expect(pharmacy.business.name).not.toBe(dental.business.name);
  });

  it("uses the family signature palette for the first version", () => {
    const hotel = planCreativeBlueprint(
      "luxury boutique hotel in Bhutan with mountain views",
    );
    expect(hotel.colour.palette).toBe("forest-gold");
  });

  it("does not recycle one palette across unrelated industries", () => {
    const prompts = [
      "luxury boutique hotel in Bhutan with mountain views",
      "clothing shop in Jaigaon with tailoring",
      "protein and multivitamin ecommerce store",
      "premium dental clinic with treatments",
      "luxury home construction company with projects",
      "AI automation company with consulting",
      "elegant restaurant in Siliguri",
      "photographer portfolio with gallery",
      "gym with classes and memberships",
      "law firm with practice areas",
    ];
    const palettes = prompts.map(
      (value) => planCreativeBlueprint(value).colour.palette,
    );
    const graphite = palettes.filter((value) => value === "graphite-lime");
    expect(graphite.length).toBeLessThanOrEqual(1);
  });
});

describe("product-facing API errors", () => {
  it("maps a short prompt to a clean error with a stable code", async () => {
    const response = await handler(
      request({ action: "generate", prompt: "hi" }),
      {},
    );
    const payload = (await response.json()) as { error: string; code: string };
    expect(response.status).toBe(400);
    expect(payload.code).toBe("PROMPT_TOO_SHORT");
    expect(payload.error).toBe(
      "Please describe the website in a little more detail.",
    );
    expect(payload.error).not.toMatch(/character|zod|schema/i);
  });

  it("maps unsupported text to a clean error", async () => {
    const response = await handler(
      request({ action: "generate", prompt: "cafe <script>alert(1)</script>" }),
      {},
    );
    const payload = (await response.json()) as { error: string; code: string };
    expect(response.status).toBe(400);
    expect(payload.code).toBe("PROMPT_UNSUPPORTED");
    expect(payload.error).not.toMatch(/zod|schema|String must contain/i);
  });

  it("maps malformed requests to a generic code", async () => {
    const response = await handler(request({ action: "generate" }), {});
    const payload = (await response.json()) as { code: string };
    expect(response.status).toBe(400);
    expect(payload.code).toBe("REQUEST_INVALID");
  });
});
