"use client";

import { Layers3, Sparkles, Zap, Cpu, Globe, BarChart2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, timing, easing, lerp, clamp } from "@/lib/motion";

const stages = [
  {
    id: "idea",
    label: "01 / Input",
    title: "Idea",
    icon: Sparkles,
    color: "oklch(0.79 0.142 197)",
    phaseIndex: 0,
  },
  {
    id: "design",
    label: "02 / Form",
    title: "Design",
    icon: Globe,
    color: "oklch(0.64 0.1 55)",
    phaseIndex: 1,
  },
  {
    id: "build",
    label: "03 / System",
    title: "Build",
    icon: Cpu,
    color: "oklch(0.79 0.142 197)",
    phaseIndex: 2,
  },
  {
    id: "automate",
    label: "04 / Flow",
    title: "Automate",
    icon: Zap,
    color: "oklch(0.79 0.142 197)",
    phaseIndex: 3,
  },
  {
    id: "operate",
    label: "05 / Run",
    title: "Operate",
    icon: BarChart2,
    color: "oklch(0.64 0.1 55)",
    phaseIndex: 4,
  },
  {
    id: "grow",
    label: "06 / Scale",
    title: "Grow",
    icon: Layers3,
    color: "oklch(0.79 0.142 197)",
    phaseIndex: 5,
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
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>();
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
    let lastProgressUpdate = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const current = sequence[currentIndex];

      if (current.phase !== "idle") {
        const newProgress = Math.min(1, elapsed / current.duration);
        if (now - lastProgressUpdate >= 33) {
          lastProgressUpdate = now;
          setProgress(newProgress);
        }
      }

      if (elapsed >= current.duration && currentIndex < sequence.length - 1) {
        currentIndex++;
        startTime = now;
        lastProgressUpdate = 0;
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

  useEffect(() => {
    if (reduced) return;

    const updatePointer = () => {
      rafRef.current = requestAnimationFrame(updatePointer);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      pointerRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(updatePointer);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

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

    const px = (pointerRef.current.x - 0.5) * 20;
    const py = (pointerRef.current.y - 0.5) * 20;
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

  const coreScale =
    phase === "assembly"
      ? progress
      : phase === "capability" || phase === "invitation" || phase === "idle"
        ? 1
        : 0;
  const coreOpacity = phase === "arrival" || phase === "recognition" ? 0 : 1;

  const orbitOpacity = (index: number) => {
    const p = clamp(progress, 0, 1);
    if (phase === "arrival") return p * 0.3;
    if (phase === "recognition") return 0.3 + p * 0.3;
    return 0.6;
  };

  const orbitScale = (index: number) =>
    phase === "assembly" ? clamp(progress, 0, 1) : 1;
  const orbitBorderAlpha = (p: number) =>
    Math.floor(16 + 20 * p)
      .toString(16)
      .padStart(2, "0");

  const pathOpacity = () => {
    const p = clamp(progress, 0, 1);
    if (phase === "assembly") return p;
    if (phase === "capability" || phase === "invitation" || phase === "idle")
      return 0.4;
    return 0;
  };

  const pathScale = () => (phase === "assembly" ? clamp(progress, 0, 1) : 1);

  const ambientOpacity = phase === "idle" ? 1 : progress;

  const capabilityOpacity =
    phase === "capability" || phase === "invitation" || phase === "idle"
      ? 1
      : 0;

  const primaryColor = stages[0].color;

  return (
    <div
      ref={containerRef}
      className={`assembly-visual ${className}`}
      aria-label={ariaLabel}
      onMouseLeave={() => setHoveredStage(null)}
      style={
        {
          "--primary-color": primaryColor,
          "--pointer-x": pointerRef.current.x,
          "--pointer-y": pointerRef.current.y,
        } as React.CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .assembly-visual .assembly-core {
            animation: core-breathe 5s ease-in-out infinite;
          }
          .assembly-visual .assembly-core::before {
            content: "";
            position: absolute;
            inset: 0.5rem;
            border-radius: 50%;
            border: 1px solid color-mix(in oklab, ${primaryColor} 30%, transparent);
            opacity: 0.6;
            animation: core-breathe 4s ease-in-out infinite;
          }
          .assembly-visual .orbit-one {
            animation: orbit-drift-1 20s linear infinite;
          }
          .assembly-visual .orbit-two {
            animation: orbit-drift-2 30s linear infinite;
          }
          @keyframes core-breathe {
            0%, 100% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.03);
            }
          }
          @keyframes core-glow-pulse {
            0%, 100% {
              box-shadow: 0 0 50px color-mix(in oklab, ${primaryColor} 12%, transparent);
            }
            50% {
              box-shadow: 0 0 90px color-mix(in oklab, ${primaryColor} 20%, transparent);
            }
          }
          @keyframes orbit-drift-1 {
            to { transform: rotate(360deg) skewX(-12deg); }
          }
          @keyframes orbit-drift-2 {
            to { transform: rotate(360deg) skewX(-12deg); }
          }
        `,
        }}
      />
      {/* Ambient orbital glow */}
      <div
        className="assembly-ambient-glow"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20%",
          background: `radial-gradient(ellipse at 30% 20%, ${primaryColor}15, transparent 60%), radial-gradient(ellipse at 70% 80%, ${stages[1].color}10, transparent 50%)`,
          pointerEvents: "none",
          opacity: ambientOpacity,
          transition: `opacity ${timing.narrative.base}ms ${easing.decelerate}`,
        }}
      />

      <div
        className="assembly-orbit orbit-one"
        aria-hidden="true"
        style={{
          opacity: orbitOpacity(0),
          transform: `rotate(0deg) skewX(-12deg) scale(${orbitScale(0)})`,
          borderColor: `${primaryColor}${orbitBorderAlpha(clamp(progress, 0, 1))}`,
        }}
      />
      <div
        className="assembly-orbit orbit-two"
        aria-hidden="true"
        style={{
          opacity: orbitOpacity(1),
          transform: `rotate(0deg) skewX(-12deg) scale(${orbitScale(1)})`,
          borderColor: `${primaryColor}${orbitBorderAlpha(clamp(progress, 0, 1))}`,
        }}
      />
      <div
        className="assembly-path path-one"
        aria-hidden="true"
        style={{
          opacity: pathOpacity(),
          transform: `scaleX(${pathScale()})`,
          transformOrigin: "left center",
        }}
      />
      <div
        className="assembly-path path-two"
        aria-hidden="true"
        style={{
          opacity: pathOpacity(),
          transform: `scaleX(${pathScale()})`,
          transformOrigin: "left center",
        }}
      />

      {/* Connection lines between planes */}
      <svg
        className="assembly-connections"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {stages.slice(0, 3).map((_, i) => (
          <line
            key={i}
            x1={`${stagePositions[i].x * 100}%`}
            y1={`${stagePositions[i].y * 100}%`}
            x2={`${corePosition.x * 100}%`}
            y2={`${corePosition.y * 100}%`}
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="8,4"
            opacity={
              phase === "assembly"
                ? progress * 0.4
                : phase === "capability" ||
                    phase === "invitation" ||
                    phase === "idle"
                  ? 0.4
                  : 0
            }
            style={{
              transition: `opacity ${timing.narrative.base}ms ${easing.decelerate}`,
              filter: "drop-shadow(0 0 4px currentColor)",
            }}
          />
        ))}
      </svg>

      {stages.map((stage, index) => (
        <div
          key={stage.id}
          className="assembly-plane"
          style={{
            ...getStageTransform(index, stagePositions[index]),
            zIndex: hoveredStage === index ? 8 : 2 + index,
            background: `color-mix(in oklab, var(--env-current-glass-tint) 85%, transparent)`,
            backdropFilter: "blur(24px)",
            border: `1px solid ${index === hoveredStage ? stage.color : `color-mix(in oklab, ${stage.color} 40%, transparent)`}`,
            boxShadow: `
              inset 0 1px 0 color-mix(in oklab, ${stage.color} 20%, transparent),
              0 8px 32px color-mix(in oklab, ${stage.color} 15%, transparent),
              ${hoveredStage === index ? `0 0 0 1px ${stage.color}, 0 0 24px ${stage.color}30` : "0 0 20px color-mix(in oklab, var(--color-brand-primary) 8%, transparent)"}
            `,
            borderRadius: "0.75rem",
            transition: `
              transform ${timing.structural.base}ms ${easing.expressive},
              border-color ${timing.micro.base}ms ${easing.standard},
              box-shadow ${timing.micro.base}ms ${easing.standard},
              background ${timing.structural.base}ms ${easing.standard}
            `,
          }}
          onMouseEnter={() => !reduced && setHoveredStage(index)}
          onMouseLeave={() => setHoveredStage(null)}
        >
          <div className="plane-content">
            <span className="plane-label">{stage.label}</span>
            <div className="plane-icon" style={{ color: stage.color }}>
              <stage.icon size={24} />
            </div>
            <strong className="plane-title">{stage.title}</strong>
            <div
              className="plane-luminous-edge"
              style={{
                position: "absolute",
                inset: "-1px",
                borderRadius: "inherit",
                border: `1px solid ${stage.color}`,
                opacity: hoveredStage === index ? 1 : 0,
                pointerEvents: "none",
                transition: `opacity ${timing.micro.base}ms ${easing.standard}`,
                filter: `drop-shadow(0 0 8px ${stage.color})`,
              }}
            />
          </div>
        </div>
      ))}

      <div
        className="assembly-core"
        style={{
          transform: `translate(-50%, -50%) scale(${coreScale})`,
          opacity: coreOpacity,
          transition: `transform ${timing.narrative.base}ms ${easing.spring}, opacity ${timing.structural.base}ms ${easing.standard}`,
          background: `
            radial-gradient(circle at 30% 30%, color-mix(in oklab, ${primaryColor} 20%, transparent), transparent 50%),
            color-mix(in oklab, var(--env-current-glass-tint) 90%, transparent)
          `,
          backdropFilter: "blur(32px)",
          border: `1px solid color-mix(in oklab, ${primaryColor} 50%, transparent)`,
          boxShadow: `
            0 0 80px color-mix(in oklab, ${primaryColor} 25%, transparent),
            inset 0 1px 0 color-mix(in oklab, ${primaryColor} 30%, transparent),
            inset 0 -1px 0 color-mix(in oklab, ${primaryColor} 10%, transparent)
          `,
          borderRadius: "50%",
        }}
      >
        <Layers3
          size={32}
          style={{ filter: `drop-shadow(0 0 8px ${primaryColor})` }}
        />
        <span className="core-label">One Assembly</span>
      </div>

      <div className="assembly-status">
        <span
          className="status-dot"
          style={{
            background: primaryColor,
            boxShadow: `0 0 12px ${primaryColor}`,
            animation: "status-pulse 2s ease-in-out infinite",
          }}
        />
        AUTOMATE → OPERATE → GROW
      </div>

      <div
        className="assembly-capability-preview"
        style={{
          opacity: capabilityOpacity,
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
              background: `color-mix(in oklab, var(--env-current-glass-tint) 80%, transparent)`,
              backdropFilter: "blur(16px)",
              border: `1px solid ${stage.color}60`,
              boxShadow: `inset 0 1px 0 color-mix(in oklab, ${stage.color} 15%, transparent)`,
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
      <div
        className="assembly-ambient-glow"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20%",
          background: `radial-gradient(ellipse at 30% 20%, oklch(0.79 0.142 197 / 0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, oklch(0.64 0.1 55 / 0.1), transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div className="assembly-orbit orbit-one" aria-hidden="true" />
      <div className="assembly-orbit orbit-two" aria-hidden="true" />
      <div className="assembly-path path-one" aria-hidden="true" />
      <div className="assembly-path path-two" aria-hidden="true" />

      <svg
        className="assembly-connections"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {stages.slice(0, 3).map((_, i) => (
          <line
            key={i}
            x1={`${stagePositions[i].x * 100}%`}
            y1={`${stagePositions[i].y * 100}%`}
            x2={`${corePosition.x * 100}%`}
            y2={`${corePosition.y * 100}%`}
            stroke="oklch(0.79 0.142 197)"
            strokeWidth="1"
            strokeDasharray="8,4"
            opacity="0.4"
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
          />
        ))}
      </svg>

      {stages.map((stage, index) => (
        <div
          key={stage.id}
          className="assembly-plane"
          style={{
            ...stagePositions[index],
            zIndex: index + 1,
            background: `color-mix(in oklab, var(--env-idea-glass-tint) 85%, transparent)`,
            backdropFilter: "blur(24px)",
            border: `1px solid color-mix(in oklab, ${stage.color} 40%, transparent)`,
            boxShadow: `
              inset 0 1px 0 color-mix(in oklab, ${stage.color} 20%, transparent),
              0 8px 32px color-mix(in oklab, ${stage.color} 15%, transparent),
              0 0 20px color-mix(in oklab, var(--color-brand-primary) 8%, transparent)
            `,
            borderRadius: "0.75rem",
          }}
        >
          <div className="plane-content">
            <span className="plane-label">{stage.label}</span>
            <div className="plane-icon" style={{ color: stage.color }}>
              <stage.icon size={24} />
            </div>
            <strong className="plane-title">{stage.title}</strong>
            <div
              className="plane-luminous-edge"
              style={{
                position: "absolute",
                inset: "-1px",
                borderRadius: "inherit",
                border: `1px solid ${stage.color}`,
                opacity: 0,
                pointerEvents: "none",
                filter: `drop-shadow(0 0 8px ${stage.color})`,
              }}
            />
          </div>
        </div>
      ))}

      <div
        className="assembly-core"
        style={{
          transform: "translate(-50%, -50%)",
          display: "grid",
          placeItems: "center",
          gap: "0.6rem",
          width: "9rem",
          height: "9rem",
          border:
            "1px solid color-mix(in oklab, oklch(0.79 0.142 197) 50%, transparent)",
          borderRadius: "50%",
          background: `
          radial-gradient(circle at 30% 30%, color-mix(in oklab, oklch(0.79 0.142 197) 20%, transparent), transparent 50%),
          color-mix(in oklab, var(--env-idea-glass-tint) 90%, transparent)
        `,
          backdropFilter: "blur(32px)",
          color: "oklch(0.79 0.142 197)",
          boxShadow: `
          0 0 80px color-mix(in oklab, oklch(0.79 0.142 197) 25%, transparent),
          inset 0 1px 0 color-mix(in oklab, oklch(0.79 0.142 197) 30%, transparent),
          inset 0 -1px 0 color-mix(in oklab, oklch(0.79 0.142 197) 10%, transparent)
        `,
          zIndex: 10,
          borderRadius: "50%",
          left: "50%",
          top: "50%",
          position: "absolute",
        }}
      >
        <Layers3
          size={32}
          style={{ filter: "drop-shadow(0 0 8px oklch(0.79 0.142 197))" }}
        />
        <span className="core-label">One Assembly</span>
        <div
          style={{
            position: "absolute",
            inset: "0.5rem",
            borderRadius: "50%",
            border:
              "1px solid color-mix(in oklab, oklch(0.79 0.142 197) 30%, transparent)",
            opacity: 0.6,
            animation: "core-breathe 4s ease-in-out infinite",
          }}
        />
      </div>

      <div className="assembly-status">
        <span
          className="status-dot"
          style={{
            background: "oklch(0.79 0.142 197)",
            boxShadow: "0 0 12px oklch(0.79 0.142 197)",
            animation: "status-pulse 2s ease-in-out infinite",
          }}
        />
        AUTOMATE → OPERATE → GROW
      </div>

      <div className="assembly-capability-preview">
        {stages.slice(3).map((stage) => (
          <div
            key={stage.id}
            className="capability-indicator"
            style={{
              borderColor: `${stage.color}60`,
              background: `color-mix(in oklab, var(--env-idea-glass-tint) 80%, transparent)`,
              backdropFilter: "blur(16px)",
              border: `1px solid ${stage.color}60`,
              boxShadow: `inset 0 1px 0 color-mix(in oklab, ${stage.color} 15%, transparent)`,
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
