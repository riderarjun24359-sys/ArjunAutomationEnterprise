import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { CASE_STUDY_ITEMS, getCaseStudyItem } from "@/src/modules/company-launch-kit/data/case-studies";
import { buildMetadata } from "@/src/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return CASE_STUDY_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const study = getCaseStudyItem(slug);
    if (!study) return {};
    return buildMetadata({
        title: study.title,
        description: study.challenge.slice(0, 160),
        path: MARKETING_ROUTES.caseStudyItem(slug),
    });
}

export default async function CaseStudyDetailPage({ params }: Props) {
    const { slug } = await params;
    const study = getCaseStudyItem(slug);
    if (!study) notFound();

    const path = MARKETING_ROUTES.caseStudyItem(slug);
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "Case Studies", path: MARKETING_ROUTES.caseStudies },
        { name: study.title, path },
    ];

    return (
        <>
            <MarketingStructuredData title={study.title} description={study.challenge} path={path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell title={study.title} description={`${study.industry} · ${study.client}`}>
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="space-y-12">
                    <section aria-labelledby="challenge-heading">
                        <h2 id="challenge-heading" className="text-xl font-semibold">
                            Challenge
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{study.challenge}</p>
                    </section>

                    <section aria-labelledby="solution-heading">
                        <h2 id="solution-heading" className="text-xl font-semibold">
                            Solution
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{study.solution}</p>
                    </section>

                    <section aria-labelledby="implementation-heading">
                        <h2 id="implementation-heading" className="text-xl font-semibold">
                            Implementation
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{study.implementation}</p>
                    </section>

                    <section aria-labelledby="outcome-heading">
                        <h2 id="outcome-heading" className="text-xl font-semibold">
                            Outcome
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{study.outcome}</p>
                    </section>

                    <section aria-labelledby="impact-heading">
                        <h2 id="impact-heading" className="text-xl font-semibold">
                            Business impact
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{study.businessImpact}</p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {study.results.map((result) => (
                                <div key={result} className="premium-glass rounded-xl px-4 py-3 text-sm font-medium">
                                    {result}
                                </div>
                            ))}
                        </div>
                    </section>

                    <Link href={MARKETING_ROUTES.portfolioItem(study.slug)} className="text-sm font-medium text-indigo-700 hover:text-indigo-600">
                        View full portfolio entry →
                    </Link>
                </div>
            </PremiumPageShell>
            <CtaSection title="Achieve similar outcomes" primaryLabel="Book Consultation" secondaryLabel="View Portfolio" />
        </>
    );
}
