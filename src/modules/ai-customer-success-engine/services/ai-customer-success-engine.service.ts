import type { UserRole } from "@/src/constants/roles";
import { aiCustomerSuccessEngineDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiCustomerSuccessEngineSnapshot,
    createEmptyAiCustomerSuccessEngineSnapshot,
} from "../builders/ai-customer-success-engine.builders";
import { aiCustomerSuccessEngineRepository } from "../repository/ai-customer-success-engine.repository";
import type { AiCustomerSuccessEngineSnapshot } from "../types";

export class AiCustomerSuccessEngineService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiCustomerSuccessEngineSnapshot> {
        const data = await aiCustomerSuccessEngineRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiCustomerSuccessEngineSnapshot(false, aiCustomerSuccessEngineDeniedMessage());
        }
        if (!data) {
            return createEmptyAiCustomerSuccessEngineSnapshot(
                true,
                "No organization context resolved for live AI Customer Success & Support Engine data.",
            );
        }
        return buildAiCustomerSuccessEngineSnapshot(data);
    }
}

export const aiCustomerSuccessEngineService = new AiCustomerSuccessEngineService();
