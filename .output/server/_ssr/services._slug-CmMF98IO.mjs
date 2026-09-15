import { A as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as services } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services._slug-CmMF98IO.js
var $$splitComponentImporter = () => import("./services._slug-Dxiw0ZrP.mjs");
var Route = createFileRoute("/services/$slug")({
	loader: ({ params }) => {
		const item = services.find((x) => x.slug === params.slug);
		if (!item) throw notFound();
		return item;
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.title ?? "Service"} — GSTPIXEL` },
		{
			name: "description",
			content: loaderData?.summary ?? "GSTPIXEL service details."
		},
		{
			property: "og:title",
			content: `${loaderData?.title ?? "Service"} — GSTPIXEL`
		},
		{
			property: "og:description",
			content: loaderData?.summary ?? "GSTPIXEL service details."
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
