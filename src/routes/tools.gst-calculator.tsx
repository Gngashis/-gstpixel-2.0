import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PageIntro,
  ScrollReveal,
  StaggeredReveal,
  SectionHeader,
} from "@/components/page";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Info, AlertCircle } from "lucide-react";
import { buildCanonical } from "@/lib/seo";

const commonRates = [
  { rate: 0, label: "0% — Exempt / Nil rated" },
  { rate: 0.25, label: "0.25% — Rough diamonds" },
  { rate: 1.5, label: "1.5% — Gold jewellery (making charges)" },
  { rate: 3, label: "3% — Gold, silver, precious metals" },
  { rate: 5, label: "5% — Essential goods, transport" },
  { rate: 12, label: "12% — Processed foods, computers" },
  { rate: 18, label: "18% — Most services, electronics" },
  { rate: 28, label: "28% — Luxury items, automobiles" },
] as const;

function money(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export const Route = createFileRoute("/tools/gst-calculator")({
  head: () => ({
    meta: [
      { title: "GST Calculator — GSTPIXEL" },
      {
        name: "description",
        content:
          "Calculate inclusive or exclusive GST using an amount and rate you provide.",
      },
      { property: "og:title", content: "GST Calculator — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "An educational GST arithmetic calculator with explicit assumptions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/tools/gst-calculator") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/gst-calculator") },
    ],
  }),
  component: Page,
});

