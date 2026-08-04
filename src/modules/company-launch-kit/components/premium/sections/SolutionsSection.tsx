"use client";

import { DashboardMockup } from "@/src/modules/company-launch-kit/components/premium/ui/DashboardMockup";
import { GlassCard } from "@/src/modules/company-launch-kit/components/premium/ui/GlassCard";
import { IsometricPlatform } from "@/src/modules/company-launch-kit/components/premium/ui/IsometricPlatform";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { SOLUTIONS_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

export function SolutionsSection() {
    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="solutions-heading">
            <div className="premium-container">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <SectionReveal>
                            <h2 id="solutions-heading" className="font-display text-3xl font-bold sm:text-4xl">
                                {SOLUTIONS_CONTENT.title}
                            </h2>
                            <p className="mt-4 text-[var(--premium-fg-muted)]">{SOLUTIONS_CONTENT.subtitle}</p>
                        </SectionReveal>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {SOLUTIONS_CONTENT.solutions.map((solution, i) => (
                                <SectionReveal key={solution.title} delay={i * 0.06}>
                                    <GlassCard hover={false} className="p-4">
                                        <h3 className="font-semibold">{solution.title}</h3>
                                        <p className="mt-1 text-sm text-[var(--premium-fg-muted)]">{solution.description}</p>
                                    </GlassCard>
                                </SectionReveal>
                            ))}
                        </div>
                    </div>

                    <SectionReveal delay={0.2}>
                        <div className="relative">
                            <IsometricPlatform className="mb-6" />
                            <DashboardMockup />
                        </div>
                    </SectionReveal>
                </div>
            </div>
        </section>
    );
}
