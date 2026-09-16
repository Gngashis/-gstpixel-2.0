"use client";

import { useRef, useState, useEffect } from "react";
import { useReducedMotion, useElementScrollProgress } from "@/lib/motion";

export function ScrollParallax({
  children,
  className = "",
  speed = 0.3,
  direction = "vertical",
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useElementScrollProgress(ref, {
    offsetStart: 0.2,
    offsetEnd: 0.2,
  });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const transform =
    direction === "vertical"
      ? `translateY(${progress * speed * 100}px)`
      : `translateX(${progress * speed * 100}px)`;

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform, willChange: "transform" }}
    >
      {children}
    </div>
  );
}

export function ScrollScale({
  children,
  className = "",
  minScale = 0.95,
  maxScale = 1.05,
}: {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useElementScrollProgress(ref, {
    offsetStart: 0,
    offsetEnd: 0,
  });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const scale = minScale + (maxScale - minScale) * progress;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `scale(${scale})`,
        willChange: "transform",
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}

export function ScrollFade({
  children,
  className = "",
  fadeStart = 0,
  fadeEnd = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  fadeStart?: number;
  fadeEnd?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useElementScrollProgress(ref, {
    offsetStart: 0,
    offsetEnd: 0,
  });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const opacity = Math.max(
    0,
    Math.min(1, (progress - fadeStart) / (fadeEnd - fadeStart)),
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity, willChange: "opacity" }}
    >
      {children}
    </div>
  );
}

export function ScrollRotate({
  children,
  className = "",
  maxDegrees = 5,
}: {
  children: React.ReactNode;
  className?: string;
  maxDegrees?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useElementScrollProgress(ref, {
    offsetStart: 0,
    offsetEnd: 0,
  });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const rotation = (progress - 0.5) * 2 * maxDegrees;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        willChange: "transform",
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}

export function PinnedSection({
  children,
  className = "",
  height = "300vh",
  pinStart = 0,
  pinEnd = 1,
  onProgress,
}: {
  children: (progress: number) => React.ReactNode;
  className?: string;
  height?: string;
  pinStart?: number;
  pinEnd?: number;
  onProgress?: (progress: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [pinProgress, setPinProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = rect.top - vh + vh * pinStart;
      const end = rect.bottom - vh * pinEnd;
      const length = end - start;

      if (length <= 0) {
        setIsPinned(false);
        setPinProgress(rect.top < 0 ? 1 : 0);
        return;
      }

      const p = Math.max(0, Math.min(1, -start / length));
      setIsPinned(p > 0 && p < 1);
      setPinProgress(p);
      onProgress?.(p);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pinStart, pinEnd, onProgress]);

  if (reduced) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ height: "auto", minHeight: "100vh" }}
      >
        {children(1)}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ height }}>
      <div style={{ position: "sticky", top: 0, height: "100vh" }}>
        {children(pinProgress)}
      </div>
    </div>
  );
}

export function useScrollDirection(): "up" | "down" | null {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}
