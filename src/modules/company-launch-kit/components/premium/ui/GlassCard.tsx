"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

type GlassCardProps = {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
};

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
    return (
        <motion.div
            className={cn("premium-glass rounded-2xl p-6 shadow-[var(--premium-shadow)]", className)}
            whileHover={hover ? { y: -4, boxShadow: "0 20px 50px rgba(99,102,241,0.15)" } : undefined}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
