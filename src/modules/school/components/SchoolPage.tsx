"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    SchoolOverviewPanel,
    SchoolHubsPanel,
    CampussPanel,
    BuildingsPanel,
    ClassroomsPanel,
    AcademicYearsPanel,
    AdmissionsPanel,
    StudentProfilesPanel,
    ParentProfilesPanel,
    EnrollmentsPanel,
    SubjectsPanel,
    TimetablesPanel,
    ExaminationsPanel,
    ReportCardsPanel,
    TeachersPanel,
    StaffAttendancesPanel,
    LeaveRequestsPanel,
    SubstituteTeachersPanel,
    FeeStructuresPanel,
    FeeInvoicesPanel,
    FeePaymentsPanel,
    ScholarshipsPanel,
    AnnouncementsPanel,
    MessagingsPanel,
    EventsPanel,
    AdmissionsAnalyticssPanel,
    AttendanceAnalyticssPanel,
    AcademicAnalyticssPanel,
    SchoolMetricsPanel,
    SchoolHealthsPanel,
    ExecutiveKpisPanel,
    SchoolFailuresPanel,
    SchoolAuditLogsPanel,
    SchoolSdkPanel,
} from "@/src/modules/school/components/SchoolPanels";
import { SchoolStats } from "@/src/modules/school/components/SchoolStats";
import { SCH_TABS } from "@/src/modules/school/constants";
import { useSchool } from "@/src/modules/school/hooks/useSchool";

const tabs = [
    { id: SCH_TABS.overview, label: "Overview" },
    { id: SCH_TABS.schoolHubs, label: "School Hubs" },
    { id: SCH_TABS.campuses, label: "Campuses" },
    { id: SCH_TABS.buildings, label: "Buildings" },
    { id: SCH_TABS.classrooms, label: "Classrooms" },
    { id: SCH_TABS.academicYears, label: "Academic Years" },
    { id: SCH_TABS.admissions, label: "Admissions" },
    { id: SCH_TABS.studentProfiles, label: "Student Profiles" },
    { id: SCH_TABS.parentProfiles, label: "Parent Profiles" },
    { id: SCH_TABS.enrollments, label: "Enrollments" },
    { id: SCH_TABS.subjects, label: "Subjects" },
    { id: SCH_TABS.timetables, label: "Timetables" },
    { id: SCH_TABS.examinations, label: "Examinations" },
    { id: SCH_TABS.reportCards, label: "Report Cards" },
    { id: SCH_TABS.teachers, label: "Teachers" },
    { id: SCH_TABS.staffAttendance, label: "Staff Attendance" },
    { id: SCH_TABS.leaveRequests, label: "Leave Requests" },
    { id: SCH_TABS.substituteTeachers, label: "Substitute Teachers" },
    { id: SCH_TABS.feeStructures, label: "Fee Structures" },
    { id: SCH_TABS.feeInvoices, label: "Fee Invoices" },
    { id: SCH_TABS.feePayments, label: "Fee Payments" },
    { id: SCH_TABS.scholarships, label: "Scholarships" },
    { id: SCH_TABS.announcements, label: "Announcements" },
    { id: SCH_TABS.messaging, label: "Messaging" },
    { id: SCH_TABS.events, label: "Events" },
    { id: SCH_TABS.admissionsAnalytics, label: "Admissions Analytics" },
    { id: SCH_TABS.attendanceAnalytics, label: "Attendance Analytics" },
    { id: SCH_TABS.academicAnalytics, label: "Academic Analytics" },
    { id: SCH_TABS.schoolMetrics, label: "School Metrics" },
    { id: SCH_TABS.schoolHealth, label: "School Health" },
    { id: SCH_TABS.executiveKpis, label: "Executive Kpis" },
    { id: SCH_TABS.schoolFailures, label: "School Failures" },
    { id: SCH_TABS.auditLogs, label: "Audit Logs" },
    { id: SCH_TABS.api, label: "SDK" },
] as const;

