"use client";

import { AlertTriangle } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { Button } from "./Button";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function ErrorState({
    title = "Something went wrong",
    description,
    onRetry,
    className,
}: {
    title?: string;
    description: string;
    onRetry?: () => void;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn(
                "flex flex-col items-center gap-4 rounded-[var(--dos-radius-2xl)] border border-[var(--dos-error)]/30 bg-[var(--dos-error-muted)] p-8 text-center",
                className,
            )}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
        >
            <AlertTriangle className="h-8 w-8 text-[var(--dos-error)]" aria-hidden="true" />
            <div>
                <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{description}</p>
            </div>
            {onRetry ? (
                <Button variant="secondary" size="sm" onClick={onRetry}>
                    Try again
                </Button>
            ) : null}
        </m.div>
    );
}
