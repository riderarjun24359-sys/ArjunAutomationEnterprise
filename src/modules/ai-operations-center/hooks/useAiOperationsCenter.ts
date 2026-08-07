"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiOperationsCenterService } from "../services/ai-operations-center.service";
import type { AiOperationsCenterSnapshot } from "../types";

export function useAiOperationsCenter() {
    const user = useAuthStore((s) => s.user);
    const [snapshot, setSnapshot] = useState<AiOperationsCenterSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const timer = window.setTimeout(() => {
            void (async () => {
                if (!user) {
                    if (!cancelled) {
                        setSnapshot(null);
                        setLoading(false);
                        setError(null);
                    }
                    return;
                }
                if (!cancelled) {
                    setLoading(true);
                    setError(null);
                }
                try {
                    const data = await aiOperationsCenterService.getSnapshot(
                        user.id,
                        user.email,
                        user.fullName,
                        user.role,
                    );
                    if (!cancelled) setSnapshot(data);
                } catch (err) {
                    if (!cancelled) {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "Failed to load AI Operations & Monitoring Center",
                        );
                        setSnapshot(null);
                    }
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
        }, 0);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [user]);

    return { snapshot, loading, error };
}
