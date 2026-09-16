import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/content";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const item = services.find((x) => x.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Service"} — GSTPIXEL` },
      {
        name: "description",
        content: loaderData?.summary ?? "GSTPIXEL service details.",
      },
      {
        property: "og:title",
        content: `${loaderData?.title ?? "Service"} — GSTPIXEL`,
      },
      {
        property: "og:description",
        content: loaderData?.summary ?? "GSTPIXEL service details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const s = Route.useLoaderData();
  const related = services.filter(
    (x) => x.family === s.family && x.slug !== s.slug,
  );

  return (
    <>
      <PageIntro label={s.family} title={s.title} description={s.summary} />

      <section className="content-band">
        <div className="site-container detail-grid">
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Who it is for</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>{s.whoFor}</h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="label text-primary" style={{ marginTop: "2rem" }}>
                Common needs we see
              </p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.08}
              variant="fadeInUp"
              className="big-list"
            >
              {s.needs.map((x) => (
                <li key={x}>
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="check-icon"
                  />
                  {x}
                </li>
              ))}
            </StaggeredReveal>
          </div>
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">What GSTPIXEL can help with</p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.08}
              variant="fadeInUp"
              className="big-list"
            >
              {s.helps.map((x) => (
                <li key={x}>
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="check-icon"
                  />
                  {x}
                </li>
              ))}
            </StaggeredReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="label text-primary" style={{ marginTop: "2rem" }}>
                A sensible process
              </p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.08}
              variant="fadeInUp"
              className="process-steps"
            >
              {s.process.map((x, i) => (
                <div key={x} className="process-step">
                  <span className="process-step-number">0{i + 1}</span>
                  <div className="process-step-content">
                    <strong>{x}</strong>
                  </div>
                </div>
              ))}
            </StaggeredReveal>
          </div>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div className="service-cta-panel">
              <div className="cta-content">
                <p className="label text-primary">Start here</p>
                <h2 className="section-title">
                  Bring your requirement — the enquiry adapts to it.
                </h2>
                <p
                  style={{ maxWidth: "52ch", color: "var(--muted-foreground)" }}
                >
                  Your answers stay editable, and the context of this service
                  travels with you into the project summary.
                </p>
              </div>
              <div className="cta-actions">
                <Button asChild>
                  <Link to="/start-your-project" search={{ interest: s.slug }}>
                    Start your project <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/tools/service-finder">
                    Not sure? Use the service finder
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {related.length > 0 && (
            <StaggeredReveal baseDelay={0.1} variant="fadeInUp">
              <p className="label text-primary" style={{ marginTop: "4rem" }}>
                Related capabilities in {s.family}
              </p>
              <div className="outcome-list">
                {related.map((x) => (
                  <Link
                    key={x.slug}
                    to="/services/$slug"
                    params={{ slug: x.slug }}
                    className="related-service-card"
                  >
                    <div>
                      <strong>{x.title}</strong>
                      <p>{x.summary}</p>
                    </div>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </StaggeredReveal>
          )}
        </div>
      </section>

      <StartBand title="Need this capability connected to a wider plan?" />
    </>
  );
}
