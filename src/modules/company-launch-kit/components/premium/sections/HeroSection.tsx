import Link from "next/link";
import { ChevronDown, Shield, Lock, Cpu, Building2 } from "lucide-react";
import { BrandLogo } from "@/src/modules/brand-os/components/BrandLogo";
import { HeroEnterpriseIllustration } from "@/src/modules/company-launch-kit/components/premium/sections/HeroEnterpriseIllustration";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

const TRUST_ICONS = [Shield, Lock, Building2, Cpu];

const TRUST_SECTIONS = [
    HERO_CONTENT.trust.industries,
    HERO_CONTENT.trust.technologies,
    HERO_CONTENT.trust.delivery,
] as const;

const CTA_PRIMARY =
    "relative inline-flex items-center justify-center rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:bg-indigo-600 dark:hover:bg-indigo-500";

const CTA_SECONDARY =
    "relative inline-flex items-center justify-center rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] px-6 py-3 text-sm font-semibold text-[var(--premium-fg)] transition-colors hover:border-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50";

/** Server-rendered hero — critical LCP content without client JS. */
export function HeroSection() {
    return (
        <section className="premium-section relative min-h-[92vh] overflow-hidden" aria-labelledby="hero-heading">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="hero-mesh-1 absolute -left-1/3 top-1/4 h-[60%] w-[60%] rounded-full opacity-30 blur-[80px]" style={{ background: "var(--premium-mesh-1)" }} />
                <div className="hero-mesh-2 absolute -right-1/4 bottom-1/4 h-[50%] w-[50%] rounded-full opacity-25 blur-[70px]" style={{ background: "var(--premium-mesh-2)" }} />
                <div className="hero-mesh-3 absolute left-1/3 top-0 h-[40%] w-[40%] rounded-full opacity-20 blur-[60px]" style={{ background: "var(--premium-mesh-3)" }} />
            </div>
            <div className="premium-noise pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />

            <div className="premium-container relative z-10 flex min-h-[88vh] flex-col justify-center pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
                <div className="mb-8">
                    <BrandLogo variant="horizontal" className="h-10" />
                </div>
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
                    <div className="lg:col-span-7 xl:col-span-6">
                        <p className="hero-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-indigo-700 dark:text-indigo-300 sm:text-sm">
                            {HERO_CONTENT.eyebrow}
                        </p>

                        <h1
                            id="hero-heading"
                            className="font-display mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            {HERO_CONTENT.headline}
                        </h1>

                        <p className="hero-fade-up hero-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[var(--premium-fg-muted)] sm:mt-6 sm:text-lg lg:max-w-2xl">
                            {HERO_CONTENT.subheadline}
                        </p>

                        <nav className="hero-fade-up hero-delay-3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4" aria-label="Primary hero actions">
                            <Link href={HERO_CONTENT.primaryCta.href} className={CTA_PRIMARY}>
                                {HERO_CONTENT.primaryCta.label}
                            </Link>
                            <Link href={HERO_CONTENT.secondaryCta.href} className={CTA_SECONDARY}>
                                {HERO_CONTENT.secondaryCta.label}
                            </Link>
                        </nav>

                        <ul className="hero-fade-up hero-delay-4 mt-8 flex flex-wrap gap-x-5 gap-y-3 sm:mt-9" aria-label="Platform trust indicators">
                            {HERO_CONTENT.trustIndicators.map((label, i) => {
                                const Icon = TRUST_ICONS[i] ?? Shield;
                                return (
                                    <li key={label} className="flex items-center gap-2 text-sm text-[var(--premium-fg-muted)]">
                                        <Icon className="h-4 w-4 shrink-0 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
                                        {label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="hero-fade-up hero-delay-2 lg:col-span-5 xl:col-span-6">
                        <HeroEnterpriseIllustration />
                    </div>
                </div>

                <div className="hero-fade-up hero-delay-3 mt-14 border-t border-[var(--premium-border)] pt-10 sm:mt-16 lg:mt-20" aria-label="Trust and credentials">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                        {TRUST_SECTIONS.map((section) => (
                            <div key={section.title} className="premium-glass rounded-xl border border-[var(--premium-border)] p-5 sm:p-6">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                                    {section.title}
                                </h2>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {section.items.map((item) => (
                                        <li key={item}>
                                            <span className="inline-block rounded-lg border border-[var(--premium-border)] bg-[var(--premium-glass)] px-3 py-1.5 text-sm text-[var(--premium-fg-muted)]">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="hero-fade-up hero-delay-4 mt-12 grid min-h-[5.5rem] grid-cols-2 gap-6 sm:mt-14 sm:grid-cols-4 sm:gap-8"
                    role="region"
                    aria-label="Platform statistics"
                >
                    {HERO_CONTENT.stats.map((stat) => (
                            <div key={stat.label} className="rounded-lg bg-white/90 px-3 py-2 text-center sm:bg-transparent sm:px-0 sm:py-0 sm:text-left">
                            <p className="font-display text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
                                {stat.value.toLocaleString()}
                                {stat.suffix}
                            </p>
                            <p className="mt-1.5 text-sm text-slate-700">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="hero-scroll-hint absolute bottom-6 left-1/2 hidden -translate-x-1/2 motion-reduce:hidden sm:block" aria-hidden="true">
                    <ChevronDown className="h-6 w-6 text-[var(--premium-fg-muted)]" />
                </div>
            </div>
        </section>
    );
}
