"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { m } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { useMagnetic } from "@/src/design-os/motion/hooks/useMagnetic";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { pressableTransition } from "@/src/design-os/motion/variants";

const buttonVariants = cva(
    "dos-ripple dos-focus-ring inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-[var(--dos-brand-primary)] text-white hover:bg-[var(--dos-brand-primary-hover)]",
                secondary: "border border-[var(--dos-border)] bg-[var(--dos-surface-secondary)] text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-tertiary)]",
                ghost: "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]",
                danger: "bg-[var(--dos-error)] text-white hover:opacity-90",
            },
            size: {
                sm: "h-8 px-3 text-xs rounded-[var(--dos-radius-md)]",
                md: "h-10 px-4 text-sm rounded-[var(--dos-radius-lg)]",
                lg: "h-12 px-6 text-base rounded-[var(--dos-radius-lg)]",
            },
        },
        defaultVariants: { variant: "primary", size: "md" },
    },
);

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">, VariantProps<typeof buttonVariants> {
    loading?: boolean;
    magnetic?: boolean;
}

export function Button({ className, variant, size, loading, magnetic, children, disabled, type = "button", ...props }: ButtonProps) {
    const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>();
    const reduced = useReducedMotion();

    return (
        <m.button
            ref={magnetic ? ref : undefined}
            type={type}
            onMouseMove={magnetic ? onMouseMove : undefined}
            onMouseLeave={magnetic ? onMouseLeave : undefined}
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={pressableTransition}
            className={cn(buttonVariants({ variant, size }), "dos-gpu", className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {children}
        </m.button>
    );
}
