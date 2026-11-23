import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

function signedHeader(rawBody: string, apiKey: string, timestamp = Date.now()) {
    const value = String(timestamp);
    const digest = createHmac("sha256", apiKey).update(rawBody + value).digest("hex");
    return `v=${value},d=${digest}`;
}

describe("Retell Priya webhook", () => {
    it("rejects a missing verification key", async () => {
        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/retell", {
            method: "POST",
            body: JSON.stringify({}),
        }));
        expect(response.status).toBe(503);
    });

    it("rejects an invalid signature before forwarding", async () => {
        vi.stubEnv("RETELL_WEBHOOK_API_KEY", "test-retell-key");
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/retell", {
            method: "POST",
            headers: { "x-retell-signature": "v=123,d=deadbeef" },
            body: JSON.stringify({ event: "call_started" }),
        }));
        expect(response.status).toBe(401);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("authenticates and forwards a normalized inbound lifecycle event", async () => {
        const apiKey = "test-retell-key";
        const rawBody = JSON.stringify({
            event: "call_started",
            call: {
                call_id: "retell-call-001",
                direction: "inbound",
                from_number: "+919876543210",
                to_number: "+911234567890",
                call_status: "ongoing",
                metadata: { call_event_id: "event-002" },
            },
        });
        vi.stubEnv("RETELL_WEBHOOK_API_KEY", apiKey);
        vi.stubEnv("PRIYA_SALES_WEBHOOK_SECRET", "internal-secret");
        const fetchMock = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal("fetch", fetchMock);

        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/retell", {
            method: "POST",
            headers: { "x-retell-signature": signedHeader(rawBody, apiKey) },
            body: rawBody,
        }));
        expect(response.status).toBe(200);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const init = fetchMock.mock.calls[0][1] as RequestInit;
        expect(new Headers(init.headers).get("Authorization")).toBe("Bearer internal-secret");
        expect(JSON.parse(String(init.body))).toMatchObject({
            provider: "retell",
            providerCallId: "retell-call-001",
            callEventId: "event-002",
            phoneNumber: "+919876543210",
            direction: "inbound",
            status: "connected",
        });
    });
});
