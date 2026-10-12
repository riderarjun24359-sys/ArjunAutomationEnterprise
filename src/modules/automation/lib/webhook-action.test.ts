import { describe, it, expect, vi } from "vitest";
import {
    validateWebhookTarget,
    isRetryableStatus,
    executeWebhookStep,
    type WebhookDispatch,
} from "./webhook-action";

const ALLOW = ["hooks.example.com", "api.partner.io"];

function dispatch(overrides: Partial<WebhookDispatch> = {}): WebhookDispatch {
    return {
        url: "https://hooks.example.com/events",
        event: "automation.test",
        payload: { hello: "world" },
        idempotencyKey: "exec-1:1",
        allowedHosts: ALLOW,
        timeoutMs: 5000,
        ...overrides,
    };
}

describe("validateWebhookTarget", () => {
    it("accepts an allowlisted https URL", () => {
        const r = validateWebhookTarget("https://hooks.example.com/events", ALLOW);
        expect(r).toEqual({ ok: true, host: "hooks.example.com" });
    });

    it("accepts subdomains of an allowlisted parent", () => {
        expect(validateWebhookTarget("https://a.api.partner.io/x", ALLOW).ok).toBe(true);
    });

    it("rejects sibling-prefix hosts (hooks-example.com is not hooks.example.com)", () => {
        const r = validateWebhookTarget("https://hooks.example.com.evil.test/x", ["example.com"]);
        expect(r.ok).toBe(false);
        const suffixTrick = validateWebhookTarget("https://hooks-example.com/x", ["example.com"]);
        expect(suffixTrick.ok).toBe(false);
    });

    it("rejects non-https, credentials, and malformed URLs", () => {
        expect(validateWebhookTarget("http://hooks.example.com/x", ALLOW).ok).toBe(false);
        expect(validateWebhookTarget("https://user:pass@hooks.example.com/x", ALLOW).ok).toBe(false);
        expect(validateWebhookTarget("not-a-url", ALLOW).ok).toBe(false);
        expect(validateWebhookTarget("", ALLOW).ok).toBe(false);
        expect(validateWebhookTarget(`https://hooks.example.com/${"x".repeat(2100)}`, ALLOW).ok).toBe(false);
    });

    it("rejects loopback, private, link-local, and metadata targets", () => {
        for (const host of [
            "localhost",
            "app.localhost",
            "svc.local",
            "db.internal",
            "127.0.0.1",
            "10.0.0.5",
            "172.16.4.9",
            "192.168.1.1",
            "169.254.169.254",
            "0.0.0.0",
            "224.0.0.1",
            "[::1]",
            "metadata.google.internal",
        ]) {
            const r = validateWebhookTarget(`https://${host}/x`, [host.replace(/^\[|\]$/g, "")]);
            expect(r.ok).toBe(false);
        }
    });

    it("denies when no allowlist is configured, even for public hosts", () => {
        expect(validateWebhookTarget("https://hooks.example.com/x", []).ok).toBe(false);
    });

    it("denies non-allowlisted public hosts", () => {
        expect(validateWebhookTarget("https://evil.example.net/x", ALLOW).ok).toBe(false);
    });
});

describe("isRetryableStatus", () => {
    it("retries network failure, timeouts, 5xx, 408, 429 — not other 4xx", () => {
        expect(isRetryableStatus(null)).toBe(true);
        expect(isRetryableStatus(408)).toBe(true);
        expect(isRetryableStatus(429)).toBe(true);
        expect(isRetryableStatus(500)).toBe(true);
        expect(isRetryableStatus(503)).toBe(true);
        expect(isRetryableStatus(200)).toBe(false);
        expect(isRetryableStatus(400)).toBe(false);
        expect(isRetryableStatus(401)).toBe(false);
        expect(isRetryableStatus(403)).toBe(false);
        expect(isRetryableStatus(404)).toBe(false);
    });
});

describe("executeWebhookStep", () => {
    const sign = vi.fn(async (raw: string) => `digest(${raw.length})`);

    it("signs and delivers with idempotency headers on first try", async () => {
        const fetchFn = vi.fn(async () => ({ status: 200 }));
        const res = await executeWebhookStep({ dispatch: dispatch(), sign, fetchFn, delaysMs: [] });
        expect(res.ok).toBe(true);
        expect(res.responseStatus).toBe(200);
        expect(res.attempts).toHaveLength(1);
        expect(fetchFn).toHaveBeenCalledTimes(1);
        const [url, init] = fetchFn.mock.calls[0] as unknown as [string, { headers: Record<string, string>; body: string }];
        expect(url).toBe("https://hooks.example.com/events");
        expect(init.headers["x-idempotency-key"]).toBe("exec-1:1");
        expect(init.headers["x-aaos-event"]).toBe("automation.test");
        expect(init.headers["x-aaos-signature"]).toMatch(/^t=\d+,v1=digest\(\d+\)$/);
        const body = JSON.parse(init.body) as { event: string; idempotency_key: string; timestamp: number };
        expect(body.event).toBe("automation.test");
        expect(body.idempotency_key).toBe("exec-1:1");
        expect(typeof body.timestamp).toBe("number");
    });

    it("never touches the network for a rejected target", async () => {
        const fetchFn = vi.fn(async () => ({ status: 200 }));
        const res = await executeWebhookStep({
            dispatch: dispatch({ url: "https://evil.example.net/x" }),
            sign,
            fetchFn,
            delaysMs: [10],
        });
        expect(res.ok).toBe(false);
        expect(res.attempts).toHaveLength(0);
        expect(fetchFn).not.toHaveBeenCalled();
    });

    it("retries a 500 then succeeds, sleeping between attempts", async () => {
        const fetchFn = vi.fn(async () => ({ status: 200 }));
        fetchFn.mockResolvedValueOnce({ status: 500 });
        const slept: number[] = [];
        const res = await executeWebhookStep({
            dispatch: dispatch(),
            sign,
            fetchFn,
            delaysMs: [250],
            sleep: async (ms: number) => { slept.push(ms); },
        });
        expect(res.ok).toBe(true);
        expect(res.attempts).toHaveLength(2);
        expect(slept).toEqual([250]);
    });

    it("treats 400 as terminal without retry", async () => {
        const fetchFn = vi.fn(async () => ({ status: 400 }));
        const slept: number[] = [];
        const res = await executeWebhookStep({
            dispatch: dispatch(),
            sign,
            fetchFn,
            delaysMs: [250],
            sleep: async (ms: number) => { slept.push(ms); },
        });
        expect(res.ok).toBe(false);
        expect(res.responseStatus).toBe(400);
        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(slept).toHaveLength(0);
    });

    it("reports timeouts and exhausts the schedule", async () => {
        const abortLike = Object.assign(new Error("The operation was aborted"), { name: "AbortError" });
        const fetchFn = vi.fn(async () => { throw abortLike; });
        const res = await executeWebhookStep({ dispatch: dispatch(), sign, fetchFn, delaysMs: [5, 5], sleep: async () => undefined });
        expect(res.ok).toBe(false);
        expect(res.responseStatus).toBeNull();
        expect(res.attempts).toHaveLength(3);
        expect(res.error).toBe("request timed out");
    });
});
