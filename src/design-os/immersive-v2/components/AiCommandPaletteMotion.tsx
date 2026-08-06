"use client";

import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { commandOverlayMotion, commandPaletteMotion } from "../variants";

/** Motion chrome for command palette — wrap existing palette content. */
export function AiCommandPaletteMotion({
    open,
    children,
}: {
    open: boolean;
    children: React.ReactNode;
}) {
    const reduced = useReducedMotion();

    if (reduced) {
        return open ? <>{children}</> : null;
    }

    return (
        <AnimatePresence>
            {open ? (
                <m.div
                    className="fixed inset-0 z-[var(--dos-z-command)]"
                    variants={commandOverlayMotion}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <m.div className="h-full w-full" variants={commandPaletteMotion} initial="hidden" animate="visible" exit="exit">
                        {children}
                    </m.div>
                </m.div>
            ) : null}
        </AnimatePresence>
    );
}
