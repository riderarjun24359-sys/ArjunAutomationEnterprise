import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { buildGoLiveServicesReport } from "@/src/lib/go-live-services";
import { opsLog } from "@/src/lib/ops-monitoring";

/** Go-Live readiness — public summary (no secrets). */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`ops-go-live:${ip}`, 60, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const report = await buildGoLiveServicesReport();
    opsLog("info", "Go-live status probe", "api/ops/go-live", {
        score: report.readiness.score,
        ready: report.readiness.ready,
    });

    const publicReport = {
        version: report.version,
        generatedAt: report.generatedAt,
        uptimeSeconds: report.uptimeSeconds,
        readiness: {
            ready: report.readiness.ready,
            score: report.readiness.score,
            goLiveMode: report.readiness.goLiveMode,
            blockers: report.readiness.blockers,
            warnings: report.readiness.warnings,
            tasks: report.readiness.tasks.map((t) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                detail: t.detail,
                requiredForGoLive: t.requiredForGoLive,
            })),
        },
        services: {
            supabase: report.supabase,
            storage: report.storage,
            authentication: report.authentication,
            email: {
                templatesPresent: report.email.templatesPresent,
                providerConfigured: report.email.providerConfigured,
                detail: report.email.detail,
            },
            payment: report.payment,
            monitoring: {
                openAlerts: report.monitoring.openAlerts,
                uptime: report.monitoring.uptime,
                detail: report.monitoring.detail,
            },
            backups: report.backups,
            security: report.security,
            onboarding: report.onboarding,
        },
        endpoints: report.healthEndpoints,
    };

    const degraded = !report.readiness.ready || !report.supabase.configured || !report.security.ok;
    return NextResponse.json(publicReport, {
        status: degraded ? 503 : 200,
        headers: { "Cache-Control": "no-store", "X-Release-Version": report.version },
    });
}
