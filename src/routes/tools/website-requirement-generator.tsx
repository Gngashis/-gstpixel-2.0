import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { PageIntro, ScrollReveal, StaggeredReveal } from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";

const STORAGE_KEY = "gstpixel-website-requirement-generator";

const websiteTypeOptions = [
  "Informational",
  "Business services",
  "Portfolio / showcase",
  "E-commerce",
  "Booking / appointments",
  "Membership / account",
  "Other",
] as const;

const pageOptions = [
  "Home",
  "About",
  "Services",
  "Products",
  "Work / Portfolio",
  "Contact",
  "Blog",
  "FAQ",
  "Testimonials",
  "Custom pages",
] as const;

const featureOptions = [
  "Contact form",
  "WhatsApp",
  "Booking",
  "Payments",
  "E-commerce",
  "Accounts / login",
  "Search",
  "Maps / location",
  "File upload",
  "Newsletter",
  "Multilingual",
  "Analytics",
  "SEO",
  "CMS / content management",
  "Integrations",
] as const;

const contentReadinessOptions = [
  "Logo",
  "Brand colours",
  "Photography",
  "Copy / messaging",
  "Services list",
  "Product information",
  "Legal / privacy material",
] as const;

const designStyleOptions = [
  "Premium minimal",
  "Bold editorial",
  "Service-first / practical",
  "Warm and approachable",
  "Luxury / elevated",
  "Clean SaaS",
  "Other",
] as const;

const densityOptions = [
  "Minimal",
  "Balanced",
  "Content-rich",
  "Highly visual",
] as const;
const motionOptions = [
  "Subtle",
  "Balanced",
  "More interactive",
  "Minimal / static",
] as const;
const stageOptions = [
  "Starting fresh",
  "Refining an idea",
  "Comparing options",
  "Ready to brief a build",
  "Improving an existing site",
] as const;

const planningStages = [
  { title: "Business basics", summary: "Identity, market, and goals" },
  { title: "Website direction", summary: "Type, pages, and features" },
  { title: "Content and design", summary: "Brand, positioning, and style" },
  { title: "Technical readiness", summary: "Hosting, systems, and delivery" },
  {
    title: "Planning and output",
    summary: "Timeline, priorities, and next steps",
  },
] as const;

export type FormState = {
  businessName: string;
  industry: string;
  stage: string;
  primaryGoal: string;
  targetCustomer: string;
  geographicMarket: string;
  websiteType: string;
  pages: string[];
  customPages: string;
  features: string[];
  contentReadiness: string[];
  designStyle: string;
  density: string;
  motionPreference: string;
  references: string;
  brandPersonality: string;
  domain: string;
  hosting: string;
  existingWebsite: string;
  analytics: string;
  email: string;
  thirdPartySystems: string;
  timeline: string;
  budget: string;
  maintenance: string;
  priority: string;
  notes: string;
};

export const initialForm: FormState = {
  businessName: "",
  industry: "",
  stage: "",
  primaryGoal: "",
  targetCustomer: "",
  geographicMarket: "",
  websiteType: "",
  pages: ["Home", "About", "Services", "Contact"],
  customPages: "",
  features: ["Contact form", "WhatsApp"],
  contentReadiness: ["Logo", "Brand colours"],
  designStyle: "Premium minimal",
  density: "Balanced",
  motionPreference: "Subtle",
  references: "",
  brandPersonality: "",
  domain: "",
  hosting: "",
  existingWebsite: "",
  analytics: "",
  email: "",
  thirdPartySystems: "",
  timeline: "",
  budget: "",
  maintenance: "",
  priority: "",
  notes: "",
};

type Brief = {
  projectOverview: string;
  businessGoals: string[];
  targetAudience: string[];
  recommendedWebsiteType: string;
  suggestedPageStructure: string[];
  functionalRequirements: string[];
  contentRequirements: string[];
  designDirection: string[];
  mobileRequirements: string[];
  seoDiscoverabilityNeeds: string[];
  integrations: string[];
  technicalConsiderations: string[];
  assetsStillNeeded: string[];
  projectPriorities: string[];
  nextSteps: string[];
};

