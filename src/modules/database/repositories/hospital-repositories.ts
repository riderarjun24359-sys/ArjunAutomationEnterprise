import type {
    DbHspHospitalHub,
    DbHspCampus,
    DbHspDepartment,
    DbHspWard,
    DbHspHospitalBed,
    DbHspPatientRegistration,
    DbHspPatientProfile,
    DbHspMedicalHistory,
    DbHspInsurancePolicy,
    DbHspAppointment,
    DbHspOpdVisit,
    DbHspIpdAdmission,
    DbHspClinicalNote,
    DbHspPharmacyInventory,
    DbHspPrescription,
    DbHspLabOrder,
    DbHspLabResult,
    DbHspHospitalBilling,
    DbHspInsuranceClaim,
    DbHspHospitalInvoice,
    DbHspHospitalPayment,
    DbHspPatientNotification,
    DbHspMedicalReport,
    DbHspPatientFeedback,
    DbHspAdmissionsAnalytics,
    DbHspOccupancyAnalytics,
    DbHspRevenueAnalytics,
    DbHspHospitalMetric,
    DbHspHospitalHealth,
    DbHspExecutiveKpi,
    DbHspHospitalFailure,
    DbHspAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgHspRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class HspHospitalHubRepository extends OrgHspRepository<DbHspHospitalHub> { protected table = "hsp_hospital_hubs"; }
export class HspCampusRepository extends OrgHspRepository<DbHspCampus> { protected table = "hsp_campuses"; }
export class HspDepartmentRepository extends OrgHspRepository<DbHspDepartment> { protected table = "hsp_departments"; }
export class HspWardRepository extends OrgHspRepository<DbHspWard> { protected table = "hsp_wards"; }
export class HspHospitalBedRepository extends OrgHspRepository<DbHspHospitalBed> { protected table = "hsp_hospital_beds"; }
export class HspPatientRegistrationRepository extends OrgHspRepository<DbHspPatientRegistration> { protected table = "hsp_patient_registrations"; }
export class HspPatientProfileRepository extends OrgHspRepository<DbHspPatientProfile> { protected table = "hsp_patient_profiles"; }
export class HspMedicalHistoryRepository extends OrgHspRepository<DbHspMedicalHistory> { protected table = "hsp_medical_histories"; }
export class HspInsurancePolicyRepository extends OrgHspRepository<DbHspInsurancePolicy> { protected table = "hsp_insurance_policies"; }
export class HspAppointmentRepository extends OrgHspRepository<DbHspAppointment> { protected table = "hsp_appointments"; }
export class HspOpdVisitRepository extends OrgHspRepository<DbHspOpdVisit> { protected table = "hsp_opd_visits"; }
export class HspIpdAdmissionRepository extends OrgHspRepository<DbHspIpdAdmission> { protected table = "hsp_ipd_admissions"; }
export class HspClinicalNoteRepository extends OrgHspRepository<DbHspClinicalNote> { protected table = "hsp_clinical_notes"; }
export class HspPharmacyInventoryRepository extends OrgHspRepository<DbHspPharmacyInventory> { protected table = "hsp_pharmacy_inventory"; }
export class HspPrescriptionRepository extends OrgHspRepository<DbHspPrescription> { protected table = "hsp_prescriptions"; }
export class HspLabOrderRepository extends OrgHspRepository<DbHspLabOrder> { protected table = "hsp_lab_orders"; }
export class HspLabResultRepository extends OrgHspRepository<DbHspLabResult> { protected table = "hsp_lab_results"; }
export class HspHospitalBillingRepository extends OrgHspRepository<DbHspHospitalBilling> { protected table = "hsp_hospital_billing"; }
export class HspInsuranceClaimRepository extends OrgHspRepository<DbHspInsuranceClaim> { protected table = "hsp_insurance_claims"; }
export class HspHospitalInvoiceRepository extends OrgHspRepository<DbHspHospitalInvoice> { protected table = "hsp_hospital_invoices"; }
export class HspHospitalPaymentRepository extends OrgHspRepository<DbHspHospitalPayment> { protected table = "hsp_hospital_payments"; }
export class HspPatientNotificationRepository extends OrgHspRepository<DbHspPatientNotification> { protected table = "hsp_patient_notifications"; }
export class HspMedicalReportRepository extends OrgHspRepository<DbHspMedicalReport> { protected table = "hsp_medical_reports"; }
export class HspPatientFeedbackRepository extends OrgHspRepository<DbHspPatientFeedback> { protected table = "hsp_patient_feedback"; }
export class HspAdmissionsAnalyticsRepository extends OrgHspRepository<DbHspAdmissionsAnalytics> { protected table = "hsp_admissions_analytics"; }
export class HspOccupancyAnalyticsRepository extends OrgHspRepository<DbHspOccupancyAnalytics> { protected table = "hsp_occupancy_analytics"; }
export class HspRevenueAnalyticsRepository extends OrgHspRepository<DbHspRevenueAnalytics> { protected table = "hsp_revenue_analytics"; }
export class HspHospitalMetricRepository extends OrgHspRepository<DbHspHospitalMetric> { protected table = "hsp_hospital_metrics"; }
export class HspHospitalHealthRepository extends OrgHspRepository<DbHspHospitalHealth> { protected table = "hsp_hospital_health"; }
export class HspExecutiveKpiRepository extends OrgHspRepository<DbHspExecutiveKpi> { protected table = "hsp_executive_kpis"; }
export class HspHospitalFailureRepository extends OrgHspRepository<DbHspHospitalFailure> { protected table = "hsp_hospital_failures"; }
export class HspAuditLogRepository extends OrgHspRepository<DbHspAuditLog> { protected table = "hsp_audit_logs"; }
