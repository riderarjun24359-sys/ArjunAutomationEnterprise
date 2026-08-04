"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";
import { AI_DELIVERY_LEVELS } from "@/src/constants/ai-delivery-model";

export function DeliveryCenterPanel() {
    const { delivery } = useClientSuccessCapability();

    if (!delivery) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to view delivery center.</p></Card>;
    }

    const qaDone = delivery.qaChecklist.filter((c) => c.completed).length;
    const depDone = delivery.deploymentChecklist.filter((c) => c.completed).length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Delivery Center</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">QA checklist, deployment, training, documentation, and handover.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <KpiCard title="QA Progress" value={qaDone} suffix={`/${delivery.qaChecklist.length}`} />
                <KpiCard title="Deployment" value={depDone} suffix={`/${delivery.deploymentChecklist.length}`} />
                <KpiCard title="Training Modules" value={delivery.training.filter((t) => t.completed).length} suffix={`/${delivery.training.length}`} />
                <KpiCard title="Handover Items" value={delivery.handover.length} />
            </div>

            <Card>
                <h3 className="mb-3 font-semibold">QA Checklist — AI Delivery Levels</h3>
                {delivery.qaChecklist.map((item) => {
                    const level = AI_DELIVERY_LEVELS.find((l) => l.level === item.deliveryLevel);
                    return (
                        <div key={item.id} className="mb-2 flex items-center justify-between">
                            <div>
                                <p className="font-medium">{item.item}</p>
                                <p className="text-xs text-[var(--dos-text-secondary)]">{level?.estimate}</p>
                            </div>
                            <Badge variant={item.completed ? "success" : "default"}>{item.completed ? "Done" : "Pending"}</Badge>
                        </div>
                    );
                })}
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-3 font-semibold">Deployment Checklist</h3>
                    {delivery.deploymentChecklist.map((item) => (
                        <div key={item.id} className="mb-2 flex justify-between">
                            <span>{item.item}</span>
                            <Badge variant={item.completed ? "success" : "default"}>{item.completed ? "Done" : "Pending"}</Badge>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">Handover</h3>
                    {delivery.handover.map((h) => (
                        <div key={h.item} className="mb-2 flex justify-between">
                            <span>{h.item}</span>
                            <span className="text-sm text-[var(--dos-text-secondary)]">{h.owner} — {h.status}</span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
