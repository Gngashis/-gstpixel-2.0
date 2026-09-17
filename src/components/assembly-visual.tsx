"use client";

import { BarChart2, Cpu, Globe, Layers3, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

/**
 * The GSTPIXEL Assembly.
 *
 * One instrument showing the six stages a business moves through. Each stage
 * brightens from its own environment weight, so the Assembly advances in step
 * with the page instead of playing a fixed intro animation.
 *
 * Motion is written to CSS custom properties only: no React state is set while
 * scrolling or while the pointer moves.
 */

const stages = [
  { id: "idea", index: "01", role: "Input", title: "Idea", icon: Sparkles },
  { id: "design", index: "02", role: "Form", title: "Design", icon: Globe },
  { id: "build", index: "03", role: "System", title: "Build", icon: Cpu },
  { id: "automate", index: "04", role: "Flow", title: "Automate", icon: Zap },
  {
    id: "operate",
    index: "05",
    role: "Run",
    title: "Operate",
    icon: BarChart2,
  },
  { id: "grow", index: "06", role: "Scale", title: "Grow", icon: Layers3 },
] as const;

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
        <div className="asm-core">
          <div className="asm-core-ring">
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

        <ol className="asm-stages">
          {stages.map(({ id, index, role, title, icon: Icon }, i) => (
            <li
              key={id}
              className="asm-stage"
              data-stage={id}
              style={{
                ["--stage-weight" as string]: `var(--env-w${i}, 0)`,
              }}
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
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
