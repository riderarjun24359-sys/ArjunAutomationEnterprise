"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type SectionRevealProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
};

export function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
    const reduced = useReducedMotion();

    if (reduced) return <div className={className}>{children}</div>;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
