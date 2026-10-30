import type {
    DbAnalyticsDashboard,
    DbAnalyticsMetric,
    DbAnalyticsReport,
    DbAnalyticsWidget,
    DbClient,
    DbExpense,
    DbInvoice,
    DbPayment,
    DbProject,
    DbTask,
    DbWorkflow,
    DbWorkflowExecution,
} from "@/src/modules/database/types/platform";
import type {
    AnalyticsChartPoint,
    AnalyticsDashboard,
    AnalyticsDashboardStats,
    AnalyticsMetric,
    AnalyticsReport,
    AnalyticsSummary,
    AnalyticsWidget,
    ClientAnalytics,
    CreateReportInput,
    DeliveryAnalytics,
    RevenueAnalytics,
    AutomationInsights,
} from "@/src/modules/analytics/types";

export const mapAnalyticsDashboard = (record: DbAnalyticsDashboard, widgets: AnalyticsWidget[]): AnalyticsDashboard => ({
    id: record.id,
    name: record.name,
    description: record.description,
    isDefault: record.is_default,
    layout: record.layout,
    widgets,
    updatedAt: record.updated_at,
});

export const mapAnalyticsWidget = (record: DbAnalyticsWidget): AnalyticsWidget => ({
    id: record.id,
    dashboardId: record.dashboard_id,
    title: record.title,
    widgetType: record.widget_type as AnalyticsWidget["widgetType"],
    metricKey: record.metric_key,
    chartType: record.chart_type as AnalyticsWidget["chartType"],
    config: record.config,
    sortOrder: record.sort_order,
});

export const mapAnalyticsMetric = (record: DbAnalyticsMetric): AnalyticsMetric => ({
    id: record.id,
    metricKey: record.metric_key,
    label: record.label,
    category: record.category as AnalyticsMetric["category"],
    value: Number(record.value),
    unit: record.unit,
    periodStart: record.period_start ?? null,
    periodEnd: record.period_end ?? null,
    metadata: record.metadata,
});

export const mapAnalyticsReport = (record: DbAnalyticsReport): AnalyticsReport => ({
    id: record.id,
    name: record.name,
    reportType: record.report_type as AnalyticsReport["reportType"],
    status: record.status as AnalyticsReport["status"],
    filters: record.filters,
    summary: record.summary,
    generatedAt: record.generated_at ?? null,
    updatedAt: record.updated_at,
});

export const buildReportPayload = (organizationId: string, input: CreateReportInput) => ({
    organization_id: organizationId,
    name: input.name,
    report_type: input.reportType,
    status: input.status ?? "draft",
    filters: input.filters ?? {},
    summary: input.summary ?? {},
    generated_at: input.status === "published" ? new Date().toISOString() : null,
});

export const buildAnalyticsActivityPayload = (
    organizationId: string,
    entityType: string,
    entityId: string,
    action: string,
    title: string,
    detail: string,
) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    title,
    detail,
    metadata: {},
});

const parseCurrency = (value: string | number | null | undefined): number => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const parsed = Number(String(value).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
};

export const buildRevenueAnalytics = (input: {
    invoices: DbInvoice[];
    payments: DbPayment[];
    expenses: DbExpense[];
}): RevenueAnalytics => {
    const paidTotal = input.invoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
    const outstanding = input.invoices
        .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
        .reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0);
    const expenseTotal = input.expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
    const paymentTotal = input.payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);

    const revenueTrend: AnalyticsChartPoint[] = input.invoices.map((invoice) => ({
        label: invoice.number,
        value: Number(invoice.total ?? 0),
        category: invoice.status,
    }));

    const expenseBreakdown: AnalyticsChartPoint[] = Object.entries(
        input.expenses.reduce<Record<string, number>>((acc, expense) => {
            acc[expense.category] = (acc[expense.category] ?? 0) + Number(expense.amount ?? 0);
            return acc;
        }, {}),
    ).map(([label, value]) => ({ label, value }));

    return {
        paidTotal,
        outstanding,
        expenseTotal,
        paymentTotal,
        revenueTrend,
        expenseBreakdown,
    };
};

