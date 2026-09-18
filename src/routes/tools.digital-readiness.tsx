import { useCallback, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionHeader, ScrollReveal } from "@/components/page";
import { CopyButton, ToolHandoff, ToolStartOver } from "@/lib/free-tools";
import { buildCanonical } from "@/lib/seo";
import {
  readinessCategories,
  scoreReadiness,
  totalQuestionCount,
  buildReadinessSummary,
  buildHandoffFields,
  type Answers,
  type ReadinessResult,
  type CategoryResult,
  type Action,
} from "@/lib/digital-readiness";

export const Route = createFileRoute("/tools/digital-readiness")({
  head: () => ({
    meta: [
      { title: "Digital Readiness Assessment — GSTPIXEL" },
      {
        name: "description",
        content:
          "Free digital readiness assessment. Identify strengths, gaps, and next steps across 13 areas of your business.",
      },
      {
        property: "og:title",
        content: "Digital Readiness Assessment — GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Free digital readiness assessment. Identify strengths, gaps, and next steps across 13 areas of your business.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/tools/digital-readiness"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/digital-readiness") },
    ],
  }),
  component: Page,
});

function Page() {
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    () => new Set(),
  );
  const [validationMessage, setValidationMessage] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const progress =
    totalQuestionCount > 0 ? answeredCount / totalQuestionCount : 0;
  const progressPercent = Math.round(progress * 100);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setValidationMessage("");
    setCompletionMessage("");
    setAnswers((prev) => {
      if (value === "") {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: value };
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (answeredCount < totalQuestionCount) {
        const firstUnanswered = readinessCategories
          .flatMap((category) =>
            category.questions.map((question) => ({
              categoryId: category.id,
              questionId: question.id,
            })),
          )
          .find(({ questionId }) => !answers[questionId]);

        setValidationMessage(
          `Answer ${totalQuestionCount - answeredCount} remaining question${totalQuestionCount - answeredCount === 1 ? "" : "s"} to generate a complete assessment.`,
        );

        if (firstUnanswered) {
          setCollapsedCategories((previous) => {
            const next = new Set(previous);
            next.delete(firstUnanswered.categoryId);
            return next;
          });
          setTimeout(() => {
            const input = document.querySelector<HTMLInputElement>(
              `input[name="${firstUnanswered.questionId}"]`,
            );
            const scrollTarget = input?.closest("label") ?? input;
            scrollTarget?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            input?.focus({ preventScroll: true });
          }, 80);
        }
        return;
      }

      setValidationMessage("");
      const r = scoreReadiness(answers);
      setResult(r);
      setCompletionMessage(
        `Digital readiness result ready: ${r.overallPercent ?? 0}% ${r.label ?? ""}.`,
      );
      setTimeout(() => {
        const resultNode = resultRef.current;
        resultNode?.scrollIntoView({ behavior: "smooth", block: "start" });
        resultNode?.focus({ preventScroll: true });
      }, 80);
    },
    [answeredCount, answers],
  );

  const handleReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setValidationMessage("");
    setCompletionMessage("");
    setCollapsedCategories(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyText = result ? buildReadinessSummary(result) : "";
  const handoffFields = result ? buildHandoffFields(result) : {};

  return (
    <>
      <PageIntro
        label="Tool 07"
        title="Digital readiness"
        description="Answer a few self-assessment questions across 13 areas of your business. You will get a readiness score, category breakdown, strengths, gaps, and suggested next steps."
      />
      <p className="sr-only" role="status" aria-live="polite">
        {completionMessage}
      </p>

      <section className="content-band">
        <div className="site-container tool-layout">
          <form className="tool-input-panel" onSubmit={handleSubmit}>
            <ScrollReveal variant="fadeInUp">
              <div className="dr-progress">
                <div className="progress-summary">
                  <span className="progress-percent">{progressPercent}%</span>
                  <span className="progress-label">complete</span>
                </div>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Assessment progress"
                >
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </ScrollReveal>

            {readinessCategories.map((category, catIndex) => (
              <ScrollReveal
                key={category.id}
                variant="fadeInUp"
                delay={catIndex * 0.08}
              >
                <fieldset className="dr-category">
                  <legend
                    className="dr-category-blurb"
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  >
                    {category.title}
                  </legend>
                  <div className="dr-category-header">
                    <button
                      type="button"
                      className="dr-category-toggle"
                      onClick={() => toggleCategory(category.id)}
                      aria-expanded={!collapsedCategories.has(category.id)}
                      aria-controls={`dr-questions-${category.id}`}
                    >
                      <span className="dr-category-title">
                        {category.title}
                      </span>
                      <span className="dr-category-meta">
                        {category.questions.length} questions
                      </span>
                      <ChevronDown
                        className={`dr-chevron ${collapsedCategories.has(category.id) ? "collapsed" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div
                    id={`dr-questions-${category.id}`}
                    className="dr-questions"
                    hidden={collapsedCategories.has(category.id)}
                  >
                    {category.questions.map((q) => (
                      <div key={q.id} className="dr-question">
                        <p className="dr-question-prompt">{q.prompt}</p>
                        <div
                          className="dr-options"
                          role="radiogroup"
                          aria-labelledby={`dr-q-${q.id}`}
                        >
                          <span
                            id={`dr-q-${q.id}`}
                            className="dr-question-prompt"
                            style={{
                              position: "absolute",
                              width: "1px",
                              height: "1px",
                              overflow: "hidden",
                            }}
                          >
                            {q.prompt}
                          </span>
                          {q.options.map((opt) => (
                            <label
                              key={opt.value}
                              className={`dr-option ${opt.na ? "dr-option--na" : ""} ${answers[q.id] === opt.value ? "selected" : ""}`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt.value}
                                checked={answers[q.id] === opt.value}
                                onChange={() => setAnswer(q.id, opt.value)}
                                className="sr-only"
                              />
                              <span
                                className="dr-option-check"
                                aria-hidden="true"
                              >
                                <Check size={14} />
                              </span>
                              <span className="dr-option-text">
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </ScrollReveal>
            ))}

            <ScrollReveal
              variant="fadeInUp"
              delay={readinessCategories.length * 0.08}
            >
              <div className="tool-actions">
                <Button type="submit" className="dr-submit">
                  <Check size={16} aria-hidden="true" />
                  Get my readiness score
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={answeredCount === 0 && !result}
                >
                  <ChevronUp size={16} aria-hidden="true" />
                  Start over
                </Button>
              </div>
              {validationMessage && (
                <p className="tool-validation-message" role="alert">
                  <AlertCircle size={16} aria-hidden="true" />
                  {validationMessage}
                </p>
              )}
            </ScrollReveal>
          </form>

          {result && (
            <ScrollReveal variant="fadeInUp">
              <aside
                className="tool-result-panel"
                ref={resultRef}
                role="region"
                tabIndex={-1}
                aria-labelledby="dr-result-title"
              >
                <h2 id="dr-result-title" className="dr-result-header">
                  Your readiness score
                </h2>
                <div
                  className="dr-score-ring"
                  aria-label={`Overall readiness score: ${result.overallPercent ?? 0} out of 100`}
                >
                  <svg
                    className="dr-ring"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-hidden="true"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="282.74"
                      strokeDashoffset={
                        282.74 - ((result.overallPercent ?? 0) / 100) * 282.74
                      }
                      className="dr-ring-progress"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="282.74"
                      opacity="0.15"
                    />
                  </svg>
                  <span className="dr-score-value">
                    {result.overallPercent ?? 0}
                  </span>
                </div>
                <p className="dr-score-label">Readiness</p>

                <div
                  className="dr-category-bars"
                  role="list"
                  aria-label="Category scores"
                >
                  {readinessCategories.map((cat) => {
                    const catResult = result.categories.find(
                      (c) => c.id === cat.id,
                    );
                    const score = catResult?.percent ?? 0;
                    return (
                      <div key={cat.id} className="dr-bar-row" role="listitem">
                        <div className="dr-bar-label">{cat.title}</div>
                        <div
                          className="dr-bar-track"
                          role="progressbar"
                          aria-valuenow={score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${cat.title}: ${score}%`}
                        >
                          <div
                            className="dr-bar-fill"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="dr-bar-value">{score}%</span>
                      </div>
                    );
                  })}
                </div>

                <div className="dr-insights">
                  {result.strengths.length > 0 && (
                    <div className="dr-insight-section">
                      <h3 className="dr-insight-title">
                        <Check
                          size={18}
                          aria-hidden="true"
                          className="dr-strength-icon"
                        />
                        Strengths
                      </h3>
                      <ul className="dr-insight-list">
                        {result.strengths.map(
                          (s: CategoryResult, i: number) => (
                            <li key={i}>{s.title}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {result.gaps.length > 0 && (
                    <div className="dr-insight-section">
                      <h3 className="dr-insight-title">
                        <AlertCircle
                          size={18}
                          aria-hidden="true"
                          className="dr-gap-icon"
                        />
                        Gaps
                      </h3>
                      <ul className="dr-insight-list">
                        {result.gaps.map((g: CategoryResult, i: number) => (
                          <li key={i}>{g.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.shortActions.length > 0 && (
                    <div className="dr-insight-section">
                      <h3 className="dr-insight-title">Suggested next steps</h3>
                      <ul className="dr-insight-list">
                        {result.shortActions.map((a: Action, i: number) => (
                          <li key={i}>
                            <strong>{a.title}</strong>: {a.detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.mediumActions.length > 0 && (
                    <div className="dr-insight-section">
                      <h3 className="dr-insight-title">Medium-term actions</h3>
                      <ul className="dr-insight-list">
                        {result.mediumActions.map((a: Action, i: number) => (
                          <li key={i}>
                            <strong>{a.title}</strong>: {a.detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="dr-result-actions">
                  <CopyButton text={copyText} label="Copy summary" />
                  <ToolHandoff
                    interest="consultancy"
                    source="digital-readiness"
                    fields={handoffFields}
                    label="Start a project"
                  />
                  <ToolStartOver onReset={handleReset} label="Start over" />
                </div>
              </aside>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}
