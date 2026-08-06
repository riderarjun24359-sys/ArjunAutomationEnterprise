import { buildAiFinanceAssistant } from "../ai/ai-finance-assistant";
import {
    buildBillingFinanceSnapshot,
    createEmptyBillingFinanceSnapshot,
} from "../builders/billing-finance.builders";
import { billingFinanceRepository } from "../repository/billing-finance.repository";
import type { BillingFinanceSnapshot } from "../types/os";

export class BillingFinanceOsService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<BillingFinanceSnapshot> {
        const data = await billingFinanceRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        if (!data) return createEmptyBillingFinanceSnapshot();

        const base = buildBillingFinanceSnapshot(data);
        const assistant = buildAiFinanceAssistant(base);
        return { ...base, assistant };
    }
}

export const billingFinanceOsService = new BillingFinanceOsService();
