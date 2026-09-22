import { describe, expect, it, vi } from "vitest";
import { createStudioBuildHandler } from "./api";
import {
  NVIDIA_BASE_URL_DEFAULT,
  NVIDIA_MODEL_DEFAULT,
  planCreativeBlueprintWithNvidia,
  resolveNvidiaRuntime,
} from "./nvidia-provider";
import { planCreativeBlueprint } from "./blueprint";

const prompt =
  "Create a premium luxury resort website near Jaigaon with 15 rooms, mountain views, a restaurant and booking enquiries.";

const candidate = planCreativeBlueprint(prompt);

const validPatch = {
  direction: { intensity: "dramatic", premium: "luxury" },
  hero: { family: "cinematic-media" },
};

function nvidiaResponse(content: string, status = 200) {
  return new Response(
    JSON.stringify({ choices: [{ message: { content } }] }),
    {
      status,
      headers: { "content-type": "application/json" },
    },
  );
}

function buildHandler() {
  return createStudioBuildHandler({
    guard: { enter: () => true, leave: () => undefined },
  });
}

function request(body: unknown) {
  return new Request("https://gstpixel.test/api/studio-build", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://gstpixel.test",
    },
    body: JSON.stringify(body),
  });
}

describe("resolveNvidiaRuntime", () => {
  it("is not configured without NVIDIA_API_KEY and keeps safe defaults", () => {
    const runtime = resolveNvidiaRuntime({});
    expect(runtime.configured).toBe(false);
    expect(runtime.apiKey).toBeUndefined();
    expect(runtime.model).toBe(NVIDIA_MODEL_DEFAULT);
    expect(runtime.baseUrl).toBe(NVIDIA_BASE_URL_DEFAULT);
  });

  it("switches model via environment without code changes (Ultra), and trims key", () => {
    const runtime = resolveNvidiaRuntime({
      NVIDIA_API_KEY: "  nvapi-secret  ",
      NVIDIA_MODEL: "nvidia/nemotron-3-ultra-550b-a55b",
      NVIDIA_BASE_URL: "https://integrate.api.nvidia.com/v1/",
    });
    expect(runtime.configured).toBe(true);
    expect(runtime.apiKey).toBe("nvapi-secret");
    expect(runtime.model).toBe("nvidia/nemotron-3-ultra-550b-a55b");
    expect(runtime.baseUrl).toBe("https://integrate.api.nvidia.com/v1/");
  });
});

