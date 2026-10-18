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
    accent: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
} as const;
