/** 8pt spacing system: 0–96 in 8px increments */
const BASE = 8;
export const spacing = Object.fromEntries(
    Array.from({ length: 97 }, (_, i) => [String(i), `${i * BASE}px`]),
) as Record<string, string>;

export const spacingKeys = Object.keys(spacing).map(Number);
export type SpacingKey = keyof typeof spacing;
