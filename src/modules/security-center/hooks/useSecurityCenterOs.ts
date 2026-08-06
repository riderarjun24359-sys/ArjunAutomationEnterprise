"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { securityCenterOsService } from "../services/security-center-os.service";
import type { SecurityCenterSnapshot } from "../types/os";

export function useSecurityCenterOs() {
    const user = useAuthStore((s) => s.user);
    const [snapshot, setSnapshot] = useState<SecurityCenterSnapshot | null>(null);
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
                    const data = await securityCenterOsService.getSnapshot(user.id, user.email, user.fullName);
                    if (!cancelled) setSnapshot(data);
                } catch (err) {
                    if (!cancelled) {
                        setError(err instanceof Error ? err.message : "Failed to load Security Center OS");
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
