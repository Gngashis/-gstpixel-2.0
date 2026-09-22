import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Image as ImageIcon,
  Layers3,
  MessageCircle,
  Monitor,
  MonitorSmartphone,
  Palette,
  Plus,
  Redo2,
  RotateCcw,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/lib/motion";
import { buildStudioWhatsappHref } from "../contact";
import { consumeStudioIntakePrompt } from "../intake";
import {
  applyBlueprintPatch,
  applyBlueprintToSpec,
  blueprintFromSpec,
  buildPageForKind,
  compositionFamilies,
  createAlternateDesignSpec,
  generateFallbackDesignSpec,
  heroFamilies,
  motionFamilies,
  type CreativeBlueprintPatch,
} from "./blueprint";
import {
  designDnaFromBlueprint,
  describeDesignDna,
  describeDesignDnaFacets,
  readDesignDna,
  motionLevels,
  type MotionLevel,
} from "./design-dna";
import {
  directionDesignSpec,
  planAdditionalDirection,
  planCreativeDirections,
  type CreativeDirection,
} from "./directions";
import {
  pageArchetype,
  pageKinds,
  planSitePages,
  type SitePageKind,
} from "./site-pages";
import type { RenderMedia } from "./renderer";
import {
  designCategories,
  designPresetSpec,
  listDesignPresets,
  type DesignCategory,
  type DesignPreset,
} from "./design-library";
import {
  createSectionForType,
  getHomePage,
  moveSection,
  paletteIds,
  parseDesignSpec,
  removeSection,
  sectionVariantRegistry,
  typographyIds,
  updatePalette,
  updateSectionCopy,
  updateSectionVariant,
  type DesignSpec,
  type PaletteId,
  type SectionType,
} from "./domain";
import {
  applyStudioChangePlan,
  getContextualSuggestions,
  parseStudioChangePlan,
  planStudioChange,
  type StudioChangeContext,
  type StudioChangePlan,
  type StudioConversationTurn,
} from "./change-plan";
import { WebsiteRenderer } from "./renderer";
import "./v2-styles.css";

const creativeSuggestions = [
  "Show me a completely different version",
  "Make it feel far more expensive",
  "Less corporate, more editorial",
  "Give it a technical, engineered feel",
  "Try a different hero entirely",
  "Make it warmer and more playful",
] as const;

const examplePrompts = {
  "Luxury hotel":
    "Create a premium luxury resort website for a property near Jaigaon with 15 rooms, mountain views, a restaurant and booking enquiries. Use deep forest green, warm ivory and refined gold accents. Make it elegant, cinematic and modern.",
  Restaurant:
    "Create an elegant modern restaurant website with a seasonal menu, warm evening atmosphere and simple reservation enquiries.",
  "Professional service":
    "Create a premium professional services website that feels clear, trusted and editorial, with services, process and contact sections.",
  "Online shop":
    "Create a bold premium online shop for considered home objects with product collections, editorial storytelling and a refined checkout direction.",
  "Fitness studio":
    "Create a modern high-energy fitness studio website with training programs, coaches, membership information and trial enquiries.",
  "Travel company":
    "Create a cinematic travel company website with destinations, signature journeys, itinerary highlights and direct enquiries.",
} as const;

const generationSteps = [
  "Understanding your business",
  "Creating visual direction",
  "Building your sections",
  "Refining typography",
  "Preparing your website",
] as const;

/**
 * Section types in the visitor's language. Used wherever Studio lists what a
 * page contains, so a comparison never shows a component name like "cta".
 */
const sectionLabels: Record<SectionType, string> = {
  hero: "Opening",
  about: "Story",
  services: "Services",
  gallery: "Gallery",
  listings: "Products and listings",
  testimonials: "Reviews",
  features: "Highlights",
  cta: "Closing call to action",
  contact: "Contact",
};

const describeSections = (types: readonly SectionType[]) =>
  types.map((type) => sectionLabels[type]).join(" · ");

const paletteLabels: Record<PaletteId, string> = {
  "forest-gold": "Forest & gold",
  "ivory-terracotta": "Ivory & terracotta",
  "midnight-champagne": "Midnight & champagne",
  "paper-ink": "Paper & ink",
  "ocean-copper": "Ocean & copper",
  "sand-olive": "Sand & olive",
  "graphite-lime": "Graphite & lime",
  "plum-brass": "Plum & brass",
  "stone-sage": "Stone & sage",
  "cobalt-cream": "Cobalt & cream",
  "charcoal-amber": "Charcoal & amber",
  "clay-indigo": "Clay & indigo",
  "slate-coral": "Slate & coral",
};

const typographyLabels: Record<(typeof typographyIds)[number], string> = {
  "editorial-serif": "Editorial serif",
  "modern-grotesk": "Modern sans",
  humanist: "Humanist warm",
  "high-contrast": "High contrast",
  "geometric-technical": "Geometric technical",
  "mono-technical": "Technical mono",
  "expressive-display": "Expressive display",
  "condensed-poster": "Condensed poster",
};

