import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools-CE_VAwIo.js
var import_jsx_runtime = require_jsx_runtime();
var tools = [
	[
		"project-estimator",
		"Project estimator",
		"Create a useful scope summary without invented pricing."
	],
	[
		"service-finder",
		"Service finder",
		"Find transparent recommendations from your desired outcome."
	],
	[
		"gst-calculator",
		"GST calculator",
		"Calculate inclusive or exclusive GST using a rate you provide."
	],
	[
		"business-checklist",
		"Business checklist",
		"Organize general preparation steps without collecting documents."
	]
];
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: "Useful tools",
			title: "Turn uncertainty into a useful next step.",
			description: "Each tool explains its assumptions, keeps choices editable, and can carry only relevant context into your enquiry."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "site-container tool-directory",
				children: tools.map(([slug, title, copy], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/tools/${slug}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "label text-primary",
							children: ["Tool 0", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: copy }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
					]
				}, slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, {})
	] });
}
//#endregion
export { Page as component };
