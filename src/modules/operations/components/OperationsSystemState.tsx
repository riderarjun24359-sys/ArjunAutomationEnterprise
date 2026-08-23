import { Card } from "@/src/design-os/components/primitives/Card";
import type { OperationsSnapshot } from "../types/snapshot";

interface OperationsSystemStateProps {
    serviceStatus: OperationsSnapshot["serviceStatus"];
}

export function OperationsSystemState({ serviceStatus }: OperationsSystemStateProps) {
    return (
        <section aria-labelledby="system-state-heading" className="space-y-4">
            <h2 id="system-state-heading" className="text-lg font-semibold text-[var(--dos-text-primary)]">System/Service State</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {serviceStatus.map(service => (
                    <Card key={service.id} variant="base" className="p-4 flex items-center justify-between">
                        <span className="font-medium text-[var(--dos-text-primary)]">{service.name}</span>
                        <span className={`text-xs font-bold uppercase ${service.status === "healthy" ? "text-[var(--dos-tint-success)]" : "text-[var(--dos-tint-warning)]"}`}>
                            {service.status}
                        </span>
                    </Card>
                ))}
            </div>
        </section>
    );
}
