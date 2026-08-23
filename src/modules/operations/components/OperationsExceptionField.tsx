import { Card } from "@/src/design-os/components/primitives/Card";
import type { OperationsSnapshot } from "../types/snapshot";

interface OperationsExceptionFieldProps {
    exceptions: OperationsSnapshot["exceptions"];
}

export function OperationsExceptionField({ exceptions }: OperationsExceptionFieldProps) {
    if (exceptions.length === 0) {
        return (
            <section aria-labelledby="exceptions-heading" className="space-y-4">
                <h2 id="exceptions-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Exceptions</h2>
                <Card variant="base" className="p-4 text-[var(--dos-text-secondary)]">No active exceptions</Card>
            </section>
        );
    }

    // Sort: critical first, then warning. Maintain source order within severity.
    const sortedExceptions = [...exceptions].sort((a, b) => {
        if (a.severity === b.severity) return 0;
        return a.severity === "critical" ? -1 : 1;
    });

    return (
        <section aria-labelledby="exceptions-heading" className="space-y-4">
            <h2 id="exceptions-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">Exceptions</h2>
            <div className="space-y-2">
                {sortedExceptions.map((ex) => (
                    <Card key={ex.id} variant="base" className="p-3 flex items-center justify-between">
                        <span className="font-medium text-[var(--dos-text-primary)]">{ex.title}</span>
                        <span className={`text-xs font-bold uppercase ${ex.severity === "critical" ? "text-[var(--dos-tint-critical)]" : "text-[var(--dos-tint-warning)]"}`}>
                            {ex.severity}
                        </span>
                    </Card>
                ))}
            </div>
        </section>
    );
}
