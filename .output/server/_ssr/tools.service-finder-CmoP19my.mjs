import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
import { r as solutions } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.service-finder-CmoP19my.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [slug, setSlug] = (0, import_react.useState)("");
	const result = solutions.find((x) => x.slug === slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Tool 02",
		title: "Service finder",
		description: "Choose the outcome closest to your situation. The recommendation uses simple visible rules—not an AI consultant."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container tool-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "choice-stack",
				children: solutions.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "radio",
					name: "path",
					checked: slug === x.slug,
					onChange: () => setSlug(x.slug)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: x.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: x.summary })] })] }, x.slug))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "result-panel",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "Recommendation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: result?.title || "Choose an outcome" }),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Suggested capabilities: ", result.services.join(" + ")] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "disclaimer",
							children: "Why: these capabilities directly support the selected outcome. You can change this choice at any time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/start-your-project",
								search: { interest: result.slug },
								children: "Use this recommendation"
							})
						})
					] })
				]
			})]
		})
	})] });
}
//#endregion
export { Page as component };
