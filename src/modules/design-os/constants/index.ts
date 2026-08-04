import type { DesignOsTab } from "@/src/modules/design-os/types";

export const DESIGN_OS_TABS = {
    overview: "overview",
    tokens: "tokens",
    motion: "motion",
    components: "components",
    dashboard: "dashboard",
    website: "website",
    guidelines: "guidelines",
} as const satisfies Record<string, DesignOsTab>;

export const DESIGN_OS_TAB_LIST: { id: DesignOsTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "tokens", label: "Tokens" },
    { id: "motion", label: "Motion" },
    { id: "components", label: "Components" },
    { id: "dashboard", label: "Dashboard" },
    { id: "website", label: "Website" },
    { id: "guidelines", label: "Guidelines" },
];

export const DESIGN_OS_THEME = {
    accent: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
} as const;
