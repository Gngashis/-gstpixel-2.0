import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageIntro } from "@/components/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tools/service-finder")({
  head: () => ({ meta: [{ title: "Service Finder — GSTPIXEL" }, { name: "description", content: "Find a transparent GSTPIXEL service recommendation based on your desired outcome." }] }),
  component: Page,
});

const recommendations = [
  ["digital-presence", "Build a website or ecommerce presence", "Website development, ecommerce/platforms, growth support", "A public-facing presence or selling experience is the clearest first step."],
  ["product-app", "Build a web or mobile application", "Web applications, mobile applications, AI integrations", "A product workflow needs a defined user experience and maintainable application foundation."],
  ["operations", "Digitize or automate a process", "Workflow automation, process digitization, AI integrations", "The opportunity is in reducing repeated work and making handoffs visible."],
  ["business-start", "Start or formalise a business", "Business registration, GST-related services, FSSAI-related services", "Setup and operating questions should be mapped before optional digital complexity."],
  ["compliance", "Understand GST, FSSAI, or compliance", "GST-related services, FSSAI-related services, compliance support", "A structured question list and professional verification path can reduce uncertainty."],
  ["strategy", "Plan digital transformation or technology", "Business consultancy, digital transformation, technology strategy", "A decision framework can connect business priorities to a practical technology roadmap."],
  ["growth", "Improve reach, conversion, or growth", "Growth support, websites/digital platforms, business consultancy", "Growth work is strongest when the audience, offer, and measurement loop are explicit."],
] as const;

function Page() {
  const [slug, setSlug] = useState("");
  const result = recommendations.find((item) => item[0] === slug);
  return <><PageIntro label="Tool 02" title="Service finder" description="Choose the outcome closest to your situation. The recommendation uses simple visible rules—not a claim of AI certainty—and remains editable." /><section className="content-band"><div className="site-container tool-layout"><div className="choice-stack">{recommendations.map((item) => <label key={item[0]}><input type="radio" name="path" checked={slug === item[0]} onChange={() => setSlug(item[0])} /><span><b>{item[1]}</b><small>{item[2]}</small></span></label>)}</div><aside className="result-panel" aria-live="polite"><p className="label text-primary">Editable recommendation</p><h2>{result?.[1] || "Choose an outcome"}</h2>{result && <><p>Relevant paths: {result[2]}</p><p className="disclaimer">Why this appears: {result[3]} You can change your choice before starting an enquiry.</p><Button asChild><Link to="/start-your-project" search={{ interest: result[1], context: `Service finder: ${result[2]}` }}>Use this recommendation</Link></Button></>}</aside></div></section></>;
}
