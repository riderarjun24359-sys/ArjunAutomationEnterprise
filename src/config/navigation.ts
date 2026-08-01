import { ROUTES } from "@/src/constants/routes";

export interface NavigationItem {
    label: string;
    href: string;
    description?: string;
}

export const primaryNavigation: NavigationItem[] = [
    { label: "Dashboard", href: ROUTES.dashboard, description: "Executive overview" },
    { label: "Projects", href: ROUTES.projects, description: "Delivery and execution" },
    { label: "Clients", href: ROUTES.clients, description: "Client lifecycle" },
    { label: "Tasks", href: ROUTES.tasks, description: "Operational execution" },
];

export const secondaryNavigation: NavigationItem[] = [
    { label: "Finance", href: ROUTES.finance, description: "Revenue and costs" },
    { label: "CRM", href: ROUTES.crm, description: "Customer relationship" },
    { label: "Analytics", href: ROUTES.analytics, description: "Performance insights" },
    { label: "Settings", href: ROUTES.settings, description: "System configuration" },
];
