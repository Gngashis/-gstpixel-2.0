import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PageIntro,
  StartBand,
  SectionHeader,
  StaggeredReveal,
  ScrollReveal,
} from "@/components/page";
import {
  FileText,
  Shield,
  Globe,
  Zap,
  TrendingUp,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — GSTPIXEL" },
      {
        name: "description",
        content:
          "GSTPIXEL resources on business setup, compliance, digital products, automation, and growth.",
      },
      { property: "og:title", content: "Insights — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "A forthcoming library of reviewed GSTPIXEL guides and resources.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/insights") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/insights") }],
  }),
  component: Page,
});

function Page() {
  const plannedTopics = [
    {
      icon: Building2,
      category: "Business Setup",
      topics: [
        "Choosing the right legal structure for your business",
        "Registration timelines and documentation checklist",
        "Understanding director and shareholder obligations",
      ],
    },
    {
      icon: Shield,
      category: "GST & Compliance",
      topics: [
        "GST registration thresholds and voluntary registration",
        "Composition scheme eligibility and limitations",
        "Monthly, quarterly, and annual filing calendar",
        "Input tax credit conditions and common errors",
      ],
    },
    {
      icon: Globe,
      category: "Websites & Applications",
      topics: [
        "Planning a business website: structure, content, and goals",
        "Ecommerce platform selection criteria",
        "Web application architecture for maintainability",
        "Accessibility and performance from day one",
      ],
    },
    {
      icon: Zap,
      category: "AI & Automation",
      topics: [
        "Identifying automation opportunities in your workflow",
        "When AI adds value vs when it adds complexity",
        "Building trustworthy automation with human oversight",
      ],
    },
    {
      icon: TrendingUp,
      category: "Digital Growth",
      topics: [
        "Defining measurable growth objectives",
        "Conversion-focused website patterns",
        "Retention and referral loops for digital products",
      ],
    },
    {
      icon: FileText,
      category: "FSSAI & Sector Specific",
      topics: [
        "FSSAI licence categories and application process",
        "Sector-specific registrations: RERA, IEC, drug license",
        "State-level compliance variations",
      ],
    },
  ];

  const topicActions = [
    {
      category: "Business Setup",
      actions: [
        {
          label: "Business setup & compliance",
          to: "/services/business-setup-compliance",
        },
        { label: "Business checklist tool", to: "/tools/business-checklist" },
      ],
    },
    {
      category: "GST & Compliance",
      actions: [
        { label: "GST calculator", to: "/tools/gst-calculator" },
        {
          label: "Get GST or compliance help",
          to: "/solutions/gst-compliance-help",
        },
      ],
    },
    {
      category: "Websites & Applications",
      actions: [
        {
          label: "Websites & digital platforms",
          to: "/services/websites-digital-platforms",
        },
        {
          label: "Web & mobile applications",
          to: "/services/web-mobile-applications",
        },
        { label: "Project estimator", to: "/tools/project-estimator" },
      ],
    },
    {
      category: "AI & Automation",
      actions: [
        { label: "AI & automation service", to: "/services/ai-automation" },
        { label: "Automate work path", to: "/solutions/automate-work" },
      ],
    },
    {
      category: "Digital Growth",
      actions: [
        {
          label: "Business & technology consulting",
          to: "/services/business-technology-consulting",
        },
      ],
    },
    {
      category: "FSSAI & Sector Specific",
      actions: [
        {
          label: "Business setup & compliance",
          to: "/services/business-setup-compliance",
        },
      ],
    },
  ];

  const editorialStandards = [
    {
      icon: CheckCircle2,
      title: "Verified authorship",
      desc: "Every article has a named author with relevant expertise.",
    },
    {
      icon: CheckCircle2,
      title: "Accurate dates",
      desc: "Publication and update dates are always visible.",
    },
    {
      icon: CheckCircle2,
      title: "Cited sources",
      desc: "Official notifications, acts, and circulars are referenced.",
    },
    {
      icon: CheckCircle2,
      title: "Clear boundaries",
      desc: "Guidance vs. advice, general vs. specific — always distinguished.",
    },
    {
      icon: CheckCircle2,
      title: "No fabricated cases",
      desc: "No invented client stories, metrics, or testimonials.",
    },
    {
      icon: CheckCircle2,
      title: "Regular review cycle",
      desc: "Articles are reviewed and updated when regulations change.",
    },
  ];

  return (
    <>
      <PageIntro
        label="Insights"
        title="Useful guidance, carefully reviewed."
        description="Resources will cover business setup, GST and compliance, FSSAI, websites and apps, AI automation, and digital growth."
      />

      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="Planned library"
            title="Topics in development."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="topics-grid"
          >
            {plannedTopics.map((topic, i) => (
              <article key={topic.category} className="topic-card">
                <div className="topic-icon" aria-hidden="true">
                  <topic.icon size={24} />
                </div>
                <span className="topic-category">{topic.category}</span>
                <h3>{topic.topics.length} articles planned</h3>
                <ul className="topic-list">
                  {topic.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Editorial standards"
            title="What you can expect from every GSTPIXEL resource."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="standards-grid"
          >
            {editorialStandards.map((s, i) => (
              <div key={s.title} className="standard-card">
                <div className="standard-icon" aria-hidden="true">
                  <s.icon size={20} />
                </div>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="From reading to doing"
            title="Each topic connects to something you can use today."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="topics-grid"
          >
            {topicActions.map((group) => (
              <div key={group.category} className="topic-card">
                <span className="topic-category">{group.category}</span>
                <ul className="topic-list" style={{ marginTop: "0.75rem" }}>
                  {group.actions.map((action) => (
                    <li key={action.to}>
                      <Link
                        to={action.to}
                        className="label text-primary"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        {action.label}{" "}
                        <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div className="insights-cta">
              <p className="label text-primary">Stay informed</p>
              <h2 className="section-title">
                Resources will publish when ready.
              </h2>
              <p style={{ maxWidth: "52ch", color: "var(--ink-muted)" }}>
                No content calendar pressure. No filler. Each piece meets the
                standards above before it appears.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <StartBand title="Need guidance now? Start a conversation." />
    </>
  );
}
