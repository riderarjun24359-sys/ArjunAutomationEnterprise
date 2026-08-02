"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { METRIC_CATEGORY_FILTERS } from "@/src/modules/analytics/constants";
import { analyticsService } from "@/src/modules/analytics/services/analytics.service";
import type {
    AnalyticsCategoryFilter,
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

export function useAnalytics() {
    const user = useAuthStore((state) => state.user);
    const [dashboards, setDashboards] = useState<AnalyticsDashboard[]>([]);
    const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
    const [reports, setReports] = useState<AnalyticsReport[]>([]);
    const [stats, setStats] = useState<AnalyticsDashboardStats | null>(null);
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
    const [delivery, setDelivery] = useState<DeliveryAnalytics | null>(null);
    const [clients, setClients] = useState<ClientAnalytics | null>(null);
    const [automation, setAutomation] = useState<AutomationInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<AnalyticsCategoryFilter>(METRIC_CATEGORY_FILTERS.all);

    const fetchAnalyticsData = useCallback(async () => {
        if (!user) {
            return {
                dashboardList: [],
                metricList: [],
                reportList: [],
                dashboardStats: null,
                summaryData: null,
                revenueData: null,
                deliveryData: null,
                clientData: null,
                automationData: null,
            };
        }

        const [
            dashboardList,
            metricList,
            reportList,
            dashboardStats,
            summaryData,
            revenueData,
            deliveryData,
            clientData,
            automationData,
        ] = await Promise.all([
            analyticsService.getDashboards(user.id, user.email, user.fullName),
            analyticsService.getMetrics(user.id, user.email, user.fullName),
            analyticsService.getReports(user.id, user.email, user.fullName),
            analyticsService.getDashboardStats(user.id, user.email, user.fullName),
            analyticsService.getSummary(user.id, user.email, user.fullName),
            analyticsService.getRevenueAnalytics(user.id, user.email, user.fullName),
            analyticsService.getDeliveryAnalytics(user.id, user.email, user.fullName),
            analyticsService.getClientAnalytics(user.id, user.email, user.fullName),
            analyticsService.getAutomationInsights(user.id, user.email, user.fullName),
        ]);

        return {
            dashboardList,
            metricList,
            reportList,
            dashboardStats,
            summaryData,
            revenueData,
            deliveryData,
            clientData,
            automationData,
        };
    }, [user]);

    const loadData = useCallback(async () => {
        const data = await fetchAnalyticsData();
        setDashboards(data.dashboardList);
        setMetrics(data.metricList);
        setReports(data.reportList);
        setStats(data.dashboardStats);
        setSummary(data.summaryData);
        setRevenue(data.revenueData);
        setDelivery(data.deliveryData);
        setClients(data.clientData);
        setAutomation(data.automationData);
        setLoading(false);
    }, [fetchAnalyticsData]);

    useEffect(() => {
        let cancelled = false;

        void fetchAnalyticsData().then((data) => {
            if (cancelled) return;
            setDashboards(data.dashboardList);
            setMetrics(data.metricList);
            setReports(data.reportList);
            setStats(data.dashboardStats);
            setSummary(data.summaryData);
            setRevenue(data.revenueData);
            setDelivery(data.deliveryData);
            setClients(data.clientData);
            setAutomation(data.automationData);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [fetchAnalyticsData]);

    const createReport = useCallback(async (input: CreateReportInput) => {
        if (!user) throw new Error("Authentication required");
        await analyticsService.createReport(user.id, user.email, input, user.fullName);
        await loadData();
    }, [user, loadData]);

    const publishReport = useCallback(async (reportId: string) => {
        if (!user) throw new Error("Authentication required");
        await analyticsService.publishReport(user.id, user.email, reportId, user.fullName);
        await loadData();
    }, [user, loadData]);

    const filteredMetrics = useMemo(() => {
        return metrics.filter((metric) => {
            if (categoryFilter !== METRIC_CATEGORY_FILTERS.all && metric.category !== categoryFilter) return false;
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return metric.label.toLowerCase().includes(query) || metric.metricKey.toLowerCase().includes(query);
        });
    }, [metrics, categoryFilter, searchQuery]);

    const filteredReports = useMemo(() => {
        if (!searchQuery) return reports;
        const query = searchQuery.toLowerCase();
        return reports.filter(
            (report) =>
                report.name.toLowerCase().includes(query) ||
                report.reportType.toLowerCase().includes(query) ||
                report.status.toLowerCase().includes(query),
        );
    }, [reports, searchQuery]);

    return {
        dashboards,
        metrics: filteredMetrics,
        allMetrics: metrics,
        reports: filteredReports,
        stats,
        summary,
        revenue,
        delivery,
        clients,
        automation,
        loading,
        searchQuery,
        categoryFilter,
        setSearchQuery,
        setCategoryFilter,
        createReport,
        publishReport,
        refresh: loadData,
    };
}
