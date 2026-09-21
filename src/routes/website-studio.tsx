import { createFileRoute } from "@tanstack/react-router";
import { StudioBuilder } from "@/studio/builder/editor";
import { buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/website-studio")({
  head: () => ({
    meta: [
      { title: "Website Studio — GSTPIXEL" },
      {
        name: "description",
        content:
          "Describe your business and watch GSTPIXEL Website Studio generate a premium, editable website experience.",
      },
      { property: "og:title", content: "Website Studio — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Describe it, generate a premium website, and refine the design live with GSTPIXEL Website Studio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: buildCanonical("/website-studio") },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [{ rel: "canonical", href: buildCanonical("/website-studio") }],
  }),
  component: WebsiteStudioPage,
});

function WebsiteStudioPage() {
  return <StudioBuilder />;
}
