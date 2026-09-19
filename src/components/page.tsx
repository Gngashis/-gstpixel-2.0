import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useMagnetic } from "@/lib/pointer-light";
import { Children, useEffect, useRef, useState } from "react";
import {
  useReducedMotion,
  useIntersection,
  useElementScrollProgress,
  timing,
  easing,
  stagger,
  fadeInUp,
  fadeIn,
  scaleIn,
} from "@/lib/motion";

function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "fadeInUp",
  style: extraStyle,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn" | "maskIn";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const visible = useIntersection(ref as React.RefObject<HTMLElement>);

  const variants = {
    fadeInUp: {
      opacity: 1,
      transform: "translateY(0)",
    },
    fadeIn: { opacity: 1 },
    scaleIn: {
      opacity: 1,
      transform: "scale(1)",
    },
    maskIn: {
      opacity: 1,
      transform: "translateY(0)",
    },
  };

  const initialVariants = {
    fadeInUp: {
      opacity: 0,
      transform: "translateY(24px)",
    },
    fadeIn: { opacity: 0 },
    scaleIn: {
      opacity: 0,
      transform: "scale(0.96)",
    },
    maskIn: {
      opacity: 0,
      transform: "translateY(105%)",
    },
  };

  const transition = {
    duration: timing.narrative.base / 1000,
    easing: easing.decelerate,
    delay,
  };

  const isVisible = hydrated ? visible : true;

  const style: React.CSSProperties = {
    ...extraStyle,
    ...(isVisible ? variants[variant] : initialVariants[variant]),
    transition: isVisible
      ? `${transition.duration}s ${transition.easing} ${transition.delay}s`
      : "none",
    /* Only promote while the element is still waiting to animate: keeping every
       reveal on its own compositor layer for the life of the page is wasteful. */
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  if (reduced) {
    return (
      <div
        ref={ref}
        className={`${className}${variant === "maskIn" ? " reveal-mask" : ""}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${className}${variant === "maskIn" ? " reveal-mask" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function StaggeredReveal({
  children,
  className = "",
  baseDelay = 0.08,
  variant = "fadeInUp",
}: {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn" | "maskIn";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {Children.toArray(children).map((child, index) => (
        <ScrollReveal key={index} delay={baseDelay * index} variant={variant}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

export function ScrollLinked({
  children,
  className = "",
  progressRef,
}: {
  children: (progress: number) => React.ReactNode;
  className?: string;
  progressRef: React.RefObject<HTMLElement>;
}) {
  const progress = useElementScrollProgress(progressRef);
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children(1)}</div>;
  }

  return <div className={className}>{children(progress)}</div>;
}

export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro env-section" data-env-phase="0">
      <div className="site-container">
        <ScrollReveal variant="fadeInUp" delay={0}>
          <p className="label text-primary">{label}</p>
        </ScrollReveal>
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <h1>{title}</h1>
        </ScrollReveal>
        <ScrollReveal variant="fadeInUp" delay={0.2}>
          <p>{description}</p>
        </ScrollReveal>
      </div>
    </header>
  );
}

export function StartBand({
  title = "Bring the idea. We'll map the system.",
}: {
  title?: string;
}) {
  const cta = useMagnetic<HTMLSpanElement>();

  return (
    <section className="start-band env-section" data-env-phase="5">
      <div className="site-container">
        <div className="start-band-trace" aria-hidden="true">
          <span>IDEA</span>
          <i />
          <span>DESIGN</span>
          <i />
          <span>BUILD</span>
          <i />
          <span>AUTOMATE</span>
          <i />
          <span>OPERATE</span>
          <i />
          <span>GROW</span>
        </div>
        <ScrollReveal variant="fadeInUp" delay={0}>
          <p className="label text-primary">Begin</p>
        </ScrollReveal>
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <h2>{title}</h2>
        </ScrollReveal>
        <ScrollReveal variant="scaleIn" delay={0.2}>
          <span ref={cta.ref} className="magnetic">
            <ButtonLink to="/start-your-project">
              Start your project <ArrowRight size={16} />
            </ButtonLink>
          </span>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Meta({ label }: { label: string }) {
  return <span className="label text-primary">{label}</span>;
}

export function SectionHeader({
  label,
  title,
  className = "",
}: {
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ScrollReveal variant="fadeInUp" delay={0}>
        <p className="label text-primary">{label}</p>
      </ScrollReveal>
      <ScrollReveal variant="maskIn" delay={0.1}>
        <h2 className="section-title">{title}</h2>
      </ScrollReveal>
    </div>
  );
}
