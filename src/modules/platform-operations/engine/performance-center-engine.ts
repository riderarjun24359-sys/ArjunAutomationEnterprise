import type { PerformanceMetric } from "../types";

const performanceStore: PerformanceMetric[] = [];

export function getPerformanceMetrics(): PerformanceMetric[] {
    return performanceStore.map((m) => ({
        ...m,
        status: m.value > m.threshold ? "critical" : m.value > m.threshold * 0.8 ? "warning" : "ok",
        measuredAt: new Date().toISOString(),
    }));
}

export function getAverageResponseTime(): number {
    const response = performanceStore.find((m) => m.category === "response_time");
    return response?.value ?? 0;
}

export function recordPerformanceMetric(metric: Omit<PerformanceMetric, "id">): PerformanceMetric {
    const entry: PerformanceMetric = { ...metric, id: `perf-${Date.now()}` };
    performanceStore.unshift(entry);
    return entry;
}
