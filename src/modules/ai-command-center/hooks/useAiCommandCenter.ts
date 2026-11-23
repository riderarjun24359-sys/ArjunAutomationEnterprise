"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiCommandCenterService } from "../services/ai-command-center.service";
import type { AccRecommendation, AiCommandCenterDashboard } from "../types";

export function useAiCommandCenter() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<AiCommandCenterDashboard | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const ctx = useMemo(() => user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null, [user?.id, user?.email, user?.fullName]);

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

    const updateRecommendation = useCallback(async (id: string, status: "accepted" | "dismissed") => {
        if (!dashboard) return;
        setActionError(null);
        try {
            const response = await fetch("/api/ai-command-center/recommendations", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ id, status }),
            });
            const result = await response.json() as { error?: string };
            if (!response.ok) throw new Error(result.error || "Could not save recommendation status");
            setDashboard((current) => current ? {
                ...current,
                recommendations: current.recommendations.map((item) => item.id === id ? { ...item, status } : item),
            } : current);
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Could not save recommendation status");
        }
    }, [dashboard]);

    const acceptRecommendation = useCallback((id: string) => updateRecommendation(id, "accepted"), [updateRecommendation]);
    const dismissRecommendation = useCallback((id: string) => updateRecommendation(id, "dismissed"), [updateRecommendation]);
    return { loading, dashboard, refresh, acceptRecommendation, dismissRecommendation, actionError };
}

export type AiCommandCenterData = ReturnType<typeof useAiCommandCenter>;
export type { AccRecommendation };
