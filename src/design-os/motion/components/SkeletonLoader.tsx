"use client";

import { cn } from "@/src/lib/cn";

export function SkeletonLoader({ className }: { className?: string }) {
    return <div className={cn("dos-skeleton", className)} aria-hidden="true" />;
}
