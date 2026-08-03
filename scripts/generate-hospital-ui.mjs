#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mod = join(root, "src/modules/hospital");

const entities = [
    { tab: "hospitalHubs", plural: "hospitalHubs", singular: "HospitalHub", pascal: "HospitalHub", db: "hspHospitalHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "campuses", plural: "campuses", singular: "Campus", pascal: "Campus", db: "hspCampuses", fields: [{ name: "campusKey", type: "string" }, { name: "campusName", type: "string" }, { name: "campusType", type: "string" }], display: { title: "campusName", sub: "campusType" } },
    { tab: "departments", plural: "departments", singular: "Department", pascal: "Department", db: "hspDepartments", fields: [{ name: "departmentKey", type: "string" }, { name: "departmentName", type: "string" }, { name: "departmentType", type: "string" }], display: { title: "departmentName", sub: "departmentType" } },
    { tab: "wards", plural: "wards", singular: "Ward", pascal: "Ward", db: "hspWards", fields: [{ name: "wardKey", type: "string" }, { name: "wardName", type: "string" }, { name: "wardType", type: "string" }], display: { title: "wardName", sub: "wardType" } },
    { tab: "hospitalBeds", plural: "hospitalBeds", singular: "HospitalBed", pascal: "HospitalBed", db: "hspHospitalBeds", fields: [{ name: "bedKey", type: "string" }, { name: "bedNumber", type: "string" }, { name: "bedStatus", type: "select", options: "BED_STATUS_OPTIONS" }], display: { title: "bedNumber", sub: "bedStatus" } },
    { tab: "patientRegistrations", plural: "patientRegistrations", singular: "PatientRegistration", pascal: "PatientRegistration", db: "hspPatientRegistrations", fields: [{ name: "registrationKey", type: "string" }, { name: "registrationName", type: "string" }, { name: "registrationStatus", type: "select", options: "REGISTRATION_STATUS_OPTIONS" }], display: { title: "registrationName", sub: "registrationStatus" } },
    { tab: "patientProfiles", plural: "patientProfiles", singular: "PatientProfile", pascal: "PatientProfile", db: "hspPatientProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" } },
    { tab: "medicalHistories", plural: "medicalHistories", singular: "MedicalHistory", pascal: "MedicalHistory", db: "hspMedicalHistories", fields: [{ name: "historyKey", type: "string" }, { name: "historyName", type: "string" }, { name: "historyType", type: "string" }], display: { title: "historyName", sub: "historyType" } },
    { tab: "insurancePolicies", plural: "insurancePolicies", singular: "InsurancePolicy", pascal: "InsurancePolicy", db: "hspInsurancePolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyType", type: "string" }], display: { title: "policyName", sub: "policyType" } },
    { tab: "appointments", plural: "appointments", singular: "Appointment", pascal: "Appointment", db: "hspAppointments", fields: [{ name: "appointmentKey", type: "string" }, { name: "appointmentName", type: "string" }, { name: "appointmentStatus", type: "select", options: "APPOINTMENT_STATUS_OPTIONS" }], display: { title: "appointmentName", sub: "appointmentStatus" } },
    { tab: "opdVisits", plural: "opdVisits", singular: "OpdVisit", pascal: "OpdVisit", db: "hspOpdVisits", fields: [{ name: "visitKey", type: "string" }, { name: "visitName", type: "string" }, { name: "visitStatus", type: "string" }], display: { title: "visitName", sub: "visitStatus" } },
    { tab: "ipdAdmissions", plural: "ipdAdmissions", singular: "IpdAdmission", pascal: "IpdAdmission", db: "hspIpdAdmissions", fields: [{ name: "admissionKey", type: "string" }, { name: "admissionName", type: "string" }, { name: "admissionStatus", type: "select", options: "IPD_REGISTRATION_STATUS_OPTIONS" }], display: { title: "admissionName", sub: "admissionStatus" } },
    { tab: "clinicalNotes", plural: "clinicalNotes", singular: "ClinicalNote", pascal: "ClinicalNote", db: "hspClinicalNotes", fields: [{ name: "noteKey", type: "string" }, { name: "noteName", type: "string" }, { name: "noteType", type: "string" }], display: { title: "noteName", sub: "noteType" } },
    { tab: "pharmacyInventory", plural: "pharmacyInventory", singular: "PharmacyInventory", pascal: "PharmacyInventory", db: "hspPharmacyInventory", fields: [{ name: "inventoryKey", type: "string" }, { name: "inventoryName", type: "string" }, { name: "inventoryType", type: "string" }], display: { title: "inventoryName", sub: "inventoryType" } },
    { tab: "prescriptions", plural: "prescriptions", singular: "Prescription", pascal: "Prescription", db: "hspPrescriptions", fields: [{ name: "prescriptionKey", type: "string" }, { name: "prescriptionName", type: "string" }, { name: "prescriptionStatus", type: "select", options: "PRESCRIPTION_STATUS_OPTIONS" }], display: { title: "prescriptionName", sub: "prescriptionStatus" } },
    { tab: "labOrders", plural: "labOrders", singular: "LabOrder", pascal: "LabOrder", db: "hspLabOrders", fields: [{ name: "orderKey", type: "string" }, { name: "orderName", type: "string" }, { name: "orderStatus", type: "string" }], display: { title: "orderName", sub: "orderStatus" } },
    { tab: "labResults", plural: "labResults", singular: "LabResult", pascal: "LabResult", db: "hspLabResults", fields: [{ name: "resultKey", type: "string" }, { name: "resultName", type: "string" }, { name: "resultStatus", type: "string" }], display: { title: "resultName", sub: "resultStatus" } },
    { tab: "hospitalBilling", plural: "hospitalBilling", singular: "HospitalBilling", pascal: "HospitalBilling", db: "hspHospitalBilling", fields: [{ name: "billingKey", type: "string" }, { name: "billingName", type: "string" }, { name: "billingAmount", type: "number" }], display: { title: "billingName", sub: "billingAmount" } },
    { tab: "insuranceClaims", plural: "insuranceClaims", singular: "InsuranceClaim", pascal: "InsuranceClaim", db: "hspInsuranceClaims", fields: [{ name: "claimKey", type: "string" }, { name: "claimName", type: "string" }, { name: "claimStatus", type: "string" }], display: { title: "claimName", sub: "claimStatus" } },
    { tab: "hospitalInvoices", plural: "hospitalInvoices", singular: "HospitalInvoice", pascal: "HospitalInvoice", db: "hspHospitalInvoices", fields: [{ name: "invoiceKey", type: "string" }, { name: "invoiceName", type: "string" }, { name: "invoiceAmount", type: "number" }], display: { title: "invoiceName", sub: "invoiceAmount" } },
    { tab: "hospitalPayments", plural: "hospitalPayments", singular: "HospitalPayment", pascal: "HospitalPayment", db: "hspHospitalPayments", fields: [{ name: "paymentKey", type: "string" }, { name: "paymentName", type: "string" }, { name: "paymentAmount", type: "number" }], display: { title: "paymentName", sub: "paymentAmount" } },
    { tab: "patientNotifications", plural: "patientNotifications", singular: "PatientNotification", pascal: "PatientNotification", db: "hspPatientNotifications", fields: [{ name: "notificationKey", type: "string" }, { name: "notificationTitle", type: "string" }, { name: "notificationType", type: "string" }], display: { title: "notificationTitle", sub: "notificationType" } },
    { tab: "medicalReports", plural: "medicalReports", singular: "MedicalReport", pascal: "MedicalReport", db: "hspMedicalReports", fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "reportType", type: "string" }], display: { title: "reportName", sub: "reportType" } },
    { tab: "patientFeedback", plural: "patientFeedback", singular: "PatientFeedback", pascal: "PatientFeedback", db: "hspPatientFeedback", fields: [{ name: "feedbackKey", type: "string" }, { name: "feedbackName", type: "string" }, { name: "feedbackScore", type: "number" }], display: { title: "feedbackName", sub: "feedbackScore" } },
    { tab: "patientRegistrationsAnalytics", plural: "patientRegistrationsAnalytics", singular: "AdmissionsAnalytics", pascal: "AdmissionsAnalytics", db: "hspAdmissionsAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "occupancyAnalytics", plural: "occupancyAnalytics", singular: "OccupancyAnalytics", pascal: "OccupancyAnalytics", db: "hspOccupancyAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "revenueAnalytics", plural: "revenueAnalytics", singular: "RevenueAnalytics", pascal: "RevenueAnalytics", db: "hspRevenueAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "hospitalMetrics", plural: "hospitalMetrics", singular: "HospitalMetric", pascal: "HospitalMetric", db: "hspHospitalMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "patientRegistrationsCount", type: "number" }, { name: "overallHospitalScore", type: "number" }], display: { title: "metricsKey", sub: "overallHospitalScore" } },
    { tab: "hospitalHealth", plural: "hospitalHealth", singular: "HospitalHealth", pascal: "HospitalHealth", db: "hspHospitalHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "hspExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "hospitalFailures", plural: "hospitalFailures", singular: "HospitalFailure", pascal: "HospitalFailure", db: "hspHospitalFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];

const tabs = ["overview", ...entities.map((e) => e.tab), "auditLogs", "api"];
mkdirSync(join(mod, "constants"), { recursive: true });
mkdirSync(join(mod, "schemas"), { recursive: true });
mkdirSync(join(mod, "services"), { recursive: true });
mkdirSync(join(mod, "hooks"), { recursive: true });
mkdirSync(join(mod, "components"), { recursive: true });
mkdirSync(join(mod, "sdk"), { recursive: true });

// --- constants ---
writeFileSync(join(mod, "constants/index.ts"), `export const HSP_TABS = {
${tabs.map((t) => `    ${t}: "${t}",`).join("\n")}
} as const;

export const REGISTRATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "waitlisted", label: "Waitlisted" },
] as const;

export const APPOINTMENT_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const BED_STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
    { value: "reserved", label: "Reserved" },
] as const;

export const PRESCRIPTION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "dispensed", label: "Dispensed" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const IPD_REGISTRATION_STATUS_OPTIONS = [
    { value: "admitted", label: "Admitted" },
    { value: "discharged", label: "Discharged" },
    { value: "transferred", label: "Transferred" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const HSP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "waiting", label: "Waiting" },
    { value: "completed", label: "Completed" },
    { value: "available", label: "Available" },
] as const;

export const HSP_PERMISSIONS = ["hsp.view", "hsp.manage", "hsp.approve", "hsp.admin"] as const;


export const HSP_THEME = {
    primary: "cyan-600",
    primaryHover: "cyan-500",
    ring: "cyan-500/20",
    text: "text-cyan-600",
    textDark: "dark:text-cyan-400",
    bg: "bg-cyan-600",
    bgHover: "hover:bg-cyan-500",
} as const;
`);

// --- schemas ---
const schemaLines = entities.map((e) => {
    const hubId = e.hubField === false ? "" : `\n    hospitalHubId: z.string().min(1),`;
    const fieldLines = e.fields.map((f) => {
        if (f.type === "number") return `    ${f.name}: z.number().optional(),`;
        if (f.type === "boolean") return `    ${f.name}: z.boolean().optional(),`;
        return `    ${f.name}: z.string().min(1).optional(),`;
    }).join("\n");
    const schemaName = e.tab.replace(/([A-Z])/g, (m) => m.toLowerCase());
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `export const ${camel}FormSchema = z.object({${hubId}
${fieldLines}
});

export type ${camel}FormValues = z.infer<typeof ${camel}FormSchema>;`;
});
writeFileSync(join(mod, "schemas/index.ts"), `import { z } from "zod";\n\n${schemaLines.join("\n\n")}\n`);

// --- service ---
const mapperImports = [
    "buildHospitalHubLookupMaps", "buildHspAuditPayload", "buildHspDashboardStats", "buildHspPipelineInfo", "mapAuditEntry",
    ...entities.flatMap((e) => [`build${e.pascal}Payload`, `map${e.pascal}Summary`]),
    "mapCampusForStats", "mapPatientRegistrationForStats", "mapHospitalMetricForStats", "mapAppointmentForStats", "mapHospitalInvoiceForStats", "mapPharmacyInventoryForStats", "mapHospitalHealthForStats", "mapHospitalFailureForStats",
].join(",\n    ");

const typeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "HspDashboardStats", "HspPipelineInfo", "HspSdkRegisterFormInput", "HspSdkRegisterFormResult", "HspSdkConfigureValidationInput", "HspSdkConfigureValidationResult", "HspSdkRunFormSubmissionInput", "HspSdkRunFormSubmissionResult"]).join(",\n    ");

