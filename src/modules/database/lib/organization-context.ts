import { databaseService } from "@/src/modules/database/services/database-service";

export interface OrganizationContext {
    profileId: string;
    organizationId: string;
}

const CONTEXT_TTL_MS = 15_000;
const contextCache = new Map<string, { expiresAt: number; value: Promise<OrganizationContext | null> }>();

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
    let organizationId = memberships[0]?.organization_id ?? null;

    if (!organizationId) {
        const organizations = await databaseService.organizations.list({ limit: 1 });
        organizationId = organizations[0]?.id ?? null;
    }

    if (!organizationId) {
        return null;
    }

    if (!memberships.some((membership) => membership.organization_id === organizationId)) {
        await databaseService.memberships.ensureMembership(organizationId, profile.id);
    }

    return { profileId: profile.id, organizationId };
}

/** Resolves tenant context with a short in-memory TTL to collapse parallel ECC/OS lookups. */
export const resolveOrganizationContext = async (
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<OrganizationContext | null> => {
    const key = `${authUserId}:${email.toLowerCase()}`;
    const now = Date.now();
    const cached = contextCache.get(key);
    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    const value = resolveOrganizationContextUncached(authUserId, email, fullName);
    contextCache.set(key, { expiresAt: now + CONTEXT_TTL_MS, value });
    try {
        return await value;
    } catch (error) {
        contextCache.delete(key);
        throw error;
    }
};
