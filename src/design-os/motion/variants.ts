"use client";

import type { Variants, Transition } from "framer-motion";
import { motion as motionTokens } from "@/src/design-os/tokens/motion";

const easeOut = [0, 0, 0.2, 1] as const;

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: motionTokens.stagger.normal, delayChildren: 0.08 } },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const slideIn: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.page / 1000, ease: easeOut } },
    exit: { opacity: 0, y: -8, transition: { duration: motionTokens.duration.fast / 1000, ease: easeOut } },
};

export const modalOverlay: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: motionTokens.duration.fast / 1000 } },
    exit: { opacity: 0, transition: { duration: motionTokens.duration.fast / 1000 } },
};

export const modalPanel: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: motionTokens.spring.gentle },
    exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: motionTokens.duration.fast / 1000 } },
};

export const drawerPanel: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: motionTokens.spring.snappy },
    exit: { x: "100%", transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const dropdownMenu: Variants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: motionTokens.duration.fast / 1000, ease: easeOut } },
    exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
};

export const toastMotion: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: motionTokens.spring.snappy },
    exit: { opacity: 0, y: 8, transition: { duration: motionTokens.duration.fast / 1000 } },
};

export const bottomSheet: Variants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: motionTokens.spring.snappy },
    exit: { y: "100%", transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const widgetEntrance: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal / 1000, ease: easeOut } },
};

export const activityItem: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.fast / 1000, ease: easeOut } },
};

export const chartReveal: Variants = {
    hidden: { opacity: 0, clipPath: "inset(0 12% 0 0)" },
    visible: {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        transition: { duration: motionTokens.duration.slow / 1000, ease: easeOut },
    },
};

export const pressableTransition: Transition = {
    type: "spring",
    stiffness: 420,
    damping: 28,
};
