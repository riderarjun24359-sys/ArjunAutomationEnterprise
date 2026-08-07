import type { UserRole } from "@/src/constants/roles";
import { aiAutomationEngineDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiAutomationEngineSnapshot,
    createEmptyAiAutomationEngineSnapshot,
} from "../builders/ai-automation-engine.builders";
import { aiAutomationEngineRepository } from "../repository/ai-automation-engine.repository";
import type { AiAutomationEngineSnapshot } from "../types";

export class AiAutomationEngineService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiAutomationEngineSnapshot> {
        const data = await aiAutomationEngineRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiAutomationEngineSnapshot(false, aiAutomationEngineDeniedMessage());
        }
        if (!data) {
            return createEmptyAiAutomationEngineSnapshot(
                true,
                "No organization context resolved for live AI Automation & Workflow Engine data.",
            );
        }
        return buildAiAutomationEngineSnapshot(data);
    }
}

export const aiAutomationEngineService = new AiAutomationEngineService();
