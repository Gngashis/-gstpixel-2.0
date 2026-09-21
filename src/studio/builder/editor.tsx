import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
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
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/lib/motion";
import { buildStudioWhatsappHref } from "../contact";
import { consumeStudioIntakePrompt } from "../intake";
import {
  createAlternateDesignSpec,
  createSectionForType,
  generateFallbackDesignSpec,
  getHomePage,
  moveSection,
  paletteIds,
  parseDesignSpec,
  removeSection,
  sectionVariantRegistry,
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

const paletteLabels: Record<PaletteId, string> = {
  "forest-gold": "Forest & gold",
  "ivory-terracotta": "Ivory & terracotta",
  "midnight-champagne": "Midnight & champagne",
  "paper-ink": "Paper & ink",
  "ocean-copper": "Ocean & copper",
  "sand-olive": "Sand & olive",
  "graphite-lime": "Graphite & lime",
};

type Viewport = "desktop" | "mobile";
type BuilderPhase = "landing" | "generating" | "editing";

const buildApiPath = "/api/studio-build";

type ServerBuildResult = {
  spec: DesignSpec;
  source: "ai" | "fallback";
  plan?: StudioChangePlan;
  summary?: string;
  unsupported?: string[];
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
      changed?: unknown;
    };
    const plan = payload.plan ? parseStudioChangePlan(payload.plan) : undefined;
    return {
      spec: parseDesignSpec(payload.spec),
      source: payload.source === "ai" ? "ai" : "fallback",
      ...(plan ? { plan } : {}),
      ...(typeof payload.summary === "string"
        ? { summary: payload.summary }
        : {}),
      ...(Array.isArray(payload.unsupported) &&
      payload.unsupported.every((item) => typeof item === "string")
        ? { unsupported: payload.unsupported }
        : {}),
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
  const [spec, setSpec] = useState<DesignSpec | null>(null);
  const [history, setHistory] = useState<DesignSpec[]>([]);
  const [future, setFuture] = useState<DesignSpec[]>([]);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [activePageSlug, setActivePageSlug] = useState("/");
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
  const reducedMotion = useReducedMotion();
  const controllerRef = useRef<AbortController | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  /* A description carried from the homepage quick-start lives only in module
     memory and is consumed here, once, on mount. */
  const [intakePrompt] = useState(() => consumeStudioIntakePrompt());
  /* Guards the homepage handoff so the carried description generates exactly
     once, even when passive effects reconnect during navigation churn. */
  const intakeStartedRef = useRef(false);

  /* Abort in-flight generation when Studio truly unmounts. The abort is
     deferred a tick because React briefly disconnects and reconnects passive
     effects while a client-side navigation settles; a reconnect cancels the
     pending abort, while a real unmount (which never reconnects) still lands
     it. Without this, the churn cleanup aborts a generation that is already
     running. */
  useEffect(() => {
    let abortTimer: number | undefined;
    return () => {
      abortTimer = window.setTimeout(() => controllerRef.current?.abort(), 50);
    };
  }, []);

  const activePage = useMemo(
    () =>
      spec?.pages.find((page) => page.slug === activePageSlug) ??
      (spec ? getHomePage(spec) : null),
    [spec, activePageSlug],
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
      if (controller.signal.aborted) return;
      setGenerationStep(index);
    }
    const serverResult = await Promise.race([
      serverPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 350)),
    ]);
    if (controller.signal.aborted) return;
    const next = serverResult?.spec ?? fallback;
    setSpec(next);
    setHistory([]);
    setFuture([]);
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
      viewport,
      recentTurns: conversation.slice(-4),
      previousThemes: history
        .slice()
        .reverse()
        .slice(0, 10)
        .map((entry) => entry.theme),
    };
    const fallbackPlan = planStudioChange(value, context);
    const fallbackResult = applyStudioChangePlan(context, fallbackPlan);
    await new Promise((resolve) =>
      setTimeout(resolve, reducedMotion ? 10 : 140),
    );
    if (controller.signal.aborted) return;
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
            viewport,
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
    if (controller.signal.aborted) return;
    setIntelligenceStage("applying");
    setStatus("Applying the design plan…");
    const nextSpec = serverResult?.spec ?? fallbackResult.spec;
    const plan = serverResult?.plan ?? fallbackPlan;
    const changed = serverResult?.changed ?? fallbackResult.changed;
    const summary = serverResult?.summary ?? plan.summary;
    const unsupported = serverResult?.unsupported ?? plan.unsupported;
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

  const suggestions = useMemo(
    () =>
      spec
        ? getContextualSuggestions({
            spec,
            activePageSlug,
            selectedSectionId,
            viewport,
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
          <form className="studio-v2-composer" onSubmit={generate}>
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

  return (
    <div className="studio-v2-shell is-editing" ref={canvasRef} tabIndex={-1}>
      <header className="studio-v2-editor-topbar">
        <div>
          <button
            type="button"
            onClick={() => {
              setPhase("landing");
              setSpec(null);
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
            className={viewport === "mobile" ? "is-active" : undefined}
            onClick={() => setViewport("mobile")}
            aria-pressed={viewport === "mobile"}
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
          <div className="studio-v2-pages">
            {spec.pages.map((page) => (
              <button
                key={page.slug}
                type="button"
                className={
                  activePage.slug === page.slug ? "is-active" : undefined
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
          <div
            className={`studio-v2-canvas is-${viewport}${isChanging ? " is-changing" : ""}`}
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
                spec={spec}
                pageSlug={activePage.slug}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
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
              <small>Design</small>
              <strong>Look & section</strong>
            </span>
          </div>
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
          <div className="studio-v2-alternate">
            <button
              type="button"
              onClick={() =>
                applySpec(
                  createAlternateDesignSpec(spec),
                  "A substantially different visual version is ready.",
                )
              }
            >
              <MonitorSmartphone size={16} /> Show another version
            </button>
          </div>
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
