import { ROUTES } from "@/src/constants/routes";
import type { ExecutiveQuickAction } from "../types";

export const EXECUTIVE_QUICK_ACTIONS: ExecutiveQuickAction[] = [
    {
        id: "add-client",
        label: "Add Client",
        description: "Create a client record in CRM",
        href: ROUTES.clients,
        icon: "users",
    },
    {
        id: "create-project",
        label: "Create Project",
        description: "Start a delivery project",
        href: ROUTES.projects,
        icon: "folder",
    },
    {
        id: "create-task",
        label: "Create Task",
        description: "Add an operational task",
        href: ROUTES.tasks,
        icon: "check",
    },
    {
        id: "add-lead",
        label: "Add Lead",
        description: "Capture a sales opportunity",
        href: ROUTES.sales,
        icon: "target",
    },
    {
        id: "generate-report",
        label: "Generate Report",
        description: "Open analytics reporting",
        href: ROUTES.analytics,
        icon: "report",
    },
];
