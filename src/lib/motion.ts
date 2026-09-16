import { useEffect, useRef, useState } from "react";

export const timing = {
  micro: { fast: 120, base: 150, slow: 180 },
  structural: { fast: 220, base: 280, slow: 360 },
  narrative: { fast: 450, base: 550, slow: 700 },
  cinematic: { fast: 800, base: 1100, slow: 1400 },
} as const;

export const easing = {
  standard: "cubic-bezier(0.16, 1, 0.3, 1)",
  expressive: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const motionTokens = {
  micro: { duration: timing.micro.base, easing: easing.standard },
  structural: { duration: timing.structural.base, easing: easing.expressive },
  narrative: { duration: timing.narrative.base, easing: easing.decelerate },
  cinematic: { duration: timing.cinematic.base, easing: easing.decelerate },
} as const;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

export function useElementScrollProgress(
  ref: React.RefObject<HTMLElement>,
  options?: { offsetStart?: number; offsetEnd?: number },
): number {
  const [progress, setProgress] = useState(0);
  const { offsetStart = 0, offsetEnd = 0 } = options ?? {};
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = rect.top - vh + vh * offsetStart;
      const end = rect.bottom - vh * offsetEnd;
      const length = end - start;
      if (length <= 0) {
        setProgress(rect.top < 0 ? 1 : 0);
        return;
      }
      const p = Math.max(0, Math.min(1, -start / length));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, offsetStart, offsetEnd]);
  return progress;
}

export function useIntersection(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit,
): boolean {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px", ...options },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, reduced, options?.threshold, options?.rootMargin]);
  return visible;
}

export function useSpring(
  value: number,
  config?: { stiffness?: number; damping?: number; mass?: number },
): number {
  const [current, setCurrent] = useState(value);
  const [velocity, setVelocity] = useState(0);
  const { stiffness = 200, damping = 20, mass = 1 } = config ?? {};
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const displacement = current - value;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocity;
      const acceleration = (springForce + dampingForce) / mass;
      const newVelocity = velocity + acceleration * (1 / 60);
      const newCurrent = current + newVelocity * (1 / 60);
      setVelocity(newVelocity);
      setCurrent(newCurrent);
      if (Math.abs(newVelocity) > 0.01 || Math.abs(displacement) > 0.01) {
        frame = requestAnimationFrame(animate);
      } else {
        setCurrent(value);
        setVelocity(0);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, stiffness, damping, mass]);
  return current;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export const stagger = (index: number, baseDelay = 0.08, maxDelay = 0.6) =>
  Math.min(baseDelay * index, maxDelay);

export function createKeyframes(
  frames: Record<string, number | string>[],
): string {
  return frames
    .map(
      (f, i) =>
        `${(i / (frames.length - 1)) * 100}% { ${Object.entries(f)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ")} }`,
    )
    .join("\n");
}

export const fadeInUp = {
  keyframes: [
    { opacity: 0, transform: "translateY(24px)" },
    { opacity: 1, transform: "translateY(0)" },
  ],
  options: {
    duration: timing.narrative.base,
    easing: easing.decelerate,
    fill: "forwards" as const,
  },
};

export const fadeIn = {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  options: {
    duration: timing.structural.base,
    easing: easing.standard,
    fill: "forwards" as const,
  },
};

export const scaleIn = {
  keyframes: [
    { opacity: 0, transform: "scale(0.96)" },
    { opacity: 1, transform: "scale(1)" },
  ],
  options: {
    duration: timing.structural.base,
    easing: easing.spring,
    fill: "forwards" as const,
  },
};

export const slideInFromLeft = {
  keyframes: [
    { opacity: 0, transform: "translateX(-32px)" },
    { opacity: 1, transform: "translateX(0)" },
  ],
  options: {
    duration: timing.narrative.base,
    easing: easing.decelerate,
    fill: "forwards" as const,
  },
};

export const slideInFromRight = {
  keyframes: [
    { opacity: 0, transform: "translateX(32px)" },
    { opacity: 1, transform: "translateX(0)" },
  ],
  options: {
    duration: timing.narrative.base,
    easing: easing.decelerate,
    fill: "forwards" as const,
  },
};

export function useAnimationFrame(
  callback: (time: number, delta: number) => void,
): void {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const animate = (time: number) => {
      const delta = time - previousTimeRef.current;
      previousTimeRef.current = time;
      callbackRef.current(time, delta);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);
}

export function useTimeout(callback: () => void, delay: number): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);
}

export function useInterval(callback: () => void, delay: number | null): void {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (delay === null) return;
    intervalRef.current = setInterval(() => callbackRef.current(), delay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [delay]);
}
