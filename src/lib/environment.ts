/**
 * The GSTPIXEL Assembly environment engine.
 *
 * Six stages — idea → design → build → automate → operate → grow — are treated
 * as one continuously interpolated environment rather than six discrete section
 * themes. Scroll progress drives stage weights, and the atmosphere layers
 * cross-fade by opacity only, so the evolution stays compositor-friendly.
 *
 * Everything here is plain TypeScript: values are written straight to CSS
 * custom properties on <html> and no React state is touched while scrolling.
 */

/**
 * The GSTPIXEL Assembly environment.
 *
 * Six stages — idea → design → build → automate → operate → grow — are treated
 * as a single continuously interpolated environment rather than six discrete
 * section themes. Scroll position drives stage weights, and the atmosphere
 * layers cross-fade by opacity only so the evolution stays compositor-friendly.
 *
 * All motion is written straight to CSS custom properties on <html>. No React
 * state is updated while scrolling, so the app tree never re-renders per frame.
 */

export const ENV_STAGE_COUNT = 6;

export type EnvStageName =
  "idea" | "design" | "build" | "automate" | "operate" | "grow";

export interface EnvStage {
  id: number;
  name: EnvStageName;
  /** Stage label used by the progression rail. */
  label: string;
  /** Interpolated base surface colour. */
  bg: string;
  /** Interpolated environmental glow colour. */
  glow: string;
  /** Glass tint used by material surfaces. */
  glassTint: string;
  /** Dominant light source position, in viewport percentages. */
  glowX: number;
  glowY: number;
}

