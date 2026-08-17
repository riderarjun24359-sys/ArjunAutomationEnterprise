"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AnimatedGridPattern } from "@/src/components/magic/AnimatedGridPattern";
import { Spotlight } from "@/src/components/magic/Spotlight";
import { HERO_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

const Environment3D = dynamic(() => import('@/src/modules/public-site/components/3d/Environment3D'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-premium-bg-secondary animate-pulse rounded-[2rem]" />
});

const CTA_PRIMARY =
    "relative inline-flex items-center justify-center rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-600";

const CTA_SECONDARY =
    "relative inline-flex items-center justify-center rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] px-6 py-3 text-sm font-semibold text-[var(--premium-fg)] transition-colors hover:border-indigo-500/30";

/** Cinematic Founder-First Spatial Hero */
export function HeroSection() {
    return (
        <section className="premium-section relative min-h-[70vh] flex items-center pt-20 pb-12 overflow-hidden" aria-labelledby="hero-heading">
            <Spotlight className="w-full h-full">
                <div className="premium-container relative w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Content Layer */}
                    <div className="lg:col-span-6 z-20 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 id="hero-heading" className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-tighter leading-[0.95] text-[var(--premium-fg)]">
                                {HERO_CONTENT.headline}
                            </h1>
                        </motion.div>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-[var(--premium-fg-muted)] max-w-md"
                        >
                            {HERO_CONTENT.subheadline}
                        </motion.p>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Link href={HERO_CONTENT.primaryCta.href} className={CTA_PRIMARY}>
                                {HERO_CONTENT.primaryCta.label}
                            </Link>
                            <Link href={HERO_CONTENT.secondaryCta.href} className={CTA_SECONDARY}>
                                {HERO_CONTENT.secondaryCta.label}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Spatial Founder Layer */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                        className="lg:col-span-6 w-full aspect-square lg:aspect-[4/3] relative rounded-[2rem] overflow-hidden"
                    >
                        {/* Background Plane */}
                        <div className="absolute inset-0 z-0">
                            <Suspense fallback={<div className="w-full h-full bg-premium-bg-secondary animate-pulse rounded-[2rem]" />}>
                                <Environment3D />
                            </Suspense>
                            <AnimatedGridPattern className="z-10 opacity-40" />
                        </div>

                        {/* Founder Composition */}
                        <div className="absolute inset-0 z-20">
                            <Image 
                                src="/brand/founder/founder-primary.jpeg" 
                                alt="Arjun Automation Founder"
                                fill
                                className="object-cover object-[50%_20%]"
                                priority
                            />
                            {/* Deep Atmospheric Masking */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--premium-bg)] via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--premium-bg)] via-transparent to-transparent" />

                        </div>
                    </motion.div>
                </div>
            </Spotlight>
        </section>
    );
}
