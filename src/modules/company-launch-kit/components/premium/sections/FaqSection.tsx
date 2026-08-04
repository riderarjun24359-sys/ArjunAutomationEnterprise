"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { FAQ_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { cn } from "@/src/lib/cn";

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="faq-heading">
            <div className="premium-container max-w-3xl">
                <SectionReveal>
                    <h2 id="faq-heading" className="font-display text-center text-3xl font-bold sm:text-4xl">
                        {FAQ_CONTENT.title}
                    </h2>
                </SectionReveal>

                <div className="mt-12 space-y-3">
                    {FAQ_CONTENT.items.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <SectionReveal key={item.question} delay={i * 0.05}>
                                <div className="overflow-hidden rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)]">
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between px-6 py-4 text-left font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                    >
                                        {item.question}
                                        <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <p className="px-6 pb-4 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{item.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </SectionReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
