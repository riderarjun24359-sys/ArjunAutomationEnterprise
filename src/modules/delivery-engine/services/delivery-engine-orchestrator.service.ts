import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { deliveryEngineRepository } from "@/src/modules/database/repositories/delivery-engine-repository";
import { DELIVERY_ENGINE_STORAGE_KEY, DELIVERY_PLAYBOOK_STAGES, PIPELINE_TYPES } from "../constants";
import { initializeProjectViaMissionCore } from "../integrations/mission-core-bridge";
import { fetchProjects } from "../integrations/projects-bridge";
import {
    buildDashboardMetrics,
    buildDefaultAnalytics,
    canAdvanceToStage,
    generateAiRecommendations,
    recommendBlueprint,
    runAutomationPipeline,
    runQualityVerification,
    seedBlueprintLibrary,
} from "./delivery-engine.helpers";
import type {
    AiDeliveryRecommendation,
    BlueprintRecord,
    ComponentRecord,
    CreateEngagementInput,
    CreateKnowledgeEntryInput,
    DeliveryAnalyticsSummary,
    DeliveryEngineContext,
    DeliveryEngineDashboard,
    DeliveryEngineState,
    EngagementRecord,
    KnowledgeEntryRecord,
    PipelineRunRecord,
    PlaybookStage,
    QualityReport,
    QualityVerificationRecord,
} from "../types";

function loadState(): DeliveryEngineState {
    if (typeof window === "undefined") return { selectedEngagementId: null, updatedAt: new Date().toISOString() };
    try {
        const raw = localStorage.getItem(DELIVERY_ENGINE_STORAGE_KEY);
        if (!raw) return { selectedEngagementId: null, updatedAt: new Date().toISOString() };
        return JSON.parse(raw) as DeliveryEngineState;
    } catch {
        return { selectedEngagementId: null, updatedAt: new Date().toISOString() };
    }
}

function saveState(state: DeliveryEngineState) {
    if (typeof window === "undefined") return;
    localStorage.setItem(DELIVERY_ENGINE_STORAGE_KEY, JSON.stringify(state));
}

