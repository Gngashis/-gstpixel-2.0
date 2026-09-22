import type { SectionType } from "./domain";
import type { DesignDNA } from "./design-dna";

/**
 * SiteBlueprint — the page layer.
 *
 * A business concept is not one page. This module owns the page vocabulary and
 * the per-business page plan: which pages a business actually needs, what each
 * page is for, its CTA strategy and the section sequence it runs.
 *
 * Everything here is data. A page plan references only allowlisted section
 * types and section variants, so the deterministic renderer stays the safety
 * boundary and the visitor can never introduce executable content.
 *
 * The module imports no blueprint code (so the blueprint can depend on it) and
 * reads the DesignDNA only as a structural input when choosing how a page's
 * sections should be composed.
 */

export const pageKinds = [
  "shop",
  "collections",
  "category",
  "product-info",
  "services",
  "projects",
  "capabilities",
  "treatments",
  "programmes",
  "courses",
  "destinations",
  "packages",
  "experiences",
  "menu",
  "story",
  "about",
  "team",
  "gallery",
  "lookbook",
  "process",
  "impact",
  "inventory",
  "results",
  "pricing",
  "booking",
  "appointment",
  "reservation",
  "consultation",
  "enquiry",
  "contact",
  "faq",
] as const;

export type SitePageKind = (typeof pageKinds)[number];

export const sitePagePurposes = [
  "orient",
  "sell",
  "explain",
  "prove",
  "establish",
  "invite",
  "convert",
] as const;

export type SitePagePurpose = (typeof sitePagePurposes)[number];

export const pageSectionPurposes = [
  "introduce",
  "establish",
  "showcase",
  "explain",
  "prove",
  "convert",
  "inform",
  "invite",
  "orient",
] as const;

export type PageSectionPurpose = (typeof pageSectionPurposes)[number];

/** `[sectionType, purpose, candidateVariants]` — the smallest useful unit. */
type SectionStep = readonly [
  SectionType,
  PageSectionPurpose,
  readonly string[],
];

export type PageArchetype = {
  kind: SitePageKind;
  slug: string;
  /** Editing label, e.g. "Treatments". */
  title: string;
  /** Short label for the site navigation. */
  navLabel: string;
  /** One-line reason the page exists, in customer language. */
  role: string;
  purpose: SitePagePurpose;
  /** The page's own conversion strategy. */
  cta: { primary: string; secondary: string } | null;
  sections: readonly SectionStep[];
};

/**
 * Page archetypes.
 *
 * Each one is a real page shape for a real business: a shop, a treatment
 * index, a project portfolio, a booking journey. Secondary pages stay short
 * (three to four sections) because a concept site has to read as believable,
 * not padded.
 */
