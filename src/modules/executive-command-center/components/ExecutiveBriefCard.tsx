"use client";

import { IntelligentContainer } from "@/src/design-os/components/IntelligentContainer";
import { Badge } from "@/src/design-os/components/Badge";
import type { ExecutiveBrief } from "../types";

export function ExecutiveBriefCard({ brief }: { brief: ExecutiveBrief }) {
    return (
        <IntelligentContainer material="insight" className="border-[var(--dos-border-subtle)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Badge variant="info">Daily executive brief</Badge>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--dos-text-primary)]">{brief.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--dos-text-secondary)]">{brief.summary}</p>
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--dos-text-tertiary)]">
                    {new Date(brief.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            {brief.priorities.length > 0 ? (
                <ul className="mt-6 space-y-3">
                    {brief.priorities.map((p) => (
                        <li key={p} className="flex items-center gap-3 text-sm text-[var(--dos-text-primary)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dos-brand-accent)]" />
                            {p}
                        </li>
                    ))}
                </ul>
            ) : null}
        </IntelligentContainer>
    );
}
