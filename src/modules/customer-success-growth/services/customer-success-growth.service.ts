import type { UserRole } from "@/src/constants/roles";
import { customerSuccessGrowthDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildCustomerSuccessGrowthSnapshot,
    createEmptyCustomerSuccessGrowthSnapshot,
} from "../builders/customer-success-growth.builders";
import { customerSuccessGrowthRepository } from "../repository/customer-success-growth.repository";
import type { CustomerSuccessGrowthSnapshot } from "../types";

export class CustomerSuccessGrowthService {
    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<CustomerSuccessGrowthSnapshot> {
        const data = await customerSuccessGrowthRepository.loadOrganizationData(authUserId, email, fullName).catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyCustomerSuccessGrowthSnapshot(false, customerSuccessGrowthDeniedMessage());
        }
        if (!data) {
            return createEmptyCustomerSuccessGrowthSnapshot(true, "No organization context resolved for live Customer Success Growth data.");
        }
        return buildCustomerSuccessGrowthSnapshot(data);
    }
}

export const customerSuccessGrowthService = new CustomerSuccessGrowthService();
