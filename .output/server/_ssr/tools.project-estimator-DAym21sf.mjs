import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.project-estimator-DAym21sf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [type, setType] = (0, import_react.useState)("");
	const [level, setLevel] = (0, import_react.useState)("");
	const [caps, setCaps] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Tool 01",
		title: "Project estimator",
		description: "Build a non-binding scope summary. Pricing remains unavailable until GSTPIXEL approves verified pricing rules."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container tool-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "form-label",
					htmlFor: "type",
					children: "What do you want to build?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "type",
					className: "form-control",
					value: type,
					onChange: (e) => setType(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select one"
					}), [
						"Website",
						"Web application",
						"Mobile application",
						"Ecommerce",
						"Custom platform",
						"Not sure"
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "form-label mt-6",
					htmlFor: "level",
					children: "Design and interaction level"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "level",
					className: "form-control",
					value: level,
					onChange: (e) => setLevel(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select one"
					}), [
						"Professional",
						"Premium",
						"Highly interactive"
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "form-label",
						children: "Relevant capabilities"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "choice-grid",
						children: [
							"Authentication",
							"Payments",
							"Booking",
							"Dashboard",
							"CMS",
							"AI",
							"Automation",
							"Other requirements"
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: caps.includes(x),
							onChange: () => setCaps(caps.includes(x) ? caps.filter((c) => c !== x) : [...caps, x])
						}), x] }, x))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					className: "mt-5",
					onClick: () => {
						setType("");
						setLevel("");
						setCaps([]);
					},
					children: "Reset"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "result-panel",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "Scope summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: type || "Choose a project type" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Interaction: ", level || "Not selected"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Capabilities: ", caps.length ? caps.join(", ") : "None selected yet"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "disclaimer",
						children: "This is a planning summary, not a quotation or delivery estimate."
					}),
					type && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/start-your-project",
							search: { interest: type },
							children: "Continue to enquiry"
						})
					})
				]
			})]
		})
	})] });
}
//#endregion
export { Page as component };
