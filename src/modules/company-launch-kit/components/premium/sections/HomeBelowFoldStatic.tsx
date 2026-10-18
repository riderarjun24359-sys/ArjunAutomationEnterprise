import Link from "next/link";
import {
    HERO_CONTENT,
    INDUSTRIES_CONTENT,
    CTA_CONTENT,
    SERVICES_CONTENT,
    SOLUTIONS_CONTENT,
    WHY_US_CONTENT,
} from "@/src/modules/company-launch-kit/data/home-content";

/** Server-rendered below-fold content — zero client JS on the homepage critical path. */
export function HomeBelowFoldStatic() {
    return (
        <>
            <section className="premium-section border-t border-[var(--premium-border)]" aria-labelledby="why-us-heading">
                <div className="premium-container">
                    <h2 id="why-us-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {WHY_US_CONTENT.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[var(--premium-fg-muted)]">{WHY_US_CONTENT.subtitle}</p>
                    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {WHY_US_CONTENT.pillars.map((pillar) => (
                            <li key={pillar.title} className="premium-glass rounded-xl border border-[var(--premium-border)] p-6">
                                <h3 className="font-semibold">{pillar.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{pillar.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="services-heading">
                <div className="premium-container">
                    <h2 id="services-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {SERVICES_CONTENT.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[var(--premium-fg-muted)]">{SERVICES_CONTENT.subtitle}</p>
                    <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {SERVICES_CONTENT.services.map((service) => (
                            <li key={service.title} className="rounded-xl border border-[var(--premium-border)] bg-[var(--premium-bg)] p-6">
                                <h3 className="font-semibold">{service.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--premium-fg-muted)]">{service.description}</p>
                                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-orange-800">{service.timeline}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="premium-section" aria-labelledby="industries-heading">
                <div className="premium-container">
                    <h2 id="industries-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {INDUSTRIES_CONTENT.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[var(--premium-fg-muted)]">{INDUSTRIES_CONTENT.subtitle}</p>
                    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {INDUSTRIES_CONTENT.industries.map((industry) => (
                            <li key={industry.name}>
                                <Link
                                    href={industry.href}
                                    className="block h-full rounded-xl border border-[var(--premium-border)] p-6 transition hover:border-orange-500/30"
                                >
                                    <h3 className="font-semibold">{industry.name}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{industry.description}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="solutions-heading">
                <div className="premium-container">
                    <h2 id="solutions-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {SOLUTIONS_CONTENT.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[var(--premium-fg-muted)]">{SOLUTIONS_CONTENT.subtitle}</p>
                    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {SOLUTIONS_CONTENT.solutions.map((solution) => (
                            <li key={solution.title} className="rounded-xl border border-[var(--premium-border)] bg-[var(--premium-bg)] p-6">
                                <h3 className="font-semibold">{solution.title}</h3>
                                <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{solution.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="premium-section" aria-labelledby="cta-heading">
                <div className="premium-container">
                    <div className="rounded-2xl border border-orange-500/20 bg-orange-950 px-8 py-12 text-center text-white sm:px-12">
                        <h2 id="cta-heading" className="font-display text-3xl font-bold sm:text-4xl">
                            {CTA_CONTENT.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-orange-100">{CTA_CONTENT.subtitle}</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href={CTA_CONTENT.primaryCta.href}
                                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-orange-900 hover:bg-indigo-50"
                            >
                                {CTA_CONTENT.primaryCta.label}
                            </Link>
                            <Link
                                href={CTA_CONTENT.secondaryCta.href}
                                className="inline-flex items-center justify-center rounded-xl border border-orange-300/40 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-900/50"
                            >
                                {CTA_CONTENT.secondaryCta.label}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
