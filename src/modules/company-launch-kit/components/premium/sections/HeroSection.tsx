import Link from "next/link";
import { Check } from "lucide-react";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { HeroProductConcept } from "@/src/modules/company-launch-kit/components/premium/ui/HeroProductConcept";

const CTA_PRIMARY =
    "inline-flex items-center justify-center rounded-full bg-[var(--dos-brand-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--premium-accent-glow)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2";

const CTA_SECONDARY =
    "inline-flex items-center justify-center rounded-full border border-[var(--premium-border)] bg-[var(--premium-bg-tertiary)] px-7 py-3.5 text-sm font-semibold text-[var(--premium-fg)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--premium-bg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2";

/**
 * Hero — server-rendered. Background and entrance motion are pure CSS
 * (.hero-grid-bg, .hero-fade-up), so the homepage ships no WebGL or
 * animation-library JavaScript. The product visual is an honestly labelled
 * concept (see HeroProductConcept), never a fabricated live screenshot.
 */
export function HeroSection() {
    return (
        <section
            className="relative overflow-hidden border-b border-[var(--premium-border)] pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36"
            aria-labelledby="hero-heading"
        >
            {/* Atmospheric background — CSS only, clipped by the section */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="hero-grid-bg absolute inset-0" />
                <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[var(--premium-accent)] opacity-[0.12] blur-[120px]" />
                <div className="absolute -right-32 top-1/3 h-[480px] w-[480px] rounded-full bg-[var(--premium-accent-hover)] opacity-[0.10] blur-[120px]" />
            </div>

            {/* Angular divider accent */}
            <div className="absolute left-0 right-0 top-0 premium-divider" aria-hidden="true" />

            <div className="premium-container relative w-full">
                <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                    {/* Content */}
                    <div className="hero-fade-up max-w-2xl">
                        <p className="premium-eyebrow">{HERO_CONTENT.eyebrow}</p>

                        <h1
                            id="hero-heading"
                            className="font-display mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-[var(--premium-fg)] sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            Run your business on one intelligent system.
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--premium-fg-muted)] sm:text-lg">
                            {HERO_CONTENT.subheadline}
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link href={HERO_CONTENT.primaryCta.href} className={CTA_PRIMARY}>
                                {HERO_CONTENT.primaryCta.label}
                            </Link>
                            <Link href={HERO_CONTENT.secondaryCta.href} className={CTA_SECONDARY}>
                                {HERO_CONTENT.secondaryCta.label}
                            </Link>
                        </div>

                        <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
                            {HERO_CONTENT.trustIndicators.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2 text-sm font-medium text-[var(--premium-fg-muted)]"
                                >
                                    <Check
                                        className="h-4 w-4 shrink-0 text-[var(--premium-accent)]"
                                        aria-hidden="true"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Honest product-concept visual */}
                    <div className="hero-fade-up hero-delay-2 w-full">
                        <HeroProductConcept />
                    </div>
                </div>
            </div>
        </section>
    );
}