import type {
    DbEgpGovernanceHub,
    DbEgpOrganizationGovernance,
    DbEgpGovernancePolicy,
    DbEgpGovernanceFramework,
    DbEgpGovernanceReview,
    DbEgpGovernanceDashboard,
    DbEgpComplianceFramework,
    DbEgpComplianceControl,
    DbEgpComplianceEvidence,
    DbEgpComplianceReport,
    DbEgpComplianceCalendar,
    DbEgpAuditCenter,
    DbEgpAuditFinding,
    DbEgpCorrectiveAction,
    DbEgpAuditEvidence,
    DbEgpAuditAnalytics,
    DbEgpDataClassification,
    DbEgpRetentionPolicy,
    DbEgpDataLifecycle,
    DbEgpDataOwnership,
    DbEgpDataQuality,
    DbEgpRiskRegister,
    DbEgpRiskAssessment,
    DbEgpRiskMitigation,
    DbEgpRiskMonitoring,
    DbEgpBusinessContinuity,
    DbEgpGovernanceMetric,
    DbEgpGovernanceHealth,
    DbEgpComplianceDashboard,
    DbEgpMissionProgress,
    DbEgpGovernanceFailure,
    DbEgpAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgEgpRepository<T> extends BaseRepository<T> {
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

export class EgpGovernanceHubRepository extends OrgEgpRepository<DbEgpGovernanceHub> { protected table = "egp_governance_hubs"; }
export class EgpOrganizationGovernanceRepository extends OrgEgpRepository<DbEgpOrganizationGovernance> { protected table = "egp_organization_governance"; }
export class EgpGovernancePolicyRepository extends OrgEgpRepository<DbEgpGovernancePolicy> { protected table = "egp_governance_policies"; }
export class EgpGovernanceFrameworkRepository extends OrgEgpRepository<DbEgpGovernanceFramework> { protected table = "egp_governance_framework"; }
export class EgpGovernanceReviewRepository extends OrgEgpRepository<DbEgpGovernanceReview> { protected table = "egp_governance_reviews"; }
export class EgpGovernanceDashboardRepository extends OrgEgpRepository<DbEgpGovernanceDashboard> { protected table = "egp_governance_dashboards"; }
export class EgpComplianceFrameworkRepository extends OrgEgpRepository<DbEgpComplianceFramework> { protected table = "egp_compliance_framework"; }
export class EgpComplianceControlRepository extends OrgEgpRepository<DbEgpComplianceControl> { protected table = "egp_compliance_controls"; }
export class EgpComplianceEvidenceRepository extends OrgEgpRepository<DbEgpComplianceEvidence> { protected table = "egp_compliance_evidence"; }
export class EgpComplianceReportRepository extends OrgEgpRepository<DbEgpComplianceReport> { protected table = "egp_compliance_reports"; }
export class EgpComplianceCalendarRepository extends OrgEgpRepository<DbEgpComplianceCalendar> { protected table = "egp_compliance_calendar"; }
export class EgpAuditCenterRepository extends OrgEgpRepository<DbEgpAuditCenter> { protected table = "egp_audit_center"; }
export class EgpAuditFindingRepository extends OrgEgpRepository<DbEgpAuditFinding> { protected table = "egp_audit_findings"; }
export class EgpCorrectiveActionRepository extends OrgEgpRepository<DbEgpCorrectiveAction> { protected table = "egp_corrective_actions"; }
export class EgpAuditEvidenceRepository extends OrgEgpRepository<DbEgpAuditEvidence> { protected table = "egp_audit_evidence"; }
export class EgpAuditAnalyticsRepository extends OrgEgpRepository<DbEgpAuditAnalytics> { protected table = "egp_audit_analytics"; }
export class EgpDataClassificationRepository extends OrgEgpRepository<DbEgpDataClassification> { protected table = "egp_data_classification"; }
export class EgpRetentionPolicyRepository extends OrgEgpRepository<DbEgpRetentionPolicy> { protected table = "egp_retention_policies"; }
export class EgpDataLifecycleRepository extends OrgEgpRepository<DbEgpDataLifecycle> { protected table = "egp_data_lifecycle"; }
export class EgpDataOwnershipRepository extends OrgEgpRepository<DbEgpDataOwnership> { protected table = "egp_data_ownership"; }
export class EgpDataQualityRepository extends OrgEgpRepository<DbEgpDataQuality> { protected table = "egp_data_quality"; }
export class EgpRiskRegisterRepository extends OrgEgpRepository<DbEgpRiskRegister> { protected table = "egp_risk_register"; }
export class EgpRiskAssessmentRepository extends OrgEgpRepository<DbEgpRiskAssessment> { protected table = "egp_risk_assessment"; }
export class EgpRiskMitigationRepository extends OrgEgpRepository<DbEgpRiskMitigation> { protected table = "egp_risk_mitigation"; }
export class EgpRiskMonitoringRepository extends OrgEgpRepository<DbEgpRiskMonitoring> { protected table = "egp_risk_monitoring"; }
export class EgpBusinessContinuityRepository extends OrgEgpRepository<DbEgpBusinessContinuity> { protected table = "egp_business_continuity"; }
export class EgpGovernanceMetricRepository extends OrgEgpRepository<DbEgpGovernanceMetric> { protected table = "egp_governance_metrics"; }
export class EgpGovernanceHealthRepository extends OrgEgpRepository<DbEgpGovernanceHealth> { protected table = "egp_governance_health"; }
export class EgpComplianceDashboardRepository extends OrgEgpRepository<DbEgpComplianceDashboard> { protected table = "egp_compliance_dashboards"; }
export class EgpMissionProgressRepository extends OrgEgpRepository<DbEgpMissionProgress> { protected table = "egp_mission_progress"; }
export class EgpGovernanceFailureRepository extends OrgEgpRepository<DbEgpGovernanceFailure> { protected table = "egp_governance_failures"; }
export class EgpAuditLogRepository extends OrgEgpRepository<DbEgpAuditLog> { protected table = "egp_audit_logs"; }
