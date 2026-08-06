"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { HRMS_OS_TABS, HRMS_OS_THEME } from "@/src/modules/hrms-workforce/constants/os";
import { useHrmsWorkforceOs } from "@/src/modules/hrms-workforce/hooks/useHrmsWorkforceOs";
import { listHrmsIntegrations } from "@/src/modules/hrms-workforce/integrations/platform-bridges";
import type { HrmsOsTab } from "@/src/modules/hrms-workforce/types/os";
import { AiHrAssistantPanel } from "@/src/modules/hrms-workforce/components/os/AiHrAssistantPanel";
import { AssetsPanel } from "@/src/modules/hrms-workforce/components/os/AssetsPanel";
import { AttendancePanel } from "@/src/modules/hrms-workforce/components/os/AttendancePanel";
import { DepartmentsPanel } from "@/src/modules/hrms-workforce/components/os/DepartmentsPanel";
import { EmployeesPanel } from "@/src/modules/hrms-workforce/components/os/EmployeesPanel";
import { LeavePanel } from "@/src/modules/hrms-workforce/components/os/LeavePanel";
import { PayrollPanel } from "@/src/modules/hrms-workforce/components/os/PayrollPanel";
import { PerformancePanel } from "@/src/modules/hrms-workforce/components/os/PerformancePanel";
import { RecruitmentPanel } from "@/src/modules/hrms-workforce/components/os/RecruitmentPanel";
import { SelfServicePanel } from "@/src/modules/hrms-workforce/components/os/SelfServicePanel";
import { TrainingPanel } from "@/src/modules/hrms-workforce/components/os/TrainingPanel";

const TABS: Array<{ id: HrmsOsTab; label: string }> = [
    { id: HRMS_OS_TABS.employees, label: "Employees" },
    { id: HRMS_OS_TABS.departments, label: "Departments" },
    { id: HRMS_OS_TABS.attendance, label: "Attendance" },
    { id: HRMS_OS_TABS.leave, label: "Leave" },
    { id: HRMS_OS_TABS.payroll, label: "Payroll" },
    { id: HRMS_OS_TABS.recruitment, label: "Recruitment" },
    { id: HRMS_OS_TABS.performance, label: "Performance" },
    { id: HRMS_OS_TABS.training, label: "Training" },
    { id: HRMS_OS_TABS.assets, label: "Assets" },
    { id: HRMS_OS_TABS.selfService, label: "Self-Service" },
    { id: HRMS_OS_TABS.assistant, label: "AI HR Assistant" },
];

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Card key={i}>
                        <SkeletonLoader className="h-16 w-full" />
                    </Card>
                ))}
            </div>
            <Card>
                <SkeletonLoader className="h-64 w-full" />
            </Card>
        </PageTransition>
    );
}

export function HrmsWorkforceOsPage() {
    const { snapshot, loading, error } = useHrmsWorkforceOs();
    const [tab, setTab] = useState<HrmsOsTab>(HRMS_OS_TABS.employees);
    const integrations = listHrmsIntegrations();

    if (loading) return <Skeleton />;
    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load HRMS & Workforce OS" description={error} />
            </PageTransition>
        );
    }
    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Sign in required" description="Sign in to access HRMS & Workforce OS." />
            </PageTransition>
        );
    }

    const stats = [
        { label: "Headcount", value: String(snapshot.stats.headcount) },
        { label: "Departments", value: String(snapshot.stats.departments) },
        { label: "Pending Leave", value: String(snapshot.stats.pendingLeave) },
        { label: "Open Roles", value: String(snapshot.stats.openRoles) },
        { label: "Candidates", value: String(snapshot.stats.candidates) },
        { label: "Payroll Net", value: `$${Math.round(snapshot.stats.payrollNetUsd).toLocaleString()}` },
        { label: "Assets Assigned", value: String(snapshot.stats.assetsAssigned) },
    ];

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <Badge variant="info">{HRMS_OS_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">{HRMS_OS_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{HRMS_OS_THEME.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                    Data: {snapshot.source} · Org {snapshot.organizationId ?? "—"}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{s.label}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Integrations</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {integrations.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs text-[var(--dos-text-secondary)] hover:border-[var(--dos-brand-primary)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </Card>

            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            tab === t.id
                                ? "bg-[var(--dos-brand-primary)] text-white"
                                : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === HRMS_OS_TABS.employees ? <EmployeesPanel items={snapshot.employees} /> : null}
            {tab === HRMS_OS_TABS.departments ? <DepartmentsPanel items={snapshot.departments} /> : null}
            {tab === HRMS_OS_TABS.attendance ? <AttendancePanel items={snapshot.attendance} /> : null}
            {tab === HRMS_OS_TABS.leave ? <LeavePanel items={snapshot.leave} /> : null}
            {tab === HRMS_OS_TABS.payroll ? <PayrollPanel items={snapshot.payroll} /> : null}
            {tab === HRMS_OS_TABS.recruitment ? <RecruitmentPanel items={snapshot.recruitment} /> : null}
            {tab === HRMS_OS_TABS.performance ? <PerformancePanel items={snapshot.performance} /> : null}
            {tab === HRMS_OS_TABS.training ? <TrainingPanel items={snapshot.training} /> : null}
            {tab === HRMS_OS_TABS.assets ? <AssetsPanel items={snapshot.assets} /> : null}
            {tab === HRMS_OS_TABS.selfService ? (
                <SelfServicePanel items={snapshot.selfService} auditTrail={snapshot.auditTrail} />
            ) : null}
            {tab === HRMS_OS_TABS.assistant ? <AiHrAssistantPanel assistant={snapshot.assistant} /> : null}
        </PageTransition>
    );
}
