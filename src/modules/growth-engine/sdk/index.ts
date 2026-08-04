import { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
import type {
    AagoSdkRunBrandOsServiceInput,
    AagoSdkRunCreativeStudioServiceInput,
    AagoSdkRunDistributionServiceInput,
    AagoSdkRunGrowthIntelligenceServiceInput,
    AagoSdkRunCommandCenterServiceInput,
} from "@/src/modules/growth-engine/types";

export class BrandOsService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunBrandOsServiceInput) { return this.client.runBrandOsService(input); }
}

export class CreativeStudioService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunCreativeStudioServiceInput) { return this.client.runCreativeStudioService(input); }
}

export class DistributionService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunDistributionServiceInput) { return this.client.runDistributionService(input); }
}

export class GrowthIntelligenceService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunGrowthIntelligenceServiceInput) { return this.client.runGrowthIntelligenceService(input); }
}

export class CommandCenterService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AagoSdkRunCommandCenterServiceInput) { return this.client.runCommandCenterService(input); }
}

export class GrowthEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly brandOsService = new BrandOsService(this);
    readonly creativeStudioService = new CreativeStudioService(this);
    readonly distributionService = new DistributionService(this);
    readonly growthIntelligenceService = new GrowthIntelligenceService(this);
    readonly commandCenterService = new CommandCenterService(this);

    async runBrandOsService(input: AagoSdkRunBrandOsServiceInput) {
        return growthEngineService.sdkRunBrandOsService(this.authUserId, this.email, input, this.fullName);
    }

    async runCreativeStudioService(input: AagoSdkRunCreativeStudioServiceInput) {
        return growthEngineService.sdkRunCreativeStudioService(this.authUserId, this.email, input, this.fullName);
    }

    async runDistributionService(input: AagoSdkRunDistributionServiceInput) {
        return growthEngineService.sdkRunDistributionService(this.authUserId, this.email, input, this.fullName);
    }

    async runGrowthIntelligenceService(input: AagoSdkRunGrowthIntelligenceServiceInput) {
        return growthEngineService.sdkRunGrowthIntelligenceService(this.authUserId, this.email, input, this.fullName);
    }

    async runCommandCenterService(input: AagoSdkRunCommandCenterServiceInput) {
        return growthEngineService.sdkRunCommandCenterService(this.authUserId, this.email, input, this.fullName);
    }

    async getOperationsHubs() {
        return growthEngineService.getOperationsHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return growthEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return growthEngineService.getPipelineInfo();
    }
}

export function createGrowthEngineClient(authUserId: string, email: string, fullName?: string | null): GrowthEngineClient {
    return new GrowthEngineClient(authUserId, email, fullName);
}

export { growthEngineService };
