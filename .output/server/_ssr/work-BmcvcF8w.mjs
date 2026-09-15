import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ArrowRight, n as Sparkles } from "../_libs/lucide-react.mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
import { t as conceptProjects } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-BmcvcF8w.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: "GSTPIXEL Concept Lab",
			title: "Exploration without invented proof.",
			description: "These are self-initiated design explorations, not commissioned client projects. They demonstrate approaches, decisions, and responsive thinking without fabricated outcomes."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "site-container concept-row",
				children: conceptProjects.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/work/$slug",
					params: { slug: x.slug },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `concept-art concept-${i + 1}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label text-primary",
							children: "Concept project"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: x.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							x.industry,
							" · ",
							x.summary
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
							children: ["View exploration ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 15 })]
						})
					]
				}, x.slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, {})
	] });
}
//#endregion
export { Page as component };
