"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { SimpleTable } from "../shared/SimpleTable";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function ClientPortalPanel() {
    const { portalData } = useClientSuccessCapability();

    if (!portalData) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to view portal data.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Client Portal</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Dashboard, progress, files, invoices, docs, approvals, meetings, support, and knowledge base.</p>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]"><Badge variant="info">Preview data — illustrative defaults, not persisted records</Badge></p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard title="Progress" value={portalData.dashboard.progress} suffix="%" />
                <KpiCard title="Active Milestones" value={portalData.dashboard.activeMilestones} />
                <KpiCard title="Open Approvals" value={portalData.dashboard.openApprovals} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-3 font-semibold">Files</h3>
                    <SimpleTable headers={["Name", "Type", "Updated"]} rows={portalData.files.map((f) => [f.name, f.type, f.updatedAt.slice(0, 10)])} />
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">Invoices</h3>
                    <SimpleTable headers={["Number", "Amount", "Status"]} rows={portalData.invoices.map((i) => [i.number, `$${i.amount.toLocaleString()}`, i.status])} />
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">Approvals</h3>
                    {portalData.approvals.map((a) => (
                        <div key={a.id} className="mb-2 flex justify-between">
                            <span>{a.title}</span>
                            <Badge variant={a.status === "pending" ? "warning" : "success"}>{a.status}</Badge>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="mb-3 font-semibold">Knowledge Base</h3>
                    {portalData.knowledgeBase.map((kb) => (
                        <div key={kb.id} className="mb-2 flex justify-between">
                            <span>{kb.title}</span>
                            <Badge variant="info">{kb.category}</Badge>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}
