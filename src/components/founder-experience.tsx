"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { businessFacts } from "@/lib/content";
import { useIntersection, useReducedMotion } from "@/lib/motion";

export const founderAlt = "Ashis Gurung, founder of GSTPIXEL in Jaigaon";

export function FounderPicture({ chip = false }: { chip?: boolean }) {
  if (chip) {
    return (
      <picture>
        <source srcSet="/founder-chip-128.webp" type="image/webp" />
        <img
          src="/founder-chip-128.jpg"
          alt={founderAlt}
          width={128}
          height={128}
          loading="eager"
          decoding="async"
        />
      </picture>
    );
  }

  return (
    <picture>
      <source
        srcSet="/founder-portrait-440.webp 440w, /founder-portrait-560.webp 560w, /founder-portrait-640.webp 640w"
        sizes="(max-width: 767px) calc(100vw - 3rem), 44vw"
        type="image/webp"
      />
      <img
        src="/founder-portrait-640.jpg"
        srcSet="/founder-portrait-440.jpg 440w, /founder-portrait-560.jpg 560w, /founder-portrait-640.jpg 640w"
        sizes="(max-width: 767px) calc(100vw - 3rem), 44vw"
        alt={founderAlt}
        width={640}
        height={800}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

export function FounderHeroSignal() {
  const handleFounderJump = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const founder = document.getElementById("founder");
    if (!founder) return;

    event.preventDefault();
    window.history.pushState(null, "", "#founder");
    founder.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <a
      className="founder-signal"
      href="#founder"
      aria-label="Meet Ashis Gurung, founder of GSTPIXEL"
      onClick={handleFounderJump}
    >
      <span className="founder-signal-portrait" aria-hidden="true">
        <FounderPicture chip />
      </span>
      <span className="founder-signal-copy">
        <strong>{businessFacts.founder}</strong>
        <span>{businessFacts.founderTitleExtended} · Jaigaon</span>
      </span>
      <ArrowDown
        className="founder-signal-arrow"
        size={15}
        aria-hidden="true"
      />
    </a>
  );
}

export function FounderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const pointerRef = useRef({ x: 0, y: 0 });
  const visible = useIntersection(sectionRef, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const apply = () => {
      frameRef.current = undefined;
      node.style.setProperty("--founder-px", pointerRef.current.x.toFixed(3));
      node.style.setProperty("--founder-py", pointerRef.current.y.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      pointerRef.current = {
        x: Math.max(
          -0.5,
          Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
        ),
        y: Math.max(
          -0.5,
          Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
        ),
      };
      if (frameRef.current === undefined)
        frameRef.current = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
      if (frameRef.current === undefined)
        frameRef.current = requestAnimationFrame(apply);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (frameRef.current !== undefined)
        cancelAnimationFrame(frameRef.current);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className={`founder-section content-band env-section${visible || reduced ? " is-visible" : ""}`}
      data-env-phase="5"
      aria-labelledby="founder-heading"
      tabIndex={-1}
    >
      <div className="founder-environment" aria-hidden="true" />
      <div className="site-container founder-layout">
        <p className="label text-primary founder-label">FOUNDER / 01</p>
        <div className="founder-visual">
          <div className="founder-trace" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="founder-portrait-shell">
            <div className="founder-frame-edge" aria-hidden="true" />
            <div className="founder-portrait">
              <FounderPicture />
            </div>
            <div className="founder-vignette" aria-hidden="true" />
            <div className="founder-frame-reflection" aria-hidden="true" />
            <span
              className="founder-frame-corner founder-frame-corner-top"
              aria-hidden="true"
            />
            <span
              className="founder-frame-corner founder-frame-corner-bottom"
              aria-hidden="true"
            />
          </div>
          <div className="founder-glass" aria-hidden="true">
            <span>HUMAN DIRECTION</span>
            <span>ENGINEERED DELIVERY</span>
          </div>
          <div
            className="founder-registration founder-registration-top"
            aria-hidden="true"
          >
            <span>FOUNDER / 01</span>
            <i />
          </div>
          <div
            className="founder-registration founder-registration-bottom"
            aria-hidden="true"
          >
            <i />
            <span>JAIGAON, INDIA</span>
          </div>
        </div>

        <div className="founder-copy">
          <div className="founder-identity">
            <strong>{businessFacts.founder}</strong>
            <span>{businessFacts.founderTitleExtended}</span>
          </div>
          <h2 id="founder-heading" className="founder-heading">
            <span>Built with engineering.</span>
            <span>Directed with purpose.</span>
          </h2>
          <p>
            A real person in Jaigaon directs GSTPIXEL’s digital development,
            automation, and business technology work. Every project is shaped
            through human judgment, practical business understanding, technical
            implementation, and direct accountability—for businesses locally,
            across India, and through the India–Bhutan gateway.
          </p>
          <ButtonLink to="/start-your-project" className="founder-cta">
            Start a conversation <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