const archetypes: Record<SitePageKind, PageArchetype> = {
  shop: {
    kind: "shop",
    slug: "/shop",
    title: "Shop",
    navLabel: "Shop",
    role: "Browse and filter the full range.",
    purpose: "sell",
    cta: { primary: "Browse the range", secondary: "Ask about stock" },
    sections: [
      ["listings", "orient", ["collection-rail", "index-list", "product-grid"]],
      [
        "listings",
        "showcase",
        ["product-grid", "image-showcase", "premium-listing"],
      ],
      ["features", "prove", ["trust-band", "stats-band", "icon-list"]],
      ["cta", "convert", ["conversion-band", "minimal", "split"]],
    ],
  },
  collections: {
    kind: "collections",
    slug: "/collections",
    title: "Collections",
    navLabel: "Collections",
    role: "Group the range into a few clear stories.",
    purpose: "orient",
    cta: { primary: "See the collection", secondary: "Get advice" },
    sections: [
      [
        "listings",
        "orient",
        ["collection-rail", "room-collection", "package-cards"],
      ],
      [
        "gallery",
        "showcase",
        ["bento-mosaic", "editorial-grid", "art-collage"],
      ],
      [
        "about",
        "establish",
        ["minimal-intro", "editorial-narrative", "split-media-story"],
      ],
    ],
  },
  category: {
    kind: "category",
    slug: "/category",
    title: "Browse by category",
    navLabel: "Categories",
    role: "Let visitors jump straight to what they came for.",
    purpose: "orient",
    cta: { primary: "Open a category", secondary: "Ask what suits me" },
    sections: [
      ["listings", "orient", ["index-list", "product-grid", "collection-rail"]],
      ["features", "inform", ["faq-list", "bento-grid", "icon-list"]],
      ["cta", "convert", ["conversion-band", "minimal", "booking-band"]],
    ],
  },
  "product-info": {
    kind: "product-info",
    slug: "/product-information",
    title: "Product information",
    navLabel: "Product guide",
    role: "Answer the questions people ask before they buy.",
    purpose: "explain",
    cta: { primary: "Ask about this product", secondary: "Compare options" },
    sections: [
      [
        "listings",
        "showcase",
        ["featured-item", "image-showcase", "premium-listing"],
      ],
      [
        "features",
        "inform",
        ["comparison-table", "faq-list", "structured-editorial"],
      ],
      [
        "testimonials",
        "prove",
        ["editorial-quotes", "minimal-quote", "statement-quote"],
      ],
      ["cta", "convert", ["contact-focused", "minimal", "conversion-band"]],
    ],
  },
  services: {
    kind: "services",
    slug: "/services",
    title: "Services",
    navLabel: "Services",
    role: "Explain each service clearly and show how it works.",
    purpose: "explain",
    cta: { primary: "Request a quote", secondary: "See how we work" },
    sections: [
      [
        "services",
        "explain",
        ["capability-columns", "editorial-list", "visual-grid"],
      ],
      [
        "features",
        "explain",
        ["process-timeline", "numbered-features", "bento-grid"],
      ],
      ["cta", "convert", ["split", "minimal", "conversion-band"]],
    ],
  },
  projects: {
    kind: "projects",
    slug: "/projects",
    title: "Projects",
    navLabel: "Projects",
    role: "Show completed work as proof, not decoration.",
    purpose: "prove",
    cta: { primary: "Discuss a project", secondary: "See services" },
    sections: [
      [
        "gallery",
        "showcase",
        ["bento-mosaic", "art-collage", "editorial-grid"],
      ],
      [
        "listings",
        "showcase",
        ["premium-listing", "package-cards", "index-list"],
      ],
      ["features", "prove", ["stats-band", "trust-band", "capability-grid"]],
    ],
  },
  capabilities: {
    kind: "capabilities",
    slug: "/capabilities",
    title: "Capabilities",
    navLabel: "Capabilities",
    role: "Prove depth: what the business can actually deliver.",
    purpose: "prove",
    cta: { primary: "Talk through requirements", secondary: "See projects" },
    sections: [
      [
        "features",
        "explain",
        ["capability-grid", "comparison-table", "structured-editorial"],
      ],
      [
        "services",
        "explain",
        ["process-steps", "capability-columns", "split-offerings"],
      ],
      ["cta", "convert", ["contact-focused", "split", "minimal"]],
    ],
  },
  treatments: {
    kind: "treatments",
    slug: "/treatments",
    title: "Treatments",
    navLabel: "Treatments",
    role: "Describe each treatment and who it suits.",
    purpose: "explain",
    cta: { primary: "Book a consultation", secondary: "Ask a question" },
    sections: [
      [
        "services",
        "explain",
        ["service-index", "bento-grid", "capability-columns"],
      ],
      ["features", "inform", ["faq-list", "trust-band", "process-timeline"]],
      [
        "testimonials",
        "prove",
        ["editorial-quotes", "minimal-quote", "statement-quote"],
      ],
      ["cta", "convert", ["booking-band", "concierge-teaser", "minimal"]],
    ],
  },
  programmes: {
    kind: "programmes",
    slug: "/programmes",
    title: "Programmes",
    navLabel: "Programmes",
    role: "Show training or coaching options side by side.",
    purpose: "sell",
    cta: { primary: "Start a programme", secondary: "Book a trial" },
    sections: [
      [
        "services",
        "showcase",
        ["visual-grid", "numbered-narrative", "compact-cards"],
      ],
      ["features", "prove", ["process-timeline", "stats-band", "trust-band"]],
      ["cta", "convert", ["booking-band", "conversion-band", "minimal"]],
    ],
  },
  courses: {
    kind: "courses",
    slug: "/courses",
    title: "Courses",
    navLabel: "Courses",
    role: "Present learning options and outcomes.",
    purpose: "sell",
    cta: { primary: "Enquire about a course", secondary: "See outcomes" },
    sections: [
      ["services", "showcase", ["catalogue-list", "bento-grid", "visual-grid"]],
      ["features", "prove", ["stats-band", "process-timeline", "icon-list"]],
      ["cta", "convert", ["conversion-band", "minimal", "contact-focused"]],
    ],
  },
  destinations: {
    kind: "destinations",
    slug: "/destinations",
    title: "Destinations",
    navLabel: "Destinations",
    role: "Let people picture where they would go.",
    purpose: "sell",
    cta: { primary: "Plan this trip", secondary: "See packages" },
    sections: [
      [
        "listings",
        "showcase",
        ["package-cards", "collection-rail", "premium-listing"],
      ],
      [
        "gallery",
        "showcase",
        ["full-bleed", "cinematic-mosaic", "editorial-grid"],
      ],
      ["cta", "convert", ["booking-band", "cinematic", "minimal"]],
    ],
  },
  packages: {
    kind: "packages",
    slug: "/packages",
    title: "Packages",
    navLabel: "Packages",
    role: "Make comparing the options effortless.",
    purpose: "sell",
    cta: { primary: "Request this package", secondary: "Customise a trip" },
    sections: [
      [
        "listings",
        "showcase",
        ["package-cards", "comparison", "premium-listing"],
      ],
      [
        "features",
        "inform",
        ["comparison-table", "capability-grid", "faq-list"],
      ],
      ["cta", "convert", ["booking-band", "minimal", "conversion-band"]],
    ],
  },
  experiences: {
    kind: "experiences",
    slug: "/experiences",
    title: "Experiences",
    navLabel: "Experiences",
    role: "Describe the moments that make the offer different.",
    purpose: "establish",
    cta: { primary: "Add this to my trip", secondary: "Talk to a planner" },
    sections: [
      [
        "services",
        "showcase",
        ["immersive-panels", "horizontal-showcase", "bento-grid"],
      ],
      [
        "gallery",
        "showcase",
        ["cinematic-mosaic", "gallery-strip", "editorial-grid"],
      ],
      [
        "testimonials",
        "prove",
        ["editorial-quotes", "minimal-quote", "statement-quote"],
      ],
    ],
  },
  menu: {
    kind: "menu",
    slug: "/menu",
    title: "Menu",
    navLabel: "Menu",
    role: "Present the menu in real, browsable sections.",
    purpose: "sell",
    cta: { primary: "Reserve a table", secondary: "Ask about dietary needs" },
    sections: [
      [
        "services",
        "inform",
        ["catalogue-list", "editorial-list", "split-offerings"],
      ],
      ["features", "inform", ["bento-grid", "faq-list", "icon-list"]],
      [
        "gallery",
        "showcase",
        ["editorial-grid", "gallery-strip", "art-collage"],
      ],
      ["cta", "convert", ["booking-band", "minimal", "contact-focused"]],
    ],
  },
  story: {
    kind: "story",
    slug: "/story",
    title: "Our story",
    navLabel: "Story",
    role: "Give the business a believable human origin.",
    purpose: "establish",
    cta: { primary: "Visit us", secondary: "Meet the team" },
    sections: [
      [
        "about",
        "establish",
        ["editorial-narrative", "story-timeline", "founder-story"],
      ],
      ["features", "prove", ["stats-band", "trust-band", "numbered-features"]],
      [
        "gallery",
        "showcase",
        ["art-collage", "editorial-grid", "gallery-strip"],
      ],
    ],
  },
  about: {
    kind: "about",
    slug: "/about",
    title: "About",
    navLabel: "About",
    role: "Establish who is behind the business and why it can be trusted.",
    purpose: "establish",
    cta: { primary: "Start a conversation", secondary: "See our work" },
    sections: [
      [
        "about",
        "establish",
        ["editorial-story", "image-led-story", "split-media-story"],
      ],
      ["features", "prove", ["trust-band", "stats-band", "icon-list"]],
      ["cta", "convert", ["minimal", "split", "statement-cta"]],
    ],
  },
  team: {
    kind: "team",
    slug: "/team",
    title: "Team",
    navLabel: "Team",
    role: "Put real people in front of the business.",
    purpose: "establish",
    cta: { primary: "Book with the team", secondary: "Ask a question" },
    sections: [
      [
        "about",
        "establish",
        ["founder-profile", "values-grid", "founder-story"],
      ],
      [
        "services",
        "explain",
        ["compact-cards", "visual-grid", "capability-columns"],
      ],
      ["cta", "convert", ["booking-band", "minimal", "contact-focused"]],
    ],
  },
  gallery: {
    kind: "gallery",
    slug: "/gallery",
    title: "Gallery",
    navLabel: "Gallery",
    role: "Carry the visual proof on its own page.",
    purpose: "prove",
    cta: { primary: "See it in person", secondary: "Get in touch" },
    sections: [
      [
        "gallery",
        "showcase",
        ["bento-mosaic", "cinematic-mosaic", "art-collage"],
      ],
      ["features", "prove", ["trust-band", "icon-list", "stats-band"]],
      ["cta", "convert", ["minimal", "statement-cta", "split"]],
    ],
  },
  lookbook: {
    kind: "lookbook",
    slug: "/lookbook",
    title: "Lookbook",
    navLabel: "Lookbook",
    role: "Sell the taste level before the product list.",
    purpose: "establish",
    cta: { primary: "Shop this look", secondary: "Book an appointment" },
    sections: [
      [
        "gallery",
        "showcase",
        ["framed-print-series", "editorial-grid", "bento-mosaic"],
      ],
      [
        "listings",
        "orient",
        ["collection-rail", "product-grid", "premium-listing"],
      ],
      ["cta", "convert", ["minimal", "concierge-teaser", "split"]],
    ],
  },
  process: {
    kind: "process",
    slug: "/how-it-works",
    title: "How it works",
    navLabel: "How it works",
    role: "Remove uncertainty about what happens next.",
    purpose: "explain",
    cta: { primary: "Start step one", secondary: "Read common questions" },
    sections: [
      [
        "features",
        "explain",
        ["process-timeline", "numbered-features", "bento-grid"],
      ],
      [
        "services",
        "explain",
        ["split-offerings", "editorial-list", "capability-columns"],
      ],
      ["cta", "convert", ["minimal", "split", "conversion-band"]],
    ],
  },
  impact: {
    kind: "impact",
    slug: "/impact",
    title: "Impact",
    navLabel: "Impact",
    role: "Show measurable outcomes and accountability.",
    purpose: "prove",
    cta: { primary: "Support the work", secondary: "Read the story" },
    sections: [
      ["features", "prove", ["stats-band", "numbered-features", "trust-band"]],
      [
        "about",
        "establish",
        ["editorial-narrative", "manifesto-statement", "values-grid"],
      ],
      ["cta", "convert", ["statement-cta", "minimal", "conversion-band"]],
    ],
  },
  inventory: {
    kind: "inventory",
    slug: "/inventory",
    title: "Available now",
    navLabel: "Available",
    role: "Show what is on the shelf right now.",
    purpose: "sell",
    cta: { primary: "Enquire about availability", secondary: "Book a viewing" },
    sections: [
      ["listings", "orient", ["index-list", "product-grid", "collection-rail"]],
      ["features", "prove", ["trust-band", "icon-list", "stats-band"]],
      ["cta", "convert", ["contact-focused", "minimal", "booking-band"]],
    ],
  },
  results: {
    kind: "results",
    slug: "/results",
    title: "Results",
    navLabel: "Results",
    role: "Let other people make the argument for the business.",
    purpose: "prove",
    cta: { primary: "Become the next result", secondary: "See the services" },
    sections: [
      [
        "testimonials",
        "prove",
        ["editorial-quotes", "statement-quote", "minimal-quote"],
      ],
      [
        "listings",
        "showcase",
        ["package-cards", "premium-listing", "image-showcase"],
      ],
      ["cta", "convert", ["conversion-band", "minimal", "split"]],
    ],
  },
  pricing: {
    kind: "pricing",
    slug: "/pricing",
    title: "Pricing",
    navLabel: "Pricing",
    role: "Lay the options out so a decision is easy.",
    purpose: "sell",
    cta: { primary: "Get a tailored quote", secondary: "Compare options" },
    sections: [
      [
        "listings",
        "orient",
        ["package-cards", "comparison", "premium-listing"],
      ],
      [
        "features",
        "inform",
        ["comparison-table", "faq-list", "capability-grid"],
      ],
      ["cta", "convert", ["conversion-band", "minimal", "contact-focused"]],
    ],
  },
  booking: {
    kind: "booking",
    slug: "/booking",
    title: "Booking",
    navLabel: "Book",
    role: "Turn interest into a held slot.",
    purpose: "convert",
    cta: { primary: "Request a booking", secondary: "Check availability" },
    sections: [
      [
        "features",
        "explain",
        ["process-timeline", "numbered-features", "icon-list"],
      ],
      ["contact", "convert", ["booking-enquiry", "concise", "detailed"]],
      ["features", "inform", ["faq-list", "trust-band", "icon-list"]],
    ],
  },
  appointment: {
    kind: "appointment",
    slug: "/appointment",
    title: "Appointment",
    navLabel: "Appointments",
    role: "Make the first appointment low-friction.",
    purpose: "convert",
    cta: { primary: "Request an appointment", secondary: "Ask a question" },
    sections: [
      [
        "services",
        "inform",
        ["service-index", "compact-cards", "capability-columns"],
      ],
      ["contact", "convert", ["booking-enquiry", "concierge-panel", "concise"]],
      ["features", "prove", ["trust-band", "faq-list", "stats-band"]],
    ],
  },
  reservation: {
    kind: "reservation",
    slug: "/reservations",
    title: "Reservations",
    navLabel: "Reserve",
    role: "Make reserving a table simple.",
    purpose: "convert",
    cta: { primary: "Reserve a table", secondary: "Ask about group bookings" },
    sections: [
      [
        "contact",
        "convert",
        ["booking-enquiry", "location-composition", "concise"],
      ],
      ["features", "inform", ["faq-list", "icon-list", "trust-band"]],
    ],
  },
  consultation: {
    kind: "consultation",
    slug: "/consultation",
    title: "Consultation",
    navLabel: "Consultation",
    role: "Offer a clear, low-commitment first step.",
    purpose: "convert",
    cta: { primary: "Request a consultation", secondary: "See our projects" },
    sections: [
      [
        "features",
        "explain",
        ["process-timeline", "capability-grid", "numbered-features"],
      ],
      [
        "contact",
        "convert",
        ["booking-enquiry", "detailed", "concierge-panel"],
      ],
      [
        "testimonials",
        "prove",
        ["minimal-quote", "editorial-quotes", "statement-quote"],
      ],
    ],
  },
  enquiry: {
    kind: "enquiry",
    slug: "/enquiry",
    title: "Enquiry",
    navLabel: "Enquire",
    role: "Give visitors one obvious way to get in touch.",
    purpose: "convert",
    cta: { primary: "Send an enquiry", secondary: "See popular options" },
    sections: [
      [
        "contact",
        "convert",
        ["detailed", "booking-enquiry", "concierge-panel"],
      ],
      ["features", "inform", ["faq-list", "icon-list", "trust-band"]],
    ],
  },
  contact: {
    kind: "contact",
    slug: "/contact",
    title: "Contact",
    navLabel: "Contact",
    role: "Make the practical details impossible to miss.",
    purpose: "convert",
    cta: { primary: "Get in touch", secondary: "Find us" },
    sections: [
      ["contact", "inform", ["location-composition", "concise", "map-led"]],
      ["features", "inform", ["faq-list", "icon-list", "trust-band"]],
    ],
  },
  faq: {
    kind: "faq",
    slug: "/faq",
    title: "Questions",
    navLabel: "FAQ",
    role: "Answer the objections in one place.",
    purpose: "explain",
    cta: { primary: "Ask something else", secondary: "Get in touch" },
    sections: [
      ["features", "inform", ["faq-list", "comparison-table", "icon-list"]],
      ["contact", "convert", ["concise", "detailed", "booking-enquiry"]],
    ],
  },
};

