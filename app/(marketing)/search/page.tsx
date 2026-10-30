import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Search",
    description: "Search Arjun Automation services, case studies, blog articles, and resources.",
    path: MARKETING_ROUTES.search,
    noIndex: true,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Search", path: PAGE.path },
];

export default function SearchPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title="Search" description="Find services, case studies, blog articles, and resources across Arjun Automation.">
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="space-y-12">
                    <section aria-labelledby="quick-search-heading">
                        <h2 id="quick-search-heading" className="text-2xl font-semibold text-[var(--premium-fg)]">Quick links</h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {[
                                { label: "Services", href: MARKETING_ROUTES.services },
                                { label: "Solutions", href: MARKETING_ROUTES.solutions },
                                { label: "Industries", href: MARKETING_ROUTES.industries },
                                { label: "Case Studies", href: MARKETING_ROUTES.caseStudies },
                                { label: "Portfolio", href: MARKETING_ROUTES.portfolio },
                                { label: "Pricing", href: MARKETING_ROUTES.pricing },
                                { label: "Features", href: MARKETING_ROUTES.features },
                                { label: "Resources", href: MARKETING_ROUTES.resources },
                            ].map((link) => (
                                <article key={link.label} className="premium-glass rounded-2xl p-6">
                                    <Link
                                        href={link.href}
                                        className="block text-lg font-semibold text-[var(--premium-fg)] hover:text-[var(--dos-brand-primary-hover)]"
                                    >
                                        {link.label}
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="browse-heading" className="premium-glass rounded-2xl p-8">
                        <h2 id="browse-heading" className="text-xl font-semibold text-[var(--premium-fg)]">Browse by category</h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--premium-fg-muted)]">Platform</h3>
                                <ul className="mt-2 space-y-2">
                                    <li><Link href={MARKETING_ROUTES.services} className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]">All Services</Link></li>
                                    <li><Link href={MARKETING_ROUTES.pricing} className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]">Pricing Plans</Link></li>
                                    <li><Link href={MARKETING_ROUTES.features} className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]">Features</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--premium-fg-muted)]">Proof</h3>
                                <ul className="mt-2 space-y-2">
                                    <li><Link href={MARKETING_ROUTES.caseStudies} className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]">Case Studies</Link></li>
                                    <li><Link href={MARKETING_ROUTES.portfolio} className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]">Portfolio</Link></li>
                                    <li><Link href={MARKETING_ROUTES.blog} className="text-sm text-[var(--premium-fg-muted)] hover:text-[var(--dos-brand-primary-hover)]">Blog</Link></li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
