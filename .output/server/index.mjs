globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-09-15T22:29:02.511Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-15T22:29:02.511Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/_-sHXSSTGR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-no+2wsBYdO8JRdJafAZBpkTyoJ8\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 686,
		"path": "../public/assets/_-sHXSSTGR.js"
	},
	"/assets/about-CMeh-AR5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5af-K3Ybdizbu9olV2h5Aa0i1CvZ/p8\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 1455,
		"path": "../public/assets/about-CMeh-AR5.js"
	},
	"/assets/button-5ZQIAg1F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b44-UkRIzZCHzjcuOzkpx79PODPjZdI\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 68420,
		"path": "../public/assets/button-5ZQIAg1F.js"
	},
	"/assets/contact-fcy1RsJ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b0-TKqd2pycKtplzPwtQkE7ckOeicE\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 1200,
		"path": "../public/assets/contact-fcy1RsJ_.js"
	},
	"/assets/index-DmKCIjAl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58976-C2ru4HBZQH3DmhU+MM38F9GOMc8\"",
		"mtime": "2026-09-15T22:29:02.226Z",
		"size": 362870,
		"path": "../public/assets/index-DmKCIjAl.js"
	},
	"/assets/insights-CS4NLjJO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e9-fb1S4ptDVXfXLRwCA3EJcIIy5eo\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 745,
		"path": "../public/assets/insights-CS4NLjJO.js"
	},
	"/assets/page-CKCZVaDl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"577-EVaLWks7nzXymOjFf0Y0ftbaUI0\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 1399,
		"path": "../public/assets/page-CKCZVaDl.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/privacy-Dk9rDEpd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"409-HaPvqeTdAWnrUT27j2dQNFUxUlY\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 1033,
		"path": "../public/assets/privacy-Dk9rDEpd.js"
	},
	"/assets/routes-DWa4Vz9s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ab0-7bxE2g7vRPpgpVHUuRYeFnLmVLU\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 10928,
		"path": "../public/assets/routes-DWa4Vz9s.js"
	},
	"/assets/services-CqwMNXOa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"394-P3PwxSZ8UoOKv7aFsDQCPx9oLXw\"",
		"mtime": "2026-09-15T22:29:02.227Z",
		"size": 916,
		"path": "../public/assets/services-CqwMNXOa.js"
	},
	"/assets/services._slug-BD2R1V-1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4eb-alsDT4JTIGwe0RNiNlfs13UEkYU\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1259,
		"path": "../public/assets/services._slug-BD2R1V-1.js"
	},
	"/assets/solutions-YNcWQaRG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33a-tqhhPUdZA/E1iSruIA9i/8xjG6I\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 826,
		"path": "../public/assets/solutions-YNcWQaRG.js"
	},
	"/assets/solutions._slug-CuT_VETS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"548-/M99b55I7KWzqcgx5rz2aeNzZnQ\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1352,
		"path": "../public/assets/solutions._slug-CuT_VETS.js"
	},
	"/assets/sparkles-BZGdi3pH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-I4/8mbw5BqWx2OVfQtwUeLiu6rY\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 483,
		"path": "../public/assets/sparkles-BZGdi3pH.js"
	},
	"/assets/start-your-project-BQ36U-wT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8b-6HEl+a9sOALlyik3UtXgAuvBzS4\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 3723,
		"path": "../public/assets/start-your-project-BQ36U-wT.js"
	},
	"/assets/tools-ow147PPk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"493-qw5VPCVtg9unaFlqT3aNktYomaY\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1171,
		"path": "../public/assets/tools-ow147PPk.js"
	},
	"/assets/styles-TSYWIBFk.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"151bc-/AZ7U4j+66qniLM9TI9tMKRUdIo\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 86460,
		"path": "../public/assets/styles-TSYWIBFk.css"
	},
	"/assets/tools.business-checklist-CGUjgjul.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"711-Tn7IHMPrrhS8Ne1YxEuPLI5Hsjw\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1809,
		"path": "../public/assets/tools.business-checklist-CGUjgjul.js"
	},
	"/assets/tools.gst-calculator-CG3WjKOW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9a-Fc0UHtPb1RrjkasfFUrmXEPXsHg\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 2714,
		"path": "../public/assets/tools.gst-calculator-CG3WjKOW.js"
	},
	"/assets/tools.service-finder-BToih39f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ec-pLKY0xRVPhg0Cj9g1h4xYhAjk0g\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1516,
		"path": "../public/assets/tools.service-finder-BToih39f.js"
	},
	"/assets/tools.project-estimator-DlQzAgxM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d2-dUoNlkxyruSBWvDmtFCXrI6LT0U\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 2514,
		"path": "../public/assets/tools.project-estimator-DlQzAgxM.js"
	},
	"/assets/work-CqipVXVC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48e-ur0gY13aa3DURXb/D2CMJzzpa94\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1166,
		"path": "../public/assets/work-CqipVXVC.js"
	},
	"/assets/work._slug-B-TS8y9v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a7-vezqzfNOcuWEXMVkX0Ppr3cU8jU\"",
		"mtime": "2026-09-15T22:29:02.228Z",
		"size": 1447,
		"path": "../public/assets/work._slug-B-TS8y9v.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_TxtJ4r = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_TxtJ4r
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