export const pageArchetypeList = pageKinds.map((kind) => archetypes[kind]);

export function pageArchetype(kind: SitePageKind): PageArchetype {
  return archetypes[kind];
}

/**
 * Which pages each business category actually needs. Deliberately uneven: a
 * dental practice and a clothing shop do not get the same site.
 */
const categoryPlans: Record<string, readonly SitePageKind[]> = {
  fashion: ["shop", "collections", "lookbook", "about", "contact"],
  retail: ["shop", "collections", "about", "contact"],
  jewellery: ["collections", "lookbook", "story", "gallery", "contact"],
  supplements: ["shop", "category", "product-info", "about", "contact"],
  healthcare: ["treatments", "about", "appointment", "results", "contact"],
  wellness: ["treatments", "team", "booking", "about", "contact"],
  beauty: ["treatments", "gallery", "booking", "about", "contact"],
  fitness: ["programmes", "team", "pricing", "results", "contact"],
  hospitality: ["collections", "experiences", "gallery", "story", "contact"],
  travel: ["destinations", "packages", "experiences", "about", "enquiry"],
  food: ["menu", "story", "gallery", "reservation"],
  construction: [
    "projects",
    "services",
    "capabilities",
    "about",
    "consultation",
  ],
  professional: ["services", "process", "projects", "about", "contact"],
  technology: ["services", "process", "projects", "pricing", "contact"],
  creative: ["projects", "services", "gallery", "about", "contact"],
  education: ["courses", "process", "results", "about", "contact"],
  realestate: ["inventory", "projects", "process", "about", "contact"],
  automotive: ["inventory", "services", "results", "about", "contact"],
  events: ["services", "gallery", "results", "about", "enquiry"],
  logistics: ["services", "capabilities", "process", "about", "contact"],
  nonprofit: ["impact", "projects", "story", "about", "contact"],
  /*
   * Faith/community: a church or ministry is not a charity. Gatherings,
   * ministries and visiting details lead; giving is present but never the
   * structural focus, and nothing is fabricated (no service times, no names).
   * Reuses existing archetypes so the renderer needs no new components.
   */
  faith: ["services", "about", "story", "contact"],
  agriculture: ["collections", "process", "story", "about", "contact"],
  personal: ["projects", "services", "story", "contact"],
  generic: ["services", "about", "contact"],
};

