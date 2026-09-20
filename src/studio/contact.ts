import { businessFacts } from "@/lib/content";

export const STUDIO_WHATSAPP_MESSAGE =
  "Hi GSTPIXEL, I'd like to discuss building a website for my business.";

export function buildStudioWhatsappHref(): string {
  const url = new URL(businessFacts.whatsapp.href);
  url.searchParams.set("text", STUDIO_WHATSAPP_MESSAGE);
  return url.toString();
}
