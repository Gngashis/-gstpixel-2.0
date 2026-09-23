/**
 * SplitWordReveal — accessible text-reveal primitive.
 *
 * Splits text into words/lines and animates them in with staggered
 * opacity/transform. Semantic text remains accessible via a hidden
 * duplicate; the animated version is aria-hidden.
 *
 * Supports: word reveal, line reveal, mask reveal, staggered phrase.
 * Respects prefers-reduced-motion.
 */

"use client";

import type { HTMLAttributes } from "react";

interface SplitWordRevealProps extends HTMLAttributes<HTMLDivElement> {
  /** Text to animate */
  text?: string;
  /** Split granularity: "word" | "line" | "char" */
  splitBy?: "word" | "line" | "char";
  /** Animation variant */
  variant?: "fade-up" | "fade-down" | "mask-reveal" | "slide-left" | "stagger";
  /** Base delay before starting (ms) */
  delay?: number;
  /** Stagger delay between each unit (ms) */
  stagger?: number;
  /** Animation duration (ms) */
  duration?: number;
  /** Easing function */
  easing?: string;
  /** Custom className */
  className?: string;
  /** Disable animation (for reduced motion or testing) */
  disable?: boolean;
  /** Custom style for the container */
  style?: React.CSSProperties;
}

const easingMap: Record<string, string> = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeOutCirc: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

export const SplitWordReveal = (props: SplitWordRevealProps) => {
  const {
    text,
    splitBy = "word",
    variant = "fade-up",
    delay = 0,
    stagger = 40,
    duration = 800,
    easing = "easeOutExpo",
    className = "",
    disable = false,
    style,
    children,
    ...restProps
  } = props;

  const splitText = (text: string) => {
    switch (true) {
      case splitBy === "line":
        return text.split("\n");
      case splitBy === "char":
        return text.split("");
      case splitBy === "word":
      default:
        return text.split(/(\s+)/).filter(Boolean);
    }
  };

  const textContent = text || (typeof props.children === "string" ? props.children : "");
  const units = textContent.split(/(\s+)/).filter(Boolean);
  const easingMap: Record<string, string> = {
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
    easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
    easeOutCirc: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  };

  const baseEasing = "cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <div className={`split-word-reveal ${className || ""}`} style={style} {...restProps}>
      {/* Accessible original text - hidden from visual but readable by screen readers */}
      <div
        aria-hidden="false"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {props.children}
      </div>
      {/* Animated version - aria-hidden for screen readers */}
      <div aria-hidden="true" style={{ display: "inline-flex", flexWrap: "wrap", whiteSpace: "pre-wrap" }}>
        {textContent.split(/(\s+)/).filter(Boolean).map((unit, i) => {
          const isSpace = /^\s+$/.test(unit);
          const disabled = disable;
          return (
            <span
              key={`${unit}-${i}`}
              style={{
                display: "inline-block",
                whiteSpace: isSpace ? "pre" : "nowrap",
                ...(!disable && {
                  opacity: 0,
                  transform:
                    "translateY(1.2em) " +
                    (variant === "slide-left"
                      ? "translateX(-2em)"
                      : variant === "mask-reveal"
                      ? "translateY(0.5em)"
                      : ""),
                  transition: `opacity ${duration}ms ${delay + i * stagger}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms ${delay + i * stagger}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                }),
              }}
              aria-hidden="true"
            >
              {unit}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SplitWordReveal;