import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { opsLog } from "@/src/lib/ops-monitoring";
import { acceptInvitationInputSchema } from "@/src/lib/organization-provisioning";

/**
 * Redeem an invitation addressed to the CALLER's session email.
 *
 * - 401 unauthenticated; 403 only via secureApiRoute permission model (none required here).
 * - 404 when the invitation does not exist (no existence oracle beyond the id).
 * - 400 when it is not pending, is expired, or is addressed to someone else.
 * - 200 + membership on success. Accept is idempotent: redeeming twice, or
 *   redeeming while already a member, returns the membership without a second
 *   row (unique organization_id+user_id backstop included).
 * - If the membership write succeeds but marking the invite `accepted` fails,
 *   the membership (the real effect) still stands and the response says so;
 *   re-accepting then completes the marking.
 */
export async function POST(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-invites-accept:${ip}`, rateLimit: 20 });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });

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
    const input = acceptInvitationInputSchema.safeParse(body);
    if (!input.success) {
        return NextResponse.json(
            { error: "Invalid input", detail: input.error.issues[0]?.message ?? "validation failed" },
            { status: 400 },
        );
    }

    const inviteRes = await serviceClient
        .from("organization_invitations")
        .select("*")
        .eq("id", input.data.invitationId)
        .maybeSingle();
    const invite = inviteRes.error ? null : (inviteRes.data ?? null);
    if (!invite) {
        return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }
    const callerEmail = context.user.email.trim().toLowerCase();
    if (String(invite.email ?? "").trim().toLowerCase() !== callerEmail) {
        return NextResponse.json({ error: "Invitation is addressed to another email" }, { status: 400 });
    }
    if (invite.status !== "pending") {
        return NextResponse.json({ error: `Invitation is ${invite.status}` }, { status: 400 });
    }
    if (new Date(invite.expires_at).getTime() <= Date.now()) {
        return NextResponse.json({ error: "Invitation has expired" }, { status: 400 });
    }

    // Identity: the acceptor's profile, created if this is their first touch.
    let profile = await findProfile(serviceClient, context.user.id);
    if (!profile) {
        const created = await serviceClient
            .from("user_profiles")
            .insert({ auth_user_id: context.user.id, email: context.user.email, full_name: context.user.fullName ?? null })
            .select("*")
            .maybeSingle();
        if (created.error || !created.data) {
            return NextResponse.json({ error: "Invitation accept failed" }, { status: 500 });
        }
        profile = created.data;
    }

    // Join semantics mirror ensureMembership: existing active membership wins;
    // a newcomer to an empty org becomes founder, otherwise the invited role.
    const prior = await serviceClient
        .from("organization_members")
        .select("*")
        .eq("user_id", profile.id)
        .eq("organization_id", invite.organization_id)
        .eq("is_active", true)
        .maybeSingle();
    let membership = prior.error ? null : (prior.data ?? null);
    if (!membership) {
        // The invited role wins unconditionally: an invitation is issued by an
        // existing member, so (unlike first-run bootstrap) there is no case
        // for founder elevation here. Unknown legacy values fall back to member.
        const invitedRole = (["viewer", "member", "manager", "admin"] as const).includes(invite.role_name)
            ? invite.role_name
            : "member";
        const inserted = await serviceClient
            .from("organization_members")
            .insert({
                organization_id: invite.organization_id,
                user_id: profile.id,
                role_name: invitedRole,
                is_active: true,
            })
            .select("*")
            .maybeSingle();
        if (inserted.error || !inserted.data) {
            if (inserted.error?.code === "23505") {
                const reread = await serviceClient
                    .from("organization_members")
                    .select("*")
                    .eq("user_id", profile.id)
                    .eq("organization_id", invite.organization_id)
                    .eq("is_active", true)
                    .maybeSingle();
                membership = reread.error ? null : (reread.data ?? null);
            }
            if (!membership) {
                opsLog("error", "Invitation accept failed", "api/organization/invitations/accept", {});
                return NextResponse.json({ error: "Invitation accept failed" }, { status: 500 });
            }
        } else {
            membership = inserted.data;
        }
    }

    const marked = await serviceClient
        .from("organization_invitations")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", invite.id)
        .select("id")
        .maybeSingle();

    const orgRes = await serviceClient.from("organizations").select("id,name,slug,status").eq("id", invite.organization_id).maybeSingle();
    const org = orgRes.error ? null : (orgRes.data ?? null);
    return NextResponse.json(
        {
            organization: org ? { id: org.id, name: org.name, slug: org.slug, status: org.status } : null,
            membership: { roleName: membership.role_name },
            inviteMarkedAccepted: !marked.error && Boolean(marked.data),
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}

type ServiceClient = NonNullable<ReturnType<typeof getServiceRoleClient>>;

async function findProfile(serviceClient: ServiceClient, authUserId: string) {
    const res = await serviceClient.from("user_profiles").select("*").eq("auth_user_id", authUserId).maybeSingle();
    return res.error ? null : (res.data ?? null);
}
