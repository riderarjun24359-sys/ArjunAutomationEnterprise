"use client";

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
