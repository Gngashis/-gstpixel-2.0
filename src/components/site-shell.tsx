import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useElementEnvironment } from "@/lib/scroll-environment";
import { initPointerLight, useMagnetic } from "@/lib/pointer-light";
import { useReducedMotion } from "@/lib/motion";
import { businessFacts } from "@/lib/content";

const nav = [
  ["Services", "/services"],
  ["Solutions", "/solutions"],
  ["Work", "/work"],
  ["Tools", "/tools"],
  ["Insights", "/insights"],
  ["About", "/about"],
] as const;

/** The six Assembly stages, mirrored from the environment engine for the rail. */
const assemblyStages = [
  "Idea",
  "Design",
  "Build",
  "Automate",
  "Operate",
  "Grow",
] as const;

/**
 * Official GSTPIXEL graphical brand lockup.
 *
 * Both renderings are the untouched official artwork shipped from /public:
 *  - /gstpixel-logo.png          full wordmark (≥640px)
 *  - /gstpixel-logo-symbol.png   symbol-only crop of that same official PNG,
 *                                used below 640px where the full wordmark
 *                                would render too small to read
 * The image keeps its intrinsic aspect ratio (fixed height, auto width), so
 * nothing is stretched, recoloured, or redrawn, and the PNG transparency lets
 * the glass navbar and footer show through. `entrance` runs the one-shot fade
 * on the header instance only; the footer stays static.
 */
export function Brand({ entrance = false }: { entrance?: boolean }) {
  return (
    <span className={`brand-mark${entrance ? " brand-entrance" : ""}`}>
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/gstpixel-logo-symbol.png"
          width={693}
          height={439}
        />
        <img
          src="/gstpixel-logo.png"
          alt="GSTPIXEL"
          width={2162}
          height={727}
          className="brand-logo"
          loading="eager"
          decoding="async"
        />
      </picture>
    </span>
  );
}

/**
 * The continuous environment surface.
 *
 * One fixed, viewport-sized layer holds a band per Assembly stage. Bands are
 * cross-faded by opacity only, so the environment evolves continuously as the
 * visitor scrolls without repainting gradients or widening the document.
 */
function EnvironmentAtmosphere() {
  return (
    <div className="env-atmosphere" aria-hidden="true">
      {assemblyStages.map((stage, index) => (
        <div
          key={stage}
          className="env-band"
          data-stage={index}
          style={{ opacity: `var(--env-w${index}, 0)` }}
        />
      ))}
      <div className="env-sheen" />
      <div className="env-grain" />
    </div>
  );
}

/**
 * Assembly progression rail.
 *
 * Each stage node brightens from its own environment weight, so the rail reads
 * as one continuous journey from Idea to Grow rather than a step indicator.
 * Purely decorative — the stages are also described in the hero copy.
 */
