const configuredSiteUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
const siteUrl = configuredSiteUrl || (process.env.NODE_ENV === "production" ? "https://www.arjunautomations.com" : "http://localhost:3000");

export const LAUNCH_KIT_SEO = {
    siteName: "Arjun Automation Enterprises",
    siteUrl,
    defaultTitle: "Arjun Automation Enterprises | Custom Software and AI Automation | Andhra Pradesh",
    defaultDescription: "Custom software, AI automation and business systems for schools, colleges, retailers, clinics and growing businesses in Andhra Pradesh and Telangana.",
    locale: "en_IN",
} as const;
