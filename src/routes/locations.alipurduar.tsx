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

export const Route = createFileRoute("/locations/alipurduar")({
  head: () => ({
    meta: [
      {
        title: "Website Development in Alipurduar, West Bengal | GSTPIXEL",
      },
      {
        name: "description",
        content:
          "Website development, software and compliance support for Alipurduar businesses. Done properly, explained simply. Get a free quote from GSTPIXEL.",
      },
      {
        property: "og:title",
        content: "Website Development in Alipurduar, West Bengal | GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Websites, apps, automation, and GST/compliance help for Alipurduar businesses — delivered from nearby Jaigaon.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/locations/alipurduar"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      {
        rel: "canonical",
        href: buildCanonical("/locations/alipurduar"),
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
      desc: "Business websites, hotel and tourism sites, and online storefronts built for Alipurduar customers who search locally and buy on mobile.",
    },
    {
      icon: Code,
      title: "Web & mobile applications",
      desc: "Booking systems, internal tools, customer apps — built in reviewable stages with clear handover so your team can maintain them.",
    },
    {
      icon: Zap,
      title: "AI & automation",
      desc: "Automate repetitive work — enquiry handling, document processing, follow-ups, reporting — with transparent logic you can trust.",
    },
    {
      icon: Building2,
      title: "GST & business setup",
      desc: "GST registration, returns, FSSAI, Udyam/MSME, trade licence, and compliance — handled from our Jaigaon office, minutes away.",
    },
  ];

  const localIndustries = [
    "Tourism businesses serving Buxa Tiger Reserve, Jayanti, Rajabhatkhawa visitors",
    "Tea estate offices and agri-businesses needing digital systems",
    "Retailers and wholesalers in Alipurduar town and New Alipurduar",
    "Hotels, homestays, and restaurants catering to tourists and locals",
    "Educational institutes, coaching centres, and training providers",
    "Professional services (CA, legal, consulting) serving the district",
  ];

  const advantages = [
    "Based in nearby Jaigaon (≈25 km) — we know Alipurduar, visit regularly, and respond fast.",
    `Direct line: ${businessFacts.phone.label} — call or WhatsApp and we will get back to you.`,
    "One team for digital development AND GST/compliance — no juggling multiple vendors.",
    "We understand the local economy: tourism, tea, trade, education, and cross-border commerce.",
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
          title: "Website development, GST & digital services for Alipurduar",
          family: "Digital Development & Business Services",
          summary:
            "GSTPIXEL provides website development, ecommerce platforms, web and mobile applications, AI automation, and GST registration, FSSAI, Udyam/MSME, and business setup assistance for businesses in Alipurduar, West Bengal — delivered from nearby Jaigaon.",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { path: "/", label: "Home" },
          { path: "/locations/alipurduar", label: "Alipurduar" },
        ])}
      />
      <PageIntro
        label="Alipurduar district, West Bengal"
        title="Digital services and business compliance for Alipurduar."
        description="GSTPIXEL serves Alipurduar businesses from our base in nearby Jaigaon — websites, ecommerce, applications, AI automation, and GST/FSSAI/Udyam/business setup assistance, all from one local team."
      />
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Why Alipurduar</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>
                A growing district economy where digital visibility decides who
                gets the tourist, the trader, or the local customer.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="section-copy">
                Alipurduar district — covering Alipurduar town, New Alipurduar,
                Falakata, Kumargram, and the Buxa hills — runs on tourism, tea,
                timber, and cross-border trade. Visitors search &quot;hotels
                near Buxa&quot;, &quot;restaurants Alipurduar&quot;, &quot;taxi
                Jayanti&quot; on mobile before they arrive. Traders and
                professionals search for CA, legal, and GST services locally.
                The businesses that capture that intent are the ones with a
                credible, maintained web presence.
              </p>
              <p className="section-copy">
                Justdial lists 250+ web designers in Alipurduar. Most are
                directory listings, not maintained partners. GSTPIXEL is
                different: we are based 25 km away in Jaigaon, we visit, we
                answer the phone, and we handle both your digital development
                and your GST/compliance — one relationship, one point of
                contact.
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
              label="Why Alipurduar businesses choose us"
              title="Nearby, accountable, and complete."
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
                We also serve Falakata, Kumargram, the Buxa hills area, and
                nearby Kalchini, Hasimara, and across the border in
                Phuentsholing and Bhutan. For Indian businesses, we cover GST,
                FSSAI, Udyam, trade licence, and registration. For Bhutan
                businesses, the focus is digital development and automation.
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
                Describe the outcome — a website that brings Buxa tourists
                directly, an online store for tea products, a GST return filed
                on time, a process that stops repeating — and we will map the
                smallest useful first step.
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

      <StartBand title="Nearby in Jaigaon. Serving Alipurduar properly." />
    </>
  );
}
