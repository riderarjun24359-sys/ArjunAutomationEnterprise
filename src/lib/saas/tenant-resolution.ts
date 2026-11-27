import { resolveTenantHost } from "@/src/lib/saas/tenant-host";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface VerifiedTenantDomainContext {
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    hostname: string;
}

export interface VerifiedTenantContext extends VerifiedTenantDomainContext {
    profileId: string;
    roleName: string;
}

/**
 * Resolve only a verified, active tenant hostname. A hostname by itself is
 * never authorization; subdomain slugs must match the organization's
 * canonical slug and custom domains must have a verified domain record.
 */
export async function resolveVerifiedTenantDomainContext(
    request: Request,
): Promise<VerifiedTenantDomainContext | null> {
    const client = getServiceRoleClient();
    if (!client) return null;

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

    return {
        organizationId: organization.id,
        organizationName: organization.name,
        organizationSlug: organization.slug,
        hostname: host.hostname,
    };
}

/**
 * Resolve a verified tenant hostname for an authenticated member. The
 * hostname must be verified, the organization active, and the caller an
 * active member of that exact organization.
 */
export async function resolveVerifiedTenantContext(
    request: Request,
    authUserId: string,
): Promise<VerifiedTenantContext | null> {
    if (!authUserId.trim()) return null;

    const client = getServiceRoleClient();
    if (!client) return null;

    const domain = await resolveVerifiedTenantDomainContext(request);
    if (!domain) return null;

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
        .eq("organization_id", domain.organizationId)
        .eq("user_id", profileId)
        .eq("is_active", true)
        .maybeSingle();

    if (membershipResult.error || !membershipResult.data) return null;

    const roleName = (membershipResult.data as { role_name?: string }).role_name ?? "viewer";
    return {
        ...domain,
        profileId,
        roleName,
    };
}
