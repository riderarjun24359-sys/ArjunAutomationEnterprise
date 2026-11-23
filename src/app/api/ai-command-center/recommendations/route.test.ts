import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { PATCH } from "./route";

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
