import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  Search,
  FileText,
  Target,
  Shield,
  CheckCircle2,
  Code,
  Globe,
  Server,
  Database,
  Zap,
} from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { services } from "@/lib/content";

const toolServicePairings = [
  {
    tool: "Project estimator",
    serviceSlugs: [
      "websites-digital-platforms",
      "web-mobile-applications",
      "ai-automation",
    ],
    note: "Frames scope for any digital build before numbers are discussed.",
  },
  {
    tool: "Service finder",
    serviceSlugs: ["business-technology-consulting"],
    note: "Points to the capability that fits when the path is unclear.",
  },
  {
    tool: "GST calculator",
    serviceSlugs: ["business-setup-compliance"],
    note: "Pairs with GST-related support for everyday price and tax checks.",
  },
  {
    tool: "Business checklist",
    serviceSlugs: ["business-setup-compliance"],
    note: "Organizes preparation before registration and compliance work.",
  },
] as const;

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

const techStack = [
  { name: "React 19", category: "Frontend", icon: Code },
  { name: "TanStack Start", category: "Full-stack Framework", icon: Globe },
  { name: "TypeScript", category: "Language", icon: Code },
  { name: "Tailwind CSS v4", category: "Styling", icon: Code },
  { name: "Radix UI", category: "Components", icon: Database },
  { name: "TanStack Query", category: "State Management", icon: Server },
  { name: "TanStack Router", category: "Routing", icon: Globe },
  { name: "Nitro / Cloudflare Workers", category: "Deployment", icon: Server },
  { name: "Vite", category: "Build Tool", icon: Zap },
  { name: "Zod", category: "Validation", icon: Shield },
] as const;

