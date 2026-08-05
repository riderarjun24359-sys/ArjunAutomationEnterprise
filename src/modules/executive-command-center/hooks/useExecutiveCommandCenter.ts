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

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setLocalSnapshot(null);
                    setSnapshot(null);
                    setLoading(false);
                }
                return;
            }

            if (!cancelled) setLoading(true);

            try {
                const data = await executiveCommandCenterService.getSnapshot(user.id, user.email, user.fullName);
                if (!cancelled) {
                    setLocalSnapshot(data);
                    setSnapshot(data);
                }
            } catch (error) {
                console.error("[executive-command-center] Failed to load snapshot", error);
                if (!cancelled) {
                    setLocalSnapshot(null);
                    setSnapshot(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();
        return () => { cancelled = true; };
    }, [user, setSnapshot]);

    return { snapshot, loading };
}
