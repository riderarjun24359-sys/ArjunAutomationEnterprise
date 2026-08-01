"use client";

import { QueryProvider } from "@/src/providers/QueryProvider";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { ToastProvider } from "@/src/providers/ToastProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>
                <ToastProvider />
                {children}
            </QueryProvider>
        </ThemeProvider>
    );
}
