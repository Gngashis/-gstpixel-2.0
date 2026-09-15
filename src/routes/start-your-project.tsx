import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageIntro } from "@/components/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/start-your-project")({
  validateSearch: (s: Record<string, unknown>): { interest?: string; context?: string } => ({
    ...(typeof s["interest"] === "string" ? { interest: s["interest"] } : {}),
    ...(typeof s["context"] === "string" ? { context: s["context"] } : {}),
  }),
  head: () => ({ meta: [{ title: "Start Your Project — GSTPIXEL" }, { name: "description", content: "Create a clear project or business-services enquiry for GSTPIXEL." }] }),
  component: Page,
});

const needs = ["Website or digital platform", "Web or mobile application", "AI or automation", "GST, FSSAI, or compliance support", "Business registration or setup", "Consultancy or digital transformation", "Growth support", "Not sure yet"];
const stages = ["Exploring an idea", "Planning and comparing", "Ready to begin", "Improving something existing", "Need help understanding the next step"];
const steps = ["Need", "Requirement", "Context", "Planning", "Contact", "Review"];
type Form = { need: string; stage: string; details: string; budget: string; timing: string; name: string; email: string; phone: string; reply: string };
const empty: Form = { need: "", stage: "", details: "", budget: "", timing: "", name: "", email: "", phone: "", reply: "Email" };

function Page() {
  const search = Route.useSearch();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({ ...empty, need: search["interest"] ?? "", details: search["context"] ?? "" });
  const set = (key: keyof Form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  useEffect(() => { try { const saved = sessionStorage.getItem("gstpixel-enquiry"); if (saved) setForm((current) => ({ ...current, ...JSON.parse(saved) })); } catch { /* storage is optional */ } }, []);
  useEffect(() => { try { sessionStorage.setItem("gstpixel-enquiry", JSON.stringify(form)); } catch { /* storage is optional */ } }, [form]);
  const valid = step === 0 ? !!form.need : step === 1 ? !!form.stage : step === 4 ? !!form.name && /\S+@\S+\.\S+/.test(form.email) && (form.reply !== "Phone" || !!form.phone) : true;
  const next = () => { if (valid) setStep((current) => Math.min(5, current + 1)); };
  return <><PageIntro label="Start your project" title="A clearer brief starts here." description="Answer only what is useful. Your answers stay in this session while the verified delivery inbox is being configured."/><section className="content-band"><div className="site-container enquiry-shell">
    <div className="enquiry-progress" aria-label={`Step ${step + 1} of ${steps.length}`}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /><small>Step {step + 1} of {steps.length} · {steps[step]}</small></div>
    <div className="enquiry-step" key={step}>
      {step === 0 && <fieldset><legend>What do you need help with?</legend><div className="choice-stack">{needs.map((x) => <label key={x}><input type="radio" name="need" checked={form.need === x} onChange={() => set("need", x)} /><span><b>{x}</b></span></label>)}</div></fieldset>}
      {step === 1 && <fieldset><legend>Where are you now?</legend><div className="choice-stack">{stages.map((x) => <label key={x}><input type="radio" name="stage" checked={form.stage === x} onChange={() => set("stage", x)} /><span><b>{x}</b></span></label>)}</div></fieldset>}
      {step === 2 && <div><label className="form-label" htmlFor="details">What would a useful outcome look like?</label><textarea id="details" className="form-control min-h-40" value={form.details} onChange={(e) => set("details", e.target.value)} placeholder="Describe the requirement, audience, constraints, or deadline if relevant."/><p className="field-note">Do not include passwords, financial details, identity numbers, or confidential documents.</p></div>}
      {step === 3 && <div className="detail-grid"><div><label className="form-label" htmlFor="budget">Budget guidance (optional)</label><select id="budget" className="form-control" value={form.budget} onChange={(e) => set("budget", e.target.value)}><option value="">Prefer not to say</option><option>Under ₹1 lakh</option><option>₹1–5 lakh</option><option>₹5–15 lakh</option><option>Above ₹15 lakh</option><option>Need help framing this</option></select><label className="form-label mt-6" htmlFor="timing">Timing (optional)</label><select id="timing" className="form-control" value={form.timing} onChange={(e) => set("timing", e.target.value)}><option value="">No fixed timing</option><option>Exploring this quarter</option><option>Within 1–3 months</option><option>As soon as practical</option><option>Need help planning</option></select></div><div className="result-panel"><p className="label text-primary">Planning note</p><h2>No invented quote</h2><p>These optional answers help frame a conversation. They do not create a price, promise availability, or commit either side.</p></div></div>}
      {step === 4 && <div className="detail-grid"><div><label className="form-label" htmlFor="name">Your name <span aria-hidden="true">*</span></label><input id="name" className="form-control" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required/><label className="form-label mt-6" htmlFor="email">Email <span aria-hidden="true">*</span></label><input id="email" className="form-control" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" required/><label className="form-label mt-6" htmlFor="reply">Preferred reply method</label><select id="reply" className="form-control" value={form.reply} onChange={(e) => set("reply", e.target.value)}><option>Email</option><option>Phone</option><option>WhatsApp</option></select>{form.reply !== "Email" && <><label className="form-label mt-6" htmlFor="phone">Phone / WhatsApp number <span aria-hidden="true">*</span></label><input id="phone" className="form-control" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" required/></>}</div><p className="field-note">Required fields are marked *. We do not require an account.</p></div>}
      {step === 5 && <div className="review-panel"><p className="label text-primary">Review and edit</p><h2>Ready to discuss</h2>{[["Need", form.need, 0], ["Stage", form.stage, 1], ["Outcome", form.details || "Not specified", 2], ["Planning", [form.budget || "No budget guidance", form.timing || "No fixed timing"].join(" · "), 3], ["Contact", `${form.name} · ${form.email} · ${form.reply}`, 4]].map(([label, value, index]) => <div className="review-row" key={label as string}><span className="label">{label as string}</span><strong>{value as string}</strong><button type="button" onClick={() => setStep(index as number)}>Edit</button></div>)}<div className="notice" role="status"><strong>Submission is not configured yet.</strong><p>Your enquiry has not been sent. GSTPIXEL will need to confirm its recipient inbox and acknowledgement process before delivery can be enabled.</p></div></div>}
    </div>
    <div className="enquiry-actions">{step > 0 && <Button variant="quiet" onClick={() => setStep(step - 1)}><ArrowLeft size={16}/> Back</Button>}{step < 5 ? <Button onClick={next} disabled={!valid}>Continue <ArrowRight size={16}/></Button> : <Button disabled><Check size={16}/> Sending unavailable</Button>}</div>
  </div></section></>;
}
