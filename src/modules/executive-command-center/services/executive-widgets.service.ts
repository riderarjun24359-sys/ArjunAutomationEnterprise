import type { CustomerSuccessExecutiveWidgets } from "@/src/modules/customer-success/types/os";
import type { FinanceExecutiveWidgets } from "@/src/modules/billing-finance/types/os";
import type { ExecutiveHrWidgets } from "@/src/modules/hrms-workforce/types/os";
import { EXECUTIVE_QUICK_ACTIONS } from "../constants/quick-actions";
import type { ExecutiveDashboardWidgets, LiveOperationsStats } from "../types";
import { buildActivityTimeline } from "./activity-timeline.service";
import { buildAiExecutiveInsights } from "./ai-executive-insights.service";
import { buildExecutiveCharts, createEmptyExecutiveCharts } from "./executive-charts.service";
import type { OrganizationOperationsData } from "./organization-operations-data.service";

export function buildExecutiveDashboardWidgets(input: {
    data: OrganizationOperationsData | null;
    liveStats: LiveOperationsStats;
    unifiedScore: number;
    customerSuccess?: CustomerSuccessExecutiveWidgets | null;
    finance?: FinanceExecutiveWidgets | null;
    hrms?: ExecutiveHrWidgets | null;
}): ExecutiveDashboardWidgets {
    const { data, liveStats, unifiedScore, customerSuccess = null, finance = null, hrms = null } = input;

    if (!data) {
        return {
            activityTimeline: [],
            insights: buildAiExecutiveInsights({
                liveStats,
                charts: createEmptyExecutiveCharts(),
                unifiedScore,
            }),
            charts: createEmptyExecutiveCharts(),
            quickActions: EXECUTIVE_QUICK_ACTIONS,
            customerSuccess,
            finance,
            hrms,
        };
    }

    const charts = buildExecutiveCharts(data);
    return {
        activityTimeline: buildActivityTimeline(data),
        insights: buildAiExecutiveInsights({ liveStats, charts, unifiedScore }),
        charts,
        quickActions: EXECUTIVE_QUICK_ACTIONS,
        customerSuccess,
        finance,
        hrms,
    };
}
