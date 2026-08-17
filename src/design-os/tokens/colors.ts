export const brand = {
    primary: "#38bdf8",
    primaryHover: "#7dd3fc",
    primaryMuted: "#38bdf8",
    secondary: "#06b6d4",
    secondaryHover: "#0891b2",
    accent: "#6366f1",
    accentHover: "#4f46e5",
} as const;

export const semantic = {
    success: { DEFAULT: "#10b981", muted: "#d1fae5", foreground: "#065f46" },
    warning: { DEFAULT: "#f59e0b", muted: "#fef3c7", foreground: "#92400e" },
    error: { DEFAULT: "#ef4444", muted: "#fee2e2", foreground: "#991b1b" },
    info: { DEFAULT: "#3b82f6", muted: "#dbeafe", foreground: "#1e40af" },
} as const;

export const surface = {
    DEFAULT: "var(--dos-surface)",
    secondary: "var(--dos-surface-secondary)",
    tertiary: "var(--dos-surface-tertiary)",
    elevated: "var(--dos-surface-elevated)",
    overlay: "var(--dos-surface-overlay)",
} as const;

export const border = {
    DEFAULT: "var(--dos-border)",
    subtle: "var(--dos-border-subtle)",
    strong: "var(--dos-border-strong)",
    focus: "var(--dos-border-focus)",
} as const;

export const text = {
    primary: "var(--dos-text-primary)",
    secondary: "var(--dos-text-secondary)",
    tertiary: "var(--dos-text-tertiary)",
    inverse: "var(--dos-text-inverse)",
    link: "var(--dos-text-link)",
} as const;

export const colors = { brand, semantic, surface, border, text } as const;
export type BrandColor = keyof typeof brand;
export type SemanticColor = keyof typeof semantic;
