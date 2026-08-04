"use client";

import type { Variants } from "framer-motion";
import { motion as motionTokens } from "@/src/design-os/tokens/motion";

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal / 1000, ease: [0, 0, 0.2, 1] } },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: motionTokens.stagger.normal, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal / 1000 } },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: motionTokens.duration.normal / 1000 } },
};

export const slideIn: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.normal / 1000 } },
};

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.page / 1000 } },
    exit: { opacity: 0, y: -8, transition: { duration: motionTokens.duration.fast / 1000 } },
};
