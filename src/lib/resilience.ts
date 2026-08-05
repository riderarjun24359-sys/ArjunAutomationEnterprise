/**
 * Production resilience utilities — retry, timeout, circuit breaker, graceful degradation.
 */

export interface RetryOptions {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    onRetry?: (attempt: number, error: unknown) => void;
}

export interface CircuitBreakerState {
    failures: number;
    threshold: number;
    open: boolean;
    lastFailureAt: string | null;
    halfOpenAt: string | null;
}

const circuits = new Map<string, CircuitBreakerState>();

export function exponentialBackoff(attempt: number, baseDelayMs = 1000, maxDelayMs = 60000): number {
    return Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const { maxAttempts = 3, baseDelayMs = 1000, maxDelayMs = 30000, onRetry } = options;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < maxAttempts - 1) {
                onRetry?.(attempt + 1, error);
                await sleep(exponentialBackoff(attempt, baseDelayMs, maxDelayMs));
            }
        }
    }
    throw lastError;
}

export async function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number, fallback?: T): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            if (fallback !== undefined) resolve(fallback);
            else reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
        fn()
            .then((result) => { clearTimeout(timer); resolve(result); })
            .catch((err) => { clearTimeout(timer); reject(err); });
    });
}

export function getCircuitBreaker(key: string, threshold = 5): CircuitBreakerState {
    if (!circuits.has(key)) {
        circuits.set(key, { failures: 0, threshold, open: false, lastFailureAt: null, halfOpenAt: null });
    }
    return circuits.get(key)!;
}

export function recordCircuitFailure(key: string): CircuitBreakerState {
    const state = getCircuitBreaker(key);
    state.failures += 1;
    state.lastFailureAt = new Date().toISOString();
    if (state.failures >= state.threshold) {
        state.open = true;
    }
    return state;
}

export function recordCircuitSuccess(key: string): CircuitBreakerState {
    const state = getCircuitBreaker(key);
    state.failures = 0;
    state.open = false;
    state.halfOpenAt = null;
    return state;
}

export function isCircuitOpen(key: string): boolean {
    return getCircuitBreaker(key).open;
}

export async function withCircuitBreaker<T>(
    key: string,
    fn: () => Promise<T>,
    fallback: () => T | Promise<T>,
): Promise<T> {
    if (isCircuitOpen(key)) {
        return fallback();
    }
    try {
        const result = await fn();
        recordCircuitSuccess(key);
        return result;
    } catch (error) {
        recordCircuitFailure(key);
        return fallback();
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAllCircuitBreakers(): Array<{ key: string; state: CircuitBreakerState }> {
    return Array.from(circuits.entries()).map(([key, state]) => ({ key, state }));
}
