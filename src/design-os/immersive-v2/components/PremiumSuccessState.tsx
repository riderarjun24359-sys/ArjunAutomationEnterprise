"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { CelebrationBurst } from "./CelebrationBurst";
import { SuccessState } from "@/src/design-os/components/SuccessState";
import { cn } from "@/src/lib/cn";

export function PremiumSuccessState({
    title,
    description,
    action,
    celebrate = true,
    className,
}: {
    title?: string;
    description: string;
    action?: React.ReactNode;
    celebrate?: boolean;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("immersive-premium-success relative", className)}>
            <CelebrationBurst active={celebrate && !reduced} />
            <m.div initial={reduced ? false : { scale: 0.98 }} animate={{ scale: 1 }}>
                <SuccessState title={title} description={description} action={action} />
            </m.div>
        </div>
    );
}
