"use client";

import { AuroraBackground } from "@/src/modules/company-launch-kit/components/premium/ui/AuroraBackground";
import { MagneticButton } from "@/src/modules/company-launch-kit/components/premium/ui/MagneticButton";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { CTA_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

export function PremiumCtaSection() {
    return (
        <section className="premium-section" aria-labelledby="cta-heading">
            <div className="premium-container">
                <AuroraBackground className="rounded-3xl px-8 py-16 text-center sm:px-16">
                    <SectionReveal>
                        <h2 id="cta-heading" className="font-display text-3xl font-bold sm:text-4xl">
                            {CTA_CONTENT.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-[var(--premium-fg-muted)]">{CTA_CONTENT.subtitle}</p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <MagneticButton href={CTA_CONTENT.primaryCta.href}>{CTA_CONTENT.primaryCta.label}</MagneticButton>
                            <MagneticButton href={CTA_CONTENT.secondaryCta.href} variant="secondary">
                                {CTA_CONTENT.secondaryCta.label}
                            </MagneticButton>
                        </div>
                    </SectionReveal>
                </AuroraBackground>
            </div>
        </section>
    );
}
