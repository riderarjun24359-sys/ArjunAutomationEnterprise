"use client";

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
