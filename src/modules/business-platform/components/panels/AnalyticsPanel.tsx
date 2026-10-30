"use client";

import { Card } from "@/src/design-os/components/Card";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

const MetricCard = ({ label, value }: { label: string, value: string | number }) => (
    <Card className="os-panel" hover>
        <p className="dos-text-caption text-[var(--dos-text-tertiary)]">{label}</p>
        <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-[var(--dos-text-primary)]">{value}</p>
    </Card>
);

export function AnalyticsPanel({ data }: { data: BusinessPlatformData }) {
    const sales = data.analytics?.salesStats;
    const finance = data.analytics?.financeStats;
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Pipeline value" value={`₹${(sales?.pipelineValue ?? 0).toLocaleString()}`} />
            <MetricCard label="Win rate" value={`${sales?.winRate ?? 0}%`} />
            <MetricCard label="Closed won" value={`₹${(sales?.closedWonValue ?? 0).toLocaleString()}`} />
            <MetricCard label="Revenue collected" value={finance?.paidRevenue ?? "₹0"} />
            <MetricCard label="Active projects" value={data.dashboard?.activeProjects ?? 0} />
            <MetricCard label="Analytics metrics" value={data.analytics?.metrics.length ?? 0} />
        </div>
    );
}
