"use client";

import { AppProvider } from "@/src/providers/AppProvider";
import { AuthProvider } from "@/src/modules/auth/components/AuthProvider";

/** App shell + auth routes only — keeps marketing pages free of auth/query JS. */
export function ShellProviders({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <AuthProvider>{children}</AuthProvider>
        </AppProvider>
    );
}
