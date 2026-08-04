import { BRAND_DOCUMENTS } from "@/src/modules/brand-os/lib/documents";
import type { BrandOsTab } from "@/src/modules/brand-os/types";

export const BRAND_OS_TABS = {
    overview: "overview",
    brandBook: "brand-book",
    visualIdentity: "visual-identity",
    companyProfile: "company-profile",
    services: "services",
    salesKit: "sales-kit",
    assets: "assets",
} as const;

export const BRAND_OS_TAB_LIST: BrandOsTab[] = [
    { id: BRAND_OS_TABS.overview, label: "Overview" },
    { id: BRAND_OS_TABS.brandBook, label: "Brand Book" },
    { id: BRAND_OS_TABS.visualIdentity, label: "Visual Identity" },
    { id: BRAND_OS_TABS.companyProfile, label: "Company Profile" },
    { id: BRAND_OS_TABS.services, label: "Service Library", category: "services" },
    { id: BRAND_OS_TABS.salesKit, label: "Sales Kit", category: "sales-kit" },
    { id: BRAND_OS_TABS.assets, label: "Asset Library" },
];

export const BRAND_OS_PERMISSIONS = ["brand-os.view", "brand-os.edit", "brand-os.export", "brand-os.admin"] as const;

export const BRAND_OS_THEME = {
    primary: "indigo-700",
    primaryHover: "indigo-600",
    ring: "indigo-500/20",
    text: "text-indigo-700",
    textDark: "dark:text-indigo-400",
    bg: "bg-indigo-700",
    bgHover: "hover:bg-indigo-600",
    border: "border-indigo-200 dark:border-indigo-800",
    surface: "bg-white/80 dark:bg-indigo-950/80",
} as const;

export const BRAND_OS_DOCUMENT_REGISTRY = BRAND_DOCUMENTS;
