"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { cinematicWelcomeItem } from "../variants";
import { cn } from "@/src/lib/cn";

export function OnboardingMoment({
    title,
    description,
    className,
}: {
    title: string;
    description: string;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn(
                "immersive-onboarding-moment dos-gpu rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-glass-bg)] p-5 backdrop-blur-md",
                className,
            )}
            variants={reduced ? undefined : cinematicWelcomeItem}
            initial={reduced ? false : "hidden"}
            animate="visible"
        >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dos-brand-primary)]">Moment</p>
            <p className="mt-2 text-base font-semibold text-[var(--dos-text-primary)]">{title}</p>
            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{description}</p>
        </m.div>
    );
}
