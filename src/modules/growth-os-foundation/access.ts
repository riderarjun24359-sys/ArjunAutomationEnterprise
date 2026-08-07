import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthOsFoundationDeniedMessage(): string {
    return "Growth OS Foundation is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
