"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import {
  ENV_STAGE_COUNT,
  engineAttach,
  engineSetStatic,
  envStages,
  subscribeToEnvironment,
  type EnvStageName,
} from "@/lib/environment";

/**
 * React bindings for the Assembly environment.
 *
 * The engine itself lives in `@/lib/environment`; this module only exposes the
 * hooks and provider that components consume.
 */

export interface ScrollEnvironmentState {
  /** Scroll progress across the page, updated at most twice per viewport. */
  progress: number;
}

/**
 * Wires the single scroll engine to the document. Mounted once, from the root
 * provider, so no component owns a competing scroll loop.
 */
export function useScrollEnvironment(): ScrollEnvironmentState {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    engineAttach();
    engineSetStatic(reduced);
    if (reduced) return;

    let frame = 0;
    let last = -1;
    const unsubscribe = subscribeToEnvironment((value) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        /* Quantised: React consumers re-render a couple of times per viewport
           rather than once per animation frame. */
        const bucket = Math.round(value * 40) / 40;
        if (bucket !== last) {
          last = bucket;
          setProgress(bucket);
        }
      });
    });

    return () => {
      unsubscribe();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return { progress };
}

export interface ElementEnvironment {
  id: number;
  name: EnvStageName;
  label: string;
  glassTint: string;
}

/**
 * Coarse, section-level environment lookup for chrome such as the site header.
 * Uses IntersectionObserver rather than scroll maths so it costs nothing on
 * frames — it only reacts when a section actually enters or leaves view.
 */
export function useElementEnvironment(
  ref: React.RefObject<HTMLElement | null>,
): ElementEnvironment | null {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<ElementEnvironment | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const readStage = () => {
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const centre = rect.top + rect.height / 2;
      const relative = Math.max(0, Math.min(1, centre / viewport));
      const scrollable = document.documentElement.scrollHeight - viewport;
      const base = scrollable > 0 ? window.scrollY / scrollable : 0;
      const combined = Math.max(0, Math.min(1, base * 0.82 + relative * 0.18));
      const index = Math.round(combined * (ENV_STAGE_COUNT - 1));
      const next =
        envStages[Math.max(0, Math.min(ENV_STAGE_COUNT - 1, index))]!;
      setStage((previous) => (previous?.id === next.id ? previous : next));
    };

    const observer = new IntersectionObserver(readStage, {
      threshold: [0, 0.5, 1],
      rootMargin: "-10% 0px -10% 0px",
    });

    observer.observe(node);
    readStage();
    return () => observer.disconnect();
  }, [ref, reduced]);

  return stage;
}

export function ScrollEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useScrollEnvironment();
  return <>{children}</>;
}
