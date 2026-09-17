import { createFileRoute } from "@tanstack/react-router";
import { FreeToolPage } from "@/lib/free-tool-pages";
import { buildCanonical } from "@/lib/seo";
export const Route = createFileRoute("/tools/project-planning")({
  component: () => <FreeToolPage kind="planning" />,
  head: () => ({
    meta: [
      { title: "Project planning assistant — GSTPIXEL" },
      {
        name: "description",
        content:
          "Shape an actionable first plan with phases, decisions, and dependencies. It does not promise delivery dates or staffing.",
      },
      {
        property: "og:title",
        content: "Project planning assistant — GSTPIXEL",
      },
      {
        property: "og:description",
        content:
          "Shape an actionable first plan with phases, decisions, and dependencies.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/tools/project-planning"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/project-planning") },
    ],
  }),
});
