import {
    buildClientActivityPayload,
    buildClientDashboardStats,
    buildCreateClientPayload,
    buildUpdateClientPayload,
    mapClientActivitySummary,
    mapClientContactSummary,
    mapClientProjectSummary,
    mapClientRecord,
} from "@/src/modules/database/lib/client-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    ClientActivitySummary,
    ClientContactSummary,
    ClientDashboardStats,
    ClientDetail,
    ClientProjectSummary,
    CreateClientInput,
    UpdateClientInput,
} from "@/src/modules/clients/types";

export class ClientService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getClients(authUserId: string, email: string, fullName?: string | null): Promise<ClientDetail[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.clients.listActiveClients(context.organizationId);
        return records.map(mapClientRecord);
    }

    async getClient(authUserId: string, email: string, id: string, fullName?: string | null): Promise<ClientDetail | undefined> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return undefined;
        }

        const record = await databaseService.clients.getById(id);
        if (!record || record.lifecycle_stage !== "client") {
            return undefined;
        }

        return mapClientRecord(record);
    }

    async createClient(authUserId: string, email: string, input: CreateClientInput, fullName?: string | null): Promise<ClientDetail> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            throw new Error("Unable to resolve organization context");
        }

        const created = await databaseService.clients.create(buildCreateClientPayload(context.organizationId, input));
        if (!created) {
            throw new Error("Failed to create client");
        }

        await databaseService.activityLogs.create(
            buildClientActivityPayload(context.organizationId, created.id, "create", created.name, "Client profile created"),
        );

        return mapClientRecord(created);
    }

    async updateClient(authUserId: string, email: string, id: string, input: UpdateClientInput, fullName?: string | null): Promise<ClientDetail | undefined> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return undefined;
        }

        const updated = await databaseService.clients.update(id, buildUpdateClientPayload(input));
        if (!updated) {
            return undefined;
        }

        await databaseService.activityLogs.create(
            buildClientActivityPayload(context.organizationId, updated.id, "update", updated.name, "Client profile updated"),
        );

        return mapClientRecord(updated);
    }

    async deleteClient(authUserId: string, email: string, id: string, fullName?: string | null): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return false;
        }

        const existing = await databaseService.clients.getById(id);
        if (!existing) {
            return false;
        }

        const deleted = await databaseService.clients.delete(id);
        if (deleted) {
            await databaseService.activityLogs.create(
                buildClientActivityPayload(context.organizationId, id, "delete", existing.name, "Client profile removed"),
            );
        }

        return deleted;
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<ClientDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return {
                totalClients: 0,
                activeClients: 0,
                atRiskClients: 0,
                inactiveClients: 0,
                linkedProjects: 0,
                totalRevenue: "₹0",
            };
        }

        const clients = await databaseService.clients.listActiveClients(context.organizationId);
        const projects = await Promise.all(clients.map((client) => databaseService.projects.listByClientId(client.id)));
        return buildClientDashboardStats(clients, projects.flat());
    }

    async getClientProjects(authUserId: string, email: string, clientId: string, fullName?: string | null): Promise<ClientProjectSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const projects = await databaseService.projects.listByClientId(clientId);
        return projects.map(mapClientProjectSummary);
    }

    async getClientContacts(authUserId: string, email: string, clientId: string, fullName?: string | null): Promise<ClientContactSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const client = await databaseService.clients.getById(clientId);
        if (!client?.company_id) {
            if (client?.primary_contact_id) {
                const contact = await databaseService.contacts.getById(client.primary_contact_id);
                return contact ? [mapClientContactSummary(contact)] : [];
            }

            return [];
        }

        const contacts = await databaseService.contacts.listByCompanyId(client.company_id);
        return contacts.map(mapClientContactSummary);
    }

    async getClientActivities(authUserId: string, email: string, clientId: string, fullName?: string | null): Promise<ClientActivitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.activityLogs.listByEntity(context.organizationId, "client", clientId);
        return records.map(mapClientActivitySummary);
    }
}

export const clientService = new ClientService();
