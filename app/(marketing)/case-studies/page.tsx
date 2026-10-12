import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { CASE_STUDY_ITEMS } from "@/src/modules/company-launch-kit/data/case-studies";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Case Studies",
    description: "Representative enterprise automation case studies from Arjun Automation — illustrative outcomes across industries.",
    path: MARKETING_ROUTES.caseStudies,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Case Studies", path: PAGE.path },
];

export default function CaseStudiesPage() {
    return (
        <>
            <MarketingStructuredData title={PAGE.title} description={PAGE.description} path={PAGE.path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title="Case Studies"
                description="Representative outcomes from enterprise automation solution designs. Figures are illustrative targets, not audited client measurements."
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <div className="space-y-12">
                    {CASE_STUDY_ITEMS.map((study) => (
                        <article key={study.slug} className="premium-glass rounded-2xl p-8">
                            <span className="text-xs font-medium uppercase tracking-wider text-indigo-700">{study.industry}</span>
                            <h2 className="mt-2 text-2xl font-semibold">
                                <Link href={MARKETING_ROUTES.caseStudyItem(study.slug)} className="hover:text-indigo-700">
                                    {study.title}
                                </Link>
                            </h2>
                            <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{study.client}</p>
                            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-semibold">Challenge</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{study.challenge}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Solution</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{study.solution}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {study.results.slice(0, 3).map((result) => (
                                    <span key={result} className="rounded-full bg-indigo-700/10 px-3 py-1 text-xs font-medium text-indigo-700">
                                        {result}
                                    </span>
                                ))}
                            </div>
                            <Link
                                href={MARKETING_ROUTES.caseStudyItem(study.slug)}
                                className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-600"
                            >
                                Read full case study →
                            </Link>
                        </article>
                    ))}
                </div>
            </PremiumPageShell>
            <CtaSection secondaryLabel="View Portfolio" secondaryHref={MARKETING_ROUTES.portfolio} />
        </>
    );
}
