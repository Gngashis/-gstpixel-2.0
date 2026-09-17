import { createFileRoute } from "@tanstack/react-router";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { buildCanonical, organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { businessFacts } from "@/lib/content";
import {
  ArrowRight,
  Target,
  Link2,
  Shield,
  Cpu,
  Users,
  Eye,
  MapPin,
  Mail,
  Building2,
  Globe,
  Code,
  Zap,
  Database,
  Server,
  Award,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GSTPIXEL" },
      {
        name: "description",
        content:
          "GSTPIXEL connects technology, digital development, business services, and consultancy.",
      },
      { property: "og:title", content: "About GSTPIXEL" },
      {
        property: "og:description",
        content: "The principles behind GSTPIXEL's integrated operating model.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/about") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/about") }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          founder: businessFacts.founder,
          founderTitle: businessFacts.founderTitle,
          tagline: businessFacts.tagline,
        })}
      />
      <AboutContent />
    </>
  );
}

function AboutContent() {
  const principles = [
    {
      icon: Eye,
      title: "Understand before building",
      desc: "Start from the business outcome and the people who need to use the result.",
    },
    {
      icon: Link2,
      title: "Connect the layers",
      desc: "Treat design, engineering, automation, operations, and guidance as related decisions.",
    },
    {
      icon: Shield,
      title: "Keep claims honest",
      desc: "Make boundaries, assumptions, and next steps visible. No fabricated proof.",
    },
    {
      icon: Cpu,
      title: "Design for real conditions",
      desc: "Mobile, accessibility, performance, and recovery are part of the work from the start.",
    },
    {
      icon: Target,
      title: "Evidence over theatre",
      desc: "No hidden complexity, empty claims, or invented metrics. What you see is what we discuss.",
    },
    {
      icon: Users,
      title: "Sophisticated inside, simple outside",
      desc: "Complex systems, clear interfaces. The visitor should never feel the complexity.",
    },
  ];

  const modelLayers = [
    {
      layer: "Digital Products",
      desc: "Websites, applications, ecommerce, platforms — built as connected systems.",
    },
    {
      layer: "AI & Automation",
      desc: "Workflows that connect inputs, decisions, and useful outputs visibly.",
    },
    {
      layer: "Business Services",
      desc: "GST, FSSAI, registration, compliance — structured support, not promises.",
    },
    {
      layer: "Consulting",
      desc: "Practical guidance connecting business decisions, technology, and growth.",
    },
  ];

  const techStack = [
    { name: "React 19", category: "Frontend", icon: Code },
    { name: "TanStack Start", category: "Full-stack Framework", icon: Globe },
    { name: "TypeScript", category: "Language", icon: Code },
    { name: "Tailwind CSS v4", category: "Styling", icon: Code },
    { name: "Radix UI", category: "Components", icon: Database },
    { name: "TanStack Query", category: "State Management", icon: Server },
    { name: "TanStack Router", category: "Routing", icon: Globe },
    {
      name: "Nitro / Cloudflare Workers",
      category: "Deployment",
      icon: Server,
    },
    { name: "Vite", category: "Build Tool", icon: Zap },
    { name: "Zod", category: "Validation", icon: Shield },
  ];

  const trustSignals = [
    {
      icon: CheckCircle2,
      title: "Zero fabricated metrics",
      desc: "No invented client stories, testimonials, or performance claims.",
    },
    {
      icon: CheckCircle2,
      title: "Verifiable business identity",
      desc: "GSTIN, postal address, and direct contact details are published — all independently verifiable.",
    },
    {
      icon: CheckCircle2,
      title: "Transparent tool assumptions",
      desc: "Every calculator and estimator shows its logic and limits.",
    },
    {
      icon: CheckCircle2,
      title: "Open source foundation",
      desc: "Built on auditable, widely-used open source technologies.",
    },
    {
      icon: CheckCircle2,
      title: "Privacy by default",
      desc: "No analytics, ad pixels, or social trackers. Web fonts load from Google's CDN — the only third-party request this site makes.",
    },
    {
      icon: CheckCircle2,
      title: "Accessibility first",
      desc: "WCAG 2.2 AA target, semantic HTML, keyboard navigation.",
    },
  ];

  return (
    <>
      <PageIntro
        label="About"
        title="Built around connected business needs."
        description="GSTPIXEL brings digital products, automation, operations, and consultancy into one working model — so decisions remain connected from first idea to growth."
      />

      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <SectionHeader
            label="Operating model"
            title="One assembly. Four connected layers."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="model-layers"
          >
            {modelLayers.map((layer, i) => (
              <div
                key={layer.layer}
                className="model-layer glass-light luminous-edge"
                style={{ borderRadius: "0.75rem", padding: "1.5rem" }}
              >
                <div className="model-layer-number">0{i + 1}</div>
                <div className="model-layer-content">
                  <strong>{layer.layer}</strong>
                  <p>{layer.desc}</p>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="Working philosophy"
            title="Clarity carries the complexity."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="principles-grid"
          >
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="principle-card glass-light luminous-edge"
                style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
              >
                <div className="principle-icon" aria-hidden="true">
                  <p.icon size={24} />
                </div>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Founder & Leadership"
            title={`${businessFacts.founder} — ${businessFacts.founderTitle}`}
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="founder-profile"
          >
            <div
              className="founder-card glass-medium luminous-edge"
              style={{
                borderRadius: "0.75rem",
                padding: "2rem",
                display: "grid",
                gap: "2rem",
                gridTemplateColumns: "auto 1fr",
                alignItems: "start",
              }}
            >
              <div
                className="founder-avatar"
                style={{
                  width: "6rem",
                  height: "6rem",
                  borderRadius: "50%",
                  background: "var(--env-current-gradient)",
                  display: "grid",
                  placeItems: "center",
                  font: "800 2.5rem var(--font-display)",
                  color: "var(--ink-foreground)",
                  boxShadow:
                    "var(--depth-shadow-lg), var(--depth-glow-primary)",
                }}
              >
                AG
              </div>
              <div>
                <div
                  className="founder-title"
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "1rem",
                  }}
                >
                  <strong style={{ font: "700 1.5rem var(--font-display)" }}>
                    {businessFacts.founder}
                  </strong>
                  <span
                    className="glass-light"
                    style={{
                      borderRadius: "9999px",
                      padding: "0.25rem 0.75rem",
                      font: "500 0.7rem var(--font-mono)",
                      textTransform: "uppercase",
                    }}
                  >
                    {businessFacts.founderTitle}
                  </span>
                  <span
                    className="glass-light"
                    style={{
                      borderRadius: "9999px",
                      padding: "0.25rem 0.75rem",
                      font: "500 0.7rem var(--font-mono)",
                      textTransform: "uppercase",
                      color: "var(--color-brand-trust)",
                    }}
                  >
                    Digital Solutions
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    maxWidth: "50ch",
                  }}
                >
                  Building {businessFacts.name} from {businessFacts.location} —
                  assembling digital products, AI automation, business services,
                  and consultancy into one coherent system for businesses across
                  India and beyond.
                </p>
                <div
                  className="founder-contact"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    className="flex items-center gap-0.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    <MapPin size={16} aria-hidden="true" />{" "}
                    {businessFacts.location}
                  </span>
                  <a
                    href={businessFacts.email.href}
                    className="flex items-center gap-0.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Mail size={16} aria-hidden="true" />{" "}
                    {businessFacts.email.label}
                  </a>
                  <a
                    href={businessFacts.whatsapp.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-0.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    <MessageSquare size={16} aria-hidden="true" />{" "}
                    {businessFacts.whatsapp.label}
                  </a>
                </div>
              </div>
            </div>
            <div
              className="founder-rooted glass-light luminous-edge"
              style={{
                borderRadius: "0.75rem",
                padding: "1.5rem",
                marginTop: "1rem",
                border: "1px solid var(--color-brand-trust)",
                background:
                  "color-mix(in oklab, var(--color-brand-trust) 8%, transparent)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: "1.5rem" }}>📍</div>
                <div>
                  <strong style={{ color: "var(--color-brand-trust)" }}>
                    Rooted in Jaigaon. Building for everywhere.
                  </strong>
                  <p
                    style={{
                      marginTop: "0.5rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {businessFacts.name} is based at {businessFacts.address}.
                    Our local presence means genuine accessibility for nearby
                    businesses. Our digital-first approach means we can work
                    with businesses across India, Bhutan, and beyond — with the
                    same rigour and care.
                  </p>
                </div>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <SectionHeader
            label="Technology credibility"
            title="Technologies & platforms we work with."
          />
          <ScrollReveal
            variant="fadeInUp"
            delay={0}
            className="tech-disclaimer"
          >
            <p style={{ color: "var(--ink-muted)", maxWidth: "60ch" }}>
              GSTPIXEL is an independent business. Technology names and logos
              are trademarks of their respective owners. Inclusion here
              indicates working familiarity, not partnership, endorsement, or
              certification.
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

      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="Trust signals"
            title="Why businesses choose GSTPIXEL."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="trust-signals"
          >
            {trustSignals.map((signal, i) => (
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

      <StartBand title="Want to work together? Start a project." />
    </>
  );
}
