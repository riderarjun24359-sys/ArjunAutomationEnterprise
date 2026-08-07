import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthOsPublishingDeniedMessage(): string {
    return "Growth OS Publishing & Distribution is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
