#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("HspHospitalHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/school-repositories\";";
    const schImportEnd = da.indexOf(anchor) + anchor.length;
    const hspImport = `
import {
    HspHospitalHubRepository,
    HspCampusRepository,
    HspDepartmentRepository,
    HspWardRepository,
    HspHospitalBedRepository,
    HspPatientRegistrationRepository,
    HspPatientProfileRepository,
    HspMedicalHistoryRepository,
    HspInsurancePolicyRepository,
    HspAppointmentRepository,
    HspOpdVisitRepository,
    HspIpdAdmissionRepository,
    HspClinicalNoteRepository,
    HspPharmacyInventoryRepository,
    HspPrescriptionRepository,
    HspLabOrderRepository,
    HspLabResultRepository,
    HspHospitalBillingRepository,
    HspInsuranceClaimRepository,
    HspHospitalInvoiceRepository,
    HspHospitalPaymentRepository,
    HspPatientNotificationRepository,
    HspMedicalReportRepository,
    HspPatientFeedbackRepository,
    HspAdmissionsAnalyticsRepository,
    HspOccupancyAnalyticsRepository,
    HspRevenueAnalyticsRepository,
    HspHospitalMetricRepository,
    HspHospitalHealthRepository,
    HspExecutiveKpiRepository,
    HspHospitalFailureRepository,
    HspAuditLogRepository,
} from "@/src/modules/database/repositories/hospital-repositories";
`;
    da = da.slice(0, schImportEnd) + hspImport + da.slice(schImportEnd);

    const schProp = "    readonly schAuditLogs: SchAuditLogRepository;";
    const hspProps = `    readonly hspHospitalHubs: HspHospitalHubRepository;
    readonly hspCampuses: HspCampusRepository;
    readonly hspDepartments: HspDepartmentRepository;
    readonly hspWards: HspWardRepository;
    readonly hspHospitalBeds: HspHospitalBedRepository;
    readonly hspPatientRegistrations: HspPatientRegistrationRepository;
    readonly hspPatientProfiles: HspPatientProfileRepository;
    readonly hspMedicalHistories: HspMedicalHistoryRepository;
    readonly hspInsurancePolicies: HspInsurancePolicyRepository;
    readonly hspAppointments: HspAppointmentRepository;
    readonly hspOpdVisits: HspOpdVisitRepository;
    readonly hspIpdAdmissions: HspIpdAdmissionRepository;
    readonly hspClinicalNotes: HspClinicalNoteRepository;
    readonly hspPharmacyInventory: HspPharmacyInventoryRepository;
    readonly hspPrescriptions: HspPrescriptionRepository;
    readonly hspLabOrders: HspLabOrderRepository;
    readonly hspLabResults: HspLabResultRepository;
    readonly hspHospitalBilling: HspHospitalBillingRepository;
    readonly hspInsuranceClaims: HspInsuranceClaimRepository;
    readonly hspHospitalInvoices: HspHospitalInvoiceRepository;
    readonly hspHospitalPayments: HspHospitalPaymentRepository;
    readonly hspPatientNotifications: HspPatientNotificationRepository;
    readonly hspMedicalReports: HspMedicalReportRepository;
    readonly hspPatientFeedback: HspPatientFeedbackRepository;
    readonly hspAdmissionsAnalytics: HspAdmissionsAnalyticsRepository;
    readonly hspOccupancyAnalytics: HspOccupancyAnalyticsRepository;
    readonly hspRevenueAnalytics: HspRevenueAnalyticsRepository;
    readonly hspHospitalMetrics: HspHospitalMetricRepository;
    readonly hspHospitalHealth: HspHospitalHealthRepository;
    readonly hspExecutiveKpis: HspExecutiveKpiRepository;
    readonly hspHospitalFailures: HspHospitalFailureRepository;
    readonly hspAuditLogs: HspAuditLogRepository;`;
    da = da.replace(schProp, schProp + "\n" + hspProps);

    const schCtor = "        this.schAuditLogs = new SchAuditLogRepository();";
    const hspCtor = `        this.hspHospitalHubs = new HspHospitalHubRepository();
        this.hspCampuses = new HspCampusRepository();
        this.hspDepartments = new HspDepartmentRepository();
        this.hspWards = new HspWardRepository();
        this.hspHospitalBeds = new HspHospitalBedRepository();
        this.hspPatientRegistrations = new HspPatientRegistrationRepository();
        this.hspPatientProfiles = new HspPatientProfileRepository();
        this.hspMedicalHistories = new HspMedicalHistoryRepository();
        this.hspInsurancePolicies = new HspInsurancePolicyRepository();
        this.hspAppointments = new HspAppointmentRepository();
        this.hspOpdVisits = new HspOpdVisitRepository();
        this.hspIpdAdmissions = new HspIpdAdmissionRepository();
        this.hspClinicalNotes = new HspClinicalNoteRepository();
        this.hspPharmacyInventory = new HspPharmacyInventoryRepository();
        this.hspPrescriptions = new HspPrescriptionRepository();
        this.hspLabOrders = new HspLabOrderRepository();
        this.hspLabResults = new HspLabResultRepository();
        this.hspHospitalBilling = new HspHospitalBillingRepository();
        this.hspInsuranceClaims = new HspInsuranceClaimRepository();
        this.hspHospitalInvoices = new HspHospitalInvoiceRepository();
        this.hspHospitalPayments = new HspHospitalPaymentRepository();
        this.hspPatientNotifications = new HspPatientNotificationRepository();
        this.hspMedicalReports = new HspMedicalReportRepository();
        this.hspPatientFeedback = new HspPatientFeedbackRepository();
        this.hspAdmissionsAnalytics = new HspAdmissionsAnalyticsRepository();
        this.hspOccupancyAnalytics = new HspOccupancyAnalyticsRepository();
        this.hspRevenueAnalytics = new HspRevenueAnalyticsRepository();
        this.hspHospitalMetrics = new HspHospitalMetricRepository();
        this.hspHospitalHealth = new HspHospitalHealthRepository();
        this.hspExecutiveKpis = new HspExecutiveKpiRepository();
        this.hspHospitalFailures = new HspHospitalFailureRepository();
        this.hspAuditLogs = new HspAuditLogRepository();`;
    da = da.replace(schCtor, schCtor + "\n" + hspCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("hspHospitalHubs")) {
    ds = ds.replace(
        "    schAuditLogs: databaseAccess.schAuditLogs,",
        `    schAuditLogs: databaseAccess.schAuditLogs,
    hspHospitalHubs: databaseAccess.hspHospitalHubs,
    hspCampuses: databaseAccess.hspCampuses,
    hspDepartments: databaseAccess.hspDepartments,
    hspWards: databaseAccess.hspWards,
    hspHospitalBeds: databaseAccess.hspHospitalBeds,
    hspPatientRegistrations: databaseAccess.hspPatientRegistrations,
    hspPatientProfiles: databaseAccess.hspPatientProfiles,
    hspMedicalHistories: databaseAccess.hspMedicalHistories,
    hspInsurancePolicies: databaseAccess.hspInsurancePolicies,
    hspAppointments: databaseAccess.hspAppointments,
    hspOpdVisits: databaseAccess.hspOpdVisits,
    hspIpdAdmissions: databaseAccess.hspIpdAdmissions,
    hspClinicalNotes: databaseAccess.hspClinicalNotes,
    hspPharmacyInventory: databaseAccess.hspPharmacyInventory,
    hspPrescriptions: databaseAccess.hspPrescriptions,
    hspLabOrders: databaseAccess.hspLabOrders,
    hspLabResults: databaseAccess.hspLabResults,
    hspHospitalBilling: databaseAccess.hspHospitalBilling,
    hspInsuranceClaims: databaseAccess.hspInsuranceClaims,
    hspHospitalInvoices: databaseAccess.hspHospitalInvoices,
    hspHospitalPayments: databaseAccess.hspHospitalPayments,
    hspPatientNotifications: databaseAccess.hspPatientNotifications,
    hspMedicalReports: databaseAccess.hspMedicalReports,
    hspPatientFeedback: databaseAccess.hspPatientFeedback,
    hspAdmissionsAnalytics: databaseAccess.hspAdmissionsAnalytics,
    hspOccupancyAnalytics: databaseAccess.hspOccupancyAnalytics,
    hspRevenueAnalytics: databaseAccess.hspRevenueAnalytics,
    hspHospitalMetrics: databaseAccess.hspHospitalMetrics,
    hspHospitalHealth: databaseAccess.hspHospitalHealth,
    hspExecutiveKpis: databaseAccess.hspExecutiveKpis,
    hspHospitalFailures: databaseAccess.hspHospitalFailures,
    hspAuditLogs: databaseAccess.hspAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for HSP");
