"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { executiveAiEcosystemService } from "../services/executive-ai-ecosystem.service";
import type { AgentRecommendation, ExecutiveAiEcosystemDashboard, OrchestratorResult } from "../types";

export function useExecutiveAiEcosystem() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<ExecutiveAiEcosystemDashboard | null>(null);
    const [orchestratorResult, setOrchestratorResult] = useState<(OrchestratorResult & { collaboration: ExecutiveAiEcosystemDashboard["collaborationHistory"] }) | null>(null);

    const ctx = user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null;

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await executiveAiEcosystemService.getDashboard(ctx);
            setDashboard(data);
        } finally {
            setLoading(false);
        }
    }, [ctx]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const runOrchestration = useCallback(async (taskType: string) => {
        if (!ctx) return;
        const result = await executiveAiEcosystemService.runOrchestration(ctx, taskType);
        setOrchestratorResult(result);
        await refresh();
    }, [ctx, refresh]);

    const approveRecommendation = useCallback((id: string) => {
        if (!dashboard) return;
        const updated = executiveAiEcosystemService.approveRecommendation(ctx!, id, dashboard.recommendations);
        setDashboard({ ...dashboard, recommendations: updated, pendingApprovals: dashboard.pendingApprovals.filter((a) => a.recommendationId !== id) });
    }, [ctx, dashboard]);

    const dismissRecommendation = useCallback((id: string) => {
        if (!dashboard) return;
        const updated = executiveAiEcosystemService.dismissRecommendation(ctx!, id, dashboard.recommendations);
        setDashboard({ ...dashboard, recommendations: updated });
    }, [ctx, dashboard]);

    return { loading, dashboard, orchestratorResult, refresh, runOrchestration, approveRecommendation, dismissRecommendation };
}

export type ExecutiveAiEcosystemData = ReturnType<typeof useExecutiveAiEcosystem>;
