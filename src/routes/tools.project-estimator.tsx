import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  PageIntro,
  ScrollReveal,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, X, Check } from "lucide-react";

const projectTypes = [
  { value: "website", label: "Website", baseComplexity: 1 },
  { value: "web-application", label: "Web application", baseComplexity: 2 },
  {
    value: "mobile-application",
    label: "Mobile application",
    baseComplexity: 2,
  },
  { value: "ecommerce", label: "Ecommerce", baseComplexity: 2 },
  { value: "custom-platform", label: "Custom platform", baseComplexity: 3 },
  { value: "not-sure", label: "Not sure yet", baseComplexity: 1 },
] as const;

const interactionLevels = [
  {
    value: "professional",
    label: "Professional",
    desc: "Clean, functional, maintainable",
    complexity: 0,
  },
  {
    value: "premium",
    label: "Premium",
    desc: "Refined interactions, polished details",
    complexity: 1,
  },
  {
    value: "highly-interactive",
    label: "Highly interactive",
    desc: "Complex state, animations, real-time",
    complexity: 2,
  },
] as const;

const capabilities = [
  { id: "auth", label: "Authentication", weight: 1 },
  { id: "payments", label: "Payments", weight: 2 },
  { id: "booking", label: "Booking / Scheduling", weight: 2 },
  { id: "dashboard", label: "Dashboard / Analytics", weight: 2 },
  { id: "cms", label: "CMS / Content management", weight: 1 },
  { id: "ai", label: "AI integration", weight: 2 },
  { id: "automation", label: "Workflow automation", weight: 2 },
  { id: "other", label: "Other requirements", weight: 1 },
] as const;

