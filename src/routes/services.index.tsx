import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Layers3,
  Code,
  Zap,
  Briefcase,
  Target,
} from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { services } from "@/lib/content";
import { ScrollReveal } from "@/components/page";

const familyIcons = {
  "Digital Development": Code,
  "AI and Automation": Zap,
  "Business Services": Briefcase,
  Consulting: Target,
} as const;

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — GSTPIXEL" },
      {
        name: "description",
        content:
          "Explore GSTPIXEL digital development, AI automation, business services, and consultancy.",
      },
      { property: "og:title", content: "Services — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "One connected service system for digital products, automation, operations, and growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const families = Array.from(new Set(services.map((s) => s.family)));

  return (
    <>
      <header className="page-intro">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <p className="label text-primary">Capability map</p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1>One company. Four connected disciplines.</h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p>
              Explore by capability, or{" "}
              <Link to="/solutions">start with the outcome you need</Link> and
              let the relevant services follow. Every path remains connected to
              the same GSTPIXEL Assembly.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="content-band">
        <div className="site-container">
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="service-family-grid"
          >
            {families.map((family, familyIndex) => {
              const familyServices = services.filter(
                (s) => s.family === family,
              );
              const Icon =
                familyIcons[family as keyof typeof familyIcons] || Layers3;
              return (
                <article key={family} className="service-family">
                  <ScrollReveal variant="scaleIn" delay={familyIndex * 0.1}>
                    <div className="family-header">
                      <div className="family-icon" aria-hidden="true">
                        <Icon size={28} />
                      </div>
                      <div className="family-heading">
                        <h2 className="family-title">{family}</h2>
                        <p className="family-count">
                          {familyServices.length}{" "}
                          {familyServices.length === 1 ? "service" : "services"}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                  <div className="family-services">
                    {familyServices.map((s, i) => (
                      <Link
                        key={s.slug}
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="service-card"
                      >
                        <div className="service-card-content">
                          <h3>{s.title}</h3>
                          <p>{s.summary}</p>
                        </div>
                        <div className="service-card-helps">
                          {s.helps.slice(0, 3).map((h) => (
                            <span key={h} className="help-tag">
                              {h}
                            </span>
                          ))}
                          {s.helps.length > 3 && (
                            <span className="help-tag more">
                              +{s.helps.length - 3} more
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          className="service-card-arrow"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="How we work"
            title="The same process. Adapted to each discipline."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="process-overview"
          >
            {[
              {
                step: "01",
                title: "Clarify",
                desc: "Outcome, audience, constraints, and what you already have.",
              },
              {
                step: "02",
                title: "Frame",
                desc: "Structure, scope, and the smallest useful first version.",
              },
              {
                step: "03",
                title: "Design",
                desc: "Interface, interaction, and system architecture together.",
              },
              {
                step: "04",
                title: "Build",
                desc: "Reviewable stages, responsive, accessible, performant.",
              },
              {
                step: "05",
                title: "Launch",
                desc: "Deploy, measure, and hand over with clear guidance.",
              },
              {
                step: "06",
                title: "Support",
                desc: "Iterate, extend, and keep the system current.",
              },
            ].map((item) => (
              <div key={item.step} className="process-step">
                <span className="process-step-number">{item.step}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <StartBand />
    </>
  );
}
