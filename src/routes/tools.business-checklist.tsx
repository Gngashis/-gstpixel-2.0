import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  PageIntro,
  ScrollReveal,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  MapPin,
  Building2,
  Shield,
  Search,
} from "lucide-react";

const steps = [
  {
    id: "activity",
    title: "Define the proposed business activity",
    desc: "What will the business do? Products, services, or both? B2B, B2C, or marketplace?",
    icon: FileText,
    category: "Foundation",
  },
  {
    id: "people",
    title: "Identify the people or entities involved",
    desc: "Founders, directors, partners, shareholders, authorized signatories. PAN, Aadhaar, DIN where applicable.",
    icon: Users,
    category: "People",
  },
  {
    id: "locations",
    title: "List expected locations and operating channels",
    desc: "Registered office, additional places of business, warehouses, online channels, inter-state operations.",
    icon: MapPin,
    category: "Locations",
  },
  {
    id: "structure",
    title: "Choose and understand the legal structure",
    desc: "Proprietorship, partnership, LLP, private limited, OPC, Section 8. Each has different compliance.",
    icon: Building2,
    category: "Structure",
  },
  {
    id: "sector",
    title: "Note any sector-specific registrations to investigate",
    desc: "FSSAI (food), IEC (import/export), RERA (real estate), drug license, pollution board, professional tax.",
    icon: Shield,
    category: "Sector",
  },
  {
    id: "tax",
    title: "Map tax registration requirements",
    desc: "GST threshold, voluntary registration, composition scheme eligibility, TDS/TCS obligations.",
    icon: Search,
    category: "Tax",
  },
  {
    id: "professional",
    title: "Prepare questions for an authorised professional",
    desc: "CA, CS, or tax practitioner. Ask about timelines, costs, ongoing compliance, and entity-specific nuances.",
    icon: FileText,
    category: "Verification",
  },
  {
    id: "verify",
    title: "Verify every requirement against current official guidance",
    desc: "MCA portal, CBIC/GST portal, state portals. Rules change — confirm before acting.",
    icon: AlertCircle,
    category: "Verification",
  },
] as const;

