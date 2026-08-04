"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type AnimatedCounterProps = {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
};

export function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2, className }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const reduced = useReducedMotion();
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView || reduced) return;
        const startTime = performance.now();
        let frameId: number;
        const tick = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [inView, value, duration, reduced]);

    const shown = reduced ? value : display;

    return (
        <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
            {prefix}
            {shown.toLocaleString()}
            {suffix}
        </motion.span>
    );
}
