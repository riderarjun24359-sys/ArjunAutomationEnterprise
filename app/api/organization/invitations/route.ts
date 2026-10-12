import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { opsLog } from "@/src/lib/ops-monitoring";
import { invitationInputSchema } from "@/src/lib/organization-provisioning";

/**
 * Organization invitations (member management).
 *
 * - GET: pending + recent invitations for the CALLER's organization.
 *   Requires membership (secureApiRoute organizationId).
 * - POST: creates an invitation for the caller's organization. The invitee is
 *   notified out-of-band (no email provider is configured); they redeem it by
 *   signing in and accepting at POST /api/organization/invitations/accept.
 *   Duplicate pending invites for the same email return the existing row
 *   instead of creating a second one.
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

    // The inviter must be a profile in this organization (secureApiRoute only
    // guarantees a session + org context, not which profile row is theirs).
    const inviter = await findProfile(serviceClient, context.user.id);
    if (!inviter) {
        return NextResponse.json({ error: "No organization context" }, { status: 403 });
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

    return NextResponse.json(
        { invitation: mapInvitation(created.data), duplicate: false },
        { status: 201, headers: { "Cache-Control": "no-store" } },
    );
}

type ServiceClient = NonNullable<ReturnType<typeof getServiceRoleClient>>;

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