/** Mutually exclusive option row used by the click controls. */
function ChoiceRow({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string | undefined;
  options: readonly { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="studio-v2-choice" role="group" aria-label={label}>
      <small>{label}</small>
      <div>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "is-active" : undefined}
            aria-pressed={value === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");

const motionLabels: Record<MotionLevel, string> = {
  none: "None",
  subtle: "Subtle",
  premium: "Premium",
  cinematic: "Cinematic",
};

const motionLabel = (level: MotionLevel) => motionLabels[level];

/** The motion family a formal level maps onto in the design vocabulary. */
const motionFamilyForLevel = (
  level: MotionLevel,
): (typeof motionFamilies)[number] =>
  level === "none"
    ? "quiet"
    : level === "subtle"
      ? "editorial"
      : level === "premium"
        ? "luxury"
        : "cinematic";

type Viewport = "desktop" | "768" | "430" | "390";
type BuilderPhase = "landing" | "generating" | "editing";

/** Studio only distinguishes desktop from small-screen behaviour. */
const contextViewport = (viewport: Viewport): "desktop" | "mobile" =>
  viewport === "desktop" ? "desktop" : "mobile";

/**
 * A session version of the concept.
 *
 * Versions live in React state only: no storage API is touched, so a refresh
 * legitimately discards them. Each version carries its own undo/redo trail, so
 * exploring a direction never costs the visitor their history.
 */
type ConceptVersion = {
  id: string;
  label: string;
  origin: string;
  spec: DesignSpec;
  history: DesignSpec[];
  future: DesignSpec[];
};

/* Stable empties so a missing version never creates a fresh array each render. */
const NO_SPECS: DesignSpec[] = [];

const buildApiPath = "/api/studio-build";

type ServerBuildResult = {
  spec: DesignSpec;
  source: "ai" | "fallback";
  plan?: StudioChangePlan;
  summary?: string;
  unsupported?: string[];
  notes?: string[];
  changed?: boolean;
};

async function requestServerSpec(
  body: unknown,
  signal: AbortSignal,
): Promise<ServerBuildResult | null> {
  try {
    const response = await fetch(buildApiPath, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      spec?: unknown;
      source?: unknown;
      plan?: unknown;
      summary?: unknown;
      unsupported?: unknown;
      notes?: unknown;
      changed?: unknown;
    };
    const strings = (value: unknown): string[] | undefined =>
      Array.isArray(value) && value.every((item) => typeof item === "string")
        ? (value as string[])
        : undefined;
    const plan = payload.plan ? parseStudioChangePlan(payload.plan) : undefined;
    const unsupported = strings(payload.unsupported);
    const notes = strings(payload.notes);
    return {
      spec: parseDesignSpec(payload.spec),
      source: payload.source === "ai" ? "ai" : "fallback",
      ...(plan ? { plan } : {}),
      ...(typeof payload.summary === "string"
        ? { summary: payload.summary }
        : {}),
      ...(unsupported ? { unsupported } : {}),
      ...(notes ? { notes } : {}),
      ...(typeof payload.changed === "boolean"
        ? { changed: payload.changed }
        : {}),
    };
  } catch {
    return null;
  }
}

export function StudioBuilder() {
  const [phase, setPhase] = useState<BuilderPhase>("landing");
  const [prompt, setPrompt] = useState("");
  const [instruction, setInstruction] = useState("");
  /*
   * Session versions.
   *
   * `spec`, `history` and `future` below are the *active* version's working
   * state, so every existing editing path keeps working unchanged while the
   * visitor can duplicate a version, switch between versions, compare them and
   * still undo and redo inside whichever version they are in.
   */
  const [versions, setVersions] = useState<ConceptVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>("");
  const [compareVersionId, setCompareVersionId] = useState<string>("");
  const versionCounter = useRef(0);
  const activeVersion =
    versions.find((entry) => entry.id === activeVersionId) ?? versions[0];
  const spec = activeVersion?.spec ?? null;
  const history = activeVersion?.history ?? NO_SPECS;
  const future = activeVersion?.future ?? NO_SPECS;

  const updateActive = (
    update: (version: ConceptVersion) => ConceptVersion,
  ) => {
    setVersions((items) => {
      const id = activeVersionId || items[0]?.id;
      if (!id) return items;
      return items.map((entry) => (entry.id === id ? update(entry) : entry));
    });
  };
  const setSpec = (next: DesignSpec) =>
    updateActive((version) => ({ ...version, spec: next }));
  const setHistory = (
    next: DesignSpec[] | ((items: DesignSpec[]) => DesignSpec[]),
  ) =>
    updateActive((version) => ({
      ...version,
      history: typeof next === "function" ? next(version.history) : next,
    }));
  const setFuture = (
    next: DesignSpec[] | ((items: DesignSpec[]) => DesignSpec[]),
  ) =>
    updateActive((version) => ({
      ...version,
      future: typeof next === "function" ? next(version.future) : next,
    }));

  const nextVersionId = () => {
    versionCounter.current += 1;
    return `version-${versionCounter.current}`;
  };

  /** Adds a version from a spec and makes it the active one. */
  const addVersion = (
    nextSpec: DesignSpec,
    label: string,
    origin: string,
    history: DesignSpec[] = [],
  ) => {
    const version: ConceptVersion = {
      id: nextVersionId(),
      label,
      origin,
      spec: nextSpec,
      history,
      future: [],
    };
    setVersions((items) => [...items.slice(-7), version]);
    setActiveVersionId(version.id);
    return version;
  };

  /* Direction previews and the three proposals for the current description. */
  const [directions, setDirections] = useState<CreativeDirection[]>([]);
  const [previewDirectionId, setPreviewDirectionId] = useState<string | null>(
    null,
  );
  const [extraDirectionOffset, setExtraDirectionOffset] = useState(0);
  /* Session-only media. Object URLs are revoked as soon as they are replaced. */
  const [media, setMedia] = useState<{
    logo: string | null;
    hero: string | null;
    gallery: string[];
  }>({ logo: null, hero: null, gallery: [] });
  const objectUrlsRef = useRef<string[]>([]);

  const trackObjectUrl = (url: string) => {
    objectUrlsRef.current.push(url);
    return url;
  };
  const releaseObjectUrl = (url: string | null) => {
    if (!url) return;
    URL.revokeObjectURL(url);
    objectUrlsRef.current = objectUrlsRef.current.filter(
      (entry) => entry !== url,
    );
  };
  const clearMedia = () => {
    for (const url of objectUrlsRef.current) URL.revokeObjectURL(url);
    objectUrlsRef.current = [];
    setMedia({ logo: null, hero: null, gallery: [] });
  };

  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [activePageSlug, setActivePageSlug] = useState("/");
  const [showVersions, setShowVersions] = useState(true);
  const [generationStep, setGenerationStep] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [status, setStatus] = useState("");
  const [intelligenceStage, setIntelligenceStage] = useState<
    "idle" | "understanding" | "planning" | "applying" | "done"
  >("idle");
  const [conversation, setConversation] = useState<StudioConversationTurn[]>(
    [],
  );
  const [addType, setAddType] =
    useState<Exclude<SectionType, "hero">>("gallery");
  const [addPageKind, setAddPageKind] = useState<SitePageKind>("faq");
  const [landingMode, setLandingMode] = useState<"describe" | "browse">(
    "describe",
  );
  const [libraryCategory, setLibraryCategory] = useState<
    DesignCategory | "All"
  >("All");
  const reducedMotion = useReducedMotion();
  const controllerRef = useRef<AbortController | null>(null);
  const unmountAbortRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLDivElement>(null);
  /* A description carried from the homepage quick-start lives only in module
     memory and is consumed here, once, on mount. */
  const [intakePrompt] = useState(() => consumeStudioIntakePrompt());
  /* Guards the homepage handoff so the carried description generates exactly
     once, even when passive effects reconnect during navigation churn. */
  const intakeStartedRef = useRef(false);

  /* Abort in-flight work when Studio truly unmounts.

     The abort is deferred because React disconnects and reconnects passive
     effects during navigation and Suspense churn: a real unmount runs cleanup
     and never reconnects, while churn runs cleanup and then setup again. The
     pending abort must therefore be cancelled by the *reconnect*, which is what
     the ref below does — a reconnect re-runs this effect and clears the timer.
     Without the cancel, the cleanup's timer fires into a live generation and
     strands the visitor on the progress screen. */
  useEffect(() => {
    if (unmountAbortRef.current !== undefined) {
      window.clearTimeout(unmountAbortRef.current);
      unmountAbortRef.current = undefined;
    }
    return () => {
      unmountAbortRef.current = window.setTimeout(() => {
        unmountAbortRef.current = undefined;
        controllerRef.current?.abort();
      }, 250);
    };
  }, []);

  const activePage = useMemo(
    () =>
      spec?.pages.find((page) => page.slug === activePageSlug) ??
      (spec ? getHomePage(spec) : null),
    [spec, activePageSlug],
  );
  /* The click controls read their current values from the same reconstructed
     blueprint the patch is applied to, so the panel always shows the truth. */
  const activeBlueprint = useMemo(
    () => (spec ? blueprintFromSpec(spec) : null),
    [spec],
  );
  const selectedSection =
    activePage?.sections.find((section) => section.id === selectedSectionId) ??
    null;

  const revealCanvas = () => {
    requestAnimationFrame(() => {
      canvasRef.current?.focus({ preventScroll: true });
      canvasRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  /* An aborted generation must never leave the visitor staring at a progress
     screen that will never finish. Only the newest request may restore the UI,
     so a request that was deliberately superseded by a newer one is skipped. */
  const abandonGeneration = (controller: AbortController) => {
    if (controllerRef.current !== controller) return;
    controllerRef.current = null;
    setPhase("landing");
    setGenerationStep(0);
    setStatus("Generation stopped. Describe your business again to restart.");
  };

  const generate = async (event?: FormEvent, override?: string) => {
    event?.preventDefault();
    const value = (override ?? prompt).replace(/\s+/g, " ").trim();
    if (value.length < 10) {
      setStatus(
        "Describe the business and the website you want in a little more detail.",
      );
      return;
    }
    setStatus("");
    setPhase("generating");
    setGenerationStep(0);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const fallback = generateFallbackDesignSpec(value);
    const serverPromise = requestServerSpec(
      { action: "generate", prompt: value },
      controller.signal,
    );
    for (let index = 1; index < generationSteps.length; index += 1) {
      await new Promise((resolve) =>
        setTimeout(resolve, reducedMotion ? 45 : 135),
      );
      if (controller.signal.aborted) return abandonGeneration(controller);
      setGenerationStep(index);
    }
    const serverResult = await Promise.race([
      serverPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 350)),
    ]);
    if (controller.signal.aborted) return abandonGeneration(controller);
    const next = serverResult?.spec ?? fallback;
    setVersions([]);
    setActiveVersionId("");
    setCompareVersionId("");
    setPreviewDirectionId(null);
    setExtraDirectionOffset(0);
    clearMedia();
    addVersion(
      next,
      "Version 1",
      serverResult?.source === "ai" ? "Studio AI" : "Studio design system",
    );
    setDirections(planCreativeDirections(value));
    setConversation([]);
    setSelectedSectionId(next.pages[0]?.sections[0]?.id ?? null);
    setActivePageSlug("/");
    setPhase("editing");
    setStatus(
      serverResult?.source === "ai"
        ? "Website generated with Studio AI."
        : "Website generated with Studio’s resilient design system.",
    );
    revealCanvas();
  };

  /* Homepage quick-start handoff: begin generating from the carried
     description so the journey feels like one continuous step. The start is
     deferred through a single timer: effect cleanup clears it and a reconnect
     schedules it again, so generation begins only after the navigation's
     passive-effect churn settles (~150 ms after route change), exactly once,
     and never after a real unmount. */
  useEffect(() => {
    if (!intakePrompt || intakeStartedRef.current) return;
    setPrompt(intakePrompt);
    const timer = window.setTimeout(() => {
      intakeStartedRef.current = true;
      void generate(undefined, intakePrompt);
    }, 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intakePrompt]);

  const applySpec = (next: DesignSpec, message: string) => {
    if (!spec) return;
    setHistory((items) => [...items.slice(-9), spec]);
    setFuture([]);
    setSpec(next);
    setIsChanging(true);
    setStatus(message);
    window.setTimeout(() => setIsChanging(false), reducedMotion ? 20 : 520);
  };

  /* ------------------------------------------------------------------
     Click controls

     Two small, validated entry points back every control below: a creative
     blueprint patch (hero family, composition, motion…) and a theme field on
     the design spec (typography, buttons, corners…). Both go through the same
     parsers the AI path uses, so a click can never produce an invalid site.
     ------------------------------------------------------------------ */
  const applyBlueprint = (patch: CreativeBlueprintPatch, message: string) => {
    if (!spec) return;
    applySpec(
      applyBlueprintToSpec(
        spec,
        applyBlueprintPatch(blueprintFromSpec(spec), patch),
      ),
      message,
    );
  };

  const applyTheme = (patch: Partial<DesignSpec["theme"]>, message: string) => {
    if (!spec) return;
    applySpec(
      parseDesignSpec({ ...spec, theme: { ...spec.theme, ...patch } }),
      message,
    );
  };

  const applyMobile = (
    patch: Partial<DesignSpec["responsive"]["overrides"]> & {
      mobileDensity?: DesignSpec["responsive"]["mobileDensity"];
    },
    message: string,
  ) => {
    if (!spec) return;
    const { mobileDensity, ...overrides } = patch;
    applySpec(
      parseDesignSpec({
        ...spec,
        responsive: {
          ...spec.responsive,
          ...(mobileDensity ? { mobileDensity } : {}),
          overrides: { ...spec.responsive.overrides, ...overrides },
        },
      }),
      message,
    );
  };

  /** Loads a curated design from the library. No model call, no storage. */
  const startFromPreset = (entry: DesignPreset) => {
    const next = designPresetSpec(entry);
    setPreviewDirectionId(null);
    addVersion(next, entry.name, "Premium design library");
    setConversation([]);
    setSelectedSectionId(next.pages[0]?.sections[0]?.id ?? null);
    setActivePageSlug("/");
    setPhase("editing");
    setStatus(
      `“${entry.name}” loaded — a curated ${entry.category.toLowerCase()} direction. Refine it in plain language or with the controls.`,
    );
    revealCanvas();
  };

  const submitInstruction = async (event: FormEvent) => {
    event.preventDefault();
    if (!spec || isChanging) return;
    const value = instruction.replace(/\s+/g, " ").trim();
    if (value.length < 2) return;
    setIsChanging(true);
    setIntelligenceStage("understanding");
    setStatus("Understanding your request…");
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const context: StudioChangeContext = {
      spec,
      activePageSlug,
      selectedSectionId,
      viewport: contextViewport(viewport),
      recentTurns: conversation.slice(-4),
      previousThemes: history
        .slice()
        .reverse()
        .slice(0, 10)
        .map((entry) => entry.theme),
    };
    const fallbackPlan = planStudioChange(value, context);
    const fallbackResult = applyStudioChangePlan(context, fallbackPlan);
    /* An aborted change must release the composer: leaving `isChanging` set
       would disable Apply for the rest of the session. */
    const abandonChange = () => {
      if (controllerRef.current !== controller) return;
      controllerRef.current = null;
      setIsChanging(false);
      setIntelligenceStage("idle");
    };
    await new Promise((resolve) =>
      setTimeout(resolve, reducedMotion ? 10 : 140),
    );
    if (controller.signal.aborted) return abandonChange();
    setIntelligenceStage("planning");
    setStatus("Planning coordinated changes…");
    const serverResult = await Promise.race([
      requestServerSpec(
        {
          action: "modify",
          instruction: value,
          spec,
          context: {
            activePageSlug,
            selectedSectionId,
            viewport: contextViewport(viewport),
            recentTurns: conversation.slice(-4),
            previousThemes: context.previousThemes,
          },
        },
        controller.signal,
      ),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), reducedMotion ? 250 : 8_000),
      ),
    ]);
    if (controller.signal.aborted) return abandonChange();
    setIntelligenceStage("applying");
    setStatus("Applying the design plan…");
    const nextSpec = serverResult?.spec ?? fallbackResult.spec;
    const plan = serverResult?.plan ?? fallbackPlan;
    const changed = serverResult?.changed ?? fallbackResult.changed;
    const summary = serverResult?.summary ?? plan.summary;
    const unsupported = [
      ...new Set([
        ...(serverResult?.unsupported ?? plan.unsupported),
        ...(serverResult?.notes ?? fallbackResult.notes),
      ]),
    ];
    if (changed) {
      setHistory((items) => [...items.slice(-9), spec]);
      setFuture([]);
      setSpec(nextSpec);
      setConversation((turns) => [
        ...turns.slice(-3),
        {
          instruction: value,
          summary,
          pageSlug: activePageSlug,
          sectionId: selectedSectionId,
          operationTypes: plan.operations.map((operation) => operation.type),
          operations: plan.operations,
        },
      ]);
    }
    setInstruction("");
    setIntelligenceStage("done");
    setStatus(
      changed
        ? `${summary}${unsupported.length ? ` ${unsupported.join(" ")}` : ""}`
        : (unsupported[0] ??
            "Studio could not make a meaningful safe change from that request."),
    );
    window.setTimeout(
      () => {
        setIsChanging(false);
        setIntelligenceStage("idle");
      },
      reducedMotion ? 20 : 520,
    );
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!spec || !previous) return;
    setFuture((items) => [spec, ...items].slice(0, 10));
    setHistory((items) => items.slice(0, -1));
    setSpec(previous);
    setStatus("Last change undone.");
  };

  const redo = () => {
    const next = future[0];
    if (!spec || !next) return;
    setHistory((items) => [...items, spec].slice(-10));
    setFuture((items) => items.slice(1));
    setSpec(next);
    setStatus("Change restored.");
  };

  /* ------------------------------------------------------------------
     Session versions
     ------------------------------------------------------------------ */
  const switchVersion = (id: string) => {
    const version = versions.find((entry) => entry.id === id);
    if (!version) return;
    setActiveVersionId(id);
    setPreviewDirectionId(null);
    setActivePageSlug("/");
    setSelectedSectionId(version.spec.pages[0]?.sections[0]?.id ?? null);
    setStatus(`${version.label} is open.`);
  };

  const duplicateVersion = () => {
    if (!spec) return;
    addVersion(
      structuredClone(spec),
      `Version ${versions.length + 1}`,
      `Copy of ${activeVersion?.label ?? "version"}`,
    );
    setStatus(
      "Version duplicated — it is a separate branch you can change without affecting the original.",
    );
  };

  const createFreshVersion = () => {
    if (!spec) return;
    const previous = spec;
    const next = createAlternateDesignSpec(previous);
    addVersion(
      next,
      `Version ${versions.length + 1}`,
      "A different design direction",
      // Carrying the previous design into the new version's history keeps Undo
      // meaningful across versions: one step back returns to what was there.
      [previous],
    );
    setPreviewDirectionId(null);
    setActivePageSlug("/");
    setSelectedSectionId(next.pages[0]?.sections[0]?.id ?? null);
    setStatus(
      "A new version is open — the same business, designed completely differently.",
    );
  };

  const removeVersion = (id: string) => {
    if (versions.length <= 1) return;
    const remaining = versions.filter((entry) => entry.id !== id);
    setVersions(remaining);
    if (activeVersionId === id) setActiveVersionId(remaining[0]!.id);
    if (compareVersionId === id) setCompareVersionId("");
    setStatus("Version removed from this session.");
  };

  /* ------------------------------------------------------------------
     Creative directions
     ------------------------------------------------------------------ */
  const askForAnotherDirection = () => {
    if (!spec) return;
    const source = prompt.trim().length >= 10 ? prompt : spec.site.descriptor;
    const next = planAdditionalDirection(source, extraDirectionOffset);
    setExtraDirectionOffset((value) => value + 1);
    setDirections((items) => [...items.slice(-5), next]);
    setPreviewDirectionId(next.id);
    setStatus(
      `Direction ${String(next.index).padStart(2, "0")} — ${next.name} is ready to preview.`,
    );
  };

  /* ------------------------------------------------------------------
     Pages
     ------------------------------------------------------------------ */
  const addPageToSite = () => {
    if (!spec) return;
    const archetype = pageArchetype(addPageKind);
    if (spec.pages.some((page) => page.slug === archetype.slug)) {
      setStatus(`${archetype.title} is already part of this concept.`);
      return;
    }
    if (spec.pages.length >= 8) {
      setStatus("This concept is at its page limit — remove one first.");
      return;
    }
    const page = buildPageForKind(spec, addPageKind, spec.pages.length - 1);
    const next = parseDesignSpec({
      ...spec,
      pages: [...spec.pages, page],
      navigation: {
        ...spec.navigation,
        items: [
          ...spec.navigation.items,
          { label: archetype.navLabel, target: archetype.slug },
        ].slice(0, 8),
      },
    });
    applySpec(
      next,
      `${archetype.title} page added in the same design language.`,
    );
    setActivePageSlug(archetype.slug);
    setSelectedSectionId(page.sections[0]?.id ?? null);
  };

  const removePage = (slug: string) => {
    if (!spec || slug === "/" || spec.pages.length <= 2) return;
    const next = parseDesignSpec({
      ...spec,
      pages: spec.pages.filter((page) => page.slug !== slug),
      navigation: {
        ...spec.navigation,
        items: spec.navigation.items.filter((item) => item.target !== slug),
      },
    });
    applySpec(next, "Page removed.");
    setActivePageSlug("/");
    setSelectedSectionId(next.pages[0]?.sections[0]?.id ?? null);
  };

  /* ------------------------------------------------------------------
     Session-only media

     Files never leave the browser: each one becomes an object URL, is used
     for the design, and is revoked as soon as it is replaced or the Studio
     unmounts.
     ------------------------------------------------------------------ */
  const addMedia = (
    event: ChangeEvent<HTMLInputElement>,
    slot: "logo" | "hero" | "gallery",
  ) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    event.target.value = "";
    if (files.length === 0) {
      setStatus("Please choose an image file.");
      return;
    }
    const urls = files
      .slice(0, slot === "gallery" ? 6 : 1)
      .map((file) => trackObjectUrl(URL.createObjectURL(file)));
    setMedia((current) => {
      if (slot === "gallery") {
        const combined = [...current.gallery, ...urls];
        for (const dropped of combined.slice(8)) releaseObjectUrl(dropped);
        return { ...current, gallery: combined.slice(0, 8) };
      }
      releaseObjectUrl(current[slot]);
      return { ...current, [slot]: urls[0]! };
    });
    setStatus(
      slot === "gallery"
        ? `${urls.length} gallery image${urls.length > 1 ? "s" : ""} added for this session only.`
        : `${slot === "logo" ? "Logo" : "Hero image"} added for this session only.`,
    );
  };

  const suggestions = useMemo(
    () =>
      spec
        ? getContextualSuggestions({
            spec,
            activePageSlug,
            selectedSectionId,
            viewport: contextViewport(viewport),
            recentTurns: conversation.slice(-4),
            previousThemes: history
              .slice()
              .reverse()
              .slice(0, 10)
              .map((entry) => entry.theme),
          })
        : [],
    [spec, activePageSlug, selectedSectionId, viewport, conversation, history],
  );

  /* A direction preview is composed from the direction's own blueprint and is
     never committed until the visitor chooses it. */
  const previewSpec = useMemo(() => {
    const direction = directions.find(
      (entry) => entry.id === previewDirectionId,
    );
    return direction ? directionDesignSpec(direction) : null;
  }, [directions, previewDirectionId]);
  const previewDirection =
    previewDirectionId && previewSpec
      ? (directions.find((entry) => entry.id === previewDirectionId) ?? null)
      : null;
  const identity = useMemo(() => (spec ? readDesignDna(spec) : null), [spec]);
  const identityChips = useMemo(
    () => (identity ? describeDesignDna(identity) : []),
    [identity],
  );

  /*
   * What actually differs between two session versions, in customer language.
   * The design identity is compared through its named facets rather than the
   * raw theme tokens, and the site structure is compared page by page so a
   * version that only differs in its pages still reads as different.
   */
  const compare = useMemo(() => {
    const other = versions.find((entry) => entry.id === compareVersionId);
    if (!spec || !other || other.id === activeVersionId)
      return { rows: [], identical: false };
    const rows: Array<{ label: string; mine: string; theirs: string }> = [];
    const push = (label: string, mine: string, theirs: string) => {
      if (mine !== theirs) rows.push({ label, mine, theirs });
    };
    const otherSpec = other.spec;
    push(
      "Creative direction",
      spec.metadata.conceptLabel,
      otherSpec.metadata.conceptLabel,
    );
    const mine = describeDesignDnaFacets(readDesignDna(spec));
    const theirs = describeDesignDnaFacets(readDesignDna(otherSpec));
    for (const facet of mine) {
      const counterpart = theirs.find((entry) => entry.label === facet.label);
      push(facet.label, facet.value, counterpart?.value ?? "—");
    }

    /* Structure: which pages each version has, and how full its home page is. */
    const minePages = spec.pages.map((page) => page.title);
    const theirPages = otherSpec.pages.map((page) => page.title);
    const added = minePages.filter((title) => !theirPages.includes(title));
    const removed = theirPages.filter((title) => !minePages.includes(title));
    push(
      "Pages",
      `${minePages.length}${added.length ? ` (added ${added.join(", ")})` : ""}`,
      `${theirPages.length}${removed.length ? ` (added ${removed.join(", ")})` : ""}`,
    );
    push(
      "Pages in both",
      minePages.filter((title) => theirPages.includes(title)).join(", "),
      theirPages.filter((title) => minePages.includes(title)).join(", "),
    );
    for (const title of minePages.filter((entry) =>
      theirPages.includes(entry),
    )) {
      const mineCount = spec.pages.find((page) => page.title === title);
      const theirCount = otherSpec.pages.find((page) => page.title === title);
      const mineSections = mineCount
        ? describeSections(mineCount.sections.map((section) => section.type))
        : "";
      const theirSections = theirCount
        ? describeSections(theirCount.sections.map((section) => section.type))
        : "";
      if (mineSections && theirSections)
        push(title, mineSections, theirSections);
    }
    return { rows, identical: rows.length === 0 };
  }, [spec, versions, compareVersionId, activeVersionId]);
  const compareRows = compare.rows;

  /* Object URLs are revoked when the Studio goes away. */
  useEffect(
    () => () => {
      for (const url of objectUrlsRef.current) URL.revokeObjectURL(url);
      objectUrlsRef.current = [];
    },
    [],
  );

  if (phase === "landing") {
    return (
      <div className="studio-v2-shell is-landing">
        <section
          className="studio-v2-landing"
          aria-labelledby="studio-v2-title"
        >
          <div className="studio-v2-landing-aura" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <div className="studio-v2-landing-copy">
            <p>
              <Sparkles size={14} /> GSTPIXEL WEBSITE STUDIO
            </p>
            <h1 id="studio-v2-title">
              Describe it.
              <br />
              Watch it become a website.
            </h1>
            <span>
              Tell us about the business, the feeling and anything the website
              should include.
            </span>
          </div>
          <div className="studio-v2-landing-modes" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={landingMode === "describe"}
              className={landingMode === "describe" ? "is-active" : undefined}
              onClick={() => setLandingMode("describe")}
            >
              <WandSparkles size={15} /> Generate from my business
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={landingMode === "browse"}
              className={landingMode === "browse" ? "is-active" : undefined}
              onClick={() => setLandingMode("browse")}
            >
              <Layers3 size={15} /> Browse premium designs
            </button>
          </div>
          {landingMode === "browse" && (
            <section
              className="studio-v2-library"
              aria-label="Premium design library"
            >
              <div
                className="studio-v2-library-tabs"
                role="group"
                aria-label="Design categories"
              >
                {(["All", ...designCategories] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      libraryCategory === category ? "is-active" : undefined
                    }
                    aria-pressed={libraryCategory === category}
                    onClick={() => setLibraryCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="studio-v2-library-note">
                Curated directions built from the same design system as your own
                description. Pick one to open it in the Studio and shape it
                further.
              </p>
              <div className="studio-v2-library-grid">
                {listDesignPresets(libraryCategory).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="studio-v2-library-card"
                    data-testid={`design-preset-${entry.id}`}
                    onClick={() => startFromPreset(entry)}
                  >
                    <span
                      className={`studio-v2-library-thumb palette-${entry.grammar.palette}`}
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="studio-v2-library-body">
                      <small>{entry.category}</small>
                      <strong>{entry.name}</strong>
                      <span>{entry.summary}</span>
                      <em>
                        {titleCase(entry.grammar.hero)} ·
                        {` ${titleCase(entry.grammar.composition)}`}
                      </em>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
          <form
            className="studio-v2-composer"
            onSubmit={generate}
            hidden={landingMode === "browse"}
          >
            <label htmlFor="studio-v2-prompt">
              Describe the website you want
            </label>
            <textarea
              id="studio-v2-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={7}
              minLength={10}
              maxLength={1200}
              placeholder="Create a premium website for my luxury resort near Jaigaon. We have 15 rooms, mountain views, a restaurant and booking enquiries. Use deep forest green and refined gold…"
            />
            <div
              className="studio-v2-suggestions"
              aria-label="Example website ideas"
            >
              {Object.entries(examplePrompts).map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setPrompt(value);
                    setStatus("");
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="studio-v2-composer-footer">
              <span>
                {prompt.length}/1200 · Your description is used for this session
                only.
              </span>
              <button className="studio-v2-generate tactile" type="submit">
                Generate website <WandSparkles size={17} aria-hidden="true" />
              </button>
            </div>
            {status && (
              <p className="studio-v2-form-status" role="alert">
                {status}
              </p>
            )}
          </form>
        </section>
      </div>
    );
  }

  if (phase === "generating") {
    return (
      <div className="studio-v2-shell is-generating">
        <section
          className="studio-v2-generation"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="studio-v2-generation-orbit" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <p>GSTPIXEL Studio is composing</p>
          <h1>{generationSteps[generationStep]}</h1>
          <ol>
            {generationSteps.map((step, index) => (
              <li
                key={step}
                className={index <= generationStep ? "is-active" : undefined}
              >
                <span>
                  {index < generationStep ? (
                    <Check size={13} />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    );
  }

  if (!spec || !activePage) return null;

  const renderedSpec: DesignSpec = previewSpec ?? spec;
  const renderMedia: RenderMedia = {
    logoUrl: media.logo,
    heroUrl: media.hero,
    galleryUrls: media.gallery,
  };

  return (
    <div className="studio-v2-shell is-editing" ref={canvasRef} tabIndex={-1}>
      <header className="studio-v2-editor-topbar">
        <div>
          <button
            type="button"
            onClick={() => {
              setPhase("landing");
              setVersions([]);
              setActiveVersionId("");
              setPreviewDirectionId(null);
              clearMedia();
            }}
            aria-label="Start a new website"
          >
            <ArrowLeft size={17} />
          </button>
          <span>
            <small>Website Studio</small>
            <strong>{spec.site.name}</strong>
          </span>
        </div>
        <div className="studio-v2-viewport-switch" aria-label="Preview size">
          <button
            type="button"
            className={viewport === "desktop" ? "is-active" : undefined}
            onClick={() => setViewport("desktop")}
            aria-pressed={viewport === "desktop"}
          >
            <Monitor size={15} /> Desktop
          </button>
          <button
            type="button"
            className={viewport === "768" ? "is-active" : undefined}
            onClick={() => setViewport("768")}
            aria-pressed={viewport === "768"}
            data-testid="viewport-768"
          >
            <Smartphone size={15} /> 768
          </button>
          <button
            type="button"
            className={viewport === "430" ? "is-active" : undefined}
            onClick={() => setViewport("430")}
            aria-pressed={viewport === "430"}
            data-testid="viewport-430"
          >
            <Smartphone size={15} /> 430
          </button>
          <button
            type="button"
            className={viewport === "390" ? "is-active" : undefined}
            onClick={() => setViewport("390")}
            aria-pressed={viewport === "390"}
            data-testid="viewport-390"
          >
            <Smartphone size={15} /> Mobile
          </button>
        </div>
        <div className="studio-v2-history">
          <button
            type="button"
            onClick={undo}
            disabled={!history.length}
            aria-label="Undo last change"
          >
            <RotateCcw size={16} /> Undo
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!future.length}
            aria-label="Redo change"
          >
            <Redo2 size={16} />
          </button>
          <button
            type="button"
            className={showVersions ? "is-active" : undefined}
            onClick={() => setShowVersions((value) => !value)}
            aria-expanded={showVersions}
            data-testid="studio-versions-toggle"
          >
            <Layers3 size={16} /> Versions ({versions.length})
          </button>
        </div>
      </header>

      <div className="studio-v2-workspace">
        <aside
          className="studio-v2-panel studio-v2-structure"
          aria-label="Pages and sections"
        >
          <div className="studio-v2-panel-title">
            <Layers3 size={16} />
            <span>
              <small>Structure</small>
              <strong>Pages & sections</strong>
            </span>
          </div>
          <div className="studio-v2-pages" data-testid="studio-pages">
            {spec.pages.map((page) => (
              <button
                key={page.slug}
                type="button"
                className={
                  activePage.slug === page.slug ? "is-active" : undefined
                }
                aria-current={
                  activePage.slug === page.slug ? "page" : undefined
                }
                onClick={() => {
                  setActivePageSlug(page.slug);
                  setSelectedSectionId(page.sections[0]?.id ?? null);
                }}
              >
                <span>{page.navigationLabel}</span>
                <small>{page.sections.length}</small>
              </button>
            ))}
          </div>
          <div className="studio-v2-add-page">
            <label htmlFor="studio-v2-add-page-kind">Add a page</label>
            <div>
              <select
                id="studio-v2-add-page-kind"
                value={addPageKind}
                onChange={(event) =>
                  setAddPageKind(event.target.value as SitePageKind)
                }
              >
                {pageKinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {pageArchetype(kind).title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Add this page"
                onClick={addPageToSite}
              >
                <Plus size={16} />
              </button>
            </div>
            {activePage.slug !== "/" && spec.pages.length > 2 && (
              <button
                type="button"
                className="studio-v2-remove-page"
                onClick={() => removePage(activePage.slug)}
              >
                <Trash2 size={14} /> Remove “{activePage.navigationLabel}” page
              </button>
            )}
          </div>
          <ol className="studio-v2-section-list">
            {activePage.sections.map((section, index) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={
                    selectedSectionId === section.id ? "is-active" : undefined
                  }
                  onClick={() => setSelectedSectionId(section.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{section.content.eyebrow || section.type}</strong>
                    <small>{section.variant.replaceAll("-", " ")}</small>
                  </div>
                </button>
              </li>
            ))}
          </ol>
          <div className="studio-v2-add-section">
            <label htmlFor="studio-v2-add-type">Add section</label>
            <div>
              <select
                id="studio-v2-add-type"
                value={addType}
                onChange={(event) =>
                  setAddType(event.target.value as typeof addType)
                }
              >
                {(
                  [
                    "about",
                    "services",
                    "gallery",
                    "listings",
                    "testimonials",
                    "features",
                    "cta",
                    "contact",
                  ] as const
                ).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label={`Add ${addType} section`}
                onClick={() => {
                  const next = structuredClone(spec);
                  const page = next.pages.find(
                    (entry) => entry.slug === activePage.slug,
                  )!;
                  const added = createSectionForType(addType, next);
                  page.sections.splice(
                    Math.max(1, page.sections.length - 1),
                    0,
                    added,
                  );
                  applySpec(parseDesignSpec(next), `${addType} section added.`);
                  setSelectedSectionId(added.id);
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </aside>

        <main className="studio-v2-canvas-column">
          {previewDirection && (
            <div className="studio-v2-direction-banner" role="status">
              <span>
                <strong>
                  Previewing direction{" "}
                  {String(previewDirection.index).padStart(2, "0")} —{" "}
                  {previewDirection.name}
                </strong>
                Nothing has changed yet. Choose it to make it your website.
              </span>
              <div>
                <button
                  type="button"
                  data-testid="use-direction"
                  onClick={() => {
                    const version = addVersion(
                      directionDesignSpec(previewDirection),
                      `Version ${versions.length + 1}`,
                      `Direction ${String(previewDirection.index).padStart(2, "0")} · ${previewDirection.name}`,
                    );
                    void version;
                    setPreviewDirectionId(null);
                    setActivePageSlug("/");
                    setSelectedSectionId(
                      spec.pages[0]?.sections[0]?.id ?? null,
                    );
                    setStatus(
                      `Direction ${String(previewDirection.index).padStart(2, "0")} — ${previewDirection.name} is now a new session version.`,
                    );
                  }}
                >
                  Use this direction
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDirectionId(null)}
                >
                  <X size={14} /> Exit preview
                </button>
              </div>
            </div>
          )}
          <div
            className={`studio-v2-canvas is-${viewport}${viewport === "desktop" ? "" : " is-mobile"}${isChanging ? " is-changing" : ""}`}
            data-viewport={viewport}
          >
            <div className="studio-v2-browser-bar">
              <span />
              <span />
              <span />
              <i>
                {spec.site.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com
              </i>
            </div>
            <div className="studio-v2-preview-scroll">
              <WebsiteRenderer
                spec={renderedSpec}
                pageSlug={activePage.slug}
                selectedSectionId={previewDirection ? null : selectedSectionId}
                onSelectSection={
                  previewDirection ? undefined : setSelectedSectionId
                }
                onNavigatePage={(slug) => {
                  setActivePageSlug(slug);
                  const page = renderedSpec.pages.find(
                    (entry) => entry.slug === slug,
                  );
                  setSelectedSectionId(page?.sections[0]?.id ?? null);
                }}
                media={renderMedia}
              />
            </div>
            <span className="studio-v2-change-sweep" aria-hidden="true" />
          </div>
          <div
            className="studio-v2-smart-suggestions"
            aria-label="Suggested changes"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInstruction(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form className="studio-v2-ai-bar" onSubmit={submitInstruction}>
            <Sparkles size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="studio-v2-instruction">
              Tell Studio what to change
            </label>
            <input
              id="studio-v2-instruction"
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              maxLength={600}
              placeholder="Tell Studio what to change…"
              disabled={isChanging}
            />
            <button
              type="submit"
              disabled={isChanging || instruction.trim().length < 2}
              aria-label="Apply change"
            >
              <Send size={17} />
            </button>
          </form>
          <div className="studio-v2-status" aria-live="polite">
            <span className={isChanging ? "is-working" : undefined} />
            <strong>
              {intelligenceStage === "understanding"
                ? "Understanding"
                : intelligenceStage === "planning"
                  ? "Planning changes"
                  : intelligenceStage === "applying"
                    ? "Applying"
                    : intelligenceStage === "done"
                      ? "Done"
                      : "Studio"}
            </strong>
            {status}
          </div>
          <div className="studio-v2-concept-cta">
            <p>
              <strong>This is an instant concept preview.</strong> Your final
              website can be fully customised with your real content, branding,
              images, integrations, SEO and business requirements.
            </p>
            <Link
              to="/start-your-project"
              search={{
                interest: "website",
                context: `I created a website concept for “${spec.site.name}” with GSTPIXEL Website Studio and would like to build the complete version.`,
              }}
              data-testid="studio-build-complete"
            >
              Build the complete version <ArrowRight size={14} />
            </Link>
          </div>
        </main>

        <aside
          className="studio-v2-panel studio-v2-properties"
          aria-label="Design controls"
        >
          <div className="studio-v2-panel-title">
            <Palette size={16} />
            <span>
              <small>Customise</small>
              <strong>Style, layout, mobile</strong>
            </span>
          </div>
          {/* The same design identity holds every page together, so it is
              stated once, in the visitor's language, above the controls. */}
          <div className="studio-v2-identity" data-testid="studio-identity">
            <small>Design identity · {identity?.identity.name}</small>
            <div>
              {identityChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </div>
          <details className="studio-v2-control-group" open>
            <summary>Directions</summary>
            <p className="studio-v2-group-note">
              Three complete design directions for this business. Preview any of
              them — nothing changes until you choose one.
            </p>
            <div className="studio-v2-direction-list">
              {directions.map((direction) => (
                <article
                  key={direction.id}
                  className={
                    previewDirectionId === direction.id
                      ? "is-previewing"
                      : undefined
                  }
                  data-testid={`studio-direction-${direction.index}`}
                >
                  <small>{`${String(direction.index).padStart(2, "0")} — ${direction.summary}`}</small>
                  <strong>{direction.name}</strong>
                  <div>
                    {direction.character.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDirectionId(
                        previewDirectionId === direction.id
                          ? null
                          : direction.id,
                      )
                    }
                  >
                    {previewDirectionId === direction.id
                      ? "Stop preview"
                      : "Preview"}
                  </button>
                </article>
              ))}
            </div>
            {directions.length === 0 && (
              <p className="studio-v2-group-note">
                Describe the business again to see three directions.
              </p>
            )}
            <button
              type="button"
              className="studio-v2-direction-more"
              onClick={askForAnotherDirection}
              data-testid="studio-another-direction"
            >
              <Sparkles size={15} /> Show me another direction
            </button>
          </details>
          <details
            className="studio-v2-control-group"
            open={showVersions}
            onToggle={(event) => setShowVersions(event.currentTarget.open)}
          >
            <summary>Versions</summary>
            <p className="studio-v2-group-note">
              Versions live in this browser session only and are never saved.
            </p>
            <div
              className="studio-v2-version-list"
              data-testid="studio-versions"
            >
              {versions.map((version) => (
                <div
                  key={version.id}
                  data-testid="studio-version-row"
                  className={
                    version.id === activeVersionId ? "is-active" : undefined
                  }
                >
                  <button
                    type="button"
                    onClick={() => switchVersion(version.id)}
                    aria-current={version.id === activeVersionId}
                  >
                    <strong>{version.label}</strong>
                    <small>{version.origin}</small>
                  </button>
                  {versions.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label={`Compare with ${version.label}`}
                        onClick={() =>
                          setCompareVersionId((current) =>
                            current === version.id ? "" : version.id,
                          )
                        }
                      >
                        Compare
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${version.label}`}
                        onClick={() => removeVersion(version.id)}
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="studio-v2-version-actions">
              <button type="button" onClick={duplicateVersion}>
                <Copy size={15} /> Duplicate this version
              </button>
              <button type="button" onClick={createFreshVersion}>
                <WandSparkles size={15} /> New version from a different design
              </button>
            </div>
            {compareVersionId !== "" && (
              <div className="studio-v2-compare" data-testid="studio-compare">
                <small>What differs</small>
                {compare.identical ? (
                  <p data-testid="studio-compare-identical">
                    These two versions are the same right now — change something
                    and the differences will appear here.
                  </p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Aspect</th>
                        <th scope="col">{activeVersion?.label}</th>
                        <th scope="col">
                          {versions.find(
                            (entry) => entry.id === compareVersionId,
                          )?.label ?? "Other"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareRows.map((row) => (
                        <tr key={row.label}>
                          <th scope="row">{row.label}</th>
                          <td>{row.mine}</td>
                          <td>{row.theirs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </details>
          {/* The headline action stays outside the groups: it is the one
              control a visitor reaches for before anything else. */}
          <div className="studio-v2-alternate">
            <button type="button" onClick={createFreshVersion}>
              <MonitorSmartphone size={16} /> Show another version
            </button>
          </div>
          <details className="studio-v2-control-group" open>
            <summary>Style</summary>
            <fieldset className="studio-v2-palette-control">
              <legend>Palette</legend>
              <div>
                {paletteIds.map((palette) => (
                  <button
                    key={palette}
                    type="button"
                    className={`palette-${palette}${spec.theme.palette === palette ? " is-active" : ""}`}
                    aria-label={paletteLabels[palette]}
                    aria-pressed={spec.theme.palette === palette}
                    onClick={() =>
                      applySpec(
                        updatePalette(spec, palette),
                        `Palette changed to ${paletteLabels[palette]}.`,
                      )
                    }
                  >
                    <span />
                  </button>
                ))}
              </div>
            </fieldset>
            <ChoiceRow
              label="Typography"
              value={spec.theme.typography}
              options={typographyIds.map((value) => ({
                value,
                label: typographyLabels[value],
              }))}
              onSelect={(value) =>
                applyTheme(
                  { typography: value as DesignSpec["theme"]["typography"] },
                  "Typography changed.",
                )
              }
            />
            <ChoiceRow
              label="Buttons"
              value={spec.theme.buttonStyle}
              options={[
                { value: "sharp", label: "Sharp" },
                { value: "subtle", label: "Subtle" },
                { value: "rounded", label: "Rounded" },
                { value: "pill", label: "Pill" },
              ]}
              onSelect={(value) =>
                applyTheme(
                  { buttonStyle: value as DesignSpec["theme"]["buttonStyle"] },
                  "Button style changed.",
                )
              }
            />
            <ChoiceRow
              label="Corners"
              value={spec.theme.radius}
              options={[
                { value: "sharp", label: "Square" },
                { value: "subtle", label: "Subtle" },
                { value: "rounded", label: "Rounded" },
              ]}
              onSelect={(value) =>
                applyTheme(
                  { radius: value as DesignSpec["theme"]["radius"] },
                  "Corner style changed.",
                )
              }
            />
            <ChoiceRow
              label="Surface"
              value={spec.theme.surface}
              options={[
                { value: "matte", label: "Matte" },
                { value: "paper", label: "Paper" },
                { value: "soft", label: "Soft" },
                { value: "glass", label: "Glass" },
                { value: "layered", label: "Layered" },
                { value: "grain", label: "Grain" },
                { value: "void", label: "Deep" },
              ]}
              onSelect={(value) =>
                applyTheme(
                  { surface: value as DesignSpec["theme"]["surface"] },
                  "Surface treatment changed.",
                )
              }
            />
          </details>
          <details className="studio-v2-control-group">
            <summary>Layout</summary>
            <ChoiceRow
              label="Hero style"
              value={activeBlueprint?.hero.family}
              options={heroFamilies.map((value) => ({
                value,
                label: titleCase(value),
              }))}
              onSelect={(value) =>
                applyBlueprint(
                  { hero: { family: value as (typeof heroFamilies)[number] } },
                  `Hero changed to ${titleCase(value)}.`,
                )
              }
            />
            <ChoiceRow
              label="Composition"
              value={activeBlueprint?.layout.composition}
              options={compositionFamilies.map((value) => ({
                value,
                label: titleCase(value),
              }))}
              onSelect={(value) =>
                applyBlueprint(
                  {
                    layout: {
                      composition:
                        value as (typeof compositionFamilies)[number],
                    },
                  },
                  `Composition changed to ${titleCase(value)}.`,
                )
              }
            />
            <ChoiceRow
              label="Density"
              value={activeBlueprint?.direction.density}
              options={[
                { value: "sparse", label: "Airy" },
                { value: "measured", label: "Balanced" },
                { value: "rich", label: "Rich" },
              ]}
              onSelect={(value) =>
                applyBlueprint(
                  {
                    direction: {
                      density: value as "sparse" | "measured" | "rich",
                    },
                  },
                  "Content density changed.",
                )
              }
            />
            <ChoiceRow
              label="Alignment"
              value={activeBlueprint?.layout.alignment}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Centred" },
              ]}
              onSelect={(value) =>
                applyBlueprint(
                  { layout: { alignment: value as "left" | "center" } },
                  "Alignment changed.",
                )
              }
            />
          </details>
          <details className="studio-v2-control-group">
            <summary>Motion character</summary>
            <ChoiceRow
              label="Feel"
              value={activeBlueprint?.motion.family}
              options={motionFamilies.map((value) => ({
                value,
                label: titleCase(value),
              }))}
              onSelect={(value) =>
                applyBlueprint(
                  {
                    motion: {
                      family: value as (typeof motionFamilies)[number],
                    },
                  },
                  `Motion set to ${titleCase(value)}.`,
                )
              }
            />
          </details>
          <details className="studio-v2-control-group">
            <summary>Mobile</summary>
            <ChoiceRow
              label="Mobile hero"
              value={spec.responsive.overrides.heroHeight}
              options={[
                { value: "balanced", label: "Full" },
                { value: "compact", label: "Compact" },
              ]}
              onSelect={(value) =>
                applyMobile(
                  { heroHeight: value as "compact" | "balanced" },
                  "Mobile hero changed.",
                )
              }
            />
            <ChoiceRow
              label="Mobile density"
              value={spec.responsive.mobileDensity}
              options={[
                { value: "balanced", label: "Comfortable" },
                { value: "compact", label: "Tight" },
              ]}
              onSelect={(value) =>
                applyMobile(
                  { mobileDensity: value as "compact" | "balanced" },
                  "Mobile density changed.",
                )
              }
            />
            <ChoiceRow
              label="Mobile menu"
              value={spec.responsive.overrides.navigation}
              options={[
                { value: "standard", label: "Standard" },
                { value: "minimal", label: "Minimal" },
              ]}
              onSelect={(value) =>
                applyMobile(
                  { navigation: value as "minimal" | "standard" },
                  "Mobile navigation changed.",
                )
              }
            />
            <ChoiceRow
              label="Decoration on mobile"
              value={spec.responsive.overrides.decoration}
              options={[
                { value: "keep", label: "Keep" },
                { value: "simplified", label: "Simplify" },
                { value: "hidden", label: "Hide" },
              ]}
              onSelect={(value) =>
                applyMobile(
                  { decoration: value as "keep" | "simplified" | "hidden" },
                  "Mobile decoration updated.",
                )
              }
            />
          </details>
          <details className="studio-v2-control-group" open>
            <summary>Media</summary>
            <p className="studio-v2-group-note">
              Add a logo or your own images for this preview. Files stay in this
              browser tab and are never uploaded or saved.
            </p>
            <div className="studio-v2-media">
              <label className="studio-v2-media-slot">
                <ImageIcon size={15} /> Logo
                <input
                  type="file"
                  accept="image/*"
                  data-testid="studio-media-logo"
                  onChange={(event) => addMedia(event, "logo")}
                />
                {media.logo && (
                  <img src={media.logo} alt="" aria-hidden="true" />
                )}
              </label>
              <label className="studio-v2-media-slot">
                <ImageIcon size={15} /> Hero image
                <input
                  type="file"
                  accept="image/*"
                  data-testid="studio-media-hero"
                  onChange={(event) => addMedia(event, "hero")}
                />
                {media.hero && (
                  <img src={media.hero} alt="" aria-hidden="true" />
                )}
              </label>
              <label className="studio-v2-media-slot">
                <ImageIcon size={15} /> Gallery images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  data-testid="studio-media-gallery"
                  onChange={(event) => addMedia(event, "gallery")}
                />
                <span>
                  {media.gallery.length
                    ? `${media.gallery.length} added`
                    : "None yet"}
                </span>
              </label>
            </div>
            {(media.logo || media.hero || media.gallery.length > 0) && (
              <button
                type="button"
                className="studio-v2-media-clear"
                onClick={() => {
                  clearMedia();
                  setStatus(
                    "Your uploaded images were removed from the preview.",
                  );
                }}
              >
                <Trash2 size={14} /> Remove my images
              </button>
            )}
          </details>
          <details className="studio-v2-control-group">
            <summary>Motion</summary>
            <p className="studio-v2-group-note">
              Studio keeps motion purposeful: hierarchy and brand character, not
              animation for its own sake. Movement is reduced automatically when
              a visitor prefers less motion.
            </p>
            <ChoiceRow
              label="Motion level"
              value={identity?.motion.level}
              options={motionLevels.map((level) => ({
                value: level,
                label: motionLabel(level),
              }))}
              onSelect={(value) =>
                applyBlueprint(
                  {
                    motion: {
                      family: motionFamilyForLevel(value as MotionLevel),
                    },
                  },
                  `Motion set to ${motionLabel(value as MotionLevel).toLowerCase()}.`,
                )
              }
            />
          </details>
          <details className="studio-v2-control-group" open>
            <summary>Sections</summary>
            {selectedSection ? (
              <div className="studio-v2-section-properties">
                <div>
                  <small>Selected section</small>
                  <strong>
                    {selectedSection.content.eyebrow || selectedSection.type}
                  </strong>
                  <span>{selectedSection.type}</span>
                </div>
                <label>
                  Layout variant
                  <select
                    value={selectedSection.variant}
                    onChange={(event) =>
                      applySpec(
                        updateSectionVariant(
                          spec,
                          selectedSection.id,
                          event.target.value,
                        ),
                        "Section layout changed.",
                      )
                    }
                  >
                    {sectionVariantRegistry[selectedSection.type].map(
                      (variant) => (
                        <option key={variant} value={variant}>
                          {variant.replaceAll("-", " ")}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown size={14} />
                </label>
                <label>
                  Heading
                  <input
                    value={selectedSection.content.title}
                    onChange={(event) => {
                      try {
                        applySpec(
                          updateSectionCopy(
                            spec,
                            selectedSection.id,
                            "title",
                            event.target.value,
                          ),
                          "Section heading updated.",
                        );
                      } catch {
                        /* wait for valid text */
                      }
                    }}
                    maxLength={110}
                  />
                </label>
                <div className="studio-v2-section-actions">
                  <button
                    type="button"
                    onClick={() =>
                      applySpec(
                        moveSection(spec, selectedSection.id, -1),
                        "Section moved up.",
                      )
                    }
                    disabled={
                      activePage.sections.findIndex(
                        (entry) => entry.id === selectedSection.id,
                      ) <= 1
                    }
                  >
                    <ArrowUp size={15} /> Up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      applySpec(
                        moveSection(spec, selectedSection.id, 1),
                        "Section moved down.",
                      )
                    }
                    disabled={
                      activePage.sections.findIndex(
                        (entry) => entry.id === selectedSection.id,
                      ) ===
                      activePage.sections.length - 1
                    }
                  >
                    <ArrowDown size={15} /> Down
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => {
                      applySpec(
                        removeSection(spec, selectedSection.id),
                        "Section removed.",
                      );
                      setSelectedSectionId(activePage.sections[0]?.id ?? null);
                    }}
                    disabled={selectedSection.type === "hero"}
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <p className="studio-v2-empty-property">
                Select a section in the website to adjust it.
              </p>
            )}
          </details>
          <a
            className="studio-v2-owner-cta"
            href={buildStudioWhatsappHref()}
            target="_blank"
            rel="noreferrer"
            data-testid="studio-whatsapp"
          >
            <MessageCircle size={17} /> Discuss this website{" "}
            <ArrowRight size={15} />
          </a>
        </aside>
      </div>
    </div>
  );
}
