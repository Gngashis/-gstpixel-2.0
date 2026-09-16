import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  PageIntro,
  ScrollReveal,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  ArrowRight,
  Target,
  Globe,
  Zap,
  Briefcase,
  FileCheck2,
  TrendingUp,
  Users,
  Check,
} from "lucide-react";

const outcomes = [
  {
    id: "digital-presence",
    title: "Build a website or ecommerce presence",
    paths: "Website development, ecommerce/platforms, growth support",
    reason:
      "A public-facing presence or selling experience is the clearest first step.",
    icon: Globe,
    category: "Digital presence",
  },
  {
    id: "product-app",
    title: "Build a web or mobile application",
    paths: "Web applications, mobile applications, AI integrations",
    reason:
      "A product workflow needs a defined user experience and maintainable application foundation.",
    icon: Zap,
    category: "Product",
  },
  {
    id: "operations",
    title: "Digitize or automate a process",
    paths: "Workflow automation, process digitization, AI integrations",
    reason:
      "The opportunity is in reducing repeated work and making handoffs visible.",
    icon: Target,
    category: "Operations",
  },
  {
    id: "business-start",
    title: "Start or formalise a business",
    paths:
      "Business registration, GST-related services, FSSAI-related services",
    reason:
      "Setup and operating questions should be mapped before optional digital complexity.",
    icon: Briefcase,
    category: "Business setup",
  },
  {
    id: "compliance",
    title: "Understand GST, FSSAI, or compliance",
    paths: "GST-related services, FSSAI-related services, compliance support",
    reason:
      "A structured question list and professional verification path can reduce uncertainty.",
    icon: FileCheck2,
    category: "Compliance",
  },
  {
    id: "strategy",
    title: "Plan digital transformation or technology",
    paths: "Business consultancy, digital transformation, technology strategy",
    reason:
      "A decision framework can connect business priorities to a practical technology roadmap.",
    icon: TrendingUp,
    category: "Strategy",
  },
  {
    id: "growth",
    title: "Improve reach, conversion, or growth",
    paths: "Growth support, websites/digital platforms, business consultancy",
    reason:
      "Growth work is strongest when the audience, offer, and measurement loop are explicit.",
    icon: Users,
    category: "Growth",
  },
] as const;

const handoffNeeds = {
  "digital-presence": "website",
  "product-app": "application",
  operations: "ai",
  "business-start": "registration",
  compliance: "compliance",
  strategy: "consultancy",
  growth: "growth",
} as const;

export const Route = createFileRoute("/tools/service-finder")({
  head: () => ({
    meta: [
      { title: "Service Finder — GSTPIXEL" },
      {
        name: "description",
        content:
          "Find a transparent GSTPIXEL service recommendation based on your desired outcome.",
      },
      { property: "og:title", content: "Service Finder — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Choose an outcome and see transparent service recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [selectedId, setSelectedId] = useState("");
  const result = outcomes.find((o) => o.id === selectedId);

  return (
    <>
      <PageIntro
        label="Tool 02"
        title="Service finder"
        description="Choose the outcome closest to your situation. The recommendation uses simple visible rules — not a claim of AI certainty — and remains editable."
      />

      <section className="content-band">
        <div className="site-container tool-layout">
          <div className="tool-input-panel">
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p
                className="label text-primary"
                style={{ marginBottom: "1rem" }}
              >
                What outcome matches your situation?
              </p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.05}
              variant="fadeInUp"
              className="outcome-choice-stack"
            >
              {outcomes.map((outcome) => (
                <label
                  key={outcome.id}
                  className={`outcome-choice ${selectedId === outcome.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedId === outcome.id}
                    onChange={() => setSelectedId(outcome.id)}
                    className="sr-only"
                  />
                  <div className="choice-content">
                    <div className="choice-header">
                      <div className="choice-icon" aria-hidden="true">
                        <outcome.icon size={20} />
                      </div>
                      <div className="choice-text">
                        <strong>{outcome.title}</strong>
                        <span className="choice-category">
                          {outcome.category}
                        </span>
                      </div>
                    </div>
                    <p className="choice-paths">{outcome.paths}</p>
                  </div>
                  <div className="choice-indicator">
                    {selectedId === outcome.id && (
                      <Check
                        size={20}
                        className="choice-check"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </label>
              ))}
            </StaggeredReveal>
          </div>

          <aside
            className="result-panel"
            aria-live="polite"
            aria-label="Service recommendation"
          >
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <p className="label text-primary">Editable recommendation</p>
            </ScrollReveal>

            {result ? (
              <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
                <h2>{result.title}</h2>
                <p className="recommendation-reason">{result.reason}</p>
                <div className="recommendation-paths">
                  <span className="label text-primary">Relevant paths</span>
                  <p>{result.paths}</p>
                </div>
                <p className="disclaimer">
                  Why this appears: {result.reason} You can change your choice
                  before starting an enquiry.
                </p>
                <ScrollReveal variant="scaleIn" delay={0.2}>
                  <ButtonLink
                    to="/start-your-project"
                    className="w-full"
                    search={{
                      interest: handoffNeeds[result.id],
                      context: `Service finder: ${result.paths}`,
                    }}
                  >
                    Use this recommendation <ArrowRight size={16} />
                  </ButtonLink>
                </ScrollReveal>
              </StaggeredReveal>
            ) : (
              <StaggeredReveal baseDelay={0.1} variant="fadeInUp">
                <h2 className="empty-recommendation">
                  Choose an outcome above
                </h2>
                <p className="empty-recommendation-text">
                  The recommendation will appear here with relevant service
                  paths and the reasoning behind the match.
                </p>
              </StaggeredReveal>
            )}
          </aside>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Transparent logic"
            title="Visible rules. No black box."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="logic-steps"
          >
            <div className="logic-step">
              <span className="logic-step-number">01</span>
              <div>
                <strong>Seven outcome categories</strong>
                <p>
                  Each maps to specific GSTPIXEL service families based on what
                  typically comes first.
                </p>
              </div>
            </div>
            <div className="logic-step">
              <span className="logic-step-number">02</span>
              <div>
                <strong>One-to-one mapping</strong>
                <p>
                  No scoring, weighting, or ML. Each outcome has a predefined,
                  inspectable recommendation.
                </p>
              </div>
            </div>
            <div className="logic-step">
              <span className="logic-step-number">03</span>
              <div>
                <strong>Reason always shown</strong>
                <p>
                  The "why" appears alongside the recommendation. You decide if
                  it fits.
                </p>
              </div>
            </div>
            <div className="logic-step">
              <span className="logic-step-number">04</span>
              <div>
                <strong>Editable at any time</strong>
                <p>
                  Change your selection. The recommendation updates instantly.
                  No lock-in.
                </p>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