describe("planCreativeBlueprintWithNvidia", () => {
  it("returns a validated structured patch on success and keeps the visitor text in the user message only", async () => {
    const requests: Array<{ url: string; headers: HeadersInit; body: string }> = [];
    const fetchImpl = (async (input: unknown, init?: RequestInit) => {
      requests.push({
        url: String(input),
        headers: init?.headers ?? {},
        body: String(init?.body),
      });
      return nvidiaResponse(JSON.stringify(validPatch));
    }) as unknown as typeof fetch;

    const patch = await planCreativeBlueprintWithNvidia({
      visitorText: "clothing shop with tailoring near Jaigaon",
      candidate,
      apiKey: "nvapi-secret",
      model: NVIDIA_MODEL_DEFAULT,
      baseUrl: "https://integrate.api.nvidia.com/v1",
      fetchImpl,
    });

    expect(patch.direction?.intensity).toBe("dramatic");
    expect(patch.hero?.family).toBe("cinematic-media");
    expect(requests).toHaveLength(1);
    const first = requests[0]!;
    expect(first.url).toBe(
      "https://integrate.api.nvidia.com/v1/chat/completions",
    );
    const headers = first.headers as Record<string, string>;
    expect(headers["authorization"]).toBe("Bearer nvapi-secret");
    const body = JSON.parse(first.body) as {
      model: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(body.model).toBe(NVIDIA_MODEL_DEFAULT);
    expect(body.messages[0]!.content).not.toContain("clothing shop");
    expect(body.messages[1]!.content).toContain("clothing shop");
  });

  it("discards malformed NVIDIA JSON", async () => {
    const fetchImpl = (async () =>
      nvidiaResponse("certainly not json")) as unknown as typeof fetch;
    await expect(
      planCreativeBlueprintWithNvidia({
        visitorText: "a bakery",
        candidate,
        apiKey: "nvapi-secret",
        model: NVIDIA_MODEL_DEFAULT,
        baseUrl: NVIDIA_BASE_URL_DEFAULT,
        fetchImpl,
      }),
    ).rejects.toThrow();
  });

  it("discards schema-invalid output (no unsafe values reach the renderer)", async () => {
    const fetchImpl = (async () =>
      nvidiaResponse(`{"direction":{"intensity":"absurd-neon-x","premium":"luxury"}}`)) as unknown as typeof fetch;
    await expect(
      planCreativeBlueprintWithNvidia({
        visitorText: "a cafe",
        candidate,
        apiKey: "nvapi-secret",
        model: NVIDIA_MODEL_DEFAULT,
        baseUrl: NVIDIA_BASE_URL_DEFAULT,
        fetchImpl,
      }),
    ).rejects.toThrow();
  });

  it("fails fast on 401 without retrying", async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return nvidiaResponse("{}", 401);
    }) as unknown as typeof fetch;
    await expect(
      planCreativeBlueprintWithNvidia({
        visitorText: "a cafe",
        candidate,
        apiKey: "nvapi-secret",
        model: NVIDIA_MODEL_DEFAULT,
        baseUrl: NVIDIA_BASE_URL_DEFAULT,
        fetchImpl,
      }),
    ).rejects.toThrow();
    expect(calls).toBe(1);
  });

  it("retries once on 429 then falls back on continued rate limiting", async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return nvidiaResponse("{}", 429);
    }) as unknown as typeof fetch;
    await expect(
      planCreativeBlueprintWithNvidia({
        visitorText: "a cafe",
        candidate,
        apiKey: "nvapi-secret",
        model: NVIDIA_MODEL_DEFAULT,
        baseUrl: NVIDIA_BASE_URL_DEFAULT,
        fetchImpl,
      }),
    ).rejects.toThrow();
    expect(calls).toBe(2);
  });

  it("retries once on 5xx then falls back", async () => {
    let calls = 0;
    const fetchImpl = (async () => {
      calls += 1;
      return nvidiaResponse("{}", 500);
    }) as unknown as typeof fetch;
    await expect(
      planCreativeBlueprintWithNvidia({
        visitorText: "a cafe",
        candidate,
        apiKey: "nvapi-secret",
        model: NVIDIA_MODEL_DEFAULT,
        baseUrl: NVIDIA_BASE_URL_DEFAULT,
        fetchImpl,
      }),
    ).rejects.toThrow();
    expect(calls).toBe(2);
  });

  it("times out and falls back instead of hanging the visitor", async () => {
    const fetchImpl = (async (_input: unknown, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(init.signal?.reason ?? new Error("Aborted")),
        );
      })) as unknown as typeof fetch;
    await expect(
      planCreativeBlueprintWithNvidia({
        visitorText: "a cafe",
        candidate,
        apiKey: "nvapi-secret",
        model: NVIDIA_MODEL_DEFAULT,
        baseUrl: NVIDIA_BASE_URL_DEFAULT,
        fetchImpl,
        timeoutMs: 25,
      }),
    ).rejects.toThrow();
  });
});

describe("Studio build handler NVIDIA priority", () => {
  it("uses NVIDIA when configured and returns source nvidia", async () => {
    const fetchImpl = (async () =>
      nvidiaResponse(JSON.stringify(validPatch))) as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetchImpl);
    try {
      const response = await buildHandler()(
        request({ action: "generate", prompt }),
        { NVIDIA_API_KEY: "nvapi-secret" },
      );
      const payload = (await response.json()) as { source: string };
      expect(response.status).toBe(200);
      expect(payload.source).toBe("nvidia");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("returns deterministic fallback when NVIDIA is missing", async () => {
    const fetchImpl = vi.fn();
    vi.stubGlobal("fetch", fetchImpl);
    try {
      const response = await buildHandler()(
        request({ action: "generate", prompt }),
        {},
      );
      const payload = (await response.json()) as { source: string };
      expect(response.status).toBe(200);
      expect(payload.source).toBe("fallback");
      expect(fetchImpl).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("returns deterministic fallback when NVIDIA fails", async () => {
    const fetchImpl = (async () =>
      nvidiaResponse("{}", 500)) as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetchImpl);
    try {
      const response = await buildHandler()(
        request({ action: "generate", prompt }),
        { NVIDIA_API_KEY: "nvapi-secret" },
      );
      const payload = (await response.json()) as { source: string };
      expect(response.status).toBe(200);
      expect(payload.source).toBe("fallback");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});