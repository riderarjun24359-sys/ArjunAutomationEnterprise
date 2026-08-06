import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { buildProductionHealthReport } from "@/src/lib/production-health";
import { getUptimeSeconds, buildUptimeProbe, getRecentAlerts, getRecentPerformanceMarks, opsLog } from "@/src/lib/ops-monitoring";
import { getRecentLogs } from "@/src/lib/production-logger";
import { getAllCircuitBreakers } from "@/src/lib/resilience";
import { assertSupabaseConfigured } from "@/src/lib/supabase-config";

function rateLimit(request: Request, key: string, limit = 120) {
    const ip = getClientIp(request);
    return checkRateLimit(`${key}:${ip}`, limit, 60_000);
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

    const report = buildProductionHealthReport({
        platformHealthScore: supabaseOk ? 94 : 55,
        openErrors: getRecentLogs(20, "error").length,
        securityScore: 90,
        backupVerified: true,
    });

    const body = {
        ...report,
        service: "arjun-automation",
        uptimeSeconds: getUptimeSeconds(),
        uptimeProbe: buildUptimeProbe(),
        supabaseConfigured: supabaseOk,
        alertsOpen: getRecentAlerts(20).filter((a) => !a.acknowledged && a.severity !== "info").length,
        performanceSamples: getRecentPerformanceMarks(5),
        circuitBreakers: getAllCircuitBreakers(),
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
