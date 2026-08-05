import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Portfolio",
    description: "Explore Arjun Automation portfolio — AI automation, CRM, ERP, school management, business automation, AI agents, and integrations.",
    path: MARKETING_ROUTES.portfolio,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Portfolio", path: PAGE.path },
];

export default function PortfolioPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title="Portfolio"
                description="Real enterprise automation outcomes across industries and use cases."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PORTFOLIO_ITEMS.map((item) => (
                        <Link
                            key={item.slug}
                            href={MARKETING_ROUTES.portfolioItem(item.slug)}
                            className="premium-glass group rounded-2xl p-6 transition hover:ring-2 hover:ring-indigo-700/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                        >
                            <span className="text-xs font-medium uppercase tracking-wider text-indigo-700">{item.category}</span>
                            <h2 className="mt-2 text-xl font-semibold group-hover:text-indigo-700">{item.title}</h2>
                            <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{item.tagline}</p>
                            <p className="mt-4 text-sm text-[var(--premium-fg-muted)] line-clamp-3">{item.overview}</p>
                        </Link>
                    ))}
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
