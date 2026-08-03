import {
    buildAcceptanceCriterionPayload,
    buildBaAuditPayload,
    buildBaDashboardStats,
    buildBaPipelineInfo,
    buildBrdPayload,
    buildCostEstimatePayload,
    buildEngagementPayload,
    buildFeaturePriorityPayload,
    buildFrsPayload,
    buildGapAnalysisPayload,
    buildInterviewPayload,
    buildLookupMaps,
    buildProcessMapPayload,
    buildProposalPayload,
    buildReviewApprovalPayload,
    buildRiskPayload,
    buildScopeItemPayload,
    buildStakeholderPayload,
    buildTimelineEstimatePayload,
    buildUserStoryPayload,
    buildVersionPayload,
    mapAcceptanceCriterionSummary,
    mapAuditEntry,
    mapBrdSummary,
    mapCostEstimateSummary,
    mapEngagementSummary,
    mapFeaturePrioritySummary,
    mapFrsSummary,
    mapGapAnalysisSummary,
    mapInterviewSummary,
    mapProcessMapSummary,
    mapProposalSummary,
    mapReviewApprovalSummary,
    mapRiskSummary,
    mapScopeItemSummary,
    mapStakeholderSummary,
    mapTimelineEstimateSummary,
    mapUserStorySummary,
    mapVersionSummary,
} from "@/src/modules/database/lib/business-analyst-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AcceptanceCriterionSummary,
    AuditEntry,
    BaDashboardStats,
    BaPipelineInfo,
    BaSdkGenerateArtifactInput,
    BaSdkGenerateArtifactResult,
    BaSdkRunAnalysisInput,
    BaSdkRunAnalysisResult,
    BaSdkStartEngagementInput,
    BaSdkStartEngagementResult,
    BrdSummary,
    CostEstimateSummary,
    CreateAcceptanceCriterionInput,
    CreateBrdInput,
    CreateCostEstimateInput,
    CreateEngagementInput,
    CreateFeaturePriorityInput,
    CreateFrsInput,
    CreateGapAnalysisInput,
    CreateInterviewInput,
    CreateProcessMapInput,
    CreateProposalInput,
    CreateReviewApprovalInput,
    CreateRiskInput,
    CreateScopeItemInput,
    CreateStakeholderInput,
    CreateTimelineEstimateInput,
    CreateUserStoryInput,
    CreateVersionInput,
    EngagementSummary,
    FeaturePrioritySummary,
    FrsSummary,
    GapAnalysisSummary,
    InterviewSummary,
    ProcessMapSummary,
    ProposalSummary,
    ReviewApprovalSummary,
    RiskSummary,
    ScopeItemSummary,
    StakeholderSummary,
    TimelineEstimateSummary,
    UserStorySummary,
    VersionSummary,
} from "@/src/modules/business-analyst/types";

