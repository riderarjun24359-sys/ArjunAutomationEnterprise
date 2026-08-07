import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthOsIntelligenceDeniedMessage(): string {
    return "Growth OS Growth Intelligence is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
