import * as React from "react";
import { cn } from "@/src/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, disabled, type = "text", ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                disabled={disabled}
                className={cn(
                    "dos-focus-ring h-10 w-full rounded-[var(--dos-radius-lg)] border bg-[var(--dos-surface-base)] px-3 text-sm text-[var(--dos-text-primary)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--dos-duration-fast)] placeholder:text-[var(--dos-text-tertiary)] disabled:cursor-not-allowed disabled:opacity-50",
                    error 
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                        : "border-[var(--dos-border)] focus:border-[var(--dos-brand-primary)] focus:bg-[var(--dos-surface-active)] focus:ring-2 focus:ring-[var(--dos-brand-primary)]/10",
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
