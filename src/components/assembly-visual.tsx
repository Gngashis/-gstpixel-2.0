"use client";

import {
  BarChart2,
  Cpu,
  Globe,
  Layers3,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useReducedMotion } from "@/lib/motion";

/**
 * The GSTPIXEL Assembly — interactive navigation instrument.
 *
 * Each of the six stages is a keyboard-accessible, tappable, clickable control
 * that navigates to the most relevant existing GSTPIXEL destination.
 */

interface StageDef {
  id: string;
  index: string;
  role: string;
  title: string;
  icon: typeof Sparkles;
  /** Contextual descriptor shown on desktop hover/focus. */
  hint: string;
  /** Navigation destination. */
  to: string;
}

const stages: StageDef[] = [
  {
    id: "idea",
    index: "01",
    role: "Input",
    title: "Idea",
    icon: Sparkles,
    hint: "Define the opportunity",
    to: "/start-your-project",
  },
  {
    id: "design",
    index: "02",
    role: "Form",
    title: "Design",
    icon: Globe,
    hint: "Shape the experience",
    to: "/services/websites-digital-platforms",
  },
  {
    id: "build",
    index: "03",
    role: "System",
    title: "Build",
    icon: Cpu,
    hint: "Engineer the system",
    to: "/services/web-mobile-applications",
  },
  {
    id: "automate",
    index: "04",
    role: "Flow",
    title: "Automate",
    icon: Zap,
    hint: "Connect intelligent workflows",
    to: "/services#automation",
  },
  {
    id: "operate",
    index: "05",
    role: "Run",
    title: "Operate",
    icon: BarChart2,
    hint: "Run the business",
    to: "/services/business-setup-compliance",
  },
  {
    id: "grow",
    index: "06",
    role: "Scale",
    title: "Grow",
    icon: Layers3,
    hint: "Scale what works",
    to: "/services/digital-growth-consulting",
  },
];

interface AssemblyVisualProps {
  className?: string;
  ariaLabel?: string;
}

export function AssemblyVisual({
  className = "",
  ariaLabel = "The GSTPIXEL Assembly — six connected stages from idea to growth",
}: AssemblyVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const pointerRef = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  /** Currently hovered/focused stage index (-1 = none). */
  const [activeIdx, setActiveIdx] = useState(-1);
  /** Index of the stage being pressed (touch/click down). */
  const [pressedIdx, setPressedIdx] = useState(-1);
  /** Stage that just completed selection (for transition animation). */
  const [selectedIdx, setSelectedIdx] = useState(-1);

  /* Pointer depth response. Writes CSS variables directly and parks the frame
     loop as soon as the pointer stops. Disabled for coarse pointers, where it
     would only cost battery. */
  useEffect(() => {
    const node = containerRef.current;
    if (!node || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const apply = () => {
      frameRef.current = undefined;
      const { x, y } = pointerRef.current;
      node.style.setProperty("--asm-px", x.toFixed(3));
      node.style.setProperty("--asm-py", y.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      pointerRef.current = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(apply);
      }
    };

    const onLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(apply);
      }
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frameRef.current !== undefined)
        cancelAnimationFrame(frameRef.current);
    };
  }, [reduced]);

  /** Navigate to a stage's destination with a brief selection transition. */
  const handleStageNav = useCallback(
    (stage: StageDef, idx: number) => {
      setSelectedIdx(idx);
      // Brief visual transition before navigation begins
      setTimeout(() => {
        navigate({ to: stage.to });
        setSelectedIdx(-1);
      }, reduced ? 0 : 280);
    },
    [navigate, reduced],
  );

  /** Tap safety: distinguish tap from scroll. */
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const isScrolling = useRef(false);

  const handleTouchStart = useCallback(
    (idx: number) => (e: React.TouchEvent) => {
      isScrolling.current = false;
      const t = e.touches[0];
      if (t) {
        touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
      }
      setPressedIdx(idx);
    },
    [],
  );

  const handleTouchMove = useCallback(() => {
    // If the user is scrolling, mark it so we don't trigger navigation
    isScrolling.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (stage: StageDef, idx: number) => () => {
      setPressedIdx(-1);
      if (isScrolling.current) return;
      if (!touchStart.current) return;
      const elapsed = Date.now() - touchStart.current.time;
      // Reject very slow holds (>500ms) as they're likely scroll intent
      if (elapsed > 500) return;
      handleStageNav(stage, idx);
    },
    [handleStageNav],
  );

  return (
    <div
      ref={containerRef}
      className={`asm ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="asm-depth" aria-hidden="true">
        <div className="asm-aura" />
        <div className="asm-orbit asm-orbit-outer" />
        <div className="asm-orbit asm-orbit-inner" />
      </div>

      <div className="asm-instrument">
        <div className={`asm-core${selectedIdx >= 0 ? " asm-core-pulse" : ""}`}>
          <div className="asm-core-ring">
            <span className="asm-core-scan" aria-hidden="true" />
            <Layers3 className="asm-core-icon" aria-hidden="true" />
          </div>
          <p className="asm-core-label">One assembly</p>
          <p className="asm-core-meta">
            Idea <span aria-hidden="true">→</span> Grow
          </p>
        </div>

        <div className="asm-track" aria-hidden="true">
          <svg
            className="asm-track-svg"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path className="asm-track-base" d="M1 0 V100" pathLength="100" />
            <path className="asm-track-fill" d="M1 0 V100" pathLength="100" />
          </svg>
        </div>

        <ol className="asm-stages" role="list">
          {stages.map((stage, i) => {
              const { id, index, role, title, icon: Icon, hint } = stage;
              const isActive = activeIdx === i;
              const isPressed = pressedIdx === i;
              const isSelected = selectedIdx === i;
              const isDimmed = selectedIdx >= 0 && selectedIdx !== i;

              return (
                <li
                  key={id}
                  className={[
                    "asm-stage",
                    isActive ? "asm-stage-active" : "",
                    isPressed ? "asm-stage-pressed" : "",
                    isSelected ? "asm-stage-selected" : "",
                    isDimmed ? "asm-stage-dimmed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  data-stage={id}
                  style={{
                    ["--stage-weight" as string]: `var(--env-w${i}, 0)`,
                  }}
                >
                  <span className="asm-stage-flow" aria-hidden="true" />

                  <button
                    type="button"
                    className="asm-stage-btn"
                    aria-label={`${title}: ${hint}`}
                    tabIndex={0}
                    onClick={() => handleStageNav(stage, i)}
                    onPointerEnter={() => setActiveIdx(i)}
                    onPointerLeave={() => setActiveIdx(-1)}
                    onFocus={() => setActiveIdx(i)}
                    onBlur={() => setActiveIdx(-1)}
                    onTouchStart={handleTouchStart(i)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd(stage, i)}
                    onMouseDown={() => setPressedIdx(i)}
                    onMouseUp={() => setPressedIdx(-1)}
                  >
                    <span className="asm-stage-node">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <span className="asm-stage-text">
                      <span className="asm-stage-meta">
                        {index} / {role}
                      </span>
                      <strong>{title}</strong>
                    </span>
                    <span className="asm-stage-hint" aria-hidden="true">
                      {hint}
                    </span>
                    <ArrowRight
                      size={12}
                      className="asm-stage-arrow"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            },
          )}
        </ol>
      </div>
    </div>
  );
}
