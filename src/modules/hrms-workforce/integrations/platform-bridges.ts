import { ROUTES } from "@/src/constants/routes";

export const HRMS_INTEGRATIONS = [
    { id: "executive-command-center", label: "Executive Command Center", href: ROUTES.dashboard },
    { id: "crm", label: "CRM", href: ROUTES.crm },
    { id: "projects", label: "Projects", href: ROUTES.projects },
    { id: "customer-success", label: "Customer Success", href: ROUTES.customerSuccess },
    { id: "billing-finance", label: "Billing & Finance", href: ROUTES.billingFinance },
    { id: "ai-command-center", label: "AI Command Center", href: ROUTES.aiCommandCenter },
    { id: "workflow-engine", label: "Workflow Engine", href: ROUTES.workflowEngine },
    { id: "mission-core", label: "Mission Core", href: ROUTES.missionCore },
] as const;

export function listHrmsIntegrations() {
    return HRMS_INTEGRATIONS.map((item) => ({ ...item }));
}
