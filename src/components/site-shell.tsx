import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useElementEnvironment } from "@/lib/scroll-environment";
import { businessFacts } from "@/lib/content";

const nav = [
  ["Services", "/services"],
  ["Solutions", "/solutions"],
  ["Work", "/work"],
  ["Tools", "/tools"],
  ["Insights", "/insights"],
  ["About", "/about"],
] as const;

export function Brand() {
  return (
    <span className="brand-mark">
      <span aria-hidden="true" className="brand-cell" />
      GSTPIXEL<span className="text-primary">_</span>
    </span>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLHeaderElement>(null);
  const headerEnv = useElementEnvironment(headerRef);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

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
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={`site-header${scrolled ? " site-header-scrolled" : ""} ${isDarkPhase ? " site-header-dark" : ""}`}
        style={{
          background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-idea-glass-tint)"} 85%, transparent)`,
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${headerEnv ? `color-mix(in oklab, var(--color-brand-primary) 25%, transparent)` : "var(--ink-line)"}`,
        }}
      >
        <div className="site-container flex h-16 items-center justify-between">
          <Link
            to="/"
            aria-label="GSTPIXEL home"
            className="luminous-edge"
            style={{ borderRadius: "0.5rem", padding: "0.25rem 0.5rem" }}
          >
            <Brand />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 lg:flex"
            style={{
              background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-idea-glass-tint)"} 60%, transparent)`,
              backdropFilter: "blur(16px)",
              border: `1px solid ${headerEnv ? `color-mix(in oklab, var(--color-brand-primary) 20%, transparent)` : "var(--ink-line)"}`,
              borderRadius: "9999px",
              padding: "0.35rem 0.75rem",
              boxShadow: "var(--depth-shadow-sm), var(--glass-inner-glow)",
            }}
          >
            {nav.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="nav-link"
                activeProps={{ className: "nav-link-active" }}
                style={{
                  position: "relative",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "9999px",
                  transition: "color 0.15s, background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.background = `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-idea-glass-tint)"} 100%, transparent)`;
                  target.style.boxShadow =
                    "inset 0 0 0 1px color-mix(in oklab, var(--color-brand-primary) 30%, transparent)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.background = "transparent";
                  target.style.boxShadow = "none";
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink
              to="/start-your-project"
              className="hidden sm:inline-flex luminous-edge"
              style={{ borderRadius: "0.5rem", padding: "0.6rem 1.25rem" }}
            >
              Start your project
            </ButtonLink>
            <Button
              ref={menuTriggerRef}
              variant="quiet"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="px-3 lg:hidden"
              style={{
                background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-idea-glass-tint)"} 100%, transparent)`,
                backdropFilter: "blur(16px)",
                border: `1px solid ${headerEnv ? `color-mix(in oklab, var(--color-brand-primary) 20%, transparent)` : "var(--ink-line)"}`,
                borderRadius: "0.5rem",
              }}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="mobile-nav"
            data-open
            style={{
              background: `color-mix(in oklab, ${headerEnv?.glassTint ?? "var(--env-idea-glass-tint)"} 95%, transparent)`,
              backdropFilter: "blur(24px)",
              borderTop: `1px solid ${headerEnv ? `color-mix(in oklab, var(--color-brand-primary) 20%, transparent)` : "var(--ink-line)"}`,
            }}
          >
            {nav.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                style={{
                  borderBottom: `1px solid ${headerEnv ? `color-mix(in oklab, var(--color-brand-primary) 15%, transparent)` : "var(--ink-line)"}`,
                  background: "transparent",
                }}
              >
                {label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              style={{
                borderBottom: `1px solid ${headerEnv ? `color-mix(in oklab, var(--color-brand-primary) 15%, transparent)` : "var(--ink-line)"}`,
              }}
            >
              Contact<span aria-hidden="true">↗</span>
            </Link>
            <ButtonLink
              to="/start-your-project"
              onClick={() => setOpen(false)}
              className="mt-3 w-full luminous-edge"
              style={{ borderRadius: "0.5rem" }}
            >
              Start your project
            </ButtonLink>
          </nav>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="border-t border-border bg-ink py-12 text-ink-foreground">
        <div className="site-container grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Brand />
            <p className="mt-4 text-sm text-ink-muted">
              <strong style={{ color: "var(--ink-foreground)" }}>
                Start Right. Stay Compliant. Grow Online.
              </strong>
              <br />
              Business consulting and services, digital development, and
              automation—assembled as one system.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
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
          <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-4">
            <div>
              <p className="label">Explore</p>
              <Link to="/services">Services</Link>
              <Link to="/solutions">Solutions</Link>
              <Link to="/work">Work</Link>
            </div>
            <div>
              <p className="label">Decide</p>
              <Link to="/tools">Tools</Link>
              <Link to="/tools/service-finder">Service finder</Link>
              <Link to="/tools/project-estimator">Estimator</Link>
            </div>
            <div>
              <p className="label">Company</p>
              <Link to="/about">About</Link>
              <Link to="/insights">Insights</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div>
              <p className="label">Begin</p>
              <Link to="/start-your-project">Start your project</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="site-container mt-10 border-t border-ink-line pt-5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          © 2026 GSTPIXEL · gstpixel.com
        </div>
      </footer>
    </div>
  );
}