export class BusinessAnalystService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [engagements, clients, projects, agents, sessions, employees, userStories] = await Promise.all([
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
            databaseService.baUserStories.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(engagements, clients, projects, agents, sessions, employees, userStories);
    }

    async getEngagements(authUserId: string, email: string, fullName?: string | null): Promise<EngagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => mapEngagementSummary(e, maps));
    }

    async createEngagement(authUserId: string, email: string, input: CreateEngagementInput, fullName?: string | null): Promise<EngagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baEngagements.create(buildEngagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagement");
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "engagement", "create", `Engagement ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementSummary(created, maps);
    }

    async getInterviews(authUserId: string, email: string, fullName?: string | null): Promise<InterviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baInterviews.listByOrganization(context.organizationId)).map((r) => mapInterviewSummary(r, maps));
    }

    async createInterview(authUserId: string, email: string, input: CreateInterviewInput, fullName?: string | null): Promise<InterviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baInterviews.create(buildInterviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create interview");
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "interview", "create", `Interview ${created.interview_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInterviewSummary(created, maps);
    }

    async getBrds(authUserId: string, email: string, fullName?: string | null): Promise<BrdSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baBrds.listByOrganization(context.organizationId)).map((r) => mapBrdSummary(r, maps));
    }

    async createBrd(authUserId: string, email: string, input: CreateBrdInput, fullName?: string | null): Promise<BrdSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baBrds.create(buildBrdPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create BRD");
        await databaseService.baRequirementVersions.create(buildVersionPayload(context.organizationId, { engagementId: input.engagementId, entityType: "brd", entityId: created.id, content: created.content, changeSummary: "Initial BRD version" }, 1));
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "brd", "create", `BRD ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrdSummary(created, maps);
    }

    async getFrsDocuments(authUserId: string, email: string, fullName?: string | null): Promise<FrsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baFrsDocuments.listByOrganization(context.organizationId)).map((r) => mapFrsSummary(r, maps));
    }

    async createFrs(authUserId: string, email: string, input: CreateFrsInput, fullName?: string | null): Promise<FrsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baFrsDocuments.create(buildFrsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create FRS");
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "frs", "create", `FRS ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFrsSummary(created, maps);
    }

    async getUserStories(authUserId: string, email: string, fullName?: string | null): Promise<UserStorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baUserStories.listByOrganization(context.organizationId)).map((r) => mapUserStorySummary(r, maps));
    }

    async createUserStory(authUserId: string, email: string, input: CreateUserStoryInput, fullName?: string | null): Promise<UserStorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baUserStories.create(buildUserStoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create user story");
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "user_story", "create", `User story ${created.story_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUserStorySummary(created, maps);
    }

    async getAcceptanceCriteria(authUserId: string, email: string, fullName?: string | null): Promise<AcceptanceCriterionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baAcceptanceCriteria.listByOrganization(context.organizationId)).map((r) => mapAcceptanceCriterionSummary(r, maps));
    }

    async createAcceptanceCriterion(authUserId: string, email: string, input: CreateAcceptanceCriterionInput, fullName?: string | null): Promise<AcceptanceCriterionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baAcceptanceCriteria.create(buildAcceptanceCriterionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create acceptance criterion");
        const maps = await this.getMaps(context.organizationId);
        return mapAcceptanceCriterionSummary(created, maps);
    }

    async getProcessMaps(authUserId: string, email: string, fullName?: string | null): Promise<ProcessMapSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baProcessMaps.listByOrganization(context.organizationId)).map((r) => mapProcessMapSummary(r, maps));
    }

    async createProcessMap(authUserId: string, email: string, input: CreateProcessMapInput, fullName?: string | null): Promise<ProcessMapSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baProcessMaps.create(buildProcessMapPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create process map");
        const maps = await this.getMaps(context.organizationId);
        return mapProcessMapSummary(created, maps);
    }

    async getGapAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<GapAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baGapAnalyses.listByOrganization(context.organizationId)).map((r) => mapGapAnalysisSummary(r, maps));
    }

    async createGapAnalysis(authUserId: string, email: string, input: CreateGapAnalysisInput, fullName?: string | null): Promise<GapAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baGapAnalyses.create(buildGapAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create gap analysis");
        const maps = await this.getMaps(context.organizationId);
        return mapGapAnalysisSummary(created, maps);
    }

    async getFeaturePriorities(authUserId: string, email: string, fullName?: string | null): Promise<FeaturePrioritySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baFeaturePriorities.listByOrganization(context.organizationId, { orderBy: "priority_rank", orderDirection: "asc" })).map((r) => mapFeaturePrioritySummary(r, maps));
    }

    async createFeaturePriority(authUserId: string, email: string, input: CreateFeaturePriorityInput, fullName?: string | null): Promise<FeaturePrioritySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = await databaseService.baFeaturePriorities.listByOrganization(context.organizationId);
        const rank = existing.length + 1;
        const created = await databaseService.baFeaturePriorities.create(buildFeaturePriorityPayload(context.organizationId, input, rank));
        if (!created) throw new Error("Failed to create feature priority");
        const maps = await this.getMaps(context.organizationId);
        return mapFeaturePrioritySummary(created, maps);
    }

    async getRisks(authUserId: string, email: string, fullName?: string | null): Promise<RiskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baRisks.listByOrganization(context.organizationId)).map((r) => mapRiskSummary(r, maps));
    }

    async createRisk(authUserId: string, email: string, input: CreateRiskInput, fullName?: string | null): Promise<RiskSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baRisks.create(buildRiskPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create risk");
        const maps = await this.getMaps(context.organizationId);
        return mapRiskSummary(created, maps);
    }

    async getStakeholders(authUserId: string, email: string, fullName?: string | null): Promise<StakeholderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baStakeholders.listByOrganization(context.organizationId)).map((r) => mapStakeholderSummary(r, maps));
    }

    async createStakeholder(authUserId: string, email: string, input: CreateStakeholderInput, fullName?: string | null): Promise<StakeholderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baStakeholders.create(buildStakeholderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create stakeholder");
        const maps = await this.getMaps(context.organizationId);
        return mapStakeholderSummary(created, maps);
    }

    async getScopeItems(authUserId: string, email: string, fullName?: string | null): Promise<ScopeItemSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baScopeItems.listByOrganization(context.organizationId)).map((r) => mapScopeItemSummary(r, maps));
    }

    async createScopeItem(authUserId: string, email: string, input: CreateScopeItemInput, fullName?: string | null): Promise<ScopeItemSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baScopeItems.create(buildScopeItemPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create scope item");
        const maps = await this.getMaps(context.organizationId);
        return mapScopeItemSummary(created, maps);
    }

    async getProposals(authUserId: string, email: string, fullName?: string | null): Promise<ProposalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baProposals.listByOrganization(context.organizationId)).map((r) => mapProposalSummary(r, maps));
    }

    async createProposal(authUserId: string, email: string, input: CreateProposalInput, fullName?: string | null): Promise<ProposalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baProposals.create(buildProposalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create proposal");
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "proposal", "create", `Proposal ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProposalSummary(created, maps);
    }

    async getCostEstimates(authUserId: string, email: string, fullName?: string | null): Promise<CostEstimateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baCostEstimates.listByOrganization(context.organizationId)).map((r) => mapCostEstimateSummary(r, maps));
    }

    async createCostEstimate(authUserId: string, email: string, input: CreateCostEstimateInput, fullName?: string | null): Promise<CostEstimateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baCostEstimates.create(buildCostEstimatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create cost estimate");
        const maps = await this.getMaps(context.organizationId);
        return mapCostEstimateSummary(created, maps);
    }

    async getTimelineEstimates(authUserId: string, email: string, fullName?: string | null): Promise<TimelineEstimateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baTimelineEstimates.listByOrganization(context.organizationId)).map((r) => mapTimelineEstimateSummary(r, maps));
    }

    async createTimelineEstimate(authUserId: string, email: string, input: CreateTimelineEstimateInput, fullName?: string | null): Promise<TimelineEstimateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baTimelineEstimates.create(buildTimelineEstimatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create timeline estimate");
        const maps = await this.getMaps(context.organizationId);
        return mapTimelineEstimateSummary(created, maps);
    }

    async getVersions(authUserId: string, email: string, fullName?: string | null): Promise<VersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baRequirementVersions.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((r) => mapVersionSummary(r, maps));
    }

    async createVersion(authUserId: string, email: string, input: CreateVersionInput, fullName?: string | null): Promise<VersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = (await databaseService.baRequirementVersions.listByOrganization(context.organizationId)).filter((v) => v.entity_id === input.entityId);
        const versionNumber = existing.length > 0 ? Math.max(...existing.map((v) => v.version_number)) + 1 : 1;
        const created = await databaseService.baRequirementVersions.create(buildVersionPayload(context.organizationId, input, versionNumber));
        if (!created) throw new Error("Failed to create version");
        await databaseService.baAuditLogs.create(buildBaAuditPayload(context.organizationId, "version", "create", `Version ${versionNumber} created for ${input.entityType}`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVersionSummary(created, maps);
    }

    async getReviewApprovals(authUserId: string, email: string, fullName?: string | null): Promise<ReviewApprovalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.baReviewApprovals.listByOrganization(context.organizationId)).map((r) => mapReviewApprovalSummary(r, maps));
    }

    async createReviewApproval(authUserId: string, email: string, input: CreateReviewApprovalInput, fullName?: string | null): Promise<ReviewApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.baReviewApprovals.create(buildReviewApprovalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create review approval");
        const maps = await this.getMaps(context.organizationId);
        return mapReviewApprovalSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<BaPipelineInfo> {
        return buildBaPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<BaDashboardStats> {
        const [engagements, interviews, brds, frsDocuments, userStories, acceptanceCriteria, processMaps, gapAnalyses, featurePriorities, risks, stakeholders, scopeItems, proposals, costEstimates, timelineEstimates, versions, approvals] = await Promise.all([
            this.getEngagements(authUserId, email, fullName),
            this.getInterviews(authUserId, email, fullName),
            this.getBrds(authUserId, email, fullName),
            this.getFrsDocuments(authUserId, email, fullName),
            this.getUserStories(authUserId, email, fullName),
            this.getAcceptanceCriteria(authUserId, email, fullName),
            this.getProcessMaps(authUserId, email, fullName),
            this.getGapAnalyses(authUserId, email, fullName),
            this.getFeaturePriorities(authUserId, email, fullName),
            this.getRisks(authUserId, email, fullName),
            this.getStakeholders(authUserId, email, fullName),
            this.getScopeItems(authUserId, email, fullName),
            this.getProposals(authUserId, email, fullName),
            this.getCostEstimates(authUserId, email, fullName),
            this.getTimelineEstimates(authUserId, email, fullName),
            this.getVersions(authUserId, email, fullName),
            this.getReviewApprovals(authUserId, email, fullName),
        ]);
        return buildBaDashboardStats({ engagements, interviews, brds, frsDocuments, userStories, acceptanceCriteria, processMaps, gapAnalyses, featurePriorities, risks, stakeholders, scopeItems, proposals, costEstimates, timelineEstimates, versions, approvals });
    }

    async sdkStartEngagement(authUserId: string, email: string, input: BaSdkStartEngagementInput, fullName?: string | null): Promise<BaSdkStartEngagementResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `ba-${input.engagementKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const engagement = await this.createEngagement(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "requirement_interview" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "requirement_analysis", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "business_analyst", inputPayload: { engagementKey: input.engagementKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `ba-${input.engagementKey}`, summary: input.title });
        }
        return { engagementId: engagement.id, engagementKey: engagement.engagementKey, pipelineStage: engagement.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: BaSdkGenerateArtifactInput, fullName?: string | null): Promise<BaSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "business_analyst", inputPayload: { engagementId: input.engagementId, title: input.title, content: input.content } });
        if (input.artifactType === "brd") {
            const created = await this.createBrd(authUserId, email, { engagementId: input.engagementId, title: input.title, executiveSummary: input.content.slice(0, 200), content: input.content }, fullName);
            return { artifactId: created.id, artifactType: "brd", status: created.status };
        }
        if (input.artifactType === "frs") {
            const created = await this.createFrs(authUserId, email, { engagementId: input.engagementId, title: input.title, functionalRequirements: input.content }, fullName);
            return { artifactId: created.id, artifactType: "frs", status: created.status };
        }
        if (input.artifactType === "user_story") {
            const created = await this.createUserStory(authUserId, email, { engagementId: input.engagementId, storyKey: input.title.replace(/\s+/g, "-").toLowerCase(), title: input.title, description: input.content }, fullName);
            return { artifactId: created.id, artifactType: "user_story", status: created.status };
        }
        const created = await this.createProposal(authUserId, email, { engagementId: input.engagementId, title: input.title, executiveSummary: input.content.slice(0, 200), content: input.content }, fullName);
        return { artifactId: created.id, artifactType: "proposal", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: BaSdkRunAnalysisInput, fullName?: string | null): Promise<BaSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `ba_${input.analysisType}_analysis`, moduleSource: "business_analyst", inputPayload: { engagementId: input.engagementId, ...input.inputPayload } });
        if (input.analysisType === "gap") {
            const created = await this.createGapAnalysis(authUserId, email, { engagementId: input.engagementId, currentState: String(input.inputPayload.currentState ?? ""), desiredState: String(input.inputPayload.desiredState ?? ""), recommendations: String(input.inputPayload.recommendations ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "gap", status: created.status };
        }
        if (input.analysisType === "risk") {
            const created = await this.createRisk(authUserId, email, { engagementId: input.engagementId, riskKey: String(input.inputPayload.riskKey ?? "RISK-AUTO"), title: String(input.inputPayload.title ?? "Identified Risk"), description: String(input.inputPayload.description ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "risk", status: created.status };
        }
        const created = await this.createFeaturePriority(authUserId, email, { engagementId: input.engagementId, featureName: String(input.inputPayload.featureName ?? "Feature"), priorityScore: Number(input.inputPayload.priorityScore ?? 50), rationale: String(input.inputPayload.rationale ?? "") }, fullName);
        return { analysisId: created.id, analysisType: "priority", status: created.status };
    }

    async getEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.projects.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }

    async getUserStoryOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baUserStories.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: `${s.story_key}: ${s.title}` }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.employees.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` }));
    }
}

export const businessAnalystService = new BusinessAnalystService();
