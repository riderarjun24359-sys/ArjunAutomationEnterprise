"use client";

import { Card } from "@/src/design-os/components/Card";
import { Badge } from "@/src/design-os/components/Badge";
import { SimpleTable } from "../shared/SimpleTable";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function ApprovalCenterPanel() {
    const { approvals } = useClientSuccessCapability();

    if (!approvals) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to manage approvals.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Approval Center</h2>
                <p className="text-sm text-[var(--dos-text-secondary)]">Requirements, design, document, and deployment approvals with history.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <KpiCard title="Pending" value={approvals.pending.length} />
                <KpiCard title="Completed" value={approvals.history.length} />
            </div>

            <Card>
                <h3 className="mb-3 font-semibold">Pending Approvals</h3>
                <SimpleTable
                    headers={["Title", "Type", "Status", "Requested"]}
                    rows={approvals.pending.map((a) => [a.title, a.type, a.status, a.requestedAt.slice(0, 10)])}
                />
            </Card>

            <Card>
                <h3 className="mb-3 font-semibold">Approval History</h3>
                {approvals.history.map((a) => (
                    <div key={a.id} className="mb-2 flex items-center justify-between">
                        <div>
                            <p className="font-medium">{a.title}</p>
                            <p className="text-xs text-[var(--dos-text-secondary)]">{a.decidedBy} — {a.decidedAt?.slice(0, 10)}</p>
                        </div>
                        <Badge variant="success">{a.status}</Badge>
                    </div>
                ))}
            </Card>
        </div>
    );
}
