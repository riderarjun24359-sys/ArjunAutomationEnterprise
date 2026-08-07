import { isFounderOrAdminAccess, founderAccessDeniedMessage } from "@/src/modules/founder-analytics/access";

export { isFounderOrAdminAccess };

export function aiAutomationEngineDeniedMessage(): string {
    return "AI Automation & Workflow Engine is restricted to Founder and Admin roles.";
}

export { founderAccessDeniedMessage };
