"use client";

import { AuroraBackground } from "@/src/modules/company-launch-kit/components/premium/ui/AuroraBackground";
import { GradientMesh } from "@/src/modules/company-launch-kit/components/premium/ui/GradientMesh";
import { NoiseOverlay } from "@/src/modules/company-launch-kit/components/premium/ui/NoiseOverlay";
import { SectionReveal } from "@/src/modules/company-launch-kit/components/premium/ui/SectionReveal";

type PremiumPageShellProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

export function PremiumPageShell({ title, description, children }: PremiumPageShellProps) {
    return (
        <>
            <section className="relative overflow-hidden pt-24 pb-16">
                <GradientMesh />
                <AuroraBackground className="absolute inset-0 opacity-50" />
                <NoiseOverlay opacity={0.03} />
                <div className="premium-container relative z-10">
                    <SectionReveal>
                        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
                        {description && <p className="mt-4 max-w-3xl text-lg text-[var(--premium-fg-muted)]">{description}</p>}
                    </SectionReveal>
                </div>
            </section>
            <div className="premium-container pb-16">{children}</div>
        </>
    );
}