/** Extra pages worth adding when the visitor names the thing themselves. */
const keywordPages: ReadonlyArray<readonly [RegExp, SitePageKind]> = [
  /* Faith pages the visitor names themselves ("add a ministries page",
     "create a giving page") reuse the programmes/impact archetypes. */
  [/\b(ministr(?:y|ies)|gatherings?)\b/, "programmes"],
  [/\b(giving|tithes?|offerings?)\b/, "impact"],
  [/\b(services? page|service times?)\b/, "services"],
  [
    /\b(shop|store|boutique|ecommerce|e-commerce|online store|products?)\b/,
    "shop",
  ],
  [/\b(collections?|ranges?|catalogues?)\b/, "collections"],
  [/\b(categor(?:y|ies)|browse by)\b/, "category"],
  [/\b(menu)\b/, "menu"],
  [/\b(projects?|portfolio|case stud(?:y|ies))\b/, "projects"],
  [/\b(gallery|photos?|gallery page)\b/, "gallery"],
  [/\b(bookings?|book a|schedule)\b/, "booking"],
  [/\b(appointments?)\b/, "appointment"],
  [/\b(reservations?|reserve a table)\b/, "reservation"],
  [/\b(consultations?)\b/, "consultation"],
  [/\b(faq|frequently asked|questions page)\b/, "faq"],
  [/\b(pricing|plans|packages)\b/, "pricing"],
  [/\b(testimonials?|reviews?)\b/, "results"],
  [/\b(about us|our story|story page|history)\b/, "story"],
  [/\b(our team|team page|staff|coaches|practitioners?)\b/, "team"],
  [/\b(treatments?|therap(?:y|ies))\b/, "treatments"],
  [/\b(destinations?)\b/, "destinations"],
  [/\b(itinerar(?:y|ies)|packages?)\b/, "packages"],
  [/\b(pricing page|rates)\b/, "pricing"],
  [/\b(contact page|get in touch page|enquiry page)\b/, "enquiry"],
];

