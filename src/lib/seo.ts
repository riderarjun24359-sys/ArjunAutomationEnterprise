import type { Metadata } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";

export interface PageMetadataInput {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    noIndex?: boolean;
    image?: string;
}

export function buildMetadata(input: PageMetadataInput): Metadata {
    const url = input.path ? `${LAUNCH_KIT_SEO.siteUrl}${input.path}` : LAUNCH_KIT_SEO.siteUrl;
    const image = input.image ?? `${LAUNCH_KIT_SEO.siteUrl}/launch-kit/og-default.svg`;
    const title = input.title.includes(LAUNCH_KIT_SEO.siteName)
        ? input.title
        : `${input.title} | ${LAUNCH_KIT_SEO.siteName}`;

    return {
        title,
        description: input.description,
        keywords: input.keywords ?? [...LAUNCH_KIT_SEO.defaultKeywords],
        alternates: { canonical: url },
        robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: {
            type: "website",
            locale: LAUNCH_KIT_SEO.locale,
            url,
            siteName: LAUNCH_KIT_SEO.siteName,
            title,
            description: input.description,
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            site: LAUNCH_KIT_SEO.twitterHandle,
            title,
            description: input.description,
            images: [image],
        },
    };
}

export function buildOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: LAUNCH_KIT_SEO.siteName,
        url: LAUNCH_KIT_SEO.siteUrl,
        logo: `${LAUNCH_KIT_SEO.siteUrl}/launch-kit/logo.svg`,
        description: LAUNCH_KIT_SEO.defaultDescription,
        email: "sales@arjunautomation.com",
        sameAs: [
            "https://www.linkedin.com/company/arjunautomation",
            "https://twitter.com/arjunautomation",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: "sales@arjunautomation.com",
            availableLanguage: ["English"],
        },
    };
}

export function buildWebPageJsonLd(input: { title: string; description: string; path: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: input.title,
        description: input.description,
        url: `${LAUNCH_KIT_SEO.siteUrl}${input.path}`,
        isPartOf: { "@type": "WebSite", name: LAUNCH_KIT_SEO.siteName, url: LAUNCH_KIT_SEO.siteUrl },
    };
}
