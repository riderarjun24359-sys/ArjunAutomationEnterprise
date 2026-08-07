import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiSalesLeadEngineDeniedMessage(): string {
    return "AI Sales & Lead Generation Engine is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
