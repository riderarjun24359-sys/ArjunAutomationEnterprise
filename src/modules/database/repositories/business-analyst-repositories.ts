import type {
    DbBaAcceptanceCriterion,
    DbBaAuditLog,
    DbBaBrd,
    DbBaCostEstimate,
    DbBaEngagement,
    DbBaFeaturePriority,
    DbBaFrsDocument,
    DbBaGapAnalysis,
    DbBaInterview,
    DbBaProcessMap,
    DbBaProposal,
    DbBaRequirementVersion,
    DbBaReviewApproval,
    DbBaRisk,
    DbBaScopeItem,
    DbBaStakeholder,
    DbBaTimelineEstimate,
    DbBaUserStory,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgBaRepository<T> extends BaseRepository<T> {
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

export class BaEngagementRepository extends OrgBaRepository<DbBaEngagement> { protected table = "ba_engagements"; }
export class BaInterviewRepository extends OrgBaRepository<DbBaInterview> { protected table = "ba_interviews"; }
export class BaBrdRepository extends OrgBaRepository<DbBaBrd> { protected table = "ba_brds"; }
export class BaFrsDocumentRepository extends OrgBaRepository<DbBaFrsDocument> { protected table = "ba_frs_documents"; }
export class BaUserStoryRepository extends OrgBaRepository<DbBaUserStory> { protected table = "ba_user_stories"; }
export class BaAcceptanceCriterionRepository extends OrgBaRepository<DbBaAcceptanceCriterion> { protected table = "ba_acceptance_criteria"; }
export class BaProcessMapRepository extends OrgBaRepository<DbBaProcessMap> { protected table = "ba_process_maps"; }
export class BaGapAnalysisRepository extends OrgBaRepository<DbBaGapAnalysis> { protected table = "ba_gap_analyses"; }
export class BaFeaturePriorityRepository extends OrgBaRepository<DbBaFeaturePriority> { protected table = "ba_feature_priorities"; }
export class BaRiskRepository extends OrgBaRepository<DbBaRisk> { protected table = "ba_risks"; }
export class BaStakeholderRepository extends OrgBaRepository<DbBaStakeholder> { protected table = "ba_stakeholders"; }
export class BaScopeItemRepository extends OrgBaRepository<DbBaScopeItem> { protected table = "ba_scope_items"; }
export class BaProposalRepository extends OrgBaRepository<DbBaProposal> { protected table = "ba_proposals"; }
export class BaCostEstimateRepository extends OrgBaRepository<DbBaCostEstimate> { protected table = "ba_cost_estimates"; }
export class BaTimelineEstimateRepository extends OrgBaRepository<DbBaTimelineEstimate> { protected table = "ba_timeline_estimates"; }
export class BaRequirementVersionRepository extends OrgBaRepository<DbBaRequirementVersion> { protected table = "ba_requirement_versions"; }
export class BaReviewApprovalRepository extends OrgBaRepository<DbBaReviewApproval> { protected table = "ba_review_approvals"; }
export class BaAuditLogRepository extends OrgBaRepository<DbBaAuditLog> { protected table = "ba_audit_logs"; }
