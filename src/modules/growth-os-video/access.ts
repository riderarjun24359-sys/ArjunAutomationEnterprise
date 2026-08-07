import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthOsVideoDeniedMessage(): string {
    return "Growth OS AI Video Factory is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
