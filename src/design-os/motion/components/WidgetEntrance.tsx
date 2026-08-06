"use client";

import { m } from "framer-motion";
import { widgetEntrance } from "../variants";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "@/src/lib/cn";

export function WidgetEntrance({
    children,
    className,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;

    return (
        <m.div
            className={cn("dos-gpu", className)}
            variants={widgetEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay }}
        >
            {children}
        </m.div>
    );
}
