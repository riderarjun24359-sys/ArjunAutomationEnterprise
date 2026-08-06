"use client";

import type { Variants, Transition } from "framer-motion";
import { motion as motionTokens } from "@/src/design-os/tokens/motion";

const easeOut = [0, 0, 0.2, 1] as const;

/** Physics-based page transitions for immersive v2. */
export const physicsPageTransition: Variants = {
    initial: { opacity: 0, y: 18, filter: "blur(4px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: motionTokens.spring.gentle,
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: "blur(2px)",
        transition: { duration: motionTokens.duration.fast / 1000, ease: easeOut },
    },
};

export const sharedElementTransition: Transition = {
    type: "spring",
    stiffness: 320,
    damping: 32,
    mass: 0.85,
};

export const sharedElementReveal: Variants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: sharedElementTransition,
    },
};

export const widgetOrchestra: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.04,
        },
    },
};

export const widgetOrchestraItem: Variants = {
    hidden: { opacity: 0, y: 12, scale: 0.985 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: motionTokens.spring.snappy,
    },
};

export const cinematicWelcome: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.35, ease: easeOut, when: "beforeChildren", staggerChildren: 0.08 },
    },
    exit: { opacity: 0, transition: { duration: 0.28, ease: easeOut } },
};

export const cinematicWelcomeItem: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: motionTokens.spring.gentle,
    },
};

export const aiPresencePulse: Variants = {
    idle: { opacity: 0.55, scale: 0.96 },
    thinking: {
        opacity: [0.45, 1, 0.45],
        scale: [0.96, 1.02, 0.96],
        transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
    },
    streaming: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2 },
    },
};

export const celebrationBurst: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
        opacity: [0, 1, 1, 0],
        scale: [0.6, 1.08, 1, 0.92],
        transition: { duration: 0.9, ease: easeOut },
    },
};

export const liveKpiGlow: Variants = {
    rest: { boxShadow: "0 0 0 rgba(99,102,241,0)" },
    update: {
        boxShadow: [
            "0 0 0 rgba(99,102,241,0)",
            "0 0 24px rgba(99,102,241,0.28)",
            "0 0 0 rgba(99,102,241,0)",
        ],
        transition: { duration: 0.8, ease: easeOut },
    },
};

export const commandPaletteMotion: Variants = {
    hidden: { opacity: 0, y: -12, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: motionTokens.spring.snappy,
    },
    exit: {
        opacity: 0,
        y: -8,
        scale: 0.985,
        transition: { duration: 0.15, ease: easeOut },
    },
};

export const commandOverlayMotion: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.14 } },
};
