"use client";

import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";

export function Spotlight({
    className,
    size = 400,
    children,
}: {
    className?: string;
    size?: number;
    children: React.ReactNode;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const prefersReducedMotion = useReducedMotion();

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: React.MouseEvent<HTMLDivElement>) {
        if (prefersReducedMotion) return;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group relative ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              ${size}px circle at ${mouseX}px ${mouseY}px,
              var(--dos-brand-primary),
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </div>
    );
}
