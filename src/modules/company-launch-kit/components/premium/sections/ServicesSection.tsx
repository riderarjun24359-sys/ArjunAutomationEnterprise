"use client";

import { Clock } from "lucide-react";
import { GlassCard } from "@/src/modules/company-launch-kit/components/premium/ui/GlassCard";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { SERVICES_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

export function ServicesSection() {
    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="services-heading">
            <div className="premium-container">
                <SectionReveal>
                    <h2 id="services-heading" className="font-display text-3xl font-bold sm:text-4xl">
                        {SERVICES_CONTENT.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[var(--premium-fg-muted)]">{SERVICES_CONTENT.subtitle}</p>
                </SectionReveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES_CONTENT.services.map((service, i) => (
                        <SectionReveal key={service.title} delay={i * 0.08}>
                            <GlassCard>
                                <h3 className="text-lg font-semibold">{service.title}</h3>
                                <p className="mt-3 text-sm text-[var(--premium-fg-muted)] leading-relaxed">{service.description}</p>
                                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                                    <Clock className="h-4 w-4" aria-hidden="true" />
                                    {service.timeline}
                                </p>
                            </GlassCard>
                        </SectionReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
