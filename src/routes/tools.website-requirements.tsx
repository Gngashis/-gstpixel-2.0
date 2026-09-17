import { createFileRoute } from "@tanstack/react-router";
import { FreeToolPage } from "@/lib/free-tool-pages";
import { buildCanonical } from "@/lib/seo";
export const Route = createFileRoute("/tools/website-requirements")({
  component: () => <FreeToolPage kind="requirements" />,
  head: () => ({
    meta: [
      { title: "Website requirement generator — GSTPIXEL" },
      {
        name: "description",
        content:
          "Create a clear starting brief for a website conversation from the content, audience, and actions you select.",
      },
      {
        property: "og:title",
        content: "Website requirement generator — GSTPIXEL",
      },
      {
        property: "og:description",
        content: "Create a clear starting brief for a website conversation.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: buildCanonical("/tools/website-requirements"),
      },
      { property: "og:site_name", content: "GSTPIXEL" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@gstpixel" },
    ],
    links: [
      { rel: "canonical", href: buildCanonical("/tools/website-requirements") },
    ],
  }),
});
