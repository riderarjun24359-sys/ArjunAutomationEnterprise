"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function AiSuccessManagerPanel() {
    const { insights } = useClientSuccessCapability();

    if (!insights) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client for AI success manager insights.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">AI Success Manager</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Next actions, project/customer risks, improvements, and automation ops.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <KpiCard title="Next Actions" value={insights.nextActions.length} />
                <KpiCard title="Project Risks" value={insights.projectRisks.length} />
                <KpiCard title="Customer Risks" value={insights.customerRisks.length} />
                <KpiCard title="Automations" value={insights.automationOps.length} />
            </div>

            <Card>
                <h3 className="mb-3 font-semibold">Recommended Next Actions</h3>
                {insights.nextActions.map((a) => (
                    <div key={a.id} className="mb-2 flex items-center justify-between">
                        <span>{a.action}</span>
                        <div className="flex gap-2">
                            <Badge variant={a.priority === "high" ? "error" : "warning"}>{a.priority}</Badge>
                            <span className="text-xs text-[var(--dos-text-secondary)]">{a.dueDate}</span>
                        </div>
                    </div>
                ))}
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-3 font-semibold">Project Risks</h3>
                    {insights.projectRisks.map((r) => (
                        <div key={r.id} className="mb-3">
                            <div className="flex items-center gap-2">
                                <Badge variant="warning">{r.severity}</Badge>
                                <p className="font-medium">{r.risk}</p>
                            </div>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{r.mitigation}</p>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">Improvements</h3>
                    {insights.improvements.map((i) => (
                        <div key={i.id} className="mb-2">
                            <p className="font-medium">{i.area}</p>
                            <p className="text-sm text-[var(--dos-text-secondary)]">{i.recommendation}</p>
                        </div>
                    ))}
                </Card>
            </div>

            <Card>
                <h3 className="mb-3 font-semibold">Automation Operations</h3>
                {insights.automationOps.map((op) => (
                    <div key={op.id} className="mb-2 flex justify-between">
                        <span>{op.workflow}</span>
                        <div className="flex gap-2">
                            <Badge variant="success">{op.status}</Badge>
                            <span className="text-sm text-[var(--dos-text-secondary)]">{op.savings}</span>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
}
