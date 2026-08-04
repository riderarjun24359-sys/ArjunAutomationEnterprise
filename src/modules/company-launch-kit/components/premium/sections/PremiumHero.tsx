"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown, Shield, Lock, Cpu, Building2 } from "lucide-react";
import { AnimatedCounter } from "@/src/modules/company-launch-kit/components/premium/ui/AnimatedCounter";
import { GradientMesh } from "@/src/modules/company-launch-kit/components/premium/ui/GradientMesh";
import { MagneticButton } from "@/src/modules/company-launch-kit/components/premium/ui/MagneticButton";
import { NoiseOverlay } from "@/src/modules/company-launch-kit/components/premium/ui/NoiseOverlay";
import { StaggerText } from "@/src/modules/company-launch-kit/components/premium/ui/StaggerText";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

const ParticleField = dynamic(
    () => import("@/src/modules/company-launch-kit/components/premium/ui/ParticleField").then((m) => m.ParticleField),
    { ssr: false },
);

const TRUST_ICONS = [Shield, Lock, Building2, Cpu];

export function PremiumHero() {
    const reduced = useReducedMotion();

    return (
        <section className="premium-section relative min-h-[90vh] overflow-hidden">
            <GradientMesh />
            {!reduced && <ParticleField className="absolute inset-0 h-full w-full opacity-60" />}
            <NoiseOverlay />

            <div className="premium-container relative z-10 flex min-h-[85vh] flex-col justify-center pt-24">
                <motion.p
                    className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {HERO_CONTENT.eyebrow}
                </motion.p>

                <h1 className="font-display mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                    <StaggerText text={HERO_CONTENT.headline} mode="word" />
                </h1>

                <motion.p
                    className="mt-6 max-w-2xl text-lg text-[var(--premium-fg-muted)] leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {HERO_CONTENT.subheadline}
                </motion.p>

                <motion.div
                    className="mt-10 flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <MagneticButton href={HERO_CONTENT.primaryCta.href}>{HERO_CONTENT.primaryCta.label}</MagneticButton>
                    <MagneticButton href={HERO_CONTENT.secondaryCta.href} variant="secondary">
                        {HERO_CONTENT.secondaryCta.label}
                    </MagneticButton>
                </motion.div>

                <div className="mt-8 flex flex-wrap gap-4">
                    {HERO_CONTENT.trustIndicators.map((label, i) => {
                        const Icon = TRUST_ICONS[i] ?? Shield;
                        return (
                            <span key={label} className="flex items-center gap-2 text-sm text-[var(--premium-fg-muted)]">
                                <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                {label}
                            </span>
                        );
                    })}
                </div>

                <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
                    {HERO_CONTENT.stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="text-center sm:text-left"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                        >
                            <p className="font-display text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {!reduced && (
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ChevronDown className="h-6 w-6 text-[var(--premium-fg-muted)]" aria-hidden="true" />
                    </motion.div>
                )}

                {!reduced && (
                    <div className="pointer-events-none absolute right-0 top-1/3 hidden lg:block" aria-hidden="true">
                        <div className="h-24 w-24 animate-[premium-float_6s_ease-in-out_infinite] rounded-2xl border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-sm" style={{ transform: "rotateX(20deg) rotateY(-15deg)" }} />
                        <div className="mt-8 h-16 w-16 animate-[premium-float_8s_ease-in-out_infinite_1s] rounded-xl border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-sm" />
                    </div>
                )}
            </div>
        </section>
    );
}
