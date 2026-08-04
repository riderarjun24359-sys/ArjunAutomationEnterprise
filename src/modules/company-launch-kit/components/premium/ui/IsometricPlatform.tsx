"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

type IsometricPlatformProps = {
    className?: string;
};

export function IsometricPlatform({ className }: IsometricPlatformProps) {
    const reduced = useReducedMotion();

    return (
        <div className={cn("relative h-64 w-full perspective-[800px]", className)} aria-hidden="true">
            <motion.div
                className="absolute left-1/2 top-1/2 h-32 w-48 -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: "preserve-3d", transform: "rotateX(55deg) rotateZ(-45deg)" }}
                animate={reduced ? undefined : { rotateZ: [-45, -42, -45] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg shadow-indigo-500/30" />
                <div
                    className="absolute -top-8 left-4 h-16 w-16 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-md"
                    style={{ transform: "translateZ(24px)" }}
                />
                <div
                    className="absolute -top-4 right-4 h-12 w-20 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 shadow-md"
                    style={{ transform: "translateZ(40px)" }}
                />
                <div
                    className="absolute bottom-2 left-8 h-10 w-14 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md"
                    style={{ transform: "translateZ(16px)" }}
                />
            </motion.div>
            <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        </div>
    );
}
