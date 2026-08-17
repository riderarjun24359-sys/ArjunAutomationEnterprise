import * as React from "react"
import { m, HTMLMotionProps } from "framer-motion"

import { cn } from "@/src/lib/cn"
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion"
import { fadeInUp } from "@/src/design-os/motion/variants"

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    glass?: boolean;
    hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, glass = true, hover = true, ...props }, ref) => {
        const reduced = useReducedMotion()

        const hoverEffect = {
            y: -2,
            boxShadow: `var(--dos-elevation-3), 0 0 15px rgba(56, 189, 248, 0.15)`,
        }

        return (
            <m.div
                ref={ref}
                variants={fadeInUp}
                whileHover={hover && !reduced ? hoverEffect : undefined}
                className={cn(
                    "dos-gpu rounded-[var(--dos-radius-2xl)] border border-[var(--dos-border-strong)] p-6 backdrop-blur-md",
                    glass ? "dos-glass-panel bg-[var(--dos-surface-secondary)]/50" : "bg-[var(--dos-surface-elevated)] shadow-[var(--dos-elevation-2)]",
                    hover ? "dos-interactive" : "",
                    className,
                )}
                {...props}
            >
                {children}
            </m.div>
        )
    }
)
Card.displayName = "Card"

export { Card }
