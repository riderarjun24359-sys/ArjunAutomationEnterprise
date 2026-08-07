import type { UserRole } from "@/src/constants/roles";
import { aiFinanceBillingEngineDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiFinanceBillingEngineSnapshot,
    createEmptyAiFinanceBillingEngineSnapshot,
} from "../builders/ai-finance-billing-engine.builders";
import { aiFinanceBillingEngineRepository } from "../repository/ai-finance-billing-engine.repository";
import type { AiFinanceBillingEngineSnapshot, CreateInvoiceInput } from "../types";

export class AiFinanceBillingEngineService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiFinanceBillingEngineSnapshot> {
        const data = await aiFinanceBillingEngineRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiFinanceBillingEngineSnapshot(false, aiFinanceBillingEngineDeniedMessage());
        }
        if (!data) {
            return createEmptyAiFinanceBillingEngineSnapshot(
                true,
                "No organization context resolved for live AI Finance & Billing Engine data.",
            );
        }
        return buildAiFinanceBillingEngineSnapshot(data);
    }

    async createInvoice(
        authUserId: string,
        email: string,
        input: CreateInvoiceInput,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<{ ok: boolean; id?: string; error?: string }> {
        const data = await aiFinanceBillingEngineRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return { ok: false, error: aiFinanceBillingEngineDeniedMessage() };
        }
        return aiFinanceBillingEngineRepository.createInvoice(authUserId, email, input, fullName);
    }
}

export const aiFinanceBillingEngineService = new AiFinanceBillingEngineService();
