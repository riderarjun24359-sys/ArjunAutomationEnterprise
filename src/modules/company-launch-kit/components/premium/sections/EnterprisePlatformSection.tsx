"use client";

import { Check } from "lucide-react";
import { DashboardMockup } from "@/src/modules/company-launch-kit/components/premium/ui/DashboardMockup";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";
import { ENTERPRISE_PLATFORM_CONTENT } from "@/src/modules/company-launch-kit/data/home-content";

export function EnterprisePlatformSection() {
    return (
        <section className="premium-section bg-[var(--premium-bg-secondary)]" aria-labelledby="enterprise-heading">
            <div className="premium-container">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <SectionReveal>
                        <h2 id="enterprise-heading" className="font-display text-3xl font-bold sm:text-4xl">
                            {ENTERPRISE_PLATFORM_CONTENT.title}
                        </h2>
                        <p className="mt-4 text-[var(--premium-fg-muted)]">{ENTERPRISE_PLATFORM_CONTENT.subtitle}</p>
                        <ul className="mt-8 space-y-3">
                            {ENTERPRISE_PLATFORM_CONTENT.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm">
                                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </SectionReveal>

                    <SectionReveal delay={0.2}>
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-500/20 to-cyan-500/10 blur-2xl" aria-hidden="true" />
                            <div className="relative mx-auto max-w-md">
                                <div className="rounded-[2rem] border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl dark:border-slate-700">
                                    <div className="overflow-hidden rounded-[1.5rem] bg-[var(--premium-bg)]">
                                        <DashboardMockup className="border-0 shadow-none" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-800 dark:bg-slate-600" aria-hidden="true" />
                            </div>
                        </div>
                    </SectionReveal>
                </div>
            </div>
        </section>
    );
}
