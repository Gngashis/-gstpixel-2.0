import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-m4VaPmNu.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Contact",
		title: "Start with what you need.",
		description: "The guided enquiry helps you explain the requirement without learning our service structure first."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container detail-grid",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label text-primary",
					children: "Guided route"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Build a clear project summary." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The enquiry adapts to websites, applications, automation, GST, FSSAI, registration, compliance, consultancy, or help choosing." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/start-your-project",
						children: "Start your project"
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "empty-state",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Direct contact details are awaiting verification." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No email address, phone number, WhatsApp link, booking calendar, or physical address is published until GSTPIXEL confirms it." })]
			})]
		})
	})] });
}
//#endregion
export { Page as component };
