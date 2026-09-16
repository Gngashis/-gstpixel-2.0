import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Code2,
  Layers3,
  Sparkles,
} from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";
import { conceptProjects } from "@/lib/content";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const item = conceptProjects.find((x) => x.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Concept"} — GSTPIXEL Concept Lab` },
      {
        name: "description",
        content: loaderData?.summary ?? "GSTPIXEL concept exploration.",
      },
      {
        property: "og:title",
        content: `${loaderData?.title ?? "Concept"} — GSTPIXEL Concept Lab`,
      },
      {
        property: "og:description",
        content:
          "Clearly labeled design exploration; not commissioned client work.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const x = Route.useLoaderData();

  const focusAreas = [
    {
      icon: Eye,
      label: "Information hierarchy",
      desc: "Testing how users scan, decide, and act",
    },
    {
      icon: Code2,
      label: "Interaction logic",
      desc: "Visible cause-and-effect in every flow",
    },
    {
      icon: Layers3,
      label: "System connections",
      desc: "How product, automation, and ops relate",
    },
    {
      icon: Sparkles,
      label: "Responsive behavior",
      desc: "Deliberate compositions at every breakpoint",
    },
  ];

  return (
    <>
      <PageIntro
        label={`Concept project / ${x.industry}`}
        title={x.title}
        description={x.summary}
      />

      <section className="content-band">
        <div className="site-container case-study">
          <div className="concept-hero-visual concept-1">
            <div className="concept-badge">Design exploration</div>
          </div>
          <div className="detail-grid">
            <div>
              <ScrollReveal variant="fadeInUp" delay={0}>
                <p className="label text-primary">Brief</p>
              </ScrollReveal>
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <h2>Explore a focused digital experience.</h2>
              </ScrollReveal>
              <ScrollReveal variant="fadeInUp" delay={0.2}>
                <p>
                  This self-initiated concept tests how information hierarchy,
                  decisive actions, and a distinctive visual environment can
                  work together.
                </p>
              </ScrollReveal>
              <ScrollReveal variant="fadeInUp" delay={0.3}>
                <p
                  style={{
                    marginTop: "1.5rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {x.summary}
                </p>
              </ScrollReveal>
            </div>
            <div>
              <ScrollReveal variant="fadeInUp" delay={0}>
                <p className="label text-primary">Scope and limits</p>
              </ScrollReveal>
              <StaggeredReveal
                baseDelay={0.08}
                variant="fadeInUp"
                className="big-list"
              >
                <li>Interface and interaction direction</li>
                <li>Responsive composition</li>
                <li>No real client or commissioned outcome</li>
                <li>No performance or commercial claims</li>
              </StaggeredReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader label="Focus areas" title="What this concept tests." />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="focus-grid"
          >
            {focusAreas.map((area, i) => (
              <div key={area.label} className="focus-card">
                <div className="focus-icon" aria-hidden="true">
                  <area.icon size={24} />
                </div>
                <strong>{area.label}</strong>
                <p>{area.desc}</p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div className="concept-navigation">
              <ButtonLink to="/work" variant="secondary">
                <ArrowLeft size={16} /> Back to Concept Lab
              </ButtonLink>
              <ButtonLink
                to="/start-your-project"
                search={{
                  interest: x.slug,
                  context: `Concept Lab: ${x.title}`,
                }}
              >
                Discuss a real project <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <StartBand title="Have a real challenge for this kind of thinking?" />
    </>
  );
}
