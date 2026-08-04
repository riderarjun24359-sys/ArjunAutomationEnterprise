"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-[var(--dos-radius-full)] px-2.5 py-0.5 text-xs font-medium", {
    variants: {
        variant: {
            default: "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-primary)]",
            success: "bg-[var(--dos-success-muted)] text-[var(--dos-success)]",
            warning: "bg-[var(--dos-warning-muted)] text-[var(--dos-warning)]",
            error: "bg-[var(--dos-error-muted)] text-[var(--dos-error)]",
            info: "bg-[var(--dos-info-muted)] text-[var(--dos-info)]",
        },
    },
    defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, children }: React.PropsWithChildren<VariantProps<typeof badgeVariants> & { className?: string }>) {
    return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
