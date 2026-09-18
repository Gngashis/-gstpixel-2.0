import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Globe,
  Shield,
  CheckCircle2,
  MapPin as MapPinIcon,
} from "lucide-react";
import {
  PageIntro,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";
import { buildCanonical, localBusinessJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { businessFacts } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GSTPIXEL — Jaigaon, West Bengal" },
      {
        name: "description",
        content:
          "Contact GSTPIXEL in Jaigaon, West Bengal by phone, WhatsApp, or email, or start a guided project enquiry.",
      },
      {
        property: "og:title",
        content: "Contact GSTPIXEL — Jaigaon, West Bengal",
      },
      {
        property: "og:description",
        content:
          "Reach GSTPIXEL in Jaigaon, West Bengal by phone, WhatsApp, or email, or start a guided project enquiry.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/contact") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/contact") }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <JsonLd
        data={localBusinessJsonLd({
          address: businessFacts.address,
          phoneHref: businessFacts.phone.href,
          emailHref: businessFacts.email.href,
          gstin: businessFacts.gstin,
          founder: businessFacts.founder,
        })}
      />
      <ContactContent />
    </>
  );
}

function ContactContent() {
  type ContactMethod = {
    icon: typeof Phone;
    label: string;
    value: string;
    /** Omitted for values that are not actionable links (address, GSTIN). */
    href?: string;
    alt?: string;
    external?: boolean;
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: Phone,
      label: "Phone (India)",
      value: businessFacts.phone.label,
      href: businessFacts.phone.href,
      alt: businessFacts.phoneAlt.label,
    },
    {
      icon: Phone,
      label: "Phone (Bhutan)",
      value: businessFacts.phoneBhutan.label,
      href: businessFacts.phoneBhutan.href,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: businessFacts.phone.label,
      href: businessFacts.whatsapp.href,
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: businessFacts.email.label,
      href: businessFacts.email.href,
    },
    {
      icon: MapPinIcon,
      label: "Address",
      value: businessFacts.address,
    },
    { icon: Building2, label: "GSTIN", value: businessFacts.gstin },
  ];

  const localTrustSignals = [
    {
      icon: MapPin,
      title: "Based in Jaigaon, West Bengal",
      desc: `Operating from ${businessFacts.address}. Meetings are arranged in advance by phone, WhatsApp, or email.`,
    },
    {
      icon: Shield,
      title: "GST-registered business",
      desc: `GSTIN ${businessFacts.gstin}, published here so you can verify the registration directly with the tax authority.`,
    },
    {
      icon: CheckCircle2,
      title: "Direct access to the decision maker",
      desc: `Speak directly with ${businessFacts.founder}, ${businessFacts.founderTitle}. No gatekeepers or call centres.`,
    },
    {
      icon: Globe,
      title: "India & Bhutan numbers",
      desc: `Direct lines for both countries — ${businessFacts.phone.label} and ${businessFacts.phoneBhutan.label} — plus WhatsApp for written queries.`,
    },
  ];

  const whatToExpect = [
    {
      num: "01",
      title: "You start with context",
      desc: "Use the guided enquiry or a tool. Your situation pre-fills the conversation.",
    },
    {
      num: "02",
      title: "We respond with clarity",
      desc: "No generic brochures. A specific response to your stated needs and constraints.",
    },
    {
      num: "03",
      title: "Next steps are explicit",
      desc: "Scope, timeline, cost factors, and decision points — discussed transparently.",
    },
    {
      num: "04",
      title: "You decide the pace",
      desc: "No pressure, no fabricated urgency. Move forward when it makes sense for you.",
    },
  ];

  return (
    <>
      <PageIntro
        label="Contact"
        title={businessFacts.tagline}
        description="Reach GSTPIXEL directly, or use the guided enquiry to build a clear project summary first."
      />

      <section
        className="content-band env-section"
        data-env-phase="0"
        style={{ "--env-glow-x": "20%", "--env-glow-y": "20%" }}
      >
        <div className="site-container contact-grid">
          <div
            className="contact-guided glass-medium luminous-edge"
            style={{ borderRadius: "0.75rem", padding: "2.5rem" }}
          >
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Guided route</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>Build a clear project summary.</h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p>
                The enquiry adapts to websites, applications, automation, GST,
                FSSAI, registration, compliance, consultancy, or help choosing.
                Your answers stay editable and travel with you as context.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="scaleIn" delay={0.3}>
              <ButtonLink
                to="/start-your-project"
                className="mt-6 w-full sm:w-auto luminous-edge"
                style={{ borderRadius: "0.5rem" }}
              >
                Start your project <ArrowRight size={16} />
              </ButtonLink>
            </ScrollReveal>
          </div>

          <div
            className="contact-direct glass-medium luminous-edge"
            style={{ borderRadius: "0.75rem", padding: "2.5rem" }}
          >
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Direct contact</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>{businessFacts.name}</h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="contact-representative">
                {businessFacts.founder}, {businessFacts.founderTitle}
              </p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.05}
              variant="fadeInUp"
              className="contact-methods"
            >
              {contactMethods.map((method) => {
                const cardStyle = {
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                } as const;
                const cardClass = "contact-method glass-light luminous-edge";
                const cardBody = (
                  <>
                    <div
                      className="method-icon glass-medium"
                      aria-hidden="true"
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "0.5rem",
                        background:
                          "color-mix(in oklab, var(--color-brand-primary) 15%, transparent)",
                        color: "var(--color-brand-primary)",
                      }}
                    >
                      <method.icon size={20} />
                    </div>
                    <div
                      className="method-content"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                      }}
                    >
                      <span
                        className="method-label"
                        style={{
                          font: "500 0.65rem var(--font-mono)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {method.label}
                      </span>
                      <span
                        className="method-value"
                        style={{ font: "600 1rem var(--font-body)" }}
                      >
                        {method.value}
                      </span>
                      {method.alt && (
                        <span
                          className="method-alt"
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {method.alt}
                        </span>
                      )}
                    </div>
                  </>
                );

                return method.href ? (
                  <a
                    key={method.label}
                    href={method.href}
                    className={cardClass}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noreferrer" : undefined}
                    style={cardStyle}
                  >
                    {cardBody}
                  </a>
                ) : (
                  <div
                    key={method.label}
                    className={cardClass}
                    style={cardStyle}
                  >
                    {cardBody}
                  </div>
                );
              })}
            </StaggeredReveal>
            <ScrollReveal variant="fadeInUp" delay={0.5}>
              <p
                className="contact-disclaimer"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted-foreground)",
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                GSTPIXEL is an independent business and is not a government
                portal. Compliance-related support does not constitute legal
                advice; confirm official requirements with the relevant
                authorities.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        className="content-band env-section bg-secondary"
        data-env-phase="3"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="Local trust & accessibility"
            title="Rooted in Jaigaon. Accessible everywhere."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="trust-signals"
          >
            {localTrustSignals.map((signal, i) => (
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

      <section
        className="content-band env-section"
        data-env-phase="5"
        style={{ "--env-glow-x": "50%", "--env-glow-y": "50%" }}
      >
        <div className="site-container">
          <SectionHeader
            label="What to expect"
            title="A focused conversation, not a generic form."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="expectation-steps"
          >
            {whatToExpect.map((step) => (
              <div
                key={step.num}
                className="expectation-step glass-light luminous-edge"
                style={{
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  display: "flex",
                  gap: "1.5rem",
                }}
              >
                <span
                  className="expectation-number"
                  style={{
                    font: "700 2rem var(--font-display)",
                    color: "var(--color-brand-primary)",
                    opacity: 0.2,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p
                    style={{
                      marginTop: "0.3rem",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
