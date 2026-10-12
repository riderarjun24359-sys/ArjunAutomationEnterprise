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
        const runBatches = await Promise.all(
            configs.slice(0, 20).map((c) => databaseService.backupRuns.listByConfig(c.id).catch(() => [])),
        );
        const result = evaluateBackupSnapshot(configs, runBatches.flat());
        if (!result.ok) enqueueAlert("warning", "Backup configuration gap", result.detail, "disaster-recovery");
        return result;
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

/** Minimal row shapes for server-side backup evaluation (pure, no client needed). */
export interface BackupConfigSnapshot {
    id?: unknown;
    is_enabled?: unknown;
}

export interface BackupRunSnapshot {
    config_id?: unknown;
    status?: unknown;
}

/**
 * Evaluates already-fetched backup configs + runs (pure — same semantics as
 * verifyBackupStatus). Server routes that cannot use the browser-bound
 * repository client pass rows fetched with the caller's own session JWT, so
 * an enabled backup config or recorded drill is actually observable instead
 * of structurally invisible.
 */
export function evaluateBackupSnapshot(
    configs: BackupConfigSnapshot[],
    runs: BackupRunSnapshot[],
): BackupVerificationResult {
    const enabledConfigs = configs.filter((c) => Boolean(c?.is_enabled)).length;
    const runList = runs ?? [];
    const successfulRuns = runList.filter((r) => String(r?.status ?? "").toLowerCase().includes("success")).length;
    const ok = enabledConfigs > 0;
    const detail = ok
        ? `${enabledConfigs} enabled backup config(s); ${successfulRuns}/${runList.length} successful runs observed`
        : "No enabled backup configs found for organization";
    return { ok, configs: configs.length, enabledConfigs, recentRuns: runList.length, successfulRuns, detail };
}

export interface RestoreDrillEvidence {
    restoreStatus?: string | null;
    validatedAt?: string | null;
}

/**
 * Restore drills require evidence: a recent successful row in
 * cop_restore_validations (restore_status success-like + validated_at).
 * Docs alone never pass — pass recent drill rows from the caller (the
 * authenticated /api/ops/diagnostics route reads them with the caller's
 * session JWT) or accept the honest negative.
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
    drillEvidence: RestoreDrillEvidence[] = [],
    serverBackup: BackupVerificationResult | null = null,
): Promise<DisasterRecoveryDiagnostics> {
    const backup = organizationId
        ? (serverBackup ?? (await verifyBackupStatus(organizationId)))
        : {
              ok: false,
              configs: 0,
              enabledConfigs: 0,
              recentRuns: 0,
              successfulRuns: 0,
              detail: "No organization context for backup verification",
          };
    const restore = verifyRestoreProcedure(drillEvidence);
    return {
        backup,
        restore,
        documentationPresent,
        healthy: backup.ok && restore.ok && documentationPresent,
    };
}
