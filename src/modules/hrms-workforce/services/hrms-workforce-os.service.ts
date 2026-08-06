import { buildAiHrAssistant } from "../ai/ai-hr-assistant";
import {
    buildHrmsWorkforceSnapshot,
    createEmptyHrmsWorkforceSnapshot,
} from "../builders/hrms-workforce.builders";
import { hrmsWorkforceRepository } from "../repository/hrms-workforce.repository";
import type { HrmsWorkforceSnapshot } from "../types/os";

export class HrmsWorkforceOsService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<HrmsWorkforceSnapshot> {
        const data = await hrmsWorkforceRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        if (!data) return createEmptyHrmsWorkforceSnapshot();

        const base = buildHrmsWorkforceSnapshot(data);
        const assistant = buildAiHrAssistant(base);
        return { ...base, assistant };
    }
}

export const hrmsWorkforceOsService = new HrmsWorkforceOsService();
