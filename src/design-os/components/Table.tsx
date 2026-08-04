"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/src/lib/cn";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("overflow-hidden rounded-[var(--dos-radius-xl)] border border-[var(--dos-border)]", className)}>
            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
    return <thead className="border-b border-[var(--dos-border)] bg-[var(--dos-surface-secondary)]">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-[var(--dos-border-subtle)] [&>tr:nth-child(even)]:bg-[var(--dos-surface-secondary)]/50">{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
    return <tr className={cn("transition hover:bg-[var(--dos-surface-tertiary)]/50", className)}>{children}</tr>;
}

export function TableHead({ children, sortable, sortDirection, onSort, className }: { children: React.ReactNode; sortable?: boolean; sortDirection?: "asc" | "desc" | null; onSort?: () => void; className?: string }) {
    const SortIcon = sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ArrowUpDown;
    return (
        <th className={cn("px-4 py-3 text-left font-semibold text-[var(--dos-text-secondary)]", className)}>
            {sortable ? (
                <button type="button" onClick={onSort} className="inline-flex items-center gap-1 hover:text-[var(--dos-text-primary)]">
                    {children}
                    <SortIcon className="h-3.5 w-3.5" />
                </button>
            ) : children}
        </th>
    );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
    return <td className={cn("px-4 py-3 text-[var(--dos-text-primary)]", className)}>{children}</td>;
}
