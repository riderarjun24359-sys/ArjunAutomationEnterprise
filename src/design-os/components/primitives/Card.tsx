import * as React from "react";
import { m, HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { fadeInUp } from "@/src/design-os/motion/variants";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    glass?: boolean;
    hover?: boolean;
    variant?: "base" | "active" | "insight" | "foundation";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, glass = false, hover = false, variant = "base", ...props }, ref) => {
        const reduced = useReducedMotion();

        const hoverEffect = {
            y: -1,
            boxShadow: `0 4px 12px var(--dos-border-subtle)`,
        };

        const bgClass = {
            base: "bg-[var(--dos-surface-base)] border-[var(--dos-border)]",
            active: "bg-[var(--dos-surface-active)] border-[var(--dos-border)]",
            insight: "bg-[var(--dos-surface-insight)] border-[var(--dos-brand-accent)]/20 backdrop-blur-md",
            foundation: "bg-[var(--dos-surface-foundation)] border-[var(--dos-border-subtle)]",
        }[variant];

        return (
            <m.div
                ref={ref}
                variants={fadeInUp}
                whileHover={hover && !reduced ? hoverEffect : undefined}
                className={cn(
                    "dos-gpu rounded-[var(--dos-radius-xl)] border p-5 transition-all duration-[var(--dos-duration-normal)]",
                    glass ? "bg-[var(--dos-surface-secondary)]/50 backdrop-blur-sm border-[var(--dos-border-subtle)]" : bgClass,
                    hover ? "cursor-pointer hover:border-[var(--dos-border)]" : "",
                    className,
                )}
                {...props}
            >
                {children}
            </m.div>
        );
    }
);
Card.displayName = "Card";

export { Card };
