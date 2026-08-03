#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-school-ui.mjs");
const outPath = join(root, "scripts/generate-hospital-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
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
    { tab: "ipdAdmissions", plural: "ipdAdmissions", singular: "IpdAdmission", pascal: "IpdAdmission", db: "hspIpdAdmissions", fields: [{ name: "admissionKey", type: "string" }, { name: "admissionName", type: "string" }, { name: "admissionStatus", type: "select", options: "IPD_ADMISSION_STATUS_OPTIONS" }], display: { title: "admissionName", sub: "admissionStatus" } },
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
    { tab: "admissionsAnalytics", plural: "admissionsAnalytics", singular: "AdmissionsAnalytics", pascal: "AdmissionsAnalytics", db: "hspAdmissionsAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "occupancyAnalytics", plural: "occupancyAnalytics", singular: "OccupancyAnalytics", pascal: "OccupancyAnalytics", db: "hspOccupancyAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "revenueAnalytics", plural: "revenueAnalytics", singular: "RevenueAnalytics", pascal: "RevenueAnalytics", db: "hspRevenueAnalytics", fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" } },
    { tab: "hospitalMetrics", plural: "hospitalMetrics", singular: "HospitalMetric", pascal: "HospitalMetric", db: "hspHospitalMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "admissionsCount", type: "number" }, { name: "overallHospitalScore", type: "number" }], display: { title: "metricsKey", sub: "overallHospitalScore" } },
    { tab: "hospitalHealth", plural: "hospitalHealth", singular: "HospitalHealth", pascal: "HospitalHealth", db: "hspHospitalHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: "hspExecutiveKpis", fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" } },
    { tab: "hospitalFailures", plural: "hospitalFailures", singular: "HospitalFailure", pascal: "HospitalFailure", db: "hspHospitalFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/school"\);/, 'const mod = join(root, "src/modules/hospital");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/schoolHubs/g, "hospitalHubs"],
    [/schoolHubOptions/g, "hospitalHubOptions"],
    [/getSchoolHubs/g, "getHospitalHubs"],
    [/getSchoolHubOptions/g, "getHospitalHubOptions"],
    [/SchoolHubSelect/g, "HospitalHubSelect"],
    [/buildSchoolHubLookupMaps/g, "buildHospitalHubLookupMaps"],
    [/schoolHubId/g, "hospitalHubId"],
    [/School Hubs/g, "Hospital Hubs"],
    [/School Hub/g, "Hospital OS"],
    [/school hub/g, "hospital hub"],
    [/school/g, "hospital"],
    [/School/g, "Hospital"],
    [/buildSch/g, "buildHsp"],
    [/mapSch/g, "mapHsp"],
    [/SchDashboardStats/g, "HspDashboardStats"],
    [/SchPipelineInfo/g, "HspPipelineInfo"],
    [/SchSdk/g, "HspSdk"],
    [/SCH_TABS/g, "HSP_TABS"],
    [/SCH_THEME/g, "HSP_THEME"],
    [/SCH_PERMISSIONS/g, "HSP_PERMISSIONS"],
    [/SCH_STATUS_OPTIONS/g, "HSP_STATUS_OPTIONS"],
    [/Program B Sprint 7/g, "Program B Sprint 8"],
    [/blue-600/g, "cyan-600"],
    [/blue-500/g, "cyan-500"],
    [/blue-400/g, "cyan-400"],
    [/blue-300/g, "cyan-300"],
    [/ring-blue/g, "ring-cyan"],
    [/bg-blue/g, "bg-cyan"],
    [/text-blue/g, "text-cyan"],
    [/hover:bg-blue/g, "hover:bg-cyan"],
    [/hover:border-blue/g, "hover:border-cyan"],
    [/mapCampusForStats/g, "mapCampusForStats"],
    [/mapAdmissionForStats/g, "mapPatientRegistrationForStats"],
    [/mapSchoolMetricForStats/g, "mapHospitalMetricForStats"],
    [/mapExaminationForStats/g, "mapAppointmentForStats"],
    [/mapFeeInvoiceForStats/g, "mapHospitalInvoiceForStats"],
    [/mapTeacherForStats/g, "mapPharmacyInventoryForStats"],
    [/mapSchoolHealthForStats/g, "mapHospitalHealthForStats"],
    [/mapSchoolFailureForStats/g, "mapHospitalFailureForStats"],
    [/admissions/g, "patientRegistrations"],
    [/examinations/g, "appointments"],
    [/feeInvoices/g, "hospitalInvoices"],
    [/teachers/g, "pharmacyInventory"],
    [/schoolMetrics/g, "hospitalMetrics"],
    [/schoolHealth/g, "hospitalHealth"],
    [/schoolFailures/g, "hospitalFailures"],
    [/totalSchoolHubs/g, "totalHospitalHubs"],
    [/activeSchoolHubs/g, "activeHospitalHubs"],
    [/admissionCount/g, "patientRegistrationCount"],
    [/examinationCount/g, "appointmentCount"],
    [/openFeeInvoiceCount/g, "openHospitalInvoiceCount"],
    [/overallSchoolScore/g, "overallHospitalScore"],
    [/admissionsCountScore/g, "admissionsCountScore"],
    [/attendanceRateScore/g, "bedOccupancyRateScore"],
    [/academicPerformanceScore/g, "departmentPerformanceScore"],
    [/feeCollectionRateScore/g, "patientSatisfactionScore"],
    [/sdkRegisterCampus/g, "sdkRegisterCampus"],
    [/sdkConfigureAdmission/g, "sdkConfigurePatientRegistration"],
    [/sdkRunExamWorkflow/g, "sdkRunAppointmentWorkflow"],
    [/configureAdmission/g, "configurePatientRegistration"],
    [/runExamWorkflow/g, "runAppointmentWorkflow"],
    [/createAdmission/g, "createPatientRegistration"],
    [/createExamination/g, "createAppointment"],
    [/Configure admission/g, "Configure patient registration"],
    [/Run exam workflow/g, "Run appointment workflow"],
    [/campuses, admissions, examinations, teachers, fee invoices, and student profiles/g, "campuses, patient registrations, appointments, pharmacy inventory, hospital invoices, and patient profiles"],
    [/Campuses, admissions, examinations, teachers, fee invoices, student profiles, and school business operating system outputs/g, "Campuses, patient registrations, appointments, pharmacy inventory, hospital invoices, patient profiles, and hospital business operating system outputs"],
    [/enterprise_school_business_os/g, "enterprise_hospital_business_os"],
    [/register_campus/g, "register_campus"],
    [/run_exam_workflow/g, "run_appointment_workflow"],
    [/"sch\.view"/g, '"hsp.view"'],
    [/"sch\.manage"/g, '"hsp.manage"'],
    [/"sch\.approve"/g, '"hsp.approve"'],
    [/"sch\.admin"/g, '"hsp.admin"'],
    [/schSchoolHubs/g, "hspHospitalHubs"],
    [/getSchoolFailures/g, "getHospitalFailures"],
    [/school-mappers/g, "hospital-mappers"],
    [/buildSchoolHubPayload/g, "buildHospitalHubPayload"],
    [/mapSchoolHubSummary/g, "mapHospitalHubSummary"],
    [/buildSchAuditPayload/g, "buildHspAuditPayload"],
    [/createSchoolClient/g, "createHospitalClient"],
    [/SchoolClient/g, "HospitalClient"],
    [/databaseService\.sch/g, "databaseService.hsp"],
    [/useSchool/g, "useHospital"],
    [/SchoolPage/g, "HospitalPage"],
    [/SchoolStats/g, "HospitalStats"],
    [/SchoolPanels/g, "HospitalPanels"],
    [/schoolService/g, "hospitalService"],
    [/SchoolService/g, "HospitalService"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.hspCampuses\.listByOrganization/g, "databaseService.hspCampuses.listByOrganization");
s = s.replace(/databaseService\.hspBuildings\.listByOrganization/g, "databaseService.hspDepartments.listByOrganization");
s = s.replace(/databaseService\.hspClassrooms\.listByOrganization/g, "databaseService.hspWards.listByOrganization");
s = s.replace(/databaseService\.hspAcademicYears\.listByOrganization/g, "databaseService.hspHospitalBeds.listByOrganization");
s = s.replace(/databaseService\.hspPatientRegistrations\.listByOrganization/g, "databaseService.hspPatientRegistrations.listByOrganization");
s = s.replace(/databaseService\.hspHospitalMetrics\.listByOrganization/g, "databaseService.hspHospitalMetrics.listByOrganization");
s = s.replace(/databaseService\.hspAppointments\.listByOrganization/g, "databaseService.hspAppointments.listByOrganization");
s = s.replace(/databaseService\.hspHospitalInvoices\.listByOrganization/g, "databaseService.hspHospitalInvoices.listByOrganization");
s = s.replace(/databaseService\.hspPharmacyInventory\.listByOrganization/g, "databaseService.hspPharmacyInventory.listByOrganization");
s = s.replace(/databaseService\.hspHospitalHealth\.listByOrganization/g, "databaseService.hspHospitalHealth.listByOrganization");
s = s.replace(/databaseService\.hspHospitalHubs\.listByOrganization/g, "databaseService.hspHospitalHubs.listByOrganization");
s = s.replace(/databaseService\.hspAuditLogs/g, "databaseService.hspAuditLogs");

s = s.replace(
    /async sdkRegisterCampus\(authUserId: string, email: string, input: HspSdkRegisterCampusInput[\s\S]*?return \{ campusId: created\.id, campusKey: created\.campusKey, status: created\.status \};\n    \}/,
    `async sdkRegisterCampus(authUserId: string, email: string, input: HspSdkRegisterCampusInput, fullName?: string | null): Promise<HspSdkRegisterCampusResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const created = await this.createCampus(authUserId, email, { hospitalHubId: input.hospitalHubId, campusKey: input.campusKey, campusName: input.campusName }, fullName);
        return { campusId: created.id, campusKey: created.campusKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkConfigurePatientRegistration\(authUserId: string, email: string, input: HspSdkConfigureAdmissionInput[\s\S]*?return \{ admissionId: created\.id, admissionKey: created\.admissionKey, status: created\.status \};\n    \}/,
    `async sdkConfigurePatientRegistration(authUserId: string, email: string, input: HspSdkConfigurePatientRegistrationInput, fullName?: string | null): Promise<HspSdkConfigurePatientRegistrationResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        const created = await this.createPatientRegistration(authUserId, email, { hospitalHubId: input.hospitalHubId, registrationKey: input.registrationKey, registrationName: input.registrationName }, fullName);
        return { registrationId: created.id, registrationKey: created.registrationKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkRunAppointmentWorkflow\(authUserId: string, email: string, input: HspSdkRunExamWorkflowInput[\s\S]*?return \{ examId: created\.id, examKey: created\.examKey, status: created\.status \};\n    \}/,
    `async sdkRunAppointmentWorkflow(authUserId: string, email: string, input: HspSdkRunAppointmentWorkflowInput, fullName?: string | null): Promise<HspSdkRunAppointmentWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createAppointment(authUserId, email, { hospitalHubId: input.hospitalHubId, appointmentKey: input.appointmentKey, appointmentName: input.appointmentName }, fullName);
        return { appointmentId: created.id, appointmentKey: created.appointmentKey, status: created.status };
    }`,
);

const hspOptionsBlock = `export const REGISTRATION_STATUS_OPTIONS = [
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

export const IPD_ADMISSION_STATUS_OPTIONS = [
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

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const HSP_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const HSP_THEME)/,
    `$1${hspOptionsBlock}$2`,
);

s = s.replace(/Select hospital hub/g, "Select hospital hub");
s = s.replace(/ADMISSION_STATUS_OPTIONS/g, "REGISTRATION_STATUS_OPTIONS");
s = s.replace(/EXAM_TYPE_OPTIONS/g, "APPOINTMENT_STATUS_OPTIONS");
s = s.replace(/ATTENDANCE_STATUS_OPTIONS/g, "BED_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-hospital-ui.mjs");
