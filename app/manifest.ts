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
        // PWA install prompts require raster icons at declared sizes — an SVG
        // entry is rejected by the installability check in Chrome and Edge.
        icons: [
            {
                src: SOFT_LAUNCH_BRANDING.icon192Path,
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: SOFT_LAUNCH_BRANDING.icon512Path,
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: SOFT_LAUNCH_BRANDING.icon512Path,
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
        categories: ["business", "productivity"],
        id: LAUNCH_KIT_SEO.siteUrl,
    };
}