export function SchoolPage() {
    const school = useSchool();
    const [activeTab, setActiveTab] = useState<(typeof SCH_TABS)[keyof typeof SCH_TABS]>(SCH_TABS.overview);

    if (school.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading School OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-600">V2 Program A Program B Sprint 7</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise School OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and school operating system dashboard with security-first audit and the shared School OS SDK.
                </p>
            </motion.header>
            <SchoolStats stats={school.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:border-blue-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === SCH_TABS.overview ? <SchoolOverviewPanel data={school} /> : null}
            {activeTab === SCH_TABS.schoolHubs ? <SchoolHubsPanel data={school} /> : null}
            {activeTab === SCH_TABS.campuses ? <CampussPanel data={school} /> : null}
            {activeTab === SCH_TABS.buildings ? <BuildingsPanel data={school} /> : null}
            {activeTab === SCH_TABS.classrooms ? <ClassroomsPanel data={school} /> : null}
            {activeTab === SCH_TABS.academicYears ? <AcademicYearsPanel data={school} /> : null}
            {activeTab === SCH_TABS.admissions ? <AdmissionsPanel data={school} /> : null}
            {activeTab === SCH_TABS.studentProfiles ? <StudentProfilesPanel data={school} /> : null}
            {activeTab === SCH_TABS.parentProfiles ? <ParentProfilesPanel data={school} /> : null}
            {activeTab === SCH_TABS.enrollments ? <EnrollmentsPanel data={school} /> : null}
            {activeTab === SCH_TABS.subjects ? <SubjectsPanel data={school} /> : null}
            {activeTab === SCH_TABS.timetables ? <TimetablesPanel data={school} /> : null}
            {activeTab === SCH_TABS.examinations ? <ExaminationsPanel data={school} /> : null}
            {activeTab === SCH_TABS.reportCards ? <ReportCardsPanel data={school} /> : null}
            {activeTab === SCH_TABS.teachers ? <TeachersPanel data={school} /> : null}
            {activeTab === SCH_TABS.staffAttendance ? <StaffAttendancesPanel data={school} /> : null}
            {activeTab === SCH_TABS.leaveRequests ? <LeaveRequestsPanel data={school} /> : null}
            {activeTab === SCH_TABS.substituteTeachers ? <SubstituteTeachersPanel data={school} /> : null}
            {activeTab === SCH_TABS.feeStructures ? <FeeStructuresPanel data={school} /> : null}
            {activeTab === SCH_TABS.feeInvoices ? <FeeInvoicesPanel data={school} /> : null}
            {activeTab === SCH_TABS.feePayments ? <FeePaymentsPanel data={school} /> : null}
            {activeTab === SCH_TABS.scholarships ? <ScholarshipsPanel data={school} /> : null}
            {activeTab === SCH_TABS.announcements ? <AnnouncementsPanel data={school} /> : null}
            {activeTab === SCH_TABS.messaging ? <MessagingsPanel data={school} /> : null}
            {activeTab === SCH_TABS.events ? <EventsPanel data={school} /> : null}
            {activeTab === SCH_TABS.admissionsAnalytics ? <AdmissionsAnalyticssPanel data={school} /> : null}
            {activeTab === SCH_TABS.attendanceAnalytics ? <AttendanceAnalyticssPanel data={school} /> : null}
            {activeTab === SCH_TABS.academicAnalytics ? <AcademicAnalyticssPanel data={school} /> : null}
            {activeTab === SCH_TABS.schoolMetrics ? <SchoolMetricsPanel data={school} /> : null}
            {activeTab === SCH_TABS.schoolHealth ? <SchoolHealthsPanel data={school} /> : null}
            {activeTab === SCH_TABS.executiveKpis ? <ExecutiveKpisPanel data={school} /> : null}
            {activeTab === SCH_TABS.schoolFailures ? <SchoolFailuresPanel data={school} /> : null}
            {activeTab === SCH_TABS.auditLogs ? <SchoolAuditLogsPanel data={school} /> : null}
            {activeTab === SCH_TABS.api ? <SchoolSdkPanel data={school} /> : null}
        </div>
    );
}