/* Stage palettes are interpolated in oklch so hue travel stays perceptually even. */
export const envStages: EnvStage[] = [
  {
    id: 0,
    name: "idea",
    label: "Idea",
    bg: "oklch(0.088 0.014 258)",
    glow: "oklch(0.79 0.142 197 / 0.4)",
    glassTint: "oklch(0.16 0.022 256 / 0.5)",
    glowX: 22,
    glowY: 12,
  },
  {
    id: 1,
    name: "design",
    label: "Design",
    bg: "oklch(0.098 0.017 268)",
    glow: "oklch(0.64 0.1 55 / 0.4)",
    glassTint: "oklch(0.2 0.032 268 / 0.5)",
    glowX: 76,
    glowY: 26,
  },
  {
    id: 2,
    name: "build",
    label: "Build",
    bg: "oklch(0.104 0.019 246)",
    glow: "oklch(0.79 0.142 197 / 0.42)",
    glassTint: "oklch(0.18 0.027 250 / 0.52)",
    glowX: 30,
    glowY: 64,
  },
  {
    id: 3,
    name: "automate",
    label: "Automate",
    bg: "oklch(0.1 0.022 272)",
    glow: "oklch(0.66 0.17 285 / 0.42)",
    glassTint: "oklch(0.2 0.036 276 / 0.54)",
    glowX: 80,
    glowY: 58,
  },
  {
    id: 4,
    name: "operate",
    label: "Operate",
    bg: "oklch(0.107 0.016 238)",
    glow: "oklch(0.68 0.09 168 / 0.4)",
    glassTint: "oklch(0.19 0.024 244 / 0.5)",
    glowX: 34,
    glowY: 34,
  },
  {
    id: 5,
    name: "grow",
    label: "Grow",
    bg: "oklch(0.104 0.016 196)",
    glow: "oklch(0.76 0.12 142 / 0.44)",
    glassTint: "oklch(0.22 0.03 188 / 0.5)",
    glowX: 62,
    glowY: 76,
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

interface Oklch {
  l: number;
  c: number;
  h: number;
  alpha: number;
}

function parseOklch(color: string): Oklch | null {
  const match = color.match(
    /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/,
  );
  if (!match) return null;
  return {
    l: parseFloat(match[1]!),
    c: parseFloat(match[2]!),
    h: parseFloat(match[3]!),
    alpha: match[4] ? parseFloat(match[4]) : 1,
  };
}

function formatOklch(l: number, c: number, h: number, alpha: number): string {
  if (alpha < 1) {
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)} / ${alpha.toFixed(2)})`;
  }
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

function interpolateOklch(a: string, b: string, t: number): string {
  const ca = parseOklch(a);
  const cb = parseOklch(b);
  if (!ca || !cb) return t < 0.5 ? a : b;
  return formatOklch(
    lerp(ca.l, cb.l, t),
    lerp(ca.c, cb.c, t),
    lerp(ca.h, cb.h, t),
    lerp(ca.alpha, cb.alpha, t),
  );
}

/**
 * Tent weighting across the six stages. Adjacent stages always sum to 1, so the
 * atmosphere layers cross-fade continuously instead of switching.
 */
export function stageWeights(progress: number): number[] {
  const p = Math.max(0, Math.min(1, progress));
  const x = p * (ENV_STAGE_COUNT - 1);
  const weights: number[] = [];
  for (let i = 0; i < ENV_STAGE_COUNT; i++) {
    weights.push(Math.max(0, 1 - Math.abs(x - i)));
  }
  return weights;
}

interface InterpolatedEnvironment {
  bg: string;
  glow: string;
  glassTint: string;
  glowX: string;
  glowY: string;
  /** 0 → 1 travel across the whole page. */
  progress: number;
  /** Fractional stage position, e.g. 2.35. */
  stage: number;
  specular: number;
  illumination: number;
  weights: number[];
}

function interpolateEnvironment(progress: number): InterpolatedEnvironment {
  const p = Math.max(0, Math.min(1, progress));
  const x = p * (ENV_STAGE_COUNT - 1);
  const lower = Math.min(ENV_STAGE_COUNT - 1, Math.floor(x));
  const upper = Math.min(ENV_STAGE_COUNT - 1, lower + 1);
  const t = x - lower;

  const a = envStages[lower]!;
  const b = envStages[upper]!;

  /* Key light travels across the viewport as the visitor advances. */
  const travel = Math.sin(p * Math.PI * 1.6);
  const glowX = lerp(a.glowX, b.glowX, t);
  const glowY = lerp(a.glowY, b.glowY, t) + travel * 6;

  return {
    bg: interpolateOklch(a.bg, b.bg, t),
    glow: interpolateOklch(a.glow, b.glow, t),
    glassTint: interpolateOklch(a.glassTint, b.glassTint, t),
    glowX: `${glowX.toFixed(1)}%`,
    glowY: `${glowY.toFixed(1)}%`,
    progress: p,
    stage: x,
    /* Depth cues: specular rises as the light travels, illumination breathes. */
    specular: Number((0.16 + Math.abs(travel) * 0.22).toFixed(3)),
    illumination: Number((0.42 + (1 - Math.abs(travel)) * 0.3).toFixed(3)),
    weights: stageWeights(p),
  };
}

function applyEnvironment(
  root: HTMLElement,
  next: InterpolatedEnvironment,
  previous: InterpolatedEnvironment | null,
): void {
  root.style.setProperty("--env-progress", next.progress.toFixed(4));
  root.style.setProperty("--env-stage", next.stage.toFixed(3));

  for (let i = 0; i < next.weights.length; i++) {
    const w = next.weights[i]!;
    if (!previous || Math.abs(previous.weights[i]! - w) > 0.002) {
      root.style.setProperty(`--env-w${i}`, w.toFixed(4));
      /* Rail emphasis: every stage stays legible, the active one leads. */
      root.style.setProperty(`--env-rail-${i}`, (0.3 + w * 0.7).toFixed(3));
    }
  }

  /* Only rewrite interpolated colour strings when the blend meaningfully moved. */
  const blendMoved =
    !previous ||
    Math.abs(previous.stage - next.stage) > 0.01 ||
    Math.abs(previous.progress - next.progress) > 0.01;

  if (blendMoved) {
    root.style.setProperty("--env-current-bg", next.bg);
    root.style.setProperty("--env-current-glow", next.glow);
    root.style.setProperty("--env-current-glass-tint", next.glassTint);
    root.style.setProperty("--env-glow-x", next.glowX);
    root.style.setProperty("--env-glow-y", next.glowY);
    root.style.setProperty("--env-specular", next.specular.toString());
    root.style.setProperty("--env-illumination", next.illumination.toString());
  }
}

/** Frame-rate independent approach factor for the damped follow. */
function approachFactor(deltaMs: number, durationMs: number): number {
  const clamped = Math.min(deltaMs, 64);
  return 1 - Math.exp(-clamped / durationMs);
}

/* ---------------------------------------------------------------------------
   Single scroll engine.

   One rAF loop owns scroll progress for the whole site: it reads the raw
   target, eases toward it, writes CSS custom properties, and notifies
   subscribers. It parks itself as soon as it settles, so an idle page runs no
   animation frames at all.

   Consumers that only need numbers (progress counters) subscribe; consumers
   that need colour read the CSS variables, which costs nothing extra.
   --------------------------------------------------------------------------- */

type EnvironmentListener = (progress: number, stage: number) => void;

const listeners = new Set<EnvironmentListener>();

let engineAttached = false;
let engineTarget = 0;
let engineCurrent = 0;
let engineFrame: number | undefined;
let engineLastTime = 0;
let engineApplied: InterpolatedEnvironment | null = null;
/** Pauses the environment while the visitor prefers reduced motion. */
let engineStatic = false;

/* ---------------------------------------------------------------------------
   Stage progress from authored sections.

   Pages mark their bands with [data-env-phase]. Where that map exists, scroll
   progress is measured in stage space rather than raw page fraction: while a
   section is read, progress sweeps from its phase to the next one, so stage N
   reaches full weight while section N is on screen. The map is rebuilt only
   when the document height changes, so scrolling costs one height read.
   --------------------------------------------------------------------------- */

interface SectionMark {
  top: number;
  height: number;
  phase: number;
}

interface SectionMap {
  marks: SectionMark[];
  maxPhase: number;
}

let sectionMap: SectionMap | null = null;
/** Document height the map was collected at; -1 means never collected. */
let sectionMapHeight = -1;

function collectSectionMap(): void {
  if (typeof window === "undefined") {
    sectionMap = null;
    return;
  }
  const nodes = document.querySelectorAll<HTMLElement>("[data-env-phase]");
  if (nodes.length < 2) {
    sectionMap = null;
    return;
  }
  const marks: SectionMark[] = [];
  let maxPhase = 0;
  nodes.forEach((node) => {
    const phase = Number(node.dataset["envPhase"]);
    if (!Number.isFinite(phase)) return;
    const rect = node.getBoundingClientRect();
    if (rect.height <= 0) return;
    marks.push({ top: rect.top + window.scrollY, height: rect.height, phase });
    if (phase > maxPhase) maxPhase = phase;
  });
  if (marks.length < 2 || maxPhase <= 0) {
    sectionMap = null;
    return;
  }
  marks.sort((a, b) => a.top - b.top);
  sectionMap = { marks, maxPhase };
}

function readScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  const raw = Math.max(0, Math.min(1, window.scrollY / scrollable));

  if (sectionMapHeight !== doc.scrollHeight) {
    collectSectionMap();
    sectionMapHeight = doc.scrollHeight;
  }
  const map = sectionMap;
  if (!map) return raw;

  const { marks, maxPhase } = map;
  const line = window.scrollY + window.innerHeight * 0.5;
  /* Fully scrolled: the centre line stops half a viewport short of the last
     section's bottom, so pin the end explicitly to reach full growth. */
  if (window.scrollY >= scrollable - 1) return 1;
  if (line <= marks[0]!.top) return 0;

  let activeIndex = 0;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i]!.top <= line) activeIndex = i;
    else break;
  }
  const active = marks[activeIndex]!;
  const next = marks[activeIndex + 1];
  /* Phases can repeat or dip in document order (closing bands are often
     authored at an earlier phase); keep progress monotonic by flooring the
     stage at the previous section's phase. */
  const prevPhase = activeIndex > 0 ? marks[activeIndex - 1]!.phase : 0;
  const basePhase = Math.max(active.phase, prevPhase);
  const fraction = Math.max(
    0,
    Math.min(1, (line - active.top) / active.height),
  );

  /* Hold the stage while its section is being read; ease toward the next
     phase across the section's second half. Sections that repeat a phase
     (or end the page) hold throughout, so progress never runs backwards. */
  if (!next || next.phase <= basePhase || fraction < 0.5) {
    return Math.max(0, Math.min(1, basePhase / maxPhase));
  }
  const t = (fraction - 0.5) / 0.5;
  const swept = basePhase + (next.phase - basePhase) * t;
  return Math.max(0, Math.min(1, swept / maxPhase));
}

function engineApply(value: number) {
  if (typeof document === "undefined") return;
  const next = interpolateEnvironment(value);
  applyEnvironment(document.documentElement, next, engineApplied);
  engineApplied = next;
  for (const listener of listeners) listener(next.progress, next.stage);
}

function engineTick(now: number) {
  const delta = now - engineLastTime;
  engineLastTime = now;
  const distance = engineTarget - engineCurrent;
  engineCurrent += distance * approachFactor(delta, 220);

  const settled = Math.abs(engineTarget - engineCurrent) < 0.0004;
  if (settled) engineCurrent = engineTarget;

  engineApply(engineCurrent);

  if (settled) {
    engineFrame = undefined;
    return;
  }
  engineFrame = requestAnimationFrame(engineTick);
}

function engineWake() {
  if (engineStatic) return;
  if (engineFrame === undefined) {
    engineLastTime = performance.now();
    engineFrame = requestAnimationFrame(engineTick);
  }
}

export function engineAttach() {
  if (engineAttached || typeof window === "undefined") return;
  engineAttached = true;

  window.addEventListener(
    "scroll",
    () => {
      engineTarget = readScrollProgress();
      engineWake();
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    engineTarget = readScrollProgress();
    engineWake();
  });

  /* The atmosphere lives behind fixed-position content, so a late layout shift
     (web font swap, image load) must re-measure or progress drifts. */
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => {
      engineTarget = readScrollProgress();
      engineWake();
    }).observe(document.documentElement);
  }
}

function engineSyncImmediate() {
  engineTarget = readScrollProgress();
  engineCurrent = engineTarget;
  engineApply(engineCurrent);
}

export function engineSetStatic(isStatic: boolean) {
  engineStatic = isStatic;
  if (isStatic) {
    if (engineFrame !== undefined) cancelAnimationFrame(engineFrame);
    engineFrame = undefined;
    /* Reduced motion keeps one considered environment rather than no
       environment: the palette still identifies the material system. */
    engineCurrent = 0.18;
    engineTarget = 0.18;
    engineApply(engineCurrent);
  } else {
    engineSyncImmediate();
  }
}

export function subscribeToEnvironment(
  listener: EnvironmentListener,
): () => void {
  if (typeof window === "undefined") return () => {};
  engineAttach();
  listeners.add(listener);
  listener(engineApplied?.progress ?? engineCurrent, engineApplied?.stage ?? 0);
  return () => {
    listeners.delete(listener);
  };
}
