import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

/**
 * Lists only the authenticated caller's active organization memberships.
 * This endpoint is the read boundary for an explicit organization selector;
 * it never accepts a user/profile id from the request.
 */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, {
        rateLimitKey: `org-memberships:${ip}`,
        rateLimit: 60,
    });
    if (error || !context) {
        return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const client = getServiceRoleClient();
    if (!client) {
        return NextResponse.json(
            { error: "Organization service unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }

    const profile = await client
        .from("user_profiles")
        .select("id")
        .eq("auth_user_id", context.user.id)
        .maybeSingle();

    if (profile.error) {
        return NextResponse.json(
            { error: "Unable to resolve account profile" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }
    if (!profile.data?.id) {
        return NextResponse.json(
            { memberships: [], selectedOrganizationId: null },
            { status: 200, headers: { "Cache-Control": "no-store" } },
        );
    }

    const memberships = await client
        .from("organization_members")
        .select("organization_id,role_name")
        .eq("user_id", profile.data.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(100);

    if (memberships.error) {
        return NextResponse.json(
            { error: "Unable to load organization memberships" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }

    const rows = (memberships.data ?? []) as Array<{ organization_id: string; role_name: string }>;
    const ids = [...new Set(rows.map((row) => row.organization_id).filter(Boolean))];
    if (ids.length === 0) {
        return NextResponse.json(
            { memberships: [], selectedOrganizationId: null },
            { status: 200, headers: { "Cache-Control": "no-store" } },
        );
    }

    const organizations = await client
        .from("organizations")
        .select("id,name,slug,status")
        .in("id", ids);

    if (organizations.error) {
        return NextResponse.json(
            { error: "Unable to load organization details" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }

    const byId = new Map((organizations.data ?? []).map((org) => [org.id, org]));
    const result = rows.flatMap((membership) => {
        const organization = byId.get(membership.organization_id);
        if (!organization) return [];
        return [{
            organizationId: organization.id,
            name: organization.name,
            slug: organization.slug,
            status: organization.status,
            roleName: membership.role_name,
        }];
    });

    return NextResponse.json(
        {
            memberships: result,
            selectedOrganizationId: result.length === 1 ? result[0].organizationId : null,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
