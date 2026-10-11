import { describe, it, expect } from "vitest";
import { verifyRestoreProcedure } from "./disaster-recovery";

const NOW = new Date("2026-10-11T00:00:00Z").getTime();

describe("verifyRestoreProcedure", () => {
    it("fails without drill evidence (docs alone are not proof)", () => {
        expect(verifyRestoreProcedure([], NOW).ok).toBe(false);
        expect(verifyRestoreProcedure([{ restoreStatus: "success" }], NOW).ok).toBe(false);
        expect(verifyRestoreProcedure([{ restoreStatus: "failed", validatedAt: "2026-10-01T00:00:00Z" }], NOW).ok).toBe(false);
        expect(verifyRestoreProcedure([{ restoreStatus: "success", validatedAt: "2026-01-01T00:00:00Z" }], NOW).ok).toBe(false);
    });

    it("passes with a recent successful drill", () => {
        const result = verifyRestoreProcedure([{ restoreStatus: "verified", validatedAt: "2026-10-01T00:00:00Z" }], NOW);
        expect(result.ok).toBe(true);
    });
});
