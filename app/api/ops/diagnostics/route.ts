import { existsSync } from "node:fs";
import { join } from "node:path";
import { secureApiRoute, getClientIp, apiSuccess, apiError } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { buildProductionHealthReport } from "@/src/lib/production-health";
import { getRecentLogs } from "@/src/lib/production-logger";
import { getAllCircuitBreakers } from "@/src/lib/resilience";
import {
    getRecentAlerts,
    getRecentPerformanceMarks,
    getUptimeSeconds,
    measureAsync,
    opsLog,
} from "@/src/lib/ops-monitoring";
import {
    buildDisasterRecoveryDiagnostics,
    evaluateBackupSnapshot,
    type BackupVerificationResult,
    type RestoreDrillEvidence,
} from "@/src/lib/disaster-recovery";
import { authServerService } from "@/src/services/auth.server";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";
import { createClient } from "@supabase/supabase-js";

/** Authenticated system diagnostics for soft-launch operations. */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`ops-diagnostics:${ip}`, 30, 60_000);
    if (!rate.allowed) {
        return apiError("Rate limit exceeded", 429);
    }

    const { context, error } = await secureApiRoute(request, { rateLimitKey: `ops-diag:${ip}`, rateLimit: 30 });
    if (error) return error;

    const payload = await measureAsync("ops.diagnostics", async () => {
        let supabaseOk = false;
        try {
            assertSupabaseConfigured();
            supabaseOk = true;
        } catch {
            supabaseOk = false;
        }

        const session = await authServerService.validateSession();
        const documentationPresent = existsSync(join(process.cwd(), "docs", "DISASTER_RECOVERY.md"));
        // Server-side evidence read: the repository layer is browser-bound
        // (getRepositoryClient() is null on the server), so without this the
        // backup/restore checks could never observe an enabled config or a
        // recorded drill. Reads use the caller's own session JWT — never the
        // service role — and are strictly scoped to the authenticated
        // organization, so tenant isolation holds. Any failure (no org, no
        // token, RLS deny, infra error) falls back to the honest defaults.
        const organizationId = context?.organizationId ?? null;
        let serverBackup: BackupVerificationResult | null = null;
        let drillEvidence: RestoreDrillEvidence[] = [];
        const accessToken = session.session?.accessToken;
        if (organizationId && session.valid && accessToken) {
            try {
                const { url, anonKey } = assertSupabaseConfigured();
                const authed = createClient(url, anonKey, {
                    auth: { persistSession: false, autoRefreshToken: false },
                    global: { headers: { Authorization: `Bearer ${accessToken}` } },
                });
                const cfgRes = await authed
                    .from("backup_configs")
                    .select("id,is_enabled")
                    .eq("organization_id", organizationId)
                    .limit(100);
                const configs = cfgRes.error ? [] : (cfgRes.data ?? []);
                const configIds = configs
                    .map((c) => c.id)
                    .filter((id): id is string => typeof id === "string" && id.length > 0)
                    .slice(0, 20);
                let runs: Array<{ config_id?: unknown; status?: unknown }> = [];
                if (configIds.length > 0) {
                    const runRes = await authed
                        .from("backup_runs")
                        .select("config_id,status")
                        .in("config_id", configIds)
                        .limit(400);
                    runs = runRes.error ? [] : (runRes.data ?? []);
                }
                serverBackup = evaluateBackupSnapshot(configs, runs);
                const drillRes = await authed
                    .from("cop_restore_validations")
                    .select("restore_status,validated_at")
                    .eq("organization_id", organizationId)
                    .order("validated_at", { ascending: false })
                    .limit(20);
                drillEvidence = drillRes.error
                    ? []
                    : (drillRes.data ?? []).map((row) => ({
                          restoreStatus: row.restore_status ?? null,
                          validatedAt: row.validated_at ?? null,
                      }));
            } catch {
                serverBackup = null;
                drillEvidence = [];
            }
        }
        const dr = await buildDisasterRecoveryDiagnostics(organizationId, documentationPresent, drillEvidence, serverBackup);
        const health = buildProductionHealthReport({
            platformHealthScore: supabaseOk ? 94 : 50,
            openErrors: getRecentLogs(50, "error").length,
            securityScore: session.valid ? 92 : 60,
            backupVerified: dr.backup.ok,
        });

        opsLog("info", "Diagnostics snapshot generated", "api/ops/diagnostics", {
            organizationId: context?.organizationId,
            health: health.status,
        });

        return {
            health,
            session: {
                valid: session.valid,
                reason: session.reason ?? null,
                expiresAt: session.expiresAt ?? null,
                expiresInSeconds: session.expiresInSeconds ?? null,
                refreshRecommended: session.reason === "refresh_required",
            },
            uptimeSeconds: getUptimeSeconds(),
            supabaseConfigured: supabaseOk,
            disasterRecovery: dr,
            alerts: getRecentAlerts(25),
            performance: getRecentPerformanceMarks(25),
            logs: getRecentLogs(25),
            circuitBreakers: getAllCircuitBreakers(),
            generatedAt: new Date().toISOString(),
        };
    });

    return apiSuccess(payload);
}
