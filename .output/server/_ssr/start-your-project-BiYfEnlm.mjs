import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-your-project-BiYfEnlm.js
var $$splitComponentImporter = () => import("./start-your-project-CbUctmdD.mjs");
var Route = createFileRoute("/start-your-project")({
	validateSearch: (s) => typeof s["interest"] === "string" ? { interest: s["interest"] } : {},
	head: () => ({ meta: [
		{ title: "Start Your Project — GSTPIXEL" },
		{
			name: "description",
			content: "Create a clear project or business-services enquiry for GSTPIXEL."
		},
		{
			property: "og:title",
			content: "Start Your Project — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "A guided, adaptive GSTPIXEL enquiry experience."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
