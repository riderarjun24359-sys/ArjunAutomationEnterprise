"use client";

import { cn } from "@/src/lib/cn";

export function Dropdown({ trigger, children, className }: { trigger: React.ReactNode; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("group relative inline-block", className)}>
            {trigger}
            <div className="invisible absolute right-0 top-full z-[var(--dos-z-dropdown)] mt-1 min-w-[180px] rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] py-1 opacity-0 shadow-[var(--dos-shadow-lg)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {children}
            </div>
        </div>
    );
}

export function DropdownItem({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
    return (
        <button type="button" onClick={onClick} className={cn("block w-full px-3 py-2 text-left text-sm text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-tertiary)]", className)}>
            {children}
        </button>
    );
}
