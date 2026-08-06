"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useAuthStore } from "@/src/store/auth.store";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { IMMERSIVE_WELCOME_STORAGE_KEY } from "../constants";
import { personalizeGreeting } from "../themes";
import { useTimeAwareTheme } from "../hooks/useTimeAwareTheme";
import { cinematicWelcome, cinematicWelcomeItem } from "../variants";

export function CinematicWelcome() {
    const theme = useTimeAwareTheme();
    const reduced = useReducedMotion();
    const user = useAuthStore((s) => s.user);
    const hydrated = useAuthStore((s) => s.isHydrated);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!hydrated) return;
        let dismissTimer = 0;
        const startTimer = window.setTimeout(() => {
            try {
                if (sessionStorage.getItem(IMMERSIVE_WELCOME_STORAGE_KEY) === "1") return;
            } catch {
                /* ignore */
            }
            setVisible(true);
            const dismissMs = reduced ? 400 : 2200;
            dismissTimer = window.setTimeout(() => {
                setVisible(false);
                try {
                    sessionStorage.setItem(IMMERSIVE_WELCOME_STORAGE_KEY, "1");
                } catch {
                    /* ignore */
                }
            }, dismissMs);
        }, 0);

        return () => {
            window.clearTimeout(startTimer);
            window.clearTimeout(dismissTimer);
        };
    }, [hydrated, reduced]);

    const greeting = personalizeGreeting(theme, user?.fullName);

    return (
        <AnimatePresence>
            {visible ? (
                <m.div
                    className="immersive-cinematic-welcome fixed inset-0 z-[var(--dos-z-overlay)] flex items-center justify-center"
                    variants={reduced ? undefined : cinematicWelcome}
                    initial={reduced ? false : "hidden"}
                    animate="visible"
                    exit="exit"
                    role="status"
                    aria-live="polite"
                >
                    <div className="absolute inset-0 bg-[var(--dos-surface)]/80 backdrop-blur-md" />
                    <m.div
                        className="immersive-glass-hero dos-gpu relative mx-6 max-w-lg rounded-[var(--dos-radius-3xl)] border border-[var(--dos-glass-border)] bg-[var(--dos-glass-bg)] px-8 py-10 text-center shadow-[var(--dos-elevation-4)]"
                        variants={reduced ? undefined : cinematicWelcomeItem}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--dos-text-tertiary)]">
                            Arjun Automation
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--dos-text-primary)]">
                            {greeting}
                        </h2>
                        <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{theme.label}</p>
                    </m.div>
                </m.div>
            ) : null}
        </AnimatePresence>
    );
}
