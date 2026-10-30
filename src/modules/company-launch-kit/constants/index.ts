export const LAUNCH_KIT_THEME = {
    primary: "text-[var(--dos-brand-primary)]",
    primaryHover: "hover:text-[var(--dos-brand-primary-hover)]",
    ring: "ring-[color-mix(in_oklab,var(--dos-brand-primary)_20%,transparent)]",
    text: "text-[var(--dos-brand-primary)]",
    textLight: "text-[var(--dos-brand-primary-hover)]",
    bg: "bg-[color-mix(in_oklab,var(--dos-brand-primary)_12%,transparent)]",
    bgHover: "hover:bg-[color-mix(in_oklab,var(--dos-brand-primary)_8%,transparent)]",
    border: "border-[color-mix(in_oklab,var(--dos-brand-primary)_30%,transparent)]",
    surface: "bg-[var(--premium-bg-secondary)]",
} as const;

export const LAUNCH_KIT_SECTIONS = [
    { id: "website", label: "Public Website", description: "Marketing pages, forms, and SEO" },
    { id: "portfolio", label: "Portfolio", description: "7 showcase projects with case details" },
    { id: "documents", label: "Sales Documents", description: "Proposals, agreements, and templates" },
    { id: "emails", label: "Email Templates", description: "Client lifecycle email sequences" },
    { id: "marketing", label: "Marketing Assets", description: "Landing pages and lead magnets" },
    { id: "seo", label: "SEO & Analytics", description: "Sitemap, robots, and tracking scripts" },
] as const;
