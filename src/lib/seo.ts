import type { Metadata } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";
import { COMPANY_PROFILE, schemaAddress, schemaSameAs } from "@/src/config/company-profile";

export interface PageMetadataInput {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    noIndex?: boolean;
    image?: string;
}

/**
 * Search engines truncate snippets past roughly 155–160 characters. Clipping
 * here keeps every page inside the limit without editing content by hand, and
 * trims at a word boundary so we never cut mid-word.
 */
function clampDescription(description: string, limit = 158): string {
    if (description.length <= limit) return description;
    const clipped = description.slice(0, limit);
    const lastSpace = clipped.lastIndexOf(" ");
    return `${(lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

export function buildMetadata(input: PageMetadataInput): Metadata {
    const url = input.path ? `${LAUNCH_KIT_SEO.siteUrl}${input.path}` : LAUNCH_KIT_SEO.siteUrl;
    const title = input.title.includes(LAUNCH_KIT_SEO.siteName)
        ? input.title
        : `${input.title} | ${LAUNCH_KIT_SEO.siteName}`;
    const description = clampDescription(input.description);

    // No `images` key is emitted here on purpose. Route-level `opengraph-image`
    // files (src/modules/company-launch-kit/components/og/og-image.tsx) take
    // precedence and serve real PNGs — X, LinkedIn, Facebook and WhatsApp all
    // refuse to render the SVG this used to point at, which produced blank
    // share cards for every link on the site.
    return {
        title,
        description,
        keywords: input.keywords ?? [...LAUNCH_KIT_SEO.defaultKeywords],
        alternates: { canonical: url },
        robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: {
            type: "website",
            locale: LAUNCH_KIT_SEO.locale,
            url,
            siteName: LAUNCH_KIT_SEO.siteName,
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            site: LAUNCH_KIT_SEO.twitterHandle,
            title,
            description,
        },
    };
}

/**
 * Organization schema for every marketing page.
 *
 * `ProfessionalService` is used rather than the generic `Organization` type so
 * Google can surface the business in local/service results. Contact details are
 * only emitted once they are genuinely configured in `company-profile` — an
 * invented GSTIN or phone number is a legal and commercial problem, so those
 * fields stay absent rather than being guessed at.
 */
export function buildOrganizationJsonLd() {
    const address = schemaAddress();
    const sameAs = schemaSameAs();

    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: LAUNCH_KIT_SEO.siteName,
        legalName: COMPANY_PROFILE.legalName,
        url: LAUNCH_KIT_SEO.siteUrl,
        logo: `${LAUNCH_KIT_SEO.siteUrl}/brand/logos/horizontal-blue.svg`,
        description: LAUNCH_KIT_SEO.defaultDescription,
        slogan: COMPANY_PROFILE.tagline,
        email: COMPANY_PROFILE.emails.sales,
        ...(COMPANY_PROFILE.phoneE164 ? { telephone: COMPANY_PROFILE.phoneE164 } : {}),
        ...(address ? { address } : {}),
        ...(COMPANY_PROFILE.gstin ? { taxID: COMPANY_PROFILE.gstin } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
        },
        contactPoint: [
            {
                "@type": "ContactPoint",
                contactType: "sales",
                email: COMPANY_PROFILE.emails.sales,
                ...(COMPANY_PROFILE.phoneE164 ? { telephone: COMPANY_PROFILE.phoneE164 } : {}),
                availableLanguage: ["English", "Hindi"],
                areaServed: "IN",
            },
            {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: COMPANY_PROFILE.emails.support,
                availableLanguage: ["English"],
            },
        ],
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

