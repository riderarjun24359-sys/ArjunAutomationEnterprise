"use client";

import { CheckCircle2 } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { scaleIn } from "@/src/design-os/motion/variants";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function SuccessState({
    title = "Success",
    description,
    action,
    className,
}: {
    title?: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <m.div
            className={cn(
                "flex flex-col items-center gap-4 rounded-[var(--dos-radius-2xl)] border border-[var(--dos-success)]/30 bg-[var(--dos-success-muted)] p-8 text-center",
                className,
            )}
            variants={reduced ? undefined : scaleIn}
            initial={reduced ? false : "hidden"}
            animate="visible"
            role="status"
        >
            <CheckCircle2 className="h-8 w-8 text-[var(--dos-success)]" aria-hidden="true" />
            <div>
                <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
                <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{description}</p>
            </div>
            {action ? <div>{action}</div> : null}
        </m.div>
    );
}
