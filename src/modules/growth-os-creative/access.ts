import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthOsCreativeDeniedMessage(): string {
    return "Growth OS AI Creative Studio is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
