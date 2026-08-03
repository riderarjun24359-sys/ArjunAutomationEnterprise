import {
    buildAcAuditPayload,
    buildAcDashboardStats,
    buildAcPipelineInfo,
    buildActivityFeedPayload,
    buildApprovalWorkflowPayload,
    buildAutomationPayload,
    buildBusinessKpiPayload,
    buildCommandPalettePayload,
    buildCompanyContextPayload,
    buildComplianceDashboardPayload,
    buildEmergencyWorkflowPayload,
    buildEventBusPayload,
    buildExecutiveInsightPayload,
    buildLookupMaps,
    buildNotificationPayload,
    buildOperationalHealthPayload,
    buildPredictiveRecommendationPayload,
    buildSecurityGovernancePayload,
    buildSystemSearchPayload,
    buildTimelinePayload,
    buildWorkerCollaborationPayload,
    buildWorkflowOrchestrationPayload,
    mapActivityFeedSummary,
    mapApprovalWorkflowSummary,
    mapAuditEntry,
    mapAutomationSummary,
    mapBusinessKpiSummary,
    mapCommandPaletteSummary,
    mapCompanyContextSummary,
    mapComplianceDashboardSummary,
    mapEmergencyWorkflowSummary,
    mapEventBusSummary,
    mapExecutiveInsightSummary,
    mapNotificationSummary,
    mapOperationalHealthSummary,
    mapPredictiveRecommendationSummary,
    mapSecurityGovernanceSummary,
    mapSystemSearchSummary,
    mapTimelineSummary,
    mapWorkerCollaborationSummary,
    mapWorkflowOrchestrationSummary,
} from "@/src/modules/database/lib/autonomous-company-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createFounderOsClient } from "@/src/modules/founder-os/sdk";
import { createBusinessAnalystClient } from "@/src/modules/business-analyst/sdk";
import { createSolutionArchitectClient } from "@/src/modules/solution-architect/sdk";
import { createDevelopmentFactoryClient } from "@/src/modules/development-factory/sdk";
import { createQaEngineerClient } from "@/src/modules/qa-engineer/sdk";
import { createDevopsDeploymentClient } from "@/src/modules/devops-deployment/sdk";
import { createCustomerSuccessClient } from "@/src/modules/customer-success/sdk";
import type {
    AcDashboardStats,
    AcPipelineInfo,
    AcSdkOrchestrateWorkflowInput,
    AcSdkOrchestrateWorkflowResult,
    AcSdkRunCollaborationInput,
    AcSdkRunCollaborationResult,
    AcSdkStartContextInput,
    AcSdkStartContextResult,
    ActivityFeedSummary,
    ApprovalWorkflowSummary,
    AuditEntry,
    AutomationSummary,
    BusinessKpiSummary,
    CommandPaletteSummary,
    CompanyContextSummary,
    ComplianceDashboardSummary,
    CreateActivityFeedInput,
    CreateApprovalWorkflowInput,
    CreateAutomationInput,
    CreateBusinessKpiInput,
    CreateCommandPaletteInput,
    CreateCompanyContextInput,
    CreateComplianceDashboardInput,
    CreateEmergencyWorkflowInput,
    CreateEventBusInput,
    CreateExecutiveInsightInput,
    CreateNotificationInput,
    CreateOperationalHealthInput,
    CreatePredictiveRecommendationInput,
    CreateSecurityGovernanceInput,
    CreateSystemSearchInput,
    CreateTimelineInput,
    CreateWorkerCollaborationInput,
    CreateWorkflowOrchestrationInput,
    EmergencyWorkflowSummary,
    EventBusSummary,
    ExecutiveInsightSummary,
    NotificationSummary,
    OperationalHealthSummary,
    PredictiveRecommendationSummary,
    SecurityGovernanceSummary,
    SystemSearchSummary,
    TimelineSummary,
    WorkerCollaborationSummary,
    WorkflowOrchestrationSummary,
} from "@/src/modules/autonomous-company/types";

