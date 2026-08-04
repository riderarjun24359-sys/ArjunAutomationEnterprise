"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/src/design-os/components/Card";
import { AnimatedCounter } from "@/src/design-os/motion/components/AnimatedCounter";
import { cn } from "@/src/lib/cn";

export function KpiCard({ title, value, suffix, trend, trendLabel, className }: { title: string; value: number; suffix?: string; trend?: "up" | "down"; trendLabel?: string; className?: string }) {
    return (
        <Card hover className={cn(className)}>
            <p className="text-sm font-medium text-[var(--dos-text-secondary)]">{title}</p>
            <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold text-[var(--dos-text-primary)]">
                    <AnimatedCounter value={value} suffix={suffix} />
                </p>
                {trend ? (
                    <div className={cn("flex items-center gap-1 rounded-[var(--dos-radius-lg)] px-2 py-1 text-xs font-medium", trend === "up" ? "bg-[var(--dos-success-muted)] text-[var(--dos-success)]" : "bg-[var(--dos-error-muted)] text-[var(--dos-error)]")}>
                        {trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {trendLabel}
                    </div>
                ) : null}
            </div>
            <div className="mt-4 h-8 rounded-[var(--dos-radius-md)] bg-gradient-to-r from-[var(--dos-brand-primary)]/20 to-transparent" aria-hidden="true" />
        </Card>
    );
}
