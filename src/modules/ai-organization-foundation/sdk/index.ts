import { aiOrganizationFoundationService } from "@/src/modules/ai-organization-foundation/services/ai-organization-foundation.service";
import type { AofSdkRunAgoServiceInput, AofSdkRunAdoServiceInput, AofSdkRunAioServiceInput, AofSdkRunOrchestrationServiceInput } from "@/src/modules/ai-organization-foundation/types";

export class AgoService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunAgoServiceInput) { return this.client.runAgoService(input); }
}

export class AdoService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunAdoServiceInput) { return this.client.runAdoService(input); }
}

export class AioService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunAioServiceInput) { return this.client.runAioService(input); }
}

export class OrchestrationService {
    constructor(private readonly client: AiOrganizationFoundationClient) {}
    async run(input: AofSdkRunOrchestrationServiceInput) { return this.client.runOrchestrationService(input); }
}

export class AiOrganizationFoundationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly agoService = new AgoService(this);
    readonly adoService = new AdoService(this);
    readonly aioService = new AioService(this);
    readonly orchestrationService = new OrchestrationService(this);

    async runAgoService(input: AofSdkRunAgoServiceInput) {
        return aiOrganizationFoundationService.sdkRunAgoService(this.authUserId, this.email, input, this.fullName);
    }

    async runAdoService(input: AofSdkRunAdoServiceInput) {
        return aiOrganizationFoundationService.sdkRunAdoService(this.authUserId, this.email, input, this.fullName);
    }

    async runAioService(input: AofSdkRunAioServiceInput) {
        return aiOrganizationFoundationService.sdkRunAioService(this.authUserId, this.email, input, this.fullName);
    }

    async runOrchestrationService(input: AofSdkRunOrchestrationServiceInput) {
        return aiOrganizationFoundationService.sdkRunOrchestrationService(this.authUserId, this.email, input, this.fullName);
    }

    async getOrganizationHubs() {
        return aiOrganizationFoundationService.getOrganizationHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return aiOrganizationFoundationService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return aiOrganizationFoundationService.getPipelineInfo();
    }
}

export function createAiOrganizationFoundationClient(authUserId: string, email: string, fullName?: string | null): AiOrganizationFoundationClient {
    return new AiOrganizationFoundationClient(authUserId, email, fullName);
}

export { aiOrganizationFoundationService };
