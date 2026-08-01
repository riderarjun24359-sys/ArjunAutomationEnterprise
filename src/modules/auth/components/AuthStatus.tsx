"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { ROUTES } from "@/src/constants/routes";
import { authService } from "@/src/services/auth.service";

export function AuthStatus() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const label = useMemo(() => (isAuthenticated ? `Signed in as ${user?.email ?? "user"}` : "Not authenticated"), [isAuthenticated, user?.email]);

    const handleLogout = async () => {
        await authService.signOut();
        clearAuth();
    };

    return (
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <span>{label}</span>
            {isAuthenticated ? (
                <button onClick={handleLogout} className="font-medium text-slate-950 transition hover:text-slate-700 dark:text-white">
                    Logout
                </button>
            ) : (
                <Link href={ROUTES.auth.signIn} className="font-medium text-slate-950 transition hover:text-slate-700 dark:text-white">
                    Login
                </Link>
            )}
        </div>
    );
}
