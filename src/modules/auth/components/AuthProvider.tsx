"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initialize, isHydrated } = useAuth();

    useEffect(() => {
        void initialize();
    }, [initialize]);

    if (!isHydrated) {
        return null;
    }

    return <>{children}</>;
}
