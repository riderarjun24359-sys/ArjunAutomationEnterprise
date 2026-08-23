import { ROUTES } from "@/src/constants/routes";

// Deterministic mapping of module base routes to contextually relevant modules
export const navigationContextMap: Record<string, string[]> = {
    [ROUTES.dashboard]: [ROUTES.executiveIntelligence, ROUTES.aiCommandCenter],
    [ROUTES.billingFinance]: [ROUTES.billingRevenue, ROUTES.integrationPlatform],
    [ROUTES.automation]: [ROUTES.workflowEngine, ROUTES.aiAutomationEngine],
    // Add other meaningful relationships based on real taxonomy
};
