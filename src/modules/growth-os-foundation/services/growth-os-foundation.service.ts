import type { UserRole } from "@/src/constants/roles";
import { growthOsFoundationDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthOsFoundationSnapshot,
    createEmptyGrowthOsFoundationSnapshot,
} from "../builders/growth-os-foundation.builders";
import { growthOsFoundationRepository } from "../repository/growth-os-foundation.repository";
import type { GrowthOsFoundationSnapshot } from "../types";

export class GrowthOsFoundationService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthOsFoundationSnapshot> {
        const data = await growthOsFoundationRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthOsFoundationSnapshot(false, growthOsFoundationDeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthOsFoundationSnapshot(
                true,
                "No organization context resolved for live Growth OS Foundation data.",
            );
        }
        return buildGrowthOsFoundationSnapshot(data);
    }
}

export const growthOsFoundationService = new GrowthOsFoundationService();
