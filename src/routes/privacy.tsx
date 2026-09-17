import { createFileRoute } from "@tanstack/react-router";
import {
  PageIntro,
  SectionHeader,
  StaggeredReveal,
  ScrollReveal,
} from "@/components/page";
import {
  Shield,
  Database,
  Eye,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — GSTPIXEL" },
      {
        name: "description",
        content:
          "Current privacy information for the GSTPIXEL website and enquiry experience.",
      },
      { property: "og:title", content: "Privacy — GSTPIXEL" },
      {
        property: "og:description",
        content: "How the current GSTPIXEL website handles information.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/privacy") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/privacy") }],
  }),
  component: Page,
});

function Page() {
  const currentState = [
    {
      icon: Database,
      title: "Enquiry drafts stay local",
      desc: "Your answers in the Start Your Project flow and tools are stored in your browser's sessionStorage and localStorage. They are not transmitted to any server while delivery is unavailable.",
      status: "active",
    },
    {
      icon: Eye,
      title: "No analytics configured",
      desc: "No Google Analytics, Matomo, Plausible, or other tracking provider is active in this version. Page views and interactions are not collected.",
      status: "active",
    },
    {
      icon: Shield,
      title: "No third-party scripts",
      desc: "No advertising pixels, social media trackers, or fingerprinting libraries are loaded. Only first-party assets required for the site to function.",
      status: "active",
    },
    {
      icon: Lock,
      title: "HTTPS enforced",
      desc: "All connections use TLS. The site is deployed with HSTS and secure headers via Cloudflare.",
      status: "active",
    },
    {
      icon: FileText,
      title: "Submission not yet enabled",
      desc: "A verified recipient inbox, acknowledgement process, and retention policy must be approved before live enquiry delivery is enabled. This page will be updated when that changes.",
      status: "pending",
    },
    {
      icon: AlertCircle,
      title: "Do not include sensitive data",
      desc: "Until secure submission is verified, do not enter identity numbers (PAN, Aadhaar, GSTIN), financial details, passwords, or confidential documents in any form.",
      status: "warning",
    },
  ];

  const plannedProtections = [
    {
      icon: CheckCircle2,
      title: "Verified delivery endpoint",
      desc: "Confirmed recipient inbox with tested acknowledgement.",
    },
    {
      icon: CheckCircle2,
      title: "Retention policy",
      desc: "Defined storage duration and deletion process for submitted data.",
    },
    {
      icon: CheckCircle2,
      title: "Access controls",
      desc: "Only authorised personnel can view submitted enquiries.",
    },
    {
      icon: CheckCircle2,
      title: "Encryption in transit and at rest",
      desc: "TLS for transmission; encrypted storage for any persisted data.",
    },
    {
      icon: CheckCircle2,
      title: "Data subject rights",
      desc: "Process for access, correction, and deletion requests.",
    },
    {
      icon: CheckCircle2,
      title: "Privacy policy v2.0",
      desc: "Full policy document published before live submission enables.",
    },
  ];

  return (
    <>
      <PageIntro
        label="Privacy"
        title="Current data handling."
        description="This page describes the current preview experience. It will be updated before public submission is enabled."
      />

      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="Current state"
            title="What happens with your data today."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="privacy-state"
          >
            {currentState.map((item, i) => (
              <article
                key={item.title}
                className={`privacy-state-card ${item.status}`}
              >
                <div className="state-icon" aria-hidden="true">
                  <item.icon size={24} />
                </div>
                <div className="state-content">
                  <div className="state-header">
                    <strong>{item.title}</strong>
                    <span className={`state-badge ${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Before live submission"
            title="Protections that will be in place."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="planned-protections"
          >
            {plannedProtections.map((item, i) => (
              <div key={item.title} className="protection-card">
                <div className="protection-icon" aria-hidden="true">
                  <item.icon size={20} />
                </div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div className="privacy-contact">
              <p className="label text-primary">Questions or concerns?</p>
              <h2 className="section-title">Contact us directly.</h2>
              <p style={{ maxWidth: "52ch", color: "var(--ink-muted)" }}>
                Email{" "}
                <a href="mailto:support@gstpixel.com" className="underline">
                  support@gstpixel.com
                </a>
                with "Privacy" in the subject line. We will respond within a
                reasonable timeframe.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
