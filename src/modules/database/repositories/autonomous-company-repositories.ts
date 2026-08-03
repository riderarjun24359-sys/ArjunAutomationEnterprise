import type {
    DbAcActivityFeed,
    DbAcApprovalWorkflow,
    DbAcAuditLog,
    DbAcBusinessKpi,
    DbAcCommandPalette,
    DbAcCompanyContext,
    DbAcCompanyTimeline,
    DbAcComplianceDashboard,
    DbAcCrossModuleAutomation,
    DbAcEmergencyWorkflow,
    DbAcEventBusEvent,
    DbAcExecutiveInsight,
    DbAcNotificationCenter,
    DbAcOperationalHealth,
    DbAcPredictiveRecommendation,
    DbAcSecurityGovernance,
    DbAcSystemSearch,
    DbAcWorkerCollaboration,
    DbAcWorkflowOrchestration,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAcRepository<T> extends BaseRepository<T> {
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
}

export class AcCompanyContextRepository extends OrgAcRepository<DbAcCompanyContext> { protected table = "ac_company_contexts"; }
export class AcWorkflowOrchestrationRepository extends OrgAcRepository<DbAcWorkflowOrchestration> { protected table = "ac_workflow_orchestrations"; }
export class AcEventBusEventRepository extends OrgAcRepository<DbAcEventBusEvent> { protected table = "ac_event_bus_events"; }
export class AcWorkerCollaborationRepository extends OrgAcRepository<DbAcWorkerCollaboration> { protected table = "ac_worker_collaborations"; }
export class AcApprovalWorkflowRepository extends OrgAcRepository<DbAcApprovalWorkflow> { protected table = "ac_approval_workflows"; }
export class AcNotificationCenterRepository extends OrgAcRepository<DbAcNotificationCenter> { protected table = "ac_notification_center"; }
export class AcCompanyTimelineRepository extends OrgAcRepository<DbAcCompanyTimeline> { protected table = "ac_company_timeline"; }
export class AcActivityFeedRepository extends OrgAcRepository<DbAcActivityFeed> { protected table = "ac_activity_feed"; }
export class AcCrossModuleAutomationRepository extends OrgAcRepository<DbAcCrossModuleAutomation> { protected table = "ac_cross_module_automations"; }
export class AcExecutiveInsightRepository extends OrgAcRepository<DbAcExecutiveInsight> { protected table = "ac_executive_insights"; }
export class AcPredictiveRecommendationRepository extends OrgAcRepository<DbAcPredictiveRecommendation> { protected table = "ac_predictive_recommendations"; }
export class AcSystemSearchRepository extends OrgAcRepository<DbAcSystemSearch> { protected table = "ac_system_search"; }
export class AcCommandPaletteRepository extends OrgAcRepository<DbAcCommandPalette> { protected table = "ac_command_palette"; }
export class AcEmergencyWorkflowRepository extends OrgAcRepository<DbAcEmergencyWorkflow> { protected table = "ac_emergency_workflows"; }
export class AcBusinessKpiRepository extends OrgAcRepository<DbAcBusinessKpi> { protected table = "ac_business_kpis"; }
export class AcSecurityGovernanceRepository extends OrgAcRepository<DbAcSecurityGovernance> { protected table = "ac_security_governance"; }
export class AcComplianceDashboardRepository extends OrgAcRepository<DbAcComplianceDashboard> { protected table = "ac_compliance_dashboards"; }
export class AcOperationalHealthRepository extends OrgAcRepository<DbAcOperationalHealth> { protected table = "ac_operational_health"; }
export class AcAuditLogRepository extends OrgAcRepository<DbAcAuditLog> { protected table = "ac_audit_logs"; }
