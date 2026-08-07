import type { UserRole } from "@/src/constants/roles";
import { aiEnterpriseBrainDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiEnterpriseBrainSnapshot,
    createEmptyAiEnterpriseBrainSnapshot,
} from "../builders/ai-enterprise-brain.builders";
import { aiEnterpriseBrainRepository } from "../repository/ai-enterprise-brain.repository";
import type { AiEnterpriseBrainSnapshot } from "../types";

export class AiEnterpriseBrainService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiEnterpriseBrainSnapshot> {
        const data = await aiEnterpriseBrainRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiEnterpriseBrainSnapshot(false, aiEnterpriseBrainDeniedMessage());
        }
        if (!data) {
            return createEmptyAiEnterpriseBrainSnapshot(
                true,
                "No organization context resolved for live AI Enterprise Brain data.",
            );
        }
        return buildAiEnterpriseBrainSnapshot(data);
    }
}

export const aiEnterpriseBrainService = new AiEnterpriseBrainService();
