import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiOperationsCenterDeniedMessage(): string {
    return "AI Operations & Monitoring Center is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
