import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as StartBand, t as PageIntro } from "./page-DNWelcru.mjs";
import { t as Route } from "./services._slug-CmMF98IO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services._slug-Dxiw0ZrP.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const s = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			label: s.family,
			title: s.title,
			description: s.summary
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "content-band",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-container detail-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label text-primary",
					children: "What we can help with"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "big-list",
					children: s.helps.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "A clear starting point"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Define the outcome before the implementation." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We begin by understanding the audience, current constraints, essential requirements, and what a useful result needs to change. Scope, dependencies, and boundaries stay visible throughout." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/start-your-project",
							search: { interest: s.slug },
							children: "Start a tailored enquiry"
						})
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartBand, { title: "Need this capability connected to a wider plan?" })
	] });
}
//#endregion
export { Page as component };
