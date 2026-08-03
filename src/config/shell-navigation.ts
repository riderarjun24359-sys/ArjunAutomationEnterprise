import type { LucideIcon } from "lucide-react";
import {
    BarChart3,
    Bot,
    BookOpen,
    Brain,
    ClipboardList,
    Factory,
    HeartHandshake,
    Rocket,
    ShieldCheck,
    Layers,
    BriefcaseBusiness,
    Building2,
    CheckSquare,
    LayoutDashboard,
    Headphones,
    Package,
    Settings,
    UserCog,
    Users,
    TrendingUp,
    Wallet,
    FileText,
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
    { label: "Sales", href: ROUTES.sales, description: "Pipeline and revenue operations", icon: TrendingUp, section: "secondary" },
    { label: "AI Orchestration", href: ROUTES.ai, description: "Core AI infrastructure and SDK", icon: Brain, section: "secondary" },
    { label: "Knowledge", href: ROUTES.knowledge, description: "Enterprise knowledge and memory engine", icon: BookOpen, section: "secondary" },
    { label: "Business Analyst", href: ROUTES.businessAnalyst, description: "AI worker for requirements and analysis", icon: ClipboardList, section: "secondary" },
    { label: "Solution Architect", href: ROUTES.solutionArchitect, description: "AI worker for solution architecture and design", icon: Layers, section: "secondary" },
    { label: "Development Factory", href: ROUTES.developmentFactory, description: "AI worker for code generation and development", icon: Factory, section: "secondary" },
    { label: "QA Engineer", href: ROUTES.qaEngineer, description: "AI worker for quality assurance and testing", icon: ShieldCheck, section: "secondary" },
    { label: "DevOps & Deployment", href: ROUTES.devopsDeployment, description: "AI worker for CI/CD, infrastructure, and release orchestration", icon: Rocket, section: "secondary" },
    { label: "Customer Success", href: ROUTES.customerSuccess, description: "AI worker for onboarding, adoption, health scores, and renewal", icon: HeartHandshake, section: "secondary" },
    { label: "Automation", href: ROUTES.automation, description: "AI workflows and agents", icon: Bot, section: "secondary" },
    { label: "Analytics", href: ROUTES.analytics, description: "Performance insights", icon: BarChart3, section: "secondary" },
    { label: "HR", href: ROUTES.hr, description: "Employee and people operations", icon: UserCog, section: "secondary" },
    { label: "Inventory", href: ROUTES.inventory, description: "Stock, assets, and procurement", icon: Package, section: "secondary" },
    { label: "Support", href: ROUTES.support, description: "Customer support and service desk", icon: Headphones, section: "secondary" },
    { label: "Documents", href: ROUTES.documents, description: "Document and content management", icon: FileText, section: "secondary" },
    { label: "Settings", href: ROUTES.settings, description: "System configuration", icon: Settings, section: "secondary" },
];

export const primaryShellNavigation = shellNavigation.filter((item) => item.section === "primary");
export const secondaryShellNavigation = shellNavigation.filter((item) => item.section === "secondary");

export const shellRouteLabels: Record<string, string> = shellNavigation.reduce<Record<string, string>>((acc, item) => {
    acc[item.href] = item.label;
    return acc;
}, {});
