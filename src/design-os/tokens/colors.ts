/**
 * Unified brand color tokens — Arjun Automation OS
 *
 * Single source of truth for the entire product (marketing site +
 * authenticated app shell). Replaces the previous three-way split:
 *   - design-os.css   → orange (#ea580c)
 *   - colors.ts       → cyan (#38bdf8)
 *   - premium.css     → blue/violet (#3b82f6 / #8b5cf6)
 *
 * Palette direction: deep slate surfaces (enterprise-grade, professional)
 * with a vibrant electric blue primary and violet accent. Works in both
 * light and dark modes via the CSS custom properties in design-os.css.
 */

export const brand = {
    /** Primary brand — electric blue. Used for primary CTAs, active states, links. */
    primary: "#2563EB",
    primaryHover: "#3B82F6",
    primaryActive: "#1D4ED8",
    primaryMuted: "rgba(37, 99, 235, 0.12)",

    /** Accent — violet. Used for secondary highlights, AI-related accents. */
    accent: "#8B5CF6",
    accentHover: "#A78BFA",
    accentMuted: "rgba(139, 92, 246, 0.12)",

    /** Secondary — slate/cyan for supporting elements. */
    secondary: "#0EA5E9",
    secondaryHover: "#38BDF8",
    secondaryMuted: "rgba(14, 165, 233, 0.10)",

    /** Restrained metallic gold for "premium" moments (badges, highlights). */
    gold: "#D4AF37",
} as const;

export const semantic = {
    success: { DEFAULT: "#10B981", muted: "#D1FAE5", foreground: "#065F46" },
    warning: { DEFAULT: "#F59E0B", muted: "#FEF3C7", foreground: "#92400E" },
    error: { DEFAULT: "#EF4444", muted: "#FEE2E2", foreground: "#991B1B" },
    info: { DEFAULT: "#2563EB", muted: "#DBEAFE", foreground: "#1E40AF" },
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
