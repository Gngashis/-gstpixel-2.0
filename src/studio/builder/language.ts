/**
 * Prompt language layer for Website Studio.
 *
 * Visitors type quickly on phones: typos, missing words, colloquial Indian
 * English and mixed phrasing are normal. This module canonicalises that text
 * before any business reasoning happens, and detects the case where one
 * description actually contains several different businesses.
 *
 * It is pure and deterministic — no randomness, no network, no storage — so it
 * can run on the server, in the Studio, and in tests with identical results.
 */

/** Shortest description the Studio will generate from. */
export const STUDIO_PROMPT_MIN = 10;
/** Longest description the homepage quick-start accepts. */
export const STUDIO_PROMPT_MAX = 600;
/** Longest description the Studio's own composer accepts. */
export const STUDIO_PROMPT_COMPOSER_MAX = 1200;

/**
 * Frequent misspellings and Indian-English short forms seen in real prompts.
 * Keys are canonicalised (lowercase, no surrounding punctuation).
 */
const tokenCorrections: Record<string, string> = {
  // clothing / fashion
  clother: "clothes",
  cloths: "clothes",
  clothe: "clothes",
  clothhing: "clothing",
  clothng: "clothing",
  clothingg: "clothing",
  ware: "wear",
  apperals: "apparel",
  bourtique: "boutique",
  bootique: "boutique",
  jewellry: "jewellery",
  jewelery: "jewellery",
  jewlery: "jewellery",
  jwellery: "jewellery",
  jwelery: "jewellery",
  ornaments: "jewellery",
  // food / hospitality
  resturant: "restaurant",
  restraunt: "restaurant",
  resaurant: "restaurant",
  resturent: "restaurant",
  restaurent: "restaurant",
  restro: "restaurant",
  resturants: "restaurants",
  caf: "cafe",
  cofee: "coffee",
  coffe: "coffee",
  caffe: "cafe",
  bakary: "bakery",
  bakry: "bakery",
  hotelss: "hotels",
  hotal: "hotel",
  resortt: "resort",
  guesthouse: "guesthouse",
  // health / supplements
  protien: "protein",
  protiens: "protein",
  protine: "protein",
  vitimin: "vitamin",
  vitimins: "vitamin",
  vitamines: "vitamin",
  multivitimins: "multivitamin",
  multivitamines: "multivitamin",
  nutritionns: "nutrition",
  nutritionals: "nutrition",
  supliments: "supplements",
  suppliments: "supplements",
  supplementss: "supplements",
  suppliment: "supplement",
  wheyprotien: "whey protein",
  massgainer: "mass gainer",
  nutrotion: "nutrition",
  // healthcare
  denal: "dental",
  dentel: "dental",
  dentail: "dental",
  dentsit: "dentist",
  dentis: "dentist",
  clinicss: "clinics",
  clinik: "clinic",
  dots: "doctors",
  dotor: "doctor",
  doector: "doctor",
  phsyio: "physio",
  physiotheraphy: "physiotherapy",
  // professional services
  consultency: "consultancy",
  consultent: "consultant",
  cosulting: "consulting",
  accountent: "accountant",
  acountant: "accountant",
  acounting: "accounting",
  accountting: "accounting",
  lawer: "lawyer",
  advoate: "advocate",
  chartered: "chartered",
  // construction / realestate
  constructon: "construction",
  constrution: "construction",
  constructin: "construction",
  contruction: "construction",
  buildres: "builders",
  bilders: "builders",
  archtect: "architect",
  architech: "architect",
  architechture: "architecture",
  archtecture: "architecture",
  realstate: "real estate",
  propery: "property",
  // technology
  sofware: "software",
  softwear: "software",
  techonology: "technology",
  tecnology: "technology",
  cybersecurty: "cybersecurity",
  cyper: "cyber",
  websit: "website",
  websight: "website",
  ecomerce: "ecommerce",
  ecommerce: "ecommerce",
  // fitness / beauty / wellness
  fitnes: "fitness",
  fitnesstudio: "fitness studio",
  gymm: "gym",
  yogo: "yoga",
  saloon: "salon",
  parlour: "parlor",
  spaa: "spa",
  // travel / events
  travelss: "travel",
  travells: "travel",
  toures: "tours",
  packeges: "packages",
  destnation: "destination",
  aventures: "adventures",
  // education / agriculture / logistics
  tutions: "tuition",
  tution: "tuition",
  coatching: "coaching",
  nursary: "nursery",
  kirana: "grocery",
  kiranaa: "grocery",
  grosery: "grocery",
  courierr: "courier",
  logistcs: "logistics",
};

