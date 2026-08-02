import { mapClientDetail, mapClientSummary } from "@/src/modules/database/lib/crm-mappers";
import { formatRelativeTimestamp } from "@/src/modules/database/lib/formatters";
import type { DbActivityLog, DbClient, DbContact, DbProject } from "@/src/modules/database/types/platform";
import type {
    ClientActivitySummary,
    ClientContactSummary,
    ClientDashboardStats,
    ClientDetail,
    ClientProjectSummary,
    ClientSummary,
    CreateClientInput,
    UpdateClientInput,
} from "@/src/modules/clients/types";

export { mapClientSummary, mapClientDetail };

export const mapClientRecord = (client: DbClient): ClientDetail => ({
    ...mapClientDetail(client),
    revenue: client.revenue,
    lifecycleStage: client.lifecycle_stage,
    manager: client.manager_name,
    assignedTo: client.assigned_to ?? "Unassigned",
    companyId: client.company_id ?? null,
    primaryContactId: client.primary_contact_id ?? null,
    createdAt: formatRelativeTimestamp(client.created_at),
});

export const mapClientProjectSummary = (project: DbProject): ClientProjectSummary => ({
    id: project.id,
    name: project.name,
    status: project.status,
    progress: project.progress,
    budget: project.budget,
    timeline: project.timeline,
    owner: project.owner_name,
});

export const mapClientContactSummary = (contact: DbContact): ClientContactSummary => ({
    id: contact.id,
    name: [contact.first_name, contact.last_name].filter(Boolean).join(" "),
    email: contact.email ?? "—",
    phone: contact.phone ?? "—",
    title: contact.title ?? "—",
});

export const mapClientActivitySummary = (log: DbActivityLog): ClientActivitySummary => ({
    id: log.id,
    action: log.action,
    title: log.title,
    detail: log.detail,
    timestamp: formatRelativeTimestamp(log.created_at),
});

export const buildClientDashboardStats = (clients: DbClient[], projects: DbProject[]): ClientDashboardStats => {
    const activeClients = clients.filter((client) => client.status === "active").length;
    const atRiskClients = clients.filter((client) => client.status === "at_risk").length;
    const inactiveClients = clients.filter((client) => client.status === "inactive").length;
    const totalRevenue = clients.reduce((sum, client) => {
        const normalized = client.revenue.trim().toLowerCase();
        const numeric = Number(normalized.replace(/[^\d.]/g, ""));
        const multiplier = normalized.includes("k") ? 1000 : normalized.includes("m") ? 1_000_000 : 1;
        return sum + (Number.isFinite(numeric) ? numeric * multiplier : 0);
    }, 0);

    const formattedRevenue =
        totalRevenue >= 1_000_000
            ? `$${Math.round(totalRevenue / 1_000_000)}M`
            : totalRevenue >= 1000
              ? `$${Math.round(totalRevenue / 1000)}k`
              : `$${totalRevenue}`;

    return {
        totalClients: clients.length,
        activeClients,
        atRiskClients,
        inactiveClients,
        linkedProjects: projects.length,
        totalRevenue: formattedRevenue,
    };
};

export const buildCreateClientPayload = (organizationId: string, input: CreateClientInput) => ({
    organization_id: organizationId,
    name: input.name,
    status: input.status,
    industry: input.industry,
    contact_email: input.contactEmail,
    manager_name: input.manager,
    revenue: input.revenue,
    phone: input.phone || null,
    website: input.website || null,
    address: input.address || null,
    description: input.description || null,
    lifecycle_stage: "client",
});

export const buildUpdateClientPayload = (input: UpdateClientInput) => {
    const payload: Record<string, unknown> = {};

    if (input.name !== undefined) payload.name = input.name;
    if (input.status !== undefined) payload.status = input.status;
    if (input.industry !== undefined) payload.industry = input.industry;
    if (input.contactEmail !== undefined) payload.contact_email = input.contactEmail;
    if (input.manager !== undefined) payload.manager_name = input.manager;
    if (input.revenue !== undefined) payload.revenue = input.revenue;
    if (input.phone !== undefined) payload.phone = input.phone || null;
    if (input.website !== undefined) payload.website = input.website || null;
    if (input.address !== undefined) payload.address = input.address || null;
    if (input.description !== undefined) payload.description = input.description || null;

    return payload;
};

export const buildClientActivityPayload = (organizationId: string, clientId: string, action: string, title: string, detail: string) => ({
    organization_id: organizationId,
    entity_type: "client",
    entity_id: clientId,
    action,
    title,
    detail,
    metadata: {},
});

export const toClientSummary = (client: ClientDetail): ClientSummary => ({
    id: client.id,
    name: client.name,
    status: client.status,
    industry: client.industry,
    contactEmail: client.contactEmail,
    manager: client.manager,
    revenue: client.revenue,
    updatedAt: client.updatedAt,
});
