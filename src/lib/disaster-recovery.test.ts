import { describe, it, expect } from "vitest";
import { buildDisasterRecoveryDiagnostics, evaluateBackupSnapshot, verifyRestoreProcedure } from "./disaster-recovery";

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

describe("evaluateBackupSnapshot", () => {
    it("passes with enabled configs and counts successful runs", () => {
        const result = evaluateBackupSnapshot(
            [{ id: "c1", is_enabled: true }, { id: "c2", is_enabled: false }],
            [{ config_id: "c1", status: "success" }, { config_id: "c1", status: "failed" }],
        );
        expect(result).toEqual({
            ok: true,
            configs: 2,
            enabledConfigs: 1,
            recentRuns: 2,
            successfulRuns: 1,
            detail: "1 enabled backup config(s); 1/2 successful runs observed",
        });
    });

    it("fails honestly with no configs or no enabled configs", () => {
        expect(evaluateBackupSnapshot([], []).ok).toBe(false);
        expect(evaluateBackupSnapshot([{ id: "c1", is_enabled: false }], []).detail).toBe(
            "No enabled backup configs found for organization",
        );
        expect(evaluateBackupSnapshot([], undefined as unknown as []).recentRuns).toBe(0);
    });
});

describe("buildDisasterRecoveryDiagnostics evidence wiring", () => {
    const ORG = "11111111-1111-1111-1111-111111111111";

    it("accepts drill evidence and server backup snapshots when supplied", async () => {
        const dr = await buildDisasterRecoveryDiagnostics(
            ORG,
            true,
            [{ restoreStatus: "success", validatedAt: "2026-10-01T00:00:00Z" }],
            { ok: true, configs: 1, enabledConfigs: 1, recentRuns: 1, successfulRuns: 1, detail: "seeded" },
        );
        expect(dr.restore.ok).toBe(true);
        expect(dr.backup.ok).toBe(true);
        expect(dr.backup.detail).toBe("seeded");
        expect(dr.healthy).toBe(true);
    });

    it("keeps the honest defaults when nothing is supplied (no silent pass)", async () => {
        const dr = await buildDisasterRecoveryDiagnostics(ORG, true);
        expect(dr.restore.ok).toBe(false);
        expect(dr.backup.ok).toBe(false);
        expect(dr.healthy).toBe(false);
    });

    it("reports no organization context without an org", async () => {
        const dr = await buildDisasterRecoveryDiagnostics(
            null,
            true,
            [{ restoreStatus: "success", validatedAt: "2026-10-01T00:00:00Z" }],
        );
        expect(dr.backup.detail).toBe("No organization context for backup verification");
        expect(dr.healthy).toBe(false);
    });
});
