import { databaseService } from "@/src/modules/database/services/database-service";
import { hasFounderAdminMembershipRole, isPlatformFounderEmail } from "@/src/modules/database/lib/platform-founder";

export interface OrganizationContext {
    profileId: string;
    organizationId: string;
}

// Deduplicate concurrent lookups only. Do not cache resolved tenant identity:
 // membership revocation or organization suspension must take effect on the
 // next request, not after an arbitrary TTL.
const contextInflight = new Map<string, Promise<OrganizationContext | null>>();

async function ensurePlatformFounderRole(
    email: string,
    profileId: string,
    organizationId: string,
    membershipRole: string | null | undefined,
): Promise<void> {
    if (!isPlatformFounderEmail(email)) {
        return;
    }
    if (hasFounderAdminMembershipRole(membershipRole)) {
        return;
    }

    await databaseService.memberships.updateRole(organizationId, profileId, "founder");
}

async function resolveOrganizationContextUncached(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<OrganizationContext | null> {
    let profile = await databaseService.profiles.getByAuthUser(authUserId);

    if (!profile) {
        profile = await databaseService.profiles.upsertForAuthUser({ authUserId, email, fullName });
    }

    if (!profile) {
        return null;
    }

    const memberships = await databaseService.memberships.getByUser(profile.id);

    // A browser selection is only a hint, never authority: accept it only
    // when it exactly matches one of the caller's currently active memberships.
    // Server API routes independently validate the selected organization header
    // or cookie against the authenticated user's membership before access.
    const selectedOrganizationId =
        typeof window !== "undefined"
            ? window.localStorage.getItem("aae:selected-organization")
            : null;
    const selectedMembership = selectedOrganizationId
        ? memberships.find((membership) => membership.organization_id === selectedOrganizationId)
        : null;

    if (memberships.length > 1 && !selectedMembership) {
        return null;
    }

    let organizationId = selectedMembership?.organization_id ?? memberships[0]?.organization_id ?? null;

    if (!organizationId) {
        // Secure bootstrap: a user with no membership is attached ONLY to an
        // organization that has no members yet (genuine first-run bootstrap —
        // ensureMembership then makes them founder). A stranger is never
        // auto-joined to a populated tenant: they resolve to null (fail
        // closed) until provisioned via an explicit membership/invite.
        // Previously any authenticated user was attached to the first-listed
        // organization, exposing that tenant's data.
        const organizations = await databaseService.organizations.list({ limit: 10 });
        for (const candidate of organizations) {
            // Any-status check: an org that has EVER had a member (active or
            // inactive) is never adoptable — this closes the abandoned-org
            // edge where all members were deactivated but data remains.
            const existingMembers = await databaseService.memberships.listByOrganizationAnyStatus(candidate.id);
            if (existingMembers.length === 0) {
                organizationId = candidate.id;
                break;
            }
        }
    }

    if (!organizationId) {
        return null;
    }

    // Browser/service repository access must enforce the same tenant lifecycle
    // rule as server API identity resolution. An active membership in a
    // suspended organization is not sufficient to open tenant data.
    const organization = await databaseService.organizations.getById(organizationId);
    if (!organization || organization.status !== "active") {
        return null;
    }

    if (!memberships.some((membership) => membership.organization_id === organizationId)) {
        const seedRole = isPlatformFounderEmail(email) ? "founder" : undefined;
        await databaseService.memberships.ensureMembership(organizationId, profile.id, seedRole);
    }

    const refreshedMemberships = await databaseService.memberships.getByUser(profile.id);
    // Never borrow a role from another tenant. If this organization has no
    // matching membership, treat the role as unknown and fail closed.
    const membershipRole =
        refreshedMemberships.find((membership) => membership.organization_id === organizationId)?.role_name ??
        null;

    await ensurePlatformFounderRole(email, profile.id, organizationId, membershipRole);

    return { profileId: profile.id, organizationId };
}

/** Resolves tenant context while deduplicating only simultaneous lookups. */
export const resolveOrganizationContext = async (
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<OrganizationContext | null> => {
    const key = `${authUserId}:${email.toLowerCase()}`;
    const inflight = contextInflight.get(key);
    if (inflight) return inflight;

    const value = resolveOrganizationContextUncached(authUserId, email, fullName);
    contextInflight.set(key, value);
    try {
        return await value;
    } finally {
        if (contextInflight.get(key) === value) {
            contextInflight.delete(key);
        }
    }
};
