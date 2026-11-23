import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { GET, PATCH, POST } from "./route";

vi.mock("@/src/lib/api-security", () => ({ secureApiRoute: vi.fn() }));
vi.mock("@/src/lib/supabase-service-role", () => ({ getServiceRoleClient: vi.fn() }));

const organizationId = "123e4567-e89b-42d3-a456-426614174000";
const recommendationId = "123e4567-e89b-42d3-a456-426614174001";

function request(body: unknown) {
    return new Request("http://localhost/api/ai-command-center/recommendations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("PATCH /api/ai-command-center/recommendations", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: null,
            context: { organizationId } as never,
        } as never);
    });

    it("rejects unauthenticated users before touching storage", async () => {
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        } as never);

        const response = await PATCH(request({ id: recommendationId, status: "accepted" }));
        expect(response.status).toBe(401);
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });

    it("syncs generated recommendations with server-derived organization scope", async () => {
        const upsert = vi.fn().mockResolvedValue({ error: null });
        const client = { from: vi.fn().mockReturnValue({ upsert }) };
        vi.mocked(getServiceRoleClient).mockReturnValue(client as never);

        const response = await POST(request({
            recommendations: [{
                id: recommendationId,
                engineKey: "systemMonitor",
                title: "Check integration health",
                detail: "A provider is unavailable",
                confidence: 0.9,
                priority: "high",
                status: "pending",
            }],
        }));

        expect(response.status).toBe(200);
        expect(upsert).toHaveBeenCalledWith(
            [expect.objectContaining({
                id: recommendationId,
                organization_id: organizationId,
                status: "pending",
                confidence: 90,
            })],
            { onConflict: "id", ignoreDuplicates: true },
        );
    });

    it("loads saved recommendation statuses for the authenticated organization", async () => {
        const query = {
            eq: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
                data: [{ id: recommendationId, status: "dismissed" }],
                error: null,
            }),
        };
        const client = { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue(query) }) };
        vi.mocked(getServiceRoleClient).mockReturnValue(client as never);

        const response = await GET(new Request("http://localhost/api/ai-command-center/recommendations"));
        const body = await response.json() as { recommendations?: Array<{ id: string; status: string }> };
        expect(response.status).toBe(200);
        expect(body.recommendations?.[0]).toEqual({ id: recommendationId, status: "dismissed" });
        expect(query.eq).toHaveBeenCalledWith("organization_id", organizationId);
    });

    it("persists an accepted action within the authenticated organization", async () => {
        const query = {
            eq: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
                data: { id: recommendationId, status: "accepted" },
                error: null,
            }),
        };
        const update = vi.fn().mockReturnValue(query);
        const client = { from: vi.fn().mockReturnValue({ update }) };
        vi.mocked(getServiceRoleClient).mockReturnValue(client as never);

        const response = await PATCH(request({ id: recommendationId, status: "accepted" }));
        const body = await response.json() as { success?: boolean; recommendation?: { status?: string } };

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.recommendation?.status).toBe("accepted");
        expect(client.from).toHaveBeenCalledWith("acc_recommendations");
        expect(query.eq).toHaveBeenCalledWith("id", recommendationId);
        expect(query.eq).toHaveBeenCalledWith("organization_id", organizationId);
        expect(query.eq).toHaveBeenCalledWith("status", "pending");
    });

    it("rejects unsupported actions", async () => {
        const response = await PATCH(request({ id: recommendationId, status: "executed" }));
        expect(response.status).toBe(400);
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });

    it("does not report success when the recommendation is not found or already actioned", async () => {
        const query = {
            eq: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
        vi.mocked(getServiceRoleClient).mockReturnValue({
            from: vi.fn().mockReturnValue({ update: vi.fn().mockReturnValue(query) }),
        } as never);

        const response = await PATCH(request({ id: recommendationId, status: "dismissed" }));
        expect(response.status).toBe(409);
    });
});
