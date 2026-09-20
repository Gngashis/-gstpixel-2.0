import { createFileRoute } from "@tanstack/react-router";
import { StudioExperience } from "@/studio/components/studio-experience";
import { buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/website-studio")({
  head: () => ({
    meta: [
      { title: "Website Studio — GSTPIXEL" },
      {
        name: "description",
        content:
          "Choose your business and a premium creative direction to see what your GSTPIXEL website could become.",
      },
      { property: "og:title", content: "Website Studio — GSTPIXEL" },
      {
        property: "og:description",
        content:
          "Choose your business and immediately experience a premium website direction from GSTPIXEL.",
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
  return <StudioExperience />;
}