/**
 * The secondary pages for a business, in reading order.
 *
 * Returns three to six pages and never repeats a page kind. `variation` lets
 * the three creative directions differ structurally rather than only in
 * colour: direction 0 uses the category's signature page set, later directions
 * promote one of the reserve pages and reorder the tail.
 */
export function planSitePages(input: {
  category: string;
  prompt: string;
  variation?: number;
  limit?: number;
}): PageArchetype[] {
  const variation = Math.max(0, Math.min(9, input.variation ?? 0));
  const base = categoryPlans[input.category] ?? categoryPlans["generic"]!;
  const chosen: SitePageKind[] = [];
  const requested = new Set<SitePageKind>();
  const push = (kind: SitePageKind) => {
    if (!chosen.includes(kind)) chosen.push(kind);
  };

  for (const kind of base) push(kind);

  // The visitor's own words win: naming a shop, menu or booking journey adds
  // that page even when the category plan would not have included it.
  const value = input.prompt.toLowerCase();
  for (const [pattern, kind] of keywordPages) {
    if (!pattern.test(value)) continue;
    requested.add(kind);
    push(kind);
  }

  // Five secondary pages is the ceiling (a six-page site). When the business
  // plan overruns it, the pages the visitor named themselves are the last to
  // be dropped.
  while (chosen.length > 5) {
    let index = -1;
    for (let cursor = chosen.length - 1; cursor >= 0; cursor -= 1) {
      if (!requested.has(chosen[cursor]!)) {
        index = cursor;
        break;
      }
    }
    chosen.splice(index >= 0 ? index : chosen.length - 1, 1);
  }

  // Later directions rotate the tail so two directions are not page-for-page
  // identical. Rotation is deterministic and always keeps the first two pages,
  // which are the ones a visitor judges the concept by.
  if (variation > 0 && chosen.length > 3) {
    const head = chosen.slice(0, 2);
    const tail = chosen.slice(2);
    const shift = variation % tail.length;
    chosen.length = 0;
    chosen.push(...head, ...tail.slice(shift), ...tail.slice(0, shift));
  }

  const limit = Math.max(3, Math.min(6, input.limit ?? 6));
  return chosen.slice(0, limit).map((kind) => archetypes[kind]);
}

