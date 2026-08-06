import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { buildProductionServicesReport } from "@/src/lib/production-services";
import { opsLog } from "@/src/lib/ops-monitoring";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Early Access production status — public summary + env readiness (no secrets). */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`ops-production:${ip}`, 60, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const emailTemplatesPresent =
        existsSync(join(process.cwd(), "src/modules/soft-launch/content/emails/welcome.md")) &&
        existsSync(join(process.cwd(), "src/modules/soft-launch/content/emails/verify-email.md"));

    const report = await buildProductionServicesReport({ emailTemplatesPresent });
    opsLog("info", "Production status probe", "api/ops/production", {
        score: report.environment.score,
        ready: report.environment.ready,
    });

    const publicReport = {
        version: report.version,
        generatedAt: report.generatedAt,
        uptimeSeconds: report.uptimeSeconds,
        environment: {
            ready: report.environment.ready,
            score: report.environment.score,
            name: report.environment.environment,
            blockers: report.environment.blockers,
            warnings: report.environment.warnings,
            checks: report.environment.checks.map((c) => ({
                id: c.id,
                category: c.category,
                status: c.status,
                detail: c.detail,
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
            monitoring: report.monitoring,
        },
        endpoints: {
            live: "/api/ops/live",
            ready: "/api/ops/ready",
            health: "/api/ops/health",
            diagnostics: "/api/ops/diagnostics",
            production: "/api/ops/production",
        },
    };

    const degraded = !report.supabase.configured || report.environment.blockers.length > 0;
    return NextResponse.json(publicReport, {
        status: degraded ? 503 : 200,
        headers: { "Cache-Control": "no-store", "X-Release-Version": report.version },
    });
}
