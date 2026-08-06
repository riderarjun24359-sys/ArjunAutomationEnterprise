"use client";

import { m } from "framer-motion";
import { cn } from "@/src/lib/cn";

export function Toggle({
    checked,
    onChange,
    label,
    className,
    disabled,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                "dos-focus-ring inline-flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
        >
            <span
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors",
                    checked
                        ? "border-[var(--dos-brand-primary)] bg-[var(--dos-brand-primary)]"
                        : "border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)]",
                )}
            >
                <m.span
                    className="dos-gpu absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[var(--dos-elevation-1)]"
                    animate={{ x: checked ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
            </span>
            {label ? <span className="text-sm text-[var(--dos-text-primary)]">{label}</span> : null}
        </button>
    );
}
