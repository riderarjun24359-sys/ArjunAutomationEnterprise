"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type DashboardMockupProps = {
    className?: string;
};

export function DashboardMockup({ className }: DashboardMockupProps) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("relative rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-bg-secondary)] p-4 shadow-[var(--premium-shadow)]", className)}>
            <div className="flex items-center gap-2 border-b border-[var(--premium-border)] pb-3">
                <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="ml-2 h-5 flex-1 rounded-md bg-[var(--premium-glass)]" />
            </div>
            <div className="mt-4 grid grid-cols-12 gap-3">
                <div className="col-span-3 space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            className="h-8 rounded-lg bg-[var(--premium-glass)]"
                            animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                        />
                    ))}
                </div>
                <div className="col-span-9 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        {["Revenue", "Projects", "AI Tasks"].map((label, i) => (
                            <motion.div
                                key={label}
                                className="rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] p-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                            >
                                <p className="text-[10px] text-[var(--premium-fg-muted)]">{label}</p>
                                <p className="mt-1 text-lg font-semibold text-orange-600 dark:text-orange-400">
                                    {i === 0 ? "$2.4M" : i === 1 ? "47" : "128"}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="rounded-xl border border-[var(--premium-border)] bg-[var(--premium-glass)] p-4">
                        <div className="flex items-end gap-1.5 h-24">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 rounded-t bg-gradient-to-t from-orange-600 to-orange-400"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 rounded-lg bg-[var(--premium-glass)]" />
                        <div className="h-16 rounded-lg bg-[var(--premium-glass)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
