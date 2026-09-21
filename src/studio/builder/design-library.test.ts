import { describe, expect, it } from "vitest";
import {
  designCategories,
  designPresetById,
  designPresetSpec,
  designPresets,
  listDesignPresets,
} from "./design-library";
import { blueprintFromSpec } from "./blueprint";
import { getHomePage, sectionVariantRegistry } from "./domain";

/**
 * The premium library must be a real design registry: every entry has to
 * produce a valid site, keep its declared section order, and differ from the
 * others in composition rather than colour alone.
 */
describe("premium design library", () => {
  it("offers presets across every advertised category", () => {
    for (const category of designCategories) {
      expect(listDesignPresets(category).length).toBeGreaterThan(0);
    }
    expect(designPresets.length).toBeGreaterThanOrEqual(12);
  });

  it("builds a valid spec for every preset, in its own design language", () => {
    const fingerprints = new Set<string>();
    for (const entry of designPresets) {
      const spec = designPresetSpec(entry);
      const sections = getHomePage(spec).sections;

      // Hero family and palette are locked to the preset.
      expect(sections[0]!.variant).toBe(entry.grammar.hero);
      expect(spec.theme.palette).toBe(entry.grammar.palette);
      // The typography character survives the round trip through the spec.
      expect(blueprintFromSpec(spec).typography.display).toBe(
        entry.grammar.typography,
      );

      // Declared order is honoured (the hero is a blueprint field of its own).
      expect(sections.map((section) => section.type)).toEqual(
        entry.grammar.sectionOrder,
      );

      // Every variant must come from the section grammar.
      for (const section of sections) {
        expect(sectionVariantRegistry[section.type]).toContain(
          section.variant as never,
        );
      }

      fingerprints.add(
        `${sections[0]!.variant}|${spec.theme.palette}|${spec.theme.composition}|${sections.map((section) => `${section.type}:${section.variant}`).join(">")}`,
      );
    }
    // No two presets collapse into the same design.
    expect(fingerprints.size).toBe(designPresets.length);
  });

  it("describes desktop and mobile interpretation for every preset", () => {
    for (const entry of designPresets) {
      expect(entry.grammar.desktop.length).toBeGreaterThan(10);
      expect(entry.grammar.mobile.length).toBeGreaterThan(10);
      expect(entry.tags.length).toBeGreaterThan(0);
      expect(entry.license).toBe("internal");
      expect(entry.source).toBe("gstpixel");
    }
  });

  it("resolves presets by id and returns nothing for unknown ids", () => {
    expect(designPresetById("signal-grid")?.name).toBe("Signal Grid");
    expect(designPresetById("does-not-exist")).toBeUndefined();
  });
});
