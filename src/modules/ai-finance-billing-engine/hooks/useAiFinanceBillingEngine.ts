"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { aiFinanceBillingEngineService } from "../services/ai-finance-billing-engine.service";
import type { AiFinanceBillingEngineSnapshot, CreateInvoiceInput } from "../types";

export function useAiFinanceBillingEngine() {
    const user = useAuthStore((s) => s.user);
    const [snapshot, setSnapshot] = useState<AiFinanceBillingEngineSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const reload = useCallback(async () => {
        if (!user) {
            setSnapshot(null);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await aiFinanceBillingEngineService.getSnapshot(
                user.id,
                user.email,
                user.fullName,
                user.role,
            );
            setSnapshot(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load AI Finance & Billing Engine");
            setSnapshot(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        let cancelled = false;
        const timer = window.setTimeout(() => {
            void (async () => {
                if (cancelled) return;
                await reload();
            })();
        }, 0);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [reload]);

    const createInvoice = useCallback(
        async (input: CreateInvoiceInput) => {
            if (!user) return { ok: false as const, error: "Not signed in" };
            setCreating(true);
            try {
                const result = await aiFinanceBillingEngineService.createInvoice(
                    user.id,
                    user.email,
                    input,
                    user.fullName,
                    user.role,
                );
                if (result.ok) await reload();
                return result;
            } finally {
                setCreating(false);
            }
        },
        [user, reload],
    );

    return { snapshot, loading, error, creating, createInvoice, reload };
}
