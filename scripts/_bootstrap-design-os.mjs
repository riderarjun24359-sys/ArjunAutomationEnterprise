/**
 * Bootstrap V4 Design OS — Permanent UI/UX Engineering Standard
 * Run: node scripts/_bootstrap-design-os.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();
const dos = join(root, "src", "design-os");

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

// ─── TOKENS ───────────────────────────────────────────────────────────────

write("src/design-os/tokens/colors.ts", `export const brand = {
    primary: "#4338ca",
    primaryHover: "#3730a3",
    primaryMuted: "#6366f1",
    secondary: "#06b6d4",
    secondaryHover: "#0891b2",
    accent: "#8b5cf6",
    accentHover: "#7c3aed",
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
`);

write("src/design-os/tokens/typography.ts", `export const fontFamily = {
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
`);

write("src/design-os/tokens/spacing.ts", `/** 8pt spacing system: 0–96 in 8px increments */
const BASE = 8;
export const spacing = Object.fromEntries(
    Array.from({ length: 97 }, (_, i) => [String(i), \`\${i * BASE}px\`]),
) as Record<string, string>;

export const spacingKeys = Object.keys(spacing).map(Number);
export type SpacingKey = keyof typeof spacing;
`);

write("src/design-os/tokens/grid.ts", `export const grid = {
    columns: 12,
    gutter: { sm: "16px", md: "24px", lg: "32px" },
    maxWidth: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px", full: "2560px" },
    containerPadding: { sm: "16px", md: "24px", lg: "32px" },
} as const;
`);

write("src/design-os/tokens/radii.ts", `export const radii = {
    none: "0",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.25rem",
    "3xl": "1.5rem",
    full: "9999px",
} as const;
export type Radius = keyof typeof radii;
`);

write("src/design-os/tokens/elevation.ts", `export const shadows = {
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
`);

write("src/design-os/tokens/motion.ts", `export const duration = {
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
`);

write("src/design-os/tokens/blur.ts", `export const blur = {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
} as const;
`);

write("src/design-os/tokens/glass.ts", `export const glass = {
    background: "var(--dos-glass-bg)",
    border: "var(--dos-glass-border)",
    blur: "var(--dos-glass-blur)",
    shadow: "var(--dos-glass-shadow)",
} as const;
`);

write("src/design-os/tokens/breakpoints.ts", `export const breakpoints = {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
    "3xl": 2560,
} as const;

export const mediaQueries = {
    xs: \`(min-width: \${breakpoints.xs}px)\`,
    sm: \`(min-width: \${breakpoints.sm}px)\`,
    md: \`(min-width: \${breakpoints.md}px)\`,
    lg: \`(min-width: \${breakpoints.lg}px)\`,
    xl: \`(min-width: \${breakpoints.xl}px)\`,
    "2xl": \`(min-width: \${breakpoints["2xl"]}px)\`,
    "3xl": \`(min-width: \${breakpoints["3xl"]}px)\`,
} as const;
`);

write("src/design-os/tokens/semantic.ts", `import { radii } from "./radii";
import { shadows } from "./elevation";

export const componentSemantic = {
    button: {
        radius: radii.lg,
        shadow: shadows.sm,
        height: { sm: "32px", md: "40px", lg: "48px" },
    },
    input: {
        radius: radii.lg,
        height: { sm: "36px", md: "40px", lg: "44px" },
    },
    card: {
        radius: radii["2xl"],
        shadow: shadows.md,
        padding: "24px",
    },
    dialog: {
        radius: radii["2xl"],
        shadow: shadows.xl,
    },
    badge: {
        radius: radii.full,
    },
    table: {
        radius: radii.xl,
        rowHeight: "48px",
    },
} as const;
`);

write("src/design-os/tokens/index.ts", `export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./grid";
export * from "./radii";
export * from "./elevation";
export * from "./motion";
export * from "./blur";
export * from "./glass";
export * from "./breakpoints";
export * from "./semantic";
`);

// ─── CSS ──────────────────────────────────────────────────────────────────

write("src/design-os/css/design-os.css", `:root {
    /* Brand */
    --dos-brand-primary: #4338ca;
    --dos-brand-primary-hover: #3730a3;
    --dos-brand-secondary: #06b6d4;
    --dos-brand-accent: #8b5cf6;

    /* Semantic */
    --dos-success: #10b981;
    --dos-success-muted: #d1fae5;
    --dos-warning: #f59e0b;
    --dos-warning-muted: #fef3c7;
    --dos-error: #ef4444;
    --dos-error-muted: #fee2e2;
    --dos-info: #3b82f6;
    --dos-info-muted: #dbeafe;

    /* Surface */
    --dos-surface: #ffffff;
    --dos-surface-secondary: #f8fafc;
    --dos-surface-tertiary: #f1f5f9;
    --dos-surface-elevated: #ffffff;
    --dos-surface-overlay: rgba(15, 23, 42, 0.4);

    /* Border */
    --dos-border: rgba(15, 23, 42, 0.1);
    --dos-border-subtle: rgba(15, 23, 42, 0.06);
    --dos-border-strong: rgba(15, 23, 42, 0.16);
    --dos-border-focus: #6366f1;

    /* Text */
    --dos-text-primary: #0f172a;
    --dos-text-secondary: #475569;
    --dos-text-tertiary: #94a3b8;
    --dos-text-inverse: #f8fafc;
    --dos-text-link: #4338ca;

    /* Typography */
    --dos-font-sans: var(--font-geist-sans, system-ui, sans-serif);
    --dos-font-display: var(--font-geist-sans, system-ui, sans-serif);
    --dos-font-mono: var(--font-geist-mono, ui-monospace, monospace);

    /* Spacing (8pt system) */
    --dos-space-1: 8px;
    --dos-space-2: 16px;
    --dos-space-3: 24px;
    --dos-space-4: 32px;
    --dos-space-6: 48px;
    --dos-space-8: 64px;

    /* Radii */
    --dos-radius-sm: 0.375rem;
    --dos-radius-md: 0.5rem;
    --dos-radius-lg: 0.75rem;
    --dos-radius-xl: 1rem;
    --dos-radius-2xl: 1.25rem;
    --dos-radius-3xl: 1.5rem;
    --dos-radius-full: 9999px;

    /* Shadows */
    --dos-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --dos-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --dos-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.1);
    --dos-shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.12);
    --dos-shadow-glow: 0 0 24px rgba(99, 102, 241, 0.25);

    /* Blur & Glass */
    --dos-blur-sm: 4px;
    --dos-blur-md: 8px;
    --dos-blur-lg: 16px;
    --dos-blur-xl: 24px;
    --dos-glass-bg: rgba(255, 255, 255, 0.72);
    --dos-glass-border: rgba(255, 255, 255, 0.4);
    --dos-glass-blur: 20px;
    --dos-glass-shadow: var(--dos-shadow-md);

    /* Motion */
    --dos-duration-fast: 150ms;
    --dos-duration-normal: 250ms;
    --dos-duration-slow: 400ms;
    --dos-easing-default: cubic-bezier(0.4, 0, 0.2, 1);
    --dos-easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    /* Z-index */
    --dos-z-dropdown: 1000;
    --dos-z-sticky: 1100;
    --dos-z-overlay: 1200;
    --dos-z-modal: 1300;
    --dos-z-toast: 1500;
    --dos-z-command: 1700;
}

.dark {
    --dos-surface: #0a0a0f;
    --dos-surface-secondary: #12121a;
    --dos-surface-tertiary: #1a1a24;
    --dos-surface-elevated: #151520;
    --dos-surface-overlay: rgba(0, 0, 0, 0.6);

    --dos-border: rgba(248, 250, 252, 0.08);
    --dos-border-subtle: rgba(248, 250, 252, 0.04);
    --dos-border-strong: rgba(248, 250, 252, 0.16);
    --dos-border-focus: #818cf8;

    --dos-text-primary: #f8fafc;
    --dos-text-secondary: #94a3b8;
    --dos-text-tertiary: #64748b;
    --dos-text-inverse: #0f172a;
    --dos-text-link: #818cf8;

    --dos-success-muted: rgba(16, 185, 129, 0.15);
    --dos-warning-muted: rgba(245, 158, 11, 0.15);
    --dos-error-muted: rgba(239, 68, 68, 0.15);
    --dos-info-muted: rgba(59, 130, 246, 0.15);

    --dos-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --dos-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --dos-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
    --dos-shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.6);
    --dos-shadow-glow: 0 0 24px rgba(129, 140, 248, 0.3);

    --dos-glass-bg: rgba(15, 15, 25, 0.65);
    --dos-glass-border: rgba(255, 255, 255, 0.06);
}

.dos-glass {
    background: var(--dos-glass-bg);
    backdrop-filter: blur(var(--dos-glass-blur));
    -webkit-backdrop-filter: blur(var(--dos-glass-blur));
    border: 1px solid var(--dos-glass-border);
    box-shadow: var(--dos-glass-shadow);
}

.dos-surface {
    background: var(--dos-surface);
    color: var(--dos-text-primary);
}

.dos-text-display { font-size: 3.75rem; line-height: 1.1; letter-spacing: -0.02em; font-weight: 700; }
.dos-text-h1 { font-size: 3rem; line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; }
.dos-text-h2 { font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.015em; font-weight: 600; }
.dos-text-h3 { font-size: 1.875rem; line-height: 1.25; font-weight: 600; }
.dos-text-body { font-size: 1rem; line-height: 1.6; }
.dos-text-caption { font-size: 0.75rem; line-height: 1.4; letter-spacing: 0.02em; }
.dos-text-mono { font-family: var(--dos-font-mono); font-size: 0.875rem; line-height: 1.6; }
`);

console.log("Design OS bootstrap: tokens + css complete. Run part 2 for motion/components.");