export const Route = createFileRoute("/tools/business-checklist")({
  head: () => ({
    meta: [
      { title: "Business Checklist — GSTPIXEL" },
      {
        name: "description",
        content:
          "Create a general preparation checklist for an Indian business setup conversation.",
      },
      { property: "og:title", content: "Business Checklist — GSTPIXEL" },
      {
        property: "og:description",
        content: "A general planning aid with clear regulatory boundaries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [done, setDone] = useState<string[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gstpixel-checklist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          const validIds = new Set<string>(steps.map((s) => s.id));
          setDone(parsed.filter((id) => validIds.has(id)));
        }
      }
    } catch {
      /* optional storage */
    }
  }, []);

  useEffect(() => {
    if (!showResetConfirm) return;
    confirmRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResetConfirm(false);
        document.getElementById("reset-checklist")?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showResetConfirm]);

  useEffect(() => {
    try {
      localStorage.setItem("gstpixel-checklist", JSON.stringify(done));
    } catch {
      /* optional storage */
    }
  }, [done]);

  const progress = done.length;
  const total = steps.length;
  const percentage = Math.round((progress / total) * 100);

  const toggleStep = (stepId: string) => {
    setDone((prev) =>
      prev.includes(stepId)
        ? prev.filter((d) => d !== stepId)
        : [...prev, stepId],
    );
  };

  const handleReset = () => setShowResetConfirm(true);

  const closeConfirm = () => {
    setShowResetConfirm(false);
    document.getElementById("reset-checklist")?.focus();
  };

  const confirmReset = () => {
    setDone([]);
    setShowResetConfirm(false);
    document.getElementById("reset-checklist")?.focus();
  };

  return (
    <>
      <PageIntro
        label="Tool 04"
        title="Business checklist"
        description="A general preparation aid — not legal, tax, regulatory, or professional advice. Requirements vary by activity, structure, location, and current rules."
      />

      <section className="content-band">
        <div className="site-container tool-layout">
          <div className="tool-input-panel">
            <ScrollReveal variant="fadeInUp" delay={0}>
              <div className="checklist-header">
                <p className="label text-primary">Preparation steps</p>
                <div className="progress-summary">
                  <span>
                    {progress} of {total} completed
                  </span>
                  <span className="progress-percent">{percentage}%</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Checklist progress"
              >
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </ScrollReveal>

            <StaggeredReveal
              baseDelay={0.05}
              variant="fadeInUp"
              className="checklist"
            >
              {steps.map((step, i) => (
                <label
                  key={step.id}
                  className={`checklist-item ${done.includes(step.id) ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={done.includes(step.id)}
                    onChange={() => toggleStep(step.id)}
                    className="sr-only"
                    aria-label={step.title}
                  />
                  <div className="checklist-item-content">
                    <div className="checklist-item-header">
                      <div className="checklist-item-icon" aria-hidden="true">
                        <step.icon size={18} />
                      </div>
                      <div className="checklist-item-title-row">
                        <span className="checklist-step-number">
                          Step {i + 1}
                        </span>
                        <strong>{step.title}</strong>
                        <span className="checklist-category">
                          {step.category}
                        </span>
                      </div>
                    </div>
                    <p className="checklist-item-desc">{step.desc}</p>
                  </div>
                  <div className="checklist-item-indicator">
                    {done.includes(step.id) && (
                      <CheckCircle2
                        size={20}
                        className="check-icon"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </label>
              ))}
            </StaggeredReveal>

            {progress > 0 && (
              <ScrollReveal variant="scaleIn" delay={0.6}>
                <div className="checklist-actions">
                  <Button
                    id="reset-checklist"
                    variant="quiet"
                    onClick={handleReset}
                  >
                    Reset checklist
                  </Button>
                </div>
              </ScrollReveal>
            )}

            {showResetConfirm && (
              <div
                ref={confirmRef}
                tabIndex={-1}
                className="reset-confirm"
                role="alertdialog"
                aria-labelledby="reset-title"
                aria-describedby="reset-desc"
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  border: "1px solid var(--destructive)",
                  borderRadius: "0.5rem",
                  background:
                    "color-mix(in oklab, var(--destructive) 10%, transparent)",
                  outline: "none",
                }}
              >
                <p id="reset-title" style={{ fontWeight: 600 }}>
                  Reset checklist?
                </p>
                <p
                  id="reset-desc"
                  style={{
                    fontSize: "0.85rem",
                    marginTop: "0.5rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  This will clear all completed items. This action cannot be
                  undone.
                </p>
                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={confirmReset}
                  >
                    Confirm reset
                  </Button>
                  <Button variant="quiet" size="sm" onClick={closeConfirm}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside
            className="result-panel"
            aria-live="polite"
            aria-label="Checklist status"
          >
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="label text-primary">Preparation status</p>
            </ScrollReveal>

            <StaggeredReveal baseDelay={0.1} variant="scaleIn">
              <div
                className="status-circle"
                style={{ "--progress": percentage / 100 }}
                role="img"
                aria-label={`${percentage}% complete`}
              >
                <span className="status-text">
                  {progress}/{total}
                </span>
              </div>
            </StaggeredReveal>

            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p>Progress is saved on this device only; it is not uploaded.</p>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.4}>
              <p className="disclaimer">
                <AlertCircle size={14} /> Do not upload identity, tax,
                financial, or legal documents here. Items involving
                registrations or compliance require current official or
                professional verification.
              </p>
            </ScrollReveal>

            {progress > 0 && (
              <ScrollReveal variant="scaleIn" delay={0.5}>
                <ButtonLink
                  to="/start-your-project"
                  className="w-full"
                  search={{
                    interest: "registration",
                    context: `Business checklist: ${progress}/${total} preparation items completed`,
                  }}
                >
                  Discuss business support <ArrowRight size={16} />
                </ButtonLink>
              </ScrollReveal>
            )}
          </aside>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Boundaries"
            title="What this is — and what it isn't."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="boundary-cards"
          >
            <div className="boundary-card is">
              <CheckCircle2
                size={24}
                className="boundary-icon"
                aria-hidden="true"
              />
              <strong>General preparation aid</strong>
              <p>
                Helps you organise information before speaking with a
                professional.
              </p>
            </div>
            <div className="boundary-card is">
              <CheckCircle2
                size={24}
                className="boundary-icon"
                aria-hidden="true"
              />
              <strong>Device-local storage</strong>
              <p>
                Your progress stays in this browser. Nothing is sent to any
                server.
              </p>
            </div>
            <div className="boundary-card is">
              <CheckCircle2
                size={24}
                className="boundary-icon"
                aria-hidden="true"
              />
              <strong>Structured question list</strong>
              <p>
                Covers the common areas most businesses need to think through.
              </p>
            </div>
            <div className="boundary-card not">
              <AlertCircle
                size={24}
                className="boundary-icon warning"
                aria-hidden="true"
              />
              <strong>Not legal or tax advice</strong>
              <p>
                Only a qualified professional can advise on your specific
                situation.
              </p>
            </div>
            <div className="boundary-card not">
              <AlertCircle
                size={24}
                className="boundary-icon warning"
                aria-hidden="true"
              />
              <strong>Not a government portal</strong>
              <p>
                GSTPIXEL is an independent business. No official filings happen
                here.
              </p>
            </div>
            <div className="boundary-card not">
              <AlertCircle
                size={24}
                className="boundary-icon warning"
                aria-hidden="true"
              />
              <strong>No document uploads</strong>
              <p>
                Never share PAN, Aadhaar, bank details, or incorporation docs in
                this tool.
              </p>
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
