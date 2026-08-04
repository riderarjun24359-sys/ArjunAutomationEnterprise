import { enterpriseGovernancePlatformService } from "@/src/modules/enterprise-governance-platform/services/enterprise-governance-platform.service";
import type {
    EgpSdkRunGovernanceServiceInput,
    EgpSdkRunComplianceServiceInput,
    EgpSdkRunAuditServiceInput,
    EgpSdkRunDataGovernanceServiceInput,
    EgpSdkRunRiskManagementServiceInput,
    EgpSdkRunDashboardServiceInput,
} from "@/src/modules/enterprise-governance-platform/types";

export class GovernanceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunGovernanceServiceInput) { return this.client.runGovernanceService(input); }
}

export class ComplianceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunComplianceServiceInput) { return this.client.runComplianceService(input); }
}

export class AuditService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunAuditServiceInput) { return this.client.runAuditService(input); }
}

export class DataGovernanceService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunDataGovernanceServiceInput) { return this.client.runDataGovernanceService(input); }
}

export class RiskManagementService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunRiskManagementServiceInput) { return this.client.runRiskManagementService(input); }
}

export class DashboardService {
    constructor(private readonly client: EnterpriseGovernancePlatformClient) {}
    async run(input: EgpSdkRunDashboardServiceInput) { return this.client.runDashboardService(input); }
}

export class EnterpriseGovernancePlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    readonly governanceService = new GovernanceService(this);
    readonly complianceService = new ComplianceService(this);
    readonly auditService = new AuditService(this);
    readonly dataGovernanceService = new DataGovernanceService(this);
    readonly riskManagementService = new RiskManagementService(this);
    readonly dashboardService = new DashboardService(this);

    async runGovernanceService(input: EgpSdkRunGovernanceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunGovernanceService(this.authUserId, this.email, input, this.fullName);
    }

    async runComplianceService(input: EgpSdkRunComplianceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunComplianceService(this.authUserId, this.email, input, this.fullName);
    }

    async runAuditService(input: EgpSdkRunAuditServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunAuditService(this.authUserId, this.email, input, this.fullName);
    }

    async runDataGovernanceService(input: EgpSdkRunDataGovernanceServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunDataGovernanceService(this.authUserId, this.email, input, this.fullName);
    }

    async runRiskManagementService(input: EgpSdkRunRiskManagementServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunRiskManagementService(this.authUserId, this.email, input, this.fullName);
    }

    async runDashboardService(input: EgpSdkRunDashboardServiceInput) {
        return enterpriseGovernancePlatformService.sdkRunDashboardService(this.authUserId, this.email, input, this.fullName);
    }

    async getGovernanceHubs() {
        return enterpriseGovernancePlatformService.getGovernanceHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return enterpriseGovernancePlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return enterpriseGovernancePlatformService.getPipelineInfo();
    }
}

export function createEnterpriseGovernancePlatformClient(authUserId: string, email: string, fullName?: string | null): EnterpriseGovernancePlatformClient {
    return new EnterpriseGovernancePlatformClient(authUserId, email, fullName);
}

export { enterpriseGovernancePlatformService };
