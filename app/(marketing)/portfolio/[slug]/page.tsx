import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { CASE_STUDY_SLUGS } from "@/src/modules/company-launch-kit/data/case-studies";
import { PORTFOLIO_ITEMS, getPortfolioItem } from "@/src/modules/company-launch-kit/data/portfolio";
import { buildMetadata } from "@/src/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return PORTFOLIO_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const item = getPortfolioItem(slug);
    if (!item) return {};
    return buildMetadata({
        title: item.title,
        description: item.overview,
        path: `/portfolio/${slug}`,
    });
}

function getCaseStudySections(item: NonNullable<ReturnType<typeof getPortfolioItem>>) {
    return {
        implementation: `We deployed ${item.features.length} core capabilities including ${item.features.slice(0, 3).join(", ")}.`,
        outcome: item.results.join(". "),
        businessImpact: item.benefits.join(". "),
    };
}

export default async function PortfolioDetailPage({ params }: Props) {
    const { slug } = await params;
    const item = getPortfolioItem(slug);
    if (!item) notFound();

    const path = MARKETING_ROUTES.portfolioItem(slug);
    const sections = getCaseStudySections(item);
    const breadcrumbs = [
        { name: "Home", path: MARKETING_ROUTES.home },
        { name: "Portfolio", path: MARKETING_ROUTES.portfolio },
        { name: item.title, path },
    ];

    return (
        <>
            <MarketingStructuredData title={item.title} description={item.overview} path={path} breadcrumbs={breadcrumbs} />
            <PremiumPageShell
                title={item.title}
                description={`${item.tagline} — illustrative solution design; outcomes are target figures, not audited client results.`}
            >
                <MarketingBreadcrumbs items={breadcrumbs} />
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--dos-brand-primary)]">{item.category}</span>

                <div className="mt-8 space-y-12">
                    <section aria-labelledby="overview-heading">
                        <h2 id="overview-heading" className="text-xl font-semibold">
                            Overview
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{item.overview}</p>
                    </section>

                    <section aria-labelledby="challenge-heading">
                        <h2 id="challenge-heading" className="text-xl font-semibold">
                            Challenge
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{item.challenge}</p>
                    </section>

                    <section aria-labelledby="solution-heading">
                        <h2 id="solution-heading" className="text-xl font-semibold">
                            Solution
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{item.solution}</p>
                    </section>

                    <section aria-labelledby="implementation-heading">
                        <h2 id="implementation-heading" className="text-xl font-semibold">
                            Implementation
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{sections.implementation}</p>
                        <ul className="mt-4 space-y-2">
                            {item.features.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm text-[var(--premium-fg-muted)]">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--dos-brand-primary)]" aria-hidden="true" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="outcome-heading">
                        <h2 id="outcome-heading" className="text-xl font-semibold">
                            Outcome
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{sections.outcome}</p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {item.results.map((r) => (
                                <div key={r} className="premium-glass rounded-xl px-4 py-3 text-sm font-medium">
                                    {r}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="impact-heading">
                        <h2 id="impact-heading" className="text-xl font-semibold">
                            Business impact
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{sections.businessImpact}</p>
                    </section>

                    <section aria-labelledby="screenshots-heading">
                        <h2 id="screenshots-heading" className="text-xl font-semibold">
                            Screenshots
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            {item.screenshotSlots.map((slot) => (
                                <div
                                    key={slot.path}
                                    className="flex aspect-video items-center justify-center rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] p-4"
                                >
                                    <p className="text-center text-xs text-[var(--premium-fg-muted)]">{slot.alt}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* The integrations solution has no case-study twin — only show
                        the cross-link when a canonical case study actually exists. */}
                    {CASE_STUDY_SLUGS.includes(slug as (typeof CASE_STUDY_SLUGS)[number]) ? (
                        <Link href={MARKETING_ROUTES.caseStudyItem(slug)} className="text-sm font-medium text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)]">
                            Read case study format →
                        </Link>
                    ) : (
                        <Link href={MARKETING_ROUTES.caseStudies} className="text-sm font-medium text-[var(--dos-brand-primary)] hover:text-[var(--dos-brand-primary-hover)]">
                            Browse all case studies →
                        </Link>
                    )}
                </div>
            </PremiumPageShell>
            <CtaSection />
        </>
    );
}
