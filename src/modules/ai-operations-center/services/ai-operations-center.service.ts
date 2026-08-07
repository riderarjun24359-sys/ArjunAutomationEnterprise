import type { UserRole } from "@/src/constants/roles";
import { aiOperationsCenterDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiOperationsCenterSnapshot,
    createEmptyAiOperationsCenterSnapshot,
} from "../builders/ai-operations-center.builders";
import { aiOperationsCenterRepository } from "../repository/ai-operations-center.repository";
import type { AiOperationsCenterSnapshot } from "../types";

export class AiOperationsCenterService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiOperationsCenterSnapshot> {
        const data = await aiOperationsCenterRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiOperationsCenterSnapshot(false, aiOperationsCenterDeniedMessage());
        }
        if (!data) {
            return createEmptyAiOperationsCenterSnapshot(
                true,
                "No organization context resolved for live AI Operations & Monitoring Center data.",
            );
        }
        return buildAiOperationsCenterSnapshot(data);
    }
}

export const aiOperationsCenterService = new AiOperationsCenterService();
