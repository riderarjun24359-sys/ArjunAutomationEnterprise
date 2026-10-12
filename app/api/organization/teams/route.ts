import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { opsLog } from "@/src/lib/ops-monitoring";
import { teamInputSchema, resolveSlug } from "@/src/lib/organization-provisioning";

/**
 * Workspace teams — the caller's organization only (membership required via
 * secureApiRoute's organizationId). Teams are the workspace unit the
 * onboarding wizard provisions as step two.
 */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-teams:${ip}`, rateLimit: 60 });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!context.organizationId) {
        return NextResponse.json({ error: "No organization context" }, { status: 403 });
    }

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure storage is not configured" }, { status: 503 });
    }

    const res = await serviceClient
        .from("teams")
        .select("id,name,slug,description")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: true })
        .limit(100);
    if (res.error) {
        return NextResponse.json({ error: "Failed to load teams" }, { status: 500 });
    }
    return NextResponse.json(
        { teams: (res.data ?? []).map((t) => ({ id: t.id, name: t.name, slug: t.slug })) },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-teams-write:${ip}`, rateLimit: 20 });
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
    const input = teamInputSchema.safeParse(body);
    if (!input.success) {
        return NextResponse.json(
            { error: "Invalid input", detail: input.error.issues[0]?.message ?? "validation failed" },
            { status: 400 },
        );
    }
    const slugResult = resolveSlug(input.data.name, input.data.slug);
    if ("error" in slugResult) {
        return NextResponse.json({ error: "Invalid input", detail: slugResult.error }, { status: 400 });
    }

    // Slug uniqueness is per organization; the unique constraint stays as the
    // race backstop (23505 below maps to the same 409).
    const taken = await serviceClient
        .from("teams")
        .select("id")
        .eq("organization_id", context.organizationId)
        .eq("slug", slugResult.slug)
        .maybeSingle();
    if (taken.data && !taken.error) {
        return NextResponse.json({ error: "Team slug is already taken in this organization" }, { status: 409 });
    }

    const created = await serviceClient
        .from("teams")
        .insert({
            organization_id: context.organizationId,
            name: input.data.name.trim(),
            slug: slugResult.slug,
            description: "",
        })
        .select("id,name,slug")
        .maybeSingle();
    if (created.error || !created.data) {
        if (created.error?.code === "23505") {
            return NextResponse.json({ error: "Team slug is already taken in this organization" }, { status: 409 });
        }
        opsLog("error", "Team creation failed", "api/organization/teams", {});
        return NextResponse.json({ error: "Team creation failed" }, { status: 500 });
    }

    return NextResponse.json(
        { team: { id: created.data.id, name: created.data.name, slug: created.data.slug } },
        { status: 201, headers: { "Cache-Control": "no-store" } },
    );
}
