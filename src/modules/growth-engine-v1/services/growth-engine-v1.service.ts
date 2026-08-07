import type { UserRole } from "@/src/constants/roles";
import { growthEngineV1DeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildGrowthEngineV1Snapshot,
    createEmptyGrowthEngineV1Snapshot,
} from "../builders/growth-engine-v1.builders";
import { growthEngineV1Repository } from "../repository/growth-engine-v1.repository";
import type { GrowthEngineV1Snapshot } from "../types";

export class GrowthEngineV1Service {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<GrowthEngineV1Snapshot> {
        const data = await growthEngineV1Repository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyGrowthEngineV1Snapshot(false, growthEngineV1DeniedMessage());
        }
        if (!data) {
            return createEmptyGrowthEngineV1Snapshot(true, "No organization context resolved for live Growth Engine v1 data.");
        }
        return buildGrowthEngineV1Snapshot(data);
    }
}

export const growthEngineV1Service = new GrowthEngineV1Service();
