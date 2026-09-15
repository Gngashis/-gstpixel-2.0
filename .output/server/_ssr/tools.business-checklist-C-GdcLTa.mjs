import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.business-checklist-C-GdcLTa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	"Define the proposed business activity",
	"Identify the people or entities involved",
	"List expected locations and operating channels",
	"Note any sector-specific registrations to investigate",
	"Prepare questions for an authorised professional",
	"Verify every requirement against current official guidance"
];
function Page() {
	const [done, setDone] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Tool 04",
		title: "Business checklist",
		description: "A general preparation aid—not legal, tax, regulatory, or professional advice. Requirements vary by activity, structure, location, and current rules."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container tool-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "checklist",
				children: steps.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: done.includes(x),
					onChange: () => setDone(done.includes(x) ? done.filter((d) => d !== x) : [...done, x])
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["Step 0", i + 1] }), x] })] }, x))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "result-panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "Preparation status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						done.length,
						" of ",
						steps.length
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Completed in this session. Progress is not uploaded or saved." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "disclaimer",
						children: "Do not upload identity, tax, financial, or legal documents here. Verify requirements through current official sources and authorised professionals."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/start-your-project",
							search: { interest: "business setup" },
							children: "Discuss business support"
						})
					})
				]
			})]
		})
	})] });
}
//#endregion
export { Page as component };
