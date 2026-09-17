import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Code,
  Globe,
  HelpCircle,
  Target,
  TrendingUp,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  PageIntro,
  ScrollReveal,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { Button } from "@/components/ui/button";
import { businessFacts } from "@/lib/content";
import { buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/start-your-project")({
  validateSearch: (
    s: Record<string, unknown>,
  ): { interest?: string; context?: string } => ({
    ...(typeof s["interest"] === "string" ? { interest: s["interest"] } : {}),
    ...(typeof s["context"] === "string" ? { context: s["context"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Start Your Project — GSTPIXEL" },
      {
        name: "description",
        content:
          "Create a clear project or business-services enquiry for GSTPIXEL.",
      },
      { property: "og:title", content: "Start Your Project — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Create a clear project or business-services enquiry for GSTPIXEL.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/start-your-project") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/start-your-project") }],
  }),
  component: Page,
});

const needs = [
  { id: "website", label: "Website or digital platform", icon: "Globe" },
  { id: "application", label: "Web or mobile application", icon: "Code" },
  { id: "ai", label: "AI or automation", icon: "Zap" },
  {
    id: "compliance",
    label: "GST, FSSAI, or compliance support",
    icon: "Shield",
  },
  {
    id: "registration",
    label: "Business registration or setup",
    icon: "Building",
  },
  {
    id: "consultancy",
    label: "Consultancy or digital transformation",
    icon: "Target",
  },
  { id: "growth", label: "Growth support", icon: "TrendingUp" },
  { id: "unsure", label: "Not sure yet", icon: "HelpCircle" },
] as const;

const needIds = needs.map((n) => n.id);

/* Icons are declared by name in the data above; resolve them for rendering so
   the label text never leaks into the UI. */
const needIcons: Record<string, LucideIcon> = {
  Building: Building2,
  Code,
  Globe,
  HelpCircle,
  Target,
  TrendingUp,
  Zap,
};

const resolveNeedIcon = (name: string): LucideIcon =>
  needIcons[name] ?? HelpCircle;

function resolveNeedId(incoming: string | undefined): string {
  if (!incoming) return "";
  if (needIds.includes(incoming as (typeof needIds)[number])) return incoming;
  const lower = incoming.toLowerCase();
  if (
    lower.includes("website") ||
    lower.includes("ecommerce") ||
    lower.includes("digital platform")
  )
    return "website";
  if (
    lower.includes("web app") ||
    lower.includes("mobile app") ||
    lower.includes("application")
  )
    return "application";
  if (lower.includes("ai") || lower.includes("automation")) return "ai";
  if (
    lower.includes("gst") ||
    lower.includes("fssai") ||
    lower.includes("compliance")
  )
    return "compliance";
  if (
    lower.includes("registration") ||
    lower.includes("business setup") ||
    lower.includes("setup")
  )
    return "registration";
  if (
    lower.includes("consult") ||
    lower.includes("transformation") ||
    lower.includes("strategy")
  )
    return "consultancy";
  if (
    lower.includes("growth") ||
    lower.includes("reach") ||
    lower.includes("conversion")
  )
    return "growth";
  return "unsure";
}

const stages = [
  {
    id: "exploring",
    label: "Exploring an idea",
    desc: "Early stage, gathering information",
  },
  {
    id: "planning",
    label: "Planning and comparing",
    desc: "Evaluating options and approaches",
  },
  {
    id: "ready",
    label: "Ready to begin",
    desc: "Clear direction, need execution partner",
  },
  {
    id: "improving",
    label: "Improving something existing",
    desc: "Refactoring, redesigning, or extending",
  },
  {
    id: "guidance",
    label: "Need help understanding the next step",
    desc: "Unclear on priorities or sequence",
  },
] as const;

const stepLabels = [
  "Need",
  "Stage",
  "Context",
  "Planning",
  "Contact",
  "Review",
] as const;

type Form = {
  need: string;
  stage: string;
  details: string;
  budget: string;
  timing: string;
  name: string;
  email: string;
  phone: string;
  reply: string;
};

const empty: Form = {
  need: "",
  stage: "",
  details: "",
  budget: "",
  timing: "",
  name: "",
  email: "",
  phone: "",
  reply: "Email",
};

function restoreForm(value: unknown): Partial<Form> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const saved = value as Record<string, unknown>;
  const restored: Partial<Form> = {};
  const stringFields: (keyof Form)[] = [
    "need",
    "stage",
    "details",
    "budget",
    "timing",
    "name",
    "email",
    "phone",
  ];

  for (const field of stringFields) {
    if (typeof saved[field] === "string") restored[field] = saved[field];
  }
  if (
    saved["reply"] === "Email" ||
    saved["reply"] === "Phone" ||
    saved["reply"] === "WhatsApp"
  ) {
    restored.reply = saved["reply"];
  }
  return restored;
}

const budgetOptions = [
  { value: "", label: "Prefer not to say" },
  { value: "under-1l", label: "Under ₹1 lakh" },
  { value: "1l-5l", label: "₹1–5 lakh" },
  { value: "5l-15l", label: "₹5–15 lakh" },
  { value: "above-15l", label: "Above ₹15 lakh" },
  { value: "help-framing", label: "Need help framing this" },
] as const;

const timingOptions = [
  { value: "", label: "No fixed timing" },
  { value: "this-quarter", label: "Exploring this quarter" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "asap", label: "As soon as practical" },
  { value: "help-planning", label: "Need help planning" },
] as const;

const replyOptions = [
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
  { value: "WhatsApp", label: "WhatsApp" },
] as const;

function Page() {
  const search = Route.useSearch();
  const interest = search["interest"];
  const context = search["context"];
  const [step, setStep] = useState(0);
  const resolvedNeed = resolveNeedId(search["interest"] as string | undefined);
  const hasFreshContext = Boolean(search["interest"] || search["context"]);
  const [form, setForm] = useState<Form>({
    ...empty,
    need: resolvedNeed,
    details: search["context"] ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [hadDraft, setHadDraft] = useState(false);

  const set = (key: keyof Form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  useEffect(() => {
    let draftExists = false;
    try {
      const saved = sessionStorage.getItem("gstpixel-enquiry");
      if (saved) {
        draftExists = true;
        if (!hasFreshContext) {
          const restored = restoreForm(JSON.parse(saved));
          setForm((current) => ({
            ...current,
            ...restored,
            ...(resolvedNeed ? { need: resolvedNeed } : {}),
            ...(context ? { details: context } : {}),
          }));
        }
      }
    } catch {
      /* storage is optional */
    } finally {
      setHadDraft(draftExists);
    }
  }, [context, hasFreshContext, resolvedNeed]);

  useEffect(() => {
    try {
      sessionStorage.setItem("gstpixel-enquiry", JSON.stringify(form));
    } catch {
      /* storage is optional */
    }
  }, [form]);

  const handleResetDraft = () => {
    setForm({ ...empty, need: resolvedNeed, details: context ?? "" });
    try {
      sessionStorage.removeItem("gstpixel-enquiry");
    } catch {
      /* storage is optional */
    }
    setStep(0);
    setErrors({});
    setHadDraft(false);
  };

  const showDraftNotice = hasFreshContext && hadDraft;

  const deriveErrors = (
    s: number,
    currentForm: Form,
  ): Partial<Record<keyof Form, string>> => {
    const newErrors: Partial<Record<keyof Form, string>> = {};

    if (s === 0 && !currentForm.need)
      newErrors.need = "Please select what you need help with";
    if (s === 1 && !currentForm.stage)
      newErrors.stage = "Please select your current stage";
    if (s === 4) {
      if (!currentForm.name.trim()) newErrors.name = "Name is required";
      if (
        !currentForm.email.trim() ||
        !/^\S+@\S+\.\S+$/.test(currentForm.email)
      )
        newErrors.email = "Valid email is required";
      if (currentForm.reply !== "Email") {
        const digits = currentForm.phone.replace(/\D/g, "");
        if (!currentForm.phone.trim()) {
          newErrors.phone = "Phone number is required for this reply method";
        } else if (digits.length < 7 || digits.length > 15) {
          newErrors.phone = "Enter a valid phone number";
        }
      }
    }

    return newErrors;
  };

  const validateStep = (s: number): boolean => {
    const newErrors = deriveErrors(s, form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const focusFirstError = (errorKeys: string[]) => {
    if (errorKeys.length === 0) return;
    const firstErrorKey = errorKeys[0] as keyof Form;
    const element =
      document.getElementById(firstErrorKey) ??
      document.querySelector<HTMLElement>(`input[name="${firstErrorKey}"]`);
    element?.focus({ preventScroll: true });
  };

  const next = () => {
    const newErrors = deriveErrors(step, form);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep((current) => Math.min(5, current + 1));
    } else {
      setErrors(newErrors);
      focusFirstError(Object.keys(newErrors));
    }
  };

  const handleSubmit = () => {
    const newErrors = deriveErrors(4, form);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep(5);
    } else {
      setErrors(newErrors);
      focusFirstError(Object.keys(newErrors));
    }
  };

  const canContinue =
    step === 0 ? Boolean(form.need) : step === 1 ? Boolean(form.stage) : true;

  const progress = ((step + 1) / stepLabels.length) * 100;

  return (
    <>
      <PageIntro
        label="Start your project"
        title="A clearer brief starts here."
        description="Answer only what is useful — your answers stay in this browser session. Electronic submission is not enabled yet, so the direct phone, WhatsApp, and email routes below always work."
      />

      <section className="content-band">
        <div className="site-container enquiry-shell">
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div
              className="enquiry-progress"
              aria-label={`Step ${step + 1} of ${stepLabels.length}`}
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={stepLabels.length}
            >
              <span style={{ width: `${progress}%` }} />
              <small>
                Step {step + 1} of {stepLabels.length} · {stepLabels[step]}
              </small>
            </div>
          </ScrollReveal>

          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="step-announcer"
          >
            Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
          </div>

          {showDraftNotice && (
            <div
              className="draft-notice"
              role="status"
              style={{ marginBottom: "1.5rem" }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted-foreground)",
                }}
              >
                You arrived with fresh context from a tool. A previous draft
                also exists.
              </p>
              <Button
                variant="quiet"
                size="sm"
                onClick={handleResetDraft}
                style={{ marginTop: "0.5rem" }}
              >
                Start fresh with tool context
              </Button>
            </div>
          )}

          <div className="enquiry-step" key={step}>
            {step === 0 && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <fieldset>
                  <legend>What do you need help with?</legend>
                  <StaggeredReveal
                    baseDelay={0.05}
                    variant="fadeInUp"
                    className="need-choice-grid"
                  >
                    {needs.map((need) => (
                      <label
                        key={need.id}
                        className={`need-choice ${form.need === need.id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="need"
                          checked={form.need === need.id}
                          onChange={() => set("need", need.id)}
                          className="sr-only"
                        />
                        <div className="need-choice-content">
                          <div className="need-choice-icon" aria-hidden="true">
                            {(() => {
                              const Icon = resolveNeedIcon(need.icon);
                              return <Icon size={18} />;
                            })()}
                          </div>
                          <strong>{need.label}</strong>
                        </div>
                        {form.need === need.id && (
                          <CheckCircle2
                            size={20}
                            className="choice-check"
                            aria-hidden="true"
                          />
                        )}
                      </label>
                    ))}
                  </StaggeredReveal>
                  {errors.need && (
                    <p className="field-error" role="alert">
                      <X size={14} /> {errors.need}
                    </p>
                  )}
                </fieldset>
              </ScrollReveal>
            )}

            {step === 1 && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <fieldset>
                  <legend>Where are you now?</legend>
                  <StaggeredReveal
                    baseDelay={0.05}
                    variant="fadeInUp"
                    className="stage-choice-stack"
                  >
                    {stages.map((stage) => (
                      <label
                        key={stage.id}
                        className={`stage-choice ${form.stage === stage.id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="stage"
                          checked={form.stage === stage.id}
                          onChange={() => set("stage", stage.id)}
                          className="sr-only"
                        />
                        <div className="stage-choice-content">
                          <strong>{stage.label}</strong>
                          <span className="stage-desc">{stage.desc}</span>
                        </div>
                        {form.stage === stage.id && (
                          <CheckCircle2
                            size={20}
                            className="choice-check"
                            aria-hidden="true"
                          />
                        )}
                      </label>
                    ))}
                  </StaggeredReveal>
                  {errors.stage && (
                    <p className="field-error" role="alert">
                      <X size={14} /> {errors.stage}
                    </p>
                  )}
                </fieldset>
              </ScrollReveal>
            )}

            {step === 2 && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <div>
                  <label className="form-label" htmlFor="details">
                    What would a useful outcome look like?
                  </label>
                  <textarea
                    id="details"
                    className="form-control min-h-[160px]"
                    value={form.details}
                    onChange={(e) => set("details", e.target.value)}
                    placeholder="Describe the requirement, audience, constraints, or deadline if relevant."
                  />
                  <p className="field-note">
                    Do not include passwords, financial details, identity
                    numbers, or confidential documents.
                  </p>
                </div>
              </ScrollReveal>
            )}

            {step === 3 && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <div className="detail-grid">
                  <div>
                    <label className="form-label" htmlFor="budget">
                      Budget guidance (optional)
                    </label>
                    <select
                      id="budget"
                      className="form-control"
                      value={form.budget}
                      onChange={(e) => set("budget", e.target.value)}
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <label className="form-label mt-6" htmlFor="timing">
                      Timing (optional)
                    </label>
                    <select
                      id="timing"
                      className="form-control"
                      value={form.timing}
                      onChange={(e) => set("timing", e.target.value)}
                    >
                      {timingOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="result-panel">
                    <p className="label text-primary">Planning note</p>
                    <h2>No invented quote</h2>
                    <p>
                      These optional answers help frame a conversation. They do
                      not create a price, promise availability, or commit either
                      side.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {step === 4 && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <div className="detail-grid">
                  <div>
                    <label className="form-label" htmlFor="name">
                      Your name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      className={`form-control ${errors.name ? "error" : ""}`}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                      required
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="field-error" role="alert">
                        <X size={14} /> {errors.name}
                      </p>
                    )}

                    <label className="form-label mt-6" htmlFor="email">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      className={`form-control ${errors.email ? "error" : ""}`}
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                      required
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <p id="email-error" className="field-error" role="alert">
                        <X size={14} /> {errors.email}
                      </p>
                    )}

                    <label className="form-label mt-6" htmlFor="reply">
                      Preferred reply method
                    </label>
                    <select
                      id="reply"
                      className="form-control"
                      value={form.reply}
                      onChange={(e) => set("reply", e.target.value)}
                    >
                      {replyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {form.reply !== "Email" && (
                      <>
                        <label className="form-label mt-6" htmlFor="phone">
                          Phone / WhatsApp number{" "}
                          <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="phone"
                          className={`form-control ${errors.phone ? "error" : ""}`}
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          autoComplete="tel"
                          required
                          aria-invalid={!!errors.phone}
                          aria-describedby={
                            errors.phone ? "phone-error" : undefined
                          }
                        />
                        {errors.phone && (
                          <p
                            id="phone-error"
                            className="field-error"
                            role="alert"
                          >
                            <X size={14} /> {errors.phone}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <p className="field-note">
                    Required fields are marked *. We do not require an account.
                  </p>
                </div>
              </ScrollReveal>
            )}

            {step === 5 && (
              <ScrollReveal variant="fadeInUp" delay={0.1}>
                <div className="review-panel">
                  <p className="label text-primary">Review and edit</p>
                  <h2>Ready to discuss</h2>
                  <StaggeredReveal baseDelay={0.05} variant="fadeInUp">
                    {[
                      [
                        "Need",
                        form.need
                          ? needs.find((n) => n.id === form.need)?.label ||
                            form.need
                          : "Not specified",
                        0,
                      ],
                      [
                        "Stage",
                        form.stage
                          ? stages.find((s) => s.id === form.stage)?.label ||
                            form.stage
                          : "Not specified",
                        1,
                      ],
                      ["Outcome", form.details || "Not specified", 2],
                      [
                        "Planning",
                        [
                          form.budget
                            ? budgetOptions.find((b) => b.value === form.budget)
                                ?.label
                            : "No budget guidance",
                          form.timing
                            ? timingOptions.find((t) => t.value === form.timing)
                                ?.label
                            : "No fixed timing",
                        ].join(" · "),
                        3,
                      ],
                      [
                        "Contact",
                        `${form.name} · ${form.email} · ${form.reply}`,
                        4,
                      ],
                    ].map(([label, value, index]) => (
                      <div key={label} className="review-row">
                        <span className="label">{label}</span>
                        <strong>{value}</strong>
                        <button
                          type="button"
                          onClick={() => setStep(index as number)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </StaggeredReveal>
                  <div className="notice" role="status">
                    <strong>Submission is not configured yet.</strong>
                    <p>
                      Your enquiry has not been sent. GSTPIXEL will need to
                      confirm its recipient inbox and acknowledgement process
                      before delivery can be enabled.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <div className="enquiry-actions">
              {step > 0 && (
                <Button variant="quiet" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
              )}
              {step < 5 ? (
                <Button
                  onClick={step === 4 ? handleSubmit : next}
                  disabled={Object.keys(deriveErrors(step, form)).length > 0}
                >
                  {step === 4 ? "Review" : "Continue"} <ArrowRight size={16} />
                </Button>
              ) : (
                <Button disabled>
                  <Check size={16} /> Sending unavailable
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container detail-grid">
          <div>
            <SectionHeader
              label="Direct routes"
              title="Prefer to talk first? These always work."
            />
            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <p className="section-copy" style={{ marginTop: "1.5rem" }}>
                The guided enquiry is optional. Until electronic submission is
                enabled, phone, WhatsApp, and email are the surest ways to reach{" "}
                {businessFacts.name} — speak directly with{" "}
                {businessFacts.founder}, {businessFacts.founderTitle}. If you
                have already answered the steps above, mention what you filled
                in and the context can continue from there.
              </p>
              <div className="contact-methods" style={{ marginTop: "1.5rem" }}>
                {[
                  {
                    label: "Phone",
                    value: businessFacts.phone.label,
                    href: businessFacts.phone.href,
                  },
                  {
                    label: "WhatsApp",
                    value: businessFacts.whatsapp.label,
                    href: businessFacts.whatsapp.href,
                  },
                  {
                    label: "Email",
                    value: businessFacts.email.label,
                    href: businessFacts.email.href,
                  },
                ].map((route) => (
                  <a
                    key={route.label}
                    href={route.href}
                    className="contact-method glass-light luminous-edge"
                    style={{
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                    }}
                  >
                    <span
                      className="method-label"
                      style={{
                        font: "500 0.65rem var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {route.label}
                    </span>
                    <span
                      className="method-value"
                      style={{ font: "600 1rem var(--font-body)" }}
                    >
                      {route.value}
                    </span>
                  </a>
                ))}
              </div>
            </StaggeredReveal>
          </div>
          <div
            className="result-panel glass-light luminous-edge"
            style={{ borderRadius: "0.75rem", padding: "2rem" }}
          >
            <p className="label text-primary">What happens next</p>
            <h2 style={{ font: "700 1.6rem var(--font-display)" }}>
              A conversation, not a commitment.
            </h2>
            <p className="section-copy">
              Your answers are a starting point, not a contract. Nothing is sent
              anywhere until you choose to share it, and every field can be
              edited or skipped.
            </p>
            <p className="section-copy">
              Prefer to explore first? The <Link to="/tools">tools</Link> and{" "}
              <Link to="/solutions">outcome routes</Link> can shape the same
              context before you reach out.
            </p>
          </div>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="How this works"
            title="Transparent. Editable. No pressure."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="enquiry-principles"
          >
            <div className="principle-card">
              <CheckCircle2
                size={24}
                className="principle-icon"
                aria-hidden="true"
              />
              <strong>Your data stays yours</strong>
              <p>
                Stored locally in this browser session. Not sent anywhere until
                you confirm and delivery is verified.
              </p>
            </div>
            <div className="principle-card">
              <CheckCircle2
                size={24}
                className="principle-icon"
                aria-hidden="true"
              />
              <strong>Answer only what helps</strong>
              <p>
                Most fields are optional. Required fields are marked when you
                reach the contact step. The enquiry adapts to what you provide.
              </p>
            </div>
            <div className="principle-card">
              <CheckCircle2
                size={24}
                className="principle-icon"
                aria-hidden="true"
              />
              <strong>Context travels with you</strong>
              <p>
                Start from a service, solution, or tool — your selection
                pre-fills relevant fields. Edit freely.
              </p>
            </div>
            <div className="principle-card">
              <CheckCircle2
                size={24}
                className="principle-icon"
                aria-hidden="true"
              />
              <strong>No fabricated urgency</strong>
              <p>
                No countdown timers, limited spots, or pressure tactics. You
                decide the pace.
              </p>
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
