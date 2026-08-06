"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { physicsPageTransition } from "../variants";

/** Physics-based route choreography — same children/content, upgraded motion only. */
export function PhysicsPageTransition({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const pathname = usePathname();
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <m.div
                key={pathname}
                className={`dos-gpu immersive-physics-page ${className ?? ""}`.trim()}
                variants={physicsPageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                layout={false}
            >
                {children}
            </m.div>
        </AnimatePresence>
    );
}
