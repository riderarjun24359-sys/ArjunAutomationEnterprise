"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/cn";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    glass?: boolean;
    hover?: boolean;
}

export function Card({ children, className, glass = false, hover = false, ...props }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={hover ? { y: -4, boxShadow: "var(--dos-shadow-lg)" } : undefined}
            className={cn(
                "rounded-[var(--dos-radius-2xl)] border p-6",
                glass ? "dos-glass" : "border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-shadow-md)]",
                className,
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
