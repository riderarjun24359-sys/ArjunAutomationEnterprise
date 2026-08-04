"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

export function AnimatedLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link href={href} className={cn("group relative inline-flex text-[var(--dos-text-link)]", className)}>
            {children}
            <motion.span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[var(--dos-text-link)] transition group-hover:scale-x-100" layoutId="dos-link-underline" />
        </Link>
    );
}
