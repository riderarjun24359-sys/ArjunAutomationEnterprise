import type { UserRole } from "@/src/constants/roles";
import { enterpriseIntegrationsDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildEnterpriseIntegrationsSnapshot,
    createEmptyEnterpriseIntegrationsSnapshot,
} from "../builders/enterprise-integrations.builders";
import { enterpriseIntegrationsRepository } from "../repository/enterprise-integrations.repository";
import type { EnterpriseIntegrationsSnapshot } from "../types";

export class EnterpriseIntegrationsService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<EnterpriseIntegrationsSnapshot> {
        const data = await enterpriseIntegrationsRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyEnterpriseIntegrationsSnapshot(false, enterpriseIntegrationsDeniedMessage());
        }
        if (!data) {
            return createEmptyEnterpriseIntegrationsSnapshot(
                true,
                "No organization context resolved for live Enterprise Integration & AI Execution Platform data.",
            );
        }
        return buildEnterpriseIntegrationsSnapshot(data);
    }
}

export const enterpriseIntegrationsService = new EnterpriseIntegrationsService();
