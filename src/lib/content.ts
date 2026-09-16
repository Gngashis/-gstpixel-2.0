export type Service = {
  slug: string;
  title: string;
  family: string;
  summary: string;
  helps: string[];
  whoFor: string;
  needs: string[];
  process: string[];
  /** Tool slugs that pair naturally with this service (service → tool → project). */
  relatedTools: string[];
  /** Solution slugs this service is a path towards. */
  relatedSolutions: string[];
};
export type Solution = {
  slug: string;
  title: string;
  summary: string;
  services: string[];
  /** Tool slugs that help someone act on this path (solution → tool → enquiry). */
  relatedTools: string[];
};

export const toolCatalog = [
  {
    slug: "project-estimator",
    title: "Project estimator",
    blurb: "Frame scope and complexity before any numbers are discussed.",
  },
  {
    slug: "service-finder",
    title: "Service finder",
    blurb: "Answer a few questions and see which capability fits.",
  },
  {
    slug: "gst-calculator",
    title: "GST calculator",
    blurb: "Check inclusive or exclusive GST at a rate you provide.",
  },
  {
    slug: "business-checklist",
    title: "Business checklist",
    blurb: "Organize preparation steps before any registration process.",
  },
] as const;

const toolBySlug = Object.fromEntries(toolCatalog.map((t) => [t.slug, t]));
export const getTool = (slug: string) => toolBySlug[slug];

/** Verified business details. Nothing here is invented; do not add unverified claims. */
export const businessFacts = {
  name: "GSTPIXEL",
  tagline: "Start Right. Stay Compliant. Grow Online.",
  founder: "Ashis Gurung",
  founderTitle: "Founder & Business Consultant",
  address: "Ramgaon, Near Anthony School, Jaigaon – 736182, West Bengal, India",
  gstin: "19ESPPG2569P1ZP",
  phone: { label: "+91 90465 20548", href: "tel:+919046520548" },
  phoneAlt: { label: "+91 81160 76725", href: "tel:+918116076725" },
  phoneBhutan: { label: "+975 77260538", href: "tel:+97577260538" },
  whatsapp: { label: "WhatsApp", href: "https://wa.me/919046520548" },
  email: { label: "support@gstpixel.com", href: "mailto:support@gstpixel.com" },
} as const;

export const services: Service[] = [
  {
    slug: "websites-digital-platforms",
    title: "Websites & digital platforms",
    family: "Digital Development",
    summary:
      "Purposeful public websites, ecommerce experiences, and digital platforms built around real business goals.",
    helps: [
      "Website design and development",
      "Ecommerce and digital platforms",
      "Digital business systems",
    ],
    whoFor:
      "Businesses that need a credible, maintainable online presence — from a first business website to an ecommerce or content-led platform.",
    needs: [
      "An outdated or absent web presence",
      "A site that is hard to update or expand",
      "Ecommerce and product information that customers can trust",
      "Performance, accessibility, and mobile behavior that need attention",
    ],
    process: [
      "Clarify the audience, goals, and content you already have",
      "Define structure and design direction before building",
      "Build, review, and refine responsively across devices",
      "Hand over with clear guidance for keeping it current",
    ],
    relatedTools: ["project-estimator"],
    relatedSolutions: ["build-a-website"],
  },
  {
    slug: "web-mobile-applications",
    title: "Web & mobile applications",
    family: "Digital Development",
    summary:
      "Usable, maintainable applications for customers, teams, and new digital products.",
    helps: [
      "Web applications",
      "Mobile applications",
      "Product interface systems",
    ],
    whoFor:
      "Teams and founders who need a working product — a customer-facing app, an internal tool, or the first version of a new digital product.",
    needs: [
      "Spreadsheets or manual steps that no longer scale",
      "A product idea that needs a usable first version",
      "Disconnected systems that should share one workflow",
      "Interfaces that customers or staff find confusing",
    ],
    process: [
      "Map the users and the essential workflow end to end",
      "Define the smallest useful version before optional features",
      "Design and build in reviewable stages",
      "Plan how the application will be maintained and extended",
    ],
    relatedTools: ["project-estimator"],
    relatedSolutions: ["build-an-application"],
  },
  {
    slug: "ai-automation",
    title: "AI & automation",
    family: "AI and Automation",
    summary:
      "Clear workflows that connect inputs, decisions, and useful outputs without hiding the logic.",
    helps: [
      "AI integrations",
      "Workflow automation",
      "Process digitization",
      "Custom automation",
    ],
    whoFor:
      "Businesses losing time to repetitive work — data entry, document handling, follow-ups, or reporting — who want automation they can actually understand and trust.",
    needs: [
      "Manual copy-paste work between systems",
      "Slow, error-prone document or data handling",
      "Follow-ups and internal handoffs that get missed",
      "Interest in AI where it genuinely fits, not as a gimmick",
    ],
    process: [
      "Identify the tasks worth automating and measure the current effort",
      "Design the workflow visibly, including its limits and failure paths",
      "Integrate appropriate AI or automation where it earns its place",
      "Review results with people still able to inspect and override",
    ],
    relatedTools: ["project-estimator"],
    relatedSolutions: ["automate-work"],
  },
  {
    slug: "business-setup-compliance",
    title: "Business setup & compliance",
    family: "Business Services",
    summary:
      "Structured support for starting and operating a business with clarity around requirements and next steps.",
    helps: [
      "GST-related services",
      "FSSAI-related services",
      "Business registration",
      "Compliance support",
      "Business setup assistance",
    ],
    whoFor:
      "New and operating businesses that need practical help with registrations, GST- and FSSAI-related assistance, and staying organized around their obligations.",
    needs: [
      "A new business that needs the right registrations in the right order",
      "GST- or FSSAI-related assistance and ongoing support",
      "Records and filings that have fallen behind",
      "Uncertainty about what applies and what to do next",
    ],
    process: [
      "Understand the business activity and current status",
      "Identify the registrations and support that may be relevant",
      "Prepare and organize information for official processes",
      "Flag anything that requires verification with the relevant authorities",
    ],
    relatedTools: ["business-checklist", "gst-calculator"],
    relatedSolutions: ["start-a-business", "gst-compliance-help"],
  },
  {
    slug: "business-technology-consulting",
    title: "Business & technology consulting",
    family: "Consulting",
    summary:
      "Practical guidance connecting business decisions, digital transformation, technology strategy, and growth.",
    helps: [
      "Business consultancy",
      "Digital transformation",
      "Technology strategy",
      "Business-growth support",
    ],
    whoFor:
      "Owners and teams at a decision point — choosing a direction, planning a digital move, or deciding which investment actually comes next.",
    needs: [
      "Too many options and no clear priority",
      "A digital plan disconnected from business reality",
      "Technology choices that need an independent, practical view",
      "Growth plans that need concrete next steps",
    ],
    process: [
      "Understand the business, constraints, and real objective",
      "Map options with honest trade-offs and costs",
      "Recommend a sequence, not just a wish list",
      "Stay involved through execution where useful",
    ],
    relatedTools: ["service-finder", "project-estimator"],
    relatedSolutions: ["choose-a-direction", "start-a-business"],
  },
];

