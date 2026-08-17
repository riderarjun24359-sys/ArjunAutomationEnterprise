"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function AnimatedGridPattern({
    width = 60,
    height = 60,
    x = -1,
    y = -1,
    className,
    ...props
}: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    className?: string;
} & React.SVGProps<SVGSVGElement>) {
    const id = useId();
    const prefersReducedMotion = useReducedMotion();

    return (
        <svg
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <motion.rect
                width="100%"
                height="100%"
                fill={`url(#${id})`}
                className="text-[var(--dos-brand-primary)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 1 }}
            />
            {!prefersReducedMotion && (
                <motion.rect
                    width="100%"
                    height="100%"
                    fill={`url(#${id})`}
                    className="text-[var(--dos-brand-primary)]"
                    animate={{
                        x: [0, width],
                        y: [0, height],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            )}
        </svg>
    );
}