function AssemblyRail() {
  return (
    <div className="assembly-rail" aria-hidden="true">
      <div className="assembly-rail-track">
        <span className="assembly-rail-fill" />
      </div>
      <ol className="assembly-rail-stages">
        {assemblyStages.map((stage, index) => (
          <li key={stage} style={{ opacity: `var(--env-rail-${index}, 0.35)` }}>
            <i />
            <span>{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headerEnv = useElementEnvironment(headerRef);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const headerCta = useMagnetic<HTMLSpanElement>();

  /* Cursor-lit glass: one delegated listener for the whole site, parked when
     the pointer rests, and never attached for coarse pointers or reduced
     motion (the CSS side is media-gated too). */
  useEffect(() => {
    if (reduced) return;
    return initPointerLight();
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  /* Hold the page still behind the open menu, and restore the previous value
     rather than assuming it was scrollable. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  const isDarkPhase = headerEnv?.id !== undefined && headerEnv.id >= 3;

  return (
    <div className="min-h-screen text-foreground env-section">
      <EnvironmentAtmosphere />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={`site-header${scrolled ? " site-header-scrolled" : ""} ${isDarkPhase ? " site-header-dark" : ""}`}
        style={{
          background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-current-glass-tint)"} 82%, transparent)`,
          backdropFilter: "blur(20px) saturate(1.25)",
          borderBottom: `1px solid color-mix(in oklab, var(--color-brand-primary) 18%, transparent)`,
          boxShadow: scrolled ? "var(--depth-shadow-md)" : "none",
        }}
      >
        <div className="site-container flex h-16 items-center justify-between">
          <Link
            to="/"
            aria-label="GSTPIXEL home"
            className="luminous-edge"
            style={{ borderRadius: "0.5rem", padding: "0.25rem 0.5rem" }}
          >
            <Brand entrance />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
            style={{
              background: `color-mix(in oklab, var(--env-current-glass-tint) 62%, transparent)`,
              backdropFilter: "blur(16px) saturate(1.2)",
              border: `1px solid color-mix(in oklab, var(--color-brand-primary) 16%, transparent)`,
              borderRadius: "9999px",
              padding: "0.3rem 0.5rem",
              boxShadow: "var(--depth-shadow-sm), var(--glass-inner-glow)",
            }}
          >
            {nav.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="nav-link"
                activeProps={{ className: "nav-link-active" }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span
              ref={headerCta.ref}
              className="magnetic hidden sm:inline-flex"
            >
              <ButtonLink
                to="/start-your-project"
                className="luminous-edge tactile"
                style={{ borderRadius: "0.5rem", padding: "0.6rem 1.25rem" }}
              >
                Start your project
              </ButtonLink>
            </span>
            <Button
              ref={menuTriggerRef}
              variant="quiet"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="tactile px-3 lg:hidden"
              style={{
                background: `color-mix(in oklab, var(--env-current-glass-tint) 74%, transparent)`,
                backdropFilter: "blur(14px)",
                border: `1px solid color-mix(in oklab, var(--color-brand-primary) 22%, transparent)`,
                borderRadius: "0.5rem",
                color: "var(--ink-foreground)",
              }}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        <AssemblyRail />
        {open && (
          <>
            <button
              type="button"
              className="mobile-nav-scrim"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
            />
            <nav
              id="mobile-nav"
              aria-label="Mobile"
              className="mobile-nav"
              data-open
              style={{
                background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-current-glass-tint)"} 92%, transparent)`,
                backdropFilter: "blur(22px) saturate(1.2)",
                borderTop: `1px solid color-mix(in oklab, var(--color-brand-primary) 20%, transparent)`,
              }}
            >
              {nav.map(([label, to]) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}>
                  {label}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact<span aria-hidden="true">↗</span>
              </Link>
              <ButtonLink
                to="/start-your-project"
                onClick={() => setOpen(false)}
                className="tactile mt-4 w-full luminous-edge"
                style={{ borderRadius: "0.5rem" }}
              >
                Start your project
              </ButtonLink>
            </nav>
          </>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="site-container grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <Brand />
            <p className="mt-4 text-sm text-ink-muted">
              <strong style={{ color: "var(--ink-foreground)" }}>
                {businessFacts.tagline}
              </strong>
              <br />
              Business consulting and services, digital development, and
              automation—assembled as one system.
            </p>
            <p className="footer-contact mt-4 text-sm text-ink-muted">
              <a href={businessFacts.phone.href}>{businessFacts.phone.label}</a>
              <a
                href={businessFacts.whatsapp.href}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a href={businessFacts.email.href}>{businessFacts.email.label}</a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-4"
          >
            <div className="footer-column">
              <p className="label">Explore</p>
              <Link to="/services">Services</Link>
              <Link to="/solutions">Solutions</Link>
              <Link to="/work">Work</Link>
            </div>
            <div className="footer-column">
              <p className="label">Decide</p>
              <Link to="/tools">Tools</Link>
              <Link to="/tools/service-finder">Service finder</Link>
              <Link to="/tools/project-estimator">Estimator</Link>
            </div>
            <div className="footer-column">
              <p className="label">Company</p>
              <Link to="/about">About</Link>
              <Link to="/insights">Insights</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-column">
              <p className="label">Begin</p>
              <Link to="/start-your-project">Start your project</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </nav>
        </div>
        <div className="site-container footer-legal mt-10 pt-5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          © {new Date().getFullYear()} {businessFacts.name} ·{" "}
          {businessFacts.domain}
        </div>
      </footer>
    </div>
  );
}
