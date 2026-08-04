"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

type MorphCardProps = {
    children: React.ReactNode;
    className?: string;
};

export function MorphCard({ children, className }: MorphCardProps) {
    return (
        <motion.div
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-glass)] p-6",
                className,
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(6,182,212,0.3), rgba(139,92,246,0.4))",
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative rounded-[calc(1rem-1px)] bg-[var(--premium-bg)]/80 p-[calc(1.5rem-1px)] backdrop-blur-sm">{children}</div>
        </motion.div>
    );
}
