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
import { buildDisasterRecoveryDiagnostics } from "@/src/lib/disaster-recovery";
import { authServerService } from "@/src/services/auth.server";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";

/** Authenticated system diagnostics for soft-launch operations. */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`ops-diagnostics:${ip}`, 30, 60_000);
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
        const dr = await buildDisasterRecoveryDiagnostics(context?.organizationId ?? null, documentationPresent);
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
