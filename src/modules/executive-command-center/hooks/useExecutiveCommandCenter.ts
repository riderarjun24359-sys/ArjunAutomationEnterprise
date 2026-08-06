"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { useExecutiveShellStore } from "@/src/store/executive.store";
import { executiveCommandCenterService } from "../services/executive-command-center.service";
import type { ExecutiveCommandCenterSnapshot } from "../types";

export function useExecutiveCommandCenter() {
    const user = useAuthStore((s) => s.user);
    const setSnapshot = useExecutiveShellStore((s) => s.setSnapshot);
    const [snapshot, setLocalSnapshot] = useState<ExecutiveCommandCenterSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setLocalSnapshot(null);
                    setSnapshot(null);
                    setError(null);
                    setLoading(false);
                }
                return;
            }

            if (!cancelled) {
                setLoading(true);
                setError(null);
            }

            try {
                const data = await executiveCommandCenterService.getSnapshot(user.id, user.email, user.fullName);
                if (!cancelled) {
                    setLocalSnapshot(data);
                    setSnapshot(data);
                    setError(null);
                }
            } catch (err) {
                console.error("[executive-command-center] Failed to load snapshot", err);
                if (!cancelled) {
                    setLocalSnapshot(null);
                    setSnapshot(null);
                    setError(err instanceof Error ? err.message : "Failed to load executive dashboard");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        // Defer to satisfy react-hooks/set-state-in-effect while keeping sync user-gate paths correct.
        const timer = window.setTimeout(() => {
            void load();
        }, 0);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [user, setSnapshot]);

    return { snapshot, loading, error };
}
