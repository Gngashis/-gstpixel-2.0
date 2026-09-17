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

export type BreadcrumbItem = {
  path: string;
  label: string;
};

/** Organization JSON-LD using only verified facts. */
export function organizationJsonLd(input: {
  founder: string;
  founderTitle: string;
  tagline: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    founder: input.founder,
    description: input.tagline,
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
    name: SITE_NAME,
    url: SITE_URL,
    founder: input.founder,
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
    provider: {
      "@type": "Organization",
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
