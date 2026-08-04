export const LAUNCH_KIT_THEME = {
    primary: "indigo-700",
    primaryHover: "indigo-600",
    ring: "indigo-500/20",
    text: "text-indigo-700",
    textLight: "text-indigo-600",
    bg: "bg-indigo-700",
    bgHover: "hover:bg-indigo-600",
    border: "border-indigo-200",
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
