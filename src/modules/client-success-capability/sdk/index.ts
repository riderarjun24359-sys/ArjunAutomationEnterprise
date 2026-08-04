import { clientSuccessCapabilityService } from "../services/client-success-capability.service";
import type { ClientSuccessServiceContext, ChangeRequestInput } from "../types";

export class ClientSuccessCapabilityClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    private ctx(): ClientSuccessServiceContext {
        return { authUserId: this.authUserId, email: this.email, fullName: this.fullName };
    }

    async runAiOnboarding(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.runAiOnboarding>[2]) {
        return clientSuccessCapabilityService.runAiOnboarding(this.ctx(), clientId, state);
    }

    async provisionProjectWorkspace(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.provisionProjectWorkspace>[2]) {
        return clientSuccessCapabilityService.provisionProjectWorkspace(this.ctx(), clientId, state);
    }

    getClientPortalData(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getClientPortalData>[1]) {
        return clientSuccessCapabilityService.getClientPortalData(clientId, state);
    }

    getCommunicationCenter(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getCommunicationCenter>[1]) {
        return clientSuccessCapabilityService.getCommunicationCenter(clientId, state);
    }

    getApprovalCenter(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getApprovalCenter>[1]) {
        return clientSuccessCapabilityService.getApprovalCenter(clientId, state);
    }

    async submitChangeRequest(input: ChangeRequestInput, state: Parameters<typeof clientSuccessCapabilityService.submitChangeRequest>[2]) {
        return clientSuccessCapabilityService.submitChangeRequest(this.ctx(), input, state);
    }

    getDeliveryCenter(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getDeliveryCenter>[1]) {
        return clientSuccessCapabilityService.getDeliveryCenter(clientId, state);
    }

    getCustomerHealth(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getCustomerHealth>[1]) {
        return clientSuccessCapabilityService.getCustomerHealth(clientId, state);
    }

    getRenewalGrowth(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getRenewalGrowth>[1]) {
        return clientSuccessCapabilityService.getRenewalGrowth(clientId, state);
    }

    getAiSuccessManagerInsights(clientId: string, state: Parameters<typeof clientSuccessCapabilityService.getAiSuccessManagerInsights>[1]) {
        return clientSuccessCapabilityService.getAiSuccessManagerInsights(clientId, state);
    }

    loadClients() {
        return clientSuccessCapabilityService.loadClients(this.ctx());
    }
}

export function createClientSuccessCapabilityClient(authUserId: string, email: string, fullName?: string | null) {
    return new ClientSuccessCapabilityClient(authUserId, email, fullName);
}

export { clientSuccessCapabilityService };