/** Colloquial and regional phrasing expanded to the words business logic knows. */
const phraseSynonyms: ReadonlyArray<readonly [string, string]> = [
  ["restro", "restaurant"],
  ["kirana", "grocery shop"],
  ["provisions store", "grocery shop"],
  ["general store", "grocery shop"],
  ["cloth shop", "clothes clothing"],
  ["clothes shop", "clothes clothing"],
  ["clothing shop", "clothes clothing"],
  ["readymade", "clothes clothing"],
  ["garments", "clothing apparel"],
  ["boutique", "clothing boutique retail"],
  ["protein shop", "protein supplements nutrition store"],
  ["supplement shop", "supplements nutrition store"],
  ["supplements store", "supplements nutrition store"],
  ["protein powder", "protein supplements"],
  ["mass gainer", "protein supplements nutrition"],
  ["nutrition shop", "supplements nutrition store"],
  ["medical store", "pharmacy healthcare"],
  ["medical shop", "pharmacy healthcare"],
  ["chemist shop", "pharmacy healthcare"],
  ["dental clinic", "dental clinic dentist"],
  ["teeth", "dental"],
  ["smile clinic", "dental clinic"],
  ["builders", "construction builders"],
  ["builder", "construction builders"],
  ["construction company", "construction contractors"],
  ["interior work", "interior design construction"],
  ["jewellery shop", "jewellery retail store"],
  ["gold shop", "jewellery gold retail"],
  ["gold jewellery", "jewellery gold retail"],
  ["online store", "ecommerce online shop"],
  ["online shop", "ecommerce online shop"],
  ["sell online", "ecommerce online selling"],
  ["gym", "fitness gym"],
  ["fitness studio", "fitness gym"],
  ["personal trainer", "fitness trainer"],
  ["beauty parlour", "beauty salon"],
  ["beauty parlour", "beauty salon"],
  ["travel agency", "travel agency tour packages"],
  ["tour operator", "travel tours packages"],
  ["event management", "events planning"],
  ["school", "education school"],
  ["coaching center", "education coaching"],
  ["coaching centre", "education coaching"],
  ["real estate", "realestate property"],
  ["property dealer", "realestate property"],
  ["car repair", "automotive workshop"],
  ["garage", "automotive workshop"],
  ["photo studio", "creative photography studio"],
  ["graphic design", "creative design studio"],
  ["digital marketing", "creative marketing agency"],
];

/** Words that survive as the business vocabulary for edit-distance repair. */
const repairVocabulary = [
  "restaurant",
  "hotel",
  "resort",
  "cafe",
  "bakery",
  "catering",
  "caterer",
  "clothing",
  "clothes",
  "fashion",
  "boutique",
  "jewellery",
  "supplements",
  "supplement",
  "protein",
  "vitamin",
  "multivitamin",
  "nutrition",
  "gym",
  "fitness",
  "trainer",
  "yoga",
  "salon",
  "spa",
  "clinic",
  "dental",
  "dentist",
  "hospital",
  "pharmacy",
  "physiotherapy",
  "construction",
  "contractors",
  "interior",
  "architect",
  "builders",
  "plumbing",
  "electrical",
  "furniture",
  "consultancy",
  "consultant",
  "accounting",
  "accountant",
  "lawyer",
  "advocate",
  "insurance",
  "travel",
  "tours",
  "packages",
  "trekking",
  "photography",
  "software",
  "technology",
  "cybersecurity",
  "ecommerce",
  "website",
  "agency",
  "studio",
  "school",
  "tuition",
  "coaching",
  "nursery",
  "grocery",
  "electronics",
  "mobile",
  "automobile",
  "logistics",
  "courier",
  "restaurant",
  "farm",
  "nursery",
  "events",
  "wedding",
  "realestate",
  "property",
];

