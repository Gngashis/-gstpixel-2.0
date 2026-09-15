import { A as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as solutions } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solutions._slug-RxVUEn4M.js
var $$splitComponentImporter = () => import("./solutions._slug-zkOsJnpv.mjs");
var Route = createFileRoute("/solutions/$slug")({
	loader: ({ params }) => {
		const item = solutions.find((x) => x.slug === params.slug);
		if (!item) throw notFound();
		return item;
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.title ?? "Solution"} — GSTPIXEL` },
		{
			name: "description",
			content: loaderData?.summary ?? "A guided GSTPIXEL solution."
		},
		{
			property: "og:title",
			content: `${loaderData?.title ?? "Solution"} — GSTPIXEL`
		},
		{
			property: "og:description",
			content: loaderData?.summary ?? "A guided GSTPIXEL solution."
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
