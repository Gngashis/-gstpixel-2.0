import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Search, FileText, Target } from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";

const tools = [
  {
    slug: "project-estimator",
    title: "Project estimator",
    description: "Create a useful scope summary without invented pricing.",
    icon: Target,
    features: ["Scope definition", "Complexity signals", "Editable context"],
    category: "Planning",
  },
  {
    slug: "service-finder",
    title: "Service finder",
    description: "Find transparent recommendations from your desired outcome.",
    icon: Search,
    features: ["Outcome-based", "Visible logic", "Editable choice"],
    category: "Direction",
  },
  {
    slug: "gst-calculator",
    title: "GST calculator",
    description:
      "Calculate inclusive or exclusive GST using a rate you provide.",
    icon: Calculator,
    features: ["Inclusive/exclusive", "Rate you choose", "Educational only"],
    category: "Calculation",
  },
  {
    slug: "business-checklist",
    title: "Business checklist",
    description:
      "Organize general preparation steps without collecting documents.",
    icon: FileText,
    features: ["Step-by-step", "Local progress", "No uploads"],
    category: "Preparation",
  },
] as const;

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Business Tools — GSTPIXEL" },
      {
        name: "description",
        content:
          "Use GSTPIXEL's project estimator, service finder, GST calculator, and business checklist.",
      },
      { property: "og:title", content: "Business Tools — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Four transparent tools for planning digital and business needs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <header className="page-intro">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <p className="label text-primary">Useful tools</p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1>Turn uncertainty into a useful next step.</h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p>
              Each tool explains its assumptions, keeps choices editable, and
              can carry only relevant context into your enquiry.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="content-band">
        <div className="site-container">
          <StaggeredReveal
            baseDelay={0.1}
            variant="scaleIn"
            className="tool-cards"
          >
            {tools.map((tool, i) => (
              <Link
                key={tool.slug}
                to={`/tools/${tool.slug}`}
                className="tool-card"
              >
                <div className="tool-card-icon" aria-hidden="true">
                  <tool.icon size={28} />
                </div>
                <div className="tool-card-header">
                  <span className="label text-primary">Tool 0{i + 1}</span>
                  <span className="tool-category">{tool.category}</span>
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <div className="tool-features">
                  {tool.features.map((f) => (
                    <span key={f} className="feature-tag">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="tool-card-footer">
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Tool principles"
            title="Transparent. Editable. No invented data."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="tool-principles"
          >
            <div className="principle-card">
              <strong>You provide the assumptions</strong>
              <p>Rates, scope, timing — you choose. We calculate.</p>
            </div>
            <div className="principle-card">
              <strong>Everything stays editable</strong>
              <p>Change any input. The result updates instantly.</p>
            </div>
            <div className="principle-card">
              <strong>Context carries forward</strong>
              <p>Start an enquiry with only the relevant tool data.</p>
            </div>
            <div className="principle-card">
              <strong>No fabricated outputs</strong>
              <p>No invented prices, guarantees, or regulatory claims.</p>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <StartBand title="Start with a tool. End with a clear path." />
    </>
  );
}
