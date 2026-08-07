import type { UserRole } from "@/src/constants/roles";
import { aiMarketingGrowthEngineDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiMarketingGrowthEngineSnapshot,
    createEmptyAiMarketingGrowthEngineSnapshot,
} from "../builders/ai-marketing-growth-engine.builders";
import { aiMarketingGrowthEngineRepository } from "../repository/ai-marketing-growth-engine.repository";
import type { AiMarketingGrowthEngineSnapshot } from "../types";

export class AiMarketingGrowthEngineService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiMarketingGrowthEngineSnapshot> {
        const data = await aiMarketingGrowthEngineRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiMarketingGrowthEngineSnapshot(false, aiMarketingGrowthEngineDeniedMessage());
        }
        if (!data) {
            return createEmptyAiMarketingGrowthEngineSnapshot(
                true,
                "No organization context resolved for live AI Marketing & Growth Engine data.",
            );
        }
        return buildAiMarketingGrowthEngineSnapshot(data);
    }
}

export const aiMarketingGrowthEngineService = new AiMarketingGrowthEngineService();
