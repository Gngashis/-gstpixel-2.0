import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, X } from "lucide-react";
import {
  PageIntro,
  ScrollReveal,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { Button } from "@/components/ui/button";

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
    ],
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
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({
    ...empty,
    need: search["interest"] ?? "",
    details: search["context"] ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  const set = (key: keyof Form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("gstpixel-enquiry");
      if (saved) setForm((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {
      /* storage is optional */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("gstpixel-enquiry", JSON.stringify(form));
    } catch {
      /* storage is optional */
    }
  }, [form]);

  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof Form, string>> = {};

    if (s === 0 && !form.need)
      newErrors.need = "Please select what you need help with";
    if (s === 1 && !form.stage)
      newErrors.stage = "Please select your current stage";
    if (s === 4) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
        newErrors.email = "Valid email is required";
      if (form.reply !== "Email" && !form.phone.trim())
        newErrors.phone = "Phone number is required for this reply method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((current) => Math.min(5, current + 1));
  };

  const handleSubmit = () => {
    if (validateStep(4)) setStep(5);
  };

  const progress = ((step + 1) / stepLabels.length) * 100;

  return (
    <>
      <PageIntro
        label="Start your project"
        title="A clearer brief starts here."
        description="Answer only what is useful. Your answers stay in this session while the verified delivery inbox is being configured."
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
                            <span className="icon-placeholder">
                              {need.icon}
                            </span>
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
                  disabled={!validateStep(step)}
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
              <strong>Every field is optional</strong>
              <p>
                Answer only what helps. Skip what doesn't. The enquiry adapts to
                what you provide.
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
