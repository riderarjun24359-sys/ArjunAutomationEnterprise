import {
    buildAccessibilityValidationPayload,
    buildApiValidationPayload,
    buildBugTriagePayload,
    buildCoverageAnalyticsPayload,
    buildDatabaseValidationPayload,
    buildDefectAnalysisPayload,
    buildE2eTestPlanPayload,
    buildEngagementPayload,
    buildIntegrationTestPlanPayload,
    buildLookupMaps,
    buildPerformanceValidationPayload,
    buildQaAuditPayload,
    buildQaDashboardStats,
    buildQaPipelineInfo,
    buildQualityScorePayload,
    buildRegressionAnalysisPayload,
    buildReleaseReadinessPayload,
    buildRiskBasedTestPayload,
    buildSecurityValidationPayload,
    buildTestStrategyPayload,
    buildUiValidationPayload,
    buildUnitTestPlanPayload,
    mapAccessibilityValidationSummary,
    mapApiValidationSummary,
    mapAuditEntry,
    mapBugTriageSummary,
    mapCoverageAnalyticsSummary,
    mapDatabaseValidationSummary,
    mapDefectAnalysisSummary,
    mapE2eTestPlanSummary,
    mapEngagementSummary,
    mapIntegrationTestPlanSummary,
    mapPerformanceValidationSummary,
    mapQualityScoreSummary,
    mapRegressionAnalysisSummary,
    mapReleaseReadinessSummary,
    mapRiskBasedTestSummary,
    mapSecurityValidationSummary,
    mapTestStrategySummary,
    mapUiValidationSummary,
    mapUnitTestPlanSummary,
} from "@/src/modules/database/lib/qa-engineer-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    AccessibilityValidationSummary,
    ApiValidationSummary,
    AuditEntry,
    BugTriageSummary,
    CoverageAnalyticsSummary,
    CreateAccessibilityValidationInput,
    CreateApiValidationInput,
    CreateBugTriageInput,
    CreateCoverageAnalyticsInput,
    CreateDatabaseValidationInput,
    CreateDefectAnalysisInput,
    CreateE2eTestPlanInput,
    CreateEngagementInput,
    CreateIntegrationTestPlanInput,
    CreatePerformanceValidationInput,
    CreateQualityScoreInput,
    CreateRegressionAnalysisInput,
    CreateReleaseReadinessInput,
    CreateRiskBasedTestInput,
    CreateSecurityValidationInput,
    CreateTestStrategyInput,
    CreateUiValidationInput,
    CreateUnitTestPlanInput,
    DatabaseValidationSummary,
    DefectAnalysisSummary,
    E2eTestPlanSummary,
    EngagementSummary,
    IntegrationTestPlanSummary,
    PerformanceValidationSummary,
    QaDashboardStats,
    QaPipelineInfo,
    QaSdkGenerateArtifactInput,
    QaSdkGenerateArtifactResult,
    QaSdkRunAnalysisInput,
    QaSdkRunAnalysisResult,
    QaSdkStartEngagementInput,
    QaSdkStartEngagementResult,
    QualityScoreSummary,
    RegressionAnalysisSummary,
    ReleaseReadinessSummary,
    RiskBasedTestSummary,
    SecurityValidationSummary,
    TestStrategySummary,
    UiValidationSummary,
    UnitTestPlanSummary,
} from "@/src/modules/qa-engineer/types";

