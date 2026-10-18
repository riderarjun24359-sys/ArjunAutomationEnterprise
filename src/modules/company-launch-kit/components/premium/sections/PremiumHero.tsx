"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Shield, Lock, Cpu, Building2 } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { NoiseOverlay } from "@/src/modules/company-launch-kit/components/premium/ui/NoiseOverlay";
import { HeroStatCounter } from "@/src/modules/company-launch-kit/components/premium/sections/HeroStatCounter";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

const HeroEnterpriseIllustration = dynamic(
    () =>
        import("@/src/modules/company-launch-kit/components/premium/sections/HeroEnterpriseIllustration").then(
            (m) => m.HeroEnterpriseIllustration,
        ),
    { ssr: false, loading: () => <div className="aspect-[4/3] w-full max-w-md rounded-2xl bg-orange-950/20 lg:max-w-none" aria-hidden="true" /> },
);

const ParticleField = dynamic(
    () => import("@/src/modules/company-launch-kit/components/premium/ui/ParticleField").then((m) => m.ParticleField),
    { ssr: false },
);

const TRUST_ICONS = [Shield, Lock, Building2, Cpu];

const TRUST_SECTIONS = [
    HERO_CONTENT.trust.industries,
    HERO_CONTENT.trust.technologies,
    HERO_CONTENT.trust.delivery,
] as const;

const CTA_PRIMARY =
    "relative inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 dark:bg-orange-600 dark:hover:bg-orange-500";

const CTA_SECONDARY =
    "relative inline-flex items-center justify-center rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] px-6 py-3 text-sm font-semibold text-[var(--premium-fg)] transition-colors hover:border-orange-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50";

export function PremiumHero() {
    const reduced = useReducedMotion();
    const [showParticles, setShowParticles] = useState(false);

    useEffect(() => {
        if (reduced) return;
        const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 800));
        const id = idle(() => setShowParticles(true));
        return () => {
            if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
            else clearTimeout(id as number);
        };
    }, [reduced]);

    return (
        <section
            className="premium-section relative min-h-[92vh] overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* CSS-only gradient mesh — avoids framer-motion on critical path */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div
                    className={cn("absolute -left-1/3 top-1/4 h-[60%] w-[60%] rounded-full opacity-30 blur-[80px]", !reduced && "hero-mesh-1")}
                    style={{ background: "var(--premium-mesh-1)" }}
                />
                <div
                    className={cn("absolute -right-1/4 bottom-1/4 h-[50%] w-[50%] rounded-full opacity-25 blur-[70px]", !reduced && "hero-mesh-2")}
                    style={{ background: "var(--premium-mesh-2)" }}
                />
                <div
                    className={cn("absolute left-1/3 top-0 h-[40%] w-[40%] rounded-full opacity-20 blur-[60px]", !reduced && "hero-mesh-3")}
                    style={{ background: "var(--premium-mesh-3)" }}
                />
            </div>

            {showParticles && !reduced ? (
                <ParticleField className="absolute inset-0 h-full w-full opacity-40" count={40} />
            ) : null}
            <NoiseOverlay />

            <div className="premium-container relative z-10 flex min-h-[88vh] flex-col justify-center pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
                    <div className="lg:col-span-7 xl:col-span-6">
                        <p className="hero-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-orange-600 dark:text-orange-400 sm:text-sm">
                            {HERO_CONTENT.eyebrow}
                        </p>

                        <h1
                            id="hero-heading"
                            className="font-display hero-fade-up hero-delay-1 mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            {HERO_CONTENT.headline}
                        </h1>

                        <p className="hero-fade-up hero-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[var(--premium-fg-muted)] sm:mt-6 sm:text-lg lg:max-w-2xl">
                            {HERO_CONTENT.subheadline}
                        </p>

                        <nav
                            className="hero-fade-up hero-delay-3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
                            aria-label="Primary hero actions"
                        >
                            <Link href={HERO_CONTENT.primaryCta.href} className={CTA_PRIMARY}>
                                {HERO_CONTENT.primaryCta.label}
                            </Link>
                            <Link href={HERO_CONTENT.secondaryCta.href} className={CTA_SECONDARY}>
                                {HERO_CONTENT.secondaryCta.label}
                            </Link>
                        </nav>

                        <ul
                            className="hero-fade-up hero-delay-4 mt-8 flex flex-wrap gap-x-5 gap-y-3 sm:mt-9"
                            aria-label="Platform trust indicators"
                        >
                            {HERO_CONTENT.trustIndicators.map((label, i) => {
                                const Icon = TRUST_ICONS[i] ?? Shield;
                                return (
                                    <li key={label} className="flex items-center gap-2 text-sm text-[var(--premium-fg-muted)]">
                                        <Icon className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" aria-hidden="true" />
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

                <div
                    className="hero-fade-up hero-delay-3 mt-14 border-t border-[var(--premium-border)] pt-10 sm:mt-16 lg:mt-20"
                    aria-label="Trust and credentials"
                >
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                        {TRUST_SECTIONS.map((section) => (
                            <div key={section.title} className="premium-glass rounded-xl border border-[var(--premium-border)] p-5 sm:p-6">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
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
                        <div key={stat.label} className="text-center sm:text-left">
                            <p className="font-display text-3xl font-bold tabular-nums text-orange-600 dark:text-orange-400 sm:text-4xl">
                                <HeroStatCounter value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="mt-1.5 text-sm text-[var(--premium-fg-muted)]">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {!reduced ? (
                    <div className="hero-scroll-hint absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden="true">
                        <ChevronDown className="h-6 w-6 text-[var(--premium-fg-muted)]" />
                    </div>
                ) : null}
            </div>
        </section>
    );
}
