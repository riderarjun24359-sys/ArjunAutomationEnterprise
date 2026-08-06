"use client";

import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { bottomSheet, modalOverlay } from "../variants";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function BottomSheet({
    open,
    onClose,
    title,
    children,
    className,
}: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <AnimatePresence>
            {open ? (
                <div className="fixed inset-0 z-[var(--dos-z-modal)] flex items-end justify-center sm:hidden">
                    <m.button
                        type="button"
                        aria-label="Close sheet"
                        className="absolute inset-0 bg-[var(--dos-surface-overlay)]"
                        variants={reduced ? undefined : modalOverlay}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <m.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={title ?? "Sheet"}
                        className={cn("dos-bottom-sheet dos-gpu relative z-10 w-full border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4 pb-8", className)}
                        variants={reduced ? undefined : bottomSheet}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                    >
                        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--dos-border-strong)]" aria-hidden="true" />
                        {title ? <h2 className="mb-3 text-base font-semibold text-[var(--dos-text-primary)]">{title}</h2> : null}
                        {children}
                    </m.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
}
