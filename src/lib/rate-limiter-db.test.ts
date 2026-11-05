import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({ getServiceRoleClient: vi.fn(), rpc: vi.fn() }));

vi.mock("@/src/lib/supabase-service-role", () => ({
    getServiceRoleClient: mocks.getServiceRoleClient,
}));

import { checkRateLimitDb } from "./rate-limiter-db";

describe("rate-limiter-db — atomic service-role RPC", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.getServiceRoleClient.mockReturnValue({ rpc: mocks.rpc });
        mocks.rpc.mockResolvedValue({
            data: [{ count: 5, reset_at: "2030-01-01T00:01:00.000Z" }],
            error: null,
        });
    });

    it("uses the atomic RPC through the server-side service-role client", async () => {
        const result = await checkRateLimitDb("route:client", 100, 60_000);

        expect(mocks.getServiceRoleClient).toHaveBeenCalledOnce();
        expect(mocks.rpc).toHaveBeenCalledWith("consume_rate_limit", {
            p_key: "route:client",
            p_limit: 100,
            p_window_ms: 60_000,
        });
        expect(result).toMatchObject({ allowed: true, remaining: 95, degraded: false });
        expect(result.resetAt.toISOString()).toBe("2030-01-01T00:01:00.000Z");
    });

    it("denies requests after the configured limit", async () => {
        mocks.rpc.mockResolvedValue({
            data: [{ count: 101, reset_at: "2030-01-01T00:01:00.000Z" }],
            error: null,
        });
        const result = await checkRateLimitDb("route:client", 100, 60_000);
        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.degraded).toBe(false);
    });

    it("uses a stricter in-memory fallback when Supabase is unavailable", async () => {
        mocks.getServiceRoleClient.mockReturnValue(null);
        const result = await checkRateLimitDb("fallback-test", 10, 60_000);
        expect(result).toMatchObject({ allowed: true, remaining: 0, degraded: true });
    });

    it("fails closed to the stricter fallback when the RPC fails", async () => {
        mocks.rpc.mockResolvedValue({ data: null, error: { message: "RPC unavailable" } });
        const result = await checkRateLimitDb("rpc-fallback-test", 10, 60_000);
        expect(result).toMatchObject({ allowed: true, remaining: 0, degraded: true });
    });

    it("falls back when the RPC returns an invalid payload", async () => {
        mocks.rpc.mockResolvedValue({ data: [], error: null });
        const result = await checkRateLimitDb("invalid-rpc-test", 10, 60_000);
        expect(result.degraded).toBe(true);
    });
});