function toggleListItem<T extends string>(
  value: T,
  items: T[],
  setter: (next: T[]) => void,
): void {
  if (items.includes(value)) {
    setter(items.filter((item) => item !== value));
    return;
  }
  setter([...items, value]);
}

export function buildRequirementBrief(form: FormState): Brief {
  const businessName = form.businessName.trim() || "This business";
  const industry = form.industry.trim() || "its market";
  const stage = form.stage.trim() || "early-stage";
  const goal =
    form.primaryGoal.trim() ||
    "establish a clear and credible digital presence";
  const targetCustomer =
    form.targetCustomer.trim() || "ideal customers and qualified leads";
  const market = form.geographicMarket.trim() || "local and regional customers";
  const type = (form.websiteType || "Informational").trim() || "Informational";
  const pages = form.pages.length
    ? form.pages
    : ["Home", "About", "Services", "Contact"];
  const featureList = form.features.length
    ? form.features
    : ["Contact form", "WhatsApp"];
  const contentNeeds = form.contentReadiness.length
    ? form.contentReadiness
    : ["Logo", "Brand colours"];
  const pagesWithCustom = form.customPages.trim()
    ? [
        ...new Set([
          ...pages,
          ...form.customPages
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
        ]),
      ]
    : pages;
  const designStyle = form.designStyle || "Premium minimal";
  const density = form.density || "Balanced";
  const motionPreference = form.motionPreference || "Subtle";
  const supportSystems =
    form.thirdPartySystems.trim() || "No core system dependency identified yet";
  const mobileTone =
    form.websiteType === "E-commerce" ||
    form.websiteType === "Booking / appointments"
      ? "The mobile experience should prioritise quick conversion, clear action buttons, and friction-free booking or purchase flows."
      : "The mobile experience should remain premium and confident, with clear hierarchy, large tap targets, and minimal friction for key calls to action.";

  const businessGoals = [
    `Make ${businessName} easier to discover and trust in ${market}.`,
    `Support ${goal}.`,
    `Help the business convert ${targetCustomer} into enquiries, leads, or bookings.`,
  ];

  const targetAudienceList = [
    `Primary audience: ${targetCustomer}.`,
    `Service area: ${market}.`,
    `Business context: ${industry} operating at ${stage} stage.`,
  ];

  const pageStructure = pagesWithCustom.map(
    (page, index) => `${index + 1}. ${page}`,
  );
  const functionalRequirements = featureList.map((feature) => feature);
  const contentRequirements = contentNeeds.map((item) => item);
  const designDirection = [
    `Keep a ${designStyle.toLowerCase()} visual language with ${density.toLowerCase()} information density.`,
    `Use ${motionPreference.toLowerCase()} interaction and motion to keep the experience premium without feeling noisy.`,
    `Reference inputs: ${form.references.trim() || "No direct reference sites supplied yet"}.`,
    `Brand personality: ${form.brandPersonality.trim() || "Professional, trustworthy, and clear"}.`,
  ];

  const mobileRequirements = [
    "Design for 320px–430px screens with thumb-friendly controls and a strong one-hand navigation pattern.",
    "Keep primary CTAs visible without competing with long copy, menu items, or layered cards.",
    "Avoid horizontal overflow, clipped labels, and crowded secondary actions.",
    mobileTone,
  ];

  const seoAndDiscoverability = [
    `Target keywords around ${industry} services and ${businessName}.`,
    `Structure pages for clear headings, local or regional discoverability, and strong calls to action.`,
    form.analytics
      ? `Track engagement in ${form.analytics}.`
      : "Set up simple analytics before launch for conversion and audience analysis.",
    `Use ${form.websiteType || "the chosen website type"} as the central conversion page structure.`,
  ];

  const integrations = [
    form.email
      ? `Email handling: ${form.email}.`
      : "Email handling should be defined before launch.",
    form.analytics
      ? `Analytics / measurement: ${form.analytics}.`
      : "Analytics should be configured after structure is approved.",
    form.domain
      ? `Domain / hosting: ${form.domain} and ${form.hosting || "hosting plan to be confirmed"}.`
      : "Domain and hosting plan need confirmation before final launch prep.",
    supportSystems,
  ];

  const technicalConsiderations = [
    `Recommended launch approach: ${form.timeline || "A phased launch plan with a clear first milestone"}.`,
    `Maintenance preference: ${form.maintenance || "Regular updates following launch"}.`,
    `Priority level: ${form.priority || "To be confirmed"}.`,
    `Existing website status: ${form.existingWebsite || "No existing website identified yet"}.`,
  ];

  const assetsStillNeeded = [
    "Final brand copy or proof points if they do not already exist.",
    "Approved logo and visual assets if the current brand kit is incomplete.",
    "Any legal or privacy material before public launch.",
    `Any missing content for: ${contentNeeds.join(", ") || "core conversion pages"}.`,
  ];

  const priorities = [
    `Set a clear launch goal around ${goal}.`,
    `Confirm the most important pages and conversion actions.`,
    `Agree on the first release scope before expanding features.`,
    `Keep the build focussed on discoverability and conversion rather than unnecessary complexity.`,
  ];

  const nextSteps = [
    `Confirm the final scope for ${businessName}.`,
    `Approve the page structure and feature list before design is locked.`,
    `Gather the final content and assets still needed for launch.`,
    `Review the mobile experience and conversion flow before the build proceeds.`,
  ];

  return {
    projectOverview: `${businessName} is a ${industry} business seeking to ${goal}. The recommended direction is a ${type.toLowerCase()} website built for ${market} and designed to support conversion, trust, and clear communication for ${targetCustomer}.`,
    businessGoals: businessGoals,
    targetAudience: targetAudienceList,
    recommendedWebsiteType: `${type} website with emphasis on ${type === "E-commerce" ? "product discovery, trust, and conversion" : type === "Booking / appointments" ? "booking friction reduction and clear service clarity" : type === "Business services" ? "lead generation and service clarity" : "clarity, credibility, and action"}.`,
    suggestedPageStructure: pageStructure,
    functionalRequirements: functionalRequirements,
    contentRequirements: contentRequirements,
    designDirection: designDirection,
    mobileRequirements: mobileRequirements,
    seoDiscoverabilityNeeds: seoAndDiscoverability,
    integrations: integrations,
    technicalConsiderations: technicalConsiderations,
    assetsStillNeeded: assetsStillNeeded,
    projectPriorities: priorities,
    nextSteps: nextSteps,
  };
}

