"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown, Shield, Lock, Cpu, Building2 } from "lucide-react";
import { AnimatedCounter } from "@/src/modules/company-launch-kit/components/premium/ui/AnimatedCounter";
import { GradientMesh } from "@/src/modules/company-launch-kit/components/premium/ui/GradientMesh";
import { MagneticButton } from "@/src/modules/company-launch-kit/components/premium/ui/MagneticButton";
import { NoiseOverlay } from "@/src/modules/company-launch-kit/components/premium/ui/NoiseOverlay";
import { StaggerText } from "@/src/modules/company-launch-kit/components/premium/ui/StaggerText";
import { HeroEnterpriseIllustration } from "@/src/modules/company-launch-kit/components/premium/sections/HeroEnterpriseIllustration";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

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

export function PremiumHero() {
    const reduced = useReducedMotion();

    return (
        <section
            className="premium-section relative min-h-[92vh] overflow-hidden"
            aria-labelledby="hero-heading"
        >
            <GradientMesh />
            {!reduced && <ParticleField className="absolute inset-0 h-full w-full opacity-50" />}
            <NoiseOverlay />

            <div className="premium-container relative z-10 flex min-h-[88vh] flex-col justify-center pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
                {/* Main hero grid: copy + illustration */}
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
                    {/* Copy column */}
                    <div className="lg:col-span-7 xl:col-span-6">
                        <motion.p
                            className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-400 sm:text-sm"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                        >
                            {HERO_CONTENT.eyebrow}
                        </motion.p>

                        <h1
                            id="hero-heading"
                            className="font-display mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl xl:text-7xl"
                        >
                            <StaggerText text={HERO_CONTENT.headline} mode="word" />
                        </h1>

                        <motion.p
                            className="mt-5 max-w-xl text-base leading-relaxed text-[var(--premium-fg-muted)] sm:mt-6 sm:text-lg lg:max-w-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.55 }}
                        >
                            {HERO_CONTENT.subheadline}
                        </motion.p>

                        <motion.nav
                            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
                            aria-label="Primary hero actions"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <MagneticButton href={HERO_CONTENT.primaryCta.href}>
                                {HERO_CONTENT.primaryCta.label}
                            </MagneticButton>
                            <MagneticButton href={HERO_CONTENT.secondaryCta.href} variant="secondary">
                                {HERO_CONTENT.secondaryCta.label}
                            </MagneticButton>
                        </motion.nav>

                        <ul
                            className="mt-8 flex flex-wrap gap-x-5 gap-y-3 sm:mt-9"
                            aria-label="Platform trust indicators"
                        >
                            {HERO_CONTENT.trustIndicators.map((label, i) => {
                                const Icon = TRUST_ICONS[i] ?? Shield;
                                return (
                                    <li key={label} className="flex items-center gap-2 text-sm text-[var(--premium-fg-muted)]">
                                        <Icon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                        {label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Illustration column */}
                    <motion.div
                        className="lg:col-span-5 xl:col-span-6"
                        initial={{ opacity: 0, x: reduced ? 0 : 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        <HeroEnterpriseIllustration />
                    </motion.div>
                </div>

                {/* Trust section: Industries · Technologies · Delivery */}
                <motion.div
                    className="mt-14 border-t border-[var(--premium-border)] pt-10 sm:mt-16 lg:mt-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.55 }}
                    aria-label="Trust and credentials"
                >
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                        {TRUST_SECTIONS.map((section) => (
                            <div key={section.title} className="premium-glass rounded-xl border border-[var(--premium-border)] p-5 sm:p-6">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    {section.title}
                                </h2>
                                <ul className="mt-4 flex flex-wrap gap-2" role="list">
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
                </motion.div>

                {/* Statistics */}
                <motion.div
                    className="mt-12 grid min-h-[5.5rem] grid-cols-2 gap-6 sm:mt-14 sm:grid-cols-4 sm:gap-8"
                    role="region"
                    aria-label="Platform statistics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.55 }}
                >
                    {HERO_CONTENT.stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center sm:text-left"
                        >
                            <p className="font-display text-3xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400 sm:text-4xl">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="mt-1.5 text-sm text-[var(--premium-fg-muted)]">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {!reduced && (
                    <motion.div
                        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden="true"
                    >
                        <ChevronDown className="h-6 w-6 text-[var(--premium-fg-muted)]" />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
