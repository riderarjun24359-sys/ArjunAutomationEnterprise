"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { sharedElementReveal, sharedElementTransition } from "../variants";
import { cn } from "@/src/lib/cn";

export function SharedElement({
    layoutId,
    children,
    className,
}: {
    layoutId?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;

    return (
        <m.div
            layoutId={layoutId}
            className={cn("dos-gpu", className)}
            variants={sharedElementReveal}
            initial="hidden"
            animate="visible"
            transition={sharedElementTransition}
        >
            {children}
        </m.div>
    );
}