const repairVocabularySet = new Set(repairVocabulary);

/**
 * Words a location capture must never end on or start with: they all belong to
 * the sentence rather than to a place name ("in Jaigaon and also", "for your
 * gym").
 */
const locationNoise = new Set([
  "and",
  "also",
  "plus",
  "with",
  "as",
  "well",
  "or",
  "but",
  "the",
  "my",
  "our",
  "your",
  "their",
  "a",
  "an",
  "to",
  "for",
  "that",
  "which",
  "where",
  "near",
  "around",
]);

/** Generic nouns that describe a setting rather than name a place. */
const genericPlaceWords = new Set([
  "small",
  "big",
  "town",
  "city",
  "village",
  "area",
  "locality",
  "region",
  "district",
  "state",
  "country",
  "market",
  "home",
  "house",
  "office",
  "workshop",
  "centre",
  "center",
  "campus",
  "morning",
  "evening",
  "afternoon",
  "night",
  "weekend",
  "budget",
  "general",
  "online",
  "nearby",
  "mountains",
  "hills",
  "valley",
  "sea",
  "beach",
  "lake",
  "coast",
  "countryside",
  "suburb",
  "outskirts",
  "nature",
  "villages",
  "business",
  "customers",
]);

const placeBlocklist = new Set([
  "gym",
  "restaurant",
  "cafe",
  "shop",
  "store",
  "business",
  "company",
  "clinic",
  "salon",
  "hotel",
  "resort",
  "brand",
  "people",
  "customers",
  "clients",
  "users",
  "members",
  "students",
  "patients",
  "families",
  "women",
  "men",
  "kids",
  "everyone",
  "locals",
  "tourists",
  "clothing",
  "clothes",
  "apparel",
  "grocery",
  "pharmacy",
  "hospital",
  "school",
  "college",
  "institute",
  "agency",
  "service",
  "services",
]);

/**
 * Read a place name out of a description: "in Jaigaon", "near Hasimara",
 * "for Jaigaon". Returns the phrase and the bare place so both the hero copy
 * and the location section stay clean.
 */
export function extractLocationPhrase(prompt: string): {
  location: string;
  place: string;
} {
  // "in / near / at / around" win over "for": "a site for my shop in Jaigaon"
  // is about Jaigaon, not about the shop. Case-insensitivity is deliberate —
  // visitors type "for jaigaon" as often as "in Jaigaon". Business nouns and
  // generic settings are filtered out below.
  const capture = (prompt.match(
    /\b(?:in|near|at|around)\s+([A-Za-z][A-Za-z'-]+(?:\s+[A-Za-z][A-Za-z'-]+){0,2})/,
  ) ??
    prompt.match(
      /\bfor\s+([A-Za-z][A-Za-z'-]+(?:\s+[A-Za-z][A-Za-z'-]+){0,2})/,
    ))?.[1];
  if (!capture) return { location: "", place: "" };

  const words = capture.split(/\s+/);
  while (
    words.length &&
    locationNoise.has(words[words.length - 1]!.toLowerCase())
  ) {
    words.pop();
  }
  const kept = words.filter((word) => !locationNoise.has(word.toLowerCase()));
  if (!kept.length || kept.length > 2) return { location: "", place: "" };
  if (placeBlocklist.has(kept[0]!.toLowerCase()))
    return { location: "", place: "" };
  if (kept.some((word) => genericPlaceWords.has(word.toLowerCase()))) {
    return { location: "", place: "" };
  }

  const place = kept
    .map((word) => `${word[0]!.toUpperCase()}${word.slice(1)}`)
    .join(" ");
  return { location: `near ${place}`, place };
}

