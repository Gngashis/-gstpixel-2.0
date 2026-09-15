import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
import { t as Route } from "./solutions._slug-RxVUEn4M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solutions._slug-zkOsJnpv.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const x = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: "Guided solution",
			title: x.title,
			description: x.summary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-container detail-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label text-primary",
					children: "Useful sequence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "big-list",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Clarify the outcome and constraints" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Separate essential needs from optional additions" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Choose the smallest coherent first step" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Review and refine the plan" })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "Connected capabilities"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: x.services.join(" + ") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "These are transparent starting recommendations, not an automated expert judgement. You can edit the context before sending an enquiry." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/start-your-project",
							search: { interest: x.slug },
							children: "Continue with this path"
						})
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, {})
	] });
}
//#endregion
export { Page as component };
