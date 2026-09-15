import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
import { r as solutions } from "./content-B08_1S8n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/solutions-BErW-pjo.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: "Outcome routes",
			title: "You don’t need to know the service name.",
			description: "Start with what you want to achieve. Each route explains the essential next steps and the capabilities that may help."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "site-container outcome-list",
				children: solutions.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/solutions/$slug",
					params: { slug: x.slug },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "label",
							children: ["0", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: x.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: x.summary }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
					]
				}, x.slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, {})
	] });
}
//#endregion
export { Page as component };
