import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-BCNN_SuU.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Privacy",
		title: "Current data handling.",
		description: "This page describes the current preview experience. It will be updated before public submission is enabled."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container prose-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Enquiry drafts" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your enquiry answers remain in the current browser session and are not sent while delivery is unavailable. Do not include sensitive documents or confidential information." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Analytics" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No optional analytics provider has been configured in this version." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Contact and retention" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A verified destination and retention process must be approved before live enquiry delivery is enabled." })
			]
		})
	})] });
}
//#endregion
export { Page as component };
