import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Sitemap",
    description: "Complete sitemap of Arjun Automation website — all public pages and application routes.",
    path: MARKETING_ROUTES.sitemap,
    noIndex: true,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Sitemap", path: PAGE.path },
];

const PUBLIC_PAGES = [
    { label: "Home", href: MARKETING_ROUTES.home },
    { label: "About", href: MARKETING_ROUTES.about },
    { label: "Features", href: MARKETING_ROUTES.features },
    { label: "Services", href: MARKETING_ROUTES.services },
    { label: "Solutions", href: MARKETING_ROUTES.solutions },
    { label: "Industries", href: MARKETING_ROUTES.industries },
    { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
    { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
    { label: "Pricing", href: MARKETING_ROUTES.pricing },
    { label: "FAQ", href: MARKETING_ROUTES.faq },
    { label: "Help Center", href: MARKETING_ROUTES.help },
    { label: "Resources", href: MARKETING_ROUTES.resources },
    { label: "Blog", href: MARKETING_ROUTES.blog },
    { label: "Careers", href: MARKETING_ROUTES.careers },
    { label: "Contact", href: MARKETING_ROUTES.contact },
];

const LEGAL_PAGES = [
    { label: "Privacy Policy", href: MARKETING_ROUTES.privacy },
    { label: "Terms of Service", href: MARKETING_ROUTES.terms },
    { label: "Cookies", href: MARKETING_ROUTES.cookies },
    { label: "Refund Policy", href: MARKETING_ROUTES.refund },
];

export default function SitemapPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title="Sitemap" description="Complete navigation reference for the Arjun Automation website.">
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="space-y-12">
                    <section aria-labelledby="public-heading">
                        <h2 id="public-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">Public pages</h2>
                        <ul className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                            {PUBLIC_PAGES.map((page) => (
                                <li key={page.label}>
                                    <Link
                                        href={page.href}
                                        className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]"
                                    >
                                        {page.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="legal-heading">
                        <h2 id="legal-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">Legal pages</h2>
                        <ul className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                            {LEGAL_PAGES.map((page) => (
                                <li key={page.label}>
                                    <Link
                                        href={page.href}
                                        className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]"
                                    >
                                        {page.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
