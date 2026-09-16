import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";
import { solutions, services, getTool } from "@/lib/content";

export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const item = solutions.find((x) => x.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Solution"} — GSTPIXEL` },
      {
        name: "description",
        content: loaderData?.summary ?? "A guided GSTPIXEL solution.",
      },
      {
        property: "og:title",
        content: `${loaderData?.title ?? "Solution"} — GSTPIXEL`,
      },
      {
        property: "og:description",
        content: loaderData?.summary ?? "A guided GSTPIXEL solution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const x = Route.useLoaderData();

  const sequences = [
    "Clarify the outcome and constraints",
    "Separate essential needs from optional additions",
    "Choose the smallest coherent first step",
    "Review and refine the plan",
  ];

  return (
    <>
      <PageIntro
        label="Guided solution"
        title={x.title}
        description={x.summary}
      />

      <section className="content-band">
        <div className="site-container detail-grid">
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Useful sequence</p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.1}
              variant="fadeInUp"
              className="sequence-steps"
            >
              {sequences.map((step, i) => (
                <div key={step} className="sequence-step">
                  <div className="sequence-step-marker">
                    <span>{i + 1}</span>
                  </div>
                  <div className="sequence-step-content">
                    <strong>{step}</strong>
                  </div>
                </div>
              ))}
            </StaggeredReveal>
          </div>
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Connected capabilities</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <div className="outcome-list" style={{ marginTop: "0.5rem" }}>
                {x.services.map((title) => {
                  const svc = services.find((s) => s.title === title);
                  if (!svc) return <h2 key={title}>{title}</h2>;
                  return (
                    <Link
                      key={svc.slug}
                      to="/services/$slug"
                      params={{ slug: svc.slug }}
                      className="related-service-card"
                    >
                      <div>
                        <strong>{svc.title}</strong>
                        <p>{svc.summary}</p>
                      </div>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p>
                These are transparent starting recommendations, not an automated
                expert judgement. You can edit the context before sending an
                enquiry.
              </p>
            </ScrollReveal>
            {x.relatedTools.length > 0 && (
              <ScrollReveal variant="fadeInUp" delay={0.25}>
                <p className="label text-primary" style={{ marginTop: "2rem" }}>
                  Useful tools on this path
                </p>
                <div className="outcome-list" style={{ marginTop: "0.5rem" }}>
                  {x.relatedTools.map((slug) => {
                    const tool = getTool(slug);
                    if (!tool) return null;
                    return (
                      <Link
                        key={tool.slug}
                        to={`/tools/${tool.slug}`}
                        className="related-service-card"
                      >
                        <div>
                          <strong>{tool.title}</strong>
                          <p>{tool.blurb}</p>
                        </div>
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}
            <ScrollReveal variant="scaleIn" delay={0.3}>
              <ButtonLink
                to="/start-your-project"
                search={{ interest: x.slug }}
                className="mt-6"
              >
                Continue with this path <ArrowRight size={16} />
              </ButtonLink>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="What this means"
            title="A practical path, not a promise."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="solution-principles"
          >
            <div className="principle-card">
              <CheckCircle2
                size={24}
                aria-hidden="true"
                className="principle-icon"
              />
              <div>
                <strong>No invented pricing</strong>
                <p>Costs emerge from scope, not assumptions.</p>
              </div>
            </div>
            <div className="principle-card">
              <CheckCircle2
                size={24}
                aria-hidden="true"
                className="principle-icon"
              />
              <div>
                <strong>No hidden complexity</strong>
                <p>What you see is what gets discussed.</p>
              </div>
            </div>
            <div className="principle-card">
              <CheckCircle2
                size={24}
                aria-hidden="true"
                className="principle-icon"
              />
              <div>
                <strong>Editable at every step</strong>
                <p>Your context travels with you. Change anything.</p>
              </div>
            </div>
            <div className="principle-card">
              <CheckCircle2
                size={24}
                aria-hidden="true"
                className="principle-icon"
              />
              <div>
                <strong>Verifiable claims only</strong>
                <p>
                  Compliance, timelines, and outcomes — confirmed, not assumed.
                </p>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <StartBand title="Ready to explore this path with GSTPIXEL?" />
    </>
  );
}
