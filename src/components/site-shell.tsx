import { Link, useMatches } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

/** Auto-close inactivity timeout for the mobile menu (ms). */
const MOBILE_AUTO_CLOSE_MS = 6000;

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
  const [closing, setClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headerEnv = useElementEnvironment(headerRef);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuNavRef = useRef<HTMLElement>(null);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerHeld = useRef(false);
  const reduced = useReducedMotion();
  const headerCta = useMagnetic<HTMLSpanElement>();
  const matches = useMatches();

  /** Extract the current pathname for active-route detection. */
  const currentPath = (() => {
    try {
      const loc = window.location.pathname;
      return loc.endsWith("/") && loc.length > 1 ? loc.slice(0, -1) : loc;
    } catch {
      return "";
    }
  })();

  /** Close with smooth exit animation, then unmount. */
  const requestClose = useCallback(() => {
    if (!open || closing) return;
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosing(true);
    closeTimer.current = setTimeout(
      () => {
        setOpen(false);
        setClosing(false);
        menuTriggerRef.current?.focus();
      },
      reduced ? 0 : 280,
    );
  }, [open, closing, reduced]);

  const pauseAutoClose = useCallback(() => {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    autoCloseTimer.current = null;
  }, []);

  /** Reset the auto-close inactivity timer. */
  const resetAutoClose = useCallback(() => {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    if (!open || closing) return;
    autoCloseTimer.current = setTimeout(() => {
      const menu = menuNavRef.current;
      if (menu?.contains(document.activeElement)) {
        resetAutoClose();
        return;
      }
      requestClose();
    }, MOBILE_AUTO_CLOSE_MS);
  }, [open, closing, requestClose]);

  const handleMenuPointerDown = useCallback(() => {
    pointerHeld.current = true;
    pauseAutoClose();
  }, [pauseAutoClose]);

  const handleMenuPointerEnd = useCallback(() => {
    pointerHeld.current = false;
    resetAutoClose();
  }, [resetAutoClose]);

  /** Handle menu item selection: close immediately and navigate. */
  const handleNavClick = useCallback(() => {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 0);
  }, []);

  useEffect(
    () => () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

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

  /* Escape key and outside-tap to close. */
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose();
      }
    };
    const handleOutside = (e: PointerEvent) => {
      if (!menuNavRef.current || !menuTriggerRef.current) return;
      const navEl = menuNavRef.current;
      const triggerEl = menuTriggerRef.current;
      const target = e.target as Node;
      if (!navEl.contains(target) && !triggerEl.contains(target)) {
        requestClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [open, requestClose]);

  /* Auto-close inactivity timer: starts on open, resets on any interaction. */
  useEffect(() => {
    if (!open) {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
      return;
    }
    resetAutoClose();
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    };
  }, [open, resetAutoClose]);

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
        setClosing(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  const isDarkPhase = headerEnv?.id !== undefined && headerEnv.id >= 3;

  return (
    <div className="site-shell min-h-screen text-foreground env-section">
      <EnvironmentAtmosphere />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={`site-header${scrolled ? " site-header-scrolled" : ""} ${isDarkPhase ? " site-header-dark" : ""}`}
        style={{
          background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-current-glass-tint)"} ${scrolled ? "90%" : "68%"}, transparent)`,
          backdropFilter: `blur(${scrolled ? "22px" : "16px"}) saturate(${scrolled ? "1.3" : "1.12"})`,
          borderBottom: `1px solid color-mix(in oklab, var(--color-brand-primary) ${scrolled ? "24%" : "12%"}, transparent)`,
          boxShadow: scrolled
            ? "var(--depth-shadow-md), 0 1px 28px color-mix(in oklab, var(--env-current-glow) 12%, transparent)"
            : "none",
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
                <span>Start your project</span>
                <span aria-hidden="true">↗</span>
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
              className={`mobile-nav-scrim${closing ? " mobile-nav-scrim-closing" : ""}`}
              aria-label="Close menu"
              tabIndex={-1}
              onClick={requestClose}
            />
            <nav
              ref={menuNavRef}
              id="mobile-nav"
              aria-label="Mobile"
              className={`mobile-nav${closing ? " mobile-nav-closing" : ""}`}
              data-open
              style={{
                background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-current-glass-tint)"} 92%, transparent)`,
                backdropFilter: "blur(22px) saturate(1.2)",
                borderTop: `1px solid color-mix(in oklab, var(--color-brand-primary) 20%, transparent)`,
              }}
              onPointerMove={() => {
                if (!pointerHeld.current) resetAutoClose();
              }}
              onPointerEnter={resetAutoClose}
              onPointerDown={handleMenuPointerDown}
              onPointerUp={handleMenuPointerEnd}
              onPointerCancel={handleMenuPointerEnd}
              onFocus={pauseAutoClose}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                  resetAutoClose();
                }
              }}
              onKeyDown={pauseAutoClose}
              onKeyUp={pauseAutoClose}
              onScroll={resetAutoClose}
            >
              {nav.map(([label, to]) => {
                const isActive =
                  currentPath === to || currentPath.startsWith(to + "/");
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleNavClick}
                    onPointerDown={resetAutoClose}
                    className={isActive ? "mobile-nav-active" : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                );
              })}
              <Link
                to="/contact"
                onClick={handleNavClick}
                onPointerDown={resetAutoClose}
                className={
                  currentPath === "/contact" ? "mobile-nav-active" : undefined
                }
                aria-current={currentPath === "/contact" ? "page" : undefined}
              >
                Contact<span aria-hidden="true">↗</span>
              </Link>
              <ButtonLink
                to="/start-your-project"
                onClick={handleNavClick}
                onPointerDown={resetAutoClose}
                className="tactile mt-4 w-full luminous-edge mobile-nav-cta"
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
