import { EntityRow } from "@/src/design-os/components/primitives/EntityRow";
import { Card } from "@/src/design-os/components/primitives/Card";
import type { OperationsSnapshot } from "../types/snapshot";

interface OperationsWorkQueueProps {
    workQueue: OperationsSnapshot["workQueue"];
}

export function OperationsWorkQueue({ workQueue }: OperationsWorkQueueProps) {
    if (workQueue.length === 0) {
        return (
            <section aria-labelledby="work-queue-heading" className="space-y-4">
                <h2 id="work-queue-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Work Queue</h2>
                <Card variant="base" className="p-4 text-[var(--dos-text-secondary)]">No pending operational work</Card>
            </section>
        );
    }

    return (
        <section aria-labelledby="work-queue-heading" className="space-y-4">
            <h2 id="work-queue-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Work Queue</h2>
            <div className="space-y-2">
                {workQueue.map((item) => (
                    <EntityRow key={item.id} className={item.priority === "high" ? "border-l-4 border-[var(--dos-tint-critical)]" : item.priority === "medium" ? "border-l-4 border-[var(--dos-tint-warning)]" : ""}>
                        <div className="flex flex-col">
                            <span className="font-semibold text-[var(--dos-text-primary)]">{item.title}</span>
                            {item.dueDate && <span className="text-xs text-[var(--dos-text-tertiary)]">Due: {item.dueDate}</span>}
                        </div>
                        <span className="text-xs font-bold uppercase text-[var(--dos-text-tertiary)]">{item.priority}</span>
                    </EntityRow>
                ))}
            </div>
        </section>
    );
}
