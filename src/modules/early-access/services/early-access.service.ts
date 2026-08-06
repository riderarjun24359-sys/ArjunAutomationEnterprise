import type { UserRole } from "@/src/constants/roles";
import { earlyAccessDeniedMessage, isFounderOrAdminAccess } from "../access";
import { buildEarlyAccessSnapshot, createEmptyEarlyAccessSnapshot } from "../builders/early-access.builders";
import { earlyAccessRepository } from "../repository/early-access.repository";
import type { EarlyAccessSnapshot } from "../types";

export class EarlyAccessService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<EarlyAccessSnapshot> {
        const data = await earlyAccessRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyEarlyAccessSnapshot(false, earlyAccessDeniedMessage());
        }
        if (!data) {
            return createEmptyEarlyAccessSnapshot(true, "No organization context resolved for live Early Access data.");
        }
        return buildEarlyAccessSnapshot(data);
    }
}

export const earlyAccessService = new EarlyAccessService();
