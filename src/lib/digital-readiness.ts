// Digital readiness assessment — deterministic scoring & recommendation engine.
//
// This module is intentionally pure and browser-safe: no network, no paid
// services, no "AI". Every answer maps to a fixed score, and every
// recommendation is produced by an explicit rule that references the exact
// answer that triggered it. Nothing here fabricates a legal, compliance,
// technical, or security claim.

export type ReadinessOption = {
  value: string;
  label: string;
  /** 0–3 readiness points. Omitted for "not applicable" choices. */
  score?: number;
  /** A neutral, non-punishing "does not apply to us" choice. */
  na?: boolean;
  hint?: string;
};

export type ReadinessQuestion = {
  id: string;
  prompt: string;
  hint?: string;
  options: ReadinessOption[];
};

export type ReadinessCategory = {
  id: string;
  title: string;
  blurb: string;
  questions: ReadinessQuestion[];
};

export type Answers = Record<string, string>;

const opt = (
  value: string,
  label: string,
  score: number,
  hint?: string,
): ReadinessOption =>
  hint ? { value, label, score, hint } : { value, label, score };

export const readinessCategories: ReadinessCategory[] = [
  {
    id: "presence",
    title: "Online presence",
    blurb: "Website, domain, business email, and how easy you are to find.",
    questions: [
      {
        id: "presence.website",
        prompt: "Which best describes your business website today?",
        options: [
          opt("none", "No website yet", 0),
          opt("listing", "A social page or directory listing only", 1),
          opt("basic", "A simple site that is hard to update", 2),
          opt("managed", "A live site we can update ourselves", 3),
        ],
      },
      {
        id: "presence.domain",
        prompt: "What is your domain / web address situation?",
        options: [
          opt("none", "Don't have a domain", 0),
          opt("free", "Using a free subdomain or third-party address", 1),
          opt("owned", "Own a domain but don't use it consistently", 2),
          opt("consistent", "Own a domain and use it everywhere", 3),
        ],
      },
      {
        id: "presence.email",
        prompt: "What email do you use for the business?",
        options: [
          opt("personal", "A personal email (gmail/yahoo, etc.)", 0),
          opt("business-rarely", "A business email, rarely used", 1),
          opt("business-mostly", "A business email for most contact", 2),
          opt("business-all", "A business email, used consistently", 3),
        ],
      },
      {
        id: "presence.discoverability",
        prompt: "Can someone unfamiliar find how to contact you quickly?",
        options: [
          opt("no", "Not really", 0),
          opt("referral", "Only by personal referral", 1),
          opt("some", "Listed in a couple of places", 2),
          opt("easy", "Easy to find across channels", 3),
        ],
      },
    ],
  },
  {
    id: "website",
    title: "Website",
    blurb:
      "Mobile usability, freshness, and a clear contact path — self-assessed.",
    questions: [
      {
        id: "website.mobile",
        prompt: "How does your website behave on a phone?",
        options: [
          opt("none", "No website", 0),
          opt("difficult", "Difficult to use on mobile", 1),
          opt("usable", "Usable but not polished", 2),
          opt("clear", "Clear and easy on mobile", 3),
        ],
      },
      {
        id: "website.currentness",
        prompt: "How current is your website content?",
        options: [
          opt("none", "No website", 0),
          opt("stale", "Out of date", 1),
          opt("mostly", "Mostly current, some stale pages", 2),
          opt("maintained", "Kept up to date", 3),
        ],
      },
      {
        id: "website.contact",
        prompt: "How clear is the path for a visitor to contact you?",
        options: [
          opt("none", "No website", 0),
          opt("hidden", "Contact details are hard to find", 1),
          opt("steps", "Contact exists but takes a couple of steps", 2),
          opt("obvious", "Clear and obvious contact path", 3),
        ],
      },
      {
        id: "website.quality",
        prompt: "Overall, how would you rate your website quality today?",
        options: [
          opt("none", "No website", 0),
          opt("work", "Needs significant work", 1),
          opt("good", "Good enough, some rough edges", 2),
          opt("confident", "Confident in it", 3),
        ],
      },
    ],
  },
  {
    id: "local",
    title: "Google & local discoverability",
    blurb: "Local listings and how consistent your contact information is.",
    questions: [
      {
        id: "local.profile",
        prompt: "Your Google Business Profile (or equivalent local listing):",
        options: [
          opt("unset", "Not set up / not sure", 0),
          opt("incomplete", "Created but incomplete", 1),
          opt("complete", "Complete but rarely updated", 2),
          opt("managed", "Complete and maintained", 3),
        ],
      },
      {
        id: "local.mapinfo",
        prompt: "Your name, address & phone on maps and directories:",
        options: [
          opt("inconsistent", "Inconsistent or not sure", 0),
          opt("partial", "Correct in one main place", 1),
          opt("mostly", "Consistent across main listings", 2),
          opt("verified", "Consistent and verified everywhere", 3),
        ],
      },
    ],
  },
  {
    id: "social",
    title: "Social presence",
    blurb: "Where you post, how often, and whether profiles are complete.",
    questions: [
      {
        id: "social.profiles",
        prompt: "How active are your social profiles?",
        options: [
          opt("none", "None", 0),
          opt("one", "One, with occasional posting", 1),
          opt("few", "A few, reasonably active", 2),
          opt("targeted", "Active where our customers are", 3),
        ],
      },
      {
        id: "social.cadence",
        prompt: "How regular is your posting?",
        options: [
          opt("rarely", "Rarely or never", 0),
          opt("sporadic", "Sporadic", 1),
          opt("regular", "Fairly regular", 2),
          opt("scheduled", "A consistent schedule", 3),
        ],
      },
      {
        id: "social.completeness",
        prompt: "Are your profiles complete (bio, links, contact)?",
        options: [
          opt("bare", "Barely set up", 0),
          opt("partial", "Partially complete", 1),
          opt("mostly", "Mostly complete", 2),
          opt("onbrand", "Complete and on-brand", 3),
        ],
      },
    ],
  },
  {
    id: "content",
    title: "Content & brand assets",
    blurb: "Logo, service descriptions, and media that explain what you do.",
    questions: [
      {
        id: "content.brand",
        prompt: "Your logo and brand assets:",
        options: [
          opt("none", "None", 0),
          opt("logo", "A basic logo only", 1),
          opt("some", "Logo plus some assets", 2),
          opt("full", "A full set, easy to reuse", 3),
        ],
      },
      {
        id: "content.services",
        prompt: "Clear written descriptions of what you offer:",
        options: [
          opt("none", "None", 0),
          opt("rough", "Rough or outdated", 1),
          opt("partial", "Clear but not everywhere", 2),
          opt("clear", "Clear and consistent", 3),
        ],
      },
      {
        id: "content.media",
        prompt: "Photography or video of your work or product:",
        options: [
          opt("none", "None", 0),
          opt("little", "A little, low quality", 1),
          opt("decent", "Decent but not organized", 2),
          opt("good", "Good, organized and on-brand", 3),
        ],
      },
    ],
  },
  {
    id: "leads",
    title: "Leads & customer contact",
    blurb: "Enquiry channels, tracking, and how reliably you follow up.",
    questions: [
      {
        id: "leads.forms",
        prompt: "Your contact forms or enquiry channels:",
        options: [
          opt("none", "None", 0),
          opt("email-only", "Email only", 1),
          opt("form", "A form or two", 2),
          opt("multiple", "Multiple clear channels", 3),
        ],
      },
      {
        id: "leads.whatsapp",
        prompt: "WhatsApp (or chat) for enquiries:",
        options: [
          opt("unused", "Not using it", 0),
          opt("personal", "Personal number only", 1),
          opt("adhoc", "Business number, used ad hoc", 2),
          opt("integrated", "Business line, integrated", 3),
        ],
      },
      {
        id: "leads.tracking",
        prompt: "How do you track who has enquired?",
        options: [
          opt("none", "Not tracked / from memory", 0),
          opt("notes", "Notebook or loose notes", 1),
          opt("spreadsheet", "A spreadsheet or manual list", 2),
          opt("system", "A system we can rely on", 3),
        ],
      },
      {
        id: "leads.followup",
        prompt: "How consistent is your follow-up with enquiries?",
        options: [
          opt("none", "No real process", 0),
          opt("adhoc", "Ad hoc, when we remember", 1),
          opt("mostly", "Mostly consistent", 2),
          opt("defined", "Defined and reliable", 3),
        ],
      },
    ],
  },
  {
    id: "commerce",
    title: "Booking & commerce",
    blurb: "Online booking, sales, payment, and order handling.",
    questions: [
      {
        id: "commerce.booking",
        prompt: "Can customers book or reserve with you online?",
        options: [
          { value: "na", label: "Not applicable to our business", na: true },
          opt("manual", "No, manual or in-person only", 0),
          opt("partial", "Partial (email or phone)", 1),
          opt("online", "Online booking available", 2),
          opt("integrated", "Online booking, integrated and used", 3),
        ],
      },
      {
        id: "commerce.sales",
        prompt: "Can customers buy products online?",
        options: [
          { value: "na", label: "Not applicable to our business", na: true },
          opt("no", "No", 0),
          opt("listings", "Listings but manual ordering", 1),
          opt("orders", "Online orders, manual fulfilment", 2),
          opt("purchase", "Full online purchase", 3),
        ],
      },
      {
        id: "commerce.payments",
        prompt: "Online payment:",
        options: [
          { value: "na", label: "Not applicable to our business", na: true },
          opt("cash", "Cash or in person only", 0),
          opt("transfer", "Bank transfer on request", 1),
          opt("basic", "Basic online payment", 2),
          opt("integrated", "Integrated online payment", 3),
        ],
      },
      {
        id: "commerce.workflow",
        prompt: "How is an order or request processed today?",
        options: [
          opt("manual", "Manual, no real system", 0),
          opt("some", "Some manual steps", 1),
          opt("defined", "Mostly defined", 2),
          opt("clear", "A clear workflow", 3),
        ],
      },
    ],
  },
  {
    id: "seo",
    title: "SEO basics",
    blurb: "Page titles/descriptions, findability, and consistent information.",
    questions: [
      {
        id: "seo.basics",
        prompt: "Do your pages have clear titles and descriptions?",
        options: [
          opt("nowebsite", "No website", 0),
          opt("unset", "Not really set up", 1),
          opt("key", "Set on key pages", 2),
          opt("reviewed", "Set and reviewed regularly", 3),
        ],
      },
      {
        id: "seo.visibility",
        prompt: "When you search for your own business, what happens?",
        options: [
          opt("cant", "Can't find it", 0),
          opt("hard", "Hard to find", 1),
          opt("findable", "Usually findable", 2),
          opt("accurate", "Easy to find and accurate", 3),
        ],
      },
      {
        id: "seo.consistency",
        prompt: "Business info (name, address, phone) across the web:",
        options: [
          opt("inconsistent", "Inconsistent or not sure", 0),
          opt("one", "Correct in one main place", 1),
          opt("main", "Consistent in the main places", 2),
          opt("verified", "Consistent and verified", 3),
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    blurb: "Measuring traffic and where your enquiries come from.",
    questions: [
      {
        id: "analytics.traffic",
        prompt: "Do you measure website or listing traffic?",
        options: [
          opt("no", "No", 0),
          opt("occasional", "Occasionally check", 1),
          opt("basic", "Basic analytics installed", 2),
          opt("regular", "Track and review regularly", 3),
        ],
      },
      {
        id: "analytics.conversion",
        prompt: "Can you tell which enquiries or leads came from where?",
        options: [
          opt("no", "No", 0),
          opt("guess", "We guess or ask customers", 1),
          opt("partly", "Partly tracked", 2),
          opt("tracked", "Tracked consistently", 3),
        ],
      },
    ],
  },
  {
    id: "operations",
    title: "Business process digitization",
    blurb: "How much routine work is manual, paper, or spreadsheet-based.",
    questions: [
      {
        id: "operations.manual",
        prompt: "How much routine work happens in spreadsheets or on paper?",
        options: [
          opt("everything", "Almost everything", 0),
          opt("lot", "A lot", 1),
          opt("mixed", "Some, mixed with tools", 2),
          opt("minimal", "Minimal, mostly tools", 3),
        ],
      },
      {
        id: "operations.records",
        prompt: "Are your important records digital and searchable?",
        options: [
          opt("paper", "Mostly paper", 0),
          opt("scattered", "Scattered files", 1),
          opt("digital", "Mostly digital, some gaps", 2),
          opt("organized", "Digital and organized", 3),
        ],
      },
      {
        id: "operations.tools",
        prompt: "Do you use workflow or task tools for recurring work?",
        options: [
          opt("none", "No", 0),
          opt("basic", "Basic (chat or email)", 1),
          opt("few", "A few tools", 2),
          opt("toolset", "A clear toolset", 3),
        ],
      },
      {
        id: "operations.admin",
        prompt: "Repeated admin tasks (invoices, reminders, updates):",
        options: [
          opt("manual", "All manual, error-prone", 0),
          opt("mostly", "Mostly manual", 1),
          opt("partly", "Partly streamlined", 2),
          opt("streamlined", "Largely streamlined", 3),
        ],
      },
    ],
  },
  {
    id: "automation",
    title: "Automation readiness",
    blurb: "Whether processes and data are clear enough to automate.",
    questions: [
      {
        id: "automation.processes",
        prompt: "How well-defined are your repeatable processes?",
        options: [
          opt("undefined", "Undefined, in people's heads", 0),
          opt("loose", "Loosely defined", 1),
          opt("documented", "Documented for main tasks", 2),
          opt("consistent", "Documented and consistent", 3),
        ],
      },
      {
        id: "automation.data",
        prompt:
          "Is your business data structured (lists and fields, not free text)?",
        options: [
          opt("notes", "Mostly free text or notes", 0),
          opt("mixed", "Mixed", 1),
          opt("structured", "Mostly structured", 2),
          opt("clean", "Structured and clean", 3),
        ],
      },
      {
        id: "automation.identify",
        prompt: "Can you name the tasks you would most want automated?",
        options: [
          opt("unsure", "Not sure", 0),
          opt("vague", "A few vague ideas", 1),
          opt("candidates", "Some clear candidates", 2),
          opt("prioritized", "A clear, prioritised list", 3),
        ],
      },
    ],
  },
  {
    id: "documents",
    title: "Document organization",
    blurb: "Where documents live and how reliably you can find them.",
    questions: [
      {
        id: "documents.storage",
        prompt: "Where do important documents live?",
        options: [
          opt("scattered", "Scattered or paper", 0),
          opt("local", "Local folders on a device", 1),
          opt("cloud", "Cloud but not organized", 2),
          opt("backed", "Cloud, organized and backed up", 3),
        ],
      },
      {
        id: "documents.naming",
        prompt: "Can you find a document when you need it?",
        options: [
          opt("cant", "Often can't", 0),
          opt("struggle", "Sometimes struggle", 1),
          opt("usually", "Usually find it", 2),
          opt("reliable", "Quick and reliable", 3),
        ],
      },
      {
        id: "documents.customerinfo",
        prompt: "Customer and project information organization:",
        options: [
          opt("unorganized", "Not organized", 0),
          opt("fragmented", "Fragmented across places", 1),
          opt("central", "Mostly in one place", 2),
          opt("accessible", "Well organized and accessible", 3),
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security hygiene",
    blurb: "Basic, everyday safeguards — not a security audit.",
    questions: [
      {
        id: "security.backups",
        prompt: "Backups of important business files:",
        options: [
          opt("none", "No backups", 0),
          opt("occasional", "Occasional manual copies", 1),
          opt("regular", "Regular backups", 2),
          opt("automatic", "Automatic, tested backups", 3),
        ],
      },
      {
        id: "security.passwords",
        prompt: "Your password practices:",
        options: [
          opt("reuse", "I reuse a few simple passwords", 0),
          opt("variation", "Some variation between accounts", 1),
          opt("unique", "Unique for key accounts", 2),
          opt("manager", "A password manager / unique everywhere", 3),
        ],
      },
      {
        id: "security.access",
        prompt: "Who has access to business accounts?",
        options: [
          opt("unclear", "Unclear or shared loosely", 0),
          opt("known", "Known but not reviewed", 1),
          opt("reviewed", "Reviewed occasionally", 2),
          opt("controlled", "Controlled and reviewed", 3),
        ],
      },
      {
        id: "security.updates",
        prompt: "Software and device updates:",
        options: [
          opt("ignored", "Ignored", 0),
          opt("reminded", "Applied when reminded", 1),
          opt("current", "Mostly current", 2),
          opt("kept", "Kept current", 3),
        ],
      },
    ],
  },
];

const questionById = new Map<string, ReadinessQuestion>();
const categoryByQuestion = new Map<string, string>();
for (const category of readinessCategories) {
  for (const question of category.questions) {
    questionById.set(question.id, question);
    categoryByQuestion.set(question.id, category.id);
  }
}

export const totalQuestionCount = readinessCategories.reduce(
  (sum, c) => sum + c.questions.length,
  0,
);

export type CategoryResult = {
  id: string;
  title: string;
  blurb: string;
  answered: number;
  total: number;
  percent: number | null;
};

export type Action = {
  categoryId: string;
  categoryTitle: string;
  title: string;
  detail: string;
  horizon: "short" | "medium";
};

export type ReadinessResult = {
  answeredCount: number;
  totalCount: number;
  overallPercent: number | null;
  label: string | null;
  categories: CategoryResult[];
  strengths: CategoryResult[];
  gaps: CategoryResult[];
  shortActions: Action[];
  mediumActions: Action[];
};

function readinessLabel(percent: number): string {
  if (percent < 35) return "Foundation";
  if (percent < 55) return "Developing";
  if (percent < 75) return "Established";
  return "Advanced";
}

const categoryTitles: Record<string, string> = Object.fromEntries(
  readinessCategories.map((c) => [c.id, c.title]),
);

export function scoreReadiness(answers: Answers): ReadinessResult {
  const categories: CategoryResult[] = readinessCategories.map((category) => {
    let sum = 0;
    let max = 0;
    let answered = 0;
    for (const question of category.questions) {
      const value = answers[question.id];
      if (!value) continue;
      const option = question.options.find((o) => o.value === value);
      const questionMax = question.options.reduce(
        (m, o) => Math.max(m, o.score ?? 0),
        0,
      );
      if (!option || option.na) continue;
      answered += 1;
      sum += option.score ?? 0;
      max += questionMax;
    }
    const percent = max > 0 ? Math.round((sum / max) * 100) : null;
    return {
      id: category.id,
      title: category.title,
      blurb: category.blurb,
      answered,
      total: category.questions.length,
      percent,
    };
  });

  const scored = categories.filter(
    (c): c is CategoryResult & { percent: number } => c.percent !== null,
  );
  const overallPercent = scored.length
    ? Math.round(scored.reduce((sum, c) => sum + c.percent, 0) / scored.length)
    : null;

  const answeredCount = categories.reduce((sum, c) => sum + c.answered, 0);

  const strengths = scored
    .filter((c) => c.percent >= 70)
    .sort((a, b) => b.percent - a.percent);
  const gaps = scored
    .filter((c) => c.percent < 40)
    .sort((a, b) => a.percent - b.percent);

  const actions = recommend(answers, categories);

  return {
    answeredCount,
    totalCount: totalQuestionCount,
    overallPercent,
    label: overallPercent === null ? null : readinessLabel(overallPercent),
    categories,
    strengths,
    gaps,
    shortActions: actions.filter((a) => a.horizon === "short"),
    mediumActions: actions.filter((a) => a.horizon === "medium"),
  };
}

type Rule = {
  test: (answers: Answers) => boolean;
  categoryId: string;
  title: string;
  detail: string;
  horizon: "short" | "medium";
};

const is = (answers: Answers, id: string, ...values: string[]): boolean =>
  values.includes(answers[id] ?? "");

const rules: Rule[] = [
  {
    test: (a) => is(a, "presence.website", "none"),
    categoryId: "presence",
    title: "Establish a website foundation",
    detail:
      "Start with a simple, credible site that states what you do and how to reach you.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "presence.domain", "none", "free"),
    categoryId: "presence",
    title: "Secure a domain and business email",
    detail:
      "A domain you own, plus a business email, makes you easier to find and trust.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "presence.email", "personal"),
    categoryId: "presence",
    title: "Move to a business email",
    detail: "A business email address reads more professionally for enquiries.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "website.mobile", "difficult", "none"),
    categoryId: "website",
    title: "Improve mobile usability",
    detail:
      "Most visitors are on phones. Make sure the site is easy to read and act on from a phone.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "website.contact", "hidden", "none"),
    categoryId: "website",
    title: "Make the contact path obvious",
    detail:
      "Put a clear contact action where visitors expect it, from every key page.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "local.profile", "unset", "incomplete"),
    categoryId: "local",
    title: "Set up your local listing",
    detail:
      "A complete, accurate local listing helps people find and verify you.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "leads.forms", "none", "email-only"),
    categoryId: "leads",
    title: "Add clear enquiry channels",
    detail:
      "Offer a simple form and/or WhatsApp so enquiries don't depend on a single inbox.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "leads.tracking", "none", "notes"),
    categoryId: "leads",
    title: "Track enquiries reliably",
    detail:
      "Log every enquiry in one place so nothing slips through follow-up.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "leads.followup", "none", "adhoc"),
    categoryId: "leads",
    title: "Define a follow-up process",
    detail:
      "Agree who responds and when, so every enquiry is answered predictably.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "security.backups", "none"),
    categoryId: "security",
    title: "Start regular backups",
    detail:
      "Keep a copy of important files somewhere separate from your everyday device.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "security.passwords", "reuse"),
    categoryId: "security",
    title: "Move away from reused passwords",
    detail:
      "Use unique passwords (a password manager helps) for the accounts that matter.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "analytics.traffic", "no"),
    categoryId: "analytics",
    title: "Add basic analytics",
    detail:
      "Install a simple, privacy-conscious analytics tool to see if anyone visits.",
    horizon: "short",
  },
  {
    test: (a) => is(a, "analytics.conversion", "no", "guess"),
    categoryId: "analytics",
    title: "Track where leads come from",
    detail:
      "Record the source of each enquiry so you can see what actually works.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "content.brand", "none"),
    categoryId: "content",
    title: "Create core brand assets",
    detail:
      "A simple logo and a consistent look make every page feel intentional.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "content.media", "none", "little"),
    categoryId: "content",
    title: "Build a small media library",
    detail:
      "A few good photos or videos of your work go a long way toward trust.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "operations.manual", "everything", "lot"),
    categoryId: "operations",
    title: "Digitize the most repeated manual work",
    detail:
      "Pick one frequent manual task and move it into a simple, reliable digital flow.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "automation.processes", "undefined", "loose"),
    categoryId: "automation",
    title: "Document processes before automating",
    detail:
      "Write down the steps of a repeatable process so automation is possible later.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "documents.storage", "scattered", "local"),
    categoryId: "documents",
    title: "Centralize document storage",
    detail: "Move important files into one organized, backed-up location.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "seo.basics", "unset", "nowebsite"),
    categoryId: "seo",
    title: "Set basics titles and descriptions",
    detail:
      "Give each key page a clear title and description to help search and people.",
    horizon: "medium",
  },
  {
    test: (a) => is(a, "social.profiles", "none", "one"),
    categoryId: "social",
    title: "Build a focused social presence",
    detail:
      "Choose one or two places your customers already are, and post consistently.",
    horizon: "medium",
  },
  {
    test: (a) =>
      is(a, "commerce.payments", "cash", "transfer") ||
      (is(a, "commerce.sales", "no", "listings") &&
        !is(a, "commerce.sales", "")),
    categoryId: "commerce",
    title: "Investigate a suitable payment option",
    detail:
      "If taking payment online matters to you, research payment options that fit your situation.",
    horizon: "medium",
  },
];

function recommend(answers: Answers, categories: CategoryResult[]): Action[] {
  const percentById = new Map(categories.map((c) => [c.id, c.percent]));
  return rules
    .filter((rule) => rule.test(answers))
    .map((rule) => {
      const percent = percentById.get(rule.categoryId);
      return {
        categoryId: rule.categoryId,
        categoryTitle: categoryTitles[rule.categoryId] ?? rule.categoryId,
        title: rule.title,
        detail: rule.detail,
        horizon: rule.horizon,
        gap: percent === null || percent === undefined ? 0 : percent,
      } as Action & { gap: number };
    })
    .sort((a, b) => a.gap - b.gap);
}

export function buildReadinessSummary(result: ReadinessResult): string {
  const lines = [
    "Digital readiness assessment",
    `Overall readiness: ${result.overallPercent ?? "—"}%${
      result.label ? ` (${result.label})` : ""
    }`,
    `Based on ${result.answeredCount} of ${result.totalCount} questions answered`,
    "",
    "Category breakdown:",
    ...result.categories
      .filter((c) => c.percent !== null)
      .map((c) => `- ${c.title}: ${c.percent}%`),
  ];

  if (result.strengths.length) {
    lines.push(
      "",
      "Strengths:",
      ...result.strengths.map((s) => `- ${s.title}`),
    );
  }
  if (result.gaps.length) {
    lines.push("", "Priority gaps:", ...result.gaps.map((g) => `- ${g.title}`));
  }
  if (result.shortActions.length) {
    lines.push(
      "",
      "Suggested next steps:",
      ...result.shortActions.map(
        (a, i) => `${i + 1}. ${a.title} — ${a.detail}`,
      ),
    );
  }

  lines.push(
    "",
    "This is a self-assessment signal, not an audit or certification.",
  );
  return lines.join("\n");
}

/** Structured handoff fields for AGENT4's enquiry envelope (no rewriting). */
export function buildHandoffFields(
  result: ReadinessResult,
): Record<string, string | number | boolean> {
  const topGap = result.gaps[0]?.title;
  const topStrength = result.strengths[0]?.title;
  return {
    Tool: "Digital readiness assessment",
    "Overall readiness": result.overallPercent ?? "—",
    Label: result.label ?? "—",
    "Top gap": topGap ?? "None recorded",
    "Top strength": topStrength ?? "None recorded",
    "Top next step": result.shortActions[0]?.title ?? "Discuss next steps",
  };
}
