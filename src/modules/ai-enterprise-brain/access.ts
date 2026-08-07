import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiEnterpriseBrainDeniedMessage(): string {
    return "AI Enterprise Brain is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
