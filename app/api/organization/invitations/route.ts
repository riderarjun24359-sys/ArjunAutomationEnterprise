import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { opsLog } from "@/src/lib/ops-monitoring";
import { invitationInputSchema, canGrantInvite } from "@/src/lib/organization-provisioning";
import { sendTransactionalEmail } from "@/src/lib/email-delivery";

/**
 * Organization invitations (member management).
 *
 * - GET: pending + recent invitations for the CALLER's organization.
 *   Requires membership (secureApiRoute organizationId).
 * - POST: creates an invitation for the caller's organization. The invitee is
 *   emailed best-effort (only when an email provider is genuinely configured)
 *   and redeems the invite by signing in and accepting at
 *   POST /api/organization/invitations/accept. A failed/skipped notification
 *   never fails the request. Duplicate pending invites for the same email return
 *   the existing row instead of creating a second one.
 */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-invites:${ip}`, rateLimit: 60 });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) {
        return NextResponse.json({ error: "No organization context" }, { status: 403 });
    }

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure storage is not configured" }, { status: 503 });
    }

    const res = await serviceClient
        .from("organization_invitations")
        .select("id,email,role_name,status,expires_at")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false })
        .limit(100);
    if (res.error) {
        return NextResponse.json({ error: "Failed to load invitations" }, { status: 500 });
    }
    return NextResponse.json(
        { invitations: (res.data ?? []).map(mapInvitation) },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-invites-write:${ip}`, rateLimit: 20 });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) {
        return NextResponse.json({ error: "No organization context" }, { status: 403 });
    }

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure storage is not configured" }, { status: 503 });
    }

    let body: unknown = null;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const input = invitationInputSchema.safeParse(body);
    if (!input.success) {
        return NextResponse.json(
            { error: "Invalid input", detail: input.error.issues[0]?.message ?? "validation failed" },
            { status: 400 },
        );
    }

    // The inviter must be an active member of THIS organization, and may only
    // grant a role at or below their own (no member-to-admin escalation).
    const inviter = await findProfile(serviceClient, context.user.id);
    if (!inviter) {
        return NextResponse.json({ error: "No organization context" }, { status: 403 });
    }
    const mineRes = await serviceClient
        .from("organization_members")
        .select("role_name")
        .eq("organization_id", context.organizationId)
        .eq("user_id", inviter.id)
        .eq("is_active", true)
        .maybeSingle();
    const inviterRole = mineRes.error ? null : ((mineRes.data?.role_name as string | undefined) ?? null);
    if (!inviterRole) {
        return NextResponse.json({ error: "You are not an active member of this organization" }, { status: 403 });
    }
    const gate = canGrantInvite(inviterRole, input.data.roleName);
    if (!gate.ok) {
        return NextResponse.json({ error: gate.reason }, { status: 403 });
    }

    // Idempotency: a live pending invite for the same email is returned
    // instead of duplicated (safe for form retries and double-submits).
    const existing = await serviceClient
        .from("organization_invitations")
        .select("id,email,role_name,status,expires_at")
        .eq("organization_id", context.organizationId)
        .eq("email", input.data.email)
        .eq("status", "pending")
        .maybeSingle();
    if (existing.data && !existing.error) {
        return NextResponse.json({ invitation: mapInvitation(existing.data), duplicate: true }, { status: 200 });
    }

    const created = await serviceClient
        .from("organization_invitations")
        .insert({
            organization_id: context.organizationId,
            email: input.data.email,
            role_name: input.data.roleName,
            status: "pending",
            invited_by: inviter.id,
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select("id,email,role_name,status,expires_at")
        .maybeSingle();
    if (created.error || !created.data) {
        opsLog("error", "Invitation creation failed", "api/organization/invitations", {});
        return NextResponse.json({ error: "Invitation creation failed" }, { status: 500 });
    }

    // Best-effort notification email. The invitation is already durable; an
    // unconfigured or failing provider must never fail the request. The result
    // is logged truthfully (sent / skipped / failed) so a send is never implied.
    await notifyInvitee(serviceClient, {
        request,
        invitation: created.data,
        inviterName: (inviter.full_name as string | undefined) ?? "A teammate",
        organizationId: context.organizationId,
    });

    return NextResponse.json(
        { invitation: mapInvitation(created.data), duplicate: false },
        { status: 201, headers: { "Cache-Control": "no-store" } },
    );
}

type ServiceClient = NonNullable<ReturnType<typeof getServiceRoleClient>>;

interface InvitationRow {
    id: unknown;
    email: unknown;
    role_name: unknown;
    status: unknown;
    expires_at: unknown;
}

async function notifyInvitee(
    serviceClient: ServiceClient,
    args: { request: Request; invitation: InvitationRow; inviterName: string; organizationId: string },
): Promise<void> {
    try {
        const email = String(args.invitation.email ?? "").trim();
        if (!email) return;

        const orgRes = await serviceClient
            .from("organizations")
            .select("name")
            .eq("id", args.organizationId)
            .maybeSingle();
        const organizationName = (orgRes.data?.name as string | undefined) ?? "your organization";
        const origin = new URL(args.request.url).origin;
        const inviteUrl = `${origin}/onboarding?invite=${String(args.invitation.id ?? "")}`;

        const result = await sendTransactionalEmail({
            to: email,
            templateId: "invite-teammate",
            variables: { inviterName: args.inviterName, organizationName, inviteUrl },
        });
        if (result.ok) {
            opsLog("info", "Invitation email sent", "api/organization/invitations", { provider: result.provider });
        } else {
            opsLog("info", "Invitation email skipped", "api/organization/invitations", { reason: result.reason });
        }
    } catch (error) {
        opsLog("warn", "Invitation email failed", "api/organization/invitations", {
            detail: error instanceof Error ? error.message : String(error),
        });
    }
}

async function findProfile(serviceClient: ServiceClient, authUserId: string) {
    const res = await serviceClient.from("user_profiles").select("*").eq("auth_user_id", authUserId).maybeSingle();
    return res.error ? null : (res.data ?? null);
}

function mapInvitation(row: { id: unknown; email: unknown; role_name: unknown; status: unknown; expires_at: unknown }) {
    return {
        id: String(row.id ?? ""),
        email: String(row.email ?? ""),
        roleName: String(row.role_name ?? "member"),
        status: String(row.status ?? "pending"),
        expiresAt: typeof row.expires_at === "string" ? row.expires_at.slice(0, 10) : null,
    };
}
