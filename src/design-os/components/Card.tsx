"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { fadeInUp } from "@/src/design-os/motion/variants";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    glass?: boolean;
    hover?: boolean;
}

export function Card({ children, className, glass = false, hover = false, ...props }: CardProps) {
    const reduced = useReducedMotion();

    const hoverEffect = {
        y: -4,
        boxShadow: `var(--dos-elevation-3), var(--dos-shadow-glow)`,
    };

    return (
        <m.div
            variants={fadeInUp}
            whileHover={hover && !reduced ? hoverEffect : undefined}
            whileTap={hover && !reduced ? { y: -1, scale: 0.99 } : undefined}
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
