import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Church,
  Info,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { PageIntro, StaggeredReveal, ScrollReveal } from "@/components/page";
import { ButtonLink } from "@/components/ui/button";
import { buildCanonical, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { businessFacts } from "@/lib/content";

export const Route = createFileRoute("/free-it-for-churches")({
  head: () => ({
    meta: [
      {
        title: "Free IT Help for Churches & Christian Organisations — GSTPIXEL",
      },
      {
        name: "description",
        content:
          "GSTPIXEL provides free website, application, automation, business-registration, and technology help to churches, pastors, and Christian organisations. Request help directly — no cost, no obligation.",
      },
      {
        property: "og:title",
        content:
          "Free IT Help for Churches & Christian Organisations — GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "GSTPIXEL provides free website, application, automation, business-registration, and technology help to churches, pastors, and Christian organisations. Request help directly — no cost, no obligation.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/free-it-for-churches"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      {
        rel: "canonical",
        href: buildCanonical("/free-it-for-churches"),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const audience = [
    "Churches and congregations",
    "Pastors and Christian leaders",
    "Christian ministries and fellowships",
    "Christian-led businesses and individuals who need technology help",
  ];

  const qualifying = [
    "A first website or a rebuild of an outdated one",
    "Simple web or mobile applications for ministry or administration",
    "Automation of repetitive admin and communication work",
    "Business registration and related compliance support",
    "General technology guidance for the work above",
  ];

  const contactLink = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
  } as const;

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          title:
            "Free technology help for churches and Christian organisations",
          family: "Free technology initiative",
          summary:
            "GSTPIXEL provides free website, application, automation, business-registration, and technology help to churches, pastors, and Christian organisations. Request help directly — no cost, no obligation.",
        })}
      />
      <PageIntro
        label="Free technology initiative"
        title="Free technology help for churches and Christian organisations."
        description="GSTPIXEL builds websites, applications, and automation for businesses. Through this initiative, the same work is available at no cost to churches, pastors, and Christian organisations that need it."
      />
      <section className="content-band">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <h2 className="section-title">Who this is for</h2>
          </ScrollReveal>
          <StaggeredReveal
            baseDelay={0.1}
            variant="fadeInUp"
            className="choice-stack"
          >
            {audience.map((x) => (
              <div
                key={x}
                className="assembly-panel"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.15rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                }}
              >
                <Church size={18} aria-hidden="true" />
                <span>{x}</span>
              </div>
            ))}
          </StaggeredReveal>
          <ScrollReveal variant="fadeInUp" delay={0.15}>
            <p className="section-copy" style={{ marginTop: "1.25rem" }}>
              When you request help, you will be able to select the
              free-initiative option so your enquiry is recognised as part of
              this programme.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <h2 className="section-title">The kind of work that may qualify</h2>
          </ScrollReveal>
          <StaggeredReveal
            baseDelay={0.1}
            variant="fadeInUp"
            className="choice-stack"
          >
            {qualifying.map((x) => (
              <div
                key={x}
                className="assembly-panel"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.15rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                }}
              >
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{x}</span>
              </div>
            ))}
          </StaggeredReveal>
          <ScrollReveal variant="fadeInUp" delay={0.15}>
            <p
              className="section-copy"
              style={{
                marginTop: "1.25rem",
                display: "flex",
                gap: "0.6rem",
                alignItems: "flex-start",
              }}
            >
              <Info
                size={16}
                aria-hidden="true"
                style={{ marginTop: "0.2rem", flexShrink: 0 }}
              />
              <span>
                Requests are assessed individually. Not every request can be
                taken on, and some work may be part-funded rather than fully
                free — you will know where you stand before anything begins.
              </span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <h2 className="section-title">How to ask for help</h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <p className="section-copy">
              Use the same enquiry GSTPIXEL uses for every project. Choose the
              free-initiative option in the first step, describe what you need
              in plain language, and the request reaches the founder directly.
              There is no separate form and nothing to prove in advance.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginTop: "1.5rem",
                alignItems: "center",
              }}
            >
              <ButtonLink
                to="/start-your-project"
                search={{ interest: "free-it-church" }}
              >
                Request free IT help <ArrowRight size={16} />
              </ButtonLink>
              <span
                style={{
                  display: "inline-flex",
                  gap: "1.1rem",
                  flexWrap: "wrap",
                }}
              >
                <a href={businessFacts.whatsapp.href} style={contactLink}>
                  <MessageCircle size={15} aria-hidden="true" /> WhatsApp
                </a>
                <a href={businessFacts.phone.href} style={contactLink}>
                  <Phone size={15} aria-hidden="true" />{" "}
                  {businessFacts.phone.label}
                </a>
                <a href={businessFacts.email.href} style={contactLink}>
                  <Mail size={15} aria-hidden="true" /> Email
                </a>
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="start-band env-section" data-env-phase="5">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <p className="label text-primary">Everyone else</p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2>The usual project path is unchanged.</h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p
              className="section-copy"
              style={{ maxWidth: "52ch", marginTop: "1rem" }}
            >
              GSTPIXEL remains a full commercial studio for businesses
              everywhere. This initiative runs alongside that work — it does not
              replace it.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="scaleIn" delay={0.25}>
            <span style={{ display: "inline-block", marginTop: "1.5rem" }}>
              <ButtonLink to="/start-your-project" variant="secondary">
                Start a commercial project <ArrowRight size={16} />
              </ButtonLink>
            </span>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
