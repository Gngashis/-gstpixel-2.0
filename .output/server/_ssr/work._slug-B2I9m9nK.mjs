import { A as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as conceptProjects } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work._slug-B2I9m9nK.js
var $$splitComponentImporter = () => import("./work._slug-BhOLPPl5.mjs");
var Route = createFileRoute("/work/$slug")({
	loader: ({ params }) => {
		const item = conceptProjects.find((x) => x.slug === params.slug);
		if (!item) throw notFound();
		return item;
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.title ?? "Concept"} — GSTPIXEL Concept Lab` },
		{
			name: "description",
			content: loaderData?.summary ?? "GSTPIXEL concept exploration."
		},
		{
			property: "og:title",
			content: `${loaderData?.title ?? "Concept"} — GSTPIXEL Concept Lab`
		},
		{
			property: "og:description",
			content: "Clearly labeled design exploration; not commissioned client work."
		},
		{
			property: "og:type",
			content: "article"
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
