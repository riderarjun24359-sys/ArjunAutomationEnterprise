"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiCommandCenterService } from "../services/ai-command-center.service";
import type { AccRecommendation, AiCommandCenterDashboard } from "../types";

export function useAiCommandCenter() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboard, setDashboard] = useState<AiCommandCenterDashboard | null>(null);

    const ctx = useMemo(
        () => user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null,
        [user],
    );

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            setDashboard(null);
            setError("Sign in to load the AI Command Center.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await aiCommandCenterService.getDashboard(ctx);
            setDashboard(data);
        } catch (cause) {
            setDashboard(null);
            setError(cause instanceof Error ? cause.message : "Unable to load AI Command Center data.");
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

    const acceptRecommendation = useCallback((id: string) => {
        if (!dashboard) return;
        const updated = aiCommandCenterService.acceptRecommendation(dashboard.recommendations, id);
        setDashboard({ ...dashboard, recommendations: updated });
    }, [dashboard]);

    const dismissRecommendation = useCallback((id: string) => {
        if (!dashboard) return;
        const updated = aiCommandCenterService.dismissRecommendation(dashboard.recommendations, id);
        setDashboard({ ...dashboard, recommendations: updated });
    }, [dashboard]);

    return { loading, error, dashboard, refresh, acceptRecommendation, dismissRecommendation };
}

export type AiCommandCenterData = ReturnType<typeof useAiCommandCenter>;
export type { AccRecommendation };
