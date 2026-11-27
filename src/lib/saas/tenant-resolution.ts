import "server-only";

import { resolveTenantHost } from "@/src/lib/saas/tenant-host";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface VerifiedTenantContext {
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    profileId: string;
    roleName: string;
    hostname: string;
}

/**
 * Resolve a tenant from the incoming hostname and the authenticated identity.
 * A hostname is never sufficient on its own: the domain must be verified,
 * the organization must be active, and the caller must have an active
 * membership in that exact organization.
 */
export async function resolveVerifiedTenantContext(
    request: Request,
    authUserId: string,
): Promise<VerifiedTenantContext | null> {
    const client = getServiceRoleClient();
    if (!client || !authUserId.trim()) return null;

    let hostname = "";
    try {
        hostname = new URL(request.url).hostname.toLowerCase().replace(/\.$/, "");
    } catch {
        return null;
    }

    const host = resolveTenantHost(hostname);
    if (host.kind !== "tenant-subdomain" && host.kind !== "custom-domain") {
        return null;
    }

    const expectedDomainType = host.kind === "tenant-subdomain" ? "subdomain" : "custom";
    const domainResult = await client
        .from("organization_domains")
        .select("organization_id, hostname, domain_type, verification_status")
        .eq("hostname", host.hostname)
        .eq("domain_type", expectedDomainType)
        .eq("verification_status", "verified")
        .maybeSingle();

    if (domainResult.error || !domainResult.data) return null;
    const domain = domainResult.data as {
        organization_id: string;
        hostname: string;
        domain_type: string;
        verification_status: string;
    };

    // For platform subdomains, ensure the hostname slug still matches the
    // organization's canonical slug. This prevents stale/misassigned mappings.
    const organizationResult = await client
        .from("organizations")
        .select("id, name, slug, status")
        .eq("id", domain.organization_id)
        .eq("status", "active")
        .maybeSingle();

    if (organizationResult.error || !organizationResult.data) return null;
    const organization = organizationResult.data as {
        id: string;
        name: string;
        slug: string;
        status: string;
    };
    if (host.kind === "tenant-subdomain" && organization.slug !== host.slug) {
        return null;
    }

    const profileResult = await client
        .from("user_profiles")
        .select("id")
        .eq("auth_user_id", authUserId)
        .maybeSingle();
    if (profileResult.error || !profileResult.data) return null;

    const profileId = (profileResult.data as { id: string }).id;
    const membershipResult = await client
        .from("organization_members")
        .select("role_name")
        .eq("organization_id", organization.id)
        .eq("user_id", profileId)
        .eq("is_active", true)
        .maybeSingle();

    if (membershipResult.error || !membershipResult.data) return null;

    const roleName = (membershipResult.data as { role_name?: string }).role_name ?? "viewer";
    return {
        organizationId: organization.id,
        organizationName: organization.name,
        organizationSlug: organization.slug,
        profileId,
        roleName,
        hostname: host.hostname,
    };
}
