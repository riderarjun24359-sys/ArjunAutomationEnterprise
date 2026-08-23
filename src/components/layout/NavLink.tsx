"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/cn";
import type { ShellNavigationItem } from "@/src/config/shell-navigation";
import { m } from "framer-motion";
import { staggerItem } from "@/src/design-os/motion/variants";

import { NavContextItem } from "@/src/design-os/navigation/types";

interface NavLinkProps {
    item: ShellNavigationItem | NavContextItem;
    collapsed?: boolean;
    onNavigate?: () => void;
}

export function NavLink({ item, collapsed = false, onNavigate }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;
    const contextItem = item as NavContextItem;

    return (
        <m.div variants={staggerItem} className="relative">
            <Link
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? `${item.label}${contextItem.reason ? ` - ${contextItem.reason}` : ''}` : undefined}
                className={cn(
                    "dos-focus-ring group flex flex-col rounded-lg px-3 py-2 text-sm",
                    "transition-colors duration-200",
                    isActive
                        ? "text-[var(--dos-text-primary)]"
                        : "text-[var(--dos-text-secondary)] hover:text-[var(--dos-text-primary)]",
                )}
            >
                <div className="flex items-center gap-3 font-medium">
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--dos-brand-primary)]" : "text-[var(--dos-text-tertiary)] group-hover:text-[var(--dos-text-secondary)]")} />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </div>
                {!collapsed && contextItem.reason ? (
                    <span className="mt-1 pl-7 text-[10px] font-medium uppercase tracking-wider text-[var(--dos-text-tertiary)]">
                        {contextItem.reason}
                    </span>
                ) : null}
            </Link>
            {isActive && (
                <m.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 z-[-1] rounded-lg bg-[var(--dos-surface-active)]"
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                />
            )}
        </m.div>
    );
}
