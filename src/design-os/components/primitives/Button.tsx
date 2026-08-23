import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { m, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { useMagnetic } from "@/src/design-os/motion/hooks/useMagnetic";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";
import { pressableTransition } from "@/src/design-os/motion/variants";

const buttonVariants = cva(
    "dos-ripple dos-focus-ring inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-[var(--dos-brand-primary)] text-white hover:bg-[var(--dos-brand-primary-hover)] shadow-sm",
                secondary: "border border-[var(--dos-border)] bg-[var(--dos-surface-base)] text-[var(--dos-text-primary)] hover:bg-[var(--dos-surface-active)] shadow-sm",
                ghost: "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-active)] hover:text-[var(--dos-text-primary)]",
                danger: "bg-[var(--dos-tint-critical)] border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10 shadow-sm",
            },
            size: {
                sm: "h-8 px-4 text-xs rounded-[var(--dos-radius-lg)]",
                md: "h-10 px-5 text-sm rounded-[var(--dos-radius-xl)]",
                lg: "h-12 px-7 text-base rounded-[var(--dos-radius-xl)]",
                icon: "h-10 w-10 rounded-[var(--dos-radius-xl)]",
            },
        },
        defaultVariants: { variant: "primary", size: "md" },
    }
);

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">,
        VariantProps<typeof buttonVariants> {
    loading?: boolean;
    magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, magnetic, children, disabled, type = "button", ...props }, ref) => {
        const { ref: magneticRef, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>();
        const reduced = useReducedMotion();

        const combinedRef = React.useMemo(() => {
            if (magnetic) return magneticRef;
            if (typeof ref === "function") return ref;
            return ref;
        }, [magnetic, magneticRef, ref]);

        return (
            <m.button
                ref={combinedRef as React.RefObject<HTMLButtonElement>}
                type={type}
                onMouseMove={magnetic ? onMouseMove : undefined}
                onMouseLeave={magnetic ? onMouseLeave : undefined}
                whileHover={reduced ? undefined : { y: -0.5 }}
                whileTap={reduced ? undefined : { scale: 0.99 }}
                transition={pressableTransition}
                className={cn(buttonVariants({ variant, size }), "dos-gpu", className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {children as React.ReactNode}
            </m.button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
