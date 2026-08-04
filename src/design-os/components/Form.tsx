"use client";

import { cn } from "@/src/lib/cn";

export function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function FormLabel({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
    return (
        <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-[var(--dos-text-primary)]", className)}>
            {children}
        </label>
    );
}

export function FormError({ children, className }: { children?: React.ReactNode; className?: string }) {
    if (!children) return null;
    return <p className={cn("text-xs text-[var(--dos-error)]", className)} role="alert">{children}</p>;
}
