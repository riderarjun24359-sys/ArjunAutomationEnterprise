"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { ROUTES } from "@/src/constants/routes";
import { cn } from "@/src/lib/cn";
import { useAuth } from "@/src/hooks/useAuth";
import { useShellContext } from "@/src/modules/shell/hooks/useShellContext";

export function UserMenu() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { context } = useShellContext();
    const [open, setOpen] = useState(false);

    const displayName = useMemo(
        () => context?.profile?.full_name ?? user?.fullName ?? user?.email ?? "User",
        [context?.profile?.full_name, user?.email, user?.fullName],
    );

    const handleLogout = async () => {
        await signOut();
        router.push(ROUTES.auth.signIn);
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    <UserRound className="h-4 w-4" />
                </div>
                <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{displayName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{context?.organization?.name ?? "Enterprise workspace"}</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", open && "rotate-180")} />
            </button>

            {open ? (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-700">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{displayName}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleLogout()}
                        className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </button>
                </div>
            ) : null}
        </div>
    );
}
