import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Eye, Code2, Layers3 } from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { conceptProjects } from "@/lib/content";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Concept Lab — GSTPIXEL" },
      {
        name: "description",
        content:
          "Clearly labeled GSTPIXEL design explorations demonstrating product and system thinking.",
      },
      { property: "og:title", content: "Concept Lab — GSTPIXEL" },
      {
        property: "og:description",
        content: "GSTPIXEL concept projects and design explorations.",
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
            <p className="label text-primary">GSTPIXEL Concept Lab</p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1>Exploration without invented proof.</h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p>
              These are self-initiated design explorations, not commissioned
              client projects. They demonstrate approaches, decisions, and
              responsive thinking without fabricated outcomes.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="content-band">
        <div className="site-container">
          <StaggeredReveal
            baseDelay={0.1}
            variant="scaleIn"
            className="concept-showcase"
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

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader label="Why concepts" title="Thinking made visible." />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="concept-philosophy"
          >
            <div className="philosophy-card">
              <div className="philosophy-icon" aria-hidden="true">
                <Eye size={24} />
              </div>
              <strong>Decisions over decoration</strong>
              <p>
                Each concept tests a specific hypothesis about hierarchy, flow,
                or system behavior — not just visual style.
              </p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon" aria-hidden="true">
                <Code2 size={24} />
              </div>
              <strong>Buildable by default</strong>
              <p>
                Explorations respect real constraints: performance,
                accessibility, maintainability, and responsive behavior.
              </p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon" aria-hidden="true">
                <Layers3 size={24} />
              </div>
              <strong>Connected thinking</strong>
              <p>
                Concepts show how product, automation, and operations decisions
                influence each other — the GSTPIXEL way.
              </p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon" aria-hidden="true">
                <Sparkles size={24} />
              </div>
              <strong>Honest labeling</strong>
              <p>
                Every piece is clearly marked as a concept. No client logos,
                fabricated metrics, or implied endorsements.
              </p>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <StartBand title="Have a real challenge for this kind of thinking?" />
    </>
  );
}
