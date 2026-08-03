#!/usr/bin/env node
/**
 * Generates hospital-mappers.ts and types/index.ts for Program B Sprint 8.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const entities = [
    { pascal: "HospitalHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "Campus", key: "campus_key", title: "campus_name", sub: "campus_type", hub: true, orgOnly: false, createFields: ["campusKey", "campusName", "campusType"] },
    { pascal: "Department", key: "department_key", title: "department_name", sub: "department_type", hub: true, orgOnly: false, createFields: ["departmentKey", "departmentName", "departmentType"] },
    { pascal: "Ward", key: "ward_key", title: "ward_name", sub: "ward_type", hub: true, orgOnly: false, createFields: ["wardKey", "wardName", "wardType"] },
    { pascal: "HospitalBed", key: "bed_key", title: "bed_number", sub: "bed_status", hub: true, orgOnly: false, createFields: ["bedKey", "bedNumber", "bedStatus"] },
    { pascal: "PatientRegistration", key: "registration_key", title: "registration_name", sub: "registration_status", hub: true, orgOnly: false, createFields: ["registrationKey", "registrationName", "registrationStatus"] },
    { pascal: "PatientProfile", key: "profile_key", title: "profile_name", sub: "profile_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileType"] },
    { pascal: "MedicalHistory", key: "history_key", title: "history_name", sub: "history_type", hub: true, orgOnly: false, createFields: ["historyKey", "historyName", "historyType"] },
    { pascal: "InsurancePolicy", key: "policy_key", title: "policy_name", sub: "policy_type", hub: true, orgOnly: false, createFields: ["policyKey", "policyName", "policyType"] },
    { pascal: "Appointment", key: "appointment_key", title: "appointment_name", sub: "appointment_status", hub: true, orgOnly: false, createFields: ["appointmentKey", "appointmentName", "appointmentStatus"] },
    { pascal: "OpdVisit", key: "visit_key", title: "visit_name", sub: "visit_status", hub: true, orgOnly: false, createFields: ["visitKey", "visitName", "visitStatus"] },
    { pascal: "IpdAdmission", key: "admission_key", title: "admission_name", sub: "admission_status", hub: true, orgOnly: false, createFields: ["admissionKey", "admissionName", "admissionStatus"] },
    { pascal: "ClinicalNote", key: "note_key", title: "note_name", sub: "note_type", hub: true, orgOnly: false, createFields: ["noteKey", "noteName", "noteType"] },
    { pascal: "PharmacyInventory", key: "inventory_key", title: "inventory_name", sub: "inventory_type", hub: true, orgOnly: false, createFields: ["inventoryKey", "inventoryName", "inventoryType"] },
    { pascal: "Prescription", key: "prescription_key", title: "prescription_name", sub: "prescription_status", hub: true, orgOnly: false, createFields: ["prescriptionKey", "prescriptionName", "prescriptionStatus"] },
    { pascal: "LabOrder", key: "order_key", title: "order_name", sub: "order_status", hub: true, orgOnly: false, createFields: ["orderKey", "orderName", "orderStatus"] },
    { pascal: "LabResult", key: "result_key", title: "result_name", sub: "result_status", hub: true, orgOnly: false, createFields: ["resultKey", "resultName", "resultStatus"] },
    { pascal: "HospitalBilling", key: "billing_key", title: "billing_name", sub: "billing_amount", hub: true, orgOnly: false, createFields: ["billingKey", "billingName", "billingAmount"] },
    { pascal: "InsuranceClaim", key: "claim_key", title: "claim_name", sub: "claim_status", hub: true, orgOnly: false, createFields: ["claimKey", "claimName", "claimStatus"] },
    { pascal: "HospitalInvoice", key: "invoice_key", title: "invoice_name", sub: "invoice_amount", hub: true, orgOnly: false, createFields: ["invoiceKey", "invoiceName", "invoiceAmount"] },
    { pascal: "HospitalPayment", key: "payment_key", title: "payment_name", sub: "payment_amount", hub: true, orgOnly: false, createFields: ["paymentKey", "paymentName", "paymentAmount"] },
    { pascal: "PatientNotification", key: "notification_key", title: "notification_title", sub: "notification_type", hub: true, orgOnly: false, createFields: ["notificationKey", "notificationTitle", "notificationType"] },
    { pascal: "MedicalReport", key: "report_key", title: "report_name", sub: "report_type", hub: true, orgOnly: false, createFields: ["reportKey", "reportName", "reportType"] },
    { pascal: "PatientFeedback", key: "feedback_key", title: "feedback_name", sub: "feedback_score", hub: true, orgOnly: false, createFields: ["feedbackKey", "feedbackName", "feedbackScore"] },
    { pascal: "AdmissionsAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "OccupancyAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "RevenueAnalytics", key: "analytics_key", title: "analytics_key", sub: "analytics_type", hub: true, orgOnly: false, createFields: ["analyticsKey", "analyticsType", "analyticsScore"] },
    { pascal: "HospitalMetric", key: "metrics_key", title: "metrics_key", sub: "overall_hospital_score", hub: false, orgOnly: true, createFields: ["metricsKey", "admissionsCount", "overallHospitalScore"] },
    { pascal: "HospitalHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "disasterRecoveryMode"] },
    { pascal: "ExecutiveKpi", key: "kpi_key", title: "kpi_name", sub: "kpi_score", hub: true, orgOnly: false, createFields: ["kpiKey", "kpiName", "kpiScore"] },
    { pascal: "HospitalFailure", key: "failure_key", title: "failure_key", sub: "failure_type", hub: true, orgOnly: false, createFields: ["failureKey", "failureType"] },
];

const numFields = new Set([
    "billingAmount", "invoiceAmount", "paymentAmount", "feedbackScore", "analyticsScore", "kpiScore",
    "admissionsCount", "overallHospitalScore", "overallScore",
]);
const boolFields = new Set(["disasterRecoveryMode"]);

function buildTypes() {
    let t = `export interface HspDashboardStats {
    totalHospitalHubs: number;
    activeHospitalHubs: number;
    campusCount: number;
    patientRegistrationCount: number;
    appointmentCount: number;
    openHospitalInvoiceCount: number;
    openFailureCount: number;
    overallHospitalScore: number;
    admissionsCountScore: number;
    revenueTotalScore: number;
    bedOccupancyRateScore: number;
    departmentPerformanceScore: number;
    patientSatisfactionScore: number;
    auditCount: number;
}

export interface HspPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface HspSdkRegisterCampusInput { hospitalHubId: string; campusKey?: string; campusName?: string; }
export interface HspSdkRegisterCampusResult { campusId: string; campusKey: string; status: string; }
export interface HspSdkConfigurePatientRegistrationInput { hospitalHubId: string; registrationKey?: string; registrationName?: string; }
export interface HspSdkConfigurePatientRegistrationResult { registrationId: string; registrationKey: string; status: string; }
export interface HspSdkRunAppointmentWorkflowInput { hospitalHubId: string; appointmentKey?: string; appointmentName?: string; }
export interface HspSdkRunAppointmentWorkflowResult { appointmentId: string; appointmentKey: string; status: string; }

`;
    for (const e of entities) {
        const isHub = e.pascal === "HospitalHub";
        const fields = e.createFields.map((f) => `    ${f}?: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const summaryFields = e.createFields.map((f) => `    ${f}: ${boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string"};`).join("\n");
        const createExtra = e.orgOnly || isHub ? "" : "    hospitalHubId: string;\n    ";
        t += `export interface ${e.pascal}Summary {
    id: string;
    ${isHub ? "" : "hubName?: string;\n    "}${summaryFields}
    status: string;
}

export interface Create${e.pascal}Input {
    ${createExtra}${fields}
}

`;
    }
    return t;
}

function buildMappers() {
    const dbImports = entities.map((e) => `DbHsp${e.pascal}`).concat(["DbHspAuditLog"]).join(",\n    ");
    const typeImports = entities.flatMap((e) => [`Create${e.pascal}Input`, `${e.pascal}Summary`]).concat(["HspDashboardStats", "HspPipelineInfo", "AuditEntry"]).join(",\n    ");

    let m = `import type { ${dbImports} } from "@/src/modules/database/types/platform";
import type { ${typeImports} } from "@/src/modules/hospital/types";

export function buildHospitalHubLookupMaps(hubs: DbHspHospitalHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildHspPipelineInfo(): HspPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "patient", label: "Patient" },
        { key: "clinical", label: "Clinical Operations" },
        { key: "pharmacy_lab", label: "Pharmacy & Lab" },
        { key: "finance", label: "Finance" },
    ];
    return { stages, currentStage: "clinical", nextStage: "pharmacy_lab", previousStage: "patient" };
}

export function buildHspAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbHspAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

`;

    for (const e of entities) {
        const isHub = e.pascal === "HospitalHub";
        const mapFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const cast = boolFields.has(f) ? "boolean" : numFields.has(f) ? "number" : "string";
            return `        ${f}: record.${snake} as ${cast},`;
        }).join("\n");
        const payloadFields = e.createFields.map((f) => {
            const snake = f.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
            const def = boolFields.has(f) ? "false" : numFields.has(f) ? "0" : "''";
            return `        ${snake}: input.${f} ?? ${def},`;
        }).join("\n");
        const hubLine = e.orgOnly || isHub ? "" : "        hub_id: input.hospitalHubId,\n";
        const hubNameLine = isHub || e.orgOnly ? "" : "        hubName: maps?.hubNameById.get(record.hub_id ?? \"\") ?? undefined,\n";
        m += `export function map${e.pascal}Summary(record: DbHsp${e.pascal}${isHub || e.orgOnly ? "" : ", maps?: { hubNameById: Map<string, string> }"}): ${e.pascal}Summary {
    return {
        id: record.id,
${hubNameLine}${mapFields}
        status: record.status,
    };
}

export function build${e.pascal}Payload(organizationId: string, input: Create${e.pascal}Input): Record<string, unknown> {
    return {
        organization_id: organizationId,
${hubLine}${payloadFields}
        status: "active",
    };
}

`;
    }

    m += `export function mapCampusForStats(r: DbHspCampus) { return { status: r.status }; }
export function mapPatientRegistrationForStats(r: DbHspPatientRegistration) { return { status: r.status }; }
export function mapHospitalMetricForStats(r: DbHspHospitalMetric) {
    return {
        admissions_count: r.admissions_count,
        discharge_count: r.discharge_count,
        bed_occupancy_rate: r.bed_occupancy_rate,
        revenue_total: r.revenue_total,
        department_performance_score: r.department_performance_score,
        patient_satisfaction_score: r.patient_satisfaction_score,
        operational_health_score: r.operational_health_score,
        overall_hospital_score: r.overall_hospital_score,
        status: r.status,
    };
}
export function mapAppointmentForStats(r: DbHspAppointment) { return { appointment_status: r.appointment_status, status: r.status }; }
export function mapHospitalInvoiceForStats(r: DbHspHospitalInvoice) { return { status: r.status }; }
export function mapPharmacyInventoryForStats(r: DbHspPharmacyInventory) { return { status: r.status }; }
export function mapHospitalHealthForStats(r: DbHspHospitalHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapHospitalFailureForStats(r: DbHspHospitalFailure) { return { status: r.status }; }

export function buildHspDashboardStats(input: {
    hospitalHubs: HospitalHubSummary[];
    campuses: ReturnType<typeof mapCampusForStats>[];
    patientRegistrations: ReturnType<typeof mapPatientRegistrationForStats>[];
    hospitalMetrics: ReturnType<typeof mapHospitalMetricForStats>[];
    appointments: ReturnType<typeof mapAppointmentForStats>[];
    hospitalInvoices: ReturnType<typeof mapHospitalInvoiceForStats>[];
    pharmacyInventory: ReturnType<typeof mapPharmacyInventoryForStats>[];
    hospitalHealth: ReturnType<typeof mapHospitalHealthForStats>[];
    hospitalFailures: HospitalFailureSummary[];
    auditLogs: AuditEntry[];
}): HspDashboardStats {
    const activeHubs = input.hospitalHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.hospitalMetrics[0];
    const latestHealth = input.hospitalHealth[0];
    return {
        totalHospitalHubs: input.hospitalHubs.length,
        activeHospitalHubs: activeHubs,
        campusCount: input.campuses.length,
        patientRegistrationCount: input.patientRegistrations.length,
        appointmentCount: input.appointments.length,
        openHospitalInvoiceCount: input.hospitalInvoices.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.hospitalFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallHospitalScore: latestMetrics?.overall_hospital_score ?? latestHealth?.overall_score ?? 0,
        admissionsCountScore: latestMetrics?.admissions_count ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        bedOccupancyRateScore: latestMetrics?.bed_occupancy_rate ?? 0,
        departmentPerformanceScore: latestMetrics?.department_performance_score ?? 0,
        patientSatisfactionScore: latestMetrics?.patient_satisfaction_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
`;

    return m;
}

mkdirSync(join(root, "src/modules/hospital/types"), { recursive: true });
writeFileSync(join(root, "src/modules/hospital/types/index.ts"), buildTypes(), "utf8");
mkdirSync(join(root, "src/modules/database/lib"), { recursive: true });
writeFileSync(join(root, "src/modules/database/lib/hospital-mappers.ts"), buildMappers(), "utf8");
console.log("Generated HSP types and mappers");
