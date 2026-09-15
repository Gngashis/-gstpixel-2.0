import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
import { n as services } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-xnJS78ks.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: "Capability map",
			title: "One company. Four connected disciplines.",
			description: "Explore by capability or start with the outcome you need. Every path remains connected to the same GSTPIXEL Assembly."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "site-container service-list",
				children: services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/services/$slug",
					params: { slug: s.slug },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "label text-primary",
							children: [
								"0",
								i + 1,
								" / ",
								s.family
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: s.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s.summary }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: s.helps.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
					]
				}, s.slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, {})
	] });
}
//#endregion
export { Page as component };
