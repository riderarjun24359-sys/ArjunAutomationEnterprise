"use client";

import { X } from "lucide-react";
import { cn } from "@/src/lib/cn";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[var(--dos-z-modal)] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--dos-surface-overlay)]" onClick={onClose} aria-hidden="true" />
            <div className={cn("relative z-10 w-full max-w-lg rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-6 shadow-[var(--dos-shadow-xl)]", className)} role="dialog" aria-modal="true" aria-labelledby="dos-dialog-title">
                <div className="mb-4 flex items-center justify-between">
                    <h2 id="dos-dialog-title" className="text-lg font-semibold text-[var(--dos-text-primary)]">{title}</h2>
                    <button type="button" onClick={onClose} className="rounded-[var(--dos-radius-md)] p-1 text-[var(--dos-text-tertiary)] hover:bg-[var(--dos-surface-tertiary)]" aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
