import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Target,
  Zap,
  Globe,
  Briefcase,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { solutions } from "@/lib/content";
import { buildCanonical } from "@/lib/seo";

const solutionIcons = {
  "Start a business": Target,
  "Create a website": Globe,
  "Build an application": Zap,
  "Automate work": Zap,
  "Get GST or compliance help": Briefcase,
  "Decide what to do next": Users,
} as const;

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    meta: [
      { title: "Solutions — GSTPIXEL" },
      {
        name: "description",
        content:
          "Find a practical GSTPIXEL path based on the business outcome you need.",
      },
      { property: "og:title", content: "Solutions — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Start with your outcome and find the connected services and tools.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/solutions") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/solutions") }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <header className="page-intro">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <p className="label text-primary">Outcome routes</p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1>You don&apos;t need to know the service name.</h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p>
              Start with what you want to achieve. Each route explains the
              essential next steps and the capabilities that may help.
            </p>
          </ScrollReveal>
        </div>
      </header>

      <section className="content-band">
        <div className="site-container">
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="solution-cards"
          >
            {solutions.map((x, i) => {
              const Icon =
                solutionIcons[x.title as keyof typeof solutionIcons] || Target;
              return (
                <Link
                  key={x.slug}
                  to="/solutions/$slug"
                  params={{ slug: x.slug }}
                  className="solution-card"
                >
                  <div className="solution-card-icon" aria-hidden="true">
                    <Icon size={28} />
                  </div>
                  <div className="solution-card-content">
                    <span className="label">0{i + 1}</span>
                    <h3>{x.title}</h3>
                    <p>{x.summary}</p>
                  </div>
                  <div className="solution-card-services">
                    {x.services.map((svc) => (
                      <span key={svc} className="service-tag">
                        {svc}
                      </span>
                    ))}
                  </div>
                  <ArrowRight
                    className="solution-card-arrow"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="How it works"
            title="Choose an outcome. Get a transparent path."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="how-it-works"
          >
            <div className="how-step">
              <span className="how-step-number">01</span>
              <div>
                <strong>Select your outcome</strong>
                <p>Pick the result that matches where you want to go.</p>
              </div>
            </div>
            <div className="how-step">
              <span className="how-step-number">02</span>
              <div>
                <strong>See connected capabilities</strong>
                <p>The relevant services and tools appear automatically.</p>
              </div>
            </div>
            <div className="how-step">
              <span className="how-step-number">03</span>
              <div>
                <strong>Start an enquiry with context</strong>
                <p>Your choice pre-fills the project summary — edit freely.</p>
              </div>
            </div>
            <div className="how-step">
              <span className="how-step-number">04</span>
              <div>
                <strong>Discuss with GSTPIXEL</strong>
                <p>A focused conversation, not a generic contact form.</p>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <StartBand title="Start with the outcome. We'll map the path." />
    </>
  );
}
