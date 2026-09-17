import { describe, expect, it } from "vitest";
import {
  buildRequirementBrief,
  buildRequirementText,
  initialForm,
  type FormState,
} from "./website-requirement-generator";

function formWith(overrides: Partial<FormState> = {}): FormState {
  return {
    ...initialForm,
    pages: [...initialForm.pages],
    features: [...initialForm.features],
    contentReadiness: [...initialForm.contentReadiness],
    ...overrides,
  };
}

describe("website requirement generator", () => {
  it("uses safe defaults for an empty or whitespace-only answer set", () => {
    const brief = buildRequirementBrief(
      formWith({
        businessName: "  ",
        industry: "\t",
        primaryGoal: "\n",
        websiteType: " ",
        pages: [],
        features: [],
        contentReadiness: [],
      }),
    );

    expect(brief.projectOverview).toContain("This business");
    expect(brief.projectOverview).toContain("its market");
    expect(brief.recommendedWebsiteType).toContain("Informational");
    expect(brief.suggestedPageStructure).toEqual([
      "1. Home",
      "2. About",
      "3. Services",
      "4. Contact",
    ]);
    expect(brief.functionalRequirements).toEqual(["Contact form", "WhatsApp"]);
    expect(brief.contentRequirements).toEqual(["Logo", "Brand colours"]);
  });

  it("produces identical output for identical inputs", () => {
    const answers = formWith({
      businessName: "Northstar Studio",
      industry: "Architecture",
      stage: "Ready to brief a build",
      primaryGoal: "Generate qualified enquiries",
      targetCustomer: "Commercial property owners",
      geographicMarket: "Mumbai and Pune",
      websiteType: "Business services",
      customPages: "Case studies, pricing, Case studies",
      features: ["Contact form", "Analytics", "SEO"],
      contentReadiness: ["Logo", "Copy / messaging"],
      references: "https://example.com",
      brandPersonality: "Precise and confident",
      domain: "northstar.example",
      hosting: "Managed hosting",
      analytics: "Plausible",
      email: "hello@northstar.example",
      thirdPartySystems: "CRM",
      timeline: "This quarter",
      maintenance: "Monthly support",
      priority: "Lead quality",
    });

    const first = buildRequirementBrief(answers);
    const second = buildRequirementBrief({ ...answers });

    expect(second).toEqual(first);
    expect(buildRequirementText(second)).toBe(buildRequirementText(first));
  });

  it("keeps optional fields transparent instead of inventing values", () => {
    const brief = buildRequirementBrief(
      formWith({
        businessName: "Harbour Goods",
        websiteType: "Informational",
        references: "",
        brandPersonality: "",
        analytics: "",
        domain: "",
        hosting: "",
        email: "",
        thirdPartySystems: "",
        timeline: "",
        maintenance: "",
        priority: "",
        budget: "₹50k–₹2L",
        notes: "Launch before the festive season",
      }),
    );

    expect(brief.designDirection).toContain(
      "Reference inputs: No direct reference sites supplied yet.",
    );
    expect(brief.integrations).toContain(
      "No core system dependency identified yet",
    );
    expect(brief.technicalConsiderations).toContain(
      "Recommended launch approach: A phased launch plan with a clear first milestone.",
    );
    expect(brief.technicalConsiderations).toContain(
      "Maintenance preference: Regular updates following launch.",
    );
    expect(JSON.stringify(brief)).not.toContain("₹50k");
    expect(JSON.stringify(brief)).not.toContain("festive season");
  });

  it("preserves the required structured brief headings", () => {
    const text = buildRequirementText(buildRequirementBrief(formWith()));
    const headings = [
      "PROJECT OVERVIEW",
      "BUSINESS GOALS",
      "TARGET AUDIENCE",
      "RECOMMENDED WEBSITE TYPE",
      "SUGGESTED PAGE STRUCTURE",
      "FUNCTIONAL REQUIREMENTS",
      "CONTENT REQUIREMENTS",
      "DESIGN DIRECTION",
      "MOBILE REQUIREMENTS",
      "SEO / DISCOVERABILITY NEEDS",
      "INTEGRATIONS",
      "TECHNICAL CONSIDERATIONS",
      "ASSETS STILL NEEDED",
      "PROJECT PRIORITIES",
      "NEXT STEPS",
    ];

    for (const heading of headings) {
      expect(text).toContain(heading);
    }
  });

  it("deduplicates custom pages while preserving their order", () => {
    const brief = buildRequirementBrief(
      formWith({
        pages: ["Home", "Services"],
        customPages: "Case studies, Services, pricing, Case studies",
      }),
    );

    expect(brief.suggestedPageStructure).toEqual([
      "1. Home",
      "2. Services",
      "3. Case studies",
      "4. pricing",
    ]);
  });

  it("uses conversion-focused mobile language for commerce and booking", () => {
    const ecommerce = buildRequirementBrief(
      formWith({ websiteType: "E-commerce" }),
    );
    const booking = buildRequirementBrief(
      formWith({ websiteType: "Booking / appointments" }),
    );
    const informational = buildRequirementBrief(
      formWith({ websiteType: "Informational" }),
    );

    expect(ecommerce.mobileRequirements[3]).toContain("quick conversion");
    expect(booking.mobileRequirements[3]).toContain("quick conversion");
    expect(informational.mobileRequirements[3]).toContain(
      "premium and confident",
    );
    expect(ecommerce.recommendedWebsiteType).toContain(
      "product discovery, trust, and conversion",
    );
    expect(booking.recommendedWebsiteType).toContain(
      "booking friction reduction",
    );
  });

  it("starts from a clean default state for restart behavior", () => {
    const restarted = formWith();
    expect(restarted).toEqual(initialForm);
    expect(restarted).not.toBe(initialForm);
    expect(restarted.pages).not.toBe(initialForm.pages);
  });
});
