"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { INDUSTRIES_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

export function IndustriesSection() {
    return (
        <section className="premium-section overflow-hidden" aria-labelledby="industries-heading">
            <div className="premium-container">
                <SectionReveal>
                    <h2 id="industries-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {INDUSTRIES_CONTENT.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[var(--premium-fg-muted)]">{INDUSTRIES_CONTENT.subtitle}</p>
                </SectionReveal>
            </div>

            <div className="mt-12 flex gap-4 overflow-x-auto px-6 pb-4 lg:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] snap-x snap-mandatory scrollbar-hide">
                {INDUSTRIES_CONTENT.industries.map((industry, i) => (
                    <motion.div
                        key={industry.name}
                        className="w-72 shrink-0 snap-start"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Link
                            href={industry.href}
                            className="group block h-full rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-glass)] p-6 transition hover:-translate-y-1 hover:shadow-[var(--premium-shadow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{industry.name}</h3>
                                <ArrowUpRight className="h-5 w-5 text-[var(--premium-fg-muted)] transition group-hover:text-indigo-600" aria-hidden="true" />
                            </div>
                            <p className="mt-3 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{industry.description}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
