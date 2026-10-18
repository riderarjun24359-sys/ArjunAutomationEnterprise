"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { CUSTOMER_JOURNEY_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

export function CustomerJourneySection() {
    const containerRef = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const lineHeight = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "100%"] : ["0%", "100%"]);

    return (
        <section ref={containerRef} className="premium-section" aria-labelledby="journey-heading">
            <div className="premium-container">
                <SectionReveal>
                    <h2 id="journey-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {CUSTOMER_JOURNEY_CONTENT.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[var(--premium-fg-muted)]">{CUSTOMER_JOURNEY_CONTENT.subtitle}</p>
                </SectionReveal>

                <div className="relative mt-16">
                    <div className="absolute left-4 top-0 h-full w-px bg-[var(--premium-border)] md:left-1/2 md:-translate-x-px">
                        <motion.div className="w-full bg-orange-600 dark:bg-orange-400" style={{ height: lineHeight }} />
                    </div>

                    <div className="space-y-12">
                        {CUSTOMER_JOURNEY_CONTENT.steps.map((step, i) => (
                            <SectionReveal key={step.title} delay={i * 0.1}>
                                <div className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:items-center md:gap-8`}>
                                    <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{step.phase}</span>
                                        <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
                                        <p className="mt-2 text-sm text-[var(--premium-fg-muted)]">{step.description}</p>
                                    </div>
                                    <div className="absolute left-4 top-2 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2">
                                        <div className="h-3 w-3 rounded-full border-2 border-orange-600 bg-[var(--premium-bg)] dark:border-orange-400" />
                                    </div>
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            </SectionReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
