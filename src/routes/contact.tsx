import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
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
      icon: MapPin,
      label: "Address",
      value: "Ramgaon, Near Anthony School, Jaigaon – 736182",
    },
    { icon: Building2, label: "GSTIN", value: "19ESPPG2569P1ZP" },
  ];

  return (
    <>
      <PageIntro
        label="Contact"
        title="Start right. Stay compliant. Grow online."
        description="Reach GSTPIXEL directly, or use the guided enquiry to build a clear project summary first."
      />

      <section className="content-band">
        <div className="site-container contact-grid">
          <div className="contact-guided">
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
              <Button asChild className="mt-6 w-full sm:w-auto">
                <Link to="/start-your-project">
                  Start your project <ArrowRight size={16} />
                </Link>
              </Button>
            </ScrollReveal>
          </div>

          <div className="contact-direct">
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Direct contact</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>GSTPIXEL</h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="contact-representative">
                Ashis Gurung, Business Consultant
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
                  className="contact-method"
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noreferrer" : undefined}
                >
                  <div className="method-icon" aria-hidden="true">
                    <method.icon size={20} />
                  </div>
                  <div className="method-content">
                    <span className="method-label">{method.label}</span>
                    <span className="method-value">{method.value}</span>
                    {method.alt && (
                      <span className="method-alt">{method.alt}</span>
                    )}
                  </div>
                </a>
              ))}
            </StaggeredReveal>
            <ScrollReveal variant="fadeInUp" delay={0.5}>
              <p className="contact-disclaimer">
                GSTPIXEL is an independent business and is not a government
                portal. Compliance-related support does not constitute legal
                advice; confirm official requirements with the relevant
                authorities.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="content-band bg-secondary">
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
            <div className="expectation-step">
              <span className="expectation-number">01</span>
              <div>
                <strong>You start with context</strong>
                <p>
                  Use the guided enquiry or a tool. Your situation pre-fills the
                  conversation.
                </p>
              </div>
            </div>
            <div className="expectation-step">
              <span className="expectation-number">02</span>
              <div>
                <strong>We respond with clarity</strong>
                <p>
                  No generic brochures. A specific response to your stated needs
                  and constraints.
                </p>
              </div>
            </div>
            <div className="expectation-step">
              <span className="expectation-number">03</span>
              <div>
                <strong>Next steps are explicit</strong>
                <p>
                  Scope, timeline, cost factors, and decision points — discussed
                  transparently.
                </p>
              </div>
            </div>
            <div className="expectation-step">
              <span className="expectation-number">04</span>
              <div>
                <strong>You decide the pace</strong>
                <p>
                  No pressure, no fabricated urgency. Move forward when it makes
                  sense for you.
                </p>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
