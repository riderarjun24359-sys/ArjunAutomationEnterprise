import { buildAiIntegrationAssistant } from "../ai/ai-integration-assistant";
import {
    buildIntegrationHubSnapshot,
    createEmptyIntegrationHubSnapshot,
} from "../builders/integration-hub.builders";
import { integrationHubRepository } from "../repository/integration-hub.repository";
import type { IntegrationHubSnapshot } from "../types/os";

export class IntegrationHubOsService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationHubSnapshot> {
        const data = await integrationHubRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        if (!data) return createEmptyIntegrationHubSnapshot();

        const base = buildIntegrationHubSnapshot(data);
        const assistant = buildAiIntegrationAssistant(base);
        return { ...base, assistant };
    }
}

export const integrationHubOsService = new IntegrationHubOsService();
