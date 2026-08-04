export const shadows = {
    none: "none",
    sm: "var(--dos-shadow-sm)",
    md: "var(--dos-shadow-md)",
    lg: "var(--dos-shadow-lg)",
    xl: "var(--dos-shadow-xl)",
    glow: "var(--dos-shadow-glow)",
} as const;

export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    toast: 1500,
    tooltip: 1600,
    command: 1700,
} as const;

export const elevation = { shadows, zIndex } as const;
