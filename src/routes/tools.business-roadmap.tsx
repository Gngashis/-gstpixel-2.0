import { createFileRoute } from "@tanstack/react-router";
import { FreeToolPage } from "@/lib/free-tool-pages";
import { buildCanonical } from "@/lib/seo";
export const Route = createFileRoute("/tools/business-roadmap")({
  component: () => <FreeToolPage kind="roadmap" />,
  head: () => ({
    meta: [
      { title: "Business idea to digital roadmap — GSTPIXEL" },
      {
        name: "description",
        content:
          "Turn a business idea into a practical sequence of digital decisions. This is structured planning, not an AI-generated business plan.",
      },
      {
        property: "og:title",
        content: "Business idea to digital roadmap — GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Turn a business idea into a practical sequence of digital decisions.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/tools/business-roadmap"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/business-roadmap") },
    ],
  }),
});
