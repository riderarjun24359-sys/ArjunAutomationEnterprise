import { ROUTES } from "@/src/constants/routes";

export const CUSTOMER_SUCCESS_INTEGRATIONS = [
    { id: "executive-command-center", label: "Executive Command Center", href: ROUTES.dashboard },
    { id: "crm", label: "CRM", href: ROUTES.crm },
    { id: "projects", label: "Projects", href: ROUTES.projects },
    { id: "delivery-engine", label: "Delivery Engine", href: ROUTES.deliveryEngine },
    { id: "workflow-engine", label: "Workflow Engine", href: ROUTES.workflowEngine },
    { id: "ai-command-center", label: "AI Command Center", href: ROUTES.aiCommandCenter },
    { id: "knowledge", label: "Knowledge Engine", href: ROUTES.knowledge },
    { id: "support", label: "Support Center", href: ROUTES.support },
    { id: "billing", label: "Billing", href: ROUTES.billingRevenue },
    { id: "mission-core", label: "Mission Core", href: ROUTES.missionCore },
] as const;

export function listCustomerSuccessIntegrations() {
    return CUSTOMER_SUCCESS_INTEGRATIONS.map((item) => ({ ...item }));
}
