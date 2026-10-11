import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { buildProductionHealthReport, derivePlatformHealthScore, deriveSecurityScore } from "@/src/lib/production-health";
import { getUptimeSeconds, buildUptimeProbe, getRecentAlerts, getRecentPerformanceMarks, opsLog } from "@/src/lib/ops-monitoring";
import { getRecentLogs } from "@/src/lib/production-logger";
import { getAllCircuitBreakers } from "@/src/lib/resilience";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";
import { validateProductionEnvironment } from "@/src/lib/production-config";

function rateLimit(request: Request, key: string, limit = 120) {
    const ip = getClientIp(request);
    return checkRateLimit(`${key}:${ip}`, limit, 60_000);
}

/**
 * Derive a security posture score from real configuration checks rather than a
 * hardcoded constant. Uses only the `security` category of the production
 * environment validator (HTTPS app URL, required server secrets, leak checks).
 */
function currentSecurityScore(): number {
    return deriveSecurityScore(validateProductionEnvironment().checks);
}

export async function GET(request: Request) {
    const rate = rateLimit(request, "ops-health");
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Cache-Control": "no-store" } });
    }

    opsLog("info", "Global health probe", "api/ops/health");
    let supabaseOk = false;
    try {
        assertSupabaseConfigured();
        supabaseOk = true;
    } catch {
        supabaseOk = false;
    }

    const openErrors = getRecentLogs(20, "error").length;
    const circuitBreakers = getAllCircuitBreakers();
    const openBreakers = circuitBreakers.filter((c) => c.state.open).length;
    const criticalAlerts = getRecentAlerts(20).filter((a) => !a.acknowledged && a.severity === "critical").length;

    // This is an unauthenticated liveness probe: it has no organization session
    // and cannot read org-scoped backup rows. Rather than assert backups it never
    // checked (or trigger DR alert spam on every probe), report `unverified`.
    // The authenticated /api/ops/diagnostics endpoint performs the real check.
    const backupStatus = "unverified" as const;
    const backupDetail = "Backup verification requires an authenticated organization context — see /api/ops/diagnostics";

    const report = buildProductionHealthReport({
        platformHealthScore: derivePlatformHealthScore({ supabaseOk, openErrors, openBreakers, criticalAlerts }),
        openErrors,
        securityScore: currentSecurityScore(),
        backupStatus,
        backupDetail,
    });

    const body = {
        ...report,
        service: "arjun-automation",
        uptimeSeconds: getUptimeSeconds(),
        uptimeProbe: buildUptimeProbe(),
        supabaseConfigured: supabaseOk,
        alertsOpen: getRecentAlerts(20).filter((a) => !a.acknowledged && a.severity !== "info").length,
        performanceSamples: getRecentPerformanceMarks(5),
        circuitBreakers,
    };

    return NextResponse.json(body, {
        status: report.status === "critical" || !supabaseOk ? 503 : 200,
        headers: {
            "Cache-Control": "no-store",
            "X-Health-Score": String(report.score),
            "X-Uptime-Seconds": String(getUptimeSeconds()),
        },
    });
}