export const buildDeliveryAnalytics = (input: {
    projects: DbProject[];
    tasks: DbTask[];
}): DeliveryAnalytics => {
    const activeProjects = input.projects.filter((project) => project.status === "active").length;
    const averageProgress =
        input.projects.length === 0
            ? 0
            : Math.round(input.projects.reduce((sum, project) => sum + Number(project.progress ?? 0), 0) / input.projects.length);

    const openTasks = input.tasks.filter((task) => task.status !== "done").length;
    const completedTasks = input.tasks.filter((task) => task.status === "done").length;
    const blockedTasks = input.tasks.filter((task) => task.status === "blocked").length;

    const tasksByStatus: AnalyticsChartPoint[] = Object.entries(
        input.tasks.reduce<Record<string, number>>((acc, task) => {
            acc[task.status] = (acc[task.status] ?? 0) + 1;
            return acc;
        }, {}),
    ).map(([label, value]) => ({ label, value }));

    const projectProgress: AnalyticsChartPoint[] = input.projects.map((project) => ({
        label: project.name,
        value: Number(project.progress ?? 0),
    }));

    return {
        activeProjects,
        averageProgress,
        openTasks,
        completedTasks,
        blockedTasks,
        tasksByStatus,
        projectProgress,
    };
};

export const buildClientAnalytics = (input: { clients: DbClient[] }): ClientAnalytics => {
    const activeClients = input.clients.filter((client) => client.status === "active").length;
    const atRiskClients = input.clients.filter((client) => client.status === "at_risk").length;
    const leads = input.clients.filter((client) => client.lifecycle_stage !== "client").length;
    const totalRevenue = input.clients.reduce((sum, client) => sum + parseCurrency(client.revenue), 0);

    const clientsByStage: AnalyticsChartPoint[] = Object.entries(
        input.clients.reduce<Record<string, number>>((acc, client) => {
            const stage = client.lifecycle_stage ?? "unknown";
            acc[stage] = (acc[stage] ?? 0) + 1;
            return acc;
        }, {}),
    ).map(([label, value]) => ({ label, value }));

    const topClients: AnalyticsChartPoint[] = input.clients
        .map((client) => ({ label: client.name, value: parseCurrency(client.revenue) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return {
        activeClients,
        atRiskClients,
        leads,
        totalRevenue,
        clientsByStage,
        topClients,
    };
};

export const buildAutomationInsights = (input: {
    workflows: DbWorkflow[];
    executions: DbWorkflowExecution[];
}): AutomationInsights => {
    const activeWorkflows = input.workflows.filter((workflow) => workflow.status === "active").length;
    const completed = input.executions.filter((execution) => execution.status === "completed").length;
    const failed = input.executions.filter((execution) => execution.status === "failed").length;
    const running = input.executions.filter((execution) => execution.status === "running").length;
    const successRate = input.executions.length === 0 ? 0 : Math.round((completed / input.executions.length) * 100);

    const executionsByStatus: AnalyticsChartPoint[] = Object.entries(
        input.executions.reduce<Record<string, number>>((acc, execution) => {
            acc[execution.status] = (acc[execution.status] ?? 0) + 1;
            return acc;
        }, {}),
    ).map(([label, value]) => ({ label, value }));

    const workflowMap = new Map(input.workflows.map((workflow) => [workflow.id, workflow.name]));
    const topWorkflows: AnalyticsChartPoint[] = Object.entries(
        input.executions.reduce<Record<string, number>>((acc, execution) => {
            const name = workflowMap.get(execution.workflow_id) ?? "Unknown";
            acc[name] = (acc[name] ?? 0) + 1;
            return acc;
        }, {}),
    )
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return {
        activeWorkflows,
        completedExecutions: completed,
        failedExecutions: failed,
        runningExecutions: running,
        successRate,
        executionsByStatus,
        topWorkflows,
    };
};

export const buildAnalyticsDashboardStats = (input: {
    metrics: AnalyticsMetric[];
    revenue: RevenueAnalytics;
    delivery: DeliveryAnalytics;
    clients: ClientAnalytics;
    automation: AutomationInsights;
}): AnalyticsDashboardStats => ({
    totalRevenue: `₹${input.revenue.paidTotal.toLocaleString()}`,
    outstandingInvoices: `₹${input.revenue.outstanding.toLocaleString()}`,
    activeClients: String(input.clients.activeClients),
    activeProjects: String(input.delivery.activeProjects),
    openTasks: String(input.delivery.openTasks),
    workflowSuccessRate: `${input.automation.successRate}%`,
    storedMetrics: String(input.metrics.length),
});

export const buildAnalyticsSummary = (input: {
    revenue: RevenueAnalytics;
    delivery: DeliveryAnalytics;
    clients: ClientAnalytics;
    automation: AutomationInsights;
}): AnalyticsSummary => ({
    revenuePaid: input.revenue.paidTotal,
    revenueOutstanding: input.revenue.outstanding,
    expenseTotal: input.revenue.expenseTotal,
    activeClients: input.clients.activeClients,
    activeProjects: input.delivery.activeProjects,
    openTasks: input.delivery.openTasks,
    workflowSuccessRate: input.automation.successRate,
    monthlyTrend: input.revenue.revenueTrend,
});
