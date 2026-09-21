import type {
  BusinessCategory,
  CreativeBlueprint,
  PlannedSection,
  PromptTerms,
} from "./blueprint";

/**
 * Business copy composition.
 *
 * Every category carries a phrase bank whose strings use {slots} filled from
 * the visitor's own description (descriptor words, place, offer). Section copy
 * is then matched to the section family the blueprint chose, so a
 * "catalogue-list" services section reads like a menu while a
 * "capability-columns" section reads like a capability statement.
 *
 * Nothing here invents awards, ratings, prices, customers, statistics or
 * history: where real information would be required, the copy says so plainly.
 */

type Pair = { title: string; body: string; meta?: string; accent?: string };

export type Profile = {
  kind: string;
  defaultNames: string[];
  nouns: string[];
  offer: string;
  offerNoun: string;
  audience: string;
  intent: string;
  personality: string;
  priorities: string[];
  eyebrow: string;
  heroTitles: string[];
  heroBodies: string[];
  about: { title: string; body: string };
  offering: { title: string; body: string; items: Pair[]; eyebrow?: string };
  listing: { title: string; body: string; items: Pair[]; eyebrow?: string };
  feature: { title: string; items: Pair[] };
  scenes: string[];
  process: { title: string; items: Pair[] };
  cta: { title: string; body: string; label: string; secondary: string };
  contact: { title: string; body: string };
  statement: string;
  concept: string;
};

const genericFeature = (noun: string): Pair[] => [
  {
    title: "Clear structure",
    body: `The ${noun} story is organised so a first-time visitor understands the offer quickly.`,
    meta: "Clarity",
  },
  {
    title: "Honest content",
    body: "Nothing is claimed here that the business has not supplied yet.",
    meta: "Trust",
  },
  {
    title: "Room to grow",
    body: "Sections can be reordered, replaced or extended as real material arrives.",
    meta: "Flexible",
  },
];

