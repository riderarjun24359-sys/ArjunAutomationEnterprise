"use client";

import { useTimeAwareTheme } from "../hooks/useTimeAwareTheme";
import { useParallaxAmbient } from "../hooks/useParallaxAmbient";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { cn } from "@/src/lib/cn";

export function AmbientGradients({ className }: { className?: string }) {
    const theme = useTimeAwareTheme();
    const reduced = useReducedMotion();
    const { offset } = useParallaxAmbient(!reduced);

    return (
        <div
            aria-hidden="true"
            className={cn("immersive-ambient dos-gpu pointer-events-none absolute inset-0 overflow-hidden", className)}
            style={{
                backgroundImage: theme.gradient,
                boxShadow: theme.lighting,
                transform: reduced ? undefined : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
            }}
        >
            <div
                className="immersive-light-orb absolute -left-16 top-10 h-64 w-64 rounded-full blur-3xl"
                style={{ background: theme.accent }}
            />
            <div
                className="immersive-light-orb absolute -right-10 bottom-0 h-72 w-72 rounded-full blur-3xl opacity-70"
                style={{ background: theme.accent }}
            />
        </div>
    );
}
