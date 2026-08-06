import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function earlyAccessDeniedMessage(): string {
    return "Early Access Launch Console is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