/** Bounded Levenshtein distance; bails out above `max` to stay cheap. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowBest = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const next = Math.min(
        previous[j]! + 1,
        current[j - 1]! + 1,
        previous[j - 1]! + cost,
      );
      current.push(next);
      if (next < rowBest) rowBest = next;
    }
    if (rowBest > max) return max + 1;
    previous = current;
  }
  return previous[b.length]!;
}

function repairToken(token: string): string {
  const direct = tokenCorrections[token];
  if (direct) return direct;
  if (token.length < 5 || repairVocabularySet.has(token)) return token;
  const budget = token.length >= 9 ? 2 : 1;
  let best: string | null = null;
  let bestDistance = budget + 1;
  for (const candidate of repairVocabulary) {
    const distance = editDistance(token, candidate, budget);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return bestDistance <= budget && best ? best : token;
}

/**
 * Words that carry no business meaning once we are past the phrase stage.
 * Kept exported so ambiguity detection can weigh clause substance.
 */
const fillerWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "build",
  "business",
  "can",
  "create",
  "design",
  "for",
  "from",
  "get",
  "help",
  "i",
  "in",
  "is",
  "it",
  "like",
  "local",
  "locally",
  "made",
  "make",
  "me",
  "my",
  "need",
  "new",
  "of",
  "on",
  "online",
  "or",
  "our",
  "page",
  "please",
  "site",
  "some",
  "that",
  "the",
  "their",
  "them",
  "this",
  "to",
  "use",
  "want",
  "we",
  "website",
  "with",
  "would",
  "you",
  "your",
]);

/**
 * Canonical business text: lowercased, phrase-synonym expanded, typo repaired.
 * Used for reasoning only — the visitor's original wording is what gets shown.
 */
const phraseRegexCache = new Map<string, RegExp>();

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-phrase match. Word boundaries matter: "ai" inside "Jaigaon" or "gold"
 * inside "golden" must never register as a business signal.
 */
