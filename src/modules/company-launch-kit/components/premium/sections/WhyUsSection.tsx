"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Layers, Brain, Zap, Shield } from "lucide-react";
import { MorphCard } from "@/src/modules/company-launch-kit/components/premium/ui/MorphCard";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { WHY_US_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

const ICONS = { layers: Layers, brain: Brain, zap: Zap, shield: Shield };

export function WhyUsSection() {
    const ref = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);

    return (
        <section ref={ref} className="premium-section relative overflow-hidden" aria-labelledby="why-us-heading">
            <motion.div style={{ y }} className="premium-container">
                <SectionReveal>
                    <h2 id="why-us-heading" className="font-display text-center text-3xl font-bold sm:text-4xl">
                        {WHY_US_CONTENT.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--premium-fg-muted)]">{WHY_US_CONTENT.subtitle}</p>
                </SectionReveal>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {WHY_US_CONTENT.pillars.map((pillar, i) => {
                        const Icon = ICONS[pillar.icon as keyof typeof ICONS] ?? Layers;
                        return (
                            <SectionReveal key={pillar.title} delay={i * 0.1}>
                                <MorphCard>
                                    <Icon className="h-8 w-8 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                                    <h3 className="mt-4 text-lg font-semibold">{pillar.title}</h3>
                                    <p className="mt-2 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{pillar.description}</p>
                                </MorphCard>
                            </SectionReveal>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
