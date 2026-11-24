import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/src/lib/api-security", () => ({ secureApiRoute: vi.fn() }));
vi.mock("@/src/lib/supabase-service-role", () => ({ getServiceRoleClient: vi.fn() }));

import { secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { GET } from "./route";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("GET /api/ai-sales/jarvis/briefing", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: null,
            context: { organizationId: "123e4567-e89b-42d3-a456-426614174000" } as never,
        } as never);
    });

    it("rejects unauthenticated requests before accessing storage", async () => {
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        } as never);

        const response = await GET(new Request("http://localhost/api/ai-sales/jarvis/briefing"));
        expect(response.status).toBe(401);
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });

    it("returns unavailable when the reporting database is not configured", async () => {
        vi.mocked(getServiceRoleClient).mockReturnValue(null as never);

        const response = await GET(new Request("http://localhost/api/ai-sales/jarvis/briefing"));
        expect(response.status).toBe(503);
        expect(await response.json()).toMatchObject({ error: "Sales reporting is not configured" });
    });

    it("requires organization context before querying tenant data", async () => {
        vi.mocked(secureApiRoute).mockResolvedValue({
            error: null,
            context: { organizationId: null } as never,
        } as never);

        const response = await GET(new Request("http://localhost/api/ai-sales/jarvis/briefing"));
        expect(response.status).toBe(403);
        expect(getServiceRoleClient).not.toHaveBeenCalled();
    });
});
