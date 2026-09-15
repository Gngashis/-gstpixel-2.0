import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  ["Services", "/services"], ["Solutions", "/solutions"], ["Work", "/work"],
  ["Tools", "/tools"], ["Insights", "/insights"], ["About", "/about"],
] as const;

export function Brand() {
  return <span className="brand-mark"><span aria-hidden="true" className="brand-cell" />GSTPIXEL<span className="text-primary">_</span></span>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-background text-foreground">
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <div className="site-container flex h-16 items-center justify-between">
        <Link to="/" aria-label="GSTPIXEL home"><Brand /></Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map(([label, to]) => <Link key={to} to={to} className="nav-link" activeProps={{ className: "nav-link-active" }}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex"><Link to="/start-your-project">Start your project</Link></Button>
          <Button variant="quiet" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="px-3 lg:hidden">{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav aria-label="Mobile" className="mobile-nav">
        {nav.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></Link>)}
        <Link to="/contact" onClick={() => setOpen(false)}>Contact<span aria-hidden="true">↗</span></Link>
        <Button asChild className="mt-3 w-full"><Link to="/start-your-project" onClick={() => setOpen(false)}>Start your project</Link></Button>
      </nav>}
    </header>
    <main id="main">{children}</main>
    <footer className="border-t border-border bg-ink py-12 text-ink-foreground">
      <div className="site-container grid gap-10 md:grid-cols-[1fr_2fr]">
        <div><Brand /><p className="mt-4 max-w-xs text-sm text-ink-muted">Technology, digital development, business services, and consultancy—assembled as one system.</p></div>
        <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-4">
          <div><p className="label">Explore</p><Link to="/services">Services</Link><Link to="/solutions">Solutions</Link><Link to="/work">Work</Link></div>
          <div><p className="label">Decide</p><Link to="/tools">Tools</Link><Link to="/tools/service-finder">Service finder</Link><Link to="/tools/project-estimator">Estimator</Link></div>
          <div><p className="label">Company</p><Link to="/about">About</Link><Link to="/insights">Insights</Link><Link to="/contact">Contact</Link></div>
          <div><p className="label">Begin</p><Link to="/start-your-project">Start your project</Link><Link to="/privacy">Privacy</Link></div>
        </div>
      </div>
      <div className="site-container mt-10 border-t border-ink-line pt-5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">© 2026 GSTPIXEL · gstpixel.com</div>
    </footer>
  </div>;
}
