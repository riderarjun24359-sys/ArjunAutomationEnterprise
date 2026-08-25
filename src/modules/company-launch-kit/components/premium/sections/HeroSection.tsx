"use client";

import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AnimatedGridPattern } from "@/src/components/magic/AnimatedGridPattern";
import { Spotlight } from "@/src/components/magic/Spotlight";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

import { ArjunOSVisualization } from '@/src/modules/public-site/components/3d/ArjunOSVisualization';

const Environment3D = dynamic(() => import('@/src/modules/public-site/components/3d/Environment3D'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[var(--dos-surface-tertiary)] animate-pulse rounded-[var(--dos-radius-2xl)]" />
});

const CTA_PRIMARY =
    "inline-flex items-center justify-center rounded-full bg-[var(--dos-brand-primary)] px-8 py-3 text-sm font-semibold text-[var(--dos-surface)] transition-all hover:scale-105 hover:bg-[var(--dos-brand-primary-hover)] active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2";

const CTA_SECONDARY =
    "inline-flex items-center justify-center rounded-full border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-8 py-3 text-sm font-semibold text-[var(--dos-text-primary)] transition-all hover:bg-[var(--dos-surface-secondary)] hover:border-[var(--dos-border-strong)] active:scale-95";

/** Cinematic Digital Command Center Hero */
export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden" aria-labelledby="hero-heading">
            {/* Atmospheric Background Layer */}
            <div className="absolute inset-0 z-0">
                <Spotlight className="w-full h-full opacity-50">
                    <AnimatedGridPattern className="z-10 opacity-20" />
                </Spotlight>
            </div>

            <div className="premium-container relative w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Content Layer */}
                <div className="z-20 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="dos-text-caption text-[var(--dos-brand-primary)] mb-4 block">
                            {HERO_CONTENT.eyebrow}
                        </span>
                        <h1 id="hero-heading" className="dos-text-display text-[var(--dos-text-primary)] mb-6">
                            Run your business on one intelligent system.
                        </h1>
                        <p className="dos-text-body max-w-xl">
                            {HERO_CONTENT.subheadline}
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link href={MARKETING_ROUTES.contact} className={CTA_PRIMARY}>
                            Get Started
                        </Link>
                        <Link href={MARKETING_ROUTES.portfolio} className={CTA_SECONDARY}>
                            View Our Work
                        </Link>
                    </motion.div>
                </div>

                {/* Immersive Product-Focused Layer */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className="relative aspect-[4/3] rounded-[var(--dos-radius-2xl)] overflow-hidden border border-[var(--dos-border-subtle)] shadow-[var(--dos-shadow-glow)]"
                >
                    {/* Environmental Background */}
                    <div className="absolute inset-0 z-0 bg-[var(--dos-surface-elevated)]">
                        <Suspense fallback={<div className="w-full h-full bg-[var(--dos-surface-tertiary)] animate-pulse" />}>
                            <Environment3D />
                        </Suspense>
                    </div>

                    {/* Product Composition */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
                        <Suspense fallback={<div className="w-full h-full bg-[var(--dos-surface-tertiary)] animate-pulse" />}>
                            <ArjunOSVisualization />
                        </Suspense>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
