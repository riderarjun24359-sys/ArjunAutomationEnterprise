import type { PerformanceMetric } from "../types";

const performanceStore: PerformanceMetric[] = [
    { id: "perf-response", category: "response_time", name: "API Response Time", value: 120, unit: "ms", threshold: 200, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-workflow", category: "workflow_duration", name: "Workflow Duration", value: 4500, unit: "ms", threshold: 10000, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-ai", category: "ai_time", name: "AI Inference Time", value: 2800, unit: "ms", threshold: 5000, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-queue", category: "queue_latency", name: "Queue Latency", value: 85, unit: "ms", threshold: 150, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-db", category: "database", name: "Database Query Time", value: 35, unit: "ms", threshold: 100, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-api", category: "api", name: "External API Latency", value: 250, unit: "ms", threshold: 500, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-memory", category: "memory", name: "Memory Usage", value: 62, unit: "%", threshold: 85, status: "ok", measuredAt: new Date().toISOString() },
    { id: "perf-cpu", category: "cpu", name: "CPU Usage", value: 45, unit: "%", threshold: 80, status: "ok", measuredAt: new Date().toISOString() },
];

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
