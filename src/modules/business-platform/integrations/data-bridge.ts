import { databaseService } from "@/src/modules/database/services/database-service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";

export async function fetchClients(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return [];
    return databaseService.clients.listByOrganization(ctx.organizationId);
}

export async function fetchActiveClients(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return [];
    return databaseService.clients.listActiveClients(ctx.organizationId);
}

export async function fetchEmployees(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return [];
    return databaseService.employees.listByOrganization(ctx.organizationId);
}

export async function fetchTeams(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return [];
    return databaseService.teams.listByOrganization(ctx.organizationId);
}

export async function fetchAnalyticsMetrics(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return [];
    return databaseService.analyticsMetrics.listByOrganization(ctx.organizationId);
}

export async function fetchOrganizationSettings(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return null;
    return databaseService.organizationSettings.getByOrganization(ctx.organizationId);
}

export async function fetchApiKeys(authUserId: string, email: string, fullName?: string | null) {
    const ctx = await resolveOrganizationContext(authUserId, email, fullName);
    if (!ctx) return [];
    return databaseService.apiKeys.listByOrganization(ctx.organizationId);
}
