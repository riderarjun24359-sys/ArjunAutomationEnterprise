"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    HospitalOverviewPanel,
    HospitalHubsPanel,
    CampussPanel,
    DepartmentsPanel,
    WardsPanel,
    HospitalBedsPanel,
    PatientRegistrationsPanel,
    PatientProfilesPanel,
    MedicalHistorysPanel,
    InsurancePolicysPanel,
    AppointmentsPanel,
    OpdVisitsPanel,
    IpdAdmissionsPanel,
    ClinicalNotesPanel,
    PharmacyInventorysPanel,
    PrescriptionsPanel,
    LabOrdersPanel,
    LabResultsPanel,
    HospitalBillingsPanel,
    InsuranceClaimsPanel,
    HospitalInvoicesPanel,
    HospitalPaymentsPanel,
    PatientNotificationsPanel,
    MedicalReportsPanel,
    PatientFeedbacksPanel,
    AdmissionsAnalyticssPanel,
    OccupancyAnalyticssPanel,
    RevenueAnalyticssPanel,
    HospitalMetricsPanel,
    HospitalHealthsPanel,
    ExecutiveKpisPanel,
    HospitalFailuresPanel,
    HospitalAuditLogsPanel,
    HospitalSdkPanel,
} from "@/src/modules/hospital/components/HospitalPanels";
import { HospitalStats } from "@/src/modules/hospital/components/HospitalStats";
import { HSP_TABS } from "@/src/modules/hospital/constants";
import { useHospital } from "@/src/modules/hospital/hooks/useHospital";

const tabs = [
    { id: HSP_TABS.overview, label: "Overview" },
    { id: HSP_TABS.hospitalHubs, label: "Hospital Hubs" },
    { id: HSP_TABS.campuses, label: "Campuses" },
    { id: HSP_TABS.departments, label: "Departments" },
    { id: HSP_TABS.wards, label: "Wards" },
    { id: HSP_TABS.hospitalBeds, label: "Hospital Beds" },
    { id: HSP_TABS.patientRegistrations, label: "Patient Registrations" },
    { id: HSP_TABS.patientProfiles, label: "Patient Profiles" },
    { id: HSP_TABS.medicalHistories, label: "Medical Histories" },
    { id: HSP_TABS.insurancePolicies, label: "Insurance Policies" },
    { id: HSP_TABS.appointments, label: "Appointments" },
    { id: HSP_TABS.opdVisits, label: "Opd Visits" },
    { id: HSP_TABS.ipdAdmissions, label: "Ipd Admissions" },
    { id: HSP_TABS.clinicalNotes, label: "Clinical Notes" },
    { id: HSP_TABS.pharmacyInventory, label: "Pharmacy Inventory" },
    { id: HSP_TABS.prescriptions, label: "Prescriptions" },
    { id: HSP_TABS.labOrders, label: "Lab Orders" },
    { id: HSP_TABS.labResults, label: "Lab Results" },
    { id: HSP_TABS.hospitalBilling, label: "Hospital Billing" },
    { id: HSP_TABS.insuranceClaims, label: "Insurance Claims" },
    { id: HSP_TABS.hospitalInvoices, label: "Hospital Invoices" },
    { id: HSP_TABS.hospitalPayments, label: "Hospital Payments" },
    { id: HSP_TABS.patientNotifications, label: "Patient Notifications" },
    { id: HSP_TABS.medicalReports, label: "Medical Reports" },
    { id: HSP_TABS.patientFeedback, label: "Patient Feedback" },
    { id: HSP_TABS.patientRegistrationsAnalytics, label: "Patient Registrations Analytics" },
    { id: HSP_TABS.occupancyAnalytics, label: "Occupancy Analytics" },
    { id: HSP_TABS.revenueAnalytics, label: "Revenue Analytics" },
    { id: HSP_TABS.hospitalMetrics, label: "Hospital Metrics" },
    { id: HSP_TABS.hospitalHealth, label: "Hospital Health" },
    { id: HSP_TABS.executiveKpis, label: "Executive Kpis" },
    { id: HSP_TABS.hospitalFailures, label: "Hospital Failures" },
    { id: HSP_TABS.auditLogs, label: "Audit Logs" },
    { id: HSP_TABS.api, label: "SDK" },
] as const;

export function HospitalPage() {
    const hospital = useHospital();
    const [activeTab, setActiveTab] = useState<(typeof HSP_TABS)[keyof typeof HSP_TABS]>(HSP_TABS.overview);

    if (hospital.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Hospital OS" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-600">V2 Program A Program B Sprint 8</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Hospital OS</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and hospital operating system dashboard with security-first audit and the shared Hospital OS SDK.
                </p>
            </motion.header>
            <HospitalStats stats={hospital.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-cyan-600 text-white" : "border border-slate-200 text-slate-600 hover:border-cyan-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === HSP_TABS.overview ? <HospitalOverviewPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalHubs ? <HospitalHubsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.campuses ? <CampussPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.departments ? <DepartmentsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.wards ? <WardsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalBeds ? <HospitalBedsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.patientRegistrations ? <PatientRegistrationsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.patientProfiles ? <PatientProfilesPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.medicalHistories ? <MedicalHistorysPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.insurancePolicies ? <InsurancePolicysPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.appointments ? <AppointmentsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.opdVisits ? <OpdVisitsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.ipdAdmissions ? <IpdAdmissionsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.clinicalNotes ? <ClinicalNotesPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.pharmacyInventory ? <PharmacyInventorysPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.prescriptions ? <PrescriptionsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.labOrders ? <LabOrdersPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.labResults ? <LabResultsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalBilling ? <HospitalBillingsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.insuranceClaims ? <InsuranceClaimsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalInvoices ? <HospitalInvoicesPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalPayments ? <HospitalPaymentsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.patientNotifications ? <PatientNotificationsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.medicalReports ? <MedicalReportsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.patientFeedback ? <PatientFeedbacksPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.patientRegistrationsAnalytics ? <AdmissionsAnalyticssPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.occupancyAnalytics ? <OccupancyAnalyticssPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.revenueAnalytics ? <RevenueAnalyticssPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalMetrics ? <HospitalMetricsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalHealth ? <HospitalHealthsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.executiveKpis ? <ExecutiveKpisPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.hospitalFailures ? <HospitalFailuresPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.auditLogs ? <HospitalAuditLogsPanel data={hospital} /> : null}
            {activeTab === HSP_TABS.api ? <HospitalSdkPanel data={hospital} /> : null}
        </div>
    );
}
