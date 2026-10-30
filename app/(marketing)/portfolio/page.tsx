import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { CASE_STUDY_ITEMS } from "@/src/modules/company-launch-kit/data/case-studies";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Solution Portfolio",
    description:
        "Arjun Automation solution portfolio — CRM, ERP, school management, AI workflows and integrations, grouped by the industry they serve.",
    path: MARKETING_ROUTES.portfolio,
};

/**
 * Portfolio hub.
 *
 * This page used to list the same seven solutions as `/case-studies` with the
 * same descriptions and metrics, and linked to detail pages that are 75–84%
 * identical to their case-study counterparts. That duplication split ranking
 * authority across two page sets.
 *
 * It is now a lightweight, `noindex` hub that points at the canonical case
 * studies (which carry the full challenge/solution/outcome detail) plus the
 * one integration solution that has no case-study twin. Canonical content lives
 * at `/case-studies`.
 */
export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    noIndex: true,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Portfolio", path: PAGE.path },
];

export default function PortfolioPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell
                title="Solution portfolio"
                description="Every solution below is documented in full as a case study, including the challenge, what we deployed, and the outcomes."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {CASE_STUDY_ITEMS.map((item) => (
                        <Link
                            key={item.slug}
                            href={MARKETING_ROUTES.caseStudyItem(item.slug)}
                            className="premium-glass group rounded-2xl p-6 transition hover:ring-2 hover:ring-[color-mix(in_oklab,var(--dos-brand-primary)_30%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)]/50"
                        >
                            <span className="text-xs font-medium uppercase tracking-wider text-[var(--dos-brand-primary)]">
                                {item.industry}
                            </span>
                            <h2 className="mt-2 text-xl font-semibold group-hover:text-[var(--dos-brand-primary-hover)] text-[var(--premium-fg)]">
                                {item.title}
                            </h2>
                            <p className="mt-3 text-sm text-[var(--premium-fg-muted)] line-clamp-3">{item.challenge}</p>
                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--dos-brand-primary)]">
                                Read the case study
                                <span aria-hidden="true">→</span>
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl border border-[var(--premium-border)] p-6">
                    <h2 className="text-lg font-semibold text-[var(--premium-fg)]">
                        Looking for integration work specifically?
                    </h2>
                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">
                        Our integration platform connects payment gateways, accounting systems, POS, EMR and
                        third-party SaaS tools — and is documented separately from the case studies above.
                    </p>
                    <Link
                        href={MARKETING_ROUTES.portfolioItem("integrations")}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-brand-primary)]/50"
                    >
                        Integration Platform
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
