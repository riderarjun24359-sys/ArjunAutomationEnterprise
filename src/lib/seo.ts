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
        email: "sales@arjunautomations.com",
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: "sales@arjunautomations.com",
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

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${LAUNCH_KIT_SEO.siteUrl}${item.path}`,
        })),
    };
}

export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    };
}

export function buildServiceJsonLd(input: {
    name: string;
    description: string;
    path: string;
    provider?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: input.name,
        description: input.description,
        url: `${LAUNCH_KIT_SEO.siteUrl}${input.path}`,
        provider: {
            "@type": "Organization",
            name: input.provider ?? LAUNCH_KIT_SEO.siteName,
            url: LAUNCH_KIT_SEO.siteUrl,
        },
    };
}

