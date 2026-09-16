"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

export interface EnvironmentPhase {
  id: number;
  name: "idea" | "design" | "build" | "automate" | "operate" | "grow" | "cta";
  start: number;
  end: number;
  bg: string;
  gradient: string;
  glow: string;
  glassTint: string;
  glowX: string;
  glowY: string;
}

const phases: EnvironmentPhase[] = [
  {
    id: 0,
    name: "idea",
    start: 0,
    end: 0.16,
    bg: "oklch(0.085 0.012 255)",
    gradient:
      "radial-gradient(ellipse 80% 60% at 20% 10%, oklch(0.15 0.035 255 / 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 85% 85%, oklch(0.79 0.142 197 / 0.08), transparent 55%), linear-gradient(180deg, oklch(0.085 0.012 255), oklch(0.1 0.015 255))",
    glow: "oklch(0.79 0.142 197 / 0.12)",
    glassTint: "oklch(0.15 0.02 255 / 0.4)",
    glowX: "20%",
    glowY: "10%",
  },
  {
    id: 1,
    name: "design",
    start: 0.16,
    end: 0.33,
    bg: "oklch(0.095 0.015 265)",
    gradient:
      "radial-gradient(ellipse 75% 55% at 15% 20%, oklch(0.64 0.1 55 / 0.25), transparent 55%), radial-gradient(ellipse 70% 60% at 80% 15%, oklch(0.79 0.142 197 / 0.15), transparent 50%), radial-gradient(ellipse 50% 40% at 50% 70%, oklch(0.85 0.08 85 / 0.1), transparent 55%), linear-gradient(180deg, oklch(0.095 0.015 265), oklch(0.12 0.02 270))",
    glow: "oklch(0.64 0.1 55 / 0.18)",
    glassTint: "oklch(0.2 0.03 265 / 0.45)",
    glowX: "30%",
    glowY: "30%",
  },
  {
    id: 2,
    name: "build",
    start: 0.33,
    end: 0.5,
    bg: "oklch(0.1 0.018 250)",
    gradient:
      "radial-gradient(ellipse 85% 65% at 10% 5%, oklch(0.79 0.142 197 / 0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 30%, oklch(0.55 0.12 220 / 0.2), transparent 50%), conic-gradient(from 180deg at 50% 50%, transparent 0deg, oklch(0.79 0.142 197 / 0.03) 90deg, transparent 180deg, oklch(0.64 0.1 55 / 0.03) 270deg, transparent 360deg), linear-gradient(180deg, oklch(0.1 0.018 250), oklch(0.13 0.022 255))",
    glow: "oklch(0.79 0.142 197 / 0.15)",
    glassTint: "oklch(0.18 0.025 250 / 0.5)",
    glowX: "70%",
    glowY: "40%",
  },
  {
    id: 3,
    name: "automate",
    start: 0.5,
    end: 0.66,
    bg: "oklch(0.095 0.02 260)",
    gradient:
      "radial-gradient(ellipse 90% 70% at 5% 0%, oklch(0.65 0.18 280 / 0.22), transparent 55%), radial-gradient(ellipse 65% 55% at 95% 40%, oklch(0.79 0.142 197 / 0.2), transparent 50%), radial-gradient(ellipse 40% 35% at 40% 60%, oklch(0.7 0.15 300 / 0.15), transparent 50%), linear-gradient(180deg, oklch(0.095 0.02 260), oklch(0.12 0.025 270))",
    glow: "oklch(0.65 0.18 280 / 0.2)",
    glassTint: "oklch(0.2 0.035 275 / 0.55)",
    glowX: "40%",
    glowY: "60%",
  },
  {
    id: 4,
    name: "operate",
    start: 0.66,
    end: 0.83,
    bg: "oklch(0.105 0.015 245)",
    gradient:
      "radial-gradient(ellipse 80% 60% at 20% 15%, oklch(0.64 0.1 55 / 0.2), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 70%, oklch(0.55 0.08 160 / 0.18), transparent 50%), linear-gradient(180deg, oklch(0.105 0.015 245), oklch(0.13 0.018 250))",
    glow: "oklch(0.64 0.1 55 / 0.16)",
    glassTint: "oklch(0.18 0.02 245 / 0.5)",
    glowX: "60%",
    glowY: "50%",
  },
  {
    id: 5,
    name: "grow",
    start: 0.83,
    end: 0.95,
    bg: "oklch(0.1 0.015 200)",
    gradient:
      "radial-gradient(ellipse 95% 75% at 50% -10%, oklch(0.75 0.12 140 / 0.25), transparent 55%), radial-gradient(ellipse 60% 50% at 10% 80%, oklch(0.64 0.1 55 / 0.18), transparent 50%), radial-gradient(ellipse 55% 45% at 90% 20%, oklch(0.79 0.142 197 / 0.15), transparent 50%), linear-gradient(180deg, oklch(0.1 0.015 200), oklch(0.12 0.02 210))",
    glow: "oklch(0.75 0.12 140 / 0.22)",
    glassTint: "oklch(0.22 0.03 180 / 0.5)",
    glowX: "50%",
    glowY: "70%",
  },
  {
    id: 6,
    name: "cta",
    start: 0.95,
    end: 1.0,
    bg: "oklch(0.105 0.018 260)",
    gradient:
      "radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.79 0.142 197 / 0.18), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 100%, oklch(0.64 0.1 55 / 0.15), transparent 50%), linear-gradient(180deg, oklch(0.105 0.018 260), oklch(0.105 0.018 260))",
    glow: "oklch(0.79 0.142 197 / 0.2)",
    glassTint: "oklch(0.18 0.025 260 / 0.55)",
    glowX: "50%",
    glowY: "50%",
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColorString(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  // For complex CSS values (gradients), we can't truly interpolate.
  // We'll cross-fade by returning the one with higher weight at boundaries,
  // and for intermediate values we blend by opacity via CSS.
  // The actual smooth interpolation is handled by CSS custom properties
  // that transition smoothly. Here we just pick the dominant phase.
  return t < 0.5 ? a : b;
}

function parseOklch(
  color: string,
): { l: number; c: number; h: number; alpha: number } | null {
  const match = color.match(
    /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s+\/\s*([\d.]+))?\)/,
  );
  if (!match) return null;
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
    alpha: match[4] ? parseFloat(match[4]) : 1,
  };
}

