import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as PageIntro } from "./page-DNWelcru.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools.gst-calculator-h0arVGH9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function money(n) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 2
	}).format(n);
}
function Page() {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [rate, setRate] = (0, import_react.useState)("18");
	const [mode, setMode] = (0, import_react.useState)("exclusive");
	const result = (0, import_react.useMemo)(() => {
		const a = Number(amount), r = Number(rate);
		if (!Number.isFinite(a) || a < 0 || !Number.isFinite(r) || r < 0) return null;
		if (mode === "exclusive") return {
			base: a,
			tax: a * r / 100,
			total: a * (1 + r / 100)
		};
		const base = a / (1 + r / 100);
		return {
			base,
			tax: a - base,
			total: a
		};
	}, [
		amount,
		rate,
		mode
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		label: "Tool 03",
		title: "GST calculator",
		description: "Educational arithmetic only. Enter the amount, choose whether it includes GST, and provide the applicable rate yourself."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "site-container tool-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "form-label",
					htmlFor: "amount",
					children: "Amount in INR"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "amount",
					className: "form-control",
					type: "number",
					min: "0",
					inputMode: "decimal",
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					placeholder: "0.00"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "form-label mt-6",
					htmlFor: "rate",
					children: "GST rate (%)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "rate",
					className: "form-control",
					type: "number",
					min: "0",
					step: "0.01",
					value: rate,
					onChange: (e) => setRate(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "form-label",
						children: "Amount type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "segmented",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: mode === "exclusive",
							onChange: () => setMode("exclusive")
						}), " Excludes GST"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: mode === "inclusive",
							onChange: () => setMode("inclusive")
						}), " Includes GST"] })]
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "result-panel",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label text-primary",
						children: "Calculation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "calculation",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Base amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result ? money(result.base) : "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "GST amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result ? money(result.tax) : "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: result ? money(result.total) : "—" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "disclaimer",
						children: "This calculator performs arithmetic only. It does not determine taxability, place of supply, classification, exemptions, or the correct rate. Confirm the applicable treatment with an authorised professional or official source."
					})
				]
			})]
		})
	})] });
}
//#endregion
export { Page as component };
