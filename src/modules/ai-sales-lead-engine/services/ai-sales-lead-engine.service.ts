import type { UserRole } from "@/src/constants/roles";
import { aiSalesLeadEngineDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiSalesLeadEngineSnapshot,
    createEmptyAiSalesLeadEngineSnapshot,
} from "../builders/ai-sales-lead-engine.builders";
import { aiSalesLeadEngineRepository } from "../repository/ai-sales-lead-engine.repository";
import type { AiSalesLeadEngineSnapshot } from "../types";

export class AiSalesLeadEngineService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiSalesLeadEngineSnapshot> {
        const data = await aiSalesLeadEngineRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiSalesLeadEngineSnapshot(false, aiSalesLeadEngineDeniedMessage());
        }
        if (!data) {
            return createEmptyAiSalesLeadEngineSnapshot(
                true,
                "No organization context resolved for live AI Sales & Lead Generation Engine data.",
            );
        }
        return buildAiSalesLeadEngineSnapshot(data);
    }
}

export const aiSalesLeadEngineService = new AiSalesLeadEngineService();
