import type { UserRole } from "@/src/constants/roles";
import { growthOsContentDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthOsContentSnapshot,
    createEmptyGrowthOsContentSnapshot,
} from "../builders/growth-os-content.builders";
import { growthOsContentRepository } from "../repository/growth-os-content.repository";
import type { GrowthOsContentSnapshot } from "../types";

export class GrowthOsContentService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthOsContentSnapshot> {
        const data = await growthOsContentRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthOsContentSnapshot(false, growthOsContentDeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthOsContentSnapshot(
                true,
                "No organization context resolved for live Growth OS AI Content Engine data.",
            );
        }
        return buildGrowthOsContentSnapshot(data);
    }
}

export const growthOsContentService = new GrowthOsContentService();