const hospitality: Profile = {
  kind: "hotel",
  defaultNames: ["MOUNTAIN HOUSE", "RIDGE HOUSE"],
  nouns: ["House", "Retreat", "Residency"],
  offer: "Rooms & stays",
  offerNoun: "rooms",
  audience: "travellers planning a slower, well-considered stay",
  intent: "compare the rooms and start a booking conversation",
  personality: "unhurried and quietly confident",
  priorities: ["Rooms", "Dining", "The landscape", "Enquiries"],
  eyebrow: "Rooms · dining · far horizons",
  heroTitles: [
    "Where the {lead} view does the talking.",
    "A stay shaped around the {lead} horizon.",
    "Come for the view. Stay for the quiet.",
  ],
  heroBodies: [
    "A considered property concept with a calm room collection, an in-house restaurant and a direct enquiry path instead of a noisy booking engine.",
    "The website leads with atmosphere, then makes the practical decisions — rooms, dining and availability — easy to reach.",
  ],
  about: {
    title: "A slower rhythm, deliberately kept.",
    body: "The story is told through light, materials and distance from the everyday, so the property feels like a place rather than a listing. Verified history, team and awards can be added later.",
  },
  offering: {
    eyebrow: "The restaurant",
    title: "Evenings gathered around a warm table.",
    body: "A dining section ready for the real menu, service hours and reservation details once supplied.",
    items: [
      {
        title: "Breakfast with the view",
        body: "A quiet start designed around the pace of the stay.",
        meta: "Morning",
      },
      {
        title: "Season-led dinner",
        body: "A concise food story that can evolve with the kitchen.",
        meta: "Evening",
      },
      {
        title: "Private table enquiries",
        body: "An easy route for occasions, groups and longer stays.",
        meta: "Gather",
      },
    ],
  },
  listing: {
    eyebrow: "Rooms & private stays",
    title: "A room collection made easy to compare.",
    body: "Atmosphere first, practical detail second — with no invented availability or pricing.",
    items: [
      {
        title: "Forest room",
        body: "An intimate room framed by deep green outlook.",
        meta: "Quiet side",
      },
      {
        title: "Ridge room",
        body: "An open outlook and a generous place to pause.",
        meta: "Mountain side",
      },
      {
        title: "House suite",
        body: "More space for longer stays and slower mornings.",
        meta: "Separate lounge",
      },
    ],
  },
  feature: {
    title: "Comfort, food and landscape — considered together.",
    items: [
      {
        title: "View-led spaces",
        body: "Every section keeps the landscape in the frame.",
        meta: "Landscape",
      },
      {
        title: "Dining on the property",
        body: "A dedicated restaurant story with a clear route to enquiries.",
        meta: "Dining",
      },
      {
        title: "Direct enquiry path",
        body: "A confident action without pretending a booking engine exists.",
        meta: "Stay",
      },
    ],
  },
  scenes: [
    "Morning ridge",
    "Quiet interior",
    "Dinner after dusk",
    "Forest approach",
  ],
  process: {
    title: "From enquiry to arrival.",
    items: [
      {
        title: "Share the dates",
        body: "A short enquiry with the kind of stay in mind.",
        meta: "Step 01",
      },
      {
        title: "Confirm the details",
        body: "Availability and specifics are confirmed directly.",
        meta: "Step 02",
      },
      {
        title: "Plan the days",
        body: "Practical travel notes and arrival guidance.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Plan the stay.",
    body: "Share preferred dates and the kind of stay you have in mind — the rest is a conversation.",
    label: "Start a booking enquiry",
    secondary: "Explore the rooms",
  },
  contact: {
    title: "Close to the gateway. A world away in feeling.",
    body: "A place for verified directions, travel notes and direct contact details when the property is ready to publish.",
  },
  statement: "A quieter way to arrive.",
  concept: "Cinematic mountain retreat",
};

const travel: Profile = {
  kind: "travel",
  defaultNames: ["NORTHBOUND JOURNEYS", "FAR ROUTES"],
  nouns: ["Journeys", "Trails", "Expeditions"],
  offer: "Journeys & packages",
  offerNoun: "journeys",
  audience: "travellers comparing routes, pace and comfort",
  intent: "understand the shape of a trip and enquire about dates",
  personality: "energetic and grounded",
  priorities: ["Journeys", "Route notes", "Practical detail", "Enquiries"],
  eyebrow: "Routes · seasons · small groups",
  heroTitles: [
    "Go further with every detail made clear.",
    "A {lead} route planned properly from the start.",
    "The journey is the point — the planning should feel easy.",
  ],
  heroBodies: [
    "A journey-led concept that puts the route, the pace and the practical questions in one clear sequence.",
    "Itineraries stay readable while logistics, seasons and next steps remain easy to find.",
  ],
  about: {
    title: "Routes chosen for the experience, not the checkbox.",
    body: "The narrative explains how a journey is shaped — pace, terrain and comfort — with proper space for verified operator details later.",
  },
  offering: {
    title: "Journeys grouped by how they feel.",
    body: "A compact index travellers can scan before reading any detail.",
    items: [
      {
        title: "Short escapes",
        body: "Two or three days built around one strong experience.",
        meta: "Quick",
      },
      {
        title: "Signature routes",
        body: "Longer itineraries with considered pacing and stops.",
        meta: "Featured",
      },
      {
        title: "Private journeys",
        body: "Flexible departures shaped around a small group.",
        meta: "Custom",
      },
    ],
  },
  listing: {
    title: "Packages laid out for quick comparison.",
    body: "Enough structure to compare options without invented prices or guarantees.",
    items: [
      {
        title: "Classic route",
        body: "The essential version with balanced travel days.",
        meta: "Balanced pace",
      },
      {
        title: "Extended route",
        body: "More time in the places that reward it.",
        meta: "Slower pace",
      },
      {
        title: "Private departure",
        body: "Dates and pace arranged directly.",
        meta: "Flexible",
      },
    ],
  },
  feature: {
    title: "The practical details travellers actually ask about.",
    items: [
      {
        title: "Season notes",
        body: "When each route feels right, and why.",
        meta: "Timing",
      },
      {
        title: "Pace and difficulty",
        body: "Clear expectations before anyone commits.",
        meta: "Comfort",
      },
      {
        title: "What happens next",
        body: "A single obvious route to plan a departure.",
        meta: "Enquiries",
      },
    ],
  },
  scenes: [
    "On the route",
    "The first morning",
    "Small group moments",
    "The long way round",
  ],
  process: {
    title: "How a journey comes together.",
    items: [
      {
        title: "Pick a direction",
        body: "Choose the route and the pace that suits.",
        meta: "Step 01",
      },
      {
        title: "Refine the days",
        body: "Adjust stops, comfort level and timing.",
        meta: "Step 02",
      },
      {
        title: "Confirm the departure",
        body: "Details and dates settled in a direct conversation.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Tell us how you like to travel.",
    body: "Share the route, the month and the pace you have in mind — the itinerary can be shaped around it.",
    label: "Plan a journey",
    secondary: "Browse the routes",
  },
  contact: {
    title: "Start with a conversation.",
    body: "Verified contact details, office hours and departure notes can live here.",
  },
  statement: "Further, with fewer unknowns.",
  concept: "Wide-horizon journey concept",
};

const food: Profile = {
  kind: "restaurant",
  defaultNames: ["COMMON GROUND CAFÉ", "THE LONG TABLE"],
  nouns: ["Table", "Kitchen", "Café"],
  offer: "Menu & kitchen",
  offerNoun: "menu",
  audience: "regulars and first-timers deciding where to eat today",
  intent: "see what is served and plan a visit",
  personality: "warm and unpretentious",
  priorities: ["Menu", "The room", "Opening hours", "Visits"],
  eyebrow: "Kitchen · counter · good company",
  heroTitles: [
    "Made for morning rituals and long lunches.",
    "A {lead} table worth making time for.",
    "Good food, plainly described, close to home.",
  ],
  heroBodies: [
    "A warm, editorial concept that keeps the menu, the room and the next visit within easy reach.",
    "Today's menu is a short scroll away, and planning a visit takes one obvious action.",
  ],
  about: {
    title: "Neighbourhood energy, carefully made.",
    body: "Friendly typography and an uncomplicated story make the place feel human rather than over-designed. The real history, kitchen and team can replace this later.",
  },
  offering: {
    title: "A short, friendly menu.",
    body: "Grouped so a guest can decide quickly, with space for the verified dishes and prices.",
    items: [
      {
        title: "Coffee & slow pours",
        body: "Espresso classics and a rotating filter selection.",
        meta: "All day",
      },
      {
        title: "Breakfast plates",
        body: "Simple, seasonal combinations made to order.",
        meta: "Morning",
      },
      {
        title: "Bakes from the counter",
        body: "A changing edit of warm, sweet and savoury things.",
        meta: "Daily",
      },
    ],
  },
  listing: {
    title: "A changing counter, in focus.",
    body: "Signature items given visual weight without invented prices or claims.",
    items: [
      {
        title: "Signature pour",
        body: "The drink regulars come back for.",
        meta: "Featured",
      },
      {
        title: "Seasonal plate",
        body: "What the kitchen is working on now.",
        meta: "This season",
      },
      {
        title: "Something sweet",
        body: "A rotating finish from the pastry counter.",
        meta: "Counter",
      },
    ],
  },
  feature: {
    title: "What makes a place worth returning to.",
    items: [
      {
        title: "A menu you can read",
        body: "Short, grouped and easy to scan on a phone.",
        meta: "Menu",
      },
      {
        title: "Hours that are obvious",
        body: "Opening times placed where guests look first.",
        meta: "Visits",
      },
      {
        title: "One tap to plan",
        body: "Directions and enquiries without leaving the page.",
        meta: "Contact",
      },
    ],
  },
  scenes: [
    "The morning counter",
    "A table in the sun",
    "From the kitchen",
    "Late afternoon",
  ],
  process: {
    title: "From craving to table.",
    items: [
      {
        title: "See the menu",
        body: "The current list, grouped simply.",
        meta: "Step 01",
      },
      {
        title: "Check the hours",
        body: "Opening times and the busiest periods.",
        meta: "Step 02",
      },
      {
        title: "Come by",
        body: "Directions, or a note for larger groups.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Your next favourite table is close.",
    body: "Opening hours, directions and larger-group questions are all a short step away.",
    label: "Plan a visit",
    secondary: "See the menu",
  },
  contact: {
    title: "Come by when the light is good.",
    body: "Add the verified address, opening hours and contact details before publishing.",
  },
  statement: "Coffee, food and room to stay awhile.",
  concept: "Warm editorial café",
};

const retail: Profile = {
  kind: "retail",
  defaultNames: ["FIELD OBJECTS", "THE STORE ROOM"],
  nouns: ["Store", "Objects", "Supply"],
  offer: "Collections",
  offerNoun: "collection",
  audience: "shoppers comparing quality, fit and value",
  intent: "browse the range and ask about an order",
  personality: "direct and confident",
  priorities: ["Products", "Details", "Availability", "Orders"],
  eyebrow: "Products · details · delivery",
  heroTitles: [
    "Useful things, chosen with a point of view.",
    "A {lead} range worth a closer look.",
    "Built to be used, not just listed.",
  ],
  heroBodies: [
    "A product-forward concept where the objects stay at the centre and every practical question is one step away.",
    "Photography, specification and ordering are organised so the range reads as curated rather than endless.",
  ],
  about: {
    title: "A range with a reason behind it.",
    body: "The story explains what the store chooses and why, with space for the verified sourcing, materials and people later.",
  },
  offering: {
    title: "Collections grouped the way shoppers think.",
    body: "A short index that gets people to the right products quickly.",
    items: [
      {
        title: "Everyday range",
        body: "The pieces that get used constantly.",
        meta: "Core",
      },
      {
        title: "Limited pieces",
        body: "Smaller runs, made in short batches.",
        meta: "Limited",
      },
      {
        title: "Gift selection",
        body: "Useful things that travel well.",
        meta: "Gifting",
      },
    ],
  },
  listing: {
    title: "The range, brought into focus.",
    body: "Grid, rail or index — the catalogue adapts to how the collection is best browsed.",
    items: [
      {
        title: "Featured piece",
        body: "The item worth leading with this season.",
        meta: "Featured",
      },
      {
        title: "Second piece",
        body: "A strong supporting product.",
        meta: "Popular",
      },
      {
        title: "Third piece",
        body: "The one that completes the set.",
        meta: "New",
      },
    ],
  },
  feature: {
    title: "Details that decide a purchase.",
    items: [
      {
        title: "Clear specification",
        body: "Materials, dimensions and care shown plainly.",
        meta: "Details",
      },
      {
        title: "Straight answers",
        body: "No invented stock levels or delivery promises.",
        meta: "Orders",
      },
      {
        title: "Easy next step",
        body: "One obvious route to enquire or order.",
        meta: "Checkout",
      },
    ],
  },
  scenes: ["Studio detail", "In use", "Materials", "Packed and ready"],
  process: {
    title: "How ordering works.",
    items: [
      {
        title: "Browse",
        body: "Move through the collection by category.",
        meta: "Step 01",
      },
      {
        title: "Ask",
        body: "Confirm availability, size or finish directly.",
        meta: "Step 02",
      },
      {
        title: "Receive",
        body: "Delivery and timelines confirmed in writing.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Ready to order or still deciding?",
    body: "Send a short note about what you need and the right option comes back to you.",
    label: "Enquire about an order",
    secondary: "Explore the collection",
  },
  contact: {
    title: "Questions about an item?",
    body: "Add verified store details, delivery areas and contact information here.",
  },
  statement: "Objects chosen to be used.",
  concept: "Product-led storefront",
};

const fashion: Profile = {
  kind: "fashion",
  defaultNames: ["STUDIO NOIR", "OFF SEASON"],
  nouns: ["Studio", "Label", "Wardrobe"],
  offer: "Collection",
  offerNoun: "collection",
  audience: "shoppers who read a look before they read a label",
  intent: "feel the direction of the label and enquire about pieces",
  personality: "assertive and image-led",
  priorities: ["Campaign", "Collection", "Lookbook", "Enquiries"],
  eyebrow: "Campaign · collection · lookbook",
  heroTitles: [
    "A {lead} wardrobe built on a single idea.",
    "Cut for presence, made to be worn.",
    "The collection speaks first.",
  ],
  heroBodies: [
    "An image-led concept where typography carries the attitude and the collection stays the only subject.",
    "Editorial pacing replaces the usual grid so the label reads like a campaign rather than a catalogue.",
  ],
  about: {
    title: "A point of view, not a season.",
    body: "The label's intent is stated plainly, with room for the verified designers, materials and production story later.",
  },
  offering: {
    title: "Collections with a clear stance.",
    body: "Short, confident groupings rather than an endless scroll.",
    items: [
      {
        title: "Signature line",
        body: "The pieces that define the label.",
        meta: "Core",
      },
      {
        title: "Seasonal drop",
        body: "What is new and moving fastest.",
        meta: "New",
      },
      {
        title: "Archive pieces",
        body: "Older cuts kept available.",
        meta: "Archive",
      },
    ],
  },
  listing: {
    title: "The collection, shot as intended.",
    body: "A rail or grid with enough room for scale, fabric and fit.",
    items: [
      {
        title: "Look 01",
        body: "The defining silhouette of the collection.",
        meta: "Featured",
      },
      {
        title: "Look 02",
        body: "A softer counterpoint in the same language.",
        meta: "Editorial",
      },
      {
        title: "Look 03",
        body: "The piece that carries the rest.",
        meta: "Statement",
      },
    ],
  },
  feature: {
    title: "How the label works.",
    items: [
      {
        title: "Made in small runs",
        body: "Production volume stated only when verified.",
        meta: "Production",
      },
      {
        title: "Fit and materials",
        body: "Clear notes so sizing decisions are easy.",
        meta: "Details",
      },
      {
        title: "Direct enquiries",
        body: "One route for stockists, press and customers.",
        meta: "Contact",
      },
    ],
  },
  scenes: ["Campaign frame", "Fabric close-up", "Backstage", "Studio look"],
  process: {
    title: "From lookbook to delivery.",
    items: [
      {
        title: "Follow the collection",
        body: "Browse the current drop.",
        meta: "Step 01",
      },
      {
        title: "Ask about a piece",
        body: "Size, fit and availability confirmed directly.",
        meta: "Step 02",
      },
      {
        title: "Arrange delivery",
        body: "Shipping and timelines agreed in writing.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "See the collection in full.",
    body: "Enquire about a piece, a drop or a stockist enquiry — whichever applies.",
    label: "Enquire about the collection",
    secondary: "View the lookbook",
  },
  contact: {
    title: "For customers, stockists and press.",
    body: "Add verified contact routes and studio details here.",
  },
  statement: "Made with intent, worn with intent.",
  concept: "Campaign-led fashion concept",
};

const professional: Profile = {
  kind: "professional",
  defaultNames: ["MERIDIAN PRACTICE", "NORTHFIELD & CO"],
  nouns: ["Practice", "Partners", "Advisory"],
  offer: "Services",
  offerNoun: "services",
  audience: "people choosing who to trust with an important decision",
  intent: "understand the expertise and book an initial conversation",
  personality: "measured and precise",
  priorities: ["Services", "Expertise", "Approach", "Consultation"],
  eyebrow: "Services · expertise · approach",
  heroTitles: [
    "Clarity for {lead} decisions that matter.",
    "Advisers who explain the reasoning.",
    "Straight answers, properly evidenced.",
  ],
  heroBodies: [
    "A restrained, credential-first concept that leads with how the work is done rather than superlatives.",
    "Services, approach and the first conversation are arranged so decisions feel considered, not rushed.",
  ],
  about: {
    title: "A practice built on method.",
    body: "The approach is described step by step. Verified qualifications, registrations and history can be added without rewriting the structure.",
  },
  offering: {
    title: "Services, described precisely.",
    body: "Each service states who it is for and what it involves.",
    items: [
      {
        title: "Advisory engagement",
        body: "Ongoing guidance for a defined scope.",
        meta: "Retained",
      },
      {
        title: "Project work",
        body: "A focused piece of work with a clear end point.",
        meta: "Fixed",
      },
      {
        title: "Review and second opinion",
        body: "An independent read before a decision is made.",
        meta: "One-off",
      },
    ],
  },
  listing: {
    title: "The engagement types, side by side.",
    body: "A structural comparison — scope and process, never invented fees.",
    items: [
      {
        title: "Initial consultation",
        body: "A short conversation to define the question.",
        meta: "Start here",
      },
      {
        title: "Scoped engagement",
        body: "Deliverables and timeline agreed in writing.",
        meta: "Defined",
      },
      {
        title: "Ongoing support",
        body: "Continued availability after delivery.",
        meta: "Optional",
      },
    ],
  },
  feature: {
    title: "How the work is done.",
    items: [
      {
        title: "Structured discovery",
        body: "The problem is defined before solutions are proposed.",
        meta: "Method",
      },
      {
        title: "Written reasoning",
        body: "Recommendations come with their justification.",
        meta: "Evidence",
      },
      {
        title: "Clear boundaries",
        body: "Scope, responsibilities and timelines stated up front.",
        meta: "Governance",
      },
    ],
  },
  scenes: ["The practice", "Working session", "Documentation", "The office"],
  process: {
    title: "A predictable way to begin.",
    items: [
      {
        title: "Initial conversation",
        body: "Understand the situation and the constraints.",
        meta: "Step 01",
      },
      {
        title: "Written scope",
        body: "Objectives, deliverables and timing agreed.",
        meta: "Step 02",
      },
      {
        title: "Engagement",
        body: "Work proceeds with regular checkpoints.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Start with a conversation.",
    body: "Describe the decision in front of you and the right next step is suggested honestly.",
    label: "Request a consultation",
    secondary: "See the services",
  },
  contact: {
    title: "Make the first conversation easy.",
    body: "Add verified contact routing, hours and consultation details before publishing.",
  },
  statement: "Considered advice, plainly given.",
  concept: "Restrained professional practice",
};

const technology: Profile = {
  kind: "technology",
  defaultNames: ["SIGNAL SYSTEMS", "PLAINSTACK"],
  nouns: ["Systems", "Platform", "Works"],
  offer: "Capabilities",
  offerNoun: "capabilities",
  audience: "teams evaluating whether the product solves their problem",
  intent: "understand the capability set and request a demonstration",
  personality: "precise and matter-of-fact",
  priorities: ["Capabilities", "Workflow", "Integration", "Demonstration"],
  eyebrow: "Capabilities · workflow · integration",
  heroTitles: [
    "Technology that disappears into the work.",
    "Infrastructure for teams that cannot afford surprises.",
    "Built to be depended on, not demoed.",
  ],
  heroBodies: [
    "A technical, evidence-first concept that states what the product does, where it fits and how a team adopts it.",
    "Capabilities, workflow and integration come before any claim about the outcome.",
  ],
  about: {
    title: "What the product is, and what it is not.",
    body: "An honest scope statement. Verified metrics, certifications and case studies can replace the placeholders later.",
  },
  offering: {
    title: "Capabilities, grouped by the problem they solve.",
    body: "Each capability states the job it does rather than listing features.",
    items: [
      {
        title: "Core platform",
        body: "The primary workflow the product is built around.",
        meta: "Foundation",
      },
      {
        title: "Integration layer",
        body: "How existing systems connect and stay in sync.",
        meta: "Connect",
      },
      {
        title: "Operational tooling",
        body: "Monitoring, access control and day-two operations.",
        meta: "Run",
      },
    ],
  },
  listing: {
    title: "Editions described structurally.",
    body: "Scope and fit, without invented pricing or service-level promises.",
    items: [
      {
        title: "Team edition",
        body: "For a single team adopting the core workflow.",
        meta: "Starter",
      },
      {
        title: "Platform edition",
        body: "For organisations running several connected teams.",
        meta: "Scale",
      },
      {
        title: "Enterprise engagement",
        body: "Deployment, migration and support discussed directly.",
        meta: "Custom",
      },
    ],
  },
  feature: {
    title: "Built for the people who run it.",
    items: [
      {
        title: "Predictable behaviour",
        body: "Systems behave the same way under load.",
        meta: "Reliability",
      },
      {
        title: "Observable by default",
        body: "Logs, metrics and audit trails from day one.",
        meta: "Operations",
      },
      {
        title: "Security-first design",
        body: "Access, isolation and data handling defined explicitly.",
        meta: "Security",
      },
    ],
  },
  scenes: ["System overview", "Interface detail", "Deployment", "Monitoring"],
  process: {
    title: "From evaluation to rollout.",
    items: [
      {
        title: "Technical conversation",
        body: "Requirements, constraints and current stack.",
        meta: "Step 01",
      },
      {
        title: "Guided evaluation",
        body: "A bounded trial against real conditions.",
        meta: "Step 02",
      },
      {
        title: "Rollout",
        body: "Migration, training and support planned together.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "See whether it fits your stack.",
    body: "Describe the workflow you are trying to fix and the response is technical, not sales-led.",
    label: "Request a demonstration",
    secondary: "Review the capabilities",
  },
  contact: {
    title: "Talk to the people who build it.",
    body: "Add verified support routes, documentation links and contact details here.",
  },
  statement: "Dependable systems, stated plainly.",
  concept: "Technical product concept",
};

const creative: Profile = {
  kind: "creative",
  defaultNames: ["STUDIO FORM", "NINE & CO"],
  nouns: ["Studio", "Collective", "Practice"],
  offer: "Work & services",
  offerNoun: "work",
  audience: "clients judging craft before they read a pitch",
  intent: "assess the work and open a project conversation",
  personality: "expressive and self-assured",
  priorities: ["Selected work", "Capabilities", "Process", "Enquiries"],
  eyebrow: "Selected work · capabilities · process",
  heroTitles: [
    "Work that earns its place on the page.",
    "A {lead} studio, led by craft.",
    "Ideas that survive contact with the brief.",
  ],
  heroBodies: [
    "A portfolio-led concept where the composition itself demonstrates the studio's standard.",
    "Projects, capabilities and process are arranged so the work is judged before the pitch is read.",
  ],
  about: {
    title: "Craft first, always.",
    body: "A short statement of intent with space for the verified team, clients and recognition later.",
  },
  offering: {
    title: "Capabilities, stated honestly.",
    body: "What the studio takes on, and what it does not.",
    items: [
      {
        title: "Brand and identity",
        body: "Positioning, systems and the assets that carry them.",
        meta: "Brand",
      },
      {
        title: "Digital product",
        body: "Websites, interfaces and the design systems behind them.",
        meta: "Digital",
      },
      {
        title: "Campaign and content",
        body: "Art direction across the channels that matter.",
        meta: "Campaign",
      },
    ],
  },
  listing: {
    title: "Selected work.",
    body: "Case studies framed by the problem, the thinking and the result.",
    items: [
      {
        title: "Project one",
        body: "Replace with a real project and its outcome.",
        meta: "Case study",
      },
      {
        title: "Project two",
        body: "A second engagement with a different problem.",
        meta: "Case study",
      },
      {
        title: "Project three",
        body: "A short collaboration or a long partnership.",
        meta: "Case study",
      },
    ],
  },
  feature: {
    title: "How the studio works.",
    items: [
      {
        title: "Direct collaboration",
        body: "The people who pitch do the work.",
        meta: "Team",
      },
      {
        title: "Documented thinking",
        body: "Decisions are written down and shared.",
        meta: "Process",
      },
      {
        title: "Defined scope",
        body: "Clear deliverables rather than open-ended retainers.",
        meta: "Engagement",
      },
    ],
  },
  scenes: [
    "Studio in progress",
    "Material studies",
    "On set",
    "Final delivery",
  ],
  process: {
    title: "A process without mystery.",
    items: [
      {
        title: "Frame the problem",
        body: "Understand the business before proposing anything.",
        meta: "Step 01",
      },
      {
        title: "Explore directions",
        body: "Two or three distinct routes, argued properly.",
        meta: "Step 02",
      },
      {
        title: "Build and refine",
        body: "Production, detail and handover.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Have a project worth doing properly?",
    body: "Share the brief in two sentences and the reply will tell you honestly whether it fits.",
    label: "Start a project conversation",
    secondary: "See the work",
  },
  contact: {
    title: "New business and collaborations.",
    body: "Add verified contact details, studio address and availability here.",
  },
  statement: "Made to be looked at twice.",
  concept: "Portfolio-led creative studio",
};

const fitness: Profile = {
  kind: "fitness",
  defaultNames: ["FORM STUDIO", "IRON PATH"],
  nouns: ["Studio", "Method", "Lab"],
  offer: "Programs",
  offerNoun: "programs",
  audience: "people deciding whether this is the right place to start",
  intent: "understand the method and book an intro session",
  personality: "direct and motivating",
  priorities: ["Method", "Programs", "Schedule", "Intro session"],
  eyebrow: "Method · programs · schedule",
  heroTitles: [
    "Progress begins with a plan you can follow.",
    "Training built around consistency, not intensity alone.",
    "A {lead} method you can actually keep.",
  ],
  heroBodies: [
    "A coaching concept that explains the method before asking for commitment, and keeps booking simple.",
    "Programs, progression and scheduling are clear without promising results that cannot be guaranteed.",
  ],
  about: {
    title: "The method comes first.",
    body: "How sessions are structured, how progress is reviewed and how intensity is adjusted. Verified coaching credentials can be added here.",
  },
  offering: {
    title: "Programs by goal and commitment.",
    body: "Three clear routes rather than a wall of options.",
    items: [
      {
        title: "Foundations",
        body: "Building consistent training and technique.",
        meta: "Start here",
      },
      {
        title: "Strength progression",
        body: "Structured loading with regular review.",
        meta: "Intermediate",
      },
      {
        title: "One-to-one coaching",
        body: "Programming shaped around one person.",
        meta: "Personal",
      },
    ],
  },
  listing: {
    title: "Ways to train.",
    body: "Format and frequency, without invented prices or guarantees.",
    items: [
      {
        title: "Small group sessions",
        body: "Shared sessions with individual attention.",
        meta: "Group",
      },
      {
        title: "Personal sessions",
        body: "Fully individual programming and coaching.",
        meta: "1:1",
      },
      {
        title: "Online programming",
        body: "Remote plans with scheduled check-ins.",
        meta: "Remote",
      },
    ],
  },
  feature: {
    title: "What keeps people training.",
    items: [
      {
        title: "Progression you can see",
        body: "Session records and review points.",
        meta: "Tracking",
      },
      {
        title: "Coaching, not counting",
        body: "Technique corrected before load is added.",
        meta: "Quality",
      },
      {
        title: "Honest expectations",
        body: "No promised transformations or timelines.",
        meta: "Trust",
      },
    ],
  },
  scenes: ["The floor", "Session detail", "Early hours", "Coaching moment"],
  process: {
    title: "From first session to routine.",
    items: [
      {
        title: "Intro session",
        body: "Assess where you are starting from.",
        meta: "Step 01",
      },
      {
        title: "Chosen plan",
        body: "Pick the format that fits your week.",
        meta: "Step 02",
      },
      {
        title: "Regular review",
        body: "Adjust the plan as progress builds.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Start with an intro session.",
    body: "Tell us your goal and current training week, and we will suggest where to begin.",
    label: "Book an intro session",
    secondary: "See the programs",
  },
  contact: {
    title: "Visit, or ask before you commit.",
    body: "Add verified location, timetable and contact details here.",
  },
  statement: "Consistency over intensity.",
  concept: "Method-led training studio",
};

const wellness: Profile = {
  kind: "wellness",
  defaultNames: ["QUIET HOUSE", "THE SLOW ROOM"],
  nouns: ["House", "Ritual", "Sanctuary"],
  offer: "Treatments & rituals",
  offerNoun: "treatments",
  audience: "people looking for calm, careful care",
  intent: "understand what a session involves and book quietly",
  personality: "unhurried and reassuring",
  priorities: ["Treatments", "The space", "Practitioners", "Booking"],
  eyebrow: "Treatments · rituals · booking",
  heroTitles: [
    "Room to slow down properly.",
    "Care that starts with attention.",
    "A {lead} ritual, without the rush.",
  ],
  heroBodies: [
    "A calm, spacious concept where the treatment list is calm and the booking path is short.",
    "The atmosphere leads and the practical questions — what happens, how long, who with — are answered plainly.",
  ],
  about: {
    title: "A practice built on attention.",
    body: "How a session is approached and why pacing matters. Verified qualifications and practitioners can be added later.",
  },
  offering: {
    title: "Treatments, grouped by intention.",
    body: "Long enough to understand, short enough to read.",
    items: [
      {
        title: "Restore",
        body: "Sessions aimed at recovery and rest.",
        meta: "Calm",
      },
      {
        title: "Release",
        body: "Focused work on tension and mobility.",
        meta: "Body",
      },
      {
        title: "Reset",
        body: "A longer session for a full reset.",
        meta: "Extended",
      },
    ],
  },
  listing: {
    title: "Session lengths and formats.",
    body: "Format and duration stated clearly, never invented pricing.",
    items: [
      {
        title: "Short session",
        body: "A focused appointment within a working day.",
        meta: "Brief",
      },
      {
        title: "Standard session",
        body: "The usual appointment length and format.",
        meta: "Common",
      },
      {
        title: "Extended ritual",
        body: "A longer visit with time to settle.",
        meta: "Extended",
      },
    ],
  },
  feature: {
    title: "What a first visit is like.",
    items: [
      {
        title: "A conversation first",
        body: "Needs and preferences discussed up front.",
        meta: "Consult",
      },
      {
        title: "Your pace",
        body: "Nothing is rushed or pushed.",
        meta: "Comfort",
      },
      {
        title: "Clear aftercare",
        body: "Practical guidance for the following days.",
        meta: "After",
      },
    ],
  },
  scenes: [
    "The quiet room",
    "Light and linen",
    "Preparation",
    "After the session",
  ],
  process: {
    title: "Booking without pressure.",
    items: [
      {
        title: "Choose a session",
        body: "Pick the intention and the length.",
        meta: "Step 01",
      },
      {
        title: "Confirm a time",
        body: "Availability checked directly.",
        meta: "Step 02",
      },
      {
        title: "Arrive early",
        body: "Time to settle before the session starts.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Reserve some quiet time.",
    body: "Describe what you need and the most suitable session is suggested honestly.",
    label: "Book a session",
    secondary: "See the treatments",
  },
  contact: {
    title: "Find us, or ask a question.",
    body: "Add verified location, opening hours and practitioner details here.",
  },
  statement: "Slow down, properly.",
  concept: "Serene wellness concept",
};

const healthcare: Profile = {
  kind: "healthcare",
  defaultNames: ["BRIGHT CLINIC", "CARE POINT"],
  nouns: ["Clinic", "Centre", "Practice"],
  offer: "Care & services",
  offerNoun: "services",
  audience: "patients and families making a careful decision",
  intent: "understand the service, the process and how to book",
  personality: "calm and credible",
  priorities: ["Services", "Process", "Access", "Appointments"],
  eyebrow: "Services · process · appointments",
  heroTitles: [
    "Care explained before you arrive.",
    "Clear answers, careful treatment.",
    "A {lead} practice that respects your time.",
  ],
  heroBodies: [
    "A reassuring, information-first concept where the process, the visit and the booking path are all obvious.",
    "Nothing is overstated: services state what they involve and how to access them.",
  ],
  about: {
    title: "How care is delivered here.",
    body: "The approach, the visit flow and what patients should expect. Verified registrations and practitioner details can be added later.",
  },
  offering: {
    title: "Services, described in plain language.",
    body: "What each service involves and who it is for.",
    items: [
      {
        title: "Consultation",
        body: "An assessment and a clear explanation of options.",
        meta: "First visit",
      },
      {
        title: "Ongoing care",
        body: "Scheduled follow-up with a consistent team.",
        meta: "Follow-up",
      },
      {
        title: "Preventive checks",
        body: "Routine review and early guidance.",
        meta: "Preventive",
      },
    ],
  },
  listing: {
    title: "Ways to be seen.",
    body: "Access routes and formats, without invented availability.",
    items: [
      {
        title: "In-person appointment",
        body: "A scheduled visit at the practice.",
        meta: "On site",
      },
      {
        title: "Follow-up review",
        body: "A shorter appointment to check progress.",
        meta: "Review",
      },
      {
        title: "Second opinion",
        body: "An independent read of existing reports.",
        meta: "Optional",
      },
    ],
  },
  feature: {
    title: "What patients want to know first.",
    items: [
      {
        title: "Waiting and timing",
        body: "How appointments are scheduled and run.",
        meta: "Timing",
      },
      {
        title: "What it costs",
        body: "Real fees added only when the practice supplies them.",
        meta: "Fees",
      },
      {
        title: "Access and accessibility",
        body: "Directions, parking and accessibility notes.",
        meta: "Access",
      },
    ],
  },
  scenes: [
    "The reception",
    "Consultation room",
    "Care in progress",
    "Aftercare",
  ],
  process: {
    title: "From enquiry to appointment.",
    items: [
      {
        title: "Get in touch",
        body: "Describe the concern and preferred timings.",
        meta: "Step 01",
      },
      {
        title: "Confirm the visit",
        body: "A time is confirmed with the right clinician.",
        meta: "Step 02",
      },
      {
        title: "What to bring",
        body: "Preparation notes sent before the appointment.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Book an appointment.",
    body: "Answer a few practical questions and the practice confirms the right appointment type.",
    label: "Request an appointment",
    secondary: "See the services",
  },
  contact: {
    title: "Reach the practice.",
    body: "Add verified contact numbers, hours and consultation details here.",
  },
  statement: "Clear care, carefully explained.",
  concept: "Information-first healthcare concept",
};

const education: Profile = {
  kind: "education",
  defaultNames: ["HARBOUR ACADEMY", "THE LEARNING ROOM"],
  nouns: ["Academy", "Institute", "School"],
  offer: "Courses & programs",
  offerNoun: "courses",
  audience: "students and parents comparing options carefully",
  intent: "understand the program and how to apply or visit",
  personality: "encouraging and structured",
  priorities: ["Courses", "Faculty", "Outcomes", "Admissions"],
  eyebrow: "Courses · faculty · admissions",
  heroTitles: [
    "A clear path to real competence.",
    "Teaching that explains itself.",
    "A {lead} program built around practice.",
  ],
  heroBodies: [
    "A structured concept that states the curriculum, the teaching approach and how admissions work.",
    "Programs are presented in the order a prospective student actually asks about them.",
  ],
  about: {
    title: "How teaching happens here.",
    body: "The method, the class rhythm and the support around it. Verified faculty and accreditation can be added later.",
  },
  offering: {
    title: "Programs by stage and commitment.",
    body: "Three clear routes rather than a confusing catalogue.",
    items: [
      {
        title: "Foundation course",
        body: "Core skills with structured practice.",
        meta: "Beginner",
      },
      {
        title: "Advanced program",
        body: "Deeper work with project guidance.",
        meta: "Advanced",
      },
      {
        title: "Intensive workshop",
        body: "A focused short program with one outcome.",
        meta: "Short",
      },
    ],
  },
  listing: {
    title: "Course formats side by side.",
    body: "Structure, duration and format — no invented rankings or results.",
    items: [
      {
        title: "On-campus",
        body: "Scheduled classes with in-person support.",
        meta: "Format",
      },
      {
        title: "Hybrid",
        body: "Core classes online with on-site sessions.",
        meta: "Format",
      },
      {
        title: "Online",
        body: "Remote delivery with recorded material.",
        meta: "Format",
      },
    ],
  },
  feature: {
    title: "What a program includes.",
    items: [
      {
        title: "Structured curriculum",
        body: "Each module builds on the last.",
        meta: "Curriculum",
      },
      {
        title: "Practice by default",
        body: "Exercises and feedback, not lectures alone.",
        meta: "Method",
      },
      {
        title: "Progress reviews",
        body: "Regular checkpoints with the teaching team.",
        meta: "Support",
      },
    ],
  },
  scenes: ["The classroom", "Working sessions", "Materials", "Open day"],
  process: {
    title: "From enquiry to enrolment.",
    items: [
      {
        title: "Explore programs",
        body: "Compare formats and prerequisites.",
        meta: "Step 01",
      },
      {
        title: "Talk to the team",
        body: "Ask about fit, timing and preparation.",
        meta: "Step 02",
      },
      {
        title: "Enrol",
        body: "Complete admission and start the program.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Find the right program.",
    body: "Tell us the goal and the time available, and the best fit is suggested honestly.",
    label: "Enquire about admissions",
    secondary: "See the programs",
  },
  contact: {
    title: "Visit or ask a question.",
    body: "Add verified campus address, intake dates and contact details here.",
  },
  statement: "Learning that holds up.",
  concept: "Structured education concept",
};

const realestate: Profile = {
  kind: "realestate",
  defaultNames: ["RIDGELINE PROPERTIES", "THE BASELINE"],
  nouns: ["Properties", "Group", "Advisory"],
  offer: "Listings & services",
  offerNoun: "listings",
  audience: "buyers, sellers and tenants comparing options seriously",
  intent: "browse listings and arrange a viewing or valuation",
  personality: "assured and precise",
  priorities: ["Listings", "Process", "Guidance", "Viewings"],
  eyebrow: "Listings · guidance · viewings",
  heroTitles: [
    "Property decisions, made clearer.",
    "Listings presented without the noise.",
    "A {lead} portfolio, properly described.",
  ],
  heroBodies: [
    "A listing-led concept where each property is described precisely and arranging a viewing takes one step.",
    "Services for buyers, sellers and tenants sit behind the listings rather than in front of them.",
  ],
  about: {
    title: "Local knowledge, stated usefully.",
    body: "How the market is read and what a client should expect. Verified registrations and track record can be added later.",
  },
  offering: {
    title: "Services for each side of the decision.",
    body: "Clear scope for buyers, sellers and tenants.",
    items: [
      {
        title: "Buying support",
        body: "Shortlisting, viewings and negotiation guidance.",
        meta: "Buyers",
      },
      {
        title: "Selling and listing",
        body: "Presentation, positioning and buyer conversations.",
        meta: "Sellers",
      },
      {
        title: "Rentals and management",
        body: "Tenant placement and ongoing management.",
        meta: "Landlords",
      },
    ],
  },
  listing: {
    title: "Listings described properly.",
    body: "Layout, condition and location first — no invented floor areas or prices.",
    items: [
      {
        title: "Property one",
        body: "Replace with verified specification and photography.",
        meta: "For sale",
      },
      {
        title: "Property two",
        body: "A second listing with its real details.",
        meta: "For sale",
      },
      {
        title: "Property three",
        body: "A rental or new development.",
        meta: "Rental",
      },
    ],
  },
  feature: {
    title: "Why the process feels calmer here.",
    items: [
      {
        title: "Straight specifications",
        body: "Facts confirmed before they are published.",
        meta: "Accuracy",
      },
      {
        title: "Guided viewings",
        body: "Appointments arranged around real availability.",
        meta: "Viewings",
      },
      {
        title: "One point of contact",
        body: "The same person from enquiry to close.",
        meta: "Service",
      },
    ],
  },
  scenes: ["The development", "Interior detail", "Neighbourhood", "Views"],
  process: {
    title: "From first enquiry to keys.",
    items: [
      {
        title: "Define the brief",
        body: "Budget, location and priorities clarified.",
        meta: "Step 01",
      },
      {
        title: "Shortlist and view",
        body: "Only relevant properties presented.",
        meta: "Step 02",
      },
      {
        title: "Negotiate and close",
        body: "Documentation and decisions handled carefully.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Arrange a viewing or a valuation.",
    body: "Share the brief and the right next step is confirmed without pressure.",
    label: "Request a viewing",
    secondary: "Browse listings",
  },
  contact: {
    title: "Reach the team.",
    body: "Add verified office details, coverage areas and hours here.",
  },
  statement: "Property, clearly presented.",
  concept: "Listing-led property concept",
};

const automotive: Profile = {
  kind: "automotive",
  defaultNames: ["APEX MOTORS", "THE WORKSHOP"],
  nouns: ["Works", "Motors", "Garage"],
  offer: "Vehicles & service",
  offerNoun: "vehicles",
  audience: "buyers and owners weighing specification against cost",
  intent: "compare the range and book a viewing or service",
  personality: "technical and unembellished",
  priorities: ["Range", "Specification", "Service", "Bookings"],
  eyebrow: "Range · specification · service",
  heroTitles: [
    "Specifications first, sales pitch later.",
    "Machines judged by how they are maintained.",
    "A {lead} range, described accurately.",
  ],
  heroBodies: [
    "A specification-forward concept where the technical detail leads and the commercial conversation follows.",
    "Inventory, servicing and bookings are organised around how owners actually use the site.",
  ],
  about: {
    title: "How the workshop operates.",
    body: "Preparation standards, inspection process and aftercare. Verified certifications and history can be added later.",
  },
  offering: {
    title: "Service work, itemised honestly.",
    body: "What each service covers without invented turnaround promises.",
    items: [
      {
        title: "Routine servicing",
        body: "Scheduled maintenance and fluid changes.",
        meta: "Scheduled",
      },
      {
        title: "Diagnostics",
        body: "Fault finding before any work is quoted.",
        meta: "Analysis",
      },
      {
        title: "Detailing",
        body: "Interior and exterior preparation.",
        meta: "Finish",
      },
    ],
  },
  listing: {
    title: "The current range.",
    body: "Specification, condition and history — added only when verified.",
    items: [
      {
        title: "Vehicle one",
        body: "Replace with the real specification and mileage.",
        meta: "Available",
      },
      {
        title: "Vehicle two",
        body: "A second unit with accurate detail.",
        meta: "Available",
      },
      {
        title: "Vehicle three",
        body: "A third listing or an incoming unit.",
        meta: "Incoming",
      },
    ],
  },
  feature: {
    title: "What owners care about.",
    items: [
      {
        title: "Inspection records",
        body: "Documented checks before a vehicle is offered.",
        meta: "Evidence",
      },
      {
        title: "Transparent work",
        body: "Approval before any additional work begins.",
        meta: "Trust",
      },
      {
        title: "Parts and continuity",
        body: "Sourcing and availability discussed honestly.",
        meta: "Support",
      },
    ],
  },
  scenes: ["In the bay", "Detail work", "The lot", "On the road"],
  process: {
    title: "Booking work or a viewing.",
    items: [
      {
        title: "Describe the need",
        body: "Vehicle, symptom or requirement.",
        meta: "Step 01",
      },
      {
        title: "Get an assessment",
        body: "Scope and options explained before work.",
        meta: "Step 02",
      },
      {
        title: "Confirm a slot",
        body: "Appointment scheduled around availability.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Book a viewing or a service slot.",
    body: "Share the requirement and the team confirms what is possible and when.",
    label: "Book an appointment",
    secondary: "See the range",
  },
  contact: {
    title: "Find the workshop.",
    body: "Add verified address, opening hours and contact details here.",
  },
  statement: "Maintained properly, described honestly.",
  concept: "Specification-led automotive concept",
};

const events: Profile = {
  kind: "events",
  defaultNames: ["ATELIER EVENTS", "THE GATHERING CO"],
  nouns: ["Atelier", "Collective", "Company"],
  offer: "Celebrations & planning",
  offerNoun: "celebrations",
  audience: "couples and hosts planning something significant",
  intent: "see the standard of work and start a planning conversation",
  personality: "warm and exacting",
  priorities: ["Celebrations", "Planning", "Gallery", "Enquiries"],
  eyebrow: "Celebrations · planning · gallery",
  heroTitles: [
    "Occasions handled with real care.",
    "Every detail decided in advance.",
    "A {lead} celebration, quietly orchestrated.",
  ],
  heroBodies: [
    "A gallery-led concept where the standard of work is evident and the planning conversation feels easy to begin.",
    "Timelines, responsibilities and costs are discussed in person rather than promised on a page.",
  ],
  about: {
    title: "Planning, without the chaos.",
    body: "How a celebration is scoped, sequenced and delivered. Verified client references can be added later.",
  },
  offering: {
    title: "How planning is scoped.",
    body: "Levels of involvement rather than fixed packages.",
    items: [
      {
        title: "Full planning",
        body: "Concept, suppliers and delivery managed end to end.",
        meta: "Complete",
      },
      {
        title: "Partial planning",
        body: "Support on the parts that need it most.",
        meta: "Flexible",
      },
      {
        title: "Day coordination",
        body: "On-the-day management of an existing plan.",
        meta: "Timeline",
      },
    ],
  },
  listing: {
    title: "Celebrations by scale.",
    body: "Guest scale, format and setting discussed before any numbers are published.",
    items: [
      {
        title: "Intimate gathering",
        body: "A smaller celebration held with focus.",
        meta: "Intimate",
      },
      {
        title: "Full celebration",
        body: "A complete day with a managed timeline.",
        meta: "Full day",
      },
      {
        title: "Multi-day event",
        body: "Several linked occasions over a weekend.",
        meta: "Extended",
      },
    ],
  },
  feature: {
    title: "What a planner actually does.",
    items: [
      {
        title: "Timeline ownership",
        body: "Every decision mapped to a date.",
        meta: "Planning",
      },
      {
        title: "Supplier coordination",
        body: "One point of contact for all vendors.",
        meta: "Coordination",
      },
      {
        title: "Budget discipline",
        body: "Spending tracked against agreed priorities.",
        meta: "Budget",
      },
    ],
  },
  scenes: ["Ceremony", "Table detail", "Evening light", "Preparation"],
  process: {
    title: "From first conversation to celebration.",
    items: [
      {
        title: "Share the vision",
        body: "Scale, feeling and non-negotiables.",
        meta: "Step 01",
      },
      {
        title: "Plan the detail",
        body: "Timeline, suppliers and budget agreed.",
        meta: "Step 02",
      },
      {
        title: "Deliver the day",
        body: "Managed quietly in the background.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Tell us what you are imagining.",
    body: "Share the date, the scale and the feeling you want, and the next conversation follows.",
    label: "Start planning",
    secondary: "View the gallery",
  },
  contact: {
    title: "Let us talk about your date.",
    body: "Add verified contact details, service areas and availability here.",
  },
  statement: "Occasions, handled properly.",
  concept: "Gallery-led celebration studio",
};

const logistics: Profile = {
  kind: "logistics",
  defaultNames: ["DIRECT LINE LOGISTICS", "TRUE ROUTE"],
  nouns: ["Logistics", "Freight", "Movement"],
  offer: "Capacity & routes",
  offerNoun: "routes",
  audience: "operations teams comparing reliability and coverage",
  intent: "understand coverage, capacity and how to open an account",
  personality: "factual and dependable",
  priorities: ["Coverage", "Capacity", "Tracking", "Contact"],
  eyebrow: "Coverage · capacity · tracking",
  heroTitles: [
    "Movement you can plan around.",
    "Coverage stated before anything is promised.",
    "A {lead} operation, run on schedule.",
  ],
  heroBodies: [
    "An operations-first concept where coverage, capacity and service levels are stated plainly.",
    "Tracking, documentation and escalation paths are clear for the people who actually run the shipments.",
  ],
  about: {
    title: "An operation built on predictability.",
    body: "How routes are planned, how exceptions are handled and who owns what. Verified licences and coverage can be added later.",
  },
  offering: {
    title: "Services by lane and speed.",
    body: "Clear definitions rather than vague promises.",
    items: [
      {
        title: "Standard movement",
        body: "Scheduled transport on defined lanes.",
        meta: "Scheduled",
      },
      {
        title: "Time-critical",
        body: "Expedited handling for urgent consignments.",
        meta: "Priority",
      },
      {
        title: "Contract logistics",
        body: "Dedicated capacity for regular volume.",
        meta: "Contracted",
      },
    ],
  },
  listing: {
    title: "Coverage by mode.",
    body: "Modes and regions, with real transit times added by the operator.",
    items: [
      {
        title: "Road",
        body: "Regional and long-haul movement by road.",
        meta: "Surface",
      },
      { title: "Air", body: "Time-critical consignments by air.", meta: "Air" },
      {
        title: "Warehousing",
        body: "Short and long-term storage support.",
        meta: "Storage",
      },
    ],
  },
  feature: {
    title: "What operators ask about first.",
    items: [
      {
        title: "Visibility",
        body: "Status and exception reporting during transit.",
        meta: "Tracking",
      },
      {
        title: "Documentation",
        body: "Paperwork handled correctly the first time.",
        meta: "Compliance",
      },
      {
        title: "Escalation path",
        body: "A named contact when timing slips.",
        meta: "Support",
      },
    ],
  },
  scenes: ["Loading bay", "In transit", "Warehouse", "Delivery"],
  process: {
    title: "Opening an account.",
    items: [
      {
        title: "Share the lanes",
        body: "Routes, volume and timing requirements.",
        meta: "Step 01",
      },
      {
        title: "Agree the terms",
        body: "Capacity, service levels and pricing structure.",
        meta: "Step 02",
      },
      {
        title: "Start moving",
        body: "First consignments monitored closely.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Talk to operations.",
    body: "Give us the lanes and volumes and we will confirm what is realistic.",
    label: "Request a quote",
    secondary: "See the coverage",
  },
  contact: {
    title: "Reach the control desk.",
    body: "Add verified depot addresses, hours and operational contacts here.",
  },
  statement: "On time, in writing.",
  concept: "Operations-led logistics concept",
};

const nonprofit: Profile = {
  kind: "nonprofit",
  defaultNames: ["THE OPEN FUND", "GROUNDWORK TRUST"],
  nouns: ["Trust", "Foundation", "Initiative"],
  offer: "Programmes",
  offerNoun: "programmes",
  audience: "donors, volunteers and the communities being served",
  intent: "understand the mission and get involved",
  personality: "warm and transparent",
  priorities: ["Mission", "Programmes", "Impact", "Get involved"],
  eyebrow: "Mission · programmes · involvement",
  heroTitles: [
    "Work that adds up honestly.",
    "Clear about what we do, and what we do not.",
    "A {lead} mission, reported openly.",
  ],
  heroBodies: [
    "A mission-led concept that explains the work plainly, states the reporting standard and makes involvement easy.",
    "Programmes, geography and governance are placed before any appeal for support.",
  ],
  about: {
    title: "Why this work, and how it is run.",
    body: "Purpose, scope and governance described accurately. Verified registrations, trustees and accounts belong here.",
  },
  offering: {
    title: "Programmes by focus.",
    body: "What each programme covers and where it operates.",
    items: [
      {
        title: "Direct programme",
        body: "Front-line work with the community it serves.",
        meta: "Field",
      },
      {
        title: "Partnerships",
        body: "Work delivered with local organisations.",
        meta: "Partners",
      },
      {
        title: "Awareness and advocacy",
        body: "Changing the conditions around the issue.",
        meta: "Advocacy",
      },
    ],
  },
  listing: {
    title: "Ways to be involved.",
    body: "Contributions and volunteering described without pressure or invented impact figures.",
    items: [
      {
        title: "Give",
        body: "One-time or regular support for the programmes.",
        meta: "Support",
      },
      {
        title: "Volunteer",
        body: "Time, skills and on-the-ground help.",
        meta: "Time",
      },
      {
        title: "Partner",
        body: "Organisations working in the same areas.",
        meta: "Partner",
      },
    ],
  },
  feature: {
    title: "How the organisation is accountable.",
    items: [
      {
        title: "Published reporting",
        body: "Spending reported against each programme.",
        meta: "Transparency",
      },
      {
        title: "Defined geography",
        body: "Where the work happens, stated precisely.",
        meta: "Scope",
      },
      {
        title: "Named governance",
        body: "Responsibility rests with identifiable people.",
        meta: "Accountable",
      },
    ],
  },
  scenes: ["In the field", "The team", "Community", "Programme work"],
  process: {
    title: "How support becomes work.",
    items: [
      {
        title: "Choose a programme",
        body: "Understand the focus and geography.",
        meta: "Step 01",
      },
      {
        title: "Give or volunteer",
        body: "Contribute time, skills or funding.",
        meta: "Step 02",
      },
      {
        title: "See the reporting",
        body: "Results published on a regular cycle.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Get involved.",
    body: "Choose how you want to contribute and the first step is a single message.",
    label: "Get involved",
    secondary: "See the programmes",
  },
  contact: {
    title: "Talk to the team.",
    body: "Add verified registration details, office contacts and volunteering routes here.",
  },
  statement: "Transparent by default.",
  concept: "Mission-led nonprofit concept",
};

const agriculture: Profile = {
  kind: "agriculture",
  defaultNames: ["FIELDSIDE FARM", "THE HARVEST ROOM"],
  nouns: ["Farm", "Estate", "Fields"],
  offer: "Produce & supply",
  offerNoun: "produce",
  audience: "buyers and households who care where produce comes from",
  intent: "understand what is grown and how to buy or visit",
  personality: "grounded and specific",
  priorities: ["Produce", "Practices", "Supply", "Visits"],
  eyebrow: "Produce · practices · supply",
  heroTitles: [
    "Grown here, described honestly.",
    "Produce that can name its own field.",
    "A {lead} harvest, handled properly.",
  ],
  heroBodies: [
    "An origins-first concept where growing practices, seasons and supply are all stated plainly.",
    "Produce, availability windows and ordering routes are organised the way buyers actually ask.",
  ],
  about: {
    title: "How the land is worked.",
    body: "Practices, inputs and seasonality described accurately. Verified certifications and land details can be added later.",
  },
  offering: {
    title: "What is grown, by season.",
    body: "Availability windows rather than all-year promises.",
    items: [
      {
        title: "Field produce",
        body: "Seasonal vegetables grown on the farm.",
        meta: "Seasonal",
      },
      {
        title: "Orchard fruit",
        body: "Fruit harvested in defined windows.",
        meta: "Harvest",
      },
      {
        title: "Value-added goods",
        body: "Preserves and processed products.",
        meta: "Processed",
      },
    ],
  },
  listing: {
    title: "Ways to buy.",
    body: "Direct, wholesale or seasonal box — with real terms added by the farm.",
    items: [
      {
        title: "Farm direct",
        body: "Collection or delivery from the farm.",
        meta: "Direct",
      },
      {
        title: "Wholesale supply",
        body: "Regular volume for kitchens and stores.",
        meta: "Wholesale",
      },
      {
        title: "Seasonal box",
        body: "A changing selection, packaged weekly.",
        meta: "Box",
      },
    ],
  },
  feature: {
    title: "What buyers want to verify.",
    items: [
      {
        title: "Growing practices",
        body: "Inputs and methods described clearly.",
        meta: "Method",
      },
      {
        title: "Harvest windows",
        body: "Honest availability through the year.",
        meta: "Season",
      },
      {
        title: "Traceability",
        body: "Where each product came from.",
        meta: "Origin",
      },
    ],
  },
  scenes: ["The fields", "Harvest morning", "Packing shed", "Produce detail"],
  process: {
    title: "How to buy from the farm.",
    items: [
      {
        title: "See what is in season",
        body: "Availability updated through the year.",
        meta: "Step 01",
      },
      {
        title: "Choose a route",
        body: "Direct, wholesale or a seasonal box.",
        meta: "Step 02",
      },
      {
        title: "Arrange supply",
        body: "Volumes and delivery agreed directly.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Ask about the current harvest.",
    body: "Tell us what you need and when, and the farm confirms what is actually available.",
    label: "Enquire about supply",
    secondary: "See the produce",
  },
  contact: {
    title: "Visit or arrange supply.",
    body: "Add verified farm address, opening hours and supply contacts here.",
  },
  statement: "In season, honestly.",
  concept: "Origins-first farm concept",
};

const personal: Profile = {
  kind: "personal",
  defaultNames: ["PERSONAL PRACTICE", "THE NOTEBOOK"],
  nouns: ["Practice", "Work", "Studio"],
  offer: "Work & services",
  offerNoun: "work",
  audience: "people deciding whether to work with one specific person",
  intent: "understand the approach and start a conversation",
  personality: "direct and personable",
  priorities: ["Approach", "Services", "Proof", "Contact"],
  eyebrow: "Approach · services · contact",
  heroTitles: [
    "Work done by one person, on purpose.",
    "A clear point of view, applied carefully.",
    "A {lead} practice, kept deliberately small.",
  ],
  heroBodies: [
    "A person-led concept where the approach is stated plainly and the work is shown without padding.",
    "Services, examples and a direct contact route sit in the order a prospective client asks for them.",
  ],
  about: {
    title: "Why this, and why now.",
    body: "The working philosophy in a few honest sentences. Verified biography, credentials and clients can replace this later.",
  },
  offering: {
    title: "Ways to work together.",
    body: "A small number of clear engagements.",
    items: [
      {
        title: "Advisory session",
        body: "A focused conversation on one problem.",
        meta: "Single",
      },
      {
        title: "Project engagement",
        body: "A defined piece of work with an end point.",
        meta: "Project",
      },
      {
        title: "Ongoing collaboration",
        body: "Continued involvement over time.",
        meta: "Ongoing",
      },
    ],
  },
  listing: {
    title: "Selected work.",
    body: "Examples framed by the problem and the contribution.",
    items: [
      {
        title: "Project one",
        body: "Replace with real work and its outcome.",
        meta: "Case",
      },
      {
        title: "Project two",
        body: "A different problem, a different approach.",
        meta: "Case",
      },
      {
        title: "Project three",
        body: "A short collaboration worth showing.",
        meta: "Case",
      },
    ],
  },
  feature: {
    title: "How working together goes.",
    items: [
      {
        title: "Direct contact",
        body: "No account managers in between.",
        meta: "Direct",
      },
      {
        title: "Small scope, done well",
        body: "Clear boundaries agreed at the start.",
        meta: "Focused",
      },
      {
        title: "Written thinking",
        body: "Recommendations delivered in writing.",
        meta: "Recorded",
      },
    ],
  },
  scenes: ["At work", "Notes and drafts", "The desk", "In conversation"],
  process: {
    title: "Starting a collaboration.",
    items: [
      {
        title: "A short exchange",
        body: "Understand the problem and the context.",
        meta: "Step 01",
      },
      {
        title: "Agree the scope",
        body: "Deliverables, timing and cost confirmed.",
        meta: "Step 02",
      },
      {
        title: "Do the work",
        body: "Regular checkpoints until handover.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Start a conversation.",
    body: "Describe the problem in a couple of sentences and the reply says honestly whether it is a good fit.",
    label: "Get in touch",
    secondary: "See the work",
  },
  contact: {
    title: "Best way to reach me.",
    body: "Add verified email, working hours and availability here.",
  },
  statement: "Small, deliberate, done properly.",
  concept: "Person-led practice concept",
};

const generic: Profile = {
  kind: "generic",
  defaultNames: ["PLAINVIEW", "THE PRACTICE"],
  nouns: ["Company", "Studio", "Practice"],
  offer: "What we offer",
  offerNoun: "offer",
  audience: "visitors deciding whether this is relevant to them",
  intent: "understand the offer and take one clear next step",
  personality: "clear and unfussy",
  priorities: ["Offer", "Proof", "Details", "Contact"],
  eyebrow: "Offer · details · contact",
  heroTitles: [
    "A {lead} website built around clarity.",
    "The offer, stated plainly.",
    "One clear path from interest to enquiry.",
  ],
  heroBodies: [
    "A deliberately neutral concept that organises the description into a clear offer, supporting detail and one obvious action.",
    "Structure and hierarchy do the work here, so the site reads as specific rather than generic once real content arrives.",
  ],
  about: {
    title: "What this business is for.",
    body: "A placeholder for the verified purpose, people and history behind the business.",
  },
  offering: {
    title: "The offer, grouped clearly.",
    body: "Three routes for the three most common visitor needs.",
    items: [
      {
        title: "Primary offering",
        body: "Replace with the most important thing you provide.",
        meta: "Featured",
      },
      {
        title: "Supporting offering",
        body: "A second route for a different need.",
        meta: "Also",
      },
      {
        title: "Specialist work",
        body: "Something narrower for a specific audience.",
        meta: "Specialist",
      },
    ],
  },
  listing: {
    title: "Options, side by side.",
    body: "Scope and format made comparable without invented detail.",
    items: [
      {
        title: "Entry option",
        body: "The simplest way to begin.",
        meta: "Start",
      },
      {
        title: "Standard option",
        body: "The most common choice.",
        meta: "Common",
      },
      {
        title: "Extended option",
        body: "More scope where it is needed.",
        meta: "Full",
      },
    ],
  },
  feature: {
    title: "What the site makes clear.",
    items: genericFeature("offer"),
  },
  scenes: ["In context", "A closer look", "In use", "Behind the scenes"],
  process: {
    title: "How to get started.",
    items: [
      {
        title: "Look around",
        body: "Understand what is available.",
        meta: "Step 01",
      },
      {
        title: "Ask a question",
        body: "A direct route to a real answer.",
        meta: "Step 02",
      },
      {
        title: "Move forward",
        body: "The next step confirmed in writing.",
        meta: "Step 03",
      },
    ],
  },
  cta: {
    title: "Take the next step.",
    body: "One clear action, with the details confirmed in a short conversation.",
    label: "Get in touch",
    secondary: "Learn more",
  },
  contact: {
    title: "Contact",
    body: "Add verified contact details, hours and location before publishing.",
  },
  statement: "Clear by design.",
  concept: "Clarity-first business concept",
};

export const profiles: Record<BusinessCategory, Profile> = {
  hospitality,
  travel,
  food,
  retail,
  fashion,
  professional,
  technology,
  creative,
  fitness,
  wellness,
  healthcare,
  education,
  realestate,
  automotive,
  events,
  logistics,
  nonprofit,
  agriculture,
  personal,
  generic,
  // Categories without a bespoke bank reuse the closest commercial voice.
  beauty: { ...wellness, kind: "beauty", concept: "Serene beauty concept" },
};

/**
 * Words that describe how a website should look, how the visitor phrased the
 * request, or the delivery itself. They must never leak into the copy as if
 * they described the business ("A I Run method you can actually keep").
 */
const leadNoise = new Set([
  "premium",
  "luxury",
  "modern",
  "elegant",
  "best",
  "new",
  "creative",
  "professional",
  "boutique",
  "great",
  "leading",
  "top",
  "nice",
  "good",
  "unique",
  "innovative",
  "quality",
  "simple",
  "clean",
  "minimal",
  "bold",
  "bright",
  "warm",
  "cool",
  "cosy",
  "cozy",
  "cinematic",
  "futuristic",
  "playful",
  "sophisticated",
  "friendly",
  "editorial",
  "trendy",
  "stylish",
  "exclusive",
  "typography",
  "photography",
  "website",
  "web",
  "site",
  "design",
  "layout",
  "animation",
  "animations",
  "colour",
  "colours",
  "color",
  "colors",
  "palette",
  "high-energy",
  "energetic",
  "run",
  "running",
  "own",
  "operate",
  "manage",
  "need",
  "want",
  "have",
  "help",
  "sell",
  "offer",
  "provide",
  "launch",
  "build",
  "make",
  "sell",
  "looking",
  "based",
  "focused",
  "driven",
  "style",
  "studio",
  "i",
  "we",
  "our",
  "my",
]);

/**
 * A short, honest descriptor taken from the visitor's own words, or nothing at
 * all. Style and framing words are dropped so templates stay grammatical.
 */
function descriptiveLead(terms: PromptTerms): string {
  if (!terms.lead) return "";
  const kept = terms.lead
    .split(/\s+/)
    .filter((word) => word && !leadNoise.has(word.toLowerCase()))
    .slice(-2);
  return kept.join(" ");
}

function slots(profile: Profile, terms: PromptTerms) {
  const lead = descriptiveLead(terms);
  return {
    "{lead}": lead,
    "{L}": lead,
    "{place}": terms.place,
    "{offer}": profile.offer,
    "{offerNoun}": profile.offerNoun,
    "{audience}": profile.audience,
  } satisfies Record<string, string>;
}

function fill(template: string, values: Record<string, string>): string {
  let output = template;
  for (const [token, value] of Object.entries(values)) {
    output = output.split(token).join(value);
  }
  output = output
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+·\s+·/g, " ·")
    .trim();
  return output.replace(/^[·,;:\-\s]+/, "").trim();
}

export type SiteCopy = {
  name: string;
  descriptor: string;
  offer: string;
  audience: string;
  intent: string;
  personality: string;
  priorities: string[];
  concept: string;
  ctaLabel: string;
  ctaSecondary: string;
  footerStatement: string;
  conceptLabel: string;
  mobileSimplification: string[];
};

const quotedName = (prompt: string): string => {
  const match = prompt.match(/[“"']([A-Za-z][^”"']{2,38})[”"']/);
  return match?.[1] ? match[1].trim().toUpperCase() : "";
};

/**
 * Brand naming.
 *
 * A name only comes from the visitor when they actually state one — in quotes,
 * the way people quote a business name. Everything else uses the category's
 * curated concept names, because a descriptor lifted out of a sentence
 * ("Premium Luxury", "I Run") is never a brand.
 */
export function buildSiteCopy(
  profile: Profile,
  terms: PromptTerms,
  variation: number,
): SiteCopy {
  const values = slots(profile, terms);
  const statedName = quotedName(terms.prompt);
  const curatedName =
    profile.defaultNames[
      Math.max(0, variation) % profile.defaultNames.length
    ] ?? "NEW PROJECT";
  const name = statedName || curatedName;
  const place = terms.place ? ` near ${terms.place}` : "";
  return {
    name,
    descriptor: fill(
      `A ${profile.concept.toLowerCase()}${place} — a premium concept website shaped from the visitor's description and ready for verified content.`,
      values,
    ),
    offer: profile.offer,
    audience: profile.audience,
    intent: profile.intent,
    personality: profile.personality,
    priorities: profile.priorities,
    concept: profile.concept,
    ctaLabel: profile.cta.label,
    ctaSecondary: profile.cta.secondary,
    footerStatement: profile.statement,
    conceptLabel: `${profile.concept}`,
    mobileSimplification: [
      "Condense the hero",
      "Stack sections",
      "One clear action",
    ],
  };
}

export type SectionCopy = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  items: Pair[];
  stats: { value: string; label: string }[];
  note: string;
};

const conceptNote =
  "Concept website — details can be tailored to the real business.";

const numberWords = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty",
];

/**
 * When a visitor states how many rooms or keys the property has, the hero says
 * it back in their own terms instead of using a generic line.
 */
function roomCountLine(prompt: string): string {
  const match = prompt.match(/\b(\d{1,3})\s*(?:rooms|suites|bedrooms|keys)\b/i);
  const count = match?.[1] ? Number(match[1]) : Number.NaN;
  if (!Number.isFinite(count) || count < 2 || count > 99) return "";
  const spelled = numberWords[count] ?? String(count);
  const view = /mountain|hill|valley|ridge|himalaya/i.test(prompt)
    ? "long mountain views"
    : /sea|ocean|coast|beach|lake/i.test(prompt)
      ? "open water views"
      : "quiet, open views";
  return `${spelled} considered rooms, ${view} and unhurried dining — shaped into a stay that feels removed, yet easy to reach.`;
}

function pick<T>(list: readonly T[], seed: number, offset = 0): T {
  return list[Math.abs(seed + offset * 7919) % list.length]!;
}

export function buildSectionCopy(
  profile: Profile,
  blueprint: CreativeBlueprint,
  planned: PlannedSection,
  index: number,
  terms: PromptTerms,
): SectionCopy {
  const values = slots(profile, terms);
  const seed = terms.seed + index * 31;
  const base: SectionCopy = {
    eyebrow: "",
    title: "",
    body: "",
    primaryCta: "",
    secondaryCta: "",
    items: [],
    stats: [],
    note: "",
  };

  if (planned.type === "hero") {
    // The signature headline leads the first version; variations rotate copy.
    const title = fill(profile.heroTitles[0]!, values);
    const statedRooms =
      profile.kind === "hotel" ? roomCountLine(terms.prompt) : "";
    return {
      ...base,
      eyebrow: fill(profile.eyebrow, values),
      title: title || profile.heroTitles[0]!,
      body: statedRooms || fill(pick(profile.heroBodies, seed, 1), values),
      primaryCta: blueprint.cta.label,
      secondaryCta: blueprint.cta.secondary,
      note: conceptNote,
    };
  }

  if (planned.type === "about") {
    if (
      planned.variant === "manifesto-statement" ||
      planned.variant === "minimal-intro"
    ) {
      return {
        ...base,
        eyebrow: "Point of view",
        title: profile.statement,
        body: profile.about.body,
      };
    }
    return {
      ...base,
      eyebrow: fill("About", values),
      title: fill(profile.about.title, values),
      body: profile.about.body,
      items:
        planned.variant === "values" || planned.variant === "values-grid"
          ? profile.priorities.slice(0, 4).map((priority, position) => ({
              title: priority,
              body: `Given a dedicated place in this concept.`,
              meta: "Priority",
              accent: String(position + 1).padStart(2, "0"),
            }))
          : [],
      note:
        planned.variant === "founder-story" ||
        planned.variant === "founder-profile"
          ? "Add the verified story, people and credentials behind the business."
          : "",
    };
  }

  if (planned.type === "services") {
    // Categories whose services step *is* the signature offering (a hotel's
    // restaurant, a café's menu) keep the offering bank rather than process copy.
    if (
      (planned.variant === "process-steps" ||
        planned.variant === "numbered-narrative") &&
      !profile.offering.eyebrow
    ) {
      return {
        ...base,
        eyebrow: "How it works",
        title: fill(profile.process.title, values),
        items: profile.process.items.map((item, position) => ({
          ...item,
          accent: String(position + 1).padStart(2, "0"),
        })),
      };
    }
    if (planned.variant === "catalogue-list") {
      return {
        ...base,
        eyebrow: profile.offering.eyebrow ?? fill(profile.offer, values),
        title: fill(profile.offering.title, values),
        body: profile.offering.body,
        items: profile.offering.items.map((item, position) => ({
          ...item,
          accent: String(position + 1).padStart(2, "0"),
        })),
      };
    }
    if (planned.variant === "capability-columns") {
      return {
        ...base,
        eyebrow: profile.offering.eyebrow ?? "Capabilities",
        title: fill(`What the ${profile.offerNoun} actually cover`, values),
        body: profile.offering.body,
        items: profile.offering.items.map((item, position) => ({
          ...item,
          accent: String(position + 1).padStart(2, "0"),
        })),
      };
    }
    return {
      ...base,
      eyebrow: profile.offering.eyebrow ?? fill(profile.offer, values),
      title: fill(profile.offering.title, values),
      body: profile.offering.body,
      items: profile.offering.items.map((item, position) => ({
        ...item,
        accent: String(position + 1).padStart(2, "0"),
      })),
    };
  }

  if (planned.type === "listings") {
    if (planned.variant === "comparison" || planned.variant === "index-list") {
      return {
        ...base,
        eyebrow: profile.listing.eyebrow ?? "Options",
        title: fill(profile.listing.title, values),
        body: profile.listing.body,
        items: profile.listing.items.map((item, position) => ({
          ...item,
          accent: `0${position + 1}`.slice(-2),
        })),
      };
    }
    return {
      ...base,
      eyebrow: profile.listing.eyebrow ?? "Featured",
      title: fill(profile.listing.title, values),
      body: profile.listing.body,
      items: profile.listing.items.map((item, position) => ({
        ...item,
        accent: `0${position + 1}`.slice(-2),
      })),
    };
  }

  if (planned.type === "features") {
    if (planned.variant === "stats-band") {
      return {
        ...base,
        eyebrow: "Priorities",
        title: "What this concept puts first.",
        body: "",
        stats: profile.priorities.slice(0, 4).map((priority, position) => ({
          value: `0${position + 1}`.slice(-2),
          label: priority,
        })),
      };
    }
    if (planned.variant === "faq-list") {
      return {
        ...base,
        eyebrow: "Questions",
        title: "What visitors ask before they enquire.",
        items: [
          {
            title: "How do we start?",
            body: "Add the verified answer to this question before publishing.",
            meta: "01",
          },
          {
            title: "What does it cost?",
            body: "Pricing is confirmed directly rather than published as a placeholder.",
            meta: "02",
          },
          {
            title: "What happens after we get in touch?",
            body: "The real process, step by step, once confirmed by the business.",
            meta: "03",
          },
          {
            title: "How long does it take?",
            body: "Timelines are supplied by the business, never invented here.",
            meta: "04",
          },
        ],
      };
    }
    if (planned.variant === "process-timeline") {
      return {
        ...base,
        eyebrow: "Process",
        title: fill(profile.process.title, values),
        items: profile.process.items.map((item, position) => ({
          ...item,
          accent: String(position + 1).padStart(2, "0"),
        })),
      };
    }
    if (planned.variant === "manifesto") {
      return {
        ...base,
        eyebrow: "Position",
        title: profile.statement,
        body: profile.about.body,
      };
    }
    if (planned.variant === "comparison-table") {
      return {
        ...base,
        eyebrow: "Comparison",
        title: "How the options differ.",
        body: "",
        items: profile.listing.items.map((item, position) => ({
          title: item.title,
          body: item.body,
          meta: position === 0 ? "Entry" : position === 1 ? "Common" : "Full",
          accent: `0${position + 1}`.slice(-2),
        })),
      };
    }
    if (planned.variant === "trust-band") {
      return {
        ...base,
        eyebrow: "Accountability",
        title: "What this site does and does not claim.",
        items: [
          {
            title: "No invented proof",
            body: "Ratings, awards and testimonials are added only when verified.",
            meta: "Honest",
          },
          {
            title: "Verified details only",
            body: "Prices, addresses and timelines come from the business.",
            meta: "Accurate",
          },
          {
            title: "Built to be completed",
            body: "Placeholders are structured to be replaced, not hidden.",
            meta: "Practical",
          },
        ],
      };
    }
    return {
      ...base,
      eyebrow: "Details",
      title: fill(profile.feature.title, values),
      items: profile.feature.items.map((item, position) => ({
        ...item,
        accent: String(position + 1).padStart(2, "0"),
      })),
    };
  }

  if (planned.type === "gallery") {
    const count =
      planned.variant === "gallery-strip" ||
      planned.variant === "horizontal-gallery"
        ? 6
        : planned.variant === "full-bleed"
          ? 2
          : planned.variant === "bento-mosaic" ||
              planned.variant === "art-collage"
            ? 5
            : 4;
    const items: Pair[] = [];
    for (let position = 0; position < count; position += 1) {
      const scene = profile.scenes[position % profile.scenes.length]!;
      items.push({
        title:
          position < profile.scenes.length
            ? fill(scene, values)
            : fill(
                `${scene} · ${terms.place || profile.offerNoun}`.trim(),
                values,
              ),
        body: "",
        meta: position % 2 === 0 ? fill(profile.offer, values) : "Detail",
        accent: `0${position + 1}`.slice(-2),
      });
    }
    return {
      ...base,
      eyebrow: "Gallery",
      title: fill(
        profile.scenes[Math.abs(seed) % profile.scenes.length]!,
        values,
      ),
      body: "An art-directed gallery treatment gives the concept atmosphere while remaining clearly conceptual.",
      items,
    };
  }

  if (planned.type === "testimonials") {
    return {
      ...base,
      eyebrow: "Words from real people",
      title: "Proof belongs here, once it is verified.",
      body: "This is a placeholder. No review, rating or testimonial is invented for a concept.",
      items: [
        {
          title: "Awaiting a verified quote",
          body: "Add an approved quote with a real name and context before publishing.",
          meta: "Requires verification",
          accent: "Quote",
        },
      ],
    };
  }

  if (planned.type === "cta") {
    const concierge = blueprint.cta.character === "concierge";
    return {
      ...base,
      eyebrow: concierge ? "By appointment" : "Next step",
      title: fill(profile.cta.title, values),
      body: concierge
        ? "A gentle, direct route to a conversation — nothing aggressive."
        : profile.cta.body,
      primaryCta: profile.cta.label,
      secondaryCta: profile.cta.secondary,
    };
  }

  return {
    ...base,
    eyebrow: "Contact",
    title: fill(profile.contact.title, values),
    body: profile.contact.body,
    primaryCta: profile.cta.label,
    items: [
      {
        title: "Direct enquiries",
        body: `The fastest route to a real conversation about the ${profile.offerNoun}.`,
        meta: "Contact",
        accent: "01",
      },
      {
        title: "Location and hours",
        body: "Verified address and opening times are added before publishing.",
        meta: "Visit",
        accent: "02",
      },
    ],
  };
}
