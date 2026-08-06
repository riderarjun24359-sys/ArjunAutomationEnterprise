"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiCommandCenterService } from "../services/ai-command-center.service";
import type { AccRecommendation, AiCommandCenterDashboard } from "../types";

export function useAiCommandCenter() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<AiCommandCenterDashboard | null>(null);

    const ctx = user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null;

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await aiCommandCenterService.getDashboard(ctx);
            setDashboard(data);
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

    return { loading, dashboard, refresh, acceptRecommendation, dismissRecommendation };
}

export type AiCommandCenterData = ReturnType<typeof useAiCommandCenter>;
export type { AccRecommendation };