function Page() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [showQuickRates, setShowQuickRates] = useState(false);

  const a = Number(amount);
  const r = Number(rate);
  const invalid =
    (amount !== "" && (!Number.isFinite(a) || a < 0)) ||
    (rate !== "" && (!Number.isFinite(r) || r < 0 || r > 100));

  const result = useMemo(() => {
    if (!amount || !rate || invalid) return null;
    if (mode === "exclusive")
      return { base: a, tax: (a * r) / 100, total: a * (1 + r / 100) };
    const base = a / (1 + r / 100);
    return { base, tax: a - base, total: a };
  }, [amount, rate, mode, invalid, a, r]);

  const handleQuickRate = (r: number) => {
    setRate(String(r));
    setShowQuickRates(false);
  };

  const handleReset = () => {
    setAmount("");
    setRate("");
    setMode("exclusive");
  };

  const hasResult = result !== null;

  return (
    <>
      <PageIntro
        label="Tool 03"
        title="GST calculator"
        description="Educational arithmetic only. Enter the amount, choose whether it includes GST, and provide the applicable rate yourself."
      />

      <section className="content-band">
        <div className="site-container tool-layout">
          <div className="tool-input-panel">
            <ScrollReveal variant="fadeInUp" delay={0}>
              <div className="input-row">
                <label className="form-label" htmlFor="amount">
                  Amount in INR
                </label>
                <span className="input-hint">
                  Enter base or inclusive amount
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <input
                id="amount"
                className="form-control form-control-lg"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                aria-describedby="amount-hint"
              />
              <span id="amount-hint" className="field-note">
                The amount you enter will be treated as base (excludes GST) or
                inclusive based on the mode below.
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <div className="input-row">
                <label className="form-label mt-6" htmlFor="rate">
                  GST rate (%)
                </label>
                <span className="input-hint">
                  Enter any rate 0–100, or pick a common one
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <div className="rate-input-wrapper">
                <input
                  id="rate"
                  className="form-control"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="Enter a rate"
                />
                <button
                  type="button"
                  className="quick-rates-toggle"
                  onClick={() => setShowQuickRates(!showQuickRates)}
                  aria-expanded={showQuickRates}
                  aria-controls="quick-rates-panel"
                >
                  <Info size={16} /> Common rates
                </button>
              </div>
              {invalid && (
                <p className="field-error" role="alert">
                  <AlertCircle size={14} /> Enter an amount of 0 or more and a
                  GST rate from 0 to 100.
                </p>
              )}
              {showQuickRates && (
                <ScrollReveal variant="scaleIn" delay={0.05}>
                  <div
                    id="quick-rates-panel"
                    className="quick-rates-panel"
                    role="listbox"
                    aria-label="Common GST rates"
                  >
                    {commonRates.map((cr) => (
                      <button
                        key={cr.rate}
                        type="button"
                        className="quick-rate-option"
                        onClick={() => handleQuickRate(cr.rate)}
                        role="option"
                      >
                        <span className="quick-rate-value">{cr.rate}%</span>
                        <span className="quick-rate-label">{cr.label}</span>
                      </button>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.4}>
              <fieldset className="mt-6">
                <legend className="form-label">Amount type</legend>
                <div
                  className="segmented"
                  role="radiogroup"
                  aria-label="Amount type"
                >
                  <label className={mode === "exclusive" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === "exclusive"}
                      onChange={() => setMode("exclusive")}
                      className="sr-only"
                    />
                    <div className="segmented-option">
                      <Calculator size={16} aria-hidden="true" />
                      <div>
                        <strong>Excludes GST</strong>
                        <span>Amount is the base price</span>
                      </div>
                    </div>
                  </label>
                  <label className={mode === "inclusive" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === "inclusive"}
                      onChange={() => setMode("inclusive")}
                      className="sr-only"
                    />
                    <div className="segmented-option">
                      <Calculator size={16} aria-hidden="true" />
                      <div>
                        <strong>Includes GST</strong>
                        <span>Amount already has GST added</span>
                      </div>
                    </div>
                  </label>
                </div>
              </fieldset>
            </ScrollReveal>

            {(amount || rate) && (
              <ScrollReveal variant="scaleIn" delay={0.5}>
                <Button variant="quiet" className="mt-5" onClick={handleReset}>
                  Reset calculator
                </Button>
              </ScrollReveal>
            )}
          </div>

          <aside
            className="result-panel"
            aria-live="polite"
            aria-label="GST calculation result"
          >
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="label text-primary">Calculation</p>
            </ScrollReveal>

            <StaggeredReveal baseDelay={0.08} variant="fadeInUp">
              <dl className="calculation">
                <div className={hasResult ? "" : "empty"}>
                  <dt>Base amount</dt>
                  <dd>{result ? money(result.base) : "—"}</dd>
                </div>
                <div className={hasResult ? "" : "empty"}>
                  <dt>GST amount</dt>
                  <dd>{result ? money(result.tax) : "—"}</dd>
                </div>
                <div className={hasResult ? "" : "empty"}>
                  <dt>Total</dt>
                  <dd>{result ? money(result.total) : "—"}</dd>
                </div>
              </dl>
            </StaggeredReveal>

            {hasResult && (
              <StaggeredReveal baseDelay={0.15} variant="fadeInUp">
                <div className="calculation-breakdown">
                  <p className="breakdown-label">Breakdown</p>
                  <p className="breakdown-formula">
                    {mode === "exclusive"
                      ? `₹${Number(amount).toLocaleString("en-IN")} × ${rate}% = ₹${result.tax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GST`
                      : `₹${Number(amount).toLocaleString("en-IN")} ÷ (1 + ${rate}%) = ₹${result.base.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} base`}
                  </p>
                </div>
              </StaggeredReveal>
            )}

            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="disclaimer">
                <AlertCircle size={14} /> This calculator performs arithmetic
                only. It does not determine taxability, place of supply,
                classification, exemptions, or the correct rate. Confirm the
                applicable treatment with an authorised professional or official
                source.
              </p>
            </ScrollReveal>
          </aside>
        </div>
      </section>

      <section className="content-band bg-secondary">
        <div className="site-container">
          <SectionHeader
            label="Important context"
            title="Arithmetic ≠ advice."
          />
          <StaggeredReveal
            baseDelay={0.08}
            variant="fadeInUp"
            className="calculator-principles"
          >
            <div className="principle-card">
              <strong>You choose the rate</strong>
              <p>
                Rates vary by HSN/SAC, state, notification, and transaction
                type. This tool does not look up rates.
              </p>
            </div>
            <div className="principle-card">
              <strong>No taxability logic</strong>
              <p>
                Whether GST applies, reverse charge, or exemption applies is not
                calculated here.
              </p>
            </div>
            <div className="principle-card">
              <strong>No place of supply</strong>
              <p>
                IGST vs CGST+SGST depends on supplier/recipient locations. Not
                computed.
              </p>
            </div>
            <div className="principle-card">
              <strong>Professional verification required</strong>
              <p>
                Use this for estimation. File returns and collect taxes based on
                authorised advice.
              </p>
            </div>
          </StaggeredReveal>
        </div>
      </section>
    </>
  );
}
