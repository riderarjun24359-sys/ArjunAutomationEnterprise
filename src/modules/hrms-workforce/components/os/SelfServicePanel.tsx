"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { HrAuditLogItem, SelfServicePortalItem } from "../../types/os";

export function SelfServicePanel({
    items,
    auditTrail,
}: {
    items: SelfServicePortalItem[];
    auditTrail: HrAuditLogItem[];
}) {
    if (items.length === 0) {
        return <EmptyState title="No self-service profiles" description="Employee self-service builds from active employees and related HR records." />;
    }
    return (
        <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                    <Card key={item.employeeId}>
                        <p className="font-semibold text-[var(--dos-text-primary)]">{item.employeeName}</p>
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.email}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                            <span>Pending leave {item.pendingLeaveCount}</span>
                            <span>Attendance {item.recentAttendanceStatus}</span>
                            <span>Documents {item.openDocuments}</span>
                            <span>Assets {item.assignedAssets}</span>
                            <span>Next review {item.nextReview ?? "—"}</span>
                            <span>Onboarding {item.onboardingStatus ?? "—"}</span>
                        </div>
                    </Card>
                ))}
            </div>
            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">HR Audit Trail</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {auditTrail.length === 0 ? (
                        <li>No HR audit events yet</li>
                    ) : (
                        auditTrail.map((a) => (
                            <li key={a.id}>
                                {a.title} · {a.action} · {a.entityType} · {new Date(a.occurredAt).toLocaleString()}
                            </li>
                        ))
                    )}
                </ul>
            </Card>
        </div>
    );
}
