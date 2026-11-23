import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { GET, POST } from "./route";

vi.mock("@/src/lib/supabase-service-role", () => ({ getServiceRoleClient: vi.fn() }));

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("WhatsApp delivery webhook", () => {
    beforeEach(() => vi.clearAllMocks());

    it("verifies Meta webhook subscription tokens", async () => {
        vi.stubEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "verify-token");
        const response = await GET(new Request(
            "http://localhost/api/ai-sales/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify-token&hub.challenge=challenge-123",
        ));
        expect(response.status).toBe(200);
        expect(await response.text()).toBe("challenge-123");
    });

    it("rejects invalid Meta HMAC signatures before touching storage", async () => {
        vi.stubEnv("WHATSAPP_APP_SECRET", "test-meta-secret");
        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/whatsapp", {
            method: "POST",
            headers: { "x-hub-signature-256": "sha256=" + "0".repeat(64) },
            body: JSON.stringify({ entry: [] }),
        }));
        expect(response.status).toBe(401);
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });

    it("records delivery status only after validating the raw-body HMAC", async () => {
        const secret = "test-meta-secret";
        const rawBody = JSON.stringify({
            entry: [{ changes: [{ value: { statuses: [{ id: "wamid.123", status: "delivered" }] } }] }],
        });
        vi.stubEnv("WHATSAPP_APP_SECRET", secret);
        const signature = "sha256=" + createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
        const query = {
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({ data: [{ id: "message-row" }], error: null }),
        };
        const update = vi.fn().mockReturnValue(query);
        const client = { from: vi.fn().mockReturnValue({ update }) };
        vi.mocked(getServiceRoleClient).mockReturnValue(client as never);

        const response = await POST(new Request("http://localhost/api/ai-sales/webhooks/whatsapp", {
            method: "POST",
            headers: { "x-hub-signature-256": signature },
            body: rawBody,
        }));
        const result = await response.json() as { updated?: number };
        expect(response.status).toBe(200);
        expect(result.updated).toBe(1);
        expect(client.from).toHaveBeenCalledWith("ai_sales_whatsapp_messages");
        expect(update).toHaveBeenCalledWith(expect.objectContaining({ status: "delivered" }));
        expect(query.eq).toHaveBeenCalledWith("provider_message_id", "wamid.123");
        expect(query.in).toHaveBeenCalledWith("status", ["accepted", "sent"]);
    });
});
