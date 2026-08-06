"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { TrainingLearningItem } from "../../types/os";

export function TrainingPanel({ items }: { items: TrainingLearningItem[] }) {
    if (items.length === 0) {
        return (
            <EmptyState
                title="No training items"
                description="Training & learning derives from onboarding plans/tasks and training documents in Supabase."
            />
        );
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.employeeName}</p>
                        </div>
                        <Badge variant="info">{item.kind}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Status {item.status}</span>
                        <span>Progress {item.progressPercent}%</span>
                        <span className="col-span-2">Due {item.dueDate ?? "—"}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
