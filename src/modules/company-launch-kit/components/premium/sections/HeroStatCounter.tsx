"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type HeroStatCounterProps = {
    value: number;
    suffix?: string;
};

/** Lightweight stat counter — no framer-motion, CLS-safe initial render. */
export function HeroStatCounter({ value, suffix = "" }: HeroStatCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        if (reduced) return;
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const duration = 1400;
                const tick = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setDisplay(Math.round(eased * value));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                setDisplay(0);
                requestAnimationFrame(tick);
            },
            { threshold: 0.2 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [reduced, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {display.toLocaleString()}
            {suffix}
        </span>
    );
}
