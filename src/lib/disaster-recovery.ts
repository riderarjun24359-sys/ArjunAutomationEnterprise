/**
 * Disaster recovery verification helpers (soft launch).
 * Reads existing backup/DR signals — no schema redesign.
 */

import { databaseService } from "@/src/modules/database/services/database-service";
import { productionLog } from "@/src/lib/production-logger";
import { enqueueAlert } from "@/src/lib/ops-monitoring";

export interface BackupVerificationResult {
    ok: boolean;
    configs: number;
    enabledConfigs: number;
    recentRuns: number;
    successfulRuns: number;
    detail: string;
}

export interface RestoreVerificationResult {
    ok: boolean;
    detail: string;
    checkedAt: string;
}

export interface DisasterRecoveryDiagnostics {
    backup: BackupVerificationResult;
    restore: RestoreVerificationResult;
    documentationPresent: boolean;
    healthy: boolean;
}

export async function verifyBackupStatus(organizationId: string): Promise<BackupVerificationResult> {
    try {
        const configs = await databaseService.backupConfigs.listByOrganization(organizationId, { limit: 100 }).catch(() => []);
        const enabledConfigs = configs.filter((c) => c.is_enabled).length;
        const runBatches = await Promise.all(
            configs.slice(0, 20).map((c) => databaseService.backupRuns.listByConfig(c.id).catch(() => [])),
        );
        const runs = runBatches.flat();
        const successfulRuns = runs.filter((r) => String(r.status ?? "").toLowerCase().includes("success")).length;
        const ok = enabledConfigs > 0;
        const detail = ok
            ? `${enabledConfigs} enabled backup config(s); ${successfulRuns}/${runs.length} successful runs observed`
            : "No enabled backup configs found for organization";
        if (!ok) enqueueAlert("warning", "Backup configuration gap", detail, "disaster-recovery");
        return { ok, configs: configs.length, enabledConfigs, recentRuns: runs.length, successfulRuns, detail };
    } catch (error) {
        productionLog("error", "Backup verification failed", "disaster-recovery", {
            error: error instanceof Error ? error.message : String(error),
        });
        return {
            ok: false,
            configs: 0,
            enabledConfigs: 0,
            recentRuns: 0,
            successfulRuns: 0,
            detail: "Backup verification failed",
        };
    }
}

export interface RestoreDrillEvidence {
    restoreStatus?: string | null;
    validatedAt?: string | null;
}

/**
 * Restore drills require evidence: a recent successful row in
 * cop_restore_validations (restore_status success-like + validated_at).
 * Docs alone never pass — pass recent drill rows from the caller (e.g.
 * customer-operated-platform service) or accept the honest negative.
 */
export function verifyRestoreProcedure(drills: RestoreDrillEvidence[] = [], now: number = Date.now()): RestoreVerificationResult {
    const checkedAt = new Date().toISOString();
    const recent = drills.filter((drill) => {
        if (!/success|passed|verified|complete/i.test(drill.restoreStatus ?? "")) return false;
        if (!drill.validatedAt) return false;
        const at = new Date(drill.validatedAt).getTime();
        return Number.isFinite(at) && now - at <= 90 * 24 * 60 * 60 * 1000;
    });
    if (recent.length > 0) {
        return { ok: true, detail: `${recent.length} successful restore drill(s) within 90 days — latest evidence accepted`, checkedAt };
    }
    return {
        ok: false,
        detail: "No restore drill evidence in the last 90 days — run a drill and record it in cop_restore_validations (docs/DISASTER_RECOVERY.md alone is not proof)",
        checkedAt,
    };
}

export async function buildDisasterRecoveryDiagnostics(
    organizationId: string | null,
    documentationPresent: boolean,
): Promise<DisasterRecoveryDiagnostics> {
    const backup = organizationId
        ? await verifyBackupStatus(organizationId)
        : {
              ok: false,
              configs: 0,
              enabledConfigs: 0,
              recentRuns: 0,
              successfulRuns: 0,
              detail: "No organization context for backup verification",
          };
    const restore = verifyRestoreProcedure();
    return {
        backup,
        restore,
        documentationPresent,
        healthy: backup.ok && restore.ok && documentationPresent,
    };
}
