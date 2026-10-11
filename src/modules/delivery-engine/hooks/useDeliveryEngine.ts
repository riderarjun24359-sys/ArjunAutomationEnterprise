"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { deliveryEngineService } from "../services/delivery-engine-orchestrator.service";
import type {
    AiDeliveryRecommendation,
    BlueprintRecord,
    ComponentRecord,
    CreateEngagementInput,
    CreateKnowledgeEntryInput,
    DeliveryAnalyticsSummary,
    DeliveryEngineDashboard,
    EngagementRecord,
    KnowledgeEntryRecord,
    PipelineRunRecord,
    QualityVerificationRecord,
} from "../types";
import type { ProjectSummary } from "@/src/modules/projects/types";

export function useDeliveryEngine() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<DeliveryEngineDashboard | null>(null);
    const [blueprints, setBlueprints] = useState<BlueprintRecord[]>([]);
    const [components, setComponents] = useState<ComponentRecord[]>([]);
    const [engagements, setEngagements] = useState<EngagementRecord[]>([]);
    const [pipelineRuns, setPipelineRuns] = useState<PipelineRunRecord[]>([]);
    const [qualityVerifications, setQualityVerifications] = useState<QualityVerificationRecord[]>([]);
    const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntryRecord[]>([]);
    const [analytics, setAnalytics] = useState<DeliveryAnalyticsSummary | null>(null);
    const [aiRecommendations, setAiRecommendations] = useState<AiDeliveryRecommendation[]>([]);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [actionError, setActionError] = useState<string | null>(null);

    const ctx = user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null;

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [dash, bp, comp, eng, pipes, qual, know, anal, ai, proj] = await Promise.all([
                deliveryEngineService.getDashboard(ctx),
                deliveryEngineService.getBlueprints(ctx),
                deliveryEngineService.getComponents(ctx),
                deliveryEngineService.getEngagements(ctx),
                deliveryEngineService.getPipelineRuns(ctx),
                deliveryEngineService.getQualityVerifications(ctx),
                deliveryEngineService.getKnowledgeEntries(ctx),
                deliveryEngineService.getAnalytics(ctx),
                deliveryEngineService.getAiRecommendations(ctx),
                deliveryEngineService.getProjects(ctx),
            ]);
            setDashboard(dash);
            setBlueprints(bp);
            setComponents(comp);
            setEngagements(eng);
            setPipelineRuns(pipes);
            setQualityVerifications(qual);
            setKnowledgeEntries(know);
            setAnalytics(anal);
            setAiRecommendations(ai);
            setProjects(proj);
        } finally {
            setLoading(false);
        }
    }, [ctx]);

    useEffect(() => {
        const id = window.setTimeout(() => {
            void refresh();
        }, 0);
        return () => window.clearTimeout(id);
    }, [refresh]);

    const createEngagement = useCallback(async (input: CreateEngagementInput) => {
        if (!ctx) return null;
        const result = await deliveryEngineService.createEngagement(ctx, input);
        await refresh();
        return result;
    }, [ctx, refresh]);

    const advanceStage = useCallback(async (engagementId: string) => {
        if (!ctx) return;
        setActionError(null);
        try {
            await deliveryEngineService.advancePlaybookStage(ctx, engagementId);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Stage advance failed");
        }
        await refresh();
    }, [ctx, refresh]);

    const runAllPipelines = useCallback(async (engagementId: string) => {
        if (!ctx) return;
        await deliveryEngineService.runAllPipelines(ctx, engagementId);
        await refresh();
    }, [ctx, refresh]);

    const verifyQuality = useCallback(async (engagementId: string) => {
        if (!ctx) return;
        await deliveryEngineService.verifyQuality(ctx, engagementId);
        await refresh();
    }, [ctx, refresh]);

    const addKnowledgeEntry = useCallback(async (input: CreateKnowledgeEntryInput) => {
        if (!ctx) return;
        await deliveryEngineService.addKnowledgeEntry(ctx, input);
        await refresh();
    }, [ctx, refresh]);

    const approveAiRecommendation = useCallback(async (id: string) => {
        if (!ctx) return;
        await deliveryEngineService.approveAiRecommendation(ctx, id);
        await refresh();
    }, [ctx, refresh]);

    const dismissAiRecommendation = useCallback(async (id: string) => {
        if (!ctx) return;
        await deliveryEngineService.dismissAiRecommendation(ctx, id);
        await refresh();
    }, [ctx, refresh]);

    return {
        loading,
        actionError,
        clearActionError: () => setActionError(null),
        dashboard,
        blueprints,
        components,
        engagements,
        pipelineRuns,
        qualityVerifications,
        knowledgeEntries,
        analytics,
        aiRecommendations,
        projects,
        refresh,
        createEngagement,
        advanceStage,
        runAllPipelines,
        verifyQuality,
        addKnowledgeEntry,
        approveAiRecommendation,
        dismissAiRecommendation,
    };
}

export type DeliveryEngineData = ReturnType<typeof useDeliveryEngine>;
