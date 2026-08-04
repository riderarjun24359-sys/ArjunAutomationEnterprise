import { LOG_LEVELS, METRIC_TYPES } from "../constants";
import type { LogEntry, MetricPoint, TraceSpan } from "../types";

const logStore: LogEntry[] = [];
const metricStore: MetricPoint[] = [];
const traceStore: TraceSpan[] = [];

export function ingestLog(entry: Omit<LogEntry, "id">): LogEntry {
    const log: LogEntry = { ...entry, id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
    logStore.unshift(log);
    return log;
}

export function searchLogs(query: string, level?: string): LogEntry[] {
    return logStore.filter((l) => {
        const matchQuery = !query || l.message.toLowerCase().includes(query.toLowerCase()) || l.source.includes(query);
        const matchLevel = !level || l.level === level;
        return matchQuery && matchLevel;
    });
}

export function getRecentLogs(limit = 50): LogEntry[] {
    return logStore.slice(0, limit);
}

export function recordMetric(point: Omit<MetricPoint, "id">): MetricPoint {
    const metric: MetricPoint = { ...point, id: `metric-${Date.now()}` };
    metricStore.unshift(metric);
    return metric;
}

export function getMetrics(name?: string): MetricPoint[] {
    return name ? metricStore.filter((m) => m.name === name) : metricStore;
}

export function recordTrace(span: Omit<TraceSpan, "id">): TraceSpan {
    const trace: TraceSpan = { ...span, id: `span-${Date.now()}` };
    traceStore.unshift(trace);
    return trace;
}

export function getTraces(traceId?: string): TraceSpan[] {
    return traceId ? traceStore.filter((t) => t.traceId === traceId) : traceStore;
}

export function getTimeline(): { logs: LogEntry[]; metrics: MetricPoint[]; traces: TraceSpan[] } {
    return { logs: getRecentLogs(20), metrics: metricStore.slice(0, 20), traces: traceStore.slice(0, 20) };
}

export function seedObservabilityData(): void {
    if (logStore.length > 0) return;
    LOG_LEVELS.forEach((level, i) => {
        ingestLog({ level, message: `Platform ${level} event`, source: "platform-operations", timestamp: new Date(Date.now() - i * 60000).toISOString() });
    });
    METRIC_TYPES.forEach((type, i) => {
        recordMetric({ name: `platform.${type}`, type, value: 100 - i * 10, unit: "count", timestamp: new Date().toISOString() });
    });
}

seedObservabilityData();
