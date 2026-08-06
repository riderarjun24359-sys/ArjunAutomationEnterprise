"use client";

import { m } from "framer-motion";
import { ChartContainer } from "@/src/design-os/components/ChartContainer";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { chartReveal } from "@/src/design-os/motion/variants";
import { cn } from "@/src/lib/cn";

export function AnimatedChartFrame({
    title,
    children,
    className,
}: {
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn("immersive-chart-frame dos-gpu", className)}
            variants={reduced ? undefined : chartReveal}
            initial={reduced ? false : "hidden"}
            animate="visible"
        >
            <ChartContainer title={title}>{children}</ChartContainer>
        </m.div>
    );
}
