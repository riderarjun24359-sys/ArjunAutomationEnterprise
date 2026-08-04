"use client";

import { cn } from "@/src/lib/cn";

type NoiseOverlayProps = {
    className?: string;
    opacity?: number;
};

export function NoiseOverlay({ className, opacity = 0.04 }: NoiseOverlayProps) {
    return (
        <div
            className={cn("premium-noise pointer-events-none absolute inset-0", className)}
            style={{ opacity }}
            aria-hidden="true"
        />
    );
}