const serviceMethods = entities.map((e) => {
    const maps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const mapCall = e.orgOnly ? `map${e.pascal}Summary` : `(r) => map${e.pascal}Summary(r, maps)`;
    const createMaps = e.orgOnly ? "" : "\n        const maps = await this.getMaps(context.organizationId);";
    const createReturn = e.orgOnly ? `return map${e.pascal}Summary(created);` : `return map${e.pascal}Summary(created, maps);`;
    return `
    async get${e.pascal}s(authUserId: string, email: string, fullName?: string | null): Promise<${e.pascal}Summary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];${maps}
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});
    }

    async create${e.pascal}(authUserId: string, email: string, input: Create${e.pascal}Input, fullName?: string | null): Promise<${e.pascal}Summary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(build${e.pascal}Payload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "${e.tab.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")}", "create", \`${e.pascal} created\`, created.id));${createMaps}
        ${createReturn}
    }`;
}).join("\n");

writeFileSync(join(mod, "services/hospital.service.ts"), `import {
    ${mapperImports},
} from "@/src/modules/database/lib/hospital-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports},
} from "@/src/modules/hospital/types";

export class HospitalService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const hospitalHubs = await databaseService.hspHospitalHubs.listByOrganization(organizationId);
        return buildHospitalHubLookupMaps(hospitalHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<HspDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildHspDashboardStats({ hospitalHubs: [], campuses: [], patientRegistrations: [], hospitalMetrics: [], appointments: [], hospitalInvoices: [], pharmacyInventory: [], hospitalHealth: [], hospitalFailures: [], auditLogs: [] });
        const [hospitalHubs, campusesRaw, patientRegistrationsRaw, hospitalMetricsRaw, appointmentsRaw, hospitalInvoicesRaw, pharmacyInventoryRaw, hospitalHealthRaw, hospitalFailures, auditLogs] = await Promise.all([
            this.getHospitalHubs(authUserId, email, fullName),
            databaseService.hspCampuses.listByOrganization(context.organizationId),
            databaseService.hspAdmissions.listByOrganization(context.organizationId),
            databaseService.hspHospitalMetrics.listByOrganization(context.organizationId),
            databaseService.hspExaminations.listByOrganization(context.organizationId),
            databaseService.hspFeeInvoices.listByOrganization(context.organizationId),
            databaseService.hspTeachers.listByOrganization(context.organizationId),
            databaseService.hspHospitalHealth.listByOrganization(context.organizationId),
            this.getHospitalFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildHspDashboardStats({
            hospitalHubs,
            campuses: campusesRaw.map(mapCampusForStats),
            patientRegistrations: patientRegistrationsRaw.map(mapPatientRegistrationForStats),
            hospitalMetrics: hospitalMetricsRaw.map(mapHospitalMetricForStats),
            appointments: appointmentsRaw.map(mapAppointmentForStats),
            hospitalInvoices: hospitalInvoicesRaw.map(mapHospitalInvoiceForStats),
            pharmacyInventory: pharmacyInventoryRaw.map(mapPharmacyInventoryForStats),
            hospitalHealth: hospitalHealthRaw.map(mapHospitalHealthForStats),
            hospitalFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): HspPipelineInfo {
        return buildHspPipelineInfo();
    }
${serviceMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.hspAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getHospitalHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.hspHospitalHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterCampus(authUserId: string, email: string, input: HspSdkRegisterFormInput, fullName?: string | null): Promise<HspSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_campus", moduleSource: "enterprise_hospital_business_os", inputPayload: { ...input } });
        const created = await this.createCampus(authUserId, email, { hospitalHubId: input.hospitalHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigurePatientRegistration(authUserId: string, email: string, input: HspSdkConfigureValidationInput, fullName?: string | null): Promise<HspSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { hospitalHubId: input.hospitalHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunAppointmentWorkflow(authUserId: string, email: string, input: HspSdkRunFormSubmissionInput, fullName?: string | null): Promise<HspSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_appointment_workflow", moduleSource: "enterprise_hospital_business_os", inputPayload: { ...input } });
        const created = await this.createAppointment(authUserId, email, { hospitalHubId: input.hospitalHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const hospitalService = new HospitalService();
`);

