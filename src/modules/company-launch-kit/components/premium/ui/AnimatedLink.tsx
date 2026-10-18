"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

type AnimatedLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
    external?: boolean;
};

export function AnimatedLink({ href, children, className, external }: AnimatedLinkProps) {
    const Comp = external ? "a" : Link;
    const props = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

    return (
        <Comp
            {...props}
            className={cn("group relative inline-flex items-center text-sm font-medium text-[var(--premium-fg-muted)] hover:text-orange-600 dark:hover:text-orange-400", className)}
        >
            {children}
            <motion.span
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-orange-600 dark:bg-orange-400"
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
            />
        </Comp>
    );
}
