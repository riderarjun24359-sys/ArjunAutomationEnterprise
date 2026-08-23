import { EntityRow } from "@/src/design-os/components/primitives/EntityRow";
import type { OperationsSnapshot } from "../types/snapshot";

interface OperationsActivityProps {
    activity: OperationsSnapshot["activity"];
}

export function OperationsActivity({ activity }: OperationsActivityProps) {
    if (activity.length === 0) {
        return (
            <section aria-labelledby="activity-heading" className="space-y-4">
                <h2 id="activity-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Activity</h2>
                <p className="text-[var(--dos-text-secondary)]">No recent activity.</p>
            </section>
        );
    }

    return (
        <section aria-labelledby="activity-heading" className="space-y-4">
            <h2 id="activity-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Activity</h2>
            <div className="space-y-2">
                {activity.map((item) => (
                    <EntityRow key={item.id}>
                        <div className="flex flex-col">
                            <span className="font-semibold text-[var(--dos-text-primary)]">{item.title}</span>
                            <span className="text-sm text-[var(--dos-text-secondary)]">{item.detail}</span>
                        </div>
                        <span className="text-xs text-[var(--dos-text-tertiary)]">{item.time}</span>
                    </EntityRow>
                ))}
            </div>
        </section>
    );
}
