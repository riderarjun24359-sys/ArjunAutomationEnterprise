export const colors = {
    brand: {
        50: "#eef2ff",
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81",
        950: "#1e1b4b",
    },
    accent: {
        cyan: "#06b6d4",
        violet: "#8b5cf6",
        emerald: "#10b981",
    },
    surface: {
        light: "#fafafa",
        dark: "#0a0a0f",
    },
} as const;

export const spacing = {
    section: "6rem",
    sectionLg: "8rem",
    container: "80rem",
} as const;

export const radii = {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    full: "9999px",
} as const;

export const shadows = {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 12px 40px rgba(0,0,0,0.12)",
    glow: "0 0 60px rgba(99,102,241,0.25)",
    glowLg: "0 0 120px rgba(99,102,241,0.35)",
} as const;

export const animation = {
    fast: 0.15,
    normal: 0.3,
    slow: 0.6,
    slower: 1.2,
    spring: { type: "spring" as const, stiffness: 300, damping: 30 },
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

export const zIndex = {
    header: 50,
    overlay: 40,
    modal: 60,
    cursor: 9999,
} as const;
