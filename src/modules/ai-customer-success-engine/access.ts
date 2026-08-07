import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiCustomerSuccessEngineDeniedMessage(): string {
    return "AI Customer Success & Support Engine is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
