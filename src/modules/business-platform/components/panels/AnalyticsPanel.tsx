"use client";

import { Card } from "@/src/design-os/components/Card";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function AnalyticsPanel({ data }: { data: BusinessPlatformData }) {
    const sales = data.analytics?.salesStats;
    const finance = data.analytics?.financeStats;
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Pipeline value</p><p className="mt-1 text-2xl font-bold">${(sales?.pipelineValue ?? 0).toLocaleString()}</p></Card>
            <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Win rate</p><p className="mt-1 text-2xl font-bold">{sales?.winRate ?? 0}%</p></Card>
            <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Closed won</p><p className="mt-1 text-2xl font-bold">${(sales?.closedWonValue ?? 0).toLocaleString()}</p></Card>
            <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Revenue collected</p><p className="mt-1 text-2xl font-bold">{finance?.paidRevenue ?? "$0"}</p></Card>
            <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Active projects</p><p className="mt-1 text-2xl font-bold">{data.dashboard?.activeProjects ?? 0}</p></Card>
            <Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Analytics metrics</p><p className="mt-1 text-2xl font-bold">{data.analytics?.metrics.length ?? 0}</p></Card>
        </div>
    );
}
