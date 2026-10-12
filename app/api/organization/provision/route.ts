import { NextResponse } from "next/server";
import { getClientIp, secureApiRoute } from "@/src/lib/api-security";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { opsLog } from "@/src/lib/ops-monitoring";
import {
    provisionInputSchema,
    resolveSlug,
} from "@/src/lib/organization-provisioning";

/**
 * Organization provisioning — creates a tenant + first membership for the
 * CALLER's authenticated session. Identity comes from the session only; the
 * body carries just the new-tenant details.
 *
 * - 401 when unauthenticated (via secureApiRoute).
 * - 503 when server storage is unconfigured (fail closed, like intake).
 * - 200 + existing organization when the caller already has a membership
 *   (idempotent: retries never create duplicate tenants).
 * - 409 when the slug is taken (unique constraint race included).
 * - 201 on creation. If the membership write fails after the org row was
 *   created, the org row is deleted again so no orphan tenant is left behind.
 */
export async function GET(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-status:${ip}`, rateLimit: 60 });
    if (error || !context) return error ?? NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const serviceClient = getServiceRoleClient();
    if (!serviceClient) {
        return NextResponse.json({ error: "Secure storage is not configured" }, { status: 503 });
    }

    const profile = await findProfile(serviceClient, context.user.id);
    if (!profile) {
        return NextResponse.json({ organization: null, membership: null, needsProvisioning: true }, { status: 200 });
    }
    const memberships = await listMemberships(serviceClient, profile.id);
    const membership = memberships[0] ?? null;
    if (!membership) {
        return NextResponse.json({ organization: null, membership: null, needsProvisioning: true }, { status: 200 });
    }
    const org = await getOrganization(serviceClient, membership.organization_id);
    return NextResponse.json(
        {
            organization: org ? { id: org.id, name: org.name, slug: org.slug, status: org.status } : null,
            membership: { roleName: membership.role_name },
            needsProvisioning: !org,
        },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const { context, error } = await secureApiRoute(request, { rateLimitKey: `org-provision:${ip}`, rateLimit: 10 });
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
    const input = provisionInputSchema.safeParse(body);
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
    const slug = slugResult.slug;
    const name = input.data.name.trim();
    const authUserId = context.user.id;
    const email = context.user.email;
    const fullName = context.user.fullName ?? null;

    // Identity: profile for the session user, created on first provisioning.
    let profile = await findProfile(serviceClient, authUserId);
    if (!profile) {
        const created = await serviceClient
            .from("user_profiles")
            .insert({ auth_user_id: authUserId, email, full_name: fullName })
            .select("*")
            .maybeSingle();
        if (created.error || !created.data) {
            opsLog("error", "Organization provisioning failed", "api/organization/provision", { reason: "profile_create_failed" });
            return NextResponse.json({ error: "Provisioning failed" }, { status: 500 });
        }
        profile = created.data;
    }

    // Idempotency: a caller that already belongs anywhere keeps that tenant —
    // retries and double-submits never create a second organization.
    const existing = await listMemberships(serviceClient, profile.id);
    const current = existing[0] ?? null;
    if (current) {
        const org = await getOrganization(serviceClient, current.organization_id);
        return NextResponse.json(
            {
                organization: org ? { id: org.id, name: org.name, slug: org.slug, status: org.status } : null,
                membership: { roleName: current.role_name },
                provisioned: false,
            },
            { status: 200, headers: { "Cache-Control": "no-store" } },
        );
    }

    // Slug uniqueness, checked before insert; the unique constraint is the
    // backstop for races (23505 below maps to the same 409).
    const taken = await serviceClient.from("organizations").select("id").eq("slug", slug).maybeSingle();
    if (taken.data) {
        return NextResponse.json({ error: "Organization slug is already taken" }, { status: 409 });
    }

    const createdOrg = await serviceClient
        .from("organizations")
        .insert({ name, slug, status: "active", metadata: {} })
        .select("*")
        .maybeSingle();
    if (createdOrg.error || !createdOrg.data) {
        if (createdOrg.error?.code === "23505") {
            return NextResponse.json({ error: "Organization slug is already taken" }, { status: 409 });
        }
        opsLog("error", "Organization provisioning failed", "api/organization/provision", { reason: "org_create_failed" });
        return NextResponse.json({ error: "Provisioning failed" }, { status: 500 });
    }
    const org = createdOrg.data;

    // First member of a fresh tenant is founder (mirrors ensureMembership).
    const memberCount = await countMembers(serviceClient, org.id);
    const createdMembership = await serviceClient
        .from("organization_members")
        .insert({
            organization_id: org.id,
            user_id: profile.id,
            role_name: memberCount === 0 ? "founder" : "member",
            is_active: true,
        })
        .select("*")
        .maybeSingle();
    if (createdMembership.error || !createdMembership.data) {
        if (createdMembership.error?.code === "23505") {
            // Lost a slug/ membership race after the org row was created: the
            // caller is a member now — return that instead of failing.
            const retry = await listMemberships(serviceClient, profile.id);
            const won = retry[0] ?? null;
            if (won) {
                const wonOrg = await getOrganization(serviceClient, won.organization_id);
                await serviceClient.from("organizations").delete().eq("id", org.id);
                return NextResponse.json(
                    {
                        organization: wonOrg ? { id: wonOrg.id, name: wonOrg.name, slug: wonOrg.slug, status: wonOrg.status } : null,
                        membership: { roleName: won.role_name },
                        provisioned: false,
                    },
                    { status: 200, headers: { "Cache-Control": "no-store" } },
                );
            }
        }
        // Partial failure: remove the orphan org row so no unusable tenant
        // is left behind, then fail loudly.
        await serviceClient.from("organizations").delete().eq("id", org.id);
        opsLog("error", "Organization provisioning failed", "api/organization/provision", { reason: "membership_create_failed" });
        return NextResponse.json({ error: "Provisioning failed" }, { status: 500 });
    }

    opsLog("info", "Organization provisioned", "api/organization/provision", { organizationId: org.id });
    return NextResponse.json(
        {
            organization: { id: org.id, name: org.name, slug: org.slug, status: org.status },
            membership: { roleName: createdMembership.data.role_name },
            provisioned: true,
        },
        { status: 201, headers: { "Cache-Control": "no-store" } },
    );
}

type ServiceClient = NonNullable<ReturnType<typeof getServiceRoleClient>>;

async function findProfile(serviceClient: ServiceClient, authUserId: string) {
    const res = await serviceClient.from("user_profiles").select("*").eq("auth_user_id", authUserId).maybeSingle();
    return res.error ? null : (res.data ?? null);
}

async function listMemberships(serviceClient: ServiceClient, profileId: string) {
    const res = await serviceClient
        .from("organization_members")
        .select("*")
        .eq("user_id", profileId)
        .eq("is_active", true);
    if (res.error || !Array.isArray(res.data)) return [];
    return res.data;
}

async function getOrganization(serviceClient: ServiceClient, organizationId: string) {
    const res = await serviceClient.from("organizations").select("*").eq("id", organizationId).maybeSingle();
    return res.error ? null : (res.data ?? null);
}

async function countMembers(serviceClient: ServiceClient, organizationId: string): Promise<number> {
    const res = await serviceClient.from("organization_members").select("id").eq("organization_id", organizationId).limit(5);
    // On read failure assume non-empty: never grant founder when emptiness is unverified.
    if (res.error || !Array.isArray(res.data)) return 1;
    return res.data.length;
}
