/**
 * MANDATORY Design OS integration rules for all Arjun Automation modules.
 * Every module MUST import UI primitives, tokens, and motion from @/src/design-os.
 */
export const MANDATORY_RULES = [
    "All modules MUST import UI components from @/src/design-os or @/src/design-os/components — never duplicate Button, Card, Input, etc.",
    "All modules MUST use design-os CSS variables (--dos-*) for colors, spacing, typography, radii, shadows, and motion — no hardcoded hex in components.",
    "All modules MUST use @/src/design-os/motion hooks (useReducedMotion, useMagnetic, useStagger) — never duplicate motion hooks.",
    "All dashboard pages MUST use DashboardShell from @/src/design-os/dashboard or extend it — never create standalone shell layouts.",
    "All marketing/website pages MUST import motion components from @/src/design-os/motion or @/src/design-os/website.",
    "Theme support MUST use .dark class with design-os.css variables — compatible with next-themes attribute='class'.",
    "New components MUST use cn() from @/src/lib/cn with design-os token classes or CSS vars.",
    "Accessibility: all interactive components MUST have aria labels, focus rings using --dos-border-focus, and respect prefers-reduced-motion.",
] as const;

export type MandatoryRule = (typeof MANDATORY_RULES)[number];
