"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/cn";

function subscribeMounted(callback: () => void) {
    callback();
    return () => {};
}

function getMountedSnapshot() {
    return true;
}

function getMountedServerSnapshot() {
    return false;
}

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, resolvedTheme } = useTheme();
    const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);

    if (!mounted) {
        return <div className={cn("h-9 w-9 rounded-lg", className)} aria-hidden="true" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <motion.button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--premium-border)] bg-[var(--premium-glass)] text-[var(--premium-fg-muted)] hover:text-[var(--premium-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
                className,
            )}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>
    );
}
