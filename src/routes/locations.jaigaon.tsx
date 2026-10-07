import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Globe,
  Code,
  Zap,
  Building2,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { ButtonLink } from "@/components/ui/button";
import { buildCanonical, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { businessFacts } from "@/lib/content";

export const Route = createFileRoute("/locations/jaigaon")({
  head: () => ({
    meta: [
      {
        title: "Website Development in Jaigaon, West Bengal | GSTPIXEL",
      },
      {
        name: "description",
        content:
          "Website development, software and GST services for Jaigaon businesses. Based in Ramgaon, near Anthony School. See projects & get a free quote.",
      },
      {
        property: "og:title",
        content: "Website Development in Jaigaon, West Bengal | GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Websites, apps, automation, and GST/compliance help for Jaigaon businesses — built locally, delivered properly.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/locations/jaigaon"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      {
        rel: "canonical",
        href: buildCanonical("/locations/jaigaon"),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const capabilities = [
    {
      icon: Globe,
      title: "Websites & ecommerce",
      desc: "Business websites, tourism sites, and online storefronts built for local customers who browse on mobile and need fast, trustworthy experiences.",
    },
    {
      icon: Code,
      title: "Web & mobile applications",
      desc: "Booking systems, internal tools, customer-facing apps — built in reviewable stages so you see progress before committing to optional features.",
    },
    {
      icon: Zap,
      title: "AI & automation",
      desc: "Workflow automation for repetitive work — enquiries, documents, follow-ups, reporting — with logic you can inspect and trust.",
    },
    {
      icon: Building2,
      title: "GST & business setup",
      desc: "GST registration, returns, FSSAI-related services, Udyam/MSME, trade licence, and compliance support — all handled from our Jaigaon office.",
    },
  ];

  const localIndustries = [
    "Tourism operators, hotels, and homestays serving Jaigaon–Bhutan traffic",
    "Border-trading businesses needing a clear, current web presence",
    "Retailers and wholesalers moving online alongside physical shops",
    "Restaurants, cafés, and service businesses managing enquiries and hours",
    "Professional practices (CA, legal, consulting) needing credible websites",
    "Educational institutes and training centres expanding digitally",
  ];

  const advantages = [
    "Based right here in Jaigaon, West Bengal, India — walk in, call, or WhatsApp.",
    `Direct lines: ${businessFacts.phone.label} (India) and ${businessFacts.phoneBhutan.label} (Bhutan).`,
    "Same team handles your digital work AND GST/compliance — no handoffs between agencies.",
    "We know the local market: Jaigaon, Hasimara, Alipurduar, Kalchini, and across the border.",
    "Honest scope, reviewable stages, and a maintainable result — no vendor lock-in.",
  ];

  const ledger = [
    {
      label: `Call ${businessFacts.phone.label}`,
      href: businessFacts.phone.href,
      icon: Phone,
      external: false,
    },
    {
      label: `WhatsApp ${businessFacts.phone.label}`,
      href: businessFacts.whatsapp.href,
      icon: MessageCircle,
      external: false,
    },
    {
      label: businessFacts.email.label,
      href: businessFacts.email.href,
      icon: ArrowRight,
      external: false,
    },
    {
      label: `Visit: Ramgaon, Near Anthony School, Jaigaon – 736182, West Bengal, India`,
      href: "https://maps.google.com/?q=Ramgaon%2C%20Near%20Anthony%20School%2C%20Jaigaon%2C%20West%20Bengal%2C%20736182",
      icon: MapPin,
      external: true,
    },
  ];

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          title: "Website development, GST & digital services for Jaigaon",
          family: "Digital Development & Business Services",
          summary:
            "GSTPIXEL builds websites, ecommerce platforms, web and mobile applications, AI automation, and provides GST registration, FSSAI-related services, Udyam/MSME, and business setup assistance for businesses in Jaigaon, Hasimara, Alipurduar, Kalchini, and across North Bengal.",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { path: "/", label: "Home" },
          { path: "/locations/jaigaon", label: "Jaigaon" },
        ])}
      />
      <PageIntro
        label="Our home base — Jaigaon, West Bengal"
        title="Digital services and business compliance for Jaigaon and North Bengal."
        description="GSTPIXEL is based in Jaigaon, minutes from the Bhutan border. We build websites, ecommerce, applications, and AI automation, and provide GST registration, FSSAI, Udyam, trade licence, and business setup assistance — all from one local team."
      />
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Why here</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>
                The commercial hub of the India–Bhutan corridor — businesses
                here need to be findable on both sides of the gate.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="section-copy">
                Jaigaon sits at the main land crossing into Bhutan. Every day,
                thousands cross the gate — tourists, traders, commuters. The
                businesses that grow are the ones visible online before the
                customer even arrives: hotels and homestays, retailers,
                restaurants, travel agents, and professional services.
              </p>
              <p className="section-copy">
                GSTPIXEL is based here — Ramgaon, Near Anthony School. That
                means you get a team you can sit down with, working to the same
                standard we apply to businesses across India and Bhutan.
              </p>
            </ScrollReveal>
          </div>
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="big-list"
          >
            {localIndustries.map((x) => (
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
      </section>

      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="What we do here"
            title="One local team — digital development and compliance together."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="detail-grid"
          >
            {capabilities.map((c, i) => (
              <div
                key={c.title}
                className="assembly-panel"
                style={{ borderRadius: "0.5rem", padding: "1.5rem" }}
              >
                <ScrollReveal variant="scaleIn" delay={i * 0.1}>
                  <div
                    className="family-icon"
                    aria-hidden="true"
                    style={{ marginBottom: "0.75rem" }}
                  >
                    <c.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                    {c.title}
                  </h3>
                  <p className="section-copy">{c.desc}</p>
                </ScrollReveal>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="Why local businesses choose us"
              title="The Jaigaon advantage."
            />
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <ul className="big-list">
                {advantages.map((x) => (
                  <li key={x}>
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                      className="check-icon"
                    />
                    {x}
                  </li>
                ))}
              </ul>
            </StaggeredReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="section-copy" style={{ marginTop: "1.5rem" }}>
                We also serve Hasimara, Alipurduar, Kalchini, and surrounding
                areas — and across the border in Phuentsholing, Gedu, Pasakha,
                Rinchending, and Samtse. For Bhutan businesses, the focus is on
                digital development and automation; Indian regulatory services
                (GST, FSSAI, Udyam) apply to Indian entities only.
              </p>
            </ScrollReveal>
          </div>
          <div className="operation-ledger">
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              {ledger.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="assembly-panel ledger-row"
                  {...(item.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <span>0{i + 1}</span>
                  <strong>{item.label}</strong>
                  <item.icon size={18} />
                </a>
              ))}
            </StaggeredReveal>
          </div>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="Next step"
              title="Start with a conversation, not a form you regret."
            />
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <p className="section-copy">
                Describe the outcome you need — a website that books, a shop
                that sells online, a GST return filed on time, a process that
                stops repeating itself — and we will map the smallest useful
                first step.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink
                  to="/start-your-project"
                  className="luminous-edge"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Start your project <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink
                  to="/services/websites-digital-platforms"
                  variant="secondary"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Website &amp; ecommerce services
                </ButtonLink>
                <ButtonLink
                  to="/services/business-setup-compliance"
                  variant="secondary"
                  style={{ borderRadius: "0.5rem" }}
                >
                  GST &amp; compliance help
                </ButtonLink>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="section-copy" style={{ marginTop: "1.5rem" }}>
                Prefer to browse first? See the{" "}
                <Link to="/services">full service map</Link> or{" "}
                <Link to="/contact">all contact details</Link>.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <StartBand title="Based in Jaigaon. Building for businesses everywhere." />
    </>
  );
}
