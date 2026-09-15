import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
import { t as Route } from "./work._slug-B2I9m9nK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work._slug-BhOLPPl5.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const x = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: `Concept project / ${x.industry}`,
			title: x.title,
			description: x.summary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-container case-study",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "concept-art concept-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: "Design exploration"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "detail-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label text-primary",
							children: "Brief"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Explore a focused digital experience." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This self-initiated concept tests how information hierarchy, decisive actions, and a distinctive visual environment can work together." })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "Scope and limits"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "big-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Interface and interaction direction" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Responsive composition" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No real client or commissioned outcome" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No performance or commercial claims" })
						]
					})] })]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, { title: "Have a real challenge for this kind of thinking?" })
	] });
}
//#endregion
export { Page as component };
