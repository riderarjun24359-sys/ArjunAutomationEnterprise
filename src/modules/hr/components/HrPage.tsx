"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AttendancePanel,
    DepartmentsPanel,
    DesignationsPanel,
    DocumentsPanel,
    EmployeeDirectoryPanel,
    HolidaysPanel,
    HrOverviewPanel,
    HrReportsPanel,
    HrTeamsPanel,
    LeavePanel,
    LifecyclePanel,
    OrgChartPanel,
    PayrollPanel,
    PerformancePanel,
    RecruitmentPanel,
} from "@/src/modules/hr/components/HrPanels";
import { HrStats } from "@/src/modules/hr/components/HrStats";
import { HR_TABS } from "@/src/modules/hr/constants";
import { useHr } from "@/src/modules/hr/hooks/useHr";

const tabs = [
    { id: HR_TABS.overview, label: "Overview" },
    { id: HR_TABS.directory, label: "Directory" },
    { id: HR_TABS.departments, label: "Departments" },
    { id: HR_TABS.designations, label: "Designations" },
    { id: HR_TABS.teams, label: "Teams" },
    { id: HR_TABS.attendance, label: "Attendance" },
    { id: HR_TABS.leave, label: "Leave" },
    { id: HR_TABS.holidays, label: "Holidays" },
    { id: HR_TABS.payroll, label: "Payroll" },
    { id: HR_TABS.documents, label: "Documents" },
    { id: HR_TABS.performance, label: "Performance" },
    { id: HR_TABS.recruitment, label: "Recruitment" },
    { id: HR_TABS.lifecycle, label: "Lifecycle" },
    { id: HR_TABS.orgChart, label: "Org Chart" },
    { id: HR_TABS.reports, label: "Reports" },
] as const;

export function HrPage() {
    const hr = useHr();
    const [activeTab, setActiveTab] = useState<(typeof HR_TABS)[keyof typeof HR_TABS]>(HR_TABS.overview);

    if (hr.loading) {
        return (
            <div className="mx-auto max-w-7xl">
                <LoadingState label="Loading HRMS and employee management data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">People Operations</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise HRMS and employee management</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Manage employee directory, departments, designations, teams, attendance, leave, holidays, payroll foundation, documents, performance, recruitment, onboarding, org chart, and HR analytics from one Supabase-backed workspace.
                </p>
            </motion.header>

            <HrStats stats={hr.stats} />

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === HR_TABS.overview ? <HrOverviewPanel data={hr} /> : null}
            {activeTab === HR_TABS.directory ? <EmployeeDirectoryPanel data={hr} /> : null}
            {activeTab === HR_TABS.departments ? <DepartmentsPanel data={hr} /> : null}
            {activeTab === HR_TABS.designations ? <DesignationsPanel data={hr} /> : null}
            {activeTab === HR_TABS.teams ? <HrTeamsPanel data={hr} /> : null}
            {activeTab === HR_TABS.attendance ? <AttendancePanel data={hr} /> : null}
            {activeTab === HR_TABS.leave ? <LeavePanel data={hr} /> : null}
            {activeTab === HR_TABS.holidays ? <HolidaysPanel data={hr} /> : null}
            {activeTab === HR_TABS.payroll ? <PayrollPanel data={hr} /> : null}
            {activeTab === HR_TABS.documents ? <DocumentsPanel data={hr} /> : null}
            {activeTab === HR_TABS.performance ? <PerformancePanel data={hr} /> : null}
            {activeTab === HR_TABS.recruitment ? <RecruitmentPanel data={hr} /> : null}
            {activeTab === HR_TABS.lifecycle ? <LifecyclePanel data={hr} /> : null}
            {activeTab === HR_TABS.orgChart ? <OrgChartPanel data={hr} /> : null}
            {activeTab === HR_TABS.reports ? <HrReportsPanel data={hr} /> : null}
        </div>
    );
}
