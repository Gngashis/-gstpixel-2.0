import { parseDesignSpec, type DesignSpec, type DesignSection } from "./domain";

export type QualityIssue = {
  code:
    | "empty-navigation"
    | "missing-cta"
    | "duplicate-section-id"
    | "hero-order"
    | "excessive-hero-copy"
    | "missing-contact-action";
  repaired: boolean;
  message: string;
};

export type QualityGuardResult = {
  spec: DesignSpec;
  issues: QualityIssue[];
};

/**
 * Keeps generated concepts structurally safe before they reach the renderer.
 * This is deliberately bounded and deterministic: it repairs navigation and
 * ordering mistakes, but never invents an address, price, review, award or
 * business claim.
 */
export function guardDesignSpec(input: DesignSpec): QualityGuardResult {
  const spec = structuredClone(input);
  const issues: QualityIssue[] = [];

  if (spec.navigation.items.length === 0) {
    spec.navigation.items = [
      { label: "Home", target: "/" },
      { label: "Contact", target: "/contact" },
    ];
    issues.push({
      code: "empty-navigation",
      repaired: true,
      message: "Restored a usable Home and Contact navigation.",
    });
  }
  if (!spec.navigation.ctaLabel.trim()) {
    spec.navigation.ctaLabel = "Start a conversation";
    issues.push({
      code: "missing-cta",
      repaired: true,
      message: "Restored the primary navigation action.",
    });
  }

  const seenIds = new Set<string>();
  for (const page of spec.pages) {
    const heroIndex = page.sections.findIndex(
      (section) => section.type === "hero",
    );
    if (heroIndex > 0) {
      const [hero] = page.sections.splice(heroIndex, 1);
      page.sections.unshift(hero!);
      issues.push({
        code: "hero-order",
        repaired: true,
        message: `Moved the ${page.navigationLabel} hero to the beginning.`,
      });
    }
    for (const section of page.sections) {
      if (seenIds.has(section.id)) {
        const replacement = nextUniqueId(section, seenIds);
        section.id = replacement;
        issues.push({
          code: "duplicate-section-id",
          repaired: true,
          message: `Generated a unique anchor for the ${section.type} section.`,
        });
      }
      seenIds.add(section.id);
      if (section.type === "hero" && section.content.title.length > 110) {
        section.content.title = `${section.content.title.slice(0, 107).trimEnd()}…`;
        issues.push({
          code: "excessive-hero-copy",
          repaired: true,
          message: `Shortened the ${page.navigationLabel} headline for readability.`,
        });
      }
    }
  }

  const needsContact = [
    "hotel",
    "restaurant",
    "healthcare",
    "professional",
    "realestate",
    "events",
  ].includes(spec.site.businessKind);
  if (
    needsContact &&
    !spec.pages.some((page) =>
      page.sections.some((section) => section.type === "contact"),
    )
  ) {
    issues.push({
      code: "missing-contact-action",
      repaired: false,
      message:
        "This concept should include a verified contact or booking action before launch.",
    });
  }

  return { spec: parseDesignSpec(spec), issues };
}

function nextUniqueId(section: DesignSection, seen: Set<string>): string {
  const base = `${section.id}-repair`;
  let candidate = base;
  let counter = 2;
  while (seen.has(candidate)) candidate = `${base}-${counter++}`;
  return candidate.slice(0, 49);
}
