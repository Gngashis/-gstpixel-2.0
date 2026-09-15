import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { l as ArrowRight, u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
import { t as Route } from "./start-your-project-BiYfEnlm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-your-project-CbUctmdD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var routes = [
	"Website or application",
	"AI or automation",
	"GST-related support",
	"FSSAI-related support",
	"Business registration",
	"Compliance support",
	"Consultancy",
	"Not sure yet"
];
function Page() {
	const search = Route.useSearch();
	const [step, setStep] = (0, import_react.useState)(0);
	const [need, setNeed] = (0, import_react.useState)(search.interest);
	const [stage, setStage] = (0, import_react.useState)("");
	const [details, setDetails] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Start your project",
		title: "A clearer brief starts here.",
		description: "Answer only what is useful. Nothing is submitted while the verified delivery inbox is being configured."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container enquiry-shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enquiry-progress",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${(step + 1) * 25}%` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
						"Step ",
						step + 1,
						" of 4"
					] })]
				}),
				step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "What do you need help with?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-stack",
					children: routes.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "radio",
						name: "need",
						checked: need === x,
						onChange: () => setNeed(x)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: x }) })] }, x))
				})] }),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Where are you now?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "choice-stack",
					children: [
						"Exploring an idea",
						"Planning and comparing",
						"Ready to begin",
						"Improving something existing",
						"Need help understanding the next step"
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "radio",
						name: "stage",
						checked: stage === x,
						onChange: () => setStage(x)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: x }) })] }, x))
				})] }),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "form-label",
						htmlFor: "details",
						children: "What would a useful outcome look like?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "details",
						className: "form-control min-h-40",
						value: details,
						onChange: (e) => setDetails(e.target.value),
						placeholder: "Describe the requirement, audience, constraints, or deadline if relevant."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "field-note",
						children: "Do not include passwords, financial details, identity numbers, or confidential documents."
					})
				] }),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "detail-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "form-label",
							htmlFor: "name",
							children: "Your name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "name",
							className: "form-control",
							value: name,
							onChange: (e) => setName(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "form-label mt-6",
							htmlFor: "email",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "email",
							className: "form-control",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "result-panel",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label text-primary",
								children: "Your summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: need || "No route selected" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: stage || "No stage selected" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: details || "No additional context." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "disclaimer",
								children: "Sending is currently unavailable until GSTPIXEL confirms the recipient inbox and acknowledgement process. Your answers have not been submitted."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: true,
								children: "Send enquiry"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "enquiry-actions",
					children: [
						step > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "quiet",
							onClick: () => setStep(step - 1),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), " Back"]
						}),
						" ",
						step < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setStep(step + 1),
							disabled: step === 0 && !need || step === 1 && !stage,
							children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
						})
					]
				})
			]
		})
	})] });
}
//#endregion
export { Page as component };
