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
import { useReducedMotion } from "@/lib/motion";
import { buildStudioWhatsappHref } from "../contact";
import {
  createAlternateDesignSpec,
  createSectionForType,
  generateFallbackDesignSpec,
  getHomePage,
  modifyDesignSpec,
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
    };
    return {
      spec: parseDesignSpec(payload.spec),
      source: payload.source === "ai" ? "ai" : "fallback",
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
  const [addType, setAddType] =
    useState<Exclude<SectionType, "hero">>("gallery");
  const reducedMotion = useReducedMotion();
  const controllerRef = useRef<AbortController | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

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

  const generate = async (event?: FormEvent) => {
    event?.preventDefault();
    const value = prompt.replace(/\s+/g, " ").trim();
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
    setStatus("Studio is reshaping the website…");
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const fallback = modifyDesignSpec(spec, value);
    const serverResult = await Promise.race([
      requestServerSpec(
        { action: "modify", instruction: value, spec },
        controller.signal,
      ),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), reducedMotion ? 50 : 460),
      ),
    ]);
    if (controller.signal.aborted) return;
    setHistory((items) => [...items.slice(-9), spec]);
    setFuture([]);
    setSpec(serverResult?.spec ?? fallback);
    setInstruction("");
    setStatus("Your instruction changed the website.");
    window.setTimeout(() => setIsChanging(false), reducedMotion ? 20 : 520);
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
            {status}
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
