import { NextResponse } from "next/server";
import { getClientIp } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { validateProductionCutover } from "@/src/lib/production-cutover";
import { buildEmailCutoverStatus } from "@/src/lib/production-email";
import { buildPaymentCutoverStatus } from "@/src/lib/production-payments";
import { opsLog } from "@/src/lib/ops-monitoring";

/** Production cutover status — public summary (no secrets). */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`ops-cutover:${ip}`, 60, 60_000);
    if (!rate.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const report = validateProductionCutover();
    const email = buildEmailCutoverStatus();
    const payments = buildPaymentCutoverStatus();

    opsLog("info", "Cutover status probe", "api/ops/cutover", {
        score: report.score,
        ready: report.ready,
    });

    const body = {
        version: report.version,
        baseRelease: report.baseRelease,
        generatedAt: report.checkedAt,
        readiness: {
            ready: report.ready,
            score: report.score,
            blockers: report.blockers,
            warnings: report.warnings,
            checks: report.checks,
        },
        secrets: {
            cutoverRuntime: report.secrets.cutoverRuntime,
            criticalPresent: report.secrets.criticalPresent,
            missingCriticalCount: report.secrets.missingCritical.length,
            missingRecommendedCount: report.secrets.missingRecommended.length,
            serviceRolePublicLeak: report.secrets.serviceRolePublicLeak,
        },
        email: {
            providerConfigured: email.providerConfigured,
            provider: email.provider,
            fromAddressConfigured: email.fromAddressConfigured,
            transactionalReady: email.transactionalReady,
            passwordResetReady: email.passwordResetReady,
            onboardingReady: email.onboardingReady,
        },
        payments: {
            gatewayConfigured: payments.gatewayConfigured,
            webhookSecretConfigured: payments.webhookSecretConfigured,
            liveMode: payments.liveMode,
            webhookPath: payments.webhookPath,
        },
        endpoints: {
            live: "/api/ops/live",
            ready: "/api/ops/ready",
            health: "/api/ops/health",
            diagnostics: "/api/ops/diagnostics",
            production: "/api/ops/production",
            goLive: "/api/ops/go-live",
            cutover: "/api/ops/cutover",
            paymentsWebhook: payments.webhookPath,
        },
    };

    return NextResponse.json(body, {
        status: report.ready ? 200 : 503,
        headers: { "Cache-Control": "no-store", "X-Release-Version": report.version },
    });
}