export const solutions: Solution[] = [
  {
    slug: "start-a-business",
    title: "Start a business",
    summary:
      "Map the essential registration, operating, and digital foundations before adding optional complexity.",
    services: [
      "Business setup & compliance",
      "Business & technology consulting",
    ],
    relatedTools: ["business-checklist"],
  },
  {
    slug: "build-a-website",
    title: "Create a website",
    summary:
      "Turn a business objective into a credible, accessible, and maintainable digital presence.",
    services: [
      "Websites & digital platforms",
      "Business & technology consulting",
    ],
    relatedTools: ["project-estimator"],
  },
  {
    slug: "build-an-application",
    title: "Build an application",
    summary:
      "Define the users, workflows, and technical scope for a web or mobile product.",
    services: ["Web & mobile applications", "AI & automation"],
    relatedTools: ["project-estimator"],
  },
  {
    slug: "automate-work",
    title: "Automate work",
    summary:
      "Identify repetitive work and connect the right processes before introducing automation.",
    services: ["AI & automation", "Business & technology consulting"],
    relatedTools: ["project-estimator"],
  },
  {
    slug: "gst-compliance-help",
    title: "Get GST or compliance help",
    summary:
      "Find the relevant support path without assuming one set of requirements fits every business.",
    services: ["Business setup & compliance"],
    relatedTools: ["gst-calculator", "business-checklist"],
  },
  {
    slug: "choose-a-direction",
    title: "Decide what to do next",
    summary:
      "Start with the outcome and receive a transparent, editable recommendation.",
    services: ["Business & technology consulting"],
    relatedTools: ["service-finder"],
  },
];

const solutionBySlug = Object.fromEntries(solutions.map((x) => [x.slug, x]));
export const getSolution = (slug: string) => solutionBySlug[slug];

export const conceptProjects = [
  {
    slug: "atlas-stay",
    title: "Atlas Stay",
    industry: "Luxury travel",
    summary:
      "A booking-led hospitality interface exploring calm discovery and clear decision states.",
  },
  {
    slug: "form-work",
    title: "Form / Work",
    industry: "Professional services",
    summary:
      "A modular client-intake system connecting advisory work with structured delivery.",
  },
  {
    slug: "mise-market",
    title: "Mise Market",
    industry: "Ecommerce",
    summary:
      "A product-led food marketplace concept focused on provenance, speed, and repeat purchase.",
  },
];
