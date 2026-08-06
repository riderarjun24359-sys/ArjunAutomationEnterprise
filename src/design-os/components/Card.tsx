"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    glass?: boolean;
    hover?: boolean;
}

export function Card({ children, className, glass = false, hover = false, ...props }: CardProps) {
    const reduced = useReducedMotion();

    return (
        <m.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            whileHover={hover && !reduced ? { y: -3, boxShadow: "var(--dos-elevation-3)" } : undefined}
            className={cn(
                "dos-gpu rounded-[var(--dos-radius-2xl)] border p-6",
                glass ? "dos-glass-panel" : "border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] shadow-[var(--dos-elevation-2)]",
                hover ? "dos-interactive" : "",
                className,
            )}
            {...props}
        >
            {children}
        </m.div>
    );
}
