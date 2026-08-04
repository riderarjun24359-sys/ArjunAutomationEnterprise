"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type StaggerTextProps = {
    text: string;
    className?: string;
    mode?: "word" | "letter";
    delay?: number;
};

export function StaggerText({ text, className, mode = "word", delay = 0 }: StaggerTextProps) {
    const reduced = useReducedMotion();
    const units = mode === "word" ? text.split(" ") : text.split("");

    if (reduced) return <span className={className}>{text}</span>;

    return (
        <span className={cn("inline-flex flex-wrap", className)} aria-label={text}>
            {units.map((unit, i) => (
                <motion.span
                    key={`${unit}-${i}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {unit}
                    {mode === "word" && i < units.length - 1 ? "\u00A0" : ""}
                </motion.span>
            ))}
        </span>
    );
}
