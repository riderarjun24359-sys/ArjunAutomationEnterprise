"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { customerSuccessGlobalOpsService } from "../services/customer-success-global-ops.service";
import type { GlobalOperationsDashboard } from "../types";

export function useCustomerSuccessGlobalOps() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<GlobalOperationsDashboard | null>(null);

    const ctx = user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null;

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await customerSuccessGlobalOpsService.getDashboard(ctx);
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

    return { loading, dashboard, refresh };
}

export type CustomerSuccessGlobalOpsData = ReturnType<typeof useCustomerSuccessGlobalOps>;
