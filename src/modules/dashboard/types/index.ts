import type { AuditLog, Organization } from "@/src/modules/database/types/core";

export interface DashboardKpi {
    title: string;
    value: string;
    detail: string;
    trend: "up" | "down";
    tone?: "default" | "accent";
}

export interface DashboardActivityItem {
    id: string;
    title: string;
    detail: string;
    time: string;
    tag: string;
}

export interface DashboardOverview {
    organization: Organization | null;
    kpis: DashboardKpi[];
    activities: DashboardActivityItem[];
    teamCount: number;
    auditCount: number;
    taskCount: number;
    openTasks: number;
    source: "supabase" | "fallback";
}

export interface DashboardOverviewInput {
    organization: Organization | null;
    membershipsCount: number;
    auditLogs: AuditLog[];
    taskCount?: number;
    openTasks?: number;
}
