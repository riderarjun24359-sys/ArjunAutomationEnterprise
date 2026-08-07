import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthOsContentDeniedMessage(): string {
    return "Growth OS AI Content Engine is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
