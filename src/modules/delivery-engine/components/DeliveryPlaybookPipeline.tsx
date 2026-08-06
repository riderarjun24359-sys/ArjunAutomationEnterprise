"use client";

import { DELIVERY_PLAYBOOK_STAGES } from "../constants";
import type { DeliveryEngineDashboard } from "../types";

export function DeliveryPlaybookPipeline({ dashboard }: { dashboard: DeliveryEngineDashboard | null }) {
    if (!dashboard) return null;
    return (
        <div className="flex flex-wrap items-center gap-2">
            {DELIVERY_PLAYBOOK_STAGES.map((stage, i) => (
                <div key={stage.id} className="flex items-center gap-2">
                    <div className={`rounded-full px-3 py-1.5 text-xs font-medium ${(dashboard.stageCounts[stage.id as keyof typeof dashboard.stageCounts] ?? 0) > 0 ? "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300" : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]"}`}>
                        {stage.label}
                        {(dashboard.stageCounts[stage.id as keyof typeof dashboard.stageCounts] ?? 0) > 0 && (
                            <span className="ml-1 opacity-70">({dashboard.stageCounts[stage.id as keyof typeof dashboard.stageCounts]})</span>
                        )}
                    </div>
                    {i < DELIVERY_PLAYBOOK_STAGES.length - 1 ? <span className="text-[var(--dos-text-tertiary)]">→</span> : null}
                </div>
            ))}
        </div>
    );
}
