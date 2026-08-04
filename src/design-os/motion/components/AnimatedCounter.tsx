"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "@/src/lib/cn";

export function AnimatedCounter({ value, className, suffix = "" }: { value: number; className?: string; suffix?: string }) {
    const reduced = useReducedMotion();
    const spring = useSpring(value, { stiffness: 100, damping: 30 });
    const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
    const [text, setText] = useState(value.toLocaleString());

    useEffect(() => {
        if (reduced) return;
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
