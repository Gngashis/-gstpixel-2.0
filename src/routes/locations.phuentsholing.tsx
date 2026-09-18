import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Globe,
  Code,
  Zap,
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

export const Route = createFileRoute("/locations/phuentsholing")({
  head: () => ({
    meta: [
      {
        title: "Website Development in Phuentsholing, Bhutan | GSTPIXEL",
      },
      {
        name: "description",
        content:
          "GSTPIXEL builds websites, ecommerce platforms, web and mobile applications, and AI automation for businesses in Phuentsholing, Bhutan — delivered cross-border from Jaigaon with direct phone and WhatsApp support.",
      },
      {
        property: "og:title",
        content: "Website Development in Phuentsholing, Bhutan | GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Websites, ecommerce, applications, and AI automation for Phuentsholing businesses — delivered from Jaigaon, minutes from the border gate.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/locations/phuentsholing"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      {
        rel: "canonical",
        href: buildCanonical("/locations/phuentsholing"),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const capabilities = [
    {
      icon: Globe,
      title: "Websites and ecommerce",
      desc: "Business websites, tourism and hospitality sites, and online storefronts that load fast on Bhutanese mobile networks and stay easy to maintain.",
    },
    {
      icon: Code,
      title: "Web and mobile applications",
      desc: "Booking systems, internal tools, and customer-facing apps built in reviewable stages — useful first versions before optional features.",
    },
    {
      icon: Zap,
      title: "AI and automation",
      desc: "Workflow automation for repetitive work — enquiries, documents, follow-ups, and reporting — with logic you can inspect and trust.",
    },
  ];

  const localIndustries = [
    "Tourism operators, hotels, and homestays moving bookings online",
    "Border-trading businesses that need a clear, current web presence",
    "Retailers exploring online sales alongside a physical shop",
    "Restaurants and service businesses managing enquiries and hours",
    "Professional practices that need credible, maintainable websites",
  ];

  const crossBorderPoints = [
    "Based in Jaigaon, minutes from the Phuentsholing border gate — meetings can be arranged in advance by phone, WhatsApp, or email.",
    `Direct lines for both countries: ${businessFacts.phone.label} (India) and ${businessFacts.phoneBhutan.label} (Bhutan).`,
    "Remote collaboration works the same way: calls and messages in plain language, with drafts and previews shared online.",
    "Same standard of work as our Indian projects — honest scope, reviewable stages, and a maintainable result.",
  ];

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          title: "Website development and digital services for Phuentsholing",
          family: "Digital Development",
          summary:
            "Websites, ecommerce platforms, web and mobile applications, and AI automation for businesses in Phuentsholing, Bhutan — delivered cross-border from Jaigaon.",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { path: "/", label: "Home" },
          { path: "/locations/phuentsholing", label: "Phuentsholing" },
        ])}
      />
      <PageIntro
        label="Phuentsholing & the border gateway"
        title="Digital services for businesses in Phuentsholing, Bhutan."
        description="GSTPIXEL is based in Jaigaon, India — minutes from the Phuentsholing border gate. We build websites, ecommerce platforms, applications, and AI automation for businesses on both sides of the border."
      />
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <ScrollReveal variant="fadeInUp" delay={0}>
              <p className="label text-primary">Why here</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2>
                A gateway economy that runs on trust and visibility — online as
                much as at the gate.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="section-copy">
                Phuentsholing is Bhutan&apos;s main commercial gateway, and the
                businesses that grow here — tourism operators, hotels and
                homestays, retailers, restaurants, trading firms, and
                professional practices — depend on being findable and credible
                online. Yet many still run on word of mouth, social media pages,
                or websites that no one maintains.
              </p>
              <p className="section-copy">
                GSTPIXEL sits on the other side of the gate in Jaigaon. That
                means you get a team you can actually sit down with, working to
                the same standard we apply to businesses across India.
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
            title="Services that genuinely cross the border."
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
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <div
              className="assembly-panel"
              style={{
                borderRadius: "0.5rem",
                padding: "1.5rem",
                marginTop: "2rem",
              }}
            >
              <b>One honest boundary.</b> GSTPIXEL&apos;s registration and
              compliance assistance — GST, FSSAI-related services, and Indian
              business registration — applies to <em>Indian</em> businesses and
              is not offered as Bhutanese regulatory service. For Bhutanese
              businesses, the focus stays on digital development, automation,
              and consulting.
            </div>
          </ScrollReveal>
        </div>
      </section>
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <SectionHeader
              label="How it works"
              title="Cross-border, without friction."
            />
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <ul className="big-list">
                {crossBorderPoints.map((x) => (
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
                Beyond Phuentsholing, we work with businesses in nearby Gedu,
                Pasakha, Rinchending, and Samtse, and remotely across Bhutan —
                including Thimphu — where travel is not required.
              </p>
            </ScrollReveal>
          </div>
          <div className="operation-ledger">
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              {[
                {
                  label: `Call (Bhutan) ${businessFacts.phoneBhutan.label}`,
                  href: businessFacts.phoneBhutan.href,
                },
                {
                  label: `WhatsApp ${businessFacts.phone.label}`,
                  href: businessFacts.whatsapp.href,
                },
                {
                  label: businessFacts.email.label,
                  href: businessFacts.email.href,
                },
              ].map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="assembly-panel ledger-row"
                >
                  <span>0{i + 1}</span>
                  <strong>{item.label}</strong>
                  {i === 0 ? (
                    <Phone size={18} />
                  ) : i === 1 ? (
                    <MessageCircle size={18} />
                  ) : (
                    <ArrowRight size={18} />
                  )}
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
                that sells online, a process that stops repeating itself — and
                we will map the smallest useful first step.
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
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="section-copy" style={{ marginTop: "1.5rem" }}>
                Prefer to browse first? See the{" "}
                <Link to="/services">full service map</Link>, the free{" "}
                <Link to="/tools">business tools</Link>, or{" "}
                <Link to="/contact">all contact details</Link>.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <StartBand title="Bring the ambition. The border is not a barrier." />
    </>
  );
}
