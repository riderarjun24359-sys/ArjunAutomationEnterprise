"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { shellService } from "@/src/modules/shell/services/shell.service";
import type { ShellContext } from "@/src/modules/shell/types";

export function useShellContext() {
    const user = useAuthStore((state) => state.user);
    const [context, setContext] = useState<ShellContext | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!user) {
            setContext(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const nextContext = await shellService.getContext(user.id, user.email, user.fullName);
            setContext(nextContext);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!user) {
                if (!cancelled) {
                    setContext(null);
                    setLoading(false);
                }
                return;
            }

            if (!cancelled) {
                setLoading(true);
            }

            try {
                const nextContext = await shellService.getContext(user.id, user.email, user.fullName);
                if (!cancelled) {
                    setContext(nextContext);
                }
            } catch (error) {
                console.error("[shell] Failed to load context", error);
                if (!cancelled) {
                    setContext(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [user]);

    return { context, loading, refresh: load };
}
