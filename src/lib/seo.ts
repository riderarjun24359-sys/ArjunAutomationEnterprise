import type { Metadata } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";
import { COMPANY_PROFILE } from "@/src/config/company-profile";

export interface PageMetadataInput {
    title: string;
    description: string;
    path?: string;
    noIndex?: boolean;
    image?: string;
}

function clampDescription(description: string, limit = 155): string {
    if (description.length <= limit) return description;
    const clipped = description.slice(0, limit);
    const lastSpace = clipped.lastIndexOf(" ");
    return `${(lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

export function buildMetadata(input: PageMetadataInput): Metadata {
    const routePath = input.path ?? "/";
    const url = `${LAUNCH_KIT_SEO.siteUrl}${routePath}`;
    const title = input.title.includes(LAUNCH_KIT_SEO.siteName) ? input.title : `${input.title} | ${LAUNCH_KIT_SEO.siteName}`;
    const description = clampDescription(input.description);
    const isTelugu = routePath === "/te" || routePath.startsWith("/te/");
    const englishPath = isTelugu ? (routePath.replace(/^\/te(?=\/|$)/, "") || "/") : routePath;
    const translated = new Set(["/", "/services", "/school-erp", "/demos", "/pricing", "/about", "/contact", "/privacy", "/terms", "/thank-you"]);
    const languages = translated.has(englishPath) ? {
        "en-IN": `${LAUNCH_KIT_SEO.siteUrl}${englishPath}`,
        "te-IN": `${LAUNCH_KIT_SEO.siteUrl}/te${englishPath === "/" ? "" : englishPath}`,
        "x-default": `${LAUNCH_KIT_SEO.siteUrl}${englishPath}`,
    } : undefined;

    return {
        title,
        description,
        alternates: { canonical: url, ...(languages ? { languages } : {}) },
        robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: { type: "website", locale: "en_IN", url, siteName: LAUNCH_KIT_SEO.siteName, title, description },
        twitter: { card: "summary_large_image", title, description },
    };
}

export function buildOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Arjun Automation Enterprises",
        url: LAUNCH_KIT_SEO.siteUrl,
        telephone: COMPANY_PROFILE.phoneE164,
        email: "sales@arjunautomations.com",
        areaServed: ["Andhra Pradesh", "Telangana"],
    };
}
