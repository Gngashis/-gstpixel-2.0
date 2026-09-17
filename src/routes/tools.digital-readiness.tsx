import { createFileRoute } from "@tanstack/react-router";
import { FreeToolPage } from "@/lib/free-tool-pages";
import { buildCanonical } from "@/lib/seo";
export const Route = createFileRoute("/tools/digital-readiness")({
  component: () => <FreeToolPage kind="readiness" />,
  head: () => ({
    meta: [
      { title: "Digital readiness assessment — GSTPIXEL" },
      {
        name: "description",
        content:
          "Score the practical foundations behind a digital project and get a focused next-step list.",
      },
      {
        property: "og:title",
        content: "Digital readiness assessment — GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Score the practical foundations behind a digital project and get a focused next-step list.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/tools/digital-readiness"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/digital-readiness") },
    ],
  }),
});
