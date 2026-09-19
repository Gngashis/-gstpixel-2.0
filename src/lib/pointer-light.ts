import { useEffect, useRef } from "react";

/**
 * Cursor-lit glass specular.
 *
 * One delegated `pointermove` listener writes `--lit-x` / `--lit-y` on
 * whichever lit-capable surface sits under the pointer; the frame callback
 * parks itself the moment the pointer stops, so an idle page runs no animation
 * frames and there is no global trail — only the surface under the cursor
 * carries a local sheen. Fine pointers only: touch keeps the environmental
 * lighting, and reduced-motion users get none of it.
 */

const LIT_SELECTOR =
  ".assembly-panel, .concept-card, .founder-signal, .glass-below-fold, .service-card, .solution-card, .tool-card";

export function initPointerLight(): () => void {
  if (typeof window === "undefined") return () => {};
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  let frame: number | undefined;
  let active: HTMLElement | null = null;
  let pointerX = 0;
  let pointerY = 0;

  const apply = () => {
    frame = undefined;
    if (!active) return;
    const rect = active.getBoundingClientRect();
    active.style.setProperty(
      "--lit-x",
      `${(((pointerX - rect.left) / rect.width) * 100).toFixed(2)}%`,
    );
    active.style.setProperty(
      "--lit-y",
      `${(((pointerY - rect.top) / rect.height) * 100).toFixed(2)}%`,
    );
    active.style.setProperty(
      "--lit-nx",
      (((pointerX - rect.left) / rect.width - 0.5) * 2).toFixed(3),
    );
    active.style.setProperty(
      "--lit-ny",
      (((pointerY - rect.top) / rect.height - 0.5) * 2).toFixed(3),
    );
  };

  const clearActive = () => {
    if (active) {
      active.removeAttribute("data-lit-active");
      active = null;
    }
  };

  const onMove = (event: PointerEvent) => {
    const { target } = event;
    const hit = target instanceof Element ? target.closest(LIT_SELECTOR) : null;
    const next = hit instanceof HTMLElement ? hit : null;
    if (next !== active) {
      clearActive();
      active = next;
      if (active) active.setAttribute("data-lit-active", "");
    }
    if (!active) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame === undefined) frame = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    clearActive();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    if (frame !== undefined) cancelAnimationFrame(frame);
    clearActive();
  };
}

/**
 * Local ambient light and restrained depth for large editorial regions.
 * The element receives normalized pointer coordinates as CSS variables; CSS
 * owns all rendering so React never re-renders while the pointer moves.
 */
export function useAmbientPointer<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
} {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | undefined;
    let x = 0.5;
    let y = 0.4;

    const apply = () => {
      frame = undefined;
      node.style.setProperty("--ambient-x", `${(x * 100).toFixed(2)}%`);
      node.style.setProperty("--ambient-y", `${(y * 100).toFixed(2)}%`);
      node.style.setProperty("--ambient-nx", ((x - 0.5) * 2).toFixed(3));
      node.style.setProperty("--ambient-ny", ((y - 0.5) * 2).toFixed(3));
    };

    const schedule = () => {
      if (frame === undefined) frame = requestAnimationFrame(apply);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      node.setAttribute("data-ambient-active", "");
      schedule();
    };

    const onLeave = () => {
      x = 0.5;
      y = 0.4;
      node.removeAttribute("data-ambient-active");
      schedule();
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref };
}

/**
 * Subtle magnetic pull for a few major CTAs.
 *
 * The wrapper element (not the control) carries the shift, so the control's
 * own hover/press transforms stay untouched. Fine pointers only, capped at a
 * few pixels, and the RAF loop parks as soon as the pointer rests or leaves.
 */
export function useMagnetic<T extends HTMLElement>(
  maxShift = 5,
): {
  ref: React.RefObject<T | null>;
} {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | undefined;
    let shiftX = 0;
    let shiftY = 0;

    const apply = () => {
      frame = undefined;
      node.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      shiftX = Math.max(-maxShift, Math.min(maxShift, dx * 0.16));
      shiftY = Math.max(-maxShift, Math.min(maxShift, dy * 0.16));
      if (frame === undefined) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      shiftX = 0;
      shiftY = 0;
      if (frame === undefined) frame = requestAnimationFrame(apply);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frame !== undefined) cancelAnimationFrame(frame);
      node.style.transform = "";
    };
  }, [maxShift]);

  return { ref };
}
