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
                    <div className="tc-reveal rounded-2xl border border-indigo-500/20 bg-indigo-950 px-8 py-12 text-center text-white sm:px-12">
                        <h2 id="tc-cta-heading" className="font-display text-3xl font-bold sm:text-4xl">
                            {CTA_CONTENT.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-indigo-100">{CTA_CONTENT.subtitle}</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href={CTA_CONTENT.primaryCta.href}
                                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            >
                                {CTA_CONTENT.primaryCta.label}
                            </Link>
                            <Link
                                href={CTA_CONTENT.secondaryCta.href}
                                className="inline-flex items-center justify-center rounded-xl border border-indigo-300/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/50"
                            >
                                {CTA_CONTENT.secondaryCta.label}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
