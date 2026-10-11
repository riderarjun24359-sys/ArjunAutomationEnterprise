import { describe, it, expect } from "vitest";
import { nextRetryAt } from "./retry-planning";

const POLICY = { maxRetries: 3, backoffSeconds: 60, backoffMultiplier: 2, status: "active" };

describe("nextRetryAt", () => {
    it("backs off exponentially within budget", () => {
        expect(nextRetryAt(POLICY, 0, "pending", 1000)).toBe(1000 + 60_000);
        expect(nextRetryAt(POLICY, 1, "retrying", 1000)).toBe(1000 + 120_000);
        expect(nextRetryAt(POLICY, 2, "retrying", 1000)).toBe(1000 + 240_000);
    });

    it("refuses retries past budget, on terminal states, or without policy", () => {
        expect(nextRetryAt(POLICY, 3, "retrying", 1000)).toBeNull();
        expect(nextRetryAt(POLICY, 0, "delivered", 1000)).toBeNull();
        expect(nextRetryAt(POLICY, 0, "blocked-opt-out", 1000)).toBeNull();
        expect(nextRetryAt(null, 0, "pending", 1000)).toBeNull();
        expect(nextRetryAt({ ...POLICY, status: "paused" }, 0, "pending", 1000)).toBeNull();
    });
});
