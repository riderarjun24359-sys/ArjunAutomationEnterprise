export const fontFamily = {
    sans: "var(--dos-font-sans)",
    display: "var(--dos-font-display)",
    mono: "var(--dos-font-mono)",
} as const;

export const fontSize = {
    display: { size: "3.75rem", lineHeight: "1.1", letterSpacing: "-0.02em" },
    h1: { size: "3rem", lineHeight: "1.15", letterSpacing: "-0.02em" },
    h2: { size: "2.25rem", lineHeight: "1.2", letterSpacing: "-0.015em" },
    h3: { size: "1.875rem", lineHeight: "1.25", letterSpacing: "-0.01em" },
    h4: { size: "1.5rem", lineHeight: "1.3", letterSpacing: "-0.01em" },
    h5: { size: "1.25rem", lineHeight: "1.4", letterSpacing: "0" },
    h6: { size: "1.125rem", lineHeight: "1.4", letterSpacing: "0" },
    body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0" },
    bodySm: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0" },
    caption: { size: "0.75rem", lineHeight: "1.4", letterSpacing: "0.02em" },
    mono: { size: "0.875rem", lineHeight: "1.6", letterSpacing: "0" },
} as const;

export const fontWeight = {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
} as const;

export const typography = { fontFamily, fontSize, fontWeight } as const;
export type TypographyScale = keyof typeof fontSize;