/**
 * Ordered phrase table: the earlier, more specific noun wins.
 */
const pagePhrases: ReadonlyArray<readonly [RegExp, SitePageKind]> = [
  [/\b(faq|frequently asked|questions?|q ?& ?a)\b/, "faq"],
  [/\b(booking|book a|bookings|schedule)\b/, "booking"],
  [/\b(appointments?)\b/, "appointment"],
  [/\b(reservations?|reserve)\b/, "reservation"],
  [/\b(consultations?)\b/, "consultation"],
  [
    /\b(product info|product information|product guide|specifications?)\b/,
    "product-info",
  ],
  [/\b(shop|store|products?|range)\b/, "shop"],
  [/\b(collections?)\b/, "collections"],
  [/\b(categor(?:y|ies))\b/, "category"],
  [/\b(menu)\b/, "menu"],
  [
    /\b(projects?|portfolio|case stud(?:y|ies)|work we(?:'ve| have) done)\b/,
    "projects",
  ],
  [/\b(capabilit(?:y|ies))\b/, "capabilities"],
  [/\b(treatments?|therap(?:y|ies))\b/, "treatments"],
  [/\b(programmes?|programs?)\b/, "programmes"],
  [/\b(courses?|classes)\b/, "courses"],
  [/\b(destinations?)\b/, "destinations"],
  [/\b(packages?|itinerar(?:y|ies))\b/, "packages"],
  [/\b(experiences?)\b/, "experiences"],
  [/\b(gallery|photos?)\b/, "gallery"],
  [/\b(lookbook|look book)\b/, "lookbook"],
  [/\b(team|staff|coaches|practitioners?|people)\b/, "team"],
  [/\b(how it works|process)\b/, "process"],
  [/\b(impact|outcomes?)\b/, "impact"],
  [/\b(inventory|available|stock)\b/, "inventory"],
  [/\b(results?|testimonials?|reviews?|case results)\b/, "results"],
  [/\b(pricing|prices|plans|rates)\b/, "pricing"],
  [/\b(story|history|heritage|about us)\b/, "story"],
  [/\b(about|who we are)\b/, "about"],
  [/\b(services?|offerings?|what we do)\b/, "services"],
  [/\b(enquir(?:y|ies)|get in touch|quote)\b/, "enquiry"],
  [/\b(contact|location|find us|visit)\b/, "contact"],
];

/**
 * Maps a phrase the visitor wrote to the page it implies, or null when the
 * phrase names no page Studio knows how to build. Keeps "add an FAQ page" and
 * "create a booking page" working without a page-per-phrase lookup in the
 * planner.
 */
export function pageKindFromText(value: string): SitePageKind | null {
  const normalized = ` ${value.toLowerCase().replace(/[^a-z0-9&? ]+/g, " ")} `;
  for (const [pattern, kind] of pagePhrases) {
    if (pattern.test(normalized)) return kind;
  }
  return null;
}

export type PlannedPageSection = {
  type: SectionType;
  variant: string;
  purpose: PageSectionPurpose;
  density: "airy" | "balanced" | "compact";
};

/**
 * Chooses concrete section variants for a page.
 *
 * Variation 0 uses each step's signature variant so the initial concept is
 * intentionally composed; later variations rotate them, which is what makes
 * the three creative directions differ in layout as well as styling. The DNA
 * supplies the rhythm so pages stay coherent with the rest of the site.
 */
export function planPageSections(
  page: PageArchetype,
  input: { variation: number; dna?: DesignDNA },
): PlannedPageSection[] {
  const variation = Math.max(0, Math.min(9, input.variation));
  const seed = hash(
    `${page.slug}#${variation}#${input.dna?.hero.family ?? ""}`,
  );
  return page.sections.map((step, index) => {
    const [type, purpose, variants] = step;
    const pool = variants.length ? variants : ["editorial-story"];
    const variant =
      variation === 0
        ? pool[0]!
        : pool[(seed + index + variation) % pool.length]!;
    const density =
      index === 0
        ? "balanced"
        : (index + variation) % 3 === 0
          ? "airy"
          : (index + variation) % 3 === 1
            ? "compact"
            : "balanced";
    return { type, variant, purpose, density };
  });
}

function hash(value: string): number {
  let result = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16_777_619);
  }
  return Math.abs(result);
}

