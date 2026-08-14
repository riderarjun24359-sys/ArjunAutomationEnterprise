import type { Variants } from "framer-motion";

/**
 * A container that staggers the animation of its children.
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

/**
 * An item that fades and slides in, intended for use within a `staggerContainer`.
 */
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/**
 * A subtle fade-in-up animation.
 */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * The standard animation for page content transitions.
 */
export const pageTransition: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Animation for a modal panel, scaling and fading in.
 */
export const modalTransition: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } },
};

/**
 * Animation for a modal overlay, fading in.
 */
export const modalOverlayTransition: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
};

/**
 * A simple scale-in animation.
 */
export const scaleIn: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

/**
 * Press/tap animation for interactive elements.
 */
export const pressableTransition: Variants = {
    tap: { scale: 0.97 },
    hover: { scale: 1.03 },
};

/**
 * Animation for dropdown menus.
 */
export const dropdownMenu: Variants = {
    hidden: { opacity: 0, scale: 0.97, y: -5 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.97, y: -5, transition: { duration: 0.15, ease: "easeIn" } },
};

/**
 * Animation for revealing chart elements.
 */
export const chartReveal: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
            staggerChildren: 0.05,
        },
    },
};

/**
 * Animation for individual activity feed items.
 */
export const activityItem: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/**
 * Entrance animation for dashboard widgets.
 */
export const widgetEntrance: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/**
 * Animation for toast notifications.
 */
export const toastMotion: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Animation for side drawers or panels.
 */
export const drawerPanel: Variants = {
    hidden: { opacity: 0, x: "100%" },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, x: "100%", transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Animation for bottom sheet panels.
 */
export const bottomSheet: Variants = {
    hidden: { opacity: 0, y: "100%" },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: "100%", transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};


// --- Aliases for backward compatibility ---
export const modalOverlay = modalOverlayTransition;
export const modalPanel = modalTransition;
