import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-BXxZal4R.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Menu, t as X } from "../_libs/lucide-react.mjs";
import { t as Route$15 } from "./start-your-project-BiYfEnlm.mjs";
import { t as Route$16 } from "./services._slug-CmMF98IO.mjs";
import { t as Route$17 } from "./solutions._slug-RxVUEn4M.mjs";
import { t as Route$18 } from "./work._slug-B2I9m9nK.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DQ1J3A6f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-TSYWIBFk.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var nav = [
	["Services", "/services"],
	["Solutions", "/solutions"],
	["Work", "/work"],
	["Tools", "/tools"],
	["Insights", "/insights"],
	["About", "/about"]
];
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "brand-mark",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "brand-cell"
			}),
			"GSTPIXEL",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: "_"
			})
		]
	});
}
function SiteShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "skip-link",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: `site-header${scrolled ? " site-header-scrolled" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "site-container flex h-16 items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							"aria-label": "GSTPIXEL home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"aria-label": "Primary",
							className: "hidden items-center gap-7 lg:flex",
							children: nav.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to,
								className: "nav-link",
								activeProps: { className: "nav-link-active" },
								children: label
							}, to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/start-your-project",
									children: "Start your project"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "quiet",
								"aria-label": open ? "Close menu" : "Open menu",
								"aria-expanded": open,
								onClick: () => setOpen(!open),
								className: "px-3 lg:hidden",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							})]
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Mobile",
					className: "mobile-nav",
					"data-open": true,
					children: [
						nav.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							onClick: () => setOpen(false),
							children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "↗"
							})]
						}, to)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/contact",
							onClick: () => setOpen(false),
							children: ["Contact", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "↗"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-3 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/start-your-project",
								onClick: () => setOpen(false),
								children: "Start your project"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border bg-ink py-12 text-ink-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "site-container grid gap-10 md:grid-cols-[1fr_2fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xs text-sm text-ink-muted",
						children: "Technology, digital development, business services, and consultancy—assembled as one system."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-6 text-sm sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label",
									children: "Explore"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/services",
									children: "Services"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/solutions",
									children: "Solutions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/work",
									children: "Work"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label",
									children: "Decide"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tools",
									children: "Tools"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tools/service-finder",
									children: "Service finder"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tools/project-estimator",
									children: "Estimator"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label",
									children: "Company"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/about",
									children: "About"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/insights",
									children: "Insights"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Contact"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label",
									children: "Begin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/start-your-project",
									children: "Start your project"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									children: "Privacy"
								})
							] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "site-container mt-10 border-t border-ink-line pt-5 font-mono text-[10px] uppercase tracking-widest text-ink-muted",
					children: "© 2026 GSTPIXEL · gstpixel.com"
				})]
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "GSTPIXEL" },
			{
				name: "description",
				content: "Technology, digital development, business services, and consultancy assembled as one system."
			},
			{
				name: "author",
				content: "GSTPIXEL"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$13 = () => import("./routes-0jPRxnNQ.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "GSTPIXEL — Digital Systems for Business" },
		{
			name: "description",
			content: "GSTPIXEL connects digital products, AI automation, business services, and consultancy into one working system."
		},
		{
			property: "og:title",
			content: "GSTPIXEL — Digital Systems for Business"
		},
		{
			property: "og:description",
			content: "Digital products, automation, business services, and consultancy—assembled as one system."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("../_-BJrJwhxc.mjs");
var Route$12 = createFileRoute("/$")({
	head: () => ({ meta: [
		{ title: "Page Not Found — GSTPIXEL" },
		{
			name: "description",
			content: "This GSTPIXEL page could not be found."
		},
		{
			property: "og:title",
			content: "Page Not Found — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "Return to GSTPIXEL or explore the service map."
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./about-DsSzLeXv.mjs");
var Route$11 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About GSTPIXEL" },
		{
			name: "description",
			content: "GSTPIXEL connects technology, digital development, business services, and consultancy."
		},
		{
			property: "og:title",
			content: "About GSTPIXEL"
		},
		{
			property: "og:description",
			content: "The principles behind GSTPIXEL’s integrated operating model."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./contact-m4VaPmNu.mjs");
var Route$10 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact GSTPIXEL" },
		{
			name: "description",
			content: "Start a GSTPIXEL enquiry for digital development, automation, business services, or consultancy."
		},
		{
			property: "og:title",
			content: "Contact GSTPIXEL"
		},
		{
			property: "og:description",
			content: "Choose a guided enquiry while verified direct contact details are being configured."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./insights-CLK8_X7N.mjs");
var Route$9 = createFileRoute("/insights")({
	head: () => ({ meta: [
		{ title: "Insights — GSTPIXEL" },
		{
			name: "description",
			content: "GSTPIXEL resources on business setup, compliance, digital products, automation, and growth."
		},
		{
			property: "og:title",
			content: "Insights — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "A forthcoming library of reviewed GSTPIXEL guides and resources."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./privacy-BCNN_SuU.mjs");
var Route$8 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy — GSTPIXEL" },
		{
			name: "description",
			content: "Current privacy information for the GSTPIXEL website and enquiry experience."
		},
		{
			property: "og:title",
			content: "Privacy — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "How the current GSTPIXEL website handles information."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./services-xnJS78ks.mjs");
var Route$7 = createFileRoute("/services")({
	head: () => ({ meta: [
		{ title: "Services — GSTPIXEL" },
		{
			name: "description",
			content: "Explore GSTPIXEL digital development, AI automation, business services, and consultancy."
		},
		{
			property: "og:title",
			content: "Services — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "One connected service system for digital products, automation, operations, and growth."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./solutions-BErW-pjo.mjs");
var Route$6 = createFileRoute("/solutions")({
	head: () => ({ meta: [
		{ title: "Solutions — GSTPIXEL" },
		{
			name: "description",
			content: "Find a practical GSTPIXEL path based on the business outcome you need."
		},
		{
			property: "og:title",
			content: "Solutions — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "Start with your outcome and find the connected services and tools."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./tools-CE_VAwIo.mjs");
var Route$5 = createFileRoute("/tools")({
	head: () => ({ meta: [
		{ title: "Business Tools — GSTPIXEL" },
		{
			name: "description",
			content: "Use GSTPIXEL’s project estimator, service finder, GST calculator, and business checklist."
		},
		{
			property: "og:title",
			content: "Business Tools — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "Four transparent tools for planning digital and business needs."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./work-BmcvcF8w.mjs");
var Route$4 = createFileRoute("/work")({
	head: () => ({ meta: [
		{ title: "Concept Lab — GSTPIXEL" },
		{
			name: "description",
			content: "Clearly labeled GSTPIXEL design explorations demonstrating product and system thinking."
		},
		{
			property: "og:title",
			content: "Concept Lab — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "GSTPIXEL concept projects and design explorations."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./tools.business-checklist-C-GdcLTa.mjs");
var Route$3 = createFileRoute("/tools/business-checklist")({
	head: () => ({ meta: [
		{ title: "Business Checklist — GSTPIXEL" },
		{
			name: "description",
			content: "Create a general preparation checklist for an Indian business setup conversation."
		},
		{
			property: "og:title",
			content: "Business Checklist — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "A general planning aid with clear regulatory boundaries."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./tools.gst-calculator-h0arVGH9.mjs");
var Route$2 = createFileRoute("/tools/gst-calculator")({
	head: () => ({ meta: [
		{ title: "GST Calculator — GSTPIXEL" },
		{
			name: "description",
			content: "Calculate inclusive or exclusive GST using an amount and rate you provide."
		},
		{
			property: "og:title",
			content: "GST Calculator — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "An educational GST arithmetic calculator with explicit assumptions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./tools.project-estimator-DAym21sf.mjs");
var Route$1 = createFileRoute("/tools/project-estimator")({
	head: () => ({ meta: [
		{ title: "Project Estimator — GSTPIXEL" },
		{
			name: "description",
			content: "Create a non-binding digital project scope summary for a GSTPIXEL consultation."
		},
		{
			property: "og:title",
			content: "Project Estimator — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "A guided scope estimator without invented pricing."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./tools.service-finder-CmoP19my.mjs");
var Route = createFileRoute("/tools/service-finder")({
	head: () => ({ meta: [
		{ title: "Service Finder — GSTPIXEL" },
		{
			name: "description",
			content: "Find a transparent GSTPIXEL service recommendation based on your desired outcome."
		},
		{
			property: "og:title",
			content: "Service Finder — GSTPIXEL"
		},
		{
			property: "og:description",
			content: "A transparent service recommendation with editable choices."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var SplatRoute = Route$12.update({
	id: "/$",
	path: "/$",
	getParentRoute: () => Route$14
});
var AboutRoute = Route$11.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$14
});
var ContactRoute = Route$10.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$14
});
var InsightsRoute = Route$9.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => Route$14
});
var PrivacyRoute = Route$8.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$14
});
var ServicesRoute = Route$7.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$14
});
var SolutionsRoute = Route$6.update({
	id: "/solutions",
	path: "/solutions",
	getParentRoute: () => Route$14
});
var StartYourProjectRoute = Route$15.update({
	id: "/start-your-project",
	path: "/start-your-project",
	getParentRoute: () => Route$14
});
var ToolsRoute = Route$5.update({
	id: "/tools",
	path: "/tools",
	getParentRoute: () => Route$14
});
var WorkRoute = Route$4.update({
	id: "/work",
	path: "/work",
	getParentRoute: () => Route$14
});
var ServicesSlugRoute = Route$16.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ServicesRoute
});
var SolutionsSlugRoute = Route$17.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => SolutionsRoute
});
var ToolsBusinessChecklistRoute = Route$3.update({
	id: "/business-checklist",
	path: "/business-checklist",
	getParentRoute: () => ToolsRoute
});
var ToolsGstCalculatorRoute = Route$2.update({
	id: "/gst-calculator",
	path: "/gst-calculator",
	getParentRoute: () => ToolsRoute
});
var ToolsProjectEstimatorRoute = Route$1.update({
	id: "/project-estimator",
	path: "/project-estimator",
	getParentRoute: () => ToolsRoute
});
var ToolsServiceFinderRoute = Route.update({
	id: "/service-finder",
	path: "/service-finder",
	getParentRoute: () => ToolsRoute
});
var WorkSlugRoute = Route$18.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => WorkRoute
});
var ServicesRouteChildren = { ServicesSlugRoute };
var ServicesRouteWithChildren = ServicesRoute._addFileChildren(ServicesRouteChildren);
var SolutionsRouteChildren = { SolutionsSlugRoute };
var SolutionsRouteWithChildren = SolutionsRoute._addFileChildren(SolutionsRouteChildren);
var ToolsRouteChildren = {
	ToolsBusinessChecklistRoute,
	ToolsGstCalculatorRoute,
	ToolsProjectEstimatorRoute,
	ToolsServiceFinderRoute
};
var ToolsRouteWithChildren = ToolsRoute._addFileChildren(ToolsRouteChildren);
var WorkRouteChildren = { WorkSlugRoute };
var rootRouteChildren = {
	IndexRoute,
	SplatRoute,
	AboutRoute,
	ContactRoute,
	InsightsRoute,
	PrivacyRoute,
	ServicesRoute: ServicesRouteWithChildren,
	SolutionsRoute: SolutionsRouteWithChildren,
	StartYourProjectRoute,
	ToolsRoute: ToolsRouteWithChildren,
	WorkRoute: WorkRoute._addFileChildren(WorkRouteChildren)
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
