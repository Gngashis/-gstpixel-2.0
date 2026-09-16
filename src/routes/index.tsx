import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Braces,
  CircuitBoard,
  FileCheck2,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ScrollReveal,
  StaggeredReveal,
  StartBand,
  SectionHeader,
} from "@/components/page";
import { conceptProjects, solutions } from "@/lib/content";
import { AssemblyVisual } from "@/components/assembly-visual";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GSTPIXEL — Digital Systems for Business" },
      {
        name: "description",
        content:
          "GSTPIXEL connects digital products, AI automation, business services, and consultancy into one working system.",
      },
      {
        property: "og:title",
        content: "GSTPIXEL — Digital Systems for Business",
      },
      {
        property: "og:description",
        content:
          "Digital products, automation, business services, and consultancy—assembled as one system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="home-hero drafting-grid">
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
                Technology, digital development, business services, and
                consultancy—connected into a coherent path from idea to growth.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="scaleIn" delay={0.3}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/start-your-project">
                    Start your project <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/services">Explore services</Link>
                </Button>
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

      <section className="content-band bg-background">
        <div className="site-container">
          <SectionHeader
            label="01 / Find your path"
            title="Start with the outcome."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="outcome-list"
          >
            {solutions.map((x, i) => (
              <Link
                key={x.slug}
                to="/solutions/$slug"
                params={{ slug: x.slug }}
              >
                <span className="label">0{i + 1}</span>
                <strong>{x.title}</strong>
                <p>{x.summary}</p>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-ink text-ink-foreground">
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
                <Button asChild variant="secondary" className="mt-6">
                  <Link
                    to="/services/$slug"
                    params={{ slug: "web-mobile-applications" }}
                  >
                    Explore digital development
                  </Link>
                </Button>
              </StaggeredReveal>
            </div>
            <div className="interface-spec">
              <StaggeredReveal baseDelay={0.08} variant="scaleIn">
                <div>
                  <Braces />
                  <span>Interface</span>
                </div>
                <div>
                  <CircuitBoard />
                  <span>Logic</span>
                </div>
                <div>
                  <Gauge />
                  <span>Performance</span>
                </div>
              </StaggeredReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="content-band">
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
            <div>
              <span>Input</span>
              <strong>Business signal</strong>
            </div>
            <i>→</i>
            <div>
              <span>Rule</span>
              <strong>Clear decision</strong>
            </div>
            <i>→</i>
            <div>
              <span>Output</span>
              <strong>Useful action</strong>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
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
              <Button asChild variant="secondary" className="mt-6">
                <Link
                  to="/services/$slug"
                  params={{ slug: "business-setup-compliance" }}
                >
                  Explore business services
                </Link>
              </Button>
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
                <div key={x}>
                  <span>0{i + 1}</span>
                  <strong>{x}</strong>
                  <FileCheck2 size={18} />
                </div>
              ))}
            </StaggeredReveal>
          </div>
        </div>
      </section>

      <section className="content-band">
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
              <Button asChild variant="secondary">
                <Link to="/work">View all concepts</Link>
              </Button>
            </ScrollReveal>
          </div>
          <StaggeredReveal
            baseDelay={0.1}
            variant="scaleIn"
            className="concept-row"
          >
            {conceptProjects.map((x, i) => (
              <Link key={x.slug} to="/work/$slug" params={{ slug: x.slug }}>
                <div className={`concept-art concept-${i + 1}`}>
                  <Sparkles />
                </div>
                <span className="label text-primary">Concept project</span>
                <h3>{x.title}</h3>
                <p>
                  {x.industry} · {x.summary}
                </p>
              </Link>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <SectionHeader
            label="06 / Useful tools"
            title="Move from uncertainty to a useful next step."
          />
          <StaggeredReveal
            baseDelay={0.1}
            variant="fadeInUp"
            className="tool-rail"
          >
            <Link to="/tools/project-estimator">
              Project estimator <ArrowRight />
            </Link>
            <Link to="/tools/service-finder">
              Service finder <ArrowRight />
            </Link>
            <Link to="/tools/gst-calculator">
              GST calculator <ArrowRight />
            </Link>
            <Link to="/tools/business-checklist">
              Business checklist <ArrowRight />
            </Link>
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band">
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
            <p>
              <b>One integrated view.</b> Product, automation, operations, and
              strategy stay connected.
            </p>
            <p>
              <b>Clear before clever.</b> Every interaction must help someone
              understand or act.
            </p>
            <p>
              <b>Evidence over theatre.</b> No fabricated proof, hidden
              complexity, or empty claims.
            </p>
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="08 / Process"
            title="From first conversation to a working outcome."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="process-line"
          >
            {["Discover", "Frame", "Design", "Build", "Launch", "Support"].map(
              (x, i) => (
                <li key={x}>
                  <span>0{i + 1}</span>
                  <strong>{x}</strong>
                </li>
              ),
            )}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="09 / Resources"
              title="Useful guidance, when it is ready."
            />
          </div>
          <ScrollReveal variant="fadeInUp" delay={0.2} className="empty-state">
            <p>No approved resources are published yet.</p>
            <span>
              Future articles will cover business setup, GST and compliance,
              websites and apps, AI automation, and digital growth.
            </span>
          </ScrollReveal>
        </div>
      </section>

      <StartBand title="Bring the ambition. We'll assemble the path." />
    </>
  );
}