function matchesPhrase(canonical: string, phrase: string): boolean {
  let regex = phraseRegexCache.get(phrase);
  if (!regex) {
    regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`);
    phraseRegexCache.set(phrase, regex);
  }
  return regex.test(canonical);
}

export function canonicalBusinessText(prompt: string): string {
  let value = prompt
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s\-&/+.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Repair single-word typos first so phrase matching sees clean tokens.
  value = value
    .split(" ")
    .map((token) => repairToken(token))
    .join(" ");

  for (const [phrase, replacement] of phraseSynonyms) {
    if (value.includes(phrase)) {
      value = value.split(phrase).join(replacement);
    }
  }

  return value.replace(/\s+/g, " ").trim();
}

/** Words that carry business meaning after canonicalisation. */
export function businessWords(value: string): string[] {
  return value
    .split(/[^a-z0-9'-]+/)
    .filter((word) => word.length > 2 && !fillerWords.has(word));
}

/**
 * Domain lexicon used for ambiguity detection. Keys mirror the Studio's
 * business categories so a chosen idea can be handed straight back to the
 * generator. A domain must be named by an explicit phrase — loose words such
 * as "shop" alone never count.
 */
export const domainPhrases: Readonly<Record<string, readonly string[]>> = {
  hospitality: [
    "hotel",
    "resort",
    "homestay",
    "guest house",
    "guesthouse",
    "villa",
    "lodge",
    "retreat",
    "hostel",
    "rooms",
  ],
  travel: [
    "travel agency",
    "tour operator",
    "tours",
    "travels",
    "trekking",
    "trek",
    "expedition",
    "holiday packages",
    "itinerary",
    "voyage",
  ],
  food: [
    "restaurant",
    "cafe",
    "coffee shop",
    "bakery",
    "catering",
    "caterer",
    "food truck",
    "cloud kitchen",
    "canteen",
    "dhaba",
    "sweet shop",
    "ice cream",
    "pizza",
    "biryani",
    "food business",
  ],
  supplements: [
    "supplements",
    "supplement",
    "protein",
    "whey",
    "multivitamin",
    "vitamin",
    "nutrition",
    "health drink",
    "mass gainer",
    "nutrition store",
  ],
  construction: [
    "construction",
    "contractors",
    "builders",
    "builder",
    "interior design",
    "architecture",
    "architect",
    "civil work",
    "renovation",
    "fabrication",
    "plumbing",
    "electrical work",
    "real estate builder",
  ],
  jewellery: [
    "jewellery",
    "jewelry",
    "gold shop",
    "gold jewellery",
    "diamond",
    "silver jewellery",
    "bullion",
    "ornaments",
  ],
  retail: [
    "shop",
    "store",
    "kirana",
    "grocery",
    "supermarket",
    "electronics",
    "mobile shop",
    "furniture",
    "hardware",
    "stationery",
    "gift shop",
    "retail",
    "showroom",
  ],
  fashion: [
    "clothing",
    "clothes",
    "fashion",
    "apparel",
    "garments",
    "boutique",
    "streetwear",
    "footwear",
    "ethnic wear",
    "saree",
    "tailor",
    "tailoring",
  ],
  healthcare: [
    "clinic",
    "dental",
    "dentist",
    "doctor",
    "hospital",
    "pharmacy",
    "physiotherapy",
    "diagnostic",
    "eye care",
    "veterinary",
    "healthcare",
  ],
  professional: [
    "consultancy",
    "consulting",
    "accounting",
    "accountant",
    "chartered accountant",
    "lawyer",
    "advocate",
    "legal",
    "tax",
    "gst services",
    "insurance",
    "audit",
    "hr services",
    "business services",
  ],
  technology: [
    "software",
    "cybersecurity",
    "cyber security",
    "saas",
    "app development",
    "web development",
    "technology",
    "ai",
    "artificial intelligence",
    "cloud",
    "data analytics",
    "it services",
    "fintech",
  ],
  creative: [
    "photography",
    "photographer",
    "design agency",
    "marketing agency",
    "digital marketing",
    "branding",
    "video production",
    "event management",
    "wedding planning",
    "advertising",
    "content studio",
  ],
  fitness: [
    "gym",
    "fitness",
    "trainer",
    "crossfit",
    "yoga",
    "zumba",
    "martial arts",
    "sports academy",
    "wellness centre",
    "wellness center",
  ],
  beauty: [
    "salon",
    "beauty parlour",
    "beauty parlor",
    "spa",
    "makeup studio",
    "hair studio",
    "unisex salon",
    "nail studio",
  ],
  education: [
    "school",
    "tuition",
    "coaching",
    "academy",
    "nursery",
    "playschool",
    "college",
    "institute",
    "training centre",
    "training center",
  ],
  realestate: [
    "realestate",
    "real estate",
    "property dealer",
    "property",
    "flats",
    "apartments",
    "land development",
    "housing",
  ],
  automotive: [
    "automobile",
    "car repair",
    "garage",
    "workshop",
    "car wash",
    "car dealership",
    "bike service",
    "spare parts",
  ],
  logistics: [
    "logistics",
    "courier",
    "transport",
    "cargo",
    "shipping",
    "freight",
    "delivery service",
    "packers and movers",
  ],
  agriculture: [
    "farm",
    "farming",
    "agriculture",
    "nursery plants",
    "dairy",
    "poultry",
    "tea garden",
    "organic produce",
    "seeds and fertilizers",
  ],
  wellness: [
    "ayurveda",
    "wellness clinic",
    "nutrition coaching",
    "mental health",
    "therapy",
  ],
  events: [
    "event planning",
    "banquet",
    "marriage hall",
    "party planner",
    "decorators",
  ],
  nonprofit: [
    "ngo",
    "trust",
    "foundation",
    "charity",
    "social work",
    "nonprofit",
  ],
  personal: [
    "portfolio",
    "personal brand",
    "freelancer",
    "consultant profile",
    "influencer",
  ],
};

const domainEntries = Object.entries(domainPhrases).map(
  ([domain, phrases]) => [domain, phrases] as const,
);

/** Domains named explicitly in a piece of text, in lexicon order. */
export function domainsInText(value: string): string[] {
  const canonical = canonicalBusinessText(value);
  const found: string[] = [];
  for (const [domain, phrases] of domainEntries) {
    if (phrases.some((phrase) => matchesPhrase(canonical, phrase))) {
      found.push(domain);
    }
  }
  return found;
}

/**
 * Domain combinations that describe one business rather than two (a gym with
 * a supplement counter, a salon offering wellness treatments). Visitors are
 * never interrupted to disambiguate these.
 */
const relatedDomains: ReadonlyArray<readonly [string, string]> = [
  ["fitness", "supplements"],
  ["supplements", "wellness"],
  ["healthcare", "wellness"],
  ["beauty", "wellness"],
  ["beauty", "fitness"],
  ["food", "retail"],
  ["retail", "fashion"],
  ["fashion", "jewellery"],
  ["retail", "jewellery"],
  ["retail", "supplements"],
  ["travel", "hospitality"],
  ["creative", "technology"],
  ["professional", "creative"],
];

function domainsAreRelated(a: string, b: string): boolean {
  return relatedDomains.some(
    ([first, second]) =>
      (first === a && second === b) || (first === b && second === a),
  );
}

export type BusinessIdea = {
  /** Domain id from `domainPhrases`. */
  domain: string;
  /** Short human label for the choice UI, e.g. "Health supplement store". */
  label: string;
  /** Prompt text to hand to the Studio if this idea is chosen. */
  prompt: string;
};

const domainLabels: Readonly<Record<string, string>> = {
  hospitality: "Hotel or resort",
  travel: "Travel and tours",
  food: "Cafe, bakery or restaurant",
  supplements: "Supplement and nutrition shop",
  construction: "Construction or interior work",
  jewellery: "Jewellery store",
  retail: "Local retail shop",
  fashion: "Clothing and fashion store",
  healthcare: "Clinic or healthcare practice",
  professional: "Consulting or professional practice",
  technology: "Software or AI company",
  creative: "Creative or marketing studio",
  fitness: "Gym or fitness studio",
  beauty: "Salon or beauty studio",
  education: "School, tuition or coaching",
  realestate: "Real estate business",
  automotive: "Automotive workshop",
  logistics: "Transport or logistics company",
  agriculture: "Farm or agri business",
  wellness: "Wellness practice",
  events: "Events or venue business",
  nonprofit: "NGO or foundation",
  personal: "Personal brand or portfolio",
};

const clauseSplitters =
  /(?:\band also\b|\bas well as\b|\balso\b|\bplus\b|,|;|&|\band\b)/i;

function cleanClause(clause: string): string {
  return clause
    .replace(/^[\s,;:.-]+/, "")
    .replace(/[\s,;:.-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split a description that names several unrelated businesses into ideas.
 *
 * Deliberately conservative: a clause only counts when it contains an explicit
 * domain phrase and at least two meaningful words beyond the filler, so
 * ordinary multi-service businesses ("I run a gym and also do diet plans")
 * resolve to a single idea and never interrupt the visitor with a question.
 */
export function detectBusinessIdeas(prompt: string): BusinessIdea[] {
  const normalized = prompt.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const clauses = normalized
    .split(clauseSplitters)
    .map(cleanClause)
    .filter((clause) => clause.length > 0);

  const location = extractLocationPhrase(normalized).location;

  const ideas: BusinessIdea[] = [];
  const seen = new Set<string>();

  for (const clause of clauses) {
    const canonical = canonicalBusinessText(clause);
    // One business per clause: "a clothing store" names retail *and* fashion,
    // but it is a single idea, decided by lexicon precedence.
    const domain = domainsInText(clause)[0];
    if (!domain || seen.has(domain)) continue;
    const words = businessWords(canonical);
    const domainOnly = domainPhrases[domain]!.some((phrase) => {
      const phraseWords = businessWords(phrase);
      return (
        words.length > 0 && words.every((word) => phraseWords.includes(word))
      );
    });
    // A clause needs substance beyond the domain name itself.
    if (words.length < 3 && domainOnly) continue;
    seen.add(domain);
    const clauseHasLocation = /\b(?:in|near|at|around)\s/i.test(clause);
    ideas.push({
      domain,
      label: domainLabels[domain] ?? domain,
      prompt: cleanClause(
        clauseHasLocation || !location ? clause : `${clause} ${location}`,
      ),
    });
  }

  if (ideas.length < 2) return [];
  if (ideas.length > 3) return [];

  // Two closely related ideas are usually one business with two sides.
  if (
    ideas.length === 2 &&
    domainsAreRelated(ideas[0]!.domain, ideas[1]!.domain)
  ) {
    return [];
  }

  return ideas;
}

/** True when a description names more than one distinct business. */
export function isAmbiguousBusinessPrompt(prompt: string): boolean {
  return detectBusinessIdeas(prompt).length > 1;
}
