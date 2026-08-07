import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiFinanceBillingEngineDeniedMessage(): string {
    return "AI Finance & Billing Engine is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
