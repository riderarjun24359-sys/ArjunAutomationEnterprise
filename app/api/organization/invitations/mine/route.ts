import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

/**
 * Invitations addressed to the CALLER (matched by session email, lowercased).
 * Needs no organization context — this is how a signed-in user without a
 * tenant discovers they were invited to one.
 */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-invites-mine:${ip}`, rateLimit: 60 });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure storage is not configured" }, { status: 503 });
    }

    const email = context.user.email.trim().toLowerCase();
    const res = await serviceClient
        .from("organization_invitations")
        .select("id,organization_id,email,role_name,status,expires_at")
        .eq("email", email)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(50);
    if (res.error) {
        return NextResponse.json({ error: "Failed to load invitations" }, { status: 500 });
    }
    const rows = (res.data ?? []).filter(
        (row) => new Date(row.expires_at).getTime() > Date.now(),
    );
    const orgIds = [...new Set(rows.map((row) => row.organization_id).filter(Boolean))];
    const orgNames = new Map<string, { name: string; slug: string }>();
    if (orgIds.length > 0) {
        const orgs = await serviceClient.from("organizations").select("id,name,slug").in("id", orgIds);
        for (const org of orgs.data ?? []) {
            orgNames.set(org.id, { name: org.name, slug: org.slug });
        }
    }
    return NextResponse.json(
        {
            invitations: rows.map((row) => ({
                id: row.id,
                email: row.email,
                roleName: row.role_name,
                status: row.status,
                expiresAt: typeof row.expires_at === "string" ? row.expires_at.slice(0, 10) : null,
                organization: orgNames.get(row.organization_id) ?? null,
            })),
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
