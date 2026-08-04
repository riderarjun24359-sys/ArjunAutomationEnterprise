"use client";

import { cn } from "@/src/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
    return (
        <input
            className={cn(
                "h-10 w-full rounded-[var(--dos-radius-lg)] border bg-[var(--dos-surface-secondary)] px-3 text-sm text-[var(--dos-text-primary)] outline-none transition placeholder:text-[var(--dos-text-tertiary)] focus:border-[var(--dos-border-focus)] focus:ring-2 focus:ring-[var(--dos-border-focus)]/20",
                error ? "border-[var(--dos-error)]" : "border-[var(--dos-border)]",
                className,
            )}
            {...props}
        />
    );
}
