"use client";

import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/cn";
import { Check, AlertTriangle, Zap, Search, Bot } from "lucide-react";

export type AiState = "idle" | "observing" | "analyzing" | "executing" | "success" | "error";

interface AiStateIndicatorProps {
    state?: AiState;
    className?: string;
    size?: number;
}

const stateConfig = {
    idle: {
        icon: Bot,
        color: "var(--dos-text-tertiary)",
        glow: "transparent",
        animation: "none",
    },
    observing: {
        icon: Search,
        color: "var(--dos-info)",
        glow: "var(--dos-info)",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    analyzing: {
        icon: Bot,
        color: "var(--dos-brand-primary)",
        glow: "var(--dos-brand-primary)",
        animation: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    executing: {
        icon: Zap,
        color: "var(--dos-brand-accent)",
        glow: "var(--dos-brand-accent)",
        animation: "spin 1.5s linear infinite",
    },
    success: {
        icon: Check,
        color: "var(--dos-success)",
        glow: "transparent",
        animation: "none",
    },
    error: {
        icon: AlertTriangle,
        color: "var(--dos-error)",
        glow: "var(--dos-error)",
        animation: "pulse 1.5s ease-in-out infinite",
    },
};

export function AiStateIndicator({ state = "idle", className, size = 40 }: AiStateIndicatorProps) {
    const config = stateConfig[state];
    const Icon = config.icon;

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <AnimatePresence mode="wait">
                <m.div
                    key={state}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                >
                    <Icon style={{ color: config.color, width: size * 0.5, height: size * 0.5 }} />
                </m.div>
            </AnimatePresence>
            <svg className="absolute inset-0" width={size} height={size} viewBox="0 0 100 100">
                <m.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={config.color}
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 0.5 }}
                />
                <m.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={config.glow}
                    strokeWidth="6"
                    fill="none"
                    opacity="0.5"
                    style={{ filter: `blur(5px)`, animation: config.animation }}
                />
            </svg>
        </div>
    );
}
