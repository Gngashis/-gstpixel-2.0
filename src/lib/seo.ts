export const SITE_URL = "https://gstpixel.com";
export const SITE_NAME = "GSTPIXEL";
export const DEFAULT_TITLE =
  "GSTPIXEL — Start Right. Stay Compliant. Grow Online.";
export const DEFAULT_DESCRIPTION =
  "GSTPIXEL combines business consulting and services with digital development and automation — from starting a business and staying compliant to building its digital presence and growing online. Based in Jaigaon, West Bengal.";

export function buildCanonical(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function buildOgUrl(path: string): string {
  return buildCanonical(path);
}

export type ServiceJsonLdInput = {
  title: string;
  family: string;
  summary: string;
};

/** Canonical brand assets served from the site root. */
export const LOGO_URL = `${SITE_URL}/gstpixel-logo.png`;
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

/** Verified public profiles/sameAs references. Do not add unverified profiles. */
const SAME_AS = ["https://wa.me/919046520548"];

/** Verified service topics for knowsAbout. No invented certifications. */
const KNOWS_ABOUT = [
  "GST registration",
  "GST compliance",
  "FSSAI-related services",
  "Business registration",
  "Website development",
  "Ecommerce development",
  "Web application development",
  "Mobile application development",
  "AI automation",
  "Workflow automation",
  "Digital business consulting",
];

export type BreadcrumbItem = {
  path: string;
  label: string;
};

/** Organization JSON-LD using only verified facts. */
export function organizationJsonLd(input: {
  founder: string;
  founderTitle: string;
  tagline: string;
  phone?: string;
  email?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: OG_IMAGE_URL,
    description: input.tagline,
    founder: {
      "@type": "Person",
      name: input.founder,
      jobTitle: input.founderTitle,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaigaon",
      addressRegion: "West Bengal",
      postalCode: "736182",
      addressCountry: "IN",
    },
    ...(input.phone ? { telephone: input.phone } : {}),
    ...(input.email ? { email: input.email } : {}),
    sameAs: SAME_AS,
  };
}

/** LocalBusiness JSON-LD using only verified facts. No hours, ratings, or prices. */
export function localBusinessJsonLd(input: {
  address: string;
  phoneHref: string;
  emailHref: string;
  gstin: string;
  founder: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: OG_IMAGE_URL,
    founder: input.founder,
    description:
      "Digital and business services studio: GST and FSSAI-related assistance, business setup, website and application development, and AI automation.",
    address: {
      "@type": "PostalAddress",
      streetAddress: input.address,
      addressLocality: "Jaigaon",
      addressRegion: "West Bengal",
      postalCode: "736182",
      addressCountry: "IN",
    },
    telephone: input.phoneHref.replace("tel:", ""),
    email: input.emailHref.replace("mailto:", ""),
    identifier: input.gstin,
    areaServed: [
      { "@type": "City", name: "Jaigaon" },
      { "@type": "City", name: "Phuentsholing" },
      { "@type": "City", name: "Alipurduar" },
      { "@type": "Town", name: "Kalchini" },
      { "@type": "Town", name: "Hasimara" },
      { "@type": "Town", name: "Gedu" },
      { "@type": "Town", name: "Pasakha" },
      { "@type": "Town", name: "Rinchending" },
      { "@type": "Town", name: "Samtse" },
      { "@type": "AdministrativeArea", name: "North Bengal" },
      { "@type": "AdministrativeArea", name: "Chhukha" },
      { "@type": "State", name: "West Bengal" },
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "Bhutan" },
    ],
    knowsAbout: KNOWS_ABOUT,
    sameAs: SAME_AS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: input.phoneHref.replace("tel:", ""),
        contactType: "customer support",
        areaServed: ["IN"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+97577260538",
        contactType: "customer support",
        areaServed: ["BT"],
      },
    ],
  };
}

/** WebSite JSON-LD. No SearchAction: no site search endpoint exists. */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "GSTPIXEL combines business consulting and services with digital development and automation.",
  };
}

/** Service JSON-LD for a service detail page. */
export function serviceJsonLd(
  service: ServiceJsonLdInput,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    serviceType: service.family,
    areaServed: [
      "Jaigaon",
      "Phuentsholing",
      "Alipurduar",
      "Kalchini",
      "Hasimara",
      "Gedu",
      "Pasakha",
      "Rinchending",
      "Samtse",
      "West Bengal",
      "India",
      "Bhutan",
    ],
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** BreadcrumbList JSON-LD. */
export function breadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: buildCanonical(item.path),
    })),
  };
}

/** Safely serialize JSON-LD for inline script use. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
