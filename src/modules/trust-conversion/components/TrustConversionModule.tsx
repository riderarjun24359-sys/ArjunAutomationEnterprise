import Link from "next/link";
import { CTA_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";
import { DeliveryProcessSection } from "@/src/modules/trust-conversion/components/sections/DeliveryProcessSection";
import { ServicesPreviewSection } from "@/src/modules/trust-conversion/components/sections/ServicesPreviewSection";
import { TrustedBySection } from "@/src/modules/trust-conversion/components/sections/TrustedBySection";
import { TrustMetricsSection } from "@/src/modules/trust-conversion/components/sections/TrustMetricsSection";
import { WhyArjunSection } from "@/src/modules/trust-conversion/components/sections/WhyArjunSection";
import "@/src/modules/trust-conversion/styles/trust-conversion.css";

/**
 * Business Module 1 — Trust & Conversion
 * Server-rendered integrated module with one lazy client island (animated counters).
 */
export function TrustConversionModule() {
    return (
        <>
            <TrustedBySection />
            <WhyArjunSection />
            <DeliveryProcessSection />
            <ServicesPreviewSection />
            <TrustMetricsSection />
            <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="tc-cta-heading">
                <div className="premium-container">
                    <div className="premium-cta-panel tc-reveal px-6 py-14 text-center sm:px-12 sm:py-16">
                        <span className="premium-cta-grid" aria-hidden="true" />
                        <div className="relative">
                            <h2
                                id="tc-cta-heading"
                                className="font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl"
                            >
                                {CTA_CONTENT.title}
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
                                {CTA_CONTENT.subtitle}
                            </p>
                            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href={CTA_CONTENT.primaryCta.href}
                                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0a1024] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1024]"
                                >
                                    {CTA_CONTENT.primaryCta.label}
                                </Link>
                                <Link
                                    href={CTA_CONTENT.secondaryCta.href}
                                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1024]"
                                >
                                    {CTA_CONTENT.secondaryCta.label}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
