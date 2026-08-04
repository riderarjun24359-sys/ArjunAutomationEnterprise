"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../variants";
import { cn } from "@/src/lib/cn";

export function StaggerReveal({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={cn(className)}>
            {children}
        </motion.div>
    );
}

export function StaggerRevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div variants={staggerItem} className={cn(className)}>
            {children}
        </motion.div>
    );
}
