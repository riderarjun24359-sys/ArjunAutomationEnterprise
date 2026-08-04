"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type GradientMeshProps = {
    className?: string;
};

export function GradientMesh({ className }: GradientMeshProps) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
            <motion.div
                className="absolute -left-1/3 top-1/4 h-[60%] w-[60%] rounded-full opacity-30 blur-[80px]"
                style={{ background: "var(--premium-mesh-1)" }}
                animate={reduced ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -right-1/4 bottom-1/4 h-[50%] w-[50%] rounded-full opacity-25 blur-[70px]"
                style={{ background: "var(--premium-mesh-2)" }}
                animate={reduced ? undefined : { x: [0, -25, 0], y: [0, 15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute left-1/3 top-0 h-[40%] w-[40%] rounded-full opacity-20 blur-[60px]"
                style={{ background: "var(--premium-mesh-3)" }}
                animate={reduced ? undefined : { scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
