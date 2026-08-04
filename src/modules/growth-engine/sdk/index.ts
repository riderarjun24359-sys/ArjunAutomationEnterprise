import { growthEngineService } from "@/src/modules/growth-engine/services/growth-engine.service";
import type {
    AageSdkRunBrandServiceInput,
    AageSdkRunContentFoundationServiceInput,
    AageSdkRunMediaFoundationServiceInput,
    AageSdkRunContentEngineServiceInput,
    AageSdkRunFounderDashboardServiceInput,
} from "@/src/modules/growth-engine/types";

export class BrandService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunBrandServiceInput) { return this.client.runBrandService(input); }
}

export class ContentFoundationService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunContentFoundationServiceInput) { return this.client.runContentFoundationService(input); }
}

export class MediaFoundationService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunMediaFoundationServiceInput) { return this.client.runMediaFoundationService(input); }
}

export class ContentEngineService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunContentEngineServiceInput) { return this.client.runContentEngineService(input); }
}

export class FounderDashboardService {
    constructor(private readonly client: GrowthEngineClient) {}
    async run(input: AageSdkRunFounderDashboardServiceInput) { return this.client.runFounderDashboardService(input); }
}

export class GrowthEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly brandService = new BrandService(this);
    readonly contentFoundationService = new ContentFoundationService(this);
    readonly mediaFoundationService = new MediaFoundationService(this);
    readonly contentEngineService = new ContentEngineService(this);
    readonly founderDashboardService = new FounderDashboardService(this);

    async runBrandService(input: AageSdkRunBrandServiceInput) {
        return growthEngineService.sdkRunBrandService(this.authUserId, this.email, input, this.fullName);
    }

    async runContentFoundationService(input: AageSdkRunContentFoundationServiceInput) {
        return growthEngineService.sdkRunContentFoundationService(this.authUserId, this.email, input, this.fullName);
    }

    async runMediaFoundationService(input: AageSdkRunMediaFoundationServiceInput) {
        return growthEngineService.sdkRunMediaFoundationService(this.authUserId, this.email, input, this.fullName);
    }

    async runContentEngineService(input: AageSdkRunContentEngineServiceInput) {
        return growthEngineService.sdkRunContentEngineService(this.authUserId, this.email, input, this.fullName);
    }

    async runFounderDashboardService(input: AageSdkRunFounderDashboardServiceInput) {
        return growthEngineService.sdkRunFounderDashboardService(this.authUserId, this.email, input, this.fullName);
    }

    async getGrowthHubs() {
        return growthEngineService.getGrowthHubs(this.authUserId, this.email, this.fullName);
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
