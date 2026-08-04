"use client";

import { cn } from "@/src/lib/cn";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={cn(
                "min-h-[100px] w-full rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] px-3 py-2 text-sm text-[var(--dos-text-primary)] outline-none transition placeholder:text-[var(--dos-text-tertiary)] focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20",
                className,
            )}
            {...props}
        />
    );
}
