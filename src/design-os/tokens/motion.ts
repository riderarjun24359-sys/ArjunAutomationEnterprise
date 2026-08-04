export const duration = {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
    page: 500,
} as const;

export const easing = {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const spring = {
    default: { type: "spring" as const, stiffness: 300, damping: 30 },
    gentle: { type: "spring" as const, stiffness: 200, damping: 25 },
    snappy: { type: "spring" as const, stiffness: 400, damping: 35 },
    bouncy: { type: "spring" as const, stiffness: 500, damping: 20 },
} as const;

export const stagger = {
    fast: 0.04,
    normal: 0.08,
    slow: 0.12,
} as const;

export const motion = { duration, easing, spring, stagger } as const;