// --- hook ---
const hookTypeImports = entities.flatMap((e) => [`${e.pascal}Summary`, `Create${e.pascal}Input`]).concat(["AuditEntry", "HspDashboardStats", "HspPipelineInfo"]).join(",\n    ");
const hookStates = entities.map((e) => `    const [${e.plural}, set${e.pascal}s] = useState<${e.pascal}Summary[]>([]);`).join("\n");
const hookFetchVars = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookFetchCalls = entities.map((e) => `            hospitalService.get${e.pascal}s(authUserId, email, fullName),`).join("\n");
const hookReturnProps = entities.map((e) => `${e.plural}List`).join(",\n            ");
const hookApplySets = entities.map((e) => `        set${e.pascal}s(result.${e.plural}List);`).join("\n");
const hookCreates = entities.map((e) => `    const create${e.pascal} = useCallback(async (input: Create${e.pascal}Input) => { if (!user) throw new Error("Authentication required"); await hospitalService.create${e.pascal}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
const hookReturnFields = entities.map((e) => `        ${e.plural},\n        create${e.pascal},`).join("\n");

writeFileSync(join(mod, "hooks/useHospital.ts"), `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { hospitalService } from "@/src/modules/hospital/services/hospital.service";
import type {
    ${hookTypeImports},
} from "@/src/modules/hospital/types";

export function useHospital() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<HspDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<HspPipelineInfo | null>(null);
${hookStates}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [hospitalHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${hookFetchVars},
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            hospitalService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(hospitalService.getPipelineInfo()),
${hookFetchCalls}
            hospitalService.getAuditLogs(authUserId, email, fullName),
            hospitalService.getHospitalHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${hookReturnProps},
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${hookApplySets}
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

${hookCreates}

    return {
        loading,
        stats,
        pipeline,
${hookReturnFields}
        auditLogs,
        hospitalHubOptions,
        refresh,
    };
}
`);

// --- panels ---
const label = (tab) => tab.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const panelImports = entities.map((e) => `${e.pascal}sPanel`).join(",\n    ");
const schemaImports = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    return `    ${camel}FormSchema,\n    type ${camel}FormValues,`;
}).join("\n");

const panelFns = entities.map((e) => {
    const camel = e.tab.charAt(0).toLowerCase() + e.tab.slice(1);
    const panelName = `${e.pascal}sPanel`;
    const defaults = e.fields.reduce((acc, f) => {
        acc[f.name] = f.type === "number" ? 0 : f.type === "boolean" ? false : "";
        return acc;
    }, e.hubField === false ? {} : { hospitalHubId: "" });
    const defaultStr = JSON.stringify(defaults);
    const formFields = e.fields.map((f) => {
        if (f.type === "select") return `                <select {...form.register("${f.name}")} className={inputClass}>{${f.options}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.type === "number") return `                <input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.name}" className={inputClass} />`;
        if (f.type === "boolean") return `                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${f.name}")} /> ${f.name}</label>`;
        return `                <input {...form.register("${f.name}")} placeholder="${f.name}" className={inputClass} />`;
    }).join("\n");
    const hubSelect = e.hubField === false ? "" : `                <HospitalHubSelect data={data} {...form.register("hospitalHubId")} />\n`;
    const titleField = e.display.title;
    const subField = e.display.sub;
    return `export function ${panelName}({ data }: { data: HospitalData }) {
    const form = useForm<${camel}FormValues>({ resolver: zodResolver(${camel}FormSchema), defaultValues: ${defaultStr} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${label(e.tab)}" description="Enterprise hospital operating system ${label(e.tab).toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.plural}.length === 0 ? <EmptyState title="No ${label(e.tab).toLowerCase()}" description="Create the first ${label(e.tab).toLowerCase()} record." /> : data.${e.plural}.map((item) => (
                    <ListCard key={item.id} title={String(item.${titleField})} subtitle={\`\${item.hubName ? item.hubName + " • " : ""}\${item.${subField}}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create ${label(e.tab).toLowerCase()}" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.create${e.pascal}(v))}>
${hubSelect}${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
}).join("\n\n");

writeFileSync(join(mod, "components/HospitalPanels.tsx"), `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { HSP_THEME, REGISTRATION_STATUS_OPTIONS, ALERT_SEVERITY_OPTIONS } from "@/src/modules/hospital/constants";
import type { useHospital } from "@/src/modules/hospital/hooks/useHospital";
import {
${schemaImports}
} from "@/src/modules/hospital/schemas";

