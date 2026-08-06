"use client";

import { useImmersivePerformance } from "../hooks/useImmersivePerformance";

export function ImmersiveProvider({ children }: { children: React.ReactNode }) {
    useImmersivePerformance();
    return <>{children}</>;
}
