"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import type { ExecutiveBrief } from "../types";

export function ExecutiveBriefCard({ brief }: { brief: ExecutiveBrief }) {
    return (
        <Card hover className="border-[var(--dos-brand-primary)]/20 bg-gradient-to-br from-[var(--dos-surface-elevated)] to-[var(--dos-surface-secondary)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Badge variant="info">Daily executive brief</Badge>
                    <h2 className="mt-3 text-xl font-semibold text-[var(--dos-text-primary)]">{brief.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{brief.summary}</p>
                </div>
                <p className="text-xs text-[var(--dos-text-tertiary)]">
                    {new Date(brief.generatedAt).toLocaleString()}
                </p>
            </div>
            {brief.priorities.length > 0 ? (
                <ul className="mt-4 space-y-2">
                    {brief.priorities.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-[var(--dos-text-primary)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dos-brand-primary)]" />
                            {p}
                        </li>
                    ))}
                </ul>
            ) : null}
        </Card>
    );
}
