"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/cn";
import type { ShellNavigationItem } from "@/src/config/shell-navigation";
import { m } from "framer-motion";
import { staggerItem } from "@/src/design-os/motion/variants";

interface NavLinkProps {
    item: ShellNavigationItem;
    collapsed?: boolean;
    onNavigate?: () => void;
}

export function NavLink({ item, collapsed = false, onNavigate }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;

    return (
        <m.div variants={staggerItem} className="relative">
            <Link
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={cn(
                    "dos-focus-ring group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                    "transition-colors duration-200",
                    isActive
                        ? "text-[var(--dos-text-primary)]"
                        : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]",
                )}
            >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--dos-brand-primary)]" : "text-[var(--dos-text-tertiary)] group-hover:text-[var(--dos-text-secondary)]")} />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
            {isActive && (
                <m.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 z-[-1] rounded-2xl bg-[var(--dos-surface-tertiary)] shadow-[var(--dos-shadow-glow)]"
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                />
            )}
        </m.div>
    );
}
