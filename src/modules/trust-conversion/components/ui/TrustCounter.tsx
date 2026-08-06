"use client";

import { useEffect, useRef, useState } from "react";

type TrustCounterProps = {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
};

/** Lightweight counter — requestAnimationFrame only, no framer-motion. */
export function TrustCounter({ value, suffix = "", prefix = "", duration = 1.8, className }: TrustCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(value);
    const startedRef = useRef(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            const id = requestAnimationFrame(() => setDisplay(value));
            return () => cancelAnimationFrame(id);
        }

        let frameId = 0;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting || startedRef.current) return;
                startedRef.current = true;
                observer.disconnect();

                const startTime = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min((now - startTime) / (duration * 1000), 1);
                    const eased = 1 - (1 - progress) ** 3;
                    setDisplay(Math.round(eased * value));
                    if (progress < 1) frameId = requestAnimationFrame(tick);
                };
                frameId = requestAnimationFrame(tick);
            },
            { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
        );

        observer.observe(node);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frameId);
        };
    }, [duration, value]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {display.toLocaleString()}
            {suffix}
        </span>
    );
}
