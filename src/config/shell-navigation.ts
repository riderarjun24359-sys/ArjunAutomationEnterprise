import type { LucideIcon } from "lucide-react";
import {
    BarChart3,
    Bot,
    BriefcaseBusiness,
    Building2,
    CheckSquare,
    LayoutDashboard,
    Headphones,
    Package,
    Settings,
    UserCog,
    Users,
    Wallet,
} from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export interface ShellNavigationItem {
    label: string;
    href: string;
    description: string;
    icon: LucideIcon;
    section: "primary" | "secondary";
}

export const shellNavigation: ShellNavigationItem[] = [
    { label: "Dashboard", href: ROUTES.dashboard, description: "Executive overview", icon: LayoutDashboard, section: "primary" },
    { label: "Organization", href: ROUTES.organization, description: "Governance and workspaces", icon: Building2, section: "primary" },
    { label: "CRM", href: ROUTES.crm, description: "Client and revenue operations", icon: BriefcaseBusiness, section: "primary" },
    { label: "Projects", href: ROUTES.projects, description: "Delivery and execution", icon: BarChart3, section: "primary" },
    { label: "Tasks", href: ROUTES.tasks, description: "Operational execution", icon: CheckSquare, section: "primary" },
    { label: "Clients", href: ROUTES.clients, description: "Client lifecycle", icon: Users, section: "primary" },
    { label: "Finance", href: ROUTES.finance, description: "Revenue and costs", icon: Wallet, section: "secondary" },
    { label: "Automation", href: ROUTES.automation, description: "AI workflows and agents", icon: Bot, section: "secondary" },
    { label: "Analytics", href: ROUTES.analytics, description: "Performance insights", icon: BarChart3, section: "secondary" },
    { label: "HR", href: ROUTES.hr, description: "Employee and people operations", icon: UserCog, section: "secondary" },
    { label: "Inventory", href: ROUTES.inventory, description: "Stock, assets, and procurement", icon: Package, section: "secondary" },
    { label: "Support", href: ROUTES.support, description: "Customer support and service desk", icon: Headphones, section: "secondary" },
    { label: "Settings", href: ROUTES.settings, description: "System configuration", icon: Settings, section: "secondary" },
];

export const primaryShellNavigation = shellNavigation.filter((item) => item.section === "primary");
export const secondaryShellNavigation = shellNavigation.filter((item) => item.section === "secondary");

export const shellRouteLabels: Record<string, string> = shellNavigation.reduce<Record<string, string>>((acc, item) => {
    acc[item.href] = item.label;
    return acc;
}, {});
