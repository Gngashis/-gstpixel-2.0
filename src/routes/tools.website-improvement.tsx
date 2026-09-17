import { createFileRoute } from "@tanstack/react-router";
import { FreeToolPage } from "@/lib/free-tool-pages";
import { buildCanonical } from "@/lib/seo";
export const Route = createFileRoute("/tools/website-improvement")({
  component: () => <FreeToolPage kind="improvement" />,
  head: () => ({
    meta: [
      { title: "Website improvement analyzer — GSTPIXEL" },
      {
        name: "description",
        content:
          "A guided self-assessment for deciding what to improve next. It does not scan or claim to have visited a website.",
      },
      {
        property: "og:title",
        content: "Website improvement analyzer — GSTPIXEL",
      },
      {
        property: "og:description",
        content: "A guided self-assessment for deciding what to improve next.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/tools/website-improvement"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/website-improvement") },
    ],
  }),
});
