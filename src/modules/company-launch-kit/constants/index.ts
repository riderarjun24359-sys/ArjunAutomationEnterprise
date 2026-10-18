export const LAUNCH_KIT_THEME = {
    primary: "orange-500",
    primaryHover: "orange-600",
    ring: "orange-500/20",
    text: "text-orange-500",
    textLight: "text-orange-600",
    bg: "bg-orange-500",
    bgHover: "hover:bg-orange-600",
    border: "border-orange-200",
    surface: "bg-white",
} as const;

export const LAUNCH_KIT_SECTIONS = [
    { id: "website", label: "Public Website", description: "Marketing pages, forms, and SEO" },
    { id: "portfolio", label: "Portfolio", description: "7 showcase projects with case details" },
    { id: "documents", label: "Sales Documents", description: "Proposals, agreements, and templates" },
    { id: "emails", label: "Email Templates", description: "Client lifecycle email sequences" },
    { id: "marketing", label: "Marketing Assets", description: "Landing pages and lead magnets" },
    { id: "seo", label: "SEO & Analytics", description: "Sitemap, robots, and tracking scripts" },
] as const;
