/**
 * Enterprise Brand Identity System v1.0 — Design Tokens
 * Single source of truth for Arjun Automation Enterprises visual language.
 */

export const BRAND_IDENTITY = {
    version: "1.0",
    name: "Arjun Automation Enterprises",
    symbolName: "Vertex Arc Mark",
} as const;

export const BRAND_COLORS = {
    primary: {
        indigo700: "#4338CA",
        indigo600: "#4F46E5",
        indigo500: "#6366F1",
        indigo900: "#312E81",
        indigo100: "#E0E7FF",
    },
    neutral: {
        slate950: "#0F172A",
        slate700: "#334155",
        slate500: "#64748B",
        slate200: "#E2E8F0",
        slate50: "#F8FAFC",
        white: "#FFFFFF",
    },
    semantic: {
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
        info: "#0284C7",
    },
    accent: {
        cyan500: "#06B6D4",
        violet500: "#8B5CF6",
    },
} as const;

export const BRAND_TYPOGRAPHY = {
    fontFamily: {
        sans: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        mono: "ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace",
    },
    scale: {
        display: { size: "3rem", lineHeight: 1.1, weight: 700 },
        h1: { size: "1.875rem", lineHeight: 1.2, weight: 600 },
        h2: { size: "1.5rem", lineHeight: 1.25, weight: 600 },
        h3: { size: "1.25rem", lineHeight: 1.3, weight: 600 },
        body: { size: "1rem", lineHeight: 1.5, weight: 400 },
        small: { size: "0.875rem", lineHeight: 1.5, weight: 400 },
        label: { size: "0.75rem", lineHeight: 1.4, weight: 500, letterSpacing: "0.24em" },
    },
} as const;

export const BRAND_SPACING = {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const,
    section: { sm: "4rem", md: "6rem", lg: "8rem" },
} as const;

export const BRAND_RADIUS = {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.25rem",
    full: "9999px",
} as const;

export const BRAND_ELEVATION = {
    sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
    md: "0 4px 12px rgba(15, 23, 42, 0.08)",
    lg: "0 12px 32px rgba(15, 23, 42, 0.12)",
    brand: "0 12px 32px rgba(67, 56, 202, 0.18)",
} as const;

export const BRAND_MOTION = {
    duration: { fast: "150ms", normal: "250ms", slow: "400ms" },
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    reducedMotion: "prefers-reduced-motion: reduce",
} as const;

export const LOGO_SPECS = {
    safeAreaRatio: 1,
    minWidthHorizontal: 120,
    minWidthSymbol: 24,
    minPrintWidthMm: 30,
} as const;

export const LOGO_VARIANTS = [
    "primary-horizontal",
    "secondary-horizontal",
    "primary-vertical",
    "symbol-only",
    "symbol-only-light",
    "symbol-only-dark",
    "monogram",
    "monochrome-white",
    "monochrome-indigo",
    "app-icon",
    "favicon",
] as const;

export type LogoVariant = (typeof LOGO_VARIANTS)[number];
