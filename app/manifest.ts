import type { MetadataRoute } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";
import { SOFT_LAUNCH_BRANDING } from "@/src/modules/soft-launch/data/launch-assets";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SOFT_LAUNCH_BRANDING.productName,
        short_name: "Arjun OS",
        description: SOFT_LAUNCH_BRANDING.tagline,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: SOFT_LAUNCH_BRANDING.primaryColor,
        lang: "en",
        icons: [
            {
                src: SOFT_LAUNCH_BRANDING.faviconPath,
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
            {
                src: SOFT_LAUNCH_BRANDING.logoPath,
                sizes: "any",
                type: "image/svg+xml",
                purpose: "maskable",
            },
        ],
        categories: ["business", "productivity"],
        id: LAUNCH_KIT_SEO.siteUrl,
    };
}
