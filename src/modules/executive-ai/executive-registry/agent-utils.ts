import { CRITICAL_ACTION_KEYWORDS } from "../constants";

export function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function isCritical(text: string): boolean {
    const lower = text.toLowerCase();
    return CRITICAL_ACTION_KEYWORDS.some((k) => lower.includes(k));
}