export class QaEngineerService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [qaEngagements, baEngagements, saEngagements, dfEngagements, solutionArchitectures, workPackages, baBrds, baFrsDocuments, clients, projects, agents, sessions] = await Promise.all([
            databaseService.qaEngagements.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.dfEngagements.listByOrganization(organizationId),
            databaseService.saSolutionArchitectures.listByOrganization(organizationId),
            databaseService.dfWorkPackages.listByOrganization(organizationId),
            databaseService.baBrds.listByOrganization(organizationId),
            databaseService.baFrsDocuments.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(qaEngagements, baEngagements, saEngagements, dfEngagements, solutionArchitectures, workPackages, baBrds, baFrsDocuments, clients, projects, agents, sessions);
    }

    async getEngagements(authUserId: string, email: string, fullName?: string | null): Promise<EngagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaEngagements.listByOrganization(context.organizationId)).map((e) => mapEngagementSummary(e, maps));
    }

    async createEngagement(authUserId: string, email: string, input: CreateEngagementInput, fullName?: string | null): Promise<EngagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaEngagements.create(buildEngagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagement");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "engagement", "create", `Engagement ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementSummary(created, maps);
    }

    async getTestStrategies(authUserId: string, email: string, fullName?: string | null): Promise<TestStrategySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaTestStrategies.listByOrganization(context.organizationId)).map((r) => mapTestStrategySummary(r, maps));
    }

    async createTestStrategy(authUserId: string, email: string, input: CreateTestStrategyInput, fullName?: string | null): Promise<TestStrategySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaTestStrategies.create(buildTestStrategyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create test strategy");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "test_strategy", "create", `Test strategy ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTestStrategySummary(created, maps);
    }

    async getUnitTestPlans(authUserId: string, email: string, fullName?: string | null): Promise<UnitTestPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaUnitTestPlans.listByOrganization(context.organizationId)).map((r) => mapUnitTestPlanSummary(r, maps));
    }

    async createUnitTestPlan(authUserId: string, email: string, input: CreateUnitTestPlanInput, fullName?: string | null): Promise<UnitTestPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaUnitTestPlans.create(buildUnitTestPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create unit test plan");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "unit_test_plan", "create", `Unit test plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUnitTestPlanSummary(created, maps);
    }

    async getIntegrationTestPlans(authUserId: string, email: string, fullName?: string | null): Promise<IntegrationTestPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaIntegrationTestPlans.listByOrganization(context.organizationId)).map((r) => mapIntegrationTestPlanSummary(r, maps));
    }

    async createIntegrationTestPlan(authUserId: string, email: string, input: CreateIntegrationTestPlanInput, fullName?: string | null): Promise<IntegrationTestPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaIntegrationTestPlans.create(buildIntegrationTestPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create integration test plan");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "integration_test_plan", "create", `Integration test plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIntegrationTestPlanSummary(created, maps);
    }

    async getE2eTestPlans(authUserId: string, email: string, fullName?: string | null): Promise<E2eTestPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaE2eTestPlans.listByOrganization(context.organizationId)).map((r) => mapE2eTestPlanSummary(r, maps));
    }

    async createE2eTestPlan(authUserId: string, email: string, input: CreateE2eTestPlanInput, fullName?: string | null): Promise<E2eTestPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaE2eTestPlans.create(buildE2eTestPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create e2e test plan");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "e2e_test_plan", "create", `E2E test plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapE2eTestPlanSummary(created, maps);
    }

    async getRegressionAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<RegressionAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaRegressionAnalyses.listByOrganization(context.organizationId)).map((r) => mapRegressionAnalysisSummary(r, maps));
    }

    async createRegressionAnalysis(authUserId: string, email: string, input: CreateRegressionAnalysisInput, fullName?: string | null): Promise<RegressionAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaRegressionAnalyses.create(buildRegressionAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create regression analysis");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "regression_analysis", "create", `Regression analysis ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRegressionAnalysisSummary(created, maps);
    }

    async getRiskBasedTests(authUserId: string, email: string, fullName?: string | null): Promise<RiskBasedTestSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaRiskBasedTests.listByOrganization(context.organizationId)).map((r) => mapRiskBasedTestSummary(r, maps));
    }

    async createRiskBasedTest(authUserId: string, email: string, input: CreateRiskBasedTestInput, fullName?: string | null): Promise<RiskBasedTestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaRiskBasedTests.create(buildRiskBasedTestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create risk-based test");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "risk_based_test", "create", `Risk-based test ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRiskBasedTestSummary(created, maps);
    }

    async getSecurityValidations(authUserId: string, email: string, fullName?: string | null): Promise<SecurityValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaSecurityValidations.listByOrganization(context.organizationId)).map((r) => mapSecurityValidationSummary(r, maps));
    }

    async createSecurityValidation(authUserId: string, email: string, input: CreateSecurityValidationInput, fullName?: string | null): Promise<SecurityValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaSecurityValidations.create(buildSecurityValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create security validation");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "security_validation", "create", `Security validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecurityValidationSummary(created, maps);
    }

    async getPerformanceValidations(authUserId: string, email: string, fullName?: string | null): Promise<PerformanceValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaPerformanceValidations.listByOrganization(context.organizationId)).map((r) => mapPerformanceValidationSummary(r, maps));
    }

    async createPerformanceValidation(authUserId: string, email: string, input: CreatePerformanceValidationInput, fullName?: string | null): Promise<PerformanceValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaPerformanceValidations.create(buildPerformanceValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create performance validation");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "performance_validation", "create", `Performance validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPerformanceValidationSummary(created, maps);
    }

    async getAccessibilityValidations(authUserId: string, email: string, fullName?: string | null): Promise<AccessibilityValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaAccessibilityValidations.listByOrganization(context.organizationId)).map((r) => mapAccessibilityValidationSummary(r, maps));
    }

    async createAccessibilityValidation(authUserId: string, email: string, input: CreateAccessibilityValidationInput, fullName?: string | null): Promise<AccessibilityValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaAccessibilityValidations.create(buildAccessibilityValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create accessibility validation");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "accessibility_validation", "create", `Accessibility validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAccessibilityValidationSummary(created, maps);
    }

    async getApiValidations(authUserId: string, email: string, fullName?: string | null): Promise<ApiValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaApiValidations.listByOrganization(context.organizationId)).map((r) => mapApiValidationSummary(r, maps));
    }

    async createApiValidation(authUserId: string, email: string, input: CreateApiValidationInput, fullName?: string | null): Promise<ApiValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaApiValidations.create(buildApiValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create API validation");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "api_validation", "create", `API validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapApiValidationSummary(created, maps);
    }

    async getDatabaseValidations(authUserId: string, email: string, fullName?: string | null): Promise<DatabaseValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaDatabaseValidations.listByOrganization(context.organizationId)).map((r) => mapDatabaseValidationSummary(r, maps));
    }

    async createDatabaseValidation(authUserId: string, email: string, input: CreateDatabaseValidationInput, fullName?: string | null): Promise<DatabaseValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaDatabaseValidations.create(buildDatabaseValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create database validation");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "database_validation", "create", `Database validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDatabaseValidationSummary(created, maps);
    }

    async getUiValidations(authUserId: string, email: string, fullName?: string | null): Promise<UiValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaUiValidations.listByOrganization(context.organizationId)).map((r) => mapUiValidationSummary(r, maps));
    }

    async createUiValidation(authUserId: string, email: string, input: CreateUiValidationInput, fullName?: string | null): Promise<UiValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaUiValidations.create(buildUiValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create UI validation");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "ui_validation", "create", `UI validation ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUiValidationSummary(created, maps);
    }

    async getBugTriages(authUserId: string, email: string, fullName?: string | null): Promise<BugTriageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaBugTriages.listByOrganization(context.organizationId)).map((r) => mapBugTriageSummary(r, maps));
    }

    async createBugTriage(authUserId: string, email: string, input: CreateBugTriageInput, fullName?: string | null): Promise<BugTriageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaBugTriages.create(buildBugTriagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create bug triage");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "bug_triage", "create", `Bug triage ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBugTriageSummary(created, maps);
    }

    async getDefectAnalyses(authUserId: string, email: string, fullName?: string | null): Promise<DefectAnalysisSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaDefectAnalyses.listByOrganization(context.organizationId)).map((r) => mapDefectAnalysisSummary(r, maps));
    }

    async createDefectAnalysis(authUserId: string, email: string, input: CreateDefectAnalysisInput, fullName?: string | null): Promise<DefectAnalysisSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaDefectAnalyses.create(buildDefectAnalysisPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create defect analysis");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "defect_analysis", "create", `Defect analysis ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDefectAnalysisSummary(created, maps);
    }

    async getCoverageAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<CoverageAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaCoverageAnalytics.listByOrganization(context.organizationId)).map((r) => mapCoverageAnalyticsSummary(r, maps));
    }

    async createCoverageAnalytics(authUserId: string, email: string, input: CreateCoverageAnalyticsInput, fullName?: string | null): Promise<CoverageAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaCoverageAnalytics.create(buildCoverageAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create coverage analytics");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "coverage_analytics", "create", `Coverage analytics ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCoverageAnalyticsSummary(created, maps);
    }

    async getReleaseReadiness(authUserId: string, email: string, fullName?: string | null): Promise<ReleaseReadinessSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaReleaseReadiness.listByOrganization(context.organizationId)).map((r) => mapReleaseReadinessSummary(r, maps));
    }

    async createReleaseReadiness(authUserId: string, email: string, input: CreateReleaseReadinessInput, fullName?: string | null): Promise<ReleaseReadinessSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaReleaseReadiness.create(buildReleaseReadinessPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create release readiness");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "release_readiness", "create", `Release readiness ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReleaseReadinessSummary(created, maps);
    }

    async getQualityScores(authUserId: string, email: string, fullName?: string | null): Promise<QualityScoreSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.qaQualityScores.listByOrganization(context.organizationId)).map((r) => mapQualityScoreSummary(r, maps));
    }

    async createQualityScore(authUserId: string, email: string, input: CreateQualityScoreInput, fullName?: string | null): Promise<QualityScoreSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.qaQualityScores.create(buildQualityScorePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create quality score");
        await databaseService.qaAuditLogs.create(buildQaAuditPayload(context.organizationId, "quality_score", "create", `Quality score ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapQualityScoreSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<QaPipelineInfo> {
        return buildQaPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<QaDashboardStats> {
        const [engagements, testStrategies, unitTestPlans, integrationTestPlans, e2eTestPlans, regressionAnalyses, riskBasedTests, securityValidations, performanceValidations, accessibilityValidations, apiValidations, databaseValidations, uiValidations, bugTriages, defectAnalyses, coverageAnalytics, releaseReadiness, qualityScores] = await Promise.all([
            this.getEngagements(authUserId, email, fullName),
            this.getTestStrategies(authUserId, email, fullName),
            this.getUnitTestPlans(authUserId, email, fullName),
            this.getIntegrationTestPlans(authUserId, email, fullName),
            this.getE2eTestPlans(authUserId, email, fullName),
            this.getRegressionAnalyses(authUserId, email, fullName),
            this.getRiskBasedTests(authUserId, email, fullName),
            this.getSecurityValidations(authUserId, email, fullName),
            this.getPerformanceValidations(authUserId, email, fullName),
            this.getAccessibilityValidations(authUserId, email, fullName),
            this.getApiValidations(authUserId, email, fullName),
            this.getDatabaseValidations(authUserId, email, fullName),
            this.getUiValidations(authUserId, email, fullName),
            this.getBugTriages(authUserId, email, fullName),
            this.getDefectAnalyses(authUserId, email, fullName),
            this.getCoverageAnalytics(authUserId, email, fullName),
            this.getReleaseReadiness(authUserId, email, fullName),
            this.getQualityScores(authUserId, email, fullName),
        ]);
        return buildQaDashboardStats({ engagements, testStrategies, unitTestPlans, integrationTestPlans, e2eTestPlans, regressionAnalyses, riskBasedTests, securityValidations, performanceValidations, accessibilityValidations, apiValidations, databaseValidations, uiValidations, bugTriages, defectAnalyses, coverageAnalytics, releaseReadiness, qualityScores });
    }

    async sdkStartEngagement(authUserId: string, email: string, input: QaSdkStartEngagementInput, fullName?: string | null): Promise<QaSdkStartEngagementResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `qa-${input.engagementKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const engagement = await this.createEngagement(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "qa_engineering" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "qa_engineering", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "qa_engineer", inputPayload: { engagementKey: input.engagementKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `qa-${input.engagementKey}`, summary: input.title });
        }
        return { engagementId: engagement.id, engagementKey: engagement.engagementKey, pipelineStage: engagement.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: QaSdkGenerateArtifactInput, fullName?: string | null): Promise<QaSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "qa_engineer", inputPayload: { engagementId: input.engagementId, title: input.title, content: input.content } });
        const key = input.title.replace(/\s+/g, "-").toLowerCase();
        if (input.artifactType === "test_strategy") {
            const created = await this.createTestStrategy(authUserId, email, { engagementId: input.engagementId, strategyKey: key, title: input.title, scope: input.content, approach: "" }, fullName);
            return { artifactId: created.id, artifactType: "test_strategy", status: created.status };
        }
        if (input.artifactType === "unit_test_plan") {
            const created = await this.createUnitTestPlan(authUserId, email, { engagementId: input.engagementId, planKey: key, name: input.title, targetModules: input.content }, fullName);
            return { artifactId: created.id, artifactType: "unit_test_plan", status: created.status };
        }
        if (input.artifactType === "e2e_test_plan") {
            const created = await this.createE2eTestPlan(authUserId, email, { engagementId: input.engagementId, planKey: key, name: input.title }, fullName);
            return { artifactId: created.id, artifactType: "e2e_test_plan", status: created.status };
        }
        const created = await this.createReleaseReadiness(authUserId, email, { engagementId: input.engagementId, assessmentKey: key, title: input.title, recommendation: input.content }, fullName);
        return { artifactId: created.id, artifactType: "release_readiness", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: QaSdkRunAnalysisInput, fullName?: string | null): Promise<QaSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `qa_${input.analysisType}_analysis`, moduleSource: "qa_engineer", inputPayload: { engagementId: input.engagementId, ...input.inputPayload } });
        if (input.analysisType === "regression") {
            const created = await this.createRegressionAnalysis(authUserId, email, { engagementId: input.engagementId, analysisKey: String(input.inputPayload.analysisKey ?? "REG-AUTO"), name: String(input.inputPayload.name ?? "Regression Analysis"), affectedAreas: (input.inputPayload.affectedAreas as unknown[]) ?? [], regressionRisks: String(input.inputPayload.regressionRisks ?? ""), recommendations: String(input.inputPayload.recommendations ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "regression", status: created.status };
        }
        if (input.analysisType === "defect") {
            const created = await this.createDefectAnalysis(authUserId, email, { engagementId: input.engagementId, analysisKey: String(input.inputPayload.analysisKey ?? "DEF-AUTO"), title: String(input.inputPayload.title ?? "Defect Analysis"), rootCause: String(input.inputPayload.rootCause ?? ""), impactAnalysis: String(input.inputPayload.impactAnalysis ?? ""), remediation: String(input.inputPayload.remediation ?? "") }, fullName);
            return { analysisId: created.id, analysisType: "defect", status: created.status };
        }
        const created = await this.createCoverageAnalytics(authUserId, email, { engagementId: input.engagementId, analyticsKey: String(input.inputPayload.analyticsKey ?? "COV-AUTO"), name: String(input.inputPayload.name ?? "Coverage Analytics"), coverageMetrics: (input.inputPayload.coverageMetrics as unknown[]) ?? [], coveragePercent: Number(input.inputPayload.coveragePercent ?? 0), gaps: String(input.inputPayload.gaps ?? "") }, fullName);
        return { analysisId: created.id, analysisType: "coverage", status: created.status };
    }

    async getEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
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

    async getSolutionArchitectureOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saSolutionArchitectures.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.title }));
    }

    async getWorkPackageOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfWorkPackages.listByOrganization(context.organizationId)).map((w) => ({ id: w.id, name: w.title }));
    }

    async getBrdOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baBrds.listByOrganization(context.organizationId)).map((b) => ({ id: b.id, name: b.title }));
    }

    async getFrsOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baFrsDocuments.listByOrganization(context.organizationId)).map((f) => ({ id: f.id, name: f.title }));
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

export const qaEngineerService = new QaEngineerService();
