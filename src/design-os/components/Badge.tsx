"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-[var(--dos-radius-full)] px-2.5 py-0.5 text-xs font-medium border border-transparent", {
    variants: {
        variant: {
            default: "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)] border-transparent",
            success: "bg-[var(--dos-success-muted)] text-[var(--dos-success)] border-[var(--dos-success)]/20",
            warning: "bg-[var(--dos-warning-muted)] text-[var(--dos-warning)] border-[var(--dos-warning)]/20",
            error: "bg-[var(--dos-error-muted)] text-[var(--dos-error)] border-[var(--dos-error)]/20",
            info: "bg-[var(--dos-info-muted)] text-[var(--dos-info)] border-[var(--dos-info)]/20",
        },
    },
    defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, children }: React.PropsWithChildren<VariantProps<typeof badgeVariants> & { className?: string }>) {
    return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
