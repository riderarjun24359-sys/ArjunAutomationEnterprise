"use client";

import { LIFECYCLE_STAGES } from "../constants";
import type { BusinessPlatformDashboard } from "../types";

type LifecyclePipelineProps = {
    dashboard: BusinessPlatformDashboard | null;
};

export function LifecyclePipeline({ dashboard }: LifecyclePipelineProps) {
    const counts = dashboard?.lifecycleCounts;

    return (
        <nav aria-label="Client lifecycle pipeline" className="overflow-x-auto">
            <ol className="flex min-w-max items-center gap-1">
                {LIFECYCLE_STAGES.map((stage, index) => {
                    const count = counts?.[stage.id as keyof typeof counts] ?? 0;
                    const isLast = index === LIFECYCLE_STAGES.length - 1;
                    return (
                        <li key={stage.id} className="flex items-center">
                            <div className="flex flex-col items-center rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface)] px-3 py-2 min-w-[88px]">
                                <span className="text-lg font-bold text-orange-600">{count}</span>
                                <span className="text-xs text-[var(--dos-text-secondary)]">{stage.label}</span>
                            </div>
                            {!isLast && (
                                <span className="mx-1 text-[var(--dos-text-tertiary)]" aria-hidden="true">
                                    →
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
