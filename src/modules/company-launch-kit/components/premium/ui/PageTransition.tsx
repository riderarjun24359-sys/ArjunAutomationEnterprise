"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const reduced = useReducedMotion();

    if (reduced) return <>{children}</>;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
