import type { MetadataRoute } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/dashboard", "/company-launch-kit", "/brand-os", "/auth/"],
        },
        sitemap: `${LAUNCH_KIT_SEO.siteUrl}/sitemap.xml`,
    };
}
