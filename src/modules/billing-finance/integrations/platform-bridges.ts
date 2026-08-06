import { ROUTES } from "@/src/constants/routes";

export const BILLING_FINANCE_INTEGRATIONS = [
    { id: "executive-command-center", label: "Executive Command Center", href: ROUTES.dashboard },
    { id: "crm", label: "CRM", href: ROUTES.crm },
    { id: "customer-success", label: "Customer Success", href: ROUTES.customerSuccess },
    { id: "projects", label: "Projects", href: ROUTES.projects },
    { id: "ai-command-center", label: "AI Command Center", href: ROUTES.aiCommandCenter },
    { id: "billing-revenue", label: "Billing Revenue", href: ROUTES.billingRevenue },
    { id: "finance", label: "Finance", href: ROUTES.finance },
] as const;

export function listBillingFinanceIntegrations() {
    return BILLING_FINANCE_INTEGRATIONS.map((item) => ({ ...item }));
}