const toolTrustSignals = [
  {
    icon: CheckCircle2,
    title: "Zero fabricated outputs",
    desc: "No invented prices, guarantees, or regulatory claims in any tool.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent assumptions",
    desc: "Every calculator shows its logic. You provide the rates and parameters.",
  },
  {
    icon: CheckCircle2,
    title: "Privacy by design",
    desc: "No data leaves your browser. Tools run entirely client-side.",
  },
  {
    icon: CheckCircle2,
    title: "Editable at every step",
    desc: "Change any input instantly. Nothing locks you into a path.",
  },
  {
    icon: CheckCircle2,
    title: "Context carries forward",
    desc: "Start an enquiry with only the relevant tool data pre-filled.",
  },
  {
    icon: CheckCircle2,
    title: "Built on open standards",
    desc: "Client-side JavaScript, Web APIs, and open-source libraries only.",
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
      <header
        className="page-intro env-section"
        data-env-phase="0"
        style={{ "--env-glow-x": "20%", "--env-glow-y": "10%" }}
      >
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

      <section
        className="content-band env-section"
        data-env-phase="1"
        style={{ "--env-glow-x": "30%", "--env-glow-y": "30%" }}
      >
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
                className="tool-card glass-medium luminous-edge"
                style={{
                  borderRadius: "0.75rem",
                  padding: "2rem",
                  display: "grid",
                  gap: "1rem",
                }}
              >
                <div
                  className="tool-card-icon glass-medium"
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "0.5rem",
                    background:
                      "color-mix(in oklab, var(--color-brand-primary) 15%, transparent)",
                    color: "var(--color-brand-primary)",
                  }}
                >
                  <tool.icon size={28} />
                </div>
                <div
                  className="tool-card-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="label text-primary">Tool 0{i + 1}</span>
                  <span
                    className="tool-category glass-light"
                    style={{
                      borderRadius: "9999px",
                      padding: "0.2rem 0.6rem",
                      font: "500 0.6rem var(--font-mono)",
                      textTransform: "uppercase",
                    }}
                  >
                    {tool.category}
                  </span>
                </div>
                <h3 style={{ font: "700 1.4rem var(--font-display)" }}>
                  {tool.title}
                </h3>
                <p
                  style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}
                >
                  {tool.description}
                </p>
                <div
                  className="tool-features"
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                >
                  {tool.features.map((f) => (
                    <span
                      key={f}
                      className="feature-tag glass-light"
                      style={{
                        borderRadius: "0.25rem",
                        padding: "0.25rem 0.5rem",
                        font: "500 0.65rem var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div
                  className="tool-card-footer"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "0.5rem",
                  }}
                >
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    style={{
                      color: "var(--color-brand-primary)",
                      opacity: 0.6,
                      transition: "opacity 0.2s, transform 0.2s",
                    }}
                  />
                </div>
              </Link>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="2"
        style={{ "--env-glow-x": "40%", "--env-glow-y": "40%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="From tool to service"
            title="Every tool sits next to a capability."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="outcome-list"
          >
            {toolServicePairings.map((pairing) => (
              <div
                key={pairing.tool}
                className="assembly-panel assembly-connector"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <strong>{pairing.tool}</strong>
                  <span style={{ color: "var(--muted-foreground)" }}>
                    {pairing.note}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {pairing.serviceSlugs.map((slug) => {
                    const svc = services.find((s) => s.slug === slug);
                    if (!svc) return null;
                    return (
                      <Link
                        key={slug}
                        to="/services/$slug"
                        params={{ slug }}
                        className="label text-primary"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        {svc.title} <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section bg-secondary"
        data-env-phase="3"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
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
            {[
              {
                strong: "You provide the assumptions",
                p: "Rates, scope, timing — you choose. We calculate.",
              },
              {
                strong: "Everything stays editable",
                p: "Change any input. The result updates instantly.",
              },
              {
                strong: "Context carries forward",
                p: "Start an enquiry with only the relevant tool data.",
              },
              {
                strong: "No fabricated outputs",
                p: "No invented prices, guarantees, or regulatory claims.",
              },
            ].map((item, i) => (
              <div
                key={item.strong}
                className="principle-card glass-light luminous-edge"
                style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
              >
                <strong>{item.strong}</strong>
                <p
                  style={{
                    marginTop: "0.5rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {item.p}
                </p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section bg-ink text-ink-foreground"
        data-env-phase="5"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="Technology credibility"
            title="Tools built on open, auditable standards."
          />
          <ScrollReveal
            variant="fadeInUp"
            delay={0}
            className="tech-disclaimer"
          >
            <p style={{ color: "var(--ink-muted)", maxWidth: "60ch" }}>
              GSTPIXEL tools run entirely in your browser using standard Web
              APIs. No server-side processing, no data collection, no vendor
              lock-in.
            </p>
          </ScrollReveal>
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="tech-stack-grid"
          >
            {techStack.map((tech, i) => (
              <div
                key={tech.name}
                className="tech-card glass-medium luminous-edge"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.25rem",
                  textAlign: "center",
                }}
              >
                <div
                  className="tech-icon"
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "3rem",
                    height: "3rem",
                    margin: "0 auto 0.75rem",
                    borderRadius: "0.5rem",
                    background:
                      "color-mix(in oklab, var(--color-brand-primary) 15%, transparent)",
                    color: "var(--color-brand-primary)",
                  }}
                >
                  <tech.icon size={20} />
                </div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>
                  {tech.name}
                </strong>
                <span
                  className="tech-category"
                  style={{
                    display: "block",
                    marginTop: "0.25rem",
                    font: "500 0.65rem var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--ink-muted)",
                  }}
                >
                  {tech.category}
                </span>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="6"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="Why trust these tools"
            title="Built on openness, not opacity."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="trust-signals"
          >
            {toolTrustSignals.map((signal, i) => (
              <div
                key={signal.title}
                className="trust-card glass-light luminous-edge"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <div
                  className="trust-icon"
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.5rem",
                    background:
                      "color-mix(in oklab, var(--color-brand-trust) 15%, transparent)",
                    color: "var(--color-brand-trust)",
                    flexShrink: 0,
                  }}
                >
                  <signal.icon size={20} />
                </div>
                <div>
                  <strong>{signal.title}</strong>
                  <p
                    style={{
                      marginTop: "0.25rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {signal.desc}
                  </p>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <StartBand title="Start with a tool. End with a clear path." />
    </>
  );
}
