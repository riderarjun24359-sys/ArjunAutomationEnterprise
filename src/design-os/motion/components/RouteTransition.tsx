"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { pageTransition } from "../variants";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Smooth route-level entrance for shell main content. */
export function RouteTransition({ children, className }: { children: React.ReactNode; className?: string }) {
    const pathname = usePathname();
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <m.div
                key={pathname}
                className={`dos-gpu ${className ?? ""}`.trim()}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {children}
            </m.div>
        </AnimatePresence>
    );
}
