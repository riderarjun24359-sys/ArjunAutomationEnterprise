import { enterpriseIntelligencePlatformService } from "@/src/modules/enterprise-intelligence-platform/services/enterprise-intelligence-platform.service";
import type { EipSdkRunKpiServiceInput, EipSdkRunIntelligenceServiceInput, EipSdkRunForecastServiceInput, EipSdkRunReportingServiceInput, EipSdkRunExecutiveInsightServiceInput } from "@/src/modules/enterprise-intelligence-platform/types";

export class KpiService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunKpiServiceInput) { return this.client.runKpiService(input); }
}

export class IntelligenceService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunIntelligenceServiceInput) { return this.client.runIntelligenceService(input); }
}

export class ForecastService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunForecastServiceInput) { return this.client.runForecastService(input); }
}

export class ReportingService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunReportingServiceInput) { return this.client.runReportingService(input); }
}

export class ExecutiveInsightService {
    constructor(private readonly client: EnterpriseIntelligencePlatformClient) {}
    async run(input: EipSdkRunExecutiveInsightServiceInput) { return this.client.runExecutiveInsightService(input); }
}

export class EnterpriseIntelligencePlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly kpiService = new KpiService(this);
    readonly intelligenceService = new IntelligenceService(this);
    readonly forecastService = new ForecastService(this);
    readonly reportingService = new ReportingService(this);
    readonly executiveInsightService = new ExecutiveInsightService(this);

    async runKpiService(input: EipSdkRunKpiServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunKpiService(this.authUserId, this.email, input, this.fullName);
    }

    async runIntelligenceService(input: EipSdkRunIntelligenceServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunIntelligenceService(this.authUserId, this.email, input, this.fullName);
    }

    async runForecastService(input: EipSdkRunForecastServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunForecastService(this.authUserId, this.email, input, this.fullName);
    }

    async runReportingService(input: EipSdkRunReportingServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunReportingService(this.authUserId, this.email, input, this.fullName);
    }

    async runExecutiveInsightService(input: EipSdkRunExecutiveInsightServiceInput) {
        return enterpriseIntelligencePlatformService.sdkRunExecutiveInsightService(this.authUserId, this.email, input, this.fullName);
    }

    async getIntelligenceHubs() {
        return enterpriseIntelligencePlatformService.getIntelligenceHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return enterpriseIntelligencePlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return enterpriseIntelligencePlatformService.getPipelineInfo();
    }
}

export function createEnterpriseIntelligencePlatformClient(authUserId: string, email: string, fullName?: string | null): EnterpriseIntelligencePlatformClient {
    return new EnterpriseIntelligencePlatformClient(authUserId, email, fullName);
}

export { enterpriseIntelligencePlatformService };
