export const breakpoints = {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
    "3xl": 2560,
} as const;

export const mediaQueries = {
    xs: `(min-width: ${breakpoints.xs}px)`,
    sm: `(min-width: ${breakpoints.sm}px)`,
    md: `(min-width: ${breakpoints.md}px)`,
    lg: `(min-width: ${breakpoints.lg}px)`,
    xl: `(min-width: ${breakpoints.xl}px)`,
    "2xl": `(min-width: ${breakpoints["2xl"]}px)`,
    "3xl": `(min-width: ${breakpoints["3xl"]}px)`,
} as const;
