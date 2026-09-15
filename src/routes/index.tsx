import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Braces,
  CircuitBoard,
  FileCheck2,
  Gauge,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StartBand } from "@/components/page";
import { conceptProjects, solutions } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GSTPIXEL — Digital Systems for Business" },
      {
        name: "description",
        content:
          "GSTPIXEL connects digital products, AI automation, business services, and consultancy into one working system.",
      },
      {
        property: "og:title",
        content: "GSTPIXEL — Digital Systems for Business",
      },
      {
        property: "og:description",
        content:
          "Digital products, automation, business services, and consultancy—assembled as one system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function AssemblyVisual() {
  return (
    <div
      className="assembly-visual"
      aria-label="Six connected stages from idea to growth"
    >
      <div className="assembly-orbit orbit-one" aria-hidden="true" />
      <div className="assembly-orbit orbit-two" aria-hidden="true" />
      <div className="assembly-path path-one" aria-hidden="true" />
      <div className="assembly-path path-two" aria-hidden="true" />
      <div className="assembly-plane plane-a">
        <span className="label text-primary">01 / Input</span>
        <strong>Idea</strong>
      </div>
      <div className="assembly-plane plane-b">
        <span className="label text-primary">02 / Form</span>
        <strong>Design</strong>
      </div>
      <div className="assembly-plane plane-c">
        <span className="label text-primary">03 / System</span>
        <strong>Build</strong>
      </div>
      <div className="assembly-core">
        <Layers3 size={28} />
        <span className="label">One Assembly</span>
      </div>
      <div className="assembly-status">
        <span /> AUTOMATE → OPERATE → GROW
      </div>
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="home-hero drafting-grid">
        <div className="site-container grid items-center gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-6">
            <p className="label text-primary hero-kicker">
              <span className="signal-dot" /> The GSTPIXEL Assembly
            </p>
            <h1>One system for how a business is built, automated, and run.</h1>
            <p className="hero-copy">
              Technology, digital development, business services, and
              consultancy—connected into a coherent path from idea to growth.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/start-your-project">
                  Start your project <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/services">Explore services</Link>
              </Button>
            </div>
            <div className="hero-meta">
              <span>IDEA → GROWTH</span>
              <span>GSTPIXEL / 02.0</span>
            </div>
          </div>
          <div className="lg:col-span-6 reveal reveal-late">
            <AssemblyVisual />
          </div>
        </div>
      </section>
      <ScrollReveal>
        <section className="content-band bg-background">
          <div className="site-container">
            <p className="label text-primary">01 / Find your path</p>
            <h2 className="section-title">Start with the outcome.</h2>
            <div className="outcome-list">
              {solutions.map((x, i) => (
                <Link
                  key={x.slug}
                  to="/solutions/$slug"
                  params={{ slug: x.slug }}
                >
                  <span className="label">0{i + 1}</span>
                  <strong>{x.title}</strong>
                  <p>{x.summary}</p>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <p className="label text-primary">02 / Build</p>
          <div className="editorial-split">
            <div>
              <h2 className="section-title">
                Digital products become working systems.
              </h2>
              <p className="section-copy">
                Websites, applications, ecommerce, and business platforms are
                designed as connected parts—not isolated deliverables.
              </p>
              <Button asChild variant="secondary">
                <Link
                  to="/services/$slug"
                  params={{ slug: "web-mobile-applications" }}
                >
                  Explore digital development
                </Link>
              </Button>
            </div>
            <div className="interface-spec">
              <div>
                <Braces />
                <span>Interface</span>
              </div>
              <div>
                <CircuitBoard />
                <span>Logic</span>
              </div>
              <div>
                <Gauge />
                <span>Performance</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="content-band">
        <div className="site-container">
          <p className="label text-primary">03 / Automate</p>
          <div className="workflow">
            <div>
              <span>Input</span>
              <strong>Business signal</strong>
            </div>
            <i>→</i>
            <div>
              <span>Rule</span>
              <strong>Clear decision</strong>
            </div>
            <i>→</i>
            <div>
              <span>Output</span>
              <strong>Useful action</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="content-band bg-secondary">
        <div className="site-container editorial-split">
          <div>
            <p className="label text-trust">04 / Operate</p>
            <h2 className="section-title">
              Business essentials, made easier to navigate.
            </h2>
            <p className="section-copy">
              GST, FSSAI, registration, compliance, and business setup support
              stay connected to the wider system. Requirements are explained
              carefully, without promises or assumptions.
            </p>
            <Button asChild variant="secondary">
              <Link
                to="/services/$slug"
                params={{ slug: "business-setup-compliance" }}
              >
                Explore business services
              </Link>
            </Button>
          </div>
          <div className="operation-ledger">
            {[
              "GST-related services",
              "FSSAI-related services",
              "Business registration",
              "Compliance support",
            ].map((x, i) => (
              <div key={x}>
                <span>0{i + 1}</span>
                <strong>{x}</strong>
                <FileCheck2 size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="content-band">
        <div className="site-container">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="label text-primary">05 / Concept Lab</p>
              <h2 className="section-title">Designed to show the thinking.</h2>
            </div>
            <Button asChild variant="secondary">
              <Link to="/work">View all concepts</Link>
            </Button>
          </div>
          <div className="concept-row">
            {conceptProjects.map((x, i) => (
              <Link key={x.slug} to="/work/$slug" params={{ slug: x.slug }}>
                <div className={`concept-art concept-${i + 1}`}>
                  <Sparkles />
                </div>
                <span className="label text-primary">Concept project</span>
                <h3>{x.title}</h3>
                <p>
                  {x.industry} · {x.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="content-band bg-ink text-ink-foreground">
        <div className="site-container">
          <p className="label text-primary">06 / Useful tools</p>
          <h2 className="section-title">
            Move from uncertainty to a useful next step.
          </h2>
          <div className="tool-rail">
            <Link to="/tools/project-estimator">
              Project estimator <ArrowRight />
            </Link>
            <Link to="/tools/service-finder">
              Service finder <ArrowRight />
            </Link>
            <Link to="/tools/gst-calculator">
              GST calculator <ArrowRight />
            </Link>
            <Link to="/tools/business-checklist">
              Business checklist <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <p className="label text-primary">07 / Why GSTPIXEL</p>
            <h2 className="section-title">
              Sophisticated inside. Simple outside.
            </h2>
          </div>
          <div className="principles">
            <p>
              <b>One integrated view.</b> Product, automation, operations, and
              strategy stay connected.
            </p>
            <p>
              <b>Clear before clever.</b> Every interaction must help someone
              understand or act.
            </p>
            <p>
              <b>Evidence over theatre.</b> No fabricated proof, hidden
              complexity, or empty claims.
            </p>
          </div>
        </div>
      </section>
      <section className="content-band bg-secondary">
        <div className="site-container">
          <p className="label text-primary">08 / Process</p>
          <h2 className="section-title">
            From first conversation to a working outcome.
          </h2>
          <ol className="process-line">
            {["Discover", "Frame", "Design", "Build", "Launch", "Support"].map(
              (x, i) => (
                <li key={x}>
                  <span>0{i + 1}</span>
                  <strong>{x}</strong>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>
      <section className="content-band">
        <div className="site-container editorial-split">
          <div>
            <p className="label text-primary">09 / Resources</p>
            <h2 className="section-title">
              Useful guidance, when it is ready.
            </h2>
          </div>
          <div className="empty-state">
            <p>No approved resources are published yet.</p>
            <span>
              Future articles will cover business setup, GST and compliance,
              websites and apps, AI automation, and digital growth.
            </span>
          </div>
        </div>
      </section>
      <StartBand title="Bring the ambition. We’ll assemble the path." />
    </>
  );
}
