"use client";

import Link from "next/link";
import { MorphCard } from "@/src/modules/company-launch-kit/components/premium/ui/MorphCard";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { PORTFOLIO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export function PortfolioSection() {
    const items = PORTFOLIO_ITEMS.slice(0, 3);

    return (
        <section className="premium-section" aria-labelledby="portfolio-heading">
            <div className="premium-container">
                <SectionReveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 id="portfolio-heading" className="font-display text-3xl font-bold sm:text-4xl">
                                {PORTFOLIO_CONTENT.title}
                            </h2>
                            <p className="mt-2 text-[var(--premium-fg-muted)]">{PORTFOLIO_CONTENT.subtitle}</p>
                        </div>
                        <Link
                            href={PORTFOLIO_CONTENT.cta.href}
                            className="text-sm font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
                        >
                            {PORTFOLIO_CONTENT.cta.label} &rarr;
                        </Link>
                    </div>
                </SectionReveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => (
                        <SectionReveal key={item.slug} delay={i * 0.1}>
                            <Link href={MARKETING_ROUTES.portfolioItem(item.slug)} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-2xl">
                                <MorphCard>
                                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{item.category}</span>
                                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{item.tagline}</p>
                                </MorphCard>
                            </Link>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
