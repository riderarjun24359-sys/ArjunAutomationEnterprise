import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function customerSuccessGrowthDeniedMessage(): string {
    return "Customer Acquisition & Success Growth Console is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
