import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { DbWorkflowTrigger } from "@/src/modules/database/types/platform";
import type { IntegrationHubRawData } from "../types/raw";

const LIMIT = 500;

export class IntegrationHubRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<IntegrationHubRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

        const [
            hubs,
            connectedServices,
            connectorConfigs,
            connectorHealth,
            paymentConnectors,
            apiKeys,
            apiScopes,
            rateLimits,
            apiUsage,
            incomingWebhooks,
            outgoingWebhooks,
            webhookDeliveries,
            marketplaceConnectors,
            marketplaceInstallations,
            apiAnalytics,
            latencyMetrics,
            integrationHealth,
            integrationFailures,
            auditLogs,
            workflows,
            dweWebhookTriggers,
            dweEventTriggers,
            dweTimeTriggers,
        ] = await Promise.all([
            databaseService.intgIntegrationHubs.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgConnectedServices.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgConnectorConfigs.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgConnectorHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgPaymentConnectors.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgApiKeys.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgApiScopes.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgRateLimits.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgApiUsage.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgIncomingWebhooks.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgOutgoingWebhooks.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgWebhookDeliveryLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgMarketplaceConnectors.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgMarketplaceInstallations.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgApiAnalytics.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgLatencyMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgIntegrationHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgIntegrationFailures.listByOrganization(orgId, q).catch(() => []),
            databaseService.intgAuditLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.workflows.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWebhookTriggers.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweBusinessEventTriggers.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweTimeTriggers.listByOrganization(orgId, q).catch(() => []),
        ]);

        const workflowTriggers = await this.loadWorkflowTriggers(workflows.map((w) => w.id));

        return {
            organizationId: orgId,
            hubs,
            connectedServices,
            connectorConfigs,
            connectorHealth,
            paymentConnectors,
            apiKeys,
            apiScopes,
            rateLimits,
            apiUsage,
            incomingWebhooks,
            outgoingWebhooks,
            webhookDeliveries,
            marketplaceConnectors,
            marketplaceInstallations,
            apiAnalytics,
            latencyMetrics,
            integrationHealth,
            integrationFailures,
            auditLogs,
            workflows,
            workflowTriggers,
            dweWebhookTriggers,
            dweEventTriggers,
            dweTimeTriggers,
            fetchedAt: new Date().toISOString(),
        };
    }

    private async loadWorkflowTriggers(workflowIds: string[]): Promise<DbWorkflowTrigger[]> {
        if (workflowIds.length === 0) return [];
        const batches = await Promise.all(
            workflowIds.slice(0, 50).map((id) => databaseService.workflowTriggers.listByWorkflow(id).catch(() => [])),
        );
        return batches.flat();
    }
}

export const integrationHubRepository = new IntegrationHubRepository();