function formatOklch(l: number, c: number, h: number, alpha: number): string {
  if (alpha < 1) {
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)} / ${alpha.toFixed(2)})`;
  }
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

function interpolateOklch(a: string, b: string, t: number): string {
  const ca = parseOklch(a);
  const cb = parseOklch(b);
  if (!ca || !cb) return t < 0.5 ? a : b;
  const l = lerp(ca.l, cb.l, t);
  const c = lerp(ca.c, cb.c, t);
  const h = lerp(ca.h, cb.h, t);
  const alpha = lerp(ca.alpha, cb.alpha, t);
  return formatOklch(l, c, h, alpha);
}

function getInterpolatedPhase(progress: number): {
  bg: string;
  gradient: string;
  glow: string;
  glassTint: string;
  glowX: string;
  glowY: string;
  phaseName: string;
  phaseProgress: number;
} {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));

  // Find current phase
  let currentPhase = phases[0];
  let nextPhase = phases[1];
  let phaseProgress = 0;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    if (p >= phase.start && p <= phase.end) {
      currentPhase = phase;
      nextPhase = phases[i + 1] ?? phase;
      const phaseRange = phase.end - phase.start;
      phaseProgress = phaseRange > 0 ? (p - phase.start) / phaseRange : 1;
      break;
    } else if (p > phase.end && i === phases.length - 1) {
      currentPhase = phase;
      nextPhase = phase;
      phaseProgress = 1;
    }
  }

  // For background color and glow (oklch values), we can interpolate
  // For gradients, we'll use the current phase's gradient but CSS will handle
  // the transition via the custom properties we set
  const interpolatedBg = interpolateOklch(
    currentPhase.bg,
    nextPhase.bg,
    phaseProgress,
  );
  const interpolatedGlow = interpolateOklch(
    currentPhase.glow,
    nextPhase.glow,
    phaseProgress,
  );
  const interpolatedGlassTint = interpolateOklch(
    currentPhase.glassTint,
    nextPhase.glassTint,
    phaseProgress,
  );

  // For glow position, interpolate percentages
  const currentGlowX = parseFloat(currentPhase.glowX);
  const nextGlowX = parseFloat(nextPhase.glowX);
  const currentGlowY = parseFloat(currentPhase.glowY);
  const nextGlowY = parseFloat(nextPhase.glowY);
  const interpolatedGlowX = `${lerp(currentGlowX, nextGlowX, phaseProgress)}%`;
  const interpolatedGlowY = `${lerp(currentGlowY, nextGlowY, phaseProgress)}%`;

  return {
    bg: interpolatedBg,
    gradient: currentPhase.gradient, // Gradients handled by CSS cross-fade
    glow: interpolatedGlow,
    glassTint: interpolatedGlassTint,
    glowX: interpolatedGlowX,
    glowY: interpolatedGlowY,
    phaseName: currentPhase.name,
    phaseProgress,
  };
}

export function useScrollEnvironment(): {
  progress: number;
  interpolated: ReturnType<typeof getInterpolatedPhase>;
} {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [interpolated, setInterpolated] = useState(() =>
    getInterpolatedPhase(0),
  );
  const rafRef = useRef<number>();
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      setInterpolated(getInterpolatedPhase(1));
      return;
    }

    const updateEnvironment = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress =
        scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const clampedProgress = Math.max(0, Math.min(1, currentProgress));

      // Only update if progress changed meaningfully (throttle)
      if (Math.abs(clampedProgress - lastProgressRef.current) > 0.001) {
        lastProgressRef.current = clampedProgress;
        setProgress(clampedProgress);
        setInterpolated(getInterpolatedPhase(clampedProgress));

        // Update CSS custom properties for smooth interpolation
        const root = document.documentElement;
        const interp = getInterpolatedPhase(clampedProgress);
        root.style.setProperty("--env-progress", clampedProgress.toString());
        root.style.setProperty("--env-current-bg", interp.bg);
        root.style.setProperty("--env-current-glow", interp.glow);
        root.style.setProperty("--env-current-glass-tint", interp.glassTint);
        root.style.setProperty("--env-glow-x", interp.glowX);
        root.style.setProperty("--env-glow-y", interp.glowY);
      }
    };

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateEnvironment);
    };

    updateEnvironment();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return { progress, interpolated };
}

export function ScrollEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { progress, interpolated } = useScrollEnvironment();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --env-current-bg: ${interpolated.bg};
              --env-current-gradient: ${interpolated.gradient};
              --env-current-glow: ${interpolated.glow};
              --env-current-glass-tint: ${interpolated.glassTint};
              --env-glow-x: ${interpolated.glowX};
              --env-glow-y: ${interpolated.glowY};
            }
          `,
        }}
      />
      {children}
    </>
  );
}

export function useElementEnvironment(
  ref: React.RefObject<HTMLElement>,
): EnvironmentPhase | null {
  const reduced = useReducedMotion();
  const [envPhase, setEnvPhase] = useState<EnvironmentPhase | null>(null);

  useEffect(() => {
    if (reduced || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.target.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const relativePos = 1 - elementCenter / viewportCenter;
            const clamped = Math.max(0, Math.min(1, relativePos));

            for (const phase of phases) {
              if (clamped >= phase.start && clamped <= phase.end) {
                setEnvPhase(phase);
                break;
              }
            }
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-20% 0px -20% 0px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, reduced]);

  return envPhase;
}
