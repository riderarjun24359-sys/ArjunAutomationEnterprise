import type {
    DbSchSchoolHub,
    DbSchCampus,
    DbSchBuilding,
    DbSchClassroom,
    DbSchAcademicYear,
    DbSchAdmission,
    DbSchStudentProfile,
    DbSchParentProfile,
    DbSchEnrollment,
    DbSchSubject,
    DbSchTimetable,
    DbSchExamination,
    DbSchReportCard,
    DbSchTeacher,
    DbSchStaffAttendance,
    DbSchLeaveRequest,
    DbSchSubstituteTeacher,
    DbSchFeeStructure,
    DbSchFeeInvoice,
    DbSchFeePayment,
    DbSchScholarship,
    DbSchAnnouncement,
    DbSchMessaging,
    DbSchEvent,
    DbSchAdmissionsAnalytics,
    DbSchAttendanceAnalytics,
    DbSchAcademicAnalytics,
    DbSchSchoolMetric,
    DbSchSchoolHealth,
    DbSchExecutiveKpi,
    DbSchSchoolFailure,
    DbSchAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgSchRepository<T> extends BaseRepository<T> {
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

export class SchSchoolHubRepository extends OrgSchRepository<DbSchSchoolHub> { protected table = "sch_school_hubs"; }
export class SchCampusRepository extends OrgSchRepository<DbSchCampus> { protected table = "sch_campuses"; }
export class SchBuildingRepository extends OrgSchRepository<DbSchBuilding> { protected table = "sch_buildings"; }
export class SchClassroomRepository extends OrgSchRepository<DbSchClassroom> { protected table = "sch_classrooms"; }
export class SchAcademicYearRepository extends OrgSchRepository<DbSchAcademicYear> { protected table = "sch_academic_years"; }
export class SchAdmissionRepository extends OrgSchRepository<DbSchAdmission> { protected table = "sch_admissions"; }
export class SchStudentProfileRepository extends OrgSchRepository<DbSchStudentProfile> { protected table = "sch_student_profiles"; }
export class SchParentProfileRepository extends OrgSchRepository<DbSchParentProfile> { protected table = "sch_parent_profiles"; }
export class SchEnrollmentRepository extends OrgSchRepository<DbSchEnrollment> { protected table = "sch_enrollments"; }
export class SchSubjectRepository extends OrgSchRepository<DbSchSubject> { protected table = "sch_subjects"; }
export class SchTimetableRepository extends OrgSchRepository<DbSchTimetable> { protected table = "sch_timetables"; }
export class SchExaminationRepository extends OrgSchRepository<DbSchExamination> { protected table = "sch_examinations"; }
export class SchReportCardRepository extends OrgSchRepository<DbSchReportCard> { protected table = "sch_report_cards"; }
export class SchTeacherRepository extends OrgSchRepository<DbSchTeacher> { protected table = "sch_teachers"; }
export class SchStaffAttendanceRepository extends OrgSchRepository<DbSchStaffAttendance> { protected table = "sch_staff_attendance"; }
export class SchLeaveRequestRepository extends OrgSchRepository<DbSchLeaveRequest> { protected table = "sch_leave_requests"; }
export class SchSubstituteTeacherRepository extends OrgSchRepository<DbSchSubstituteTeacher> { protected table = "sch_substitute_teachers"; }
export class SchFeeStructureRepository extends OrgSchRepository<DbSchFeeStructure> { protected table = "sch_fee_structures"; }
export class SchFeeInvoiceRepository extends OrgSchRepository<DbSchFeeInvoice> { protected table = "sch_fee_invoices"; }
export class SchFeePaymentRepository extends OrgSchRepository<DbSchFeePayment> { protected table = "sch_fee_payments"; }
export class SchScholarshipRepository extends OrgSchRepository<DbSchScholarship> { protected table = "sch_scholarships"; }
export class SchAnnouncementRepository extends OrgSchRepository<DbSchAnnouncement> { protected table = "sch_announcements"; }
export class SchMessagingRepository extends OrgSchRepository<DbSchMessaging> { protected table = "sch_messaging"; }
export class SchEventRepository extends OrgSchRepository<DbSchEvent> { protected table = "sch_events"; }
export class SchAdmissionsAnalyticsRepository extends OrgSchRepository<DbSchAdmissionsAnalytics> { protected table = "sch_admissions_analytics"; }
export class SchAttendanceAnalyticsRepository extends OrgSchRepository<DbSchAttendanceAnalytics> { protected table = "sch_attendance_analytics"; }
export class SchAcademicAnalyticsRepository extends OrgSchRepository<DbSchAcademicAnalytics> { protected table = "sch_academic_analytics"; }
export class SchSchoolMetricRepository extends OrgSchRepository<DbSchSchoolMetric> { protected table = "sch_school_metrics"; }
export class SchSchoolHealthRepository extends OrgSchRepository<DbSchSchoolHealth> { protected table = "sch_school_health"; }
export class SchExecutiveKpiRepository extends OrgSchRepository<DbSchExecutiveKpi> { protected table = "sch_executive_kpis"; }
export class SchSchoolFailureRepository extends OrgSchRepository<DbSchSchoolFailure> { protected table = "sch_school_failures"; }
export class SchAuditLogRepository extends OrgSchRepository<DbSchAuditLog> { protected table = "sch_audit_logs"; }
