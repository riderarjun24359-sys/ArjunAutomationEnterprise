import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("Vapi Priya webhook", () => {
    it("rejects a missing or incorrect server secret", async () => {
        vi.stubEnv("VAPI_PRIYA_WEBHOOK_SECRET", "expected-secret");
        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/vapi", {
            method: "POST",
            headers: { "x-vapi-secret": "wrong-secret" },
            body: JSON.stringify({}),
        }));
        expect(response.status).toBe(401);
    });

    it("returns an empty 204 for unrelated provider events", async () => {
        vi.stubEnv("VAPI_PRIYA_WEBHOOK_SECRET", "expected-secret");
        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/vapi", {
            method: "POST",
            headers: { "x-vapi-secret": "expected-secret" },
            body: JSON.stringify({ message: { type: "assistant-request" } }),
        }));
        expect(response.status).toBe(204);
        expect(await response.text()).toBe("");
    });

    it("authenticates and forwards a normalized inbound lifecycle event", async () => {
        vi.stubEnv("VAPI_PRIYA_WEBHOOK_SECRET", "expected-secret");
        vi.stubEnv("PRIYA_SALES_WEBHOOK_SECRET", "internal-secret");
        const fetchMock = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal("fetch", fetchMock);
        const payload = {
            message: {
                type: "status-update",
                status: "in-progress",
                call: {
                    id: "vapi-call-001",
                    type: "inboundPhoneCall",
                    customer: { number: "+919876543210" },
                    metadata: { call_event_id: "event-001" },
                },
            },
        };

        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/vapi", {
            method: "POST",
            headers: { "x-vapi-secret": "expected-secret", "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }));
        expect(response.status).toBe(200);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const init = fetchMock.mock.calls[0][1] as RequestInit;
        expect(new Headers(init.headers).get("Authorization")).toBe("Bearer internal-secret");
        expect(JSON.parse(String(init.body))).toMatchObject({
            provider: "vapi",
            providerCallId: "vapi-call-001",
            callEventId: "event-001",
            phoneNumber: "+919876543210",
            direction: "inbound",
            status: "connected",
        });
    });
});
