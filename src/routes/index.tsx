import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Braces,
  CircuitBoard,
  FileCheck2,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  ScrollReveal,
  StaggeredReveal,
  StartBand,
  SectionHeader,
} from "@/components/page";
import {
  conceptProjects,
  solutions,
  toolCatalog,
  businessFacts,
} from "@/lib/content";
import { AssemblyVisual } from "@/components/assembly-visual";
import {
  buildCanonical,
  websiteJsonLd,
  organizationJsonLd,
  localBusinessJsonLd,
} from "@/lib/seo";
import { useMagnetic } from "@/lib/pointer-light";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "GSTPIXEL — Websites, AI Automation & GST Services in Jaigaon",
      },
      {
        name: "description",
        content:
          "GST registration and compliance assistance, FSSAI-related services, website and app development, and AI automation — from Jaigaon, West Bengal, for businesses across India, Phuentsholing, and Bhutan.",
      },
      {
        property: "og:title",
        content: "GSTPIXEL — Websites, AI Automation & GST Services in Jaigaon",
      },
      {
        property: "og:description",
        content:
          "GST registration and compliance assistance, FSSAI-related services, website and app development, and AI automation — from Jaigaon, West Bengal, for businesses across India, Phuentsholing, and Bhutan.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/") }],
  }),
  component: Home,
});

