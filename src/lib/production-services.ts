/**
 * Production services probe helpers — Early Access readiness.
 */

import { assertSupabaseConfigured, isSupabaseConfigured } from "@/src/lib/supabase-config";
import { DEFAULT_STORAGE_BUCKET, STORAGE_ALLOWED_MIME, STORAGE_MAX_BYTES } from "@/src/lib/storage-security";
import { getUptimeSeconds, getRecentAlerts, getRecentPerformanceMarks, buildUptimeProbe } from "@/src/lib/ops-monitoring";
import { buildProductionHealthReport } from "@/src/lib/production-health";
import { validateProductionEnvironment, EARLY_ACCESS_VERSION } from "@/src/lib/production-config";
import { authServerService } from "@/src/services/auth.server";

export interface ProductionServicesReport {
    version: string;
    generatedAt: string;
    uptimeSeconds: number;
    environment: ReturnType<typeof validateProductionEnvironment>;
    supabase: { configured: boolean; detail: string };
    storage: { bucket: string; maxBytes: number; allowedMimeCount: number; detail: string };
    authentication: { validateSessionAvailable: boolean; detail: string };
    email: { templatesPresent: boolean; providerConfigured: boolean; detail: string };
    payment: { gatewayConfigured: boolean; detail: string };
    monitoring: { healthScore: number; openAlerts: number; performanceSamples: number; uptime: ReturnType<typeof buildUptimeProbe> };
}

export async function buildProductionServicesReport(input?: {
    emailTemplatesPresent?: boolean;
}): Promise<ProductionServicesReport> {
    const environment = validateProductionEnvironment();
    let supabaseConfigured = false;
    let supabaseDetail = "Supabase env missing";
    try {
        assertSupabaseConfigured();
        supabaseConfigured = true;
        supabaseDetail = "Supabase URL + anon key configured";
    } catch (error) {
        supabaseDetail = error instanceof Error ? error.message : "Supabase not configured";
    }

    const sessionApi = typeof authServerService.validateSession === "function";
    const paymentConfigured = environment.checks.some((c) => c.id === "payment_gateway" && c.status === "pass");
    const emailProvider = environment.checks.some((c) => c.id === "email_delivery" && c.status === "pass");
    const health = buildProductionHealthReport({
        platformHealthScore: supabaseConfigured ? 94 : 50,
        openErrors: getRecentAlerts(50).filter((a) => a.severity === "critical" && !a.acknowledged).length,
        securityScore: sessionApi ? 90 : 60,
        // This probe does not read backup rows, so it must not claim verification.
        backupStatus: "unverified",
        backupDetail: "Backup verification is available from /api/ops/diagnostics",
    });

    return {
        version: EARLY_ACCESS_VERSION,
        generatedAt: new Date().toISOString(),
        uptimeSeconds: getUptimeSeconds(),
        environment,
        supabase: {
            configured: supabaseConfigured || isSupabaseConfigured(),
            detail: supabaseDetail,
        },
        storage: {
            bucket: DEFAULT_STORAGE_BUCKET,
            maxBytes: STORAGE_MAX_BYTES,
            allowedMimeCount: STORAGE_ALLOWED_MIME.length,
            detail: `Secure upload API targets bucket "${DEFAULT_STORAGE_BUCKET}"`,
        },
        authentication: {
            validateSessionAvailable: sessionApi,
            detail: sessionApi ? "Hardened validateSession + refresh helpers available" : "Auth validation missing",
        },
        email: {
            templatesPresent: input?.emailTemplatesPresent ?? true,
            providerConfigured: emailProvider,
            detail: emailProvider
                ? "Email provider env configured"
                : "Templates ready; configure RESEND_API_KEY or SMTP_* for delivery",
        },
        payment: {
            gatewayConfigured: paymentConfigured,
            detail: paymentConfigured
                ? "Stripe-compatible env detected"
                : "Payment gateway env not set — Early Access billing can remain manual",
        },
        monitoring: {
            healthScore: health.score,
            openAlerts: getRecentAlerts(50).filter((a) => !a.acknowledged && a.severity !== "info").length,
            performanceSamples: getRecentPerformanceMarks(50).length,
            uptime: buildUptimeProbe(),
        },
    };
}
