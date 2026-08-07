import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function growthEngineV1DeniedMessage(): string {
    return "Growth Engine v1 is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
