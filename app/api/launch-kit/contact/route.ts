import { NextResponse } from "next/server";
import { secureApiRoute, logApiAudit } from "@/src/lib/api-security";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import {
    PRIVACY_NOTICE_VERSION,
    findDuplicateLead,
    leadIntakeSchema,
    normalizeLeadIntake,
} from "@/src/lib/lead-intake";
import { buildLeadPayload, buildSalesAuditPayload } from "@/src/modules/database/lib/sales-mappers";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (m) => `\\${m}`);

/**
 * Public lead intake — works for anonymous visitors (no session, no platform
 * key) with strict validation, mandatory privacy consent, per-org email
 * dedup, and secure server-side storage. Authenticated callers and
 * platform-key integrations keep working through the same path.
 *
 * Writes use the server-only service-role client because this route has no
 * user JWT for RLS; every insert is org-scoped in code and recorded in the
 * sales audit log with the consent proof. No external message is sent —
 * follow-up happens from the pipeline, by a human.
 */
export async function POST(request: Request) {
    const platformKeyProvided = Boolean(request.headers.get("x-platform-key"));
    let organizationId: string | null = process.env.PLATFORM_ORGANIZATION_ID?.trim() || null;

    if (platformKeyProvided) {
        const { context, error } = await secureApiRoute(request, {
            allowPublic: true,
            publicApiKeyEnv: "PLATFORM_LEAD_API_KEY",
            rateLimit: 10,
            rateLimitKey: "lead-intake",
        });
        if (error || !context) return error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        organizationId = context.organizationId ?? organizationId;
    } else {
        const rate = checkRateLimit("lead-intake", 10, 60_000);
        if (!rate.allowed) {
            return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
        }
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }
    const parsed = leadIntakeSchema.safeParse(body);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message ?? "Invalid form data";
        return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }
    const lead = normalizeLeadIntake(parsed.data);

    if (!organizationId) {
        return NextResponse.json(
            { success: false, error: "Lead intake is unavailable: intake organization is not configured" },
            { status: 503 },
        );
    }

    const client = getServiceRoleClient();
    if (!client) {
        return NextResponse.json(
            { success: false, error: "Lead intake is unavailable: secure storage is not configured" },
            { status: 503 },
        );
    }

    try {
        const { data: existing, error: lookupError } = await client
            .from("sales_leads")
            .select("id,email,status")
            .eq("organization_id", organizationId)
            .ilike("email", escapeLike(lead.email));
        if (lookupError) throw new Error(`Lead lookup failed: ${lookupError.message}`);
        const duplicate = findDuplicateLead((existing ?? []) as Array<{ email?: string | null }>, lead.email);
        if (duplicate && "id" in duplicate && typeof (duplicate as { id?: unknown }).id === "string") {
            const dup = duplicate as { id: string; status?: string };
            await logApiAudit({
                action: "lead_duplicate_skipped",
                organizationId,
                metadata: { email: lead.email, source: lead.source, existingLeadId: dup.id },
            });
            return NextResponse.json({ success: true, leadId: dup.id, duplicate: true, status: dup.status ?? null });
        }

        const { data: created, error: insertError } = await client
            .from("sales_leads")
            .insert(buildLeadPayload(organizationId, {
                leadName: lead.name,
                companyName: lead.company || "Unknown",
                email: lead.email,
                phone: lead.phone,
                source: lead.source,
            }))
            .select("id,status")
            .maybeSingle();
        if (insertError || !created) throw new Error(insertError ? `Lead storage failed: ${insertError.message}` : "Lead storage failed");

        const leadId = (created as { id: string }).id;
        await client.from("sales_audit_logs").insert(
            buildSalesAuditPayload(
                organizationId,
                "lead",
                "create",
                `Lead captured from ${lead.source} with privacy consent ${PRIVACY_NOTICE_VERSION}`,
                leadId,
                { consent: true, consentNoticeVersion: PRIVACY_NOTICE_VERSION, source: lead.source },
            ),
        );

        await logApiAudit({
            action: "lead_captured",
            organizationId,
            metadata: { email: lead.email, source: lead.source, consent: PRIVACY_NOTICE_VERSION, leadId },
        });
        lazyMissionCoreClient().publishEvent({ type: "LeadGenerated", source: "customerJourney", payload: { leadId } });

        const status = (created as { status?: string }).status ?? "new";
        return NextResponse.json({ success: true, leadId, duplicate: false, status });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid request";
        const storageFailure = /lookup failed|storage failed/i.test(message);
        return NextResponse.json(
            { success: false, error: storageFailure ? "Lead intake is temporarily unavailable" : message },
            { status: storageFailure ? 503 : 400 },
        );
    }
}
