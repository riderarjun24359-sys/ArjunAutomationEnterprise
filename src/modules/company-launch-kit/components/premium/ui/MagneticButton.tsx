"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/src/lib/cn";
import { useMagnetic } from "@/src/modules/company-launch-kit/hooks/useMagnetic";
import { animation } from "@/src/modules/company-launch-kit/design-system/tokens";

type MagneticButtonProps = {
    children: React.ReactNode;
    href?: string;
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit";
};

export function MagneticButton({ children, href, variant = "primary", className, onClick, type = "button" }: MagneticButtonProps) {
    const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>();

    const styles = cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        variant === "primary" && "bg-indigo-700 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500",
        variant === "secondary" && "border border-[var(--premium-border)] bg-[var(--premium-glass)] text-[var(--premium-fg)] hover:border-indigo-500/30",
        variant === "ghost" && "text-[var(--premium-fg-muted)] hover:text-[var(--premium-fg)]",
        className,
    );

    const content = (
        <>
            <span className="relative z-10">{children}</span>
            <motion.span
                className="pointer-events-none absolute inset-0 rounded-xl bg-white/20 opacity-0"
                whileTap={{ scale: 2, opacity: 0.3 }}
                transition={{ duration: animation.fast }}
            />
        </>
    );

    if (href) {
        return (
            <Link href={href} className={styles}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            ref={ref}
            type={type}
            className={styles}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
        >
            {content}
        </motion.button>
    );
}
