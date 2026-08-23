"use client";

import Link from "next/link";
import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import type { ExecutiveQuickAction } from "../types";

function ActionIcon({ icon }: { icon: ExecutiveQuickAction["icon"] }) {
    const common = "h-5 w-5 text-[var(--dos-brand-primary)]";
    switch (icon) {
        case "users":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="3" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a3 3 0 0 1 0 5.74" />
                </svg>
            );
        case "folder":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
            );
        case "check":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            );
        case "target":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
            );
        default:
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M4 19h16" />
                    <path d="M7 16V8" />
                    <path d="M12 16V5" />
                    <path d="M17 16v-6" />
                </svg>
            );
    }
}

export function QuickActionsPanel({ actions }: { actions: ExecutiveQuickAction[] }) {
    return (
        <IntelligentContainer material="base" className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--dos-text-tertiary)]">
                Quick Actions
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {actions.map((action) => (
                    <Link
                        key={action.id}
                        href={action.href}
                        className="group flex flex-col justify-between rounded-[var(--dos-radius-lg)] border border-[var(--dos-border-subtle)] bg-[var(--dos-surface-foundation)]/50 p-4 transition-all hover:border-[var(--dos-border)] hover:bg-[var(--dos-surface-active)]"
                    >
                        <ActionIcon icon={action.icon} />
                        <div className="mt-3">
                            <p className="font-semibold text-[var(--dos-text-primary)] transition group-hover:text-[var(--dos-brand-primary)]">{action.label}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </IntelligentContainer>
    );
}