/** The page's hero heading, phrased for the business rather than the schema. */
export function pageHeroTitle(
  page: PageArchetype,
  businessName: string,
): string {
  switch (page.kind) {
    case "shop":
      return "The full range, ready to explore.";
    case "collections":
      return "A few clear collections, not an endless list.";
    case "category":
      return "Start with the category that fits.";
    case "product-info":
      return "Everything worth knowing before you choose.";
    case "services":
      return "What we do, and how it works.";
    case "projects":
      return "Work we can stand behind.";
    case "capabilities":
      return "What we are genuinely equipped to deliver.";
    case "treatments":
      return "Treatments explained without the jargon.";
    case "programmes":
      return "Programmes built around real outcomes.";
    case "courses":
      return "Courses people finish, not abandon.";
    case "destinations":
      return "Places worth building a trip around.";
    case "packages":
      return "Options lined up so you can compare them.";
    case "experiences":
      return "The parts of the trip people remember.";
    case "menu":
      return "The menu, section by section.";
    case "story":
      return `The story behind ${businessName}.`;
    case "about":
      return `Who is behind ${businessName}.`;
    case "team":
      return "The people you will actually work with.";
    case "gallery":
      return "A closer look.";
    case "lookbook":
      return "How it all comes together.";
    case "process":
      return "What happens, in order.";
    case "impact":
      return "What the work actually changes.";
    case "inventory":
      return "Available right now.";
    case "results":
      return "Results, in other people's words.";
    case "pricing":
      return "Clear options, honestly presented.";
    case "booking":
      return "Hold a slot in a few simple steps.";
    case "appointment":
      return "Request an appointment.";
    case "reservation":
      return "Reserve a table.";
    case "consultation":
      return "Start with a proper conversation.";
    case "enquiry":
      return "Send us the details.";
    case "contact":
      return "Come and find us.";
    case "faq":
      return "The questions we are asked most.";
    default:
      return "A closer look.";
  }
}
