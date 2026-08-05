/**
 * Central production logger — structured logging for observability pipeline.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface ProductionLogEntry {
    level: LogLevel;
    message: string;
    source: string;
    timestamp: string;
    traceId?: string;
    metadata?: Record<string, unknown>;
}

const buffer: ProductionLogEntry[] = [];
const MAX_BUFFER = 500;

export function productionLog(
    level: LogLevel,
    message: string,
    source: string,
    metadata?: Record<string, unknown>,
    traceId?: string,
): ProductionLogEntry {
    const entry: ProductionLogEntry = {
        level,
        message,
        source,
        timestamp: new Date().toISOString(),
        traceId: traceId ?? generateTraceId(),
        metadata,
    };
    buffer.unshift(entry);
    if (buffer.length > MAX_BUFFER) buffer.pop();

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${source}]`;
    if (level === "error" || level === "fatal") {
        console.error(prefix, message, metadata ?? "");
    } else if (level === "warn") {
        console.warn(prefix, message, metadata ?? "");
    } else {
        console.info(prefix, message, metadata ?? "");
    }
    return entry;
}

export function generateTraceId(): string {
    return `trace-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getRecentLogs(limit = 50, level?: LogLevel): ProductionLogEntry[] {
    const filtered = level ? buffer.filter((e) => e.level === level) : buffer;
    return filtered.slice(0, limit);
}

export function searchLogs(query: string, limit = 30): ProductionLogEntry[] {
    const lower = query.toLowerCase();
    return buffer.filter((e) => e.message.toLowerCase().includes(lower) || e.source.toLowerCase().includes(lower)).slice(0, limit);
}
