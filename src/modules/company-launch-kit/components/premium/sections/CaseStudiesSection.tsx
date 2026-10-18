"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { CASE_STUDIES_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

export function CaseStudiesSection() {
    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="case-studies-heading">
            <div className="premium-container">
                <SectionReveal>
                    <h2 id="case-studies-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {CASE_STUDIES_CONTENT.title}
                    </h2>
                    <p className="mt-4 text-[var(--premium-fg-muted)]">{CASE_STUDIES_CONTENT.subtitle}</p>
                </SectionReveal>

                <div className="mt-12 grid gap-6 lg:grid-cols-3">
                    {CASE_STUDIES_CONTENT.studies.map((study, i) => (
                        <SectionReveal key={study.title} delay={i * 0.1}>
                            <Link href={study.href} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-2xl">
                                <motion.article
                                    className="relative overflow-hidden rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-glass)] p-8"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute -right-4 -top-4 font-display text-7xl font-bold text-orange-600/10 dark:text-orange-400/10">
                                        {study.metric}
                                    </div>
                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{study.client}</p>
                                    <h3 className="mt-2 text-xl font-semibold group-hover:text-orange-600 dark:group-hover:text-orange-400">{study.title}</h3>
                                    <p className="mt-3 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{study.description}</p>
                                </motion.article>
                            </Link>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