type HospitalData = ReturnType<typeof useHospital>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-cyan-600">{meta}</p> : null}</div>;
}
function HospitalHubSelect({ data, ...props }: { data: HospitalData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select hospital operating system</option>{data.hospitalHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function HospitalOverviewPanel({ data }: { data: HospitalData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Hospital OS summary" description="System health, background jobs, event bus, hospitalInvoices, feature flags, configuration, diagnostics, and operations dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Hospital Hubs" subtitle={\`\${data.stats?.totalHospitalHubs ?? 0} total\`} meta={\`\${data.stats?.activeHospitalHubs ?? 0} active • \${data.stats?.campusCount ?? 0} dining areas\`} />
                <ListCard title="Connectors" subtitle={\`\${data.stats?.patientRegistrationCount ?? 0} menu categories\`} meta={\`\${data.stats?.appointmentCount ?? 0} appointments • \${data.stats?.openHospitalInvoiceCount ?? 0} open hospitalInvoices\`} />
                <ListCard title="Health" subtitle={\`\${(data.stats?.overallHospitalScore ?? 0).toFixed(1)} overall hospital score\`} meta={\`\${data.stats?.openFailureCount ?? 0} open failures\`} />
                <ListCard title="Audit Trail" subtitle={\`\${data.stats?.auditCount ?? 0} audit entries\`} meta="Security-first hospital operating system" />
            </div></Card>
            <Card hover><SectionHeader title="Hospital operating system pipeline" description={\`\${pipeline?.previousStage ?? "configured"} → \${pipeline?.currentStage ?? "active"} → \${pipeline?.nextStage ?? "degraded"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Hospital operating system pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

${panelFns}

export function HospitalAuditLogsPanel({ data }: { data: HospitalData }) {
    return (
        <Card hover><SectionHeader title="Hospital OS audit history" description="Security-first audit trail for jobs, events, hospitalInvoices, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for hospital operating system." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function HospitalSdkPanel({ data }: { data: HospitalData }) {
    return (
        <Card hover><SectionHeader title="Shared Hospital OS SDK" description="Import from @/src/modules/hospital/sdk for brand registration, menu configuration, and order workflow execution" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createHospitalClient()" subtitle="Factory for module-scoped Hospital OS client with auth context" meta="Primary SDK for enterprise hospital operating system" />
            <ListCard title="sdkRegisterCampus()" subtitle="Register hospital operating system with AI orchestration" meta="moduleSource: enterprise_hospital_business_os" />
            <ListCard title="sdkConfigurePatientRegistration()" subtitle="Configure patient registration with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRunAppointmentWorkflow()" subtitle="Run appointment workflow with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {HSP_THEME.primary} • Integration hubs loaded: {data.hospitalHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createHospitalClient } from "@/src/modules/hospital/sdk";

const intg = createHospitalClient(userId, email, fullName);
await intg.registerCampus({ hospitalHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.configurePatientRegistration({ hospitalHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.runAppointmentWorkflow({ hospitalHubId, webhookKey: "wh-001", webhookName: "Events" });\`}</pre>
        </div></Card>
    );
}
`);

// --- stats ---
writeFileSync(join(mod, "components/HospitalStats.tsx"), `import { StatCard } from "@/src/components/ui/StatCard";
import type { HspDashboardStats } from "@/src/modules/hospital/types";

interface HospitalStatsProps { stats: HspDashboardStats | null; }

export function HospitalStats({ stats }: HospitalStatsProps) {
    const cards = [
        { title: "Hospital Hubs", value: String(stats?.totalHospitalHubs ?? 0), detail: \`\${stats?.activeHospitalHubs ?? 0} active • \${stats?.campusCount ?? 0} dining areas\`, trend: "up" as const },
        { title: "Connectors", value: String(stats?.patientRegistrationCount ?? 0), detail: \`\${stats?.appointmentCount ?? 0} appointments • \${stats?.openHospitalInvoiceCount ?? 0} open hospitalInvoices\`, trend: "up" as const, tone: "accent" as const },
        { title: "Health Score", value: \`\${(stats?.overallHospitalScore ?? 0).toFixed(1)}\`, detail: \`\${stats?.openFailureCount ?? 0} open failures\`, trend: "up" as const },
        { title: "Audit Trail", value: String(stats?.auditCount ?? 0), detail: "Jobs, events, hospitalInvoices, and configuration audit entries", trend: "up" as const },
    ];
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 [&_p:last-child]:text-cyan-600 dark:[&_p:last-child]:text-cyan-400">
            {cards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} detail={card.detail} trend={card.trend} tone={card.tone} />)}
        </section>
    );
}
`);

// --- page ---
const tabDefs = [
    { id: "overview", label: "Overview", panel: "HospitalOverviewPanel" },
    ...entities.map((e) => ({ id: e.tab, label: label(e.tab), panel: `${e.pascal}sPanel` })),
    { id: "auditLogs", label: "Audit Logs", panel: "HospitalAuditLogsPanel" },
    { id: "api", label: "SDK", panel: "HospitalSdkPanel" },
];

writeFileSync(join(mod, "components/HospitalPage.tsx"), `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    HospitalOverviewPanel,
    ${panelImports},
    HospitalAuditLogsPanel,
    HospitalSdkPanel,
} from "@/src/modules/hospital/components/HospitalPanels";
import { HospitalStats } from "@/src/modules/hospital/components/HospitalStats";
import { HSP_TABS } from "@/src/modules/hospital/constants";
import { useHospital } from "@/src/modules/hospital/hooks/useHospital";

const tabs = [
${tabDefs.map((t) => `    { id: HSP_TABS.${t.id}, label: "${t.label}" },`).join("\n")}
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
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-cyan-600 text-white" : "border border-slate-200 text-slate-600 hover:border-cyan-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
${tabDefs.map((t) => `            {activeTab === HSP_TABS.${t.id} ? <${t.panel} data={hospital} /> : null}`).join("\n")}
        </div>
    );
}
`);

// --- sdk ---
writeFileSync(join(mod, "sdk/index.ts"), `import { hospitalService } from "@/src/modules/hospital/services/hospital.service";
import type { HspSdkRegisterFormInput, HspSdkConfigureValidationInput, HspSdkRunFormSubmissionInput } from "@/src/modules/hospital/types";

export class HospitalClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerCampus(input: HspSdkConnectServiceInput) {
        return hospitalService.sdkRegisterCampus(this.authUserId, this.email, input, this.fullName);
    }

    async configurePatientRegistration(input: HspSdkIssueApiKeyInput) {
        return hospitalService.sdkConfigurePatientRegistration(this.authUserId, this.email, input, this.fullName);
    }

    async runAppointmentWorkflow(input: HspSdkRegisterWebhookInput) {
        return hospitalService.sdkRunAppointmentWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getHospitalHubs() {
        return hospitalService.getHospitalHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return hospitalService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return hospitalService.getPipelineInfo();
    }
}

export function createHospitalClient(authUserId: string, email: string, fullName?: string | null): HospitalClient {
    return new HospitalClient(authUserId, email, fullName);
}

export { hospitalService };
`);

// --- index ---
writeFileSync(join(mod, "index.ts"), `export { HospitalPage } from "@/src/modules/hospital/components/HospitalPage";
export { HospitalStats } from "@/src/modules/hospital/components/HospitalStats";
export { hospitalService } from "@/src/modules/hospital/services/hospital.service";
export { useHospital } from "@/src/modules/hospital/hooks/useHospital";
export { createHospitalClient, HospitalClient } from "@/src/modules/hospital/sdk";
export * from "@/src/modules/hospital/types";
export * from "@/src/modules/hospital/constants";
`);

console.log(`Generated hospital operating system module files. HSP_TABS count: ${tabs.length}`);