export class DeliveryEngineService {
    private async getOrgId(ctx: DeliveryEngineContext): Promise<string | null> {
        if (ctx.organizationId) return ctx.organizationId;
        const resolved = await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName);
        return resolved?.organizationId ?? null;
    }

    async ensureBlueprintLibrary(ctx: DeliveryEngineContext): Promise<BlueprintRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        let blueprints = await deliveryEngineRepository.listBlueprints(orgId);
        if (blueprints.length === 0) {
            for (const bp of seedBlueprintLibrary(orgId)) {
                await deliveryEngineRepository.upsertBlueprint(orgId, bp);
            }
            blueprints = await deliveryEngineRepository.listBlueprints(orgId);
        }
        return blueprints;
    }

    async getDashboard(ctx: DeliveryEngineContext): Promise<DeliveryEngineDashboard> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) {
            return buildDashboardMetrics(10, 0, [], 100, 100, 0, 0);
        }

        const [blueprints, components, engagements, pipelines, quality, knowledge, aiRecs] = await Promise.all([
            this.ensureBlueprintLibrary(ctx),
            deliveryEngineRepository.listComponents(orgId),
            deliveryEngineRepository.listEngagements(orgId),
            deliveryEngineRepository.listPipelineRuns(orgId),
            deliveryEngineRepository.listQualityVerifications(orgId),
            deliveryEngineRepository.listKnowledgeEntries(orgId),
            deliveryEngineRepository.listAiRecommendations(orgId),
        ]);

        const pipelinePassRate = pipelines.length ? Math.round((pipelines.filter((p) => p.status === "passed").length / pipelines.length) * 100) : 100;
        const qualityPassRate = quality.length ? Math.round((quality.filter((q) => q.passed).length / quality.length) * 100) : 100;

        return buildDashboardMetrics(
            blueprints.length,
            components.length,
            engagements,
            pipelinePassRate,
            qualityPassRate,
            knowledge.length,
            aiRecs.filter((r) => r.status === "pending").length,
        );
    }

    async getBlueprints(ctx: DeliveryEngineContext): Promise<BlueprintRecord[]> {
        return this.ensureBlueprintLibrary(ctx);
    }

    async getComponents(ctx: DeliveryEngineContext): Promise<ComponentRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        return deliveryEngineRepository.listComponents(orgId);
    }

    async getEngagements(ctx: DeliveryEngineContext): Promise<EngagementRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        return deliveryEngineRepository.listEngagements(orgId);
    }

    async getPipelineRuns(ctx: DeliveryEngineContext): Promise<PipelineRunRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        return deliveryEngineRepository.listPipelineRuns(orgId);
    }

    async getQualityVerifications(ctx: DeliveryEngineContext): Promise<QualityVerificationRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        return deliveryEngineRepository.listQualityVerifications(orgId);
    }

    async getKnowledgeEntries(ctx: DeliveryEngineContext): Promise<KnowledgeEntryRecord[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        return deliveryEngineRepository.listKnowledgeEntries(orgId);
    }

    async getAnalytics(ctx: DeliveryEngineContext): Promise<DeliveryAnalyticsSummary> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return buildDefaultAnalytics(0, 0);
        const engagements = await deliveryEngineRepository.listEngagements(orgId);
        const completed = engagements.filter((e) => e.status === "completed").length;
        return buildDefaultAnalytics(engagements.length, completed);
    }

    async getAiRecommendations(ctx: DeliveryEngineContext): Promise<AiDeliveryRecommendation[]> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return [];
        let recs = await deliveryEngineRepository.listAiRecommendations(orgId);
        if (recs.length === 0) {
            const engagements = await deliveryEngineRepository.listEngagements(orgId);
            for (const rec of generateAiRecommendations(engagements)) {
                await deliveryEngineRepository.createAiRecommendation(orgId, rec);
            }
            recs = await deliveryEngineRepository.listAiRecommendations(orgId);
        }
        return recs;
    }

    async createEngagement(ctx: DeliveryEngineContext, input: CreateEngagementInput): Promise<EngagementRecord | null> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return null;
        const bp = input.blueprintKey ?? recommendBlueprint(input.title)?.key ?? "";
        const engagement = await deliveryEngineRepository.createEngagement(orgId, { ...input, blueprintKey: bp });
        if (engagement) {
            await initializeProjectViaMissionCore({ engagementId: engagement.id, title: input.title, blueprintKey: bp });
        }
        return engagement;
    }

    async advancePlaybookStage(ctx: DeliveryEngineContext, engagementId: string): Promise<EngagementRecord | null> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return null;
        const engagements = await deliveryEngineRepository.listEngagements(orgId);
        const current = engagements.find((e) => e.id === engagementId);
        if (!current) return null;
        const idx = DELIVERY_PLAYBOOK_STAGES.findIndex((s) => s.id === current.playbookStage);
        const next = DELIVERY_PLAYBOOK_STAGES[Math.min(idx + 1, DELIVERY_PLAYBOOK_STAGES.length - 1)];
        if (next.id !== current.playbookStage) {
            const verifications = (await deliveryEngineRepository.listQualityVerifications(orgId)).filter(
                (v) => v.engagementId === engagementId,
            );
            const gate = canAdvanceToStage(next.id, verifications);
            if (!gate.allowed) throw new Error(gate.reason);
        }
        return deliveryEngineRepository.updateEngagementStage(orgId, engagementId, next.id as PlaybookStage);
    }

    async runPipeline(ctx: DeliveryEngineContext, engagementId: string, pipelineType: PipelineRunRecord["pipelineType"]): Promise<PipelineRunRecord | null> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return null;
        const result = runAutomationPipeline(pipelineType, engagementId);
        return deliveryEngineRepository.createPipelineRun(orgId, result);
    }

    async runAllPipelines(ctx: DeliveryEngineContext, engagementId: string): Promise<PipelineRunRecord[]> {
        const runs: PipelineRunRecord[] = [];
        for (const p of PIPELINE_TYPES) {
            const run = await this.runPipeline(ctx, engagementId, p.id as PipelineRunRecord["pipelineType"]);
            if (run) runs.push(run);
        }
        return runs;
    }

    async verifyQuality(ctx: DeliveryEngineContext, engagementId: string): Promise<QualityReport> {
        const orgId = await this.getOrgId(ctx);
        const report = runQualityVerification(engagementId);
        if (orgId) {
            for (const dim of report.dimensions) {
                await deliveryEngineRepository.createQualityVerification(orgId, {
                    engagementId,
                    dimension: dim.dimension,
                    score: dim.score,
                    passed: dim.passed,
                    findings: dim.findings,
                });
            }
        }
        return report;
    }

    async addKnowledgeEntry(ctx: DeliveryEngineContext, input: CreateKnowledgeEntryInput): Promise<KnowledgeEntryRecord | null> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return null;
        return deliveryEngineRepository.createKnowledgeEntry(orgId, input);
    }

    async approveAiRecommendation(ctx: DeliveryEngineContext, id: string): Promise<void> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return;
        await deliveryEngineRepository.updateAiRecommendationStatus(orgId, id, "approved");
    }

    async dismissAiRecommendation(ctx: DeliveryEngineContext, id: string): Promise<void> {
        const orgId = await this.getOrgId(ctx);
        if (!orgId) return;
        await deliveryEngineRepository.updateAiRecommendationStatus(orgId, id, "dismissed");
    }

    async getProjects(ctx: DeliveryEngineContext) {
        return fetchProjects(ctx.authUserId, ctx.email, ctx.fullName);
    }

    getState(): DeliveryEngineState {
        return loadState();
    }

    setSelectedEngagement(engagementId: string | null) {
        saveState({ selectedEngagementId: engagementId, updatedAt: new Date().toISOString() });
    }
}

export const deliveryEngineService = new DeliveryEngineService();
