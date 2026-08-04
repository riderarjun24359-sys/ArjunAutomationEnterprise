import { ERROR_TYPES } from "../constants";
import type { ErrorType, PlatformError } from "../types";

const errorStore: PlatformError[] = [];

const AI_RETRY_HINTS: Record<ErrorType, string> = {
    runtime: "Retry with exponential backoff after verifying input state",
    api_failure: "Check API rate limits and retry with circuit breaker open threshold",
    workflow_failure: "Re-run workflow from last successful step with idempotency key",
    integration_failure: "Verify integration credentials and retry with fallback provider",
    unhandled_exception: "Capture stack trace, deploy hotfix, and retry in staging first",
    ai_failure: "ai-assisted: Reduce prompt complexity, switch model tier, and retry with cached context",
};

export function captureError(input: {
    type: ErrorType;
    message: string;
    source: string;
    stack?: string | null;
}): PlatformError {
    const aiAssisted = input.type === "ai_failure";
    const error: PlatformError = {
        id: `err-${Date.now()}`,
        type: input.type,
        message: input.message,
        source: input.source,
        stack: input.stack,
        occurredAt: new Date().toISOString(),
        resolved: false,
        retryRecommendation: AI_RETRY_HINTS[input.type],
        aiAssisted,
    };
    errorStore.unshift(error);
    return error;
}

export function classifyError(message: string): ErrorType {
    const lower = message.toLowerCase();
    if (lower.includes("ai") || lower.includes("model")) return "ai_failure";
    if (lower.includes("workflow")) return "workflow_failure";
    if (lower.includes("integration") || lower.includes("webhook")) return "integration_failure";
    if (lower.includes("api") || lower.includes("http")) return "api_failure";
    if (lower.includes("unhandled")) return "unhandled_exception";
    return "runtime";
}

export function getErrors(resolved?: boolean): PlatformError[] {
    return resolved === undefined ? errorStore : errorStore.filter((e) => e.resolved === resolved);
}

export function getAiRetryRecommendations(): PlatformError[] {
    return errorStore.filter((e) => e.aiAssisted || e.retryRecommendation?.includes("ai-assisted"));
}

export function resolveError(id: string): PlatformError | null {
    const error = errorStore.find((e) => e.id === id);
    if (!error) return null;
    error.resolved = true;
    return error;
}

export function seedErrors(): void {
    if (errorStore.length > 0) return;
    ERROR_TYPES.forEach((type, i) => {
        captureError({ type, message: `Sample ${type} error`, source: "platform-operations", stack: i % 2 === 0 ? "Error stack trace" : null });
    });
}

seedErrors();
