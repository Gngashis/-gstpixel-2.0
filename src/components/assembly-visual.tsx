"use client";

import { Layers3, Sparkles, Zap, Cpu, Globe, BarChart2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useReducedMotion,
  useAnimationFrame,
  timing,
  easing,
  lerp,
  clamp,
} from "@/lib/motion";

const stages = [
  {
    id: "idea",
    label: "01 / Input",
    title: "Idea",
    icon: Sparkles,
    color: "oklch(0.79 0.142 197)",
  },
  {
    id: "design",
    label: "02 / Form",
    title: "Design",
    icon: Globe,
    color: "oklch(0.64 0.1 55)",
  },
  {
    id: "build",
    label: "03 / System",
    title: "Build",
    icon: Cpu,
    color: "oklch(0.79 0.142 197)",
  },
  {
    id: "automate",
    label: "04 / Flow",
    title: "Automate",
    icon: Zap,
    color: "oklch(0.79 0.142 197)",
  },
  {
    id: "operate",
    label: "05 / Run",
    title: "Operate",
    icon: BarChart2,
    color: "oklch(0.64 0.1 55)",
  },
  {
    id: "grow",
    label: "06 / Scale",
    title: "Grow",
    icon: Layers3,
    color: "oklch(0.79 0.142 197)",
  },
];

const stagePositions = [
  { x: 0.12, y: 0.08, rotation: -12 },
  { x: 0.8, y: 0.18, rotation: 8 },
  { x: 0.15, y: 0.5, rotation: -6 },
  { x: 0.75, y: 0.62, rotation: 5 },
  { x: 0.1, y: 0.85, rotation: -8 },
  { x: 0.85, y: 0.9, rotation: 10 },
];

const corePosition = { x: 0.48, y: 0.5 };

interface AssemblyVisualProps {
  className?: string;
  ariaLabel?: string;
}

