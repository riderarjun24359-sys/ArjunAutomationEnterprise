"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { dashboardService } from "@/src/modules/dashboard/services/dashboard.service";
import type { DashboardOverview } from "@/src/modules/dashboard/types";

export function useDashboard() {
    const user = useAuthStore((state) => state.user);
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setOverview(null);
                    setLoading(false);
                }
                return;
            }

            if (!cancelled) {
                setLoading(true);
            }

            try {
                const data = await dashboardService.getOverview(user.id, user.email, user.fullName);
                if (!cancelled) {
                    setOverview(data);
                }
            } catch (error) {
                console.error("[dashboard] Failed to load overview", error);
                if (!cancelled) {
                    setOverview(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [user]);

    return { overview, loading };
}
