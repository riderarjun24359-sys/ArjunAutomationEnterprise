import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/src/modules/company-launch-kit/components/CtaSection";
import { MarketingBreadcrumbs } from "@/src/modules/company-launch-kit/components/MarketingBreadcrumbs";
import { MarketingStructuredData } from "@/src/modules/company-launch-kit/components/MarketingStructuredData";
import { PremiumPageShell } from "@/src/modules/company-launch-kit/components/premium/PremiumPageShell";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import {
    ENTERPRISE_ENGAGEMENT,
    IMPLEMENTATION_TIERS,
    MANAGED_SUPPORT_TIERS,
    PRICING_PHILOSOPHY,
} from "@/src/modules/company-launch-kit/data/pricing";
import { buildMetadata } from "@/src/lib/seo";

const PAGE = {
    title: "Pricing",
    description:
        "Transparent, milestone-based pricing for Arjun Automation platform implementation, industry packs, AI workers, and managed support.",
    path: MARKETING_ROUTES.pricing,
};

export const metadata: Metadata = buildMetadata({
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
});

const breadcrumbs = [
    { name: "Home", path: MARKETING_ROUTES.home },
    { name: "Pricing", path: PAGE.path },
];

export default function PricingPage() {
    return (
        <>
            <MarketingStructuredData
                title={PAGE.title}
                description={PAGE.description}
                path={PAGE.path}
                breadcrumbs={breadcrumbs}
            />
            <PremiumPageShell title={PAGE.title} description={PRICING_PHILOSOPHY.title}>
                <MarketingBreadcrumbs items={breadcrumbs} />

                <div className="space-y-16">
                    <section aria-labelledby="philosophy-heading">
                        <h2 id="philosophy-heading" className="text-2xl font-semibold">
                            Our pricing philosophy
                        </h2>
                        <ul className="mt-6 space-y-3">
                            {PRICING_PHILOSOPHY.principles.map((principle) => (
                                <li key={principle} className="flex items-start gap-3 text-[var(--premium-fg-muted)]">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                    {principle}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section aria-labelledby="implementation-heading">
                        <h2 id="implementation-heading" className="text-2xl font-semibold">
                            Implementation packages
                        </h2>
                        <p className="mt-3 text-[var(--premium-fg-muted)]">
                            Milestone billing: 40% at signing, 30% at UAT start, 30% at go-live. Platform subscription quoted separately.
                        </p>
                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                            {IMPLEMENTATION_TIERS.map((tier) => (
                                <article
                                    key={tier.name}
                                    className={`premium-glass rounded-2xl p-8 ${tier.highlighted ? "ring-2 ring-indigo-700" : ""}`}
                                >
                                    {tier.highlighted && (
                                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Most Popular</span>
                                    )}
                                    <h3 className="mt-2 text-xl font-semibold">{tier.name}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{tier.description}</p>
                                    <p className="mt-4 text-lg font-semibold text-indigo-700">{tier.indicativeRange}</p>
                                    <ul className="mt-6 space-y-2">
                                        {tier.scope.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-[var(--premium-fg-muted)]">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-700" aria-hidden="true" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="support-heading">
                        <h2 id="support-heading" className="text-2xl font-semibold">
                            Managed support
                        </h2>
                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                            {MANAGED_SUPPORT_TIERS.map((tier) => (
                                <article key={tier.name} className="premium-glass rounded-2xl p-8">
                                    <h3 className="text-xl font-semibold">{tier.name}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{tier.description}</p>
                                    <p className="mt-4 font-semibold text-indigo-700">{tier.indicativeRange}</p>
                                    <ul className="mt-6 space-y-2">
                                        {tier.scope.map((item) => (
                                            <li key={item} className="text-sm text-[var(--premium-fg-muted)]">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="enterprise-heading" className="premium-glass rounded-2xl p-8">
                        <h2 id="enterprise-heading" className="text-2xl font-semibold">
                            {ENTERPRISE_ENGAGEMENT.title}
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)] leading-relaxed">{ENTERPRISE_ENGAGEMENT.description}</p>
                        <ol className="mt-8 space-y-4">
                            {ENTERPRISE_ENGAGEMENT.steps.map((step, index) => (
                                <li key={step.title} className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-semibold text-white">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold">{step.title}</h3>
                                        <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <Link
                            href={ENTERPRISE_ENGAGEMENT.cta.href}
                            className="mt-8 inline-flex rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                        >
                            {ENTERPRISE_ENGAGEMENT.cta.label}
                        </Link>
                    </section>
                </div>
            </PremiumPageShell>
            <CtaSection
                title="Need a custom quote?"
                description="Every organization is different. Book a consultation and we will scope a proposal aligned to your outcomes."
                primaryLabel="Book Consultation"
            />
        </>
    );
}
