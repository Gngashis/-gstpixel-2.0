import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
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
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GSTPIXEL" },
      {
        name: "description",
        content:
          "Contact GSTPIXEL by phone, WhatsApp, or email, or start a guided project enquiry.",
      },
      { property: "og:title", content: "Contact GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Reach GSTPIXEL by phone, WhatsApp, or email, or start a guided project enquiry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone (India)",
      value: "+91 90465 20548",
      href: "tel:+919046520548",
      alt: "+91 81160 76725",
    },
    {
      icon: Phone,
      label: "Phone (Bhutan)",
      value: "+975 77260538",
      href: "tel:+97577260538",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+91 90465 20548",
      href: "https://wa.me/919046520548",
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: "support@gstpixel.com",
      href: "mailto:support@gstpixel.com",
    },
    {
      icon: MapPinIcon,
      label: "Address",
      value: "Ramgaon, Near Anthony School, Jaigaon – 736182",
    },
    { icon: Building2, label: "GSTIN", value: "19ESPPG2569P1ZP" },
  ];

  const localTrustSignals = [
    {
      icon: MapPin,
      title: "Based in Jaigaon, West Bengal",
      desc: "Physical office at Ramgaon, Near Anthony School, Jaigaon – 736182. Visit us or schedule a meeting.",
    },
    {
      icon: Shield,
      title: "Registered Indian Business",
      desc: "GSTIN: 19ESPPG2569P1ZP. Fully compliant with Indian tax and regulatory requirements.",
    },
    {
      icon: CheckCircle2,
      title: "Direct Access to Decision Maker",
      desc: "Speak directly with Ashis Gurung, Founder & Business Consultant. No gatekeepers or call centres.",
    },
    {
      icon: Clock,
      title: "India & Bhutan Timezone Coverage",
      desc: "Available during IST/BTT business hours. WhatsApp for quick queries anytime.",
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
        title="Start right. Stay compliant. Grow online."
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
              <Button asChild className="mt-6 w-full sm:w-auto luminous-edge">
                <Link
                  to="/start-your-project"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Start your project <ArrowRight size={16} />
                </Link>
              </Button>
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
              <h2>GSTPIXEL</h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="contact-representative">
                Ashis Gurung, Founder & Business Consultant
              </p>
            </ScrollReveal>
            <StaggeredReveal
              baseDelay={0.05}
              variant="fadeInUp"
              className="contact-methods"
            >
              {contactMethods.map((method, i) => (
                <a
                  key={method.label}
                  href={method.href}
                  className="contact-method glass-light luminous-edge"
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noreferrer" : undefined}
                  style={{
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
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
                </a>
              ))}
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
