"use client";

import { motion } from "framer-motion";
import { useScrollProgress } from "@/src/modules/company-launch-kit/hooks/useScrollProgress";

export function ScrollProgress() {
    const progress = useScrollProgress();

    return (
        <motion.div
            className="fixed left-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-orange-600 via-cyan-500 to-violet-500"
            style={{ width: `${progress * 100}%` }}
            aria-hidden="true"
        />
    );
}
