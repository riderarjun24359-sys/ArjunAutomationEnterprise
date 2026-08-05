"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { productionReadinessService } from "../services/production-readiness.service";
import type { ProductionReadinessSnapshot } from "../types";

export function useProductionReadiness() {
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState<ProductionReadinessSnapshot | null>(null);

    const ctx = user ? { authUserId: user.id, email: user.email, fullName: user.fullName } : null;

    const refresh = useCallback(async () => {
        if (!ctx) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await productionReadinessService.getSnapshot(ctx);
            setSnapshot(data);
        } finally {
            setLoading(false);
        }
    }, [ctx]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { loading, snapshot, refresh };
}

export type ProductionReadinessData = ReturnType<typeof useProductionReadiness>;
