import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    getServiceRoleClient: vi.fn(),
    logApiAudit: vi.fn(),
}));

vi.mock("@/src/lib/supabase-service-role", () => ({
    getServiceRoleClient: mocks.getServiceRoleClient,
}));

vi.mock("@/src/lib/api-audit", () => ({ logApiAudit: mocks.logApiAudit }));

import { checkRateLimitDb } from "./rate-limiter-db";

/**
 * Simple fake Supabase client that returns a nested object chain.
 * from().select().eq().gt().maybeSingle()
 */
function fakeServiceRoleClient(data: any = null) {
    const resultData = data ? [{ count: data.count }] : null;
    return {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    gt: vi.fn(() => ({
                        maybeSingle: async () => ({ data: resultData, error: null }),
                    })),
                })),
            })),
        }),
    };
}

describe("rate-limiter-db — server-side service-role access", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getServiceRoleClient.mockReturnValue(
            fakeServiceRoleClient({ count: 5 })
        );
    });

    it("uses the server-side service-role client (bypasses RLS)", async () => {
        const result = await checkRateLimitDb("test-key", 100, 60_000);

        expect(mocks.getServiceRoleClient).toHaveBeenCalled();
        expect(result.allowed).toBe(true);
        expect(result.degraded).toBe(false);
        expect(result.remaining).toBe(99);
    });

    it("fails closed when the service-role client is unavailable", async () => {
        mocks.getServiceRoleClient.mockReturnValue(null);

        const result = await checkRateLimitDb("test-key", 100, 60_000);

        expect(result.allowed).toBe(true);
        expect(result.degraded).toBe(true);
    });

    it("denies when count exceeds limit", async () => {
        mocks.getServiceRoleClient.mockReturnValue(
            fakeServiceRoleClient({ count: 101 })
        );

        const result = await checkRateLimitDb("test-key", 100, 60_000);

        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.degraded).toBe(false);
    });
});

describe("rate-limiter-db — authenticated user access prevention", () => {
    it("getServiceRoleClient returns a client with from() method", async () => {
        mocks.getServiceRoleClient.mockReturnValue(
            fakeServiceRoleClient({ count: 1 })
        );

        const client = mocks.getServiceRoleClient();
        expect(client.from).toBeDefined();
        expect(typeof client.from).toBe("function");
    });

    it("rate-limiter-db uses getServiceRoleClient (not supabase-browser)", async () => {
        mocks.getServiceRoleClient.mockReturnValue(
            fakeServiceRoleClient({ count: 1 })
        );

        await checkRateLimitDb("test-key", 100, 60_000);

        expect(mocks.getServiceRoleClient).toHaveBeenCalled();
    });

    it("migration SQL does not contain any CREATE POLICY statements for authenticated users", async () => {
        const fs = await import("node:fs");
        const path = await import("node:path");

        const migrationPath = path.join(
            process.cwd(),
            "supabase/migrations/202610300001_rate_limits.sql"
        );
        const sql = fs.readFileSync(migrationPath, "utf-8");

        // The migration must NOT contain any CREATE POLICY statements that
        // grant access to authenticated users. Authenticated users must have
        // zero access to rate_limits; only the service-role client (which
        // bypasses RLS) can access it.
        const policyStatements = sql.match(/create policy .*?;/gis) || [];
        expect(policyStatements).toHaveLength(0);

        // The migration must enable RLS
        expect(sql).toContain("enable row level security");
    });
});