export class AutonomousCompanyService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    /** Loads cross-module lookups: company contexts, pipeline engagements, founder workspaces, CRM, projects, AI context. */
    private async getMaps(organizationId: string) {
        const [contexts, baEngagements, saEngagements, dfEngagements, qaEngagements, ddEngagements, csEngagements, foWorkspaces, clients, projects, agents, sessions] = await Promise.all([
            databaseService.acCompanyContexts.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.dfEngagements.listByOrganization(organizationId),
            databaseService.qaEngagements.listByOrganization(organizationId),
            databaseService.ddEngagements.listByOrganization(organizationId),
            databaseService.csEngagements.listByOrganization(organizationId),
            databaseService.foWorkspaces.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(contexts, baEngagements, saEngagements, dfEngagements, qaEngagements, ddEngagements, csEngagements, foWorkspaces, clients, projects, agents, sessions);
    }

    async getCompanyContexts(authUserId: string, email: string, fullName?: string | null): Promise<CompanyContextSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acCompanyContexts.listByOrganization(context.organizationId)).map((r) => mapCompanyContextSummary(r, maps));
    }

    async createCompanyContext(authUserId: string, email: string, input: CreateCompanyContextInput, fullName?: string | null): Promise<CompanyContextSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acCompanyContexts.create(buildCompanyContextPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create company context");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "company_context", "create", `Company context ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompanyContextSummary(created, maps);
    }

    async getWorkflowOrchestrations(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowOrchestrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acWorkflowOrchestrations.listByOrganization(context.organizationId)).map((r) => mapWorkflowOrchestrationSummary(r, maps));
    }

    async createWorkflowOrchestration(authUserId: string, email: string, input: CreateWorkflowOrchestrationInput, fullName?: string | null): Promise<WorkflowOrchestrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acWorkflowOrchestrations.create(buildWorkflowOrchestrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflow orchestration");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "workflow_orchestration", "create", `Workflow orchestration ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkflowOrchestrationSummary(created, maps);
    }

    async getEventBusEvents(authUserId: string, email: string, fullName?: string | null): Promise<EventBusSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acEventBusEvents.listByOrganization(context.organizationId)).map((r) => mapEventBusSummary(r, maps));
    }

    async createEventBusEvent(authUserId: string, email: string, input: CreateEventBusInput, fullName?: string | null): Promise<EventBusSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acEventBusEvents.create(buildEventBusPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create event bus event");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "event_bus_event", "create", `Event bus event ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEventBusSummary(created, maps);
    }

    async getWorkerCollaborations(authUserId: string, email: string, fullName?: string | null): Promise<WorkerCollaborationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acWorkerCollaborations.listByOrganization(context.organizationId)).map((r) => mapWorkerCollaborationSummary(r, maps));
    }

    async createWorkerCollaboration(authUserId: string, email: string, input: CreateWorkerCollaborationInput, fullName?: string | null): Promise<WorkerCollaborationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acWorkerCollaborations.create(buildWorkerCollaborationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create worker collaboration");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "worker_collaboration", "create", `Worker collaboration ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWorkerCollaborationSummary(created, maps);
    }

    async getApprovalWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acApprovalWorkflows.listByOrganization(context.organizationId)).map((r) => mapApprovalWorkflowSummary(r, maps));
    }

    async createApprovalWorkflow(authUserId: string, email: string, input: CreateApprovalWorkflowInput, fullName?: string | null): Promise<ApprovalWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acApprovalWorkflows.create(buildApprovalWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approval workflow");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "approval_workflow", "create", `Approval workflow ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalWorkflowSummary(created, maps);
    }

    async getNotifications(authUserId: string, email: string, fullName?: string | null): Promise<NotificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acNotificationCenter.listByOrganization(context.organizationId)).map((r) => mapNotificationSummary(r, maps));
    }

    async createNotification(authUserId: string, email: string, input: CreateNotificationInput, fullName?: string | null): Promise<NotificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acNotificationCenter.create(buildNotificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create notification");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "notification", "create", `Notification ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapNotificationSummary(created, maps);
    }

    async getTimelines(authUserId: string, email: string, fullName?: string | null): Promise<TimelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acCompanyTimeline.listByOrganization(context.organizationId)).map((r) => mapTimelineSummary(r, maps));
    }

    async createTimeline(authUserId: string, email: string, input: CreateTimelineInput, fullName?: string | null): Promise<TimelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acCompanyTimeline.create(buildTimelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create timeline entry");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "timeline", "create", `Timeline entry ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTimelineSummary(created, maps);
    }

    async getActivityFeeds(authUserId: string, email: string, fullName?: string | null): Promise<ActivityFeedSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acActivityFeed.listByOrganization(context.organizationId)).map((r) => mapActivityFeedSummary(r, maps));
    }

    async createActivityFeed(authUserId: string, email: string, input: CreateActivityFeedInput, fullName?: string | null): Promise<ActivityFeedSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acActivityFeed.create(buildActivityFeedPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create activity feed entry");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "activity_feed", "create", `Activity feed ${created.feed_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapActivityFeedSummary(created, maps);
    }

    async getAutomations(authUserId: string, email: string, fullName?: string | null): Promise<AutomationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acCrossModuleAutomations.listByOrganization(context.organizationId)).map((r) => mapAutomationSummary(r, maps));
    }

    async createAutomation(authUserId: string, email: string, input: CreateAutomationInput, fullName?: string | null): Promise<AutomationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acCrossModuleAutomations.create(buildAutomationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create automation");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "automation", "create", `Automation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAutomationSummary(created, maps);
    }

    async getExecutiveInsights(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveInsightSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acExecutiveInsights.listByOrganization(context.organizationId)).map((r) => mapExecutiveInsightSummary(r, maps));
    }

    async createExecutiveInsight(authUserId: string, email: string, input: CreateExecutiveInsightInput, fullName?: string | null): Promise<ExecutiveInsightSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acExecutiveInsights.create(buildExecutiveInsightPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executive insight");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "executive_insight", "create", `Executive insight ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveInsightSummary(created, maps);
    }

    async getPredictiveRecommendations(authUserId: string, email: string, fullName?: string | null): Promise<PredictiveRecommendationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acPredictiveRecommendations.listByOrganization(context.organizationId)).map((r) => mapPredictiveRecommendationSummary(r, maps));
    }

    async createPredictiveRecommendation(authUserId: string, email: string, input: CreatePredictiveRecommendationInput, fullName?: string | null): Promise<PredictiveRecommendationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acPredictiveRecommendations.create(buildPredictiveRecommendationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create predictive recommendation");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "predictive_recommendation", "create", `Predictive recommendation ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPredictiveRecommendationSummary(created, maps);
    }

    async getSystemSearches(authUserId: string, email: string, fullName?: string | null): Promise<SystemSearchSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acSystemSearch.listByOrganization(context.organizationId)).map((r) => mapSystemSearchSummary(r, maps));
    }

    async createSystemSearch(authUserId: string, email: string, input: CreateSystemSearchInput, fullName?: string | null): Promise<SystemSearchSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acSystemSearch.create(buildSystemSearchPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create system search entry");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "system_search", "create", `System search ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSystemSearchSummary(created, maps);
    }

    async getCommandPalette(authUserId: string, email: string, fullName?: string | null): Promise<CommandPaletteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acCommandPalette.listByOrganization(context.organizationId)).map((r) => mapCommandPaletteSummary(r, maps));
    }

    async createCommandPaletteEntry(authUserId: string, email: string, input: CreateCommandPaletteInput, fullName?: string | null): Promise<CommandPaletteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acCommandPalette.create(buildCommandPalettePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create command palette entry");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "command_palette", "create", `Command palette ${created.label} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCommandPaletteSummary(created, maps);
    }

    async getEmergencyWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<EmergencyWorkflowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acEmergencyWorkflows.listByOrganization(context.organizationId)).map((r) => mapEmergencyWorkflowSummary(r, maps));
    }

    async createEmergencyWorkflow(authUserId: string, email: string, input: CreateEmergencyWorkflowInput, fullName?: string | null): Promise<EmergencyWorkflowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acEmergencyWorkflows.create(buildEmergencyWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create emergency workflow");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "emergency_workflow", "create", `Emergency workflow ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEmergencyWorkflowSummary(created, maps);
    }

    async getBusinessKpis(authUserId: string, email: string, fullName?: string | null): Promise<BusinessKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acBusinessKpis.listByOrganization(context.organizationId)).map((r) => mapBusinessKpiSummary(r, maps));
    }

    async createBusinessKpi(authUserId: string, email: string, input: CreateBusinessKpiInput, fullName?: string | null): Promise<BusinessKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acBusinessKpis.create(buildBusinessKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create business KPI");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "business_kpi", "create", `Business KPI ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBusinessKpiSummary(created, maps);
    }

    async getSecurityGovernance(authUserId: string, email: string, fullName?: string | null): Promise<SecurityGovernanceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acSecurityGovernance.listByOrganization(context.organizationId)).map((r) => mapSecurityGovernanceSummary(r, maps));
    }

    async createSecurityGovernance(authUserId: string, email: string, input: CreateSecurityGovernanceInput, fullName?: string | null): Promise<SecurityGovernanceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acSecurityGovernance.create(buildSecurityGovernancePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create security governance entry");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "security_governance", "create", `Security governance ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecurityGovernanceSummary(created, maps);
    }

    async getComplianceDashboards(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acComplianceDashboards.listByOrganization(context.organizationId)).map((r) => mapComplianceDashboardSummary(r, maps));
    }

    async createComplianceDashboard(authUserId: string, email: string, input: CreateComplianceDashboardInput, fullName?: string | null): Promise<ComplianceDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acComplianceDashboards.create(buildComplianceDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create compliance dashboard");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "compliance_dashboard", "create", `Compliance dashboard ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceDashboardSummary(created, maps);
    }

    async getOperationalHealth(authUserId: string, email: string, fullName?: string | null): Promise<OperationalHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.acOperationalHealth.listByOrganization(context.organizationId)).map((r) => mapOperationalHealthSummary(r, maps));
    }

    async createOperationalHealth(authUserId: string, email: string, input: CreateOperationalHealthInput, fullName?: string | null): Promise<OperationalHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.acOperationalHealth.create(buildOperationalHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operational health entry");
        await databaseService.acAuditLogs.create(buildAcAuditPayload(context.organizationId, "operational_health", "create", `Operational health ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOperationalHealthSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.acAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<AcPipelineInfo> {
        return buildAcPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AcDashboardStats> {
        const [contexts, workflowOrchestrations, eventBusEvents, workerCollaborations, approvalWorkflows, notifications, timelines, activityFeeds, automations, executiveInsights, predictiveRecommendations, systemSearches, commandPalette, emergencyWorkflows, businessKpis, securityGovernance, complianceDashboards, operationalHealth] = await Promise.all([
            this.getCompanyContexts(authUserId, email, fullName),
            this.getWorkflowOrchestrations(authUserId, email, fullName),
            this.getEventBusEvents(authUserId, email, fullName),
            this.getWorkerCollaborations(authUserId, email, fullName),
            this.getApprovalWorkflows(authUserId, email, fullName),
            this.getNotifications(authUserId, email, fullName),
            this.getTimelines(authUserId, email, fullName),
            this.getActivityFeeds(authUserId, email, fullName),
            this.getAutomations(authUserId, email, fullName),
            this.getExecutiveInsights(authUserId, email, fullName),
            this.getPredictiveRecommendations(authUserId, email, fullName),
            this.getSystemSearches(authUserId, email, fullName),
            this.getCommandPalette(authUserId, email, fullName),
            this.getEmergencyWorkflows(authUserId, email, fullName),
            this.getBusinessKpis(authUserId, email, fullName),
            this.getSecurityGovernance(authUserId, email, fullName),
            this.getComplianceDashboards(authUserId, email, fullName),
            this.getOperationalHealth(authUserId, email, fullName),
        ]);
        return buildAcDashboardStats({ contexts, workflowOrchestrations, eventBusEvents, workerCollaborations, approvalWorkflows, notifications, timelines, activityFeeds, automations, executiveInsights, predictiveRecommendations, systemSearches, commandPalette, emergencyWorkflows, businessKpis, securityGovernance, complianceDashboards, operationalHealth });
    }

    async sdkStartContext(authUserId: string, email: string, input: AcSdkStartContextInput, fullName?: string | null): Promise<AcSdkStartContextResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const founderOs = createFounderOsClient(authUserId, email, fullName);
        const ba = createBusinessAnalystClient(authUserId, email, fullName);
        const sa = createSolutionArchitectClient(authUserId, email, fullName);
        const df = createDevelopmentFactoryClient(authUserId, email, fullName);
        const qa = createQaEngineerClient(authUserId, email, fullName);
        const dd = createDevopsDeploymentClient(authUserId, email, fullName);
        const cs = createCustomerSuccessClient(authUserId, email, fullName);
        await Promise.all([
            founderOs.getPipelineInfo(),
            ba.getPipelineInfo(),
            sa.getPipelineInfo(),
            df.getPipelineInfo(),
            qa.getPipelineInfo(),
            dd.getPipelineInfo(),
            cs.getPipelineInfo(),
        ]);
        const resolved = await knowledge.resolveContext({ contextKey: `ac-${input.contextKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const companyContext = await this.createCompanyContext(authUserId, email, { ...input, knowledgeContextId: resolved.contextId, pipelineStage: "autonomous_company" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "autonomous_company", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "autonomous_company", inputPayload: { contextKey: input.contextKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `ac-${input.contextKey}`, summary: input.title });
        }
        return { contextId: companyContext.id, contextKey: companyContext.contextKey, pipelineStage: companyContext.pipelineStage, aiTaskId };
    }

    async sdkOrchestrateWorkflow(authUserId: string, email: string, input: AcSdkOrchestrateWorkflowInput, fullName?: string | null): Promise<AcSdkOrchestrateWorkflowResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.name, limit: 5 });
        await ai.executeTask({ taskType: "orchestrate_workflow", moduleSource: "autonomous_company", inputPayload: { contextId: input.contextId, orchestrationKey: input.orchestrationKey, name: input.name } });
        const created = await this.createWorkflowOrchestration(authUserId, email, { contextId: input.contextId, orchestrationKey: input.orchestrationKey, name: input.name, participatingModules: input.participatingModules }, fullName);
        return { orchestrationId: created.id, orchestrationKey: created.orchestrationKey, status: created.status };
    }

    async sdkRunCollaboration(authUserId: string, email: string, input: AcSdkRunCollaborationInput, fullName?: string | null): Promise<AcSdkRunCollaborationResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const founderOs = createFounderOsClient(authUserId, email, fullName);
        const ba = createBusinessAnalystClient(authUserId, email, fullName);
        const sa = createSolutionArchitectClient(authUserId, email, fullName);
        const df = createDevelopmentFactoryClient(authUserId, email, fullName);
        const qa = createQaEngineerClient(authUserId, email, fullName);
        const dd = createDevopsDeploymentClient(authUserId, email, fullName);
        const cs = createCustomerSuccessClient(authUserId, email, fullName);
        await Promise.all([
            founderOs.getPipelineInfo(),
            ba.getPipelineInfo(),
            sa.getPipelineInfo(),
            df.getPipelineInfo(),
            qa.getPipelineInfo(),
            dd.getPipelineInfo(),
            cs.getPipelineInfo(),
        ]);
        await ai.executeTask({ taskType: "run_collaboration", moduleSource: "autonomous_company", inputPayload: { contextId: input.contextId, collaborationKey: input.collaborationKey, name: input.name } });
        const created = await this.createWorkerCollaboration(authUserId, email, { contextId: input.contextId, collaborationKey: input.collaborationKey, name: input.name, participatingWorkers: input.participatingWorkers }, fullName);
        return { collaborationId: created.id, collaborationKey: created.collaborationKey, status: created.status };
    }

    async getContextOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.acCompanyContexts.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.title }));
    }

    async getFoWorkspaceOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.foWorkspaces.listByOrganization(context.organizationId)).map((w) => ({ id: w.id, name: w.title }));
    }

    async getBaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getSaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDfEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getQaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDdEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getCsEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.csEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
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
}

export const autonomousCompanyService = new AutonomousCompanyService();
