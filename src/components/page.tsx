import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
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

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "fadeInUp",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const visible = useIntersection(ref);

  const variants = {
    fadeInUp: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
    },
    fadeIn: { opacity: visible ? 1 : 0 },
    scaleIn: {
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.96)",
    },
  };

  const transition = {
    duration: timing.narrative.base / 1000,
    easing: easing.decelerate,
    delay,
  };

  const style: React.CSSProperties = {
    ...variants[variant],
    transition: `${transition.duration}s ${transition.easing} ${transition.delay}s`,
    willChange: "opacity, transform",
  };

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={style}>
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
  children: React.ReactNode[];
  className?: string;
  baseDelay?: number;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn";
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {children.map((child, index) => (
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
    <header className="page-intro">
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
  return (
    <section className="start-band">
      <div className="site-container">
        <ScrollReveal variant="fadeInUp" delay={0}>
          <p className="label text-primary">Begin</p>
        </ScrollReveal>
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <h2>{title}</h2>
        </ScrollReveal>
        <ScrollReveal variant="scaleIn" delay={0.2}>
          <ButtonLink to="/start-your-project">
            Start your project <ArrowRight size={16} />
          </ButtonLink>
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
      <ScrollReveal variant="fadeInUp" delay={0.1}>
        <h2 className="section-title">{title}</h2>
      </ScrollReveal>
    </div>
  );
}
