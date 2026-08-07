import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function enterpriseIntegrationsDeniedMessage(): string {
    return "Enterprise Integration & AI Execution Platform is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
