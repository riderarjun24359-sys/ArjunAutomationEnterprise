import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiMarketingGrowthEngineDeniedMessage(): string {
    return "AI Marketing & Growth Engine is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
