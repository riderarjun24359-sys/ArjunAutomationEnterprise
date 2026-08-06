"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { useAppStore } from "@/src/store/app.store";
import { modalOverlay } from "@/src/design-os/motion/variants";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function MobileNav() {
    const isMobileMenuOpen = useAppStore((state) => state.isMobileMenuOpen);
    const toggleMobileMenu = useAppStore((state) => state.toggleMobileMenu);
    const reduced = useReducedMotion();

    return (
        <AnimatePresence>
            {isMobileMenuOpen ? (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <m.button
                        type="button"
                        className="absolute inset-0 bg-[var(--dos-surface-overlay)]"
                        aria-label="Close navigation menu"
                        onClick={toggleMobileMenu}
                        variants={reduced ? undefined : modalOverlay}
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                    />
                    <m.div
                        className="dos-gpu absolute inset-y-0 left-0 w-[85%] max-w-xs border-r border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-elevation-4)]"
                        variants={
                            reduced
                                ? undefined
                                : {
                                      hidden: { x: "-100%" },
                                      visible: { x: 0, transition: { type: "spring", stiffness: 360, damping: 34 } },
                                      exit: { x: "-100%", transition: { duration: 0.2 } },
                                  }
                        }
                        initial={reduced ? false : "hidden"}
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex items-center justify-end border-b border-[var(--dos-border)] p-3">
                            <button
                                type="button"
                                onClick={toggleMobileMenu}
                                className="dos-focus-ring dos-interactive rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] p-2 text-[var(--dos-text-secondary)]"
                                aria-label="Close navigation menu"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <Sidebar onNavigate={toggleMobileMenu} className="h-[calc(100%-57px)] w-full" />
                    </m.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
}
