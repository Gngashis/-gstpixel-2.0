import { createFileRoute } from "@tanstack/react-router";
import { FreeToolPage } from "@/lib/free-tool-pages";
export const Route = createFileRoute("/tools/business-roadmap")({
  component: () => <FreeToolPage kind="roadmap" />,
});