export function buildRequirementText(brief: Brief): string {
  const sections: Array<[string, string[] | string]> = [
    ["PROJECT OVERVIEW", [brief.projectOverview]],
    ["BUSINESS GOALS", brief.businessGoals],
    ["TARGET AUDIENCE", brief.targetAudience],
    ["RECOMMENDED WEBSITE TYPE", [brief.recommendedWebsiteType]],
    ["SUGGESTED PAGE STRUCTURE", brief.suggestedPageStructure],
    ["FUNCTIONAL REQUIREMENTS", brief.functionalRequirements],
    ["CONTENT REQUIREMENTS", brief.contentRequirements],
    ["DESIGN DIRECTION", brief.designDirection],
    ["MOBILE REQUIREMENTS", brief.mobileRequirements],
    ["SEO / DISCOVERABILITY NEEDS", brief.seoDiscoverabilityNeeds],
    ["INTEGRATIONS", brief.integrations],
    ["TECHNICAL CONSIDERATIONS", brief.technicalConsiderations],
    ["ASSETS STILL NEEDED", brief.assetsStillNeeded],
    ["PROJECT PRIORITIES", brief.projectPriorities],
    ["NEXT STEPS", brief.nextSteps],
  ];

  return sections
    .map(([heading, value]) => {
      const lines = Array.isArray(value) ? value : [value];
      return [heading, "", ...lines].join("\n");
    })
    .join("\n\n");
}

