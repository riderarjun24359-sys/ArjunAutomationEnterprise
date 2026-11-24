import { afterEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/src/lib/api-security", () => ({ secureApiRoute: vi.fn() }));
vi.mock("@/src/lib/supabase-service-role", () => ({ getServiceRoleClient: vi.fn() }));
vi.mock("@/src/modules/ai-sales-lead-engine/services/jarvis-calling-window", () => ({
    withinJarvisCallingWindow: vi.fn(() => true),
}));
vi.mock("@/src/modules/ai-voice-agent/providers/voice-provider", () => ({
    createJarvisOutboundCall: vi.fn(),
    isValidIndianE164: vi.fn(() => true),
}));

import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { POST } from "./route";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("POST /api/ai-sales/jarvis/call", () => {
    it("fails closed while Jarvis outbound calling is disabled", async () => {
        vi.stubEnv("ARJUN_JARVIS_CALLS_ENABLED", "false");

        const response = await POST(new Request("http://localhost/api/ai-sales/jarvis/call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ triggerReason: "test" }),
        }));

        expect(response.status).toBe(503);
        expect(await response.json()).toMatchObject({ error: expect.stringContaining("disabled") });
        expect(secureApiRoute).not.toHaveBeenCalled();
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });

    it("rejects non-owner sessions before accessing storage", async () => {
        vi.stubEnv("ARJUN_JARVIS_CALLS_ENABLED", "true");
        vi.stubEnv("ARJUN_VOICE_ORGANIZATION_ID", "123e4567-e89b-42d3-a456-426614174000");
        vi.stubEnv("ARJUN_JARVIS_OWNER_USER_ID", "owner-user");
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: null,
            context: {
                organizationId: "123e4567-e89b-42d3-a456-426614174000",
                user: { id: "different-user" },
            } as never,
        } as never);

        const response = await POST(new Request("http://localhost/api/ai-sales/jarvis/call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ triggerReason: "test" }),
        }));

        expect(response.status).toBe(403);
        expect(await response.json()).toMatchObject({ error: "Only the configured Jarvis owner can trigger personal briefing calls" });
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });

    it("rejects an unauthenticated owner request before accessing storage", async () => {
        vi.stubEnv("ARJUN_JARVIS_CALLS_ENABLED", "true");
        vi.stubEnv("ARJUN_JARVIS_OWNER_USER_ID", "owner-user");
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        } as never);

        const response = await POST(new Request("http://localhost/api/ai-sales/jarvis/call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ triggerReason: "test" }),
        }));

        expect(response.status).toBe(401);
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });
});
