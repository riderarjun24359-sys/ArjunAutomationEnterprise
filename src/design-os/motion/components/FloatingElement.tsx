"use client";

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
