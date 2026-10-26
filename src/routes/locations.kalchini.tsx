import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Globe,
  Code,
  Zap,
  Building2,
  MessageCircle,
  Phone,
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

export const Route = createFileRoute("/locations/kalchini")({
  head: () => ({
    meta: [
      {
        title: "Website Development in Kalchini, West Bengal | GSTPIXEL",
      },
      {
        name: "description",
        content:
          "Website development and business software for Kalchini businesses, from a nearby Jaigaon studio. Clear pricing conversations. Get a free quote today.",
      },
      {
        property: "og:title",
        content: "Website Development in Kalchini, West Bengal | GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Websites, apps, automation, and GST/compliance help for Kalchini businesses — delivered from nearby Jaigaon.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/locations/kalchini"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      {
        rel: "canonical",
        href: buildCanonical("/locations/kalchini"),
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
      desc: "Business websites, eco-tourism and homestay sites, and online storefronts for Kalchini's tea, tourism, and forest-produce economy.",
    },
    {
      icon: Code,
      title: "Web & mobile applications",
      desc: "Booking systems for homestays, inventory tools for tea/forest produce, customer apps — built in reviewable stages.",
    },
    {
      icon: Zap,
      title: "AI & automation",
      desc: "Automate repetitive work — enquiry handling, document processing, follow-ups, reporting — with transparent logic.",
    },
    {
      icon: Building2,
      title: "GST & business setup",
      desc: "GST registration, returns, FSSAI, Udyam/MSME, trade licence, and compliance — handled from our Jaigaon office, nearby.",
    },
  ];

  const localIndustries = [
    "Tea estates and small tea growers needing digital presence and compliance",
    "Eco-tourism operators, homestays, and resorts near Jaldapara, Chilapata, Buxa",
    "Forest produce collectors and traders (timber, medicinal plants, honey)",
    "Agricultural and horticultural businesses (areca nut, betel leaf, vegetables)",
    "Hotels, restaurants, and highway services on NH-31C",
    "Educational institutes and skill centres serving the Dooars region",
  ];

  const advantages = [
    "Based in nearby Jaigaon (≈30 km via NH-31C) — we know the Dooars, visit regularly, and respond fast.",
    `Direct line: ${businessFacts.phone.label} — call or WhatsApp and we will get back to you.`,
    "One team for digital development AND GST/compliance — no juggling multiple vendors.",
    "We understand the local economy: tea, tourism, forest produce, agriculture, and cross-border trade.",
    "Same standard as metro agencies, with local accountability and no vendor lock-in.",
  ];

  const ledger = [
    {
      label: `Call ${businessFacts.phone.label}`,
      href: businessFacts.phone.href,
      icon: Phone,
    },
    {
      label: `WhatsApp ${businessFacts.phone.label}`,
      href: businessFacts.whatsapp.href,
      icon: MessageCircle,
    },
    {
      label: businessFacts.email.label,
      href: businessFacts.email.href,
      icon: ArrowRight,
    },
  ];

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          title: "Website development, GST & digital services for Kalchini",
          family: "Digital Development & Business Services",
          summary:
            "GSTPIXEL provides website development, ecommerce platforms, web and mobile applications, AI automation, and GST registration, FSSAI, Udyam/MSME, and business setup assistance for businesses in Kalchini, West Bengal — delivered from nearby Jaigaon.",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { path: "/", label: "Home" },
          { path: "/locations/kalchini", label: "Kalchini" },
        ])}
      />
      <PageIntro
        label="Kalchini, West Bengal — heart of the Dooars"
        title="Digital services and business compliance for Kalchini."
        description="GSTPIXEL serves Kalchini businesses from our base in nearby Jaigaon — websites, ecommerce, applications, AI automation, and GST/FSSAI/Udyam/business setup assistance, all from one local team."
      />
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Why Kalchini</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>
                Tea, tourism, and forest produce in the Dooars — businesses here
                need digital reach that matches their product quality.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="section-copy">
                Kalchini sits in the Dooars — the floodplains of the Eastern
                Himalayas — where tea estates, eco-tourism, forest produce, and
                agriculture drive the economy. Visitors search &quot;homestay
                near Jaldapara&quot;, &quot;tea estate stay Dooars&quot;,
                &quot;resort Chilapata&quot; on mobile before booking. Tea
                growers and forest-produce traders need compliant, traceable
                digital systems. The businesses that capture this demand are the
                ones with a credible, maintained web presence and proper
                compliance.
              </p>
              <p className="section-copy">
                GSTPIXEL is based 30 km away in Jaigaon. We know the Dooars, we
                visit, we answer the phone. One team handles your website, your
                apps, your automation, AND your GST/FSSAI/Udyam/compliance. No
                vendor juggling, no handoffs.
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
            title="Digital development and compliance — one local team."
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
              label="Why Kalchini businesses choose us"
              title="In the Dooars. On your side."
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
                We also serve the wider Dooars — Alipurduar, Falakata,
                Kumargram, Madarihat, Hasimara, Jaigaon — and across the border
                in Phuentsholing, Gedu, Pasakha, and Bhutan. For Indian
                businesses, we cover GST, FSSAI, Udyam, trade licence, and
                registration. For Bhutan businesses, the focus is digital
                development and automation.
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
                Describe the outcome — a website that brings eco-tourists
                directly to your homestay, an online store for your tea or
                forest produce, a GST return filed on time, a process that stops
                repeating — and we will map the smallest useful first step.
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
                  Website &amp; ecommerce
                </ButtonLink>
                <ButtonLink
                  to="/services/business-setup-compliance"
                  variant="secondary"
                  style={{ borderRadius: "0.5rem" }}
                >
                  GST &amp; compliance
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

      <StartBand title="30 km away in Jaigaon. In the Dooars, on your side." />
    </>
  );
}
