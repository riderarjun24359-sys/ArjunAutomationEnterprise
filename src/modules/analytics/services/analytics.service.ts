import {
    buildAnalyticsActivityPayload,
    buildAnalyticsDashboardStats,
    buildAnalyticsSummary,
    buildAutomationInsights,
    buildClientAnalytics,
    buildDeliveryAnalytics,
    buildReportPayload,
    buildRevenueAnalytics,
    mapAnalyticsDashboard,
    mapAnalyticsMetric,
    mapAnalyticsReport,
    mapAnalyticsWidget,
} from "@/src/modules/database/lib/analytics-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    AnalyticsDashboard,
    AnalyticsDashboardStats,
    AnalyticsMetric,
    AnalyticsReport,
    AnalyticsSummary,
    AutomationInsights,
    ClientAnalytics,
    CreateReportInput,
    DeliveryAnalytics,
    RevenueAnalytics,
} from "@/src/modules/analytics/types";

export class AnalyticsService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getDashboards(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsDashboard[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const records = await databaseService.analyticsDashboards.listByOrganization(context.organizationId);
        return Promise.all(
            records.map(async (record) => {
                const widgets = await databaseService.analyticsWidgets.listByDashboard(record.id);
                return mapAnalyticsDashboard(record, widgets.map(mapAnalyticsWidget));
            }),
        );
    }

    async getMetrics(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsMetric[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const records = await databaseService.analyticsMetrics.listByOrganization(context.organizationId);
        return records.map(mapAnalyticsMetric);
    }

    async getReports(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsReport[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const records = await databaseService.analyticsReports.listByOrganization(context.organizationId);
        return records.map(mapAnalyticsReport);
    }

    async createReport(authUserId: string, email: string, input: CreateReportInput, fullName?: string | null): Promise<AnalyticsReport> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const created = await databaseService.analyticsReports.create(buildReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create analytics report");

        await databaseService.activityLogs.create(
            buildAnalyticsActivityPayload(context.organizationId, "analytics_report", created.id, "create", created.name, "Analytics report created"),
        );

        return mapAnalyticsReport(created);
    }

    async publishReport(authUserId: string, email: string, reportId: string, fullName?: string | null): Promise<AnalyticsReport> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const updated = await databaseService.analyticsReports.update(reportId, {
            status: "published",
            generated_at: new Date().toISOString(),
        });
        if (!updated) throw new Error("Failed to publish analytics report");

        await databaseService.activityLogs.create(
            buildAnalyticsActivityPayload(context.organizationId, "analytics_report", updated.id, "update", updated.name, "Analytics report published"),
        );

        return mapAnalyticsReport(updated);
    }

    private async loadCrossModuleData(organizationId: string) {
        const [clients, projects, tasks, invoices, payments, expenses, workflows, executions] = await Promise.all([
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.tasks.listByOrganization(organizationId),
            databaseService.invoices.listByOrganization(organizationId),
            databaseService.payments.listByOrganization(organizationId),
            databaseService.expenses.listByOrganization(organizationId),
            databaseService.workflows.listByOrganization(organizationId),
            databaseService.workflowExecutions.listByOrganization(organizationId),
        ]);

        return { clients, projects, tasks, invoices, payments, expenses, workflows, executions };
    }

    async getRevenueAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<RevenueAnalytics> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return { paidTotal: 0, outstanding: 0, expenseTotal: 0, paymentTotal: 0, revenueTrend: [], expenseBreakdown: [] };
        }

        const { invoices, payments, expenses } = await this.loadCrossModuleData(context.organizationId);
        return buildRevenueAnalytics({ invoices, payments, expenses });
    }

    async getDeliveryAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<DeliveryAnalytics> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return { activeProjects: 0, averageProgress: 0, openTasks: 0, completedTasks: 0, blockedTasks: 0, tasksByStatus: [], projectProgress: [] };
        }

        const { projects, tasks } = await this.loadCrossModuleData(context.organizationId);
        return buildDeliveryAnalytics({ projects, tasks });
    }

    async getClientAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<ClientAnalytics> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return { activeClients: 0, atRiskClients: 0, leads: 0, totalRevenue: 0, clientsByStage: [], topClients: [] };
        }

        const { clients } = await this.loadCrossModuleData(context.organizationId);
        return buildClientAnalytics({ clients });
    }

    async getAutomationInsights(authUserId: string, email: string, fullName?: string | null): Promise<AutomationInsights> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return { activeWorkflows: 0, completedExecutions: 0, failedExecutions: 0, runningExecutions: 0, successRate: 0, executionsByStatus: [], topWorkflows: [] };
        }

        const { workflows, executions } = await this.loadCrossModuleData(context.organizationId);
        return buildAutomationInsights({ workflows, executions });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsDashboardStats> {
        const [metrics, revenue, delivery, clients, automation] = await Promise.all([
            this.getMetrics(authUserId, email, fullName),
            this.getRevenueAnalytics(authUserId, email, fullName),
            this.getDeliveryAnalytics(authUserId, email, fullName),
            this.getClientAnalytics(authUserId, email, fullName),
            this.getAutomationInsights(authUserId, email, fullName),
        ]);

        return buildAnalyticsDashboardStats({ metrics, revenue, delivery, clients, automation });
    }

    async getSummary(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsSummary> {
        const [revenue, delivery, clients, automation] = await Promise.all([
            this.getRevenueAnalytics(authUserId, email, fullName),
            this.getDeliveryAnalytics(authUserId, email, fullName),
            this.getClientAnalytics(authUserId, email, fullName),
            this.getAutomationInsights(authUserId, email, fullName),
        ]);

        return buildAnalyticsSummary({ revenue, delivery, clients, automation });
    }
}

export const analyticsService = new AnalyticsService();
