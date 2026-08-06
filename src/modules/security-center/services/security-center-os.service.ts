import { buildAiSecurityAssistant } from "../ai/ai-security-assistant";
import {
    buildSecurityCenterSnapshot,
    createEmptySecurityCenterSnapshot,
} from "../builders/security-center.builders";
import { securityCenterOsRepository } from "../repository/security-center-os.repository";
import type { SecurityCenterSnapshot } from "../types/os";

export class SecurityCenterOsService {
    async getSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<SecurityCenterSnapshot> {
        const data = await securityCenterOsRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        if (!data) return createEmptySecurityCenterSnapshot();

        const base = buildSecurityCenterSnapshot(data);
        const assistant = buildAiSecurityAssistant(base);
        return { ...base, assistant };
    }
}

export const securityCenterOsService = new SecurityCenterOsService();
