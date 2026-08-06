/**
 * Bootstrap V4 Design OS — Part 2: Motion, Components, Dashboard, Guidelines, Module
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();

function write(rel, content) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, "utf8");
    console.log("wrote", rel);
}

// MOTION
write("src/design-os/motion/variants.ts", `"use client";

import type { Variants } from "framer-motion";
import { motion as motionTokens } from "@/src/design-os/tokens/motion";

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal / 1000, ease: motionTokens.easing.out } },
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
`);

write("src/design-os/motion/transitions.ts", `import { motion as motionTokens } from "@/src/design-os/tokens/motion";

export const defaultTransition = {
    duration: motionTokens.duration.normal / 1000,
    ease: motionTokens.easing.default,
};

export const fastTransition = {
    duration: motionTokens.duration.fast / 1000,
    ease: motionTokens.easing.out,
};

export const springTransition = motionTokens.spring.default;
`);

write("src/design-os/motion/hooks/useReducedMotion.ts", `"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
    return false;
}

export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}
`);

write("src/design-os/motion/hooks/useMagnetic.ts", `"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

const STRENGTH = 0.35;

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>() {
    const ref = useRef<T>(null);
    const reduced = useReducedMotion();

    const onMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (reduced || !ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            ref.current.style.transform = \`translate(\${x * STRENGTH}px, \${y * STRENGTH}px)\`;
        },
        [reduced],
    );

    const onMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = "translate(0, 0)";
    }, []);

    return { ref, onMouseMove, onMouseLeave, reduced };
}
`);

write("src/design-os/motion/hooks/useScrollProgress.ts", `"use client";

import { useEffect, useState } from "react";

export function useScrollProgress(): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return progress;
}
`);

write("src/design-os/motion/hooks/useStagger.ts", `"use client";

import { useReducedMotion } from "./useReducedMotion";
import { motion as motionTokens } from "@/src/design-os/tokens/motion";

export function useStagger(itemCount: number, delay: keyof typeof motionTokens.stagger = "normal") {
    const reduced = useReducedMotion();
    const staggerDelay = motionTokens.stagger[delay];

    return {
        containerProps: reduced
            ? { initial: "visible", animate: "visible" }
            : { initial: "hidden", animate: "visible", transition: { staggerChildren: staggerDelay } },
        itemProps: (index: number) =>
            reduced
                ? {}
                : { transition: { delay: index * staggerDelay } },
        reduced,
    };
}
`);

write("src/design-os/motion/hooks/index.ts", `export { useReducedMotion } from "./useReducedMotion";
export { useMagnetic } from "./useMagnetic";
export { useScrollProgress } from "./useScrollProgress";
export { useStagger } from "./useStagger";
`);

write("src/design-os/motion/components/PageTransition.tsx", `"use client";

import { motion } from "framer-motion";
import { pageTransition } from "../variants";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className={className}>
            {children}
        </motion.div>
    );
}
`);

write("src/design-os/motion/components/StaggerReveal.tsx", `"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../variants";
import { cn } from "@/src/lib/cn";

export function StaggerReveal({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={cn(className)}>
            {children}
        </motion.div>
    );
}

export function StaggerRevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div variants={staggerItem} className={cn(className)}>
            {children}
        </motion.div>
    );
}
`);

write("src/design-os/motion/components/MagneticButton.tsx", `"use client";

export { Button as MagneticButton } from "@/src/design-os/components/Button";
`);

write("src/design-os/motion/components/AnimatedCounter.tsx", `"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "@/src/lib/cn";

export function AnimatedCounter({ value, className, suffix = "" }: { value: number; className?: string; suffix?: string }) {
    const reduced = useReducedMotion();
    const spring = useSpring(0, { stiffness: 100, damping: 30 });
    const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
    const [text, setText] = useState("0");

    useEffect(() => {
        if (reduced) {
            setText(value.toLocaleString());
            return;
        }
        spring.set(value);
        return display.on("change", (v) => setText(v));
    }, [value, spring, display, reduced]);

    if (reduced) {
        return <span className={cn("tabular-nums", className)}>{value.toLocaleString()}{suffix}</span>;
    }

    return (
        <motion.span className={cn("tabular-nums", className)}>
            {text}{suffix}
        </motion.span>
    );
}
`);

write("src/design-os/motion/components/SkeletonLoader.tsx", `"use client";

import { cn } from "@/src/lib/cn";

export function SkeletonLoader({ className }: { className?: string }) {
    return (
        <div
            className={cn("animate-pulse rounded-[var(--dos-radius-lg)] bg-[var(--dos-surface-tertiary)]", className)}
            aria-hidden="true"
        />
    );
}
`);

write("src/design-os/motion/components/GlowPulse.tsx", `"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function GlowPulse({ className, children }: { className?: string; children?: React.ReactNode }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={cn(className)}>{children}</div>;
    return (
        <motion.div
            className={cn("relative", className)}
            animate={{ boxShadow: ["var(--dos-shadow-glow)", "0 0 32px rgba(99,102,241,0.1)", "var(--dos-shadow-glow)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}
`);

write("src/design-os/motion/components/FloatingElement.tsx", `"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function FloatingElement({ children, className }: { children: React.ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={cn(className)}>{children}</div>;
    return (
        <motion.div
            className={cn(className)}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}
`);

write("src/design-os/motion/components/ProgressiveLoader.tsx", `"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";

export function ProgressiveLoader({ stages, className }: { stages: string[]; className?: string }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= stages.length - 1) return;
        const timer = setTimeout(() => setIndex((i) => i + 1), 800);
        return () => clearTimeout(timer);
    }, [index, stages.length]);

    return (
        <div className={cn("flex flex-col gap-2 text-sm text-[var(--dos-text-secondary)]", className)}>
            {stages.map((stage, i) => (
                <div key={stage} className={cn("flex items-center gap-2", i <= index ? "opacity-100" : "opacity-30")}>
                    <div className={cn("h-2 w-2 rounded-full", i < index ? "bg-[var(--dos-success)]" : i === index ? "animate-pulse bg-[var(--dos-brand-primary)]" : "bg-[var(--dos-border)]")} />
                    <span>{stage}</span>
                </div>
            ))}
        </div>
    );
}
`);

write("src/design-os/motion/components/index.ts", `export { PageTransition } from "./PageTransition";
export { StaggerReveal, StaggerRevealItem } from "./StaggerReveal";
export { MagneticButton } from "./MagneticButton";
export { AnimatedCounter } from "./AnimatedCounter";
export { SkeletonLoader } from "./SkeletonLoader";
export { GlowPulse } from "./GlowPulse";
export { FloatingElement } from "./FloatingElement";
export { ProgressiveLoader } from "./ProgressiveLoader";
`);

write("src/design-os/motion/index.ts", `export * from "./variants";
export * from "./transitions";
export * from "./hooks";
export * from "./components";
`);

console.log("Part 2 motion complete");