export const Route = createFileRoute("/tools/project-estimator")({
  head: () => ({
    meta: [
      { title: "Project Estimator — GSTPIXEL" },
      {
        name: "description",
        content:
          "Create a non-binding digital project scope summary for a GSTPIXEL consultation.",
      },
      { property: "og:title", content: "Project Estimator — GSTPIXEL" },
      {
        property: "og:description",
        content: "A guided scope estimator without invented pricing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [caps, setCaps] = useState<string[]>([]);
  const [audience, setAudience] = useState("");

  const complexity = useMemo(() => {
    const typeData = projectTypes.find((t) => t.value === type);
    const levelData = interactionLevels.find((l) => l.value === level);
    const capsWeight = capabilities
      .filter((c) => caps.includes(c.id))
      .reduce((sum, c) => sum + c.weight, 0);
    return (
      (typeData?.baseComplexity ?? 0) +
      (levelData?.complexity ?? 0) +
      capsWeight
    );
  }, [type, level, caps]);

  const guidance =
    complexity >= 8
      ? "Multi-surface / high coordination"
      : complexity >= 5
        ? "Moderate scope / clear phases"
        : "Focused first release";

  const handleReset = () => {
    setType("");
    setLevel("");
    setCaps([]);
    setAudience("");
  };

  const hasInput = type || level || caps.length > 0 || audience.trim();

  return (
    <>
      <PageIntro
        label="Tool 01"
        title="Project estimator"
        description="Build a non-binding scope summary. Pricing remains unavailable until GSTPIXEL approves verified pricing rules."
      />

      <section className="content-band">
        <div className="site-container tool-layout">
          <div className="tool-input-panel">
            <ScrollReveal variant="fadeInUp" delay={0}>
              <label className="form-label" htmlFor="type">
                What do you want to build?
              </label>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Project type"
              >
                {projectTypes.map((opt) => (
                  <label
                    key={opt.value}
                    className={`segmented-option ${type === opt.value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      checked={type === opt.value}
                      onChange={() => setType(opt.value)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{opt.label}</strong>
                      <span className="option-desc">
                        Base complexity: {opt.baseComplexity}/3
                      </span>
                    </div>
                    {type === opt.value && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <label className="form-label mt-6" htmlFor="audience">
                Who is it for?
              </label>
              <input
                id="audience"
                className="form-control"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Customers, staff, partners…"
              />
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <label className="form-label mt-6" htmlFor="level">
                Design and interaction level
              </label>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.4}>
              <div
                className="segmented-grid"
                role="radiogroup"
                aria-label="Interaction level"
              >
                {interactionLevels.map((opt) => (
                  <label
                    key={opt.value}
                    className={`segmented-option ${level === opt.value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={opt.value}
                      checked={level === opt.value}
                      onChange={() => setLevel(opt.value)}
                      className="sr-only"
                    />
                    <div className="option-content">
                      <strong>{opt.label}</strong>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                    {level === opt.value && (
                      <Check
                        size={16}
                        className="option-check"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.5}>
              <fieldset className="mt-6">
                <legend className="form-label">Relevant capabilities</legend>
                <StaggeredReveal
                  baseDelay={0.05}
                  variant="fadeInUp"
                  className="capability-grid"
                >
                  {capabilities.map((cap) => (
                    <label
                      key={cap.id}
                      className={`capability-chip ${caps.includes(cap.id) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={caps.includes(cap.id)}
                        onChange={() =>
                          setCaps((prev) =>
                            prev.includes(cap.id)
                              ? prev.filter((c) => c !== cap.id)
                              : [...prev, cap.id],
                          )
                        }
                        className="sr-only"
                      />
                      <span className="chip-label">{cap.label}</span>
                      <span className="chip-weight">+{cap.weight}</span>
                      {caps.includes(cap.id) && (
                        <Check
                          size={14}
                          className="chip-check"
                          aria-hidden="true"
                        />
                      )}
                    </label>
                  ))}
                </StaggeredReveal>
              </fieldset>
            </ScrollReveal>

            {hasInput && (
              <ScrollReveal variant="scaleIn" delay={0.6}>
                <Button variant="quiet" className="mt-5" onClick={handleReset}>
                  <X size={14} /> Reset all
                </Button>
              </ScrollReveal>
            )}
          </div>

          <aside
            className="result-panel"
            aria-live="polite"
            aria-label="Scope summary"
          >
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="label text-primary">Scope summary</p>
            </ScrollReveal>

            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <div className="summary-field">
                <span className="summary-label">Project type</span>
                <strong className="summary-value">
                  {projectTypes.find((t) => t.value === type)?.label ??
                    "Not selected"}
                </strong>
              </div>
              <div className="summary-field">
                <span className="summary-label">Audience</span>
                <strong className="summary-value">
                  {audience || "Not specified"}
                </strong>
              </div>
              <div className="summary-field">
                <span className="summary-label">Interaction level</span>
                <strong className="summary-value">
                  {interactionLevels.find((l) => l.value === level)?.label ??
                    "Not selected"}
                </strong>
              </div>
              <div className="summary-field">
                <span className="summary-label">Capabilities</span>
                <div className="summary-chips">
                  {caps.length ? (
                    caps.map((c) => {
                      const cap = capabilities.find((x) => x.id === c);
                      return (
                        <span key={c} className="summary-chip">
                          {cap?.label ?? c}
                        </span>
                      );
                    })
                  ) : (
                    <span className="summary-empty">None selected</span>
                  )}
                </div>
              </div>
            </StaggeredReveal>

            {type && (
              <StaggeredReveal baseDelay={0.1} variant="scaleIn">
                <div className="complexity-indicator">
                  <div className="complexity-bar">
                    <div
                      className="complexity-fill"
                      style={{
                        width: `${Math.min(100, (complexity / 12) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="complexity-meta">
                    <span>Complexity signal: {complexity}/12</span>
                    <strong>{guidance}</strong>
                  </div>
                  <p className="scope-signal">
                    This suggests a{" "}
                    {complexity >= 8
                      ? "broader discovery conversation"
                      : complexity >= 5
                        ? "phased scoping conversation"
                        : "focused scoping conversation"}
                    .
                  </p>
                </div>
              </StaggeredReveal>
            )}

            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="disclaimer">
                Planning guidance only — not a quotation, timeline, or delivery
                estimate.
              </p>
            </ScrollReveal>

            {type && (
              <ScrollReveal variant="scaleIn" delay={0.4}>
                <Button asChild className="w-full">
                  <Link
                    to="/start-your-project"
                    search={{
                      interest: type,
                      context: `Project estimator: ${projectTypes.find((t) => t.value === type)?.label}; audience: ${audience || "not specified"}; interaction: ${interactionLevels.find((l) => l.value === level)?.label || "not selected"}; capabilities: ${caps.join(", ") || "none"}`,
                    }}
                  >
                    Continue to enquiry <ArrowRight size={16} />
                  </Link>
                </Button>
              </ScrollReveal>
            )}
          </aside>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="How this works"
            title="Transparent signals. No invented numbers."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="how-it-works"
          >
            <div className="work-step">
              <span className="work-step-number">01</span>
              <div>
                <strong>You define the shape</strong>
                <p>
                  Choose type, audience, interaction level, and capabilities.
                  Each choice adds a visible weight.
                </p>
              </div>
            </div>
            <div className="work-step">
              <span className="work-step-number">02</span>
              <div>
                <strong>We show the signal</strong>
                <p>
                  A complexity score (0–12) and guidance phrase appear
                  instantly. No hidden formula.
                </p>
              </div>
            </div>
            <div className="work-step">
              <span className="work-step-number">03</span>
              <div>
                <strong>You stay in control</strong>
                <p>
                  Edit any input. The summary updates. Nothing is locked or
                  submitted.
                </p>
              </div>
            </div>
            <div className="work-step">
              <span className="work-step-number">04</span>
              <div>
                <strong>Context travels with you</strong>
                <p>
                  Continue to enquiry and only your chosen data pre-fills the
                  form. Edit freely.
                </p>
              </div>
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
