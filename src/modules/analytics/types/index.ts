export type MetricCategory = "finance" | "clients" | "delivery" | "automation" | "general";
export type WidgetType = "kpi" | "chart" | "table";
export type ChartType = "line" | "bar" | "pie" | "area";
export type ReportType = "summary" | "finance" | "clients" | "delivery" | "automation";
export type ReportStatus = "draft" | "published" | "archived";
export type AnalyticsCategoryFilter = "all" | MetricCategory;

export interface AnalyticsChartPoint {
    label: string;
    value: number;
    category?: string;
}

export interface AnalyticsWidget {
    id: string;
    dashboardId: string;
    title: string;
    widgetType: WidgetType;
    metricKey: string;
    chartType: ChartType;
    config: Record<string, unknown>;
    sortOrder: number;
}

export interface AnalyticsDashboard {
    id: string;
    name: string;
    description: string;
    isDefault: boolean;
    layout: Record<string, unknown>;
    widgets: AnalyticsWidget[];
    updatedAt: string;
}

export interface AnalyticsMetric {
    id: string;
    metricKey: string;
    label: string;
    category: MetricCategory;
    value: number;
    unit: string;
    periodStart: string | null;
    periodEnd: string | null;
    metadata: Record<string, unknown>;
}

export interface AnalyticsReport {
    id: string;
    name: string;
    reportType: ReportType;
    status: ReportStatus;
    filters: Record<string, unknown>;
    summary: Record<string, unknown>;
    generatedAt: string | null;
    updatedAt: string;
}

export interface AnalyticsDashboardStats {
    totalRevenue: string;
    outstandingInvoices: string;
    activeClients: string;
    activeProjects: string;
    openTasks: string;
    workflowSuccessRate: string;
    storedMetrics: string;
}

export interface RevenueAnalytics {
    paidTotal: number;
    outstanding: number;
    expenseTotal: number;
    paymentTotal: number;
    revenueTrend: AnalyticsChartPoint[];
    expenseBreakdown: AnalyticsChartPoint[];
}

export interface DeliveryAnalytics {
    activeProjects: number;
    averageProgress: number;
    openTasks: number;
    completedTasks: number;
    blockedTasks: number;
    tasksByStatus: AnalyticsChartPoint[];
    projectProgress: AnalyticsChartPoint[];
}

export interface ClientAnalytics {
    activeClients: number;
    atRiskClients: number;
    leads: number;
    totalRevenue: number;
    clientsByStage: AnalyticsChartPoint[];
    topClients: AnalyticsChartPoint[];
}

export interface AutomationInsights {
    activeWorkflows: number;
    completedExecutions: number;
    failedExecutions: number;
    runningExecutions: number;
    successRate: number;
    executionsByStatus: AnalyticsChartPoint[];
    topWorkflows: AnalyticsChartPoint[];
}

export interface AnalyticsSummary {
    revenuePaid: number;
    revenueOutstanding: number;
    expenseTotal: number;
    activeClients: number;
    activeProjects: number;
    openTasks: number;
    workflowSuccessRate: number;
    monthlyTrend: AnalyticsChartPoint[];
}

export interface CreateReportInput {
    name: string;
    reportType: ReportType;
    status?: ReportStatus;
    filters?: Record<string, unknown>;
    summary?: Record<string, unknown>;
}
