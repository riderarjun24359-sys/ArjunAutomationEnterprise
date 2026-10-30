/**
 * Unified typography tokens — Arjun Automation OS
 *
 * Single font family across the product: Inter. Clean, highly legible,
 * enterprise-grade, and already loaded by the marketing layout via
 * next/font/google. Geist references removed to eliminate the Inter/Geist
 * split that caused inconsistent rendering between marketing and app shell.
 */

export const fontFamily = {
    sans: "'Inter', system-ui, sans-serif",
    display: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
} as const;

export const fontSize = {
    display: { size: "clamp(3rem, 8vw, 6rem)", lineHeight: "0.95", letterSpacing: "-0.05em" },
    h1: { size: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: "1.05", letterSpacing: "-0.03em" },
    h2: { size: "clamp(1.75rem, 4vw, 2.25rem)", lineHeight: "1.1", letterSpacing: "-0.02em" },
    h3: { size: "clamp(1.25rem, 3vw, 1.5rem)", lineHeight: "1.2", letterSpacing: "-0.01em" },
    body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0" },
    bodySm: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0" },
    caption: { size: "0.75rem", lineHeight: "1.4", letterSpacing: "0.05em" },
    mono: { size: "0.85rem", lineHeight: "1.5", letterSpacing: "0" },
} as const;

export const fontWeight = {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
} as const;

export const typography = { fontFamily, fontSize, fontWeight } as const;
export type TypographyScale = keyof typeof fontSize;