export function AssemblyVisual({
  className = "",
  ariaLabel = "The GSTPIXEL Assembly — six connected stages from idea to growth",
}: AssemblyVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<
    | "arrival"
    | "recognition"
    | "assembly"
    | "capability"
    | "invitation"
    | "idle"
  >("arrival");
  const [progress, setProgress] = useState(0);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (reduced) {
      setPhase("idle");
      setProgress(1);
      return;
    }

    const sequence = [
      { phase: "arrival" as const, duration: 800 },
      { phase: "recognition" as const, duration: 1200 },
      { phase: "assembly" as const, duration: 2000 },
      { phase: "capability" as const, duration: 1800 },
      { phase: "invitation" as const, duration: 1200 },
      { phase: "idle" as const, duration: 0 },
    ];

    let currentIndex = 0;
    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const current = sequence[currentIndex];

      if (current.phase !== "idle") {
        setProgress(Math.min(1, elapsed / current.duration));
      }

      if (elapsed >= current.duration && currentIndex < sequence.length - 1) {
        currentIndex++;
        startTime = now;
        setPhase(current.phase);
        setProgress(0);
      } else if (currentIndex === sequence.length - 1) {
        setPhase("idle");
        setProgress(1);
        return;
      }

      requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  useAnimationFrame((time) => {
    if (reduced || phase === "idle") return;

    const pulse = Math.sin(time / 1000) * 0.5 + 0.5;
    const drift = Math.sin(time / 3000) * 0.02;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const getStageTransform = (
    index: number,
    basePos: (typeof stagePositions)[0],
  ) => {
    const p = clamp(progress, 0, 1);
    const isHovered = hoveredStage === index;
    const stagePhase = phaseRef.current;

    let tx = 0,
      ty = 0,
      rot = basePos.rotation,
      scale = 1,
      opacity = 0;

    if (stagePhase === "arrival") {
      opacity = p * 0.3;
      tx = lerp(60, 0, p);
      ty = lerp(40, 0, p);
    } else if (stagePhase === "recognition") {
      opacity = 0.3 + p * 0.4;
      tx = lerp(0, Math.sin(index) * 15, p);
      ty = lerp(0, Math.cos(index) * 10, p);
    } else if (stagePhase === "assembly") {
      opacity = 0.7 + p * 0.3;
      tx = lerp(Math.sin(index) * 15, 0, p);
      ty = lerp(Math.cos(index) * 10, 0, p);
      rot = lerp(basePos.rotation + Math.sin(index) * 10, basePos.rotation, p);
    } else if (stagePhase === "capability") {
      opacity = 1;
      scale = isHovered ? 1.05 : 1;
    } else {
      opacity = 1;
      scale = isHovered ? 1.05 : 1;
    }

    const px = (pointer.x - 0.5) * 20;
    const py = (pointer.y - 0.5) * 20;
    const parallaxX = (index % 2 === 0 ? 1 : -1) * px * 0.15;
    const parallaxY = (index % 2 === 0 ? 1 : -1) * py * 0.15;

    return {
      transform: `translate(${tx + parallaxX}px, ${ty + parallaxY}px) rotate(${rot}deg) scale(${scale})`,
      opacity,
      transition:
        stagePhase !== "idle"
          ? "none"
          : `transform ${timing.structural.base}ms ${easing.expressive}, opacity ${timing.micro.base}ms ${easing.standard}`,
    };
  };

  const coreStyle: React.CSSProperties = {
    transform: `translate(-50%, -50%) scale(${phase === "assembly" ? progress : phase === "capability" || phase === "invitation" || phase === "idle" ? 1 : 0})`,
    opacity: phase === "arrival" || phase === "recognition" ? 0 : 1,
    transition: `transform ${timing.narrative.base}ms ${easing.spring}, opacity ${timing.structural.base}ms ${easing.standard}`,
    boxShadow: `0 0 ${lerp(30, 80, Math.sin(performance.now() / 2000) * 0.5 + 0.5)}px ${stages[0].color}40`,
  };

  const orbitStyle = (index: number): React.CSSProperties => {
    const p = clamp(progress, 0, 1);
    const rotation = (performance.now() / (index === 0 ? 20000 : 30000)) * 360;
    return {
      transform: `rotate(${rotation}deg) skewX(-12deg) scale(${phase === "assembly" ? p : 1})`,
      opacity:
        phase === "arrival"
          ? p * 0.3
          : phase === "recognition"
            ? 0.3 + p * 0.3
            : 0.6,
      borderColor: `${stages[0].color}${Math.floor(16 + 20 * p)
        .toString(16)
        .padStart(2, "0")}`,
    };
  };

  const pathStyle = (index: number): React.CSSProperties => {
    const p = clamp(progress, 0, 1);
    return {
      opacity:
        phase === "assembly"
          ? p
          : phase === "capability" || phase === "invitation" || phase === "idle"
            ? 0.4
            : 0,
      transform: `scaleX(${phase === "assembly" ? p : 1})`,
      transformOrigin: "left center",
    };
  };

  return (
    <div
      ref={containerRef}
      className={`assembly-visual ${className}`}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredStage(null)}
      style={{ "--primary-color": stages[0].color }}
    >
      <div
        className="assembly-orbit orbit-one"
        aria-hidden="true"
        style={orbitStyle(0)}
      />
      <div
        className="assembly-orbit orbit-two"
        aria-hidden="true"
        style={orbitStyle(1)}
      />
      <div
        className="assembly-path path-one"
        aria-hidden="true"
        style={pathStyle(0)}
      />
      <div
        className="assembly-path path-two"
        aria-hidden="true"
        style={pathStyle(1)}
      />

      {stages.map((stage, index) => (
        <div
          key={stage.id}
          className="assembly-plane"
          style={getStageTransform(index, stagePositions[index])}
          onMouseEnter={() => !reduced && setHoveredStage(index)}
          onMouseLeave={() => setHoveredStage(null)}
        >
          <div className="plane-content">
            <span className="plane-label">{stage.label}</span>
            <div className="plane-icon" style={{ color: stage.color }}>
              <stage.icon size={24} />
            </div>
            <strong className="plane-title">{stage.title}</strong>
          </div>
        </div>
      ))}

      <div className="assembly-core" style={coreStyle}>
        <Layers3 size={32} />
        <span className="core-label">One Assembly</span>
      </div>

      <div className="assembly-status">
        <span className="status-dot" style={{ background: stages[0].color }} />
        AUTOMATE → OPERATE → GROW
      </div>

      <div
        className="assembly-capability-preview"
        style={{
          opacity:
            phase === "capability" || phase === "invitation" || phase === "idle"
              ? 1
              : 0,
          transition: `opacity ${timing.narrative.base}ms ${easing.decelerate}`,
        }}
      >
        {stages.slice(3).map((stage, index) => (
          <div
            key={stage.id}
            className="capability-indicator"
            style={{
              transitionDelay: `${index * 100}ms`,
              borderColor: `${stage.color}60`,
            }}
          >
            <stage.icon size={14} style={{ color: stage.color }} />
            <span>{stage.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssemblyVisualStatic({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`assembly-visual ${className}`}
      aria-label="The GSTPIXEL Assembly — six connected stages from idea to growth"
      style={{ "--primary-color": "oklch(0.79 0.142 197)" }}
    >
      <div className="assembly-orbit orbit-one" aria-hidden="true" />
      <div className="assembly-orbit orbit-two" aria-hidden="true" />
      <div className="assembly-path path-one" aria-hidden="true" />
      <div className="assembly-path path-two" aria-hidden="true" />
      {stages.map((stage, index) => (
        <div
          key={stage.id}
          className="assembly-plane"
          style={{ ...stagePositions[index], zIndex: index + 1 }}
        >
          <div className="plane-content">
            <span className="plane-label">{stage.label}</span>
            <div className="plane-icon" style={{ color: stage.color }}>
              <stage.icon size={24} />
            </div>
            <strong className="plane-title">{stage.title}</strong>
          </div>
        </div>
      ))}
      <div className="assembly-core">
        <Layers3 size={32} />
        <span className="core-label">One Assembly</span>
      </div>
      <div className="assembly-status">
        <span className="status-dot" /> AUTOMATE → OPERATE → GROW
      </div>
      <div className="assembly-capability-preview">
        {stages.slice(3).map((stage) => (
          <div
            key={stage.id}
            className="capability-indicator"
            style={{ borderColor: `${stage.color}60` }}
          >
            <stage.icon size={14} style={{ color: stage.color }} />
            <span>{stage.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
