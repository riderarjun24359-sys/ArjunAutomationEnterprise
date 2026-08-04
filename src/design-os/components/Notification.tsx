"use client";

import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function Notification({ title, message, variant = "info", onDismiss, className }: { title: string; message?: string; variant?: "success" | "warning" | "error" | "info"; onDismiss?: () => void; className?: string }) {
    const colors = {
        success: "border-[var(--dos-success)]/30 bg-[var(--dos-success-muted)]",
        warning: "border-[var(--dos-warning)]/30 bg-[var(--dos-warning-muted)]",
        error: "border-[var(--dos-error)]/30 bg-[var(--dos-error-muted)]",
        info: "border-[var(--dos-info)]/30 bg-[var(--dos-info-muted)]",
    };
    return (
        <div className={cn("flex items-start gap-3 rounded-[var(--dos-radius-lg)] border p-4", colors[variant], className)} role="status">
            <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--dos-text-primary)]">{title}</p>
                {message ? <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{message}</p> : null}
            </div>
            {onDismiss ? (
                <button type="button" onClick={onDismiss} className="text-[var(--dos-text-tertiary)] hover:text-[var(--dos-text-primary)]" aria-label="Dismiss">
                    <X className="h-4 w-4" />
                </button>
            ) : null}
        </div>
    );
}
