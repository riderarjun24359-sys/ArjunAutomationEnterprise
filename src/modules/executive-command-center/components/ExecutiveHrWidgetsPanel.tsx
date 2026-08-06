"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ExecutiveHrWidgets } from "@/src/modules/hrms-workforce/types/os";

export function ExecutiveHrWidgetsPanel({ widgets }: { widgets: ExecutiveHrWidgets | null }) {
    if (!widgets) {
        return (
            <EmptyState
                title="HR widgets unavailable"
                description="Widgets load from the HRMS & Workforce OS snapshot."
            />
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Executive HR Dashboard
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Headcount</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.headcount}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Open Roles</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.openRoles}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Pending Leave</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.pendingLeave}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Attendance Present</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.attendancePresentRate}%</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Payroll Net</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">${widgets.payrollNetTotal.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Avg Performance</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.avgPerformanceRating}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Recruitment Pipeline</p>
                    <ul className="mt-3 space-y-1 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.recruitmentPipeline.length === 0 ? (
                            <li>No candidates</li>
                        ) : (
                            widgets.recruitmentPipeline.map((s) => (
                                <li key={s.stage} className="flex justify-between gap-2">
                                    <span>{s.stage}</span>
                                    <span>{s.count}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card className="md:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Department Headcount</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.departmentHeadcount.length === 0 ? (
                            <li>No departments</li>
                        ) : (
                            widgets.departmentHeadcount.map((d) => (
                                <li key={d.department} className="flex justify-between gap-2">
                                    <span>{d.department}</span>
                                    <span>{d.count}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
            </div>
        </section>
    );
}
