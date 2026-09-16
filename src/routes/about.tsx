import { createFileRoute } from "@tanstack/react-router";
import {
  PageIntro,
  StartBand,
  StaggeredReveal,
  SectionHeader,
  ScrollReveal,
} from "@/components/page";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Target,
  Link2,
  Shield,
  Cpu,
  Users,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GSTPIXEL" },
      {
        name: "description",
        content:
          "GSTPIXEL connects technology, digital development, business services, and consultancy.",
      },
      { property: "og:title", content: "About GSTPIXEL" },
      {
        property: "og:description",
        content: "The principles behind GSTPIXEL's integrated operating model.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const principles = [
    {
      icon: Eye,
      title: "Understand before building",
      desc: "Start from the business outcome and the people who need to use the result.",
    },
    {
      icon: Link2,
      title: "Connect the layers",
      desc: "Treat design, engineering, automation, operations, and guidance as related decisions.",
    },
    {
      icon: Shield,
      title: "Keep claims honest",
      desc: "Make boundaries, assumptions, and next steps visible. No fabricated proof.",
    },
    {
      icon: Cpu,
      title: "Design for real conditions",
      desc: "Mobile, accessibility, performance, and recovery are part of the work from the start.",
    },
    {
      icon: Target,
      title: "Evidence over theatre",
      desc: "No hidden complexity, empty claims, or invented metrics. What you see is what we discuss.",
    },
    {
      icon: Users,
      title: "Sophisticated inside, simple outside",
      desc: "Complex systems, clear interfaces. The visitor should never feel the complexity.",
    },
  ];

  const modelLayers = [
    {
      layer: "Digital Products",
      desc: "Websites, applications, ecommerce, platforms — built as connected systems.",
    },
    {
      layer: "AI & Automation",
      desc: "Workflows that connect inputs, decisions, and useful outputs visibly.",
    },
    {
      layer: "Business Services",
      desc: "GST, FSSAI, registration, compliance — structured support, not promises.",
    },
    {
      layer: "Consulting",
      desc: "Practical guidance connecting business decisions, technology, and growth.",
    },
  ];

  return (
    <>
      <PageIntro
        label="About"
        title="Built around connected business needs."
        description="GSTPIXEL brings digital products, automation, operations, and consultancy into one working model — so decisions remain connected from first idea to growth."
      />

      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <SectionHeader
            label="Operating model"
            title="One assembly. Four connected layers."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="model-layers"
          >
            {modelLayers.map((layer, i) => (
              <div key={layer.layer} className="model-layer">
                <div className="model-layer-number">0{i + 1}</div>
                <div className="model-layer-content">
                  <strong>{layer.layer}</strong>
                  <p>{layer.desc}</p>
                </div>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="Working philosophy"
            title="Clarity carries the complexity."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="principles-grid"
          >
            {principles.map((p, i) => (
              <div key={p.title} className="principle-card">
                <div className="principle-icon" aria-hidden="true">
                  <p.icon size={24} />
                </div>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Representative"
            title="Ashis Gurung — Business Consultant"
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="representative-card"
          >
            <div className="rep-info">
              <p>
                <strong>India:</strong>{" "}
                <a href="tel:+919046520548">+91 90465 20548</a> ·{" "}
                <a href="tel:+918116076725">+91 81160 76725</a>
              </p>
              <p>
                <strong>Bhutan:</strong>{" "}
                <a href="tel:+97577260538">+975 77260538</a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@gstpixel.com">support@gstpixel.com</a>
              </p>
              <p>
                <strong>Address:</strong> Ramgaon, Near Anthony School, Jaigaon
                – 736182
              </p>
              <p>
                <strong>GSTIN:</strong> 19ESPPG2569P1ZP
              </p>
            </div>
            <div className="rep-disclaimer">
              <p>
                GSTPIXEL is an independent business and is not a government
                portal. Compliance-related support does not constitute legal
                advice; confirm official requirements with the relevant
                authorities.
              </p>
            </div>
          </StaggeredReveal>
        </div>
      </section>

      <StartBand title="Want to work together? Start a project." />
    </>
  );
}
