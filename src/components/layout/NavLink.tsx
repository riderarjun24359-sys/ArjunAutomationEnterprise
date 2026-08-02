"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/cn";
import type { ShellNavigationItem } from "@/src/config/shell-navigation";

interface NavLinkProps {
    item: ShellNavigationItem;
    collapsed?: boolean;
    onNavigate?: () => void;
}

export function NavLink({ item, collapsed = false, onNavigate }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
        >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-emerald-600 dark:text-emerald-300" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200")} />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
        </Link>
    );
}
