import { enterpriseIdentityService } from "@/src/modules/enterprise-identity/services/enterprise-identity.service";
import type { IdpSdkEnrollMfaInput, IdpSdkInviteUserInput, IdpSdkProvisionRealmInput } from "@/src/modules/enterprise-identity/types";

export class EnterpriseIdentityClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async provisionRealm(input: IdpSdkProvisionRealmInput) {
        return enterpriseIdentityService.sdkProvisionRealm(this.authUserId, this.email, input, this.fullName);
    }

    async enrollMfa(input: IdpSdkEnrollMfaInput) {
        return enterpriseIdentityService.sdkEnrollMfa(this.authUserId, this.email, input, this.fullName);
    }

    async inviteUser(input: IdpSdkInviteUserInput) {
        return enterpriseIdentityService.sdkInviteUser(this.authUserId, this.email, input, this.fullName);
    }

    async getRealms() {
        return enterpriseIdentityService.getRealms(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return enterpriseIdentityService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return enterpriseIdentityService.getPipelineInfo();
    }
}

export function createEnterpriseIdentityClient(authUserId: string, email: string, fullName?: string | null): EnterpriseIdentityClient {
    return new EnterpriseIdentityClient(authUserId, email, fullName);
}

export { enterpriseIdentityService };