function renderSection(title: string, items: string[]) {
  return (
    <div
      key={title}
      style={{
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "1rem",
        marginTop: "1.25rem",
      }}
    >
      <p className="label text-primary" style={{ marginBottom: "0.75rem" }}>
        {title}
      </p>
      <ul
        style={{
          margin: 0,
          paddingLeft: "1.2rem",
          display: "grid",
          gap: "0.5rem",
        }}
      >
        {items.map((item) => (
          <li key={item} style={{ color: "var(--ink-muted)", lineHeight: 1.6 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Route = createFileRoute("/tools/website-requirement-generator")({
  head: () => ({
    meta: [
      { title: "Website Requirement Generator — GSTPIXEL" },
      {
        name: "description",
        content:
          "Generate a structured website brief from a guided questionnaire without fabricated pricing or AI claims.",
      },
      {
        property: "og:title",
        content: "Website Requirement Generator — GSTPIXEL",
      },
      {
        property: "og:description",
        content: "Turn a business questionnaire into a useful website brief.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormState>;
        setForm((current) => ({ ...current, ...parsed }));
      }
    } catch {
      // Storage is optional; do not disrupt the flow.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // Storage is optional; do not disrupt the flow.
    }
  }, [form]);

  const brief = useMemo(() => buildRequirementBrief(form), [form]);
  const briefText = useMemo(() => buildRequirementText(brief), [brief]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setCurrentStep(0);
    setCopyState("idle");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is optional; do not disrupt the flow.
    }
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(briefText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = briefText;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < planningStages.length - 1;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="form-label" htmlFor="businessName">
                Business or project name
              </label>
              <input
                id="businessName"
                className="form-control"
                value={form.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
                placeholder="GSTPIXEL Studio"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="industry">
                Industry or category
              </label>
              <input
                id="industry"
                className="form-control"
                value={form.industry}
                onChange={(event) =>
                  updateField("industry", event.target.value)
                }
                placeholder="Professional services, retail, healthcare…"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="stage">
                Business stage
              </label>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Business stage"
              >
                {stageOptions.map((stage) => (
                  <label
                    key={stage}
                    className={`segmented-option ${form.stage === stage ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      checked={form.stage === stage}
                      onChange={() => updateField("stage", stage)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{stage}</strong>
                    </div>
                    {form.stage === stage && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="primaryGoal">
                Primary website goal
              </label>
              <textarea
                id="primaryGoal"
                className="form-control"
                rows={4}
                value={form.primaryGoal}
                onChange={(event) =>
                  updateField("primaryGoal", event.target.value)
                }
                placeholder="Generate more leads, explain services, sell products, or create trust for the brand."
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="form-label" htmlFor="targetCustomer">
                Target customer
              </label>
              <input
                id="targetCustomer"
                className="form-control"
                value={form.targetCustomer}
                onChange={(event) =>
                  updateField("targetCustomer", event.target.value)
                }
                placeholder="Homeowners, startup founders, B2B buyers, families…"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="geographicMarket">
                Geographic market
              </label>
              <input
                id="geographicMarket"
                className="form-control"
                value={form.geographicMarket}
                onChange={(event) =>
                  updateField("geographicMarket", event.target.value)
                }
                placeholder="Local, city region, nationwide, online only"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="websiteType">
                Website type
              </label>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Website type"
              >
                {websiteTypeOptions.map((option) => (
                  <label
                    key={option}
                    className={`segmented-option ${form.websiteType === option ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="websiteType"
                      checked={form.websiteType === option}
                      onChange={() => updateField("websiteType", option)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{option}</strong>
                    </div>
                    {form.websiteType === option && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: "grid", gap: "1rem" }}>
            <fieldset>
              <legend className="form-label">Suggested pages</legend>
              <div className="capability-grid">
                {pageOptions.map((page) => (
                  <label
                    key={page}
                    className={`capability-chip ${form.pages.includes(page) ? "selected" : ""}`}
                    style={{ minHeight: "3.3rem" }}
                  >
                    <input
                      type="checkbox"
                      checked={form.pages.includes(page)}
                      onChange={() =>
                        toggleListItem(page, form.pages, (next) =>
                          updateField("pages", next),
                        )
                      }
                      className="sr-only"
                    />
                    <span className="chip-label">{page}</span>
                    {form.pages.includes(page) && (
                      <Check
                        size={14}
                        className="chip-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label className="form-label" htmlFor="customPages">
                Custom pages
              </label>
              <input
                id="customPages"
                className="form-control"
                value={form.customPages}
                onChange={(event) =>
                  updateField("customPages", event.target.value)
                }
                placeholder="Case studies, pricing, resources, gallery"
              />
            </div>
            <fieldset>
              <legend className="form-label">
                Core functional requirements
              </legend>
              <div className="capability-grid">
                {featureOptions.map((feature) => (
                  <label
                    key={feature}
                    className={`capability-chip ${form.features.includes(feature) ? "selected" : ""}`}
                    style={{ minHeight: "3.3rem" }}
                  >
                    <input
                      type="checkbox"
                      checked={form.features.includes(feature)}
                      onChange={() =>
                        toggleListItem(feature, form.features, (next) =>
                          updateField("features", next),
                        )
                      }
                      className="sr-only"
                    />
                    <span className="chip-label">{feature}</span>
                    {form.features.includes(feature) && (
                      <Check
                        size={14}
                        className="chip-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        );
      case 3:
        return (
          <div style={{ display: "grid", gap: "1rem" }}>
            <fieldset>
              <legend className="form-label">Content readiness</legend>
              <div className="capability-grid">
                {contentReadinessOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`capability-chip ${form.contentReadiness.includes(opt) ? "selected" : ""}`}
                    style={{ minHeight: "3.3rem" }}
                  >
                    <input
                      type="checkbox"
                      checked={form.contentReadiness.includes(opt)}
                      onChange={() =>
                        toggleListItem(opt, form.contentReadiness, (next) =>
                          updateField("contentReadiness", next),
                        )
                      }
                      className="sr-only"
                    />
                    <span className="chip-label">{opt}</span>
                    {form.contentReadiness.includes(opt) && (
                      <Check
                        size={14}
                        className="chip-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label className="form-label" htmlFor="designStyle">
                Design style
              </label>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Design style"
              >
                {designStyleOptions.map((option) => (
                  <label
                    key={option}
                    className={`segmented-option ${form.designStyle === option ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="designStyle"
                      checked={form.designStyle === option}
                      onChange={() => updateField("designStyle", option)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{option}</strong>
                    </div>
                    {form.designStyle === option && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="density">
                Density preference
              </label>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Density preference"
              >
                {densityOptions.map((option) => (
                  <label
                    key={option}
                    className={`segmented-option ${form.density === option ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="density"
                      checked={form.density === option}
                      onChange={() => updateField("density", option)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{option}</strong>
                    </div>
                    {form.density === option && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="motionPreference">
                Interaction preference
              </label>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Interaction preference"
              >
                {motionOptions.map((option) => (
                  <label
                    key={option}
                    className={`segmented-option ${form.motionPreference === option ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="motionPreference"
                      checked={form.motionPreference === option}
                      onChange={() => updateField("motionPreference", option)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{option}</strong>
                    </div>
                    {form.motionPreference === option && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="references">
                Reference websites
              </label>
              <input
                id="references"
                className="form-control"
                value={form.references}
                onChange={(event) =>
                  updateField("references", event.target.value)
                }
                placeholder="Example links or style references if helpful"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="brandPersonality">
                Brand personality
              </label>
              <input
                id="brandPersonality"
                className="form-control"
                value={form.brandPersonality}
                onChange={(event) =>
                  updateField("brandPersonality", event.target.value)
                }
                placeholder="Professional, warm, premium, approachable, bold…"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="form-label" htmlFor="domain">
                Domain or URL
              </label>
              <input
                id="domain"
                className="form-control"
                value={form.domain}
                onChange={(event) => updateField("domain", event.target.value)}
                placeholder="example.com"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="hosting">
                Hosting / technical setup
              </label>
              <input
                id="hosting"
                className="form-control"
                value={form.hosting}
                onChange={(event) => updateField("hosting", event.target.value)}
                placeholder="Need recommendations, already have hosting, or no decision yet"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="existingWebsite">
                Existing website
              </label>
              <input
                id="existingWebsite"
                className="form-control"
                value={form.existingWebsite}
                onChange={(event) =>
                  updateField("existingWebsite", event.target.value)
                }
                placeholder="No current website, redesign, or existing platform"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="analytics">
                Analytics / reporting
              </label>
              <input
                id="analytics"
                className="form-control"
                value={form.analytics}
                onChange={(event) =>
                  updateField("analytics", event.target.value)
                }
                placeholder="Google Analytics, Meta Pixel, or another setup"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="email">
                Email setup
              </label>
              <input
                id="email"
                className="form-control"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="hello@company.com or no decision yet"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="thirdPartySystems">
                Third-party systems
              </label>
              <input
                id="thirdPartySystems"
                className="form-control"
                value={form.thirdPartySystems}
                onChange={(event) =>
                  updateField("thirdPartySystems", event.target.value)
                }
                placeholder="CRM, WhatsApp, booking tool, payments, accounting, inventory"
              />
            </div>
          </div>
        );
      default:
        return (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="form-label" htmlFor="timeline">
                Timeline preference
              </label>
              <input
                id="timeline"
                className="form-control"
                value={form.timeline}
                onChange={(event) =>
                  updateField("timeline", event.target.value)
                }
                placeholder="Within 4 weeks, this quarter, or a phased plan"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="budget">
                Budget range
              </label>
              <input
                id="budget"
                className="form-control"
                value={form.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                placeholder="Optional — for example: under ₹50k, ₹50k–₹2L, or not sure"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="maintenance">
                Maintenance preference
              </label>
              <input
                id="maintenance"
                className="form-control"
                value={form.maintenance}
                onChange={(event) =>
                  updateField("maintenance", event.target.value)
                }
                placeholder="Hands-on updates, monthly support, or no internal management"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="priority">
                Priority
              </label>
              <input
                id="priority"
                className="form-control"
                value={form.priority}
                onChange={(event) =>
                  updateField("priority", event.target.value)
                }
                placeholder="Lead generation, sales, trust, service discovery, or launch speed"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="notes">
                Additional notes
              </label>
              <textarea
                id="notes"
                className="form-control"
                rows={5}
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Anything important about competitors, goals, constraints, or launch timing?"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <PageIntro
        label="Tool 05"
        title="Website requirement generator"
        description="Turn a structured questionnaire into a clear, free website brief. This tool documents the logic behind its recommendations and keeps the result local to your browser."
      />

      <section className="content-band">
        <div className="site-container tool-layout" style={{ gap: "2rem" }}>
          <div
            className="tool-input-panel"
            style={{ display: "grid", gap: "1.5rem" }}
          >
            <ScrollReveal variant="fadeInUp" delay={0}>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <p className="label text-primary">Build the brief</p>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(
                    ((currentStep + 1) / planningStages.length) * 100,
                  )}
                  aria-label="Questionnaire progress"
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((currentStep + 1) / planningStages.length) * 100}%`,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <span className="label text-primary">
                    Step {currentStep + 1} of {planningStages.length}
                  </span>
                  <span
                    style={{
                      font: "500 0.75rem var(--font-mono)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {planningStages[currentStep]?.summary}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {planningStages.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    style={{
                      border:
                        index === currentStep
                          ? "1px solid var(--primary)"
                          : "1px solid var(--border)",
                      background:
                        index === currentStep
                          ? "color-mix(in oklab, var(--primary) 8%, transparent)"
                          : "var(--surface)",
                      color:
                        index === currentStep
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      font: "600 0.82rem var(--font-body)",
                      cursor: "pointer",
                    }}
                    aria-label={`Go to ${step.title}`}
                  >
                    {index + 1}. {step.title}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            <StaggeredReveal
              baseDelay={0.05}
              variant="fadeInUp"
              className="questionnaire-surface"
            >
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <p className="label text-primary">
                    {planningStages[currentStep]?.title}
                  </p>
                  <h2
                    style={{
                      margin: "0.5rem 0 0",
                      font: "700 clamp(1.7rem, 3vw, 2.7rem) var(--font-display)",
                    }}
                  >
                    {planningStages[currentStep]?.summary}
                  </h2>
                </div>
                {renderStep()}
              </div>
            </StaggeredReveal>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <Button variant="quiet" onClick={handleReset} type="button">
                <RotateCcw size={14} /> Reset
              </Button>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                {canGoBack && (
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentStep((step) => step - 1)}
                    type="button"
                  >
                    <ArrowLeft size={14} /> Back
                  </Button>
                )}
                {canGoNext ? (
                  <Button
                    onClick={() => setCurrentStep((step) => step + 1)}
                    type="button"
                  >
                    Continue <ArrowRight size={14} />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(planningStages.length - 1)}
                    type="button"
                  >
                    Review brief
                  </Button>
                )}
              </div>
            </div>
          </div>

          <aside
            className="result-panel"
            aria-live="polite"
            aria-label="Website requirement brief"
          >
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <p className="label text-primary">Generated brief</p>
            </ScrollReveal>

            <StaggeredReveal baseDelay={0.08} variant="scaleIn">
              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <span className="label text-primary">Project overview</span>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      color: "var(--ink-foreground)",
                    }}
                  >
                    {brief.projectOverview}
                  </p>
                </div>
                <div>
                  <span className="label text-primary">Recommended type</span>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      color: "var(--ink-foreground)",
                    }}
                  >
                    {brief.recommendedWebsiteType}
                  </p>
                </div>
              </div>
            </StaggeredReveal>

            <div
              style={{ display: "grid", gap: "0.75rem", marginTop: "1.5rem" }}
            >
              {renderSection("Business goals", brief.businessGoals)}
              {renderSection("Target audience", brief.targetAudience)}
              {renderSection(
                "Suggested page structure",
                brief.suggestedPageStructure,
              )}
              {renderSection(
                "Functional requirements",
                brief.functionalRequirements,
              )}
              {renderSection("Content requirements", brief.contentRequirements)}
              {renderSection("Design direction", brief.designDirection)}
              {renderSection("Mobile requirements", brief.mobileRequirements)}
              {renderSection(
                "SEO / discoverability needs",
                brief.seoDiscoverabilityNeeds,
              )}
              {renderSection("Integrations", brief.integrations)}
              {renderSection(
                "Technical considerations",
                brief.technicalConsiderations,
              )}
              {renderSection("Assets still needed", brief.assetsStillNeeded)}
              {renderSection("Project priorities", brief.projectPriorities)}
              {renderSection("Next steps", brief.nextSteps)}
            </div>

            <div
              style={{ display: "grid", gap: "0.75rem", marginTop: "1.5rem" }}
            >
              <Button onClick={handleCopy} type="button" className="w-full">
                <Copy size={14} />{" "}
                {copyState === "copied"
                  ? "Copied"
                  : copyState === "error"
                    ? "Copy failed"
                    : "Copy brief"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.print()}
                type="button"
                className="w-full"
              >
                <Printer size={14} /> Print / save as PDF
              </Button>
              <ButtonLink
                to="/start-your-project"
                search={{
                  interest: "website",
                  context: `Website requirement generator: ${form.businessName || "New project"} | ${form.primaryGoal || "Website brief generated"}`,
                }}
                className="w-full"
                variant="default"
              >
                Continue to enquiry <ArrowRight size={14} />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <p className="label text-primary">Why this works</p>
              <h2
                style={{
                  marginTop: "0.5rem",
                  font: "700 clamp(2rem, 5vw, 3.5rem) var(--font-display)",
                }}
              >
                A clear brief before a build keeps decisions honest.
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {[
                {
                  icon: Sparkles,
                  title: "Deterministic",
                  description:
                    "This tool works from the answers you provide and is not trying to invent certainty or AI capability.",
                },
                {
                  icon: Target,
                  title: "Actionable",
                  description:
                    "The brief groups the most important pages, functions, and requirements into a usable framework.",
                },
                {
                  icon: FileText,
                  title: "Transparent",
                  description:
                    "The recommendation logic is visible in the brief and derived from the questionnaire itself.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="panel"
                  style={{ padding: "1.5rem", display: "grid", gap: "0.8rem" }}
                >
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "0.5rem",
                      background:
                        "color-mix(in oklab, var(--primary) 12%, transparent)",
                      color: "var(--primary)",
                    }}
                  >
                    <item.icon size={18} aria-hidden="true" />
                  </div>
                  <strong style={{ font: "700 1rem var(--font-display)" }}>
                    {item.title}
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted-foreground)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
