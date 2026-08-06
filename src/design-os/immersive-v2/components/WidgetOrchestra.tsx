"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { widgetOrchestra, widgetOrchestraItem } from "../variants";
import { cn } from "@/src/lib/cn";

export function WidgetOrchestra({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;

    return (
        <m.div
            className={cn("dos-gpu", className)}
            variants={widgetOrchestra}
            initial="hidden"
            animate="visible"
        >
            {children}
        </m.div>
    );
}

export function WidgetOrchestraItem({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;

    return (
        <m.div className={cn("dos-gpu", className)} variants={widgetOrchestraItem}>
            {children}
        </m.div>
    );
}
