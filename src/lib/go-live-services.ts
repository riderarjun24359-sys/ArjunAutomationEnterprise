/**
 * Go-Live services aggregate — customer onboarding readiness snapshot.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { assertSupabaseConfigured, isSupabaseConfigured } from "@/src/lib/supabase-config";
import { DEFAULT_STORAGE_BUCKET } from "@/src/lib/storage-security";
import { getUptimeSeconds, getRecentAlerts, buildUptimeProbe } from "@/src/lib/ops-monitoring";
import { validateGoLiveReadiness, GO_LIVE_HEALTH_ENDPOINTS, GO_LIVE_VERSION } from "@/src/lib/go-live-config";
import { authServerService } from "@/src/services/auth.server";
import { verifyRestoreProcedure } from "@/src/lib/disaster-recovery";

export interface GoLiveServicesReport {
    version: string;
    generatedAt: string;
    uptimeSeconds: number;
    readiness: ReturnType<typeof validateGoLiveReadiness>;
    supabase: { configured: boolean; detail: string };
    storage: { bucket: string; detail: string };
    authentication: { ok: boolean; detail: string };
    email: { templatesPresent: boolean; providerConfigured: boolean; detail: string };
    payment: { configured: boolean; detail: string };
    monitoring: { openAlerts: number; uptime: ReturnType<typeof buildUptimeProbe>; detail: string };
    backups: { restoreProcedureOk: boolean; detail: string };
    healthEndpoints: readonly string[];
    security: { ok: boolean; detail: string };
    onboarding: { wizardPresent: boolean; plansPresent: boolean; detail: string };
}

export async function buildGoLiveServicesReport(): Promise<GoLiveServicesReport> {
    const readiness = validateGoLiveReadiness();

    let supabaseConfigured = false;
    let supabaseDetail = "Supabase env missing";
    try {
        assertSupabaseConfigured();
        supabaseConfigured = true;
        supabaseDetail = "Supabase URL + anon key configured";
    } catch (error) {
        supabaseDetail = error instanceof Error ? error.message : "Supabase not configured";
    }

    const emailTemplatesPresent =
        existsSync(join(process.cwd(), "src/modules/soft-launch/content/emails/welcome.md")) &&
        existsSync(join(process.cwd(), "src/modules/soft-launch/content/emails/verify-email.md"));
    const emailTask = readiness.tasks.find((t) => t.id === "email");
    const paymentTask = readiness.tasks.find((t) => t.id === "payment");
    const securityTask = readiness.tasks.find((t) => t.id === "security");
    const sessionApi = typeof authServerService.validateSession === "function";
    const restore = verifyRestoreProcedure();
    const wizardPresent = existsSync(join(process.cwd(), "src/modules/soft-launch/components/OnboardingWizard.tsx"));
    const plansPresent = existsSync(join(process.cwd(), "src/modules/soft-launch/data/launch-assets.ts"));

    return {
        version: GO_LIVE_VERSION,
        generatedAt: new Date().toISOString(),
        uptimeSeconds: getUptimeSeconds(),
        readiness,
        supabase: {
            configured: supabaseConfigured || isSupabaseConfigured(),
            detail: supabaseDetail,
        },
        storage: {
            bucket: process.env.STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET,
            detail: `Secure upload targets bucket "${process.env.STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET}"`,
        },
        authentication: {
            ok: sessionApi,
            detail: sessionApi ? "validateSession available" : "Auth validation missing",
        },
        email: {
            templatesPresent: emailTemplatesPresent,
            providerConfigured: emailTask?.status === "pass",
            detail: emailTask?.detail ?? "Email status unknown",
        },
        payment: {
            configured: paymentTask?.status === "pass",
            detail: paymentTask?.detail ?? "Payment status unknown",
        },
        monitoring: {
            openAlerts: getRecentAlerts(50).filter((a) => !a.acknowledged && a.severity !== "info").length,
            uptime: buildUptimeProbe(),
            detail: readiness.tasks.find((t) => t.id === "monitoring")?.detail ?? "",
        },
        backups: {
            restoreProcedureOk: restore.ok,
            detail: restore.detail,
        },
        healthEndpoints: GO_LIVE_HEALTH_ENDPOINTS,
        security: {
            ok: securityTask?.status === "pass",
            detail: securityTask?.detail ?? "",
        },
        onboarding: {
            wizardPresent,
            plansPresent,
            detail:
                wizardPresent && plansPresent
                    ? "Onboarding wizard + Soft Launch plans present for customer onboarding"
                    : "Missing onboarding wizard or plans assets",
        },
    };
}
