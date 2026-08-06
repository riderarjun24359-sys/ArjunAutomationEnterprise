import { buildAiCustomerSuccessAssistant } from "../ai/customer-success-assistant";
import {
    buildCustomerSuccessSnapshot,
    createEmptyCustomerSuccessSnapshot,
} from "../builders/customer-success.builders";
import { customerSuccessRepository } from "../repository/customer-success.repository";
import type { CustomerSuccessSnapshot } from "../types/os";

export class CustomerSuccessOsService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<CustomerSuccessSnapshot> {
        const data = await customerSuccessRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        if (!data) return createEmptyCustomerSuccessSnapshot();

        const base = buildCustomerSuccessSnapshot(data);
        const assistant = buildAiCustomerSuccessAssistant(base);
        return { ...base, assistant };
    }
}

export const customerSuccessOsService = new CustomerSuccessOsService();
