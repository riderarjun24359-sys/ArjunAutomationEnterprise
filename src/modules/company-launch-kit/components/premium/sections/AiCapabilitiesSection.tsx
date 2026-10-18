"use client";

import { motion } from "framer-motion";
import { FloatingGlow } from "@/src/modules/company-launch-kit/components/premium/ui/FloatingGlow";
import { GlassCard } from "@/src/modules/company-launch-kit/components/premium/ui/GlassCard";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { AI_CAPABILITIES_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

export function AiCapabilitiesSection() {
    const reduced = useReducedMotion();

    return (
        <section className="premium-section relative overflow-hidden" aria-labelledby="ai-heading">
            {!reduced && (
                <>
                    <FloatingGlow className="left-1/4 top-1/4 h-64 w-64" color="rgba(99,102,241,0.25)" />
                    <FloatingGlow className="right-1/4 bottom-1/4 h-48 w-48" color="rgba(6,182,212,0.2)" />
                </>
            )}

            <div className="premium-container relative z-10">
                <SectionReveal>
                    <h2 id="ai-heading" className="font-display text-center text-3xl font-bold sm:text-4xl">
                        {AI_CAPABILITIES_CONTENT.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--premium-fg-muted)]">{AI_CAPABILITIES_CONTENT.subtitle}</p>
                </SectionReveal>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {AI_CAPABILITIES_CONTENT.capabilities.map((cap, i) => (
                        <SectionReveal key={cap.title} delay={i * 0.08}>
                            <motion.div whileHover={reduced ? undefined : { y: -6 }}>
                                <GlassCard>
                                    <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-orange-600 to-cyan-500" />
                                    <h3 className="font-semibold">{cap.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{cap.description}</p>
                                </GlassCard>
                            </motion.div>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
