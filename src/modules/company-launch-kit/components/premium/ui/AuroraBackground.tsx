"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type AuroraBackgroundProps = {
    className?: string;
    children?: React.ReactNode;
};

export function AuroraBackground({ className, children }: AuroraBackgroundProps) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("premium-aurora relative overflow-hidden", className)}>
            {!reduced && (
                <>
                    <motion.div
                        className="pointer-events-none absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full blur-[100px]"
                        style={{ background: "var(--premium-aurora-1)" }}
                        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="pointer-events-none absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full blur-[80px]"
                        style={{ background: "var(--premium-aurora-2)" }}
                        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </>
            )}
            {children}
        </div>
    );
}