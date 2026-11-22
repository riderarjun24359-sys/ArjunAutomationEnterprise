import type { MetadataRoute } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";

const LIVE_PUBLIC_ROUTES = [
    "/", "/services", "/school-erp", "/demos", "/pricing", "/about", "/contact", "/privacy", "/terms",
    "/te", "/te/services", "/te/school-erp", "/te/demos", "/te/pricing", "/te/about", "/te/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const base = LAUNCH_KIT_SEO.siteUrl;
    return LIVE_PUBLIC_ROUTES.map(path => ({
        url: `${base}${path}`,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : 0.7,
    }));
}
