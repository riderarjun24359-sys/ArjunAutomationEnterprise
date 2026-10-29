"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

/**
 * Enterprise homepage hero (client component).
 *
 * Uses Framer Motion for the fade-in-up entrance so the motion is
 * declarative and honours `prefers-reduced-motion` (the hook returns the
 * user's preference and we drop all transform/opacity animation when set).
 *
 * Copy integrity: the headline, sub-headline and CTAs are the real
 * positioning — no metrics, logos, or outcomes are claimed here that cannot
 * be verified. The right column is a well-structured placeholder for a
 * custom Lottie / WebM motion graphic (see MotionGraphicPlaceholder).
 */

const primaryButton =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--premium-accent-glow)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg)] sm:w-auto bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#8b5cf6]";

const secondaryButton =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--dos-border-strong)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[var(--premium-fg)] transition hover:border-[var(--premium-accent)] hover:text-[var(--premium-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg)] sm:w-auto";

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * Well-structured placeholder for a custom Lottie / WebM motion graphic.
 *
 * It is intentionally an *honest* placeholder — a labelled, branded frame
 * rather than a fabricated product screenshot with fake numbers. Drop a
 * `<lottie-player>` or a `<video autoPlay loop muted playsInline>` into the
 * marked inner area to replace it without touching the surrounding layout.
 */
function MotionGraphicPlaceholder() {
    return (
        <figure
            className="placeholder-drift premium-glass relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--premium-border)] shadow-[var(--premium-shadow)]"
            aria-label="Product motion graphic placeholder"
        >
            <figcaption className="sr-only">
                Placeholder for an Arjun Automation product motion graphic. No customer data is shown.
            </figcaption>

            {/* Branded gradient wash */}
            <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(120% 120% at 15% 0%, rgba(59,130,246,0.22), transparent 55%), radial-gradient(120% 120% at 100% 100%, rgba(139,92,246,0.22), transparent 55%)",
                }}
            />
            {/* Technical grid */}
            <div className="premium-grid-bg absolute inset-0" aria-hidden="true" />
            {/* Slow sheen sweep */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="placeholder-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* Inner drop zone for the real Lottie / WebM asset */}
            <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="premium-card-icon h-12 w-12" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                        <path d="M7 4.5v15l13-7.5-13-7.5Z" strokeLinejoin="round" />
                    </svg>
                </span>
                <div>
                    <p className="text-sm font-semibold text-[var(--premium-fg)]">Product motion graphic</p>
                    <p className="mt-1 text-xs text-[var(--premium-fg-muted)]">
                        Drop a Lottie or WebM loop here
                    </p>
                </div>
                <span className="premium-chip" aria-hidden="true">
                    16:9 · autoplay · muted · loop
                </span>
            </div>

            {/* Angular corner accents */}
            <span className="premium-corner left-3 top-3" aria-hidden="true" />
            <span
                className="premium-corner bottom-3 right-3 rotate-180"
                aria-hidden="true"
            />
        </figure>
    );
}

export function MarketingHero() {
    const reduceMotion = useReducedMotion();
    const noMotion = Boolean(reduceMotion);

    return (
        <section className="relative overflow-hidden border-b border-[var(--premium-border)]">
            <div className="premium-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="premium-grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="premium-container relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
                <motion.div
                    variants={containerVariants}
                    initial={noMotion ? "show" : "hidden"}
                    animate="show"
                >
                    <motion.p variants={itemVariants} className="premium-eyebrow">
                        Arjun Automations
                    </motion.p>

                    <motion.h1
                        variants={itemVariants}
                        className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
                    >
                        Scale Your Business with Smart Automations &amp;{" "}
                        <span className="premium-gradient-text">Custom Software</span>.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--premium-fg-muted)]"
                    >
                        Eliminate manual work, accelerate revenue, and run your operations on one secure,
                        intelligent platform.
                    </motion.p>

                    <motion.div variants={itemVariants} className="mt-9 flex flex-col gap-4 sm:flex-row">
                        <Link href={MARKETING_ROUTES.contact} className={primaryButton}>
                            Book a Free Consultation
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link href={MARKETING_ROUTES.services} className={secondaryButton}>
                            Explore Services
                        </Link>
                    </motion.div>

                    <motion.p variants={itemVariants} className="mt-8 text-sm text-[var(--premium-fg-muted)]">
                        No commitment — a working session to map your biggest bottlenecks.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={noMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                    <MotionGraphicPlaceholder />
                </motion.div>
            </div>
        </section>
    );
}
