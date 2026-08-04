import { radii } from "./radii";
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
