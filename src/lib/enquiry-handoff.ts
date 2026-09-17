/**
 * Deterministic enquiry-context normalization.
 *
 * This module maps incoming route/tool/project identifiers to the canonical
 * need IDs used by /start-your-project. Explicit maps are preferred; fuzzy
 * matching is only a safe fallback for unrecognized labels.
 *
 * No external APIs, no AI, no fabricated data.
 */

export type HandoffNeed =
  | "website"
  | "application"
  | "ai"
  | "compliance"
  | "registration"
  | "consultancy"
  | "growth"
  | "unsure";

export const HANDOFF_NEED_IDS: HandoffNeed[] = [
  "website",
  "application",
  "ai",
  "compliance",
  "registration",
  "consultancy",
  "growth",
  "unsure",
];

/**
 * Maps known service slugs (from src/lib/content.ts) to enquiry need IDs.
 */
export const serviceSlugToNeed: Record<string, HandoffNeed> = {
  "websites-digital-platforms": "website",
  "web-mobile-applications": "application",
  "ai-automation": "ai",
  "business-setup-compliance": "compliance",
  "business-technology-consulting": "consultancy",
};

/**
 * Maps known solution slugs (from src/lib/content.ts) to enquiry need IDs.
 */
export const solutionSlugToNeed: Record<string, HandoffNeed> = {
  "start-a-business": "registration",
  "build-a-website": "website",
  "build-an-application": "application",
  "automate-work": "ai",
  "gst-compliance-help": "compliance",
  "choose-a-direction": "consultancy",
};

/**
 * Maps known work slugs (from src/lib/content.ts) to enquiry need IDs.
 */
export const workSlugToNeed: Record<string, HandoffNeed> = {
  "atlas-stay": "website",
  "form-work": "application",
  "mise-market": "website",
};

/**
 * Maps project-estimator type values to enquiry need IDs.
 */
export const projectTypeToNeed: Record<string, HandoffNeed> = {
  website: "website",
  "web-application": "application",
  "mobile-application": "application",
  ecommerce: "website",
  "custom-platform": "application",
  "not-sure": "unsure",
};

function fuzzyResolveNeed(input: string): HandoffNeed | undefined {
  const lower = input.toLowerCase();

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
    lower.includes("business-start") ||
    lower.includes("start a business")
  )
    return "registration";

  if (
    lower.includes("consult") ||
    lower.includes("transformation") ||
    lower.includes("strategy") ||
    lower.includes("direction")
  )
    return "consultancy";

  if (
    lower.includes("growth") ||
    lower.includes("reach") ||
    lower.includes("conversion")
  )
    return "growth";

  return undefined;
}

/**
 * Resolve an arbitrary incoming identifier to a canonical need ID.
 * Returns undefined if the input cannot be confidently mapped, so callers
 * can fall back to an existing draft value instead of forcing "unsure".
 */
export function resolveHandoffNeed(
  input: string | undefined,
): HandoffNeed | undefined {
  if (!input) return undefined;

  if ((HANDOFF_NEED_IDS as readonly string[]).includes(input)) {
    return input as HandoffNeed;
  }

  const mapped =
    serviceSlugToNeed[input] ??
    solutionSlugToNeed[input] ??
    workSlugToNeed[input] ??
    projectTypeToNeed[input];

  if (mapped) return mapped;

  return fuzzyResolveNeed(input);
}

type SummaryParams = {
  needLabel?: string;
  stageLabel?: string;
  details: string;
  budgetLabel?: string;
  timingLabel?: string;
  name: string;
  email: string;
  reply: string;
  phone?: string;
};

/**
 * Build a clean, human-readable enquiry summary from the values the visitor
 * entered. No internal IDs, no invented estimates, no promises.
 */
export function formatEnquirySummary({
  needLabel,
  stageLabel,
  details,
  budgetLabel,
  timingLabel,
  name,
  email,
  reply,
  phone,
}: SummaryParams): string {
  const lines: string[] = ["GSTPIXEL project enquiry", ""];

  if (needLabel) lines.push(`Need: ${needLabel}`);
  if (stageLabel) lines.push(`Stage: ${stageLabel}`);
  if (details.trim()) lines.push(`Outcome: ${details.trim()}`);

  const planning = [budgetLabel, timingLabel].filter(Boolean).join(" · ");
  if (planning) lines.push(`Planning: ${planning}`);

  lines.push("");
  lines.push(`Name: ${name.trim() || "Not provided"}`);
  lines.push(`Email: ${email.trim() || "Not provided"}`);
  lines.push(`Preferred reply: ${reply}`);
  if (reply !== "Email" && phone?.trim()) lines.push(`Phone: ${phone.trim()}`);

  return lines.join("\n");
}

/**
 * Percent-encode a summary for WhatsApp/email query parameters.
 */
export function encodeContactSummary(summary: string): string {
  return encodeURIComponent(summary);
}