function Home() {
  const heroCta = useMagnetic<HTMLSpanElement>();

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd
        data={organizationJsonLd({
          founder: businessFacts.founder,
          founderTitle: businessFacts.founderTitle,
          tagline: businessFacts.tagline,
          phone: businessFacts.phone.href.replace("tel:", ""),
          email: businessFacts.email.href.replace("mailto:", ""),
        })}
      />
      <JsonLd
        data={localBusinessJsonLd({
          address: businessFacts.address,
          phoneHref: businessFacts.phone.href,
          emailHref: businessFacts.email.href,
          gstin: businessFacts.gstin,
          founder: businessFacts.founder,
        })}
      />
      <section
        className="home-hero drafting-grid env-section"
        data-env-phase="0"
        style={{ "--env-glow-x": "20%", "--env-glow-y": "10%" }}
      >
        <div className="site-container grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary hero-kicker">
                <span className="signal-dot" /> The GSTPIXEL Assembly
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h1>
                One system for how a business is built, automated, and run.
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="hero-copy">
                Business consulting and services, digital development, and
                automation—connected into one coherent path, whether you are
                starting a business, keeping it compliant, or taking it online.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.25}>
              <p className="label text-primary hero-tagline">
                {businessFacts.tagline}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="scaleIn" delay={0.3}>
              <div className="mt-9 flex flex-wrap gap-3">
                <span ref={heroCta.ref} className="magnetic">
                  <ButtonLink to="/start-your-project">
                    Start your project <ArrowRight size={16} />
                  </ButtonLink>
                </span>
                <ButtonLink to="/services" variant="secondary">
                  Explore services
                </ButtonLink>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.4}>
              <div className="hero-meta">
                <span>IDEA → GROWTH</span>
                <span>GSTPIXEL / 02.0</span>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal variant="scaleIn" delay={0.15}>
              <AssemblyVisual />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="0"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="01 / Find your path"
            title="Start with the outcome."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="outcome-list outcome-list-cards"
          >
            {solutions.map((x, i) => (
              <Link
                key={x.slug}
                to="/solutions/$slug"
                params={{ slug: x.slug }}
                className="assembly-panel"
              >
                {/* The node badge carries the stage number, so the card does
                    not need a second overlapping counter. */}
                <span className="assembly-node" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="outcome-card-body">
                  <strong>{x.title}</strong>
                  <p>{x.summary}</p>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="1"
        style={{ "--env-glow-x": "30%", "--env-glow-y": "30%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="02 / Build"
            title="Digital products become working systems."
          />
          <div className="editorial-split">
            <div>
              <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
                <p className="section-copy">
                  Websites, applications, ecommerce, and business platforms are
                  designed as connected parts—not isolated deliverables.
                </p>
                <ButtonLink
                  to="/services/$slug"
                  params={{ slug: "web-mobile-applications" }}
                  variant="secondary"
                  className="mt-6 luminous-edge"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Explore digital development
                </ButtonLink>
              </StaggeredReveal>
            </div>
            <div className="interface-spec">
              <StaggeredReveal baseDelay={0.08} variant="scaleIn">
                <div
                  className="glass-below-fold luminous-edge"
                  style={{
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    minHeight: "8rem",
                  }}
                >
                  <Braces />
                  <span>Interface</span>
                </div>
                <div
                  className="glass-below-fold luminous-edge"
                  style={{
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    minHeight: "8rem",
                  }}
                >
                  <CircuitBoard />
                  <span>Logic</span>
                </div>
                <div
                  className="glass-below-fold luminous-edge"
                  style={{
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    minHeight: "8rem",
                  }}
                >
                  <Gauge />
                  <span>Performance</span>
                </div>
              </StaggeredReveal>
            </div>
          </div>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="2"
        style={{ "--env-glow-x": "70%", "--env-glow-y": "40%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="03 / Automate"
            title="Cause, decision, action — visible."
          />
          <StaggeredReveal
            baseDelay={0.1}
            variant="fadeInUp"
            className="workflow"
          >
            <div
              className="assembly-panel"
              style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
            >
              <span>Input</span>
              <strong>Business signal</strong>
            </div>
            <i>→</i>
            <div
              className="assembly-panel"
              style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
            >
              <span>Rule</span>
              <strong>Clear decision</strong>
            </div>
            <i>→</i>
            <div
              className="assembly-panel"
              style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
            >
              <span>Output</span>
              <strong>Useful action</strong>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="3"
        style={{ "--env-glow-x": "40%", "--env-glow-y": "60%" }}
      >
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="04 / Operate"
              title="Business essentials, made easier to navigate."
            />
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <p className="section-copy">
                GST, FSSAI, registration, compliance, and business setup support
                stay connected to the wider system. Requirements are explained
                carefully, without promises or assumptions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink
                  to="/services/$slug"
                  params={{ slug: "business-setup-compliance" }}
                  variant="secondary"
                  className="luminous-edge"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Explore business services
                </ButtonLink>
                <ButtonLink
                  to="/solutions/$slug"
                  params={{ slug: "gst-compliance-help" }}
                  variant="secondary"
                  className="luminous-edge"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Get GST or compliance help
                </ButtonLink>
              </div>
            </StaggeredReveal>
          </div>
          <div className="operation-ledger">
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              {[
                "GST-related services",
                "FSSAI-related services",
                "Business registration",
                "Compliance support",
              ].map((x, i) => (
                <Link
                  key={x}
                  to="/services/$slug"
                  params={{ slug: "business-setup-compliance" }}
                  className="assembly-panel ledger-row"
                >
                  <span>0{i + 1}</span>
                  <strong>{x}</strong>
                  <FileCheck2 size={18} />
                </Link>
              ))}
            </StaggeredReveal>
          </div>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="4"
        style={{ "--env-glow-x": "60%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <ScrollReveal variant="fadeInUp" delay={0}>
                <p className="label text-primary">05 / Concept Lab</p>
              </ScrollReveal>
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <h2 className="section-title">
                  Designed to show the thinking.
                </h2>
              </ScrollReveal>
            </div>
            <ScrollReveal variant="scaleIn" delay={0.2}>
              <ButtonLink
                to="/work"
                variant="secondary"
                className="luminous-edge"
                style={{ borderRadius: "0.5rem" }}
              >
                View all concepts
              </ButtonLink>
            </ScrollReveal>
          </div>
          <StaggeredReveal
            baseDelay={0.1}
            variant="scaleIn"
            className="concept-row"
          >
            {conceptProjects.map((x, i) => (
              <Link
                key={x.slug}
                to="/work/$slug"
                params={{ slug: x.slug }}
                className="concept-card"
              >
                <div className={`concept-card-visual concept-${i + 1}`}>
                  <div className="concept-card-overlay">
                    <span className="label text-primary">View exploration</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div className="concept-card-content">
                  <span className="label text-primary">Concept project</span>
                  <h3>{x.title}</h3>
                  <p className="concept-meta">{x.industry}</p>
                  <p className="concept-summary">{x.summary}</p>
                  <div className="concept-focus-areas">
                    <span className="focus-tag">Interface</span>
                    <span className="focus-tag">Interaction</span>
                    <span className="focus-tag">Responsive</span>
                  </div>
                </div>
              </Link>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="5"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "70%" }}
      >
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeader
              label="06 / Useful tools"
              title="Move from uncertainty to a useful next step."
            />
            <ScrollReveal variant="scaleIn" delay={0.15}>
              <ButtonLink
                to="/tools"
                variant="secondary"
                className="luminous-edge"
                style={{ borderRadius: "0.5rem" }}
              >
                All tools
              </ButtonLink>
            </ScrollReveal>
          </div>
          <StaggeredReveal
            baseDelay={0.1}
            variant="fadeInUp"
            className="tool-rail"
          >
            {toolCatalog.map((tool) => (
              <Link
                key={tool.slug}
                to={`/tools/${tool.slug}`}
                className="assembly-panel ledger-row"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  display: "grid",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <strong>{tool.title}</strong>
                  <ArrowRight aria-hidden="true" />
                </span>
                <small style={{ color: "var(--muted-foreground)" }}>
                  {tool.blurb}
                </small>
              </Link>
            ))}
          </StaggeredReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <p
              className="section-copy"
              style={{ marginTop: "1.5rem", maxWidth: "70ch" }}
            >
              Each tool is transparent about its assumptions and can carry its
              context into your project enquiry. Not sure where to begin? The{" "}
              <Link to="/tools/service-finder">service finder</Link> points to
              the capability that fits, and the{" "}
              <Link
                to="/services/$slug"
                params={{ slug: "business-setup-compliance" }}
              >
                business checklist
              </Link>{" "}
              pairs with registration and compliance work.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="5"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="07 / Why GSTPIXEL"
              title="Sophisticated inside. Simple outside."
            />
          </div>
          <StaggeredReveal
            baseDelay={0.1}
            variant="fadeInUp"
            className="principles"
          >
            <div
              className="assembly-panel"
              style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
            >
              <b>One integrated view.</b> Product, automation, operations, and
              strategy stay connected.
            </div>
            <div
              className="assembly-panel"
              style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
            >
              <b>Clear before clever.</b> Every interaction must help someone
              understand or act.
            </div>
            <div
              className="assembly-panel"
              style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
            >
              <b>Evidence over theatre.</b> No fabricated proof, hidden
              complexity, or empty claims.
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="5"
        style={{ "--env-glow-x": "45%", "--env-glow-y": "55%" }}
      >
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="08 / Where we work"
              title="Rooted in Jaigaon. Relevant across India."
            />
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <p className="section-copy">
                GSTPIXEL is based at {businessFacts.address}. Nearby businesses
                get a team they can actually sit down with; businesses across
                India get the same direct access by phone, WhatsApp, or email —
                no call centres, no gatekeepers.
              </p>
              <p className="section-copy">
                For businesses in Jaigaon, Alipurduar, Kalchini, Hasimara, and
                across North Bengal, that means practical help with GST and
                FSSAI-related services, business registration, website and
                ecommerce development, and AI automation — all from one team, in
                plain language.
              </p>
              <p className="section-copy">
                Across the gate, we build websites, ecommerce, applications, and
                automation for businesses in Phuentsholing and the wider
                India–Bhutan border economy — with direct lines for both
                countries. See our{" "}
                <Link to="/locations/phuentsholing">
                  Phuentsholing services
                </Link>
                .
              </p>
              <p className="section-copy">
                Explore the <Link to="/services">full range of services</Link>,
                try the free <Link to="/tools">business tools</Link>, or{" "}
                <Link to="/start-your-project">start your project</Link> with a
                short enquiry.
              </p>
              <ButtonLink
                to="/contact"
                variant="secondary"
                className="mt-6 luminous-edge"
                style={{ borderRadius: "0.5rem" }}
              >
                Contact details <ArrowRight size={16} />
              </ButtonLink>
            </StaggeredReveal>
          </div>
          <div className="operation-ledger">
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              {[
                {
                  label: businessFacts.phone.label,
                  href: businessFacts.phone.href,
                },
                {
                  label: businessFacts.whatsapp.label,
                  href: businessFacts.whatsapp.href,
                },
                {
                  label: businessFacts.email.label,
                  href: businessFacts.email.href,
                },
                { label: `GSTIN ${businessFacts.gstin}` },
              ].map((item, i) =>
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="assembly-panel ledger-row"
                  >
                    <span>0{i + 1}</span>
                    <strong>{item.label}</strong>
                    <ArrowRight size={18} />
                  </a>
                ) : (
                  <div key={item.label} className="assembly-panel ledger-row">
                    <span>0{i + 1}</span>
                    <strong>{item.label}</strong>
                    <FileCheck2 size={18} />
                  </div>
                ),
              )}
            </StaggeredReveal>
          </div>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="6"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="09 / Process"
            title="From first conversation to a working outcome."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="process-line"
          >
            {["Discover", "Frame", "Design", "Build", "Launch", "Support"].map(
              (x, i) => (
                <li
                  key={x}
                  className="assembly-panel ledger-row"
                  style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
                >
                  <span>0{i + 1}</span>
                  <strong>{x}</strong>
                </li>
              ),
            )}
          </StaggeredReveal>
        </div>
      </section>

      <section
        className="content-band env-section"
        data-env-phase="6"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "80%" }}
      >
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="10 / Resources"
              title="Useful guidance, when it is ready."
            />
          </div>
          <ScrollReveal
            variant="fadeInUp"
            delay={0.2}
            className="empty-state assembly-panel"
            style={{ borderRadius: "0.5rem", padding: "2rem" }}
          >
            <p>No approved resources are published yet.</p>
            <span>
              Future articles will cover business setup, GST and compliance,
              websites and apps, AI automation, and digital growth. The planned{" "}
              <Link to="/insights">insights library</Link> shows what is in
              development, and the <Link to="/tools">tools</Link> are available
              today.
            </span>
          </ScrollReveal>
        </div>
      </section>

      <StartBand title="Bring the ambition. We'll assemble the path." />
    </>
  );
}
