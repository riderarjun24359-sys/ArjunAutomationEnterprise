function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export { uid };

export function clampScore(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
}
