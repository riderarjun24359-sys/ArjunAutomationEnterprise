import {
    buildHospitalHubLookupMaps,
    buildHspAuditPayload,
    buildHspDashboardStats,
    buildHspPipelineInfo,
    mapAuditEntry,
    buildHospitalHubPayload,
    mapHospitalHubSummary,
    buildCampusPayload,
    mapCampusSummary,
    buildDepartmentPayload,
    mapDepartmentSummary,
    buildWardPayload,
    mapWardSummary,
    buildHospitalBedPayload,
    mapHospitalBedSummary,
    buildPatientRegistrationPayload,
    mapPatientRegistrationSummary,
    buildPatientProfilePayload,
    mapPatientProfileSummary,
    buildMedicalHistoryPayload,
    mapMedicalHistorySummary,
    buildInsurancePolicyPayload,
    mapInsurancePolicySummary,
    buildAppointmentPayload,
    mapAppointmentSummary,
    buildOpdVisitPayload,
    mapOpdVisitSummary,
    buildIpdAdmissionPayload,
    mapIpdAdmissionSummary,
    buildClinicalNotePayload,
    mapClinicalNoteSummary,
    buildPharmacyInventoryPayload,
    mapPharmacyInventorySummary,
    buildPrescriptionPayload,
    mapPrescriptionSummary,
    buildLabOrderPayload,
    mapLabOrderSummary,
    buildLabResultPayload,
    mapLabResultSummary,
    buildHospitalBillingPayload,
    mapHospitalBillingSummary,
    buildInsuranceClaimPayload,
    mapInsuranceClaimSummary,
    buildHospitalInvoicePayload,
    mapHospitalInvoiceSummary,
    buildHospitalPaymentPayload,
    mapHospitalPaymentSummary,
    buildPatientNotificationPayload,
    mapPatientNotificationSummary,
    buildMedicalReportPayload,
    mapMedicalReportSummary,
    buildPatientFeedbackPayload,
    mapPatientFeedbackSummary,
    buildAdmissionsAnalyticsPayload,
    mapAdmissionsAnalyticsSummary,
    buildOccupancyAnalyticsPayload,
    mapOccupancyAnalyticsSummary,
    buildRevenueAnalyticsPayload,
    mapRevenueAnalyticsSummary,
    buildHospitalMetricPayload,
    mapHospitalMetricSummary,
    buildHospitalHealthPayload,
    mapHospitalHealthSummary,
    buildExecutiveKpiPayload,
    mapExecutiveKpiSummary,
    buildHospitalFailurePayload,
    mapHospitalFailureSummary,
    mapCampusForStats,
    mapPatientRegistrationForStats,
    mapHospitalMetricForStats,
    mapAppointmentForStats,
    mapHospitalInvoiceForStats,
    mapPharmacyInventoryForStats,
    mapHospitalHealthForStats,
    mapHospitalFailureForStats,
} from "@/src/modules/database/lib/hospital-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import type {
    HospitalHubSummary,
    CreateHospitalHubInput,
    CampusSummary,
    CreateCampusInput,
    DepartmentSummary,
    CreateDepartmentInput,
    WardSummary,
    CreateWardInput,
    HospitalBedSummary,
    CreateHospitalBedInput,
    PatientRegistrationSummary,
    CreatePatientRegistrationInput,
    PatientProfileSummary,
    CreatePatientProfileInput,
    MedicalHistorySummary,
    CreateMedicalHistoryInput,
    InsurancePolicySummary,
    CreateInsurancePolicyInput,
    AppointmentSummary,
    CreateAppointmentInput,
    OpdVisitSummary,
    CreateOpdVisitInput,
    IpdAdmissionSummary,
    CreateIpdAdmissionInput,
    ClinicalNoteSummary,
    CreateClinicalNoteInput,
    PharmacyInventorySummary,
    CreatePharmacyInventoryInput,
    PrescriptionSummary,
    CreatePrescriptionInput,
    LabOrderSummary,
    CreateLabOrderInput,
    LabResultSummary,
    CreateLabResultInput,
    HospitalBillingSummary,
    CreateHospitalBillingInput,
    InsuranceClaimSummary,
    CreateInsuranceClaimInput,
    HospitalInvoiceSummary,
    CreateHospitalInvoiceInput,
    HospitalPaymentSummary,
    CreateHospitalPaymentInput,
    PatientNotificationSummary,
    CreatePatientNotificationInput,
    MedicalReportSummary,
    CreateMedicalReportInput,
    PatientFeedbackSummary,
    CreatePatientFeedbackInput,
    AdmissionsAnalyticsSummary,
    CreateAdmissionsAnalyticsInput,
    OccupancyAnalyticsSummary,
    CreateOccupancyAnalyticsInput,
    RevenueAnalyticsSummary,
    CreateRevenueAnalyticsInput,
    HospitalMetricSummary,
    CreateHospitalMetricInput,
    HospitalHealthSummary,
    CreateHospitalHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    HospitalFailureSummary,
    CreateHospitalFailureInput,
    AuditEntry,
    HspDashboardStats,
    HspPipelineInfo,
    HspSdkRegisterCampusInput,
    HspSdkRegisterCampusResult,
    HspSdkConfigurePatientRegistrationInput,
    HspSdkConfigurePatientRegistrationResult,
    HspSdkRunAppointmentWorkflowInput,
    HspSdkRunAppointmentWorkflowResult,
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
            databaseService.hspPatientRegistrations.listByOrganization(context.organizationId),
            databaseService.hspHospitalMetrics.listByOrganization(context.organizationId),
            databaseService.hspAppointments.listByOrganization(context.organizationId),
            databaseService.hspHospitalInvoices.listByOrganization(context.organizationId),
            databaseService.hspPharmacyInventory.listByOrganization(context.organizationId),
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

    async getHospitalHubs(authUserId: string, email: string, fullName?: string | null): Promise<HospitalHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.hspHospitalHubs.listByOrganization(context.organizationId)).map((r) => mapHospitalHubSummary(r));
    }

    async createHospitalHub(authUserId: string, email: string, input: CreateHospitalHubInput, fullName?: string | null): Promise<HospitalHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalHubs.create(buildHospitalHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalHubs");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_hubs", "create", `HospitalHub created`, created.id));
        return mapHospitalHubSummary(created);
    }

    async getCampuss(authUserId: string, email: string, fullName?: string | null): Promise<CampusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspCampuses.listByOrganization(context.organizationId)).map((r) => mapCampusSummary(r, maps));
    }

    async createCampus(authUserId: string, email: string, input: CreateCampusInput, fullName?: string | null): Promise<CampusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspCampuses.create(buildCampusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create campuses");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "campuses", "create", `Campus created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCampusSummary(created, maps);
    }

    async getDepartments(authUserId: string, email: string, fullName?: string | null): Promise<DepartmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspDepartments.listByOrganization(context.organizationId)).map((r) => mapDepartmentSummary(r, maps));
    }

    async createDepartment(authUserId: string, email: string, input: CreateDepartmentInput, fullName?: string | null): Promise<DepartmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspDepartments.create(buildDepartmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create departments");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "departments", "create", `Department created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDepartmentSummary(created, maps);
    }

    async getWards(authUserId: string, email: string, fullName?: string | null): Promise<WardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspWards.listByOrganization(context.organizationId)).map((r) => mapWardSummary(r, maps));
    }

    async createWard(authUserId: string, email: string, input: CreateWardInput, fullName?: string | null): Promise<WardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspWards.create(buildWardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create wards");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "wards", "create", `Ward created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWardSummary(created, maps);
    }

    async getHospitalBeds(authUserId: string, email: string, fullName?: string | null): Promise<HospitalBedSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspHospitalBeds.listByOrganization(context.organizationId)).map((r) => mapHospitalBedSummary(r, maps));
    }

    async createHospitalBed(authUserId: string, email: string, input: CreateHospitalBedInput, fullName?: string | null): Promise<HospitalBedSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalBeds.create(buildHospitalBedPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalBeds");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_beds", "create", `HospitalBed created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHospitalBedSummary(created, maps);
    }

    async getPatientRegistrations(authUserId: string, email: string, fullName?: string | null): Promise<PatientRegistrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspPatientRegistrations.listByOrganization(context.organizationId)).map((r) => mapPatientRegistrationSummary(r, maps));
    }

    async createPatientRegistration(authUserId: string, email: string, input: CreatePatientRegistrationInput, fullName?: string | null): Promise<PatientRegistrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspPatientRegistrations.create(buildPatientRegistrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create patientRegistrations");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "patient_registrations", "create", `PatientRegistration created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPatientRegistrationSummary(created, maps);
    }

    async getPatientProfiles(authUserId: string, email: string, fullName?: string | null): Promise<PatientProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspPatientProfiles.listByOrganization(context.organizationId)).map((r) => mapPatientProfileSummary(r, maps));
    }

    async createPatientProfile(authUserId: string, email: string, input: CreatePatientProfileInput, fullName?: string | null): Promise<PatientProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspPatientProfiles.create(buildPatientProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create patientProfiles");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "patient_profiles", "create", `PatientProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPatientProfileSummary(created, maps);
    }

    async getMedicalHistorys(authUserId: string, email: string, fullName?: string | null): Promise<MedicalHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspMedicalHistories.listByOrganization(context.organizationId)).map((r) => mapMedicalHistorySummary(r, maps));
    }

    async createMedicalHistory(authUserId: string, email: string, input: CreateMedicalHistoryInput, fullName?: string | null): Promise<MedicalHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspMedicalHistories.create(buildMedicalHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create medicalHistories");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "medical_histories", "create", `MedicalHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMedicalHistorySummary(created, maps);
    }

    async getInsurancePolicys(authUserId: string, email: string, fullName?: string | null): Promise<InsurancePolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspInsurancePolicies.listByOrganization(context.organizationId)).map((r) => mapInsurancePolicySummary(r, maps));
    }

    async createInsurancePolicy(authUserId: string, email: string, input: CreateInsurancePolicyInput, fullName?: string | null): Promise<InsurancePolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspInsurancePolicies.create(buildInsurancePolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create insurancePolicies");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "insurance_policies", "create", `InsurancePolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInsurancePolicySummary(created, maps);
    }

    async getAppointments(authUserId: string, email: string, fullName?: string | null): Promise<AppointmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspAppointments.listByOrganization(context.organizationId)).map((r) => mapAppointmentSummary(r, maps));
    }

    async createAppointment(authUserId: string, email: string, input: CreateAppointmentInput, fullName?: string | null): Promise<AppointmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspAppointments.create(buildAppointmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create appointments");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "appointments", "create", `Appointment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAppointmentSummary(created, maps);
    }

    async getOpdVisits(authUserId: string, email: string, fullName?: string | null): Promise<OpdVisitSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspOpdVisits.listByOrganization(context.organizationId)).map((r) => mapOpdVisitSummary(r, maps));
    }

    async createOpdVisit(authUserId: string, email: string, input: CreateOpdVisitInput, fullName?: string | null): Promise<OpdVisitSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspOpdVisits.create(buildOpdVisitPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create opdVisits");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "opd_visits", "create", `OpdVisit created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOpdVisitSummary(created, maps);
    }

    async getIpdAdmissions(authUserId: string, email: string, fullName?: string | null): Promise<IpdAdmissionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspIpdAdmissions.listByOrganization(context.organizationId)).map((r) => mapIpdAdmissionSummary(r, maps));
    }

    async createIpdAdmission(authUserId: string, email: string, input: CreateIpdAdmissionInput, fullName?: string | null): Promise<IpdAdmissionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspIpdAdmissions.create(buildIpdAdmissionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create ipdAdmissions");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "ipd_admissions", "create", `IpdAdmission created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIpdAdmissionSummary(created, maps);
    }

    async getClinicalNotes(authUserId: string, email: string, fullName?: string | null): Promise<ClinicalNoteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspClinicalNotes.listByOrganization(context.organizationId)).map((r) => mapClinicalNoteSummary(r, maps));
    }

    async createClinicalNote(authUserId: string, email: string, input: CreateClinicalNoteInput, fullName?: string | null): Promise<ClinicalNoteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspClinicalNotes.create(buildClinicalNotePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create clinicalNotes");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "clinical_notes", "create", `ClinicalNote created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapClinicalNoteSummary(created, maps);
    }

    async getPharmacyInventorys(authUserId: string, email: string, fullName?: string | null): Promise<PharmacyInventorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspPharmacyInventory.listByOrganization(context.organizationId)).map((r) => mapPharmacyInventorySummary(r, maps));
    }

    async createPharmacyInventory(authUserId: string, email: string, input: CreatePharmacyInventoryInput, fullName?: string | null): Promise<PharmacyInventorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspPharmacyInventory.create(buildPharmacyInventoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pharmacyInventory");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "pharmacy_inventory", "create", `PharmacyInventory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPharmacyInventorySummary(created, maps);
    }

    async getPrescriptions(authUserId: string, email: string, fullName?: string | null): Promise<PrescriptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspPrescriptions.listByOrganization(context.organizationId)).map((r) => mapPrescriptionSummary(r, maps));
    }

    async createPrescription(authUserId: string, email: string, input: CreatePrescriptionInput, fullName?: string | null): Promise<PrescriptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspPrescriptions.create(buildPrescriptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create prescriptions");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "prescriptions", "create", `Prescription created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPrescriptionSummary(created, maps);
    }

    async getLabOrders(authUserId: string, email: string, fullName?: string | null): Promise<LabOrderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspLabOrders.listByOrganization(context.organizationId)).map((r) => mapLabOrderSummary(r, maps));
    }

    async createLabOrder(authUserId: string, email: string, input: CreateLabOrderInput, fullName?: string | null): Promise<LabOrderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspLabOrders.create(buildLabOrderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create labOrders");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "lab_orders", "create", `LabOrder created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLabOrderSummary(created, maps);
    }

    async getLabResults(authUserId: string, email: string, fullName?: string | null): Promise<LabResultSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspLabResults.listByOrganization(context.organizationId)).map((r) => mapLabResultSummary(r, maps));
    }

    async createLabResult(authUserId: string, email: string, input: CreateLabResultInput, fullName?: string | null): Promise<LabResultSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspLabResults.create(buildLabResultPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create labResults");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "lab_results", "create", `LabResult created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLabResultSummary(created, maps);
    }

    async getHospitalBillings(authUserId: string, email: string, fullName?: string | null): Promise<HospitalBillingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspHospitalBilling.listByOrganization(context.organizationId)).map((r) => mapHospitalBillingSummary(r, maps));
    }

    async createHospitalBilling(authUserId: string, email: string, input: CreateHospitalBillingInput, fullName?: string | null): Promise<HospitalBillingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalBilling.create(buildHospitalBillingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalBilling");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_billing", "create", `HospitalBilling created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHospitalBillingSummary(created, maps);
    }

    async getInsuranceClaims(authUserId: string, email: string, fullName?: string | null): Promise<InsuranceClaimSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspInsuranceClaims.listByOrganization(context.organizationId)).map((r) => mapInsuranceClaimSummary(r, maps));
    }

    async createInsuranceClaim(authUserId: string, email: string, input: CreateInsuranceClaimInput, fullName?: string | null): Promise<InsuranceClaimSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspInsuranceClaims.create(buildInsuranceClaimPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create insuranceClaims");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "insurance_claims", "create", `InsuranceClaim created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInsuranceClaimSummary(created, maps);
    }

    async getHospitalInvoices(authUserId: string, email: string, fullName?: string | null): Promise<HospitalInvoiceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspHospitalInvoices.listByOrganization(context.organizationId)).map((r) => mapHospitalInvoiceSummary(r, maps));
    }

    async createHospitalInvoice(authUserId: string, email: string, input: CreateHospitalInvoiceInput, fullName?: string | null): Promise<HospitalInvoiceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalInvoices.create(buildHospitalInvoicePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalInvoices");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_invoices", "create", `HospitalInvoice created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHospitalInvoiceSummary(created, maps);
    }

    async getHospitalPayments(authUserId: string, email: string, fullName?: string | null): Promise<HospitalPaymentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspHospitalPayments.listByOrganization(context.organizationId)).map((r) => mapHospitalPaymentSummary(r, maps));
    }

    async createHospitalPayment(authUserId: string, email: string, input: CreateHospitalPaymentInput, fullName?: string | null): Promise<HospitalPaymentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalPayments.create(buildHospitalPaymentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalPayments");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_payments", "create", `HospitalPayment created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHospitalPaymentSummary(created, maps);
    }

    async getPatientNotifications(authUserId: string, email: string, fullName?: string | null): Promise<PatientNotificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspPatientNotifications.listByOrganization(context.organizationId)).map((r) => mapPatientNotificationSummary(r, maps));
    }

    async createPatientNotification(authUserId: string, email: string, input: CreatePatientNotificationInput, fullName?: string | null): Promise<PatientNotificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspPatientNotifications.create(buildPatientNotificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create patientNotifications");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "patient_notifications", "create", `PatientNotification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPatientNotificationSummary(created, maps);
    }

    async getMedicalReports(authUserId: string, email: string, fullName?: string | null): Promise<MedicalReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspMedicalReports.listByOrganization(context.organizationId)).map((r) => mapMedicalReportSummary(r, maps));
    }

    async createMedicalReport(authUserId: string, email: string, input: CreateMedicalReportInput, fullName?: string | null): Promise<MedicalReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspMedicalReports.create(buildMedicalReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create medicalReports");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "medical_reports", "create", `MedicalReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMedicalReportSummary(created, maps);
    }

    async getPatientFeedbacks(authUserId: string, email: string, fullName?: string | null): Promise<PatientFeedbackSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspPatientFeedback.listByOrganization(context.organizationId)).map((r) => mapPatientFeedbackSummary(r, maps));
    }

    async createPatientFeedback(authUserId: string, email: string, input: CreatePatientFeedbackInput, fullName?: string | null): Promise<PatientFeedbackSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspPatientFeedback.create(buildPatientFeedbackPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create patientFeedback");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "patient_feedback", "create", `PatientFeedback created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPatientFeedbackSummary(created, maps);
    }

    async getAdmissionsAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<AdmissionsAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspAdmissionsAnalytics.listByOrganization(context.organizationId)).map((r) => mapAdmissionsAnalyticsSummary(r, maps));
    }

    async createAdmissionsAnalytics(authUserId: string, email: string, input: CreateAdmissionsAnalyticsInput, fullName?: string | null): Promise<AdmissionsAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspAdmissionsAnalytics.create(buildAdmissionsAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create patientRegistrationsAnalytics");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "patient_registrations_analytics", "create", `AdmissionsAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAdmissionsAnalyticsSummary(created, maps);
    }

    async getOccupancyAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<OccupancyAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspOccupancyAnalytics.listByOrganization(context.organizationId)).map((r) => mapOccupancyAnalyticsSummary(r, maps));
    }

    async createOccupancyAnalytics(authUserId: string, email: string, input: CreateOccupancyAnalyticsInput, fullName?: string | null): Promise<OccupancyAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspOccupancyAnalytics.create(buildOccupancyAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create occupancyAnalytics");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "occupancy_analytics", "create", `OccupancyAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOccupancyAnalyticsSummary(created, maps);
    }

    async getRevenueAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<RevenueAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspRevenueAnalytics.listByOrganization(context.organizationId)).map((r) => mapRevenueAnalyticsSummary(r, maps));
    }

    async createRevenueAnalytics(authUserId: string, email: string, input: CreateRevenueAnalyticsInput, fullName?: string | null): Promise<RevenueAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspRevenueAnalytics.create(buildRevenueAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create revenueAnalytics");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "revenue_analytics", "create", `RevenueAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRevenueAnalyticsSummary(created, maps);
    }

    async getHospitalMetrics(authUserId: string, email: string, fullName?: string | null): Promise<HospitalMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.hspHospitalMetrics.listByOrganization(context.organizationId)).map(mapHospitalMetricSummary);
    }

    async createHospitalMetric(authUserId: string, email: string, input: CreateHospitalMetricInput, fullName?: string | null): Promise<HospitalMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalMetrics.create(buildHospitalMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalMetrics");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_metrics", "create", `HospitalMetric created`, created.id));
        return mapHospitalMetricSummary(created);
    }

    async getHospitalHealths(authUserId: string, email: string, fullName?: string | null): Promise<HospitalHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.hspHospitalHealth.listByOrganization(context.organizationId)).map(mapHospitalHealthSummary);
    }

    async createHospitalHealth(authUserId: string, email: string, input: CreateHospitalHealthInput, fullName?: string | null): Promise<HospitalHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalHealth.create(buildHospitalHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalHealth");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_health", "create", `HospitalHealth created`, created.id));
        return mapHospitalHealthSummary(created);
    }

    async getExecutiveKpis(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspExecutiveKpis.listByOrganization(context.organizationId)).map((r) => mapExecutiveKpiSummary(r, maps));
    }

    async createExecutiveKpi(authUserId: string, email: string, input: CreateExecutiveKpiInput, fullName?: string | null): Promise<ExecutiveKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspExecutiveKpis.create(buildExecutiveKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveKpis");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "executive_kpis", "create", `ExecutiveKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveKpiSummary(created, maps);
    }

    async getHospitalFailures(authUserId: string, email: string, fullName?: string | null): Promise<HospitalFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.hspHospitalFailures.listByOrganization(context.organizationId)).map((r) => mapHospitalFailureSummary(r, maps));
    }

    async createHospitalFailure(authUserId: string, email: string, input: CreateHospitalFailureInput, fullName?: string | null): Promise<HospitalFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.hspHospitalFailures.create(buildHospitalFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create hospitalFailures");
        await databaseService.hspAuditLogs.create(buildHspAuditPayload(context.organizationId, "hospital_failures", "create", `HospitalFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHospitalFailureSummary(created, maps);
    }

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

    async sdkRegisterCampus(authUserId: string, email: string, input: HspSdkRegisterCampusInput, fullName?: string | null): Promise<HspSdkRegisterCampusResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const created = await this.createCampus(authUserId, email, { hospitalHubId: input.hospitalHubId, campusKey: input.campusKey, campusName: input.campusName }, fullName);
        return { campusId: created.id, campusKey: created.campusKey, status: created.status };
    }

    async sdkConfigurePatientRegistration(authUserId: string, email: string, input: HspSdkConfigurePatientRegistrationInput, fullName?: string | null): Promise<HspSdkConfigurePatientRegistrationResult> {
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const created = await this.createPatientRegistration(authUserId, email, { hospitalHubId: input.hospitalHubId, registrationKey: input.registrationKey, registrationName: input.registrationName }, fullName);
        return { registrationId: created.id, registrationKey: created.registrationKey, status: created.status };
    }

    async sdkRunAppointmentWorkflow(authUserId: string, email: string, input: HspSdkRunAppointmentWorkflowInput, fullName?: string | null): Promise<HspSdkRunAppointmentWorkflowResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createAppointment(authUserId, email, { hospitalHubId: input.hospitalHubId, appointmentKey: input.appointmentKey, appointmentName: input.appointmentName }, fullName);
        return { appointmentId: created.id, appointmentKey: created.appointmentKey, status: created.status };
    }
}

export const hospitalService = new HospitalService();
