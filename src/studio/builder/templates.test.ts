import { describe, expect, it } from "vitest";
import {
  generateShowroomSpec,
  matchTemplates,
  templateMasterById,
  templateMasters,
  TEMPLATE_VARIANTS_PER_MASTER,
} from "./templates";
import { templateIds } from "./template-ids";

describe("PremiumTemplateRegistry and Showroom", () => {
  it("defines 20 high-quality master design systems", () => {
    expect(templateMasters.length).toBe(20);
    expect(templateIds.length).toBe(20);
    expect(TEMPLATE_VARIANTS_PER_MASTER).toBe(5);
    // 20 masters * 5 variants = 100 selectable experiences
    expect(templateMasters.length * TEMPLATE_VARIANTS_PER_MASTER).toBe(100);
  });

  it("every master has distinct valid metadata and overrides", () => {
    const ids = new Set<string>();
    for (const master of templateMasters) {
      expect(ids.has(master.id)).toBe(false);
      ids.add(master.id);
      expect(master.affinities.length).toBeGreaterThan(0);
      expect(master.tags.length).toBeGreaterThan(0);
      expect(["approachable", "refined", "luxury"]).toContain(master.premium);
      expect(["none", "subtle", "premium", "cinematic"]).toContain(master.motion);
      expect(["low", "medium", "high"]).toContain(master.mediaIntensity);
      expect(master.overrides).toBeDefined();
    }
  });

  it("matches template intelligently based on business intent and style words", () => {
    // 1. Gym with dark cinematic intent
    const gymMatches = matchTemplates({
      category: "fitness",
      prompt: "dark cinematic premium gym with lots of animation",
    });
    expect(gymMatches.length).toBeGreaterThan(0);
    const topGym = gymMatches[0]!.master;
    expect(["energetic-performance", "cinematic-dark", "bold-poster"]).toContain(topGym.id);
    expect(topGym.motion).toBe("cinematic");

    // 2. Luxury boutique hotel
    const hotelMatches = matchTemplates({
      category: "hospitality",
      prompt: "luxury boutique hotel in Bhutan",
    });
    const topHotel = hotelMatches[0]!.master;
    expect(["editorial-luxury", "cinematic-dark", "warm-hospitality", "soft-premium"]).toContain(topHotel.id);

    // 3. Construction
    const constructionMatches = matchTemplates({
      category: "construction",
      prompt: "luxury home construction company",
    });
    const topConstruction = constructionMatches[0]!.master;
    expect(["architectural-minimal", "brutalist-contemporary"]).toContain(topConstruction.id);

    // 4. Pharmacy (retail)
    const pharmacyMatches = matchTemplates({
      category: "retail",
      prompt: "local pharmacy and chemist store",
    });
    expect(pharmacyMatches.length).toBeGreaterThan(0);
  });

  it("generateShowroomSpec produces a fully valid, distinct DesignSpec", () => {
    const gymSpec = generateShowroomSpec("premium gym in Jaigaon", {
      masterId: "energetic-performance",
      variation: 0,
    });
    expect(gymSpec.metadata.template?.masterId).toBe("energetic-performance");
    expect(gymSpec.metadata.template?.variantId).toBe(0);
    expect(gymSpec.pages.length).toBeGreaterThanOrEqual(1);

    // Variant 1 produces a different layout/section structure while retaining intent
    const gymVariant1 = generateShowroomSpec("premium gym in Jaigaon", {
      masterId: "energetic-performance",
      variation: 1,
    });
    expect(gymVariant1.metadata.template?.variantId).toBe(1);
    expect(gymVariant1.metadata.fingerprint).not.toBe(
      gymSpec.metadata.fingerprint,
    );
  });

  it("templateMasterById returns expected master or safe default", () => {
    const master = templateMasterById("cinematic-dark");
    expect(master.id).toBe("cinematic-dark");
    // @ts-expect-error fallback check
    const fallback = templateMasterById("non-existent-id");
    expect(fallback).toBeDefined();
    expect(fallback.id).toBe(templateMasters[0]!.id);
  });
});
