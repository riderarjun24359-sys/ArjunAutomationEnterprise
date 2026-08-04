"use client";

import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { useMousePosition } from "@/src/modules/company-launch-kit/hooks/useMousePosition";
import { useReducedMotion } from "@/src/modules/company-launch-kit/hooks/useReducedMotion";

function subscribeTouch(callback: () => void) {
    const mq = window.matchMedia("(pointer: coarse)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}

function getTouchSnapshot() {
    return window.matchMedia("(pointer: coarse)").matches;
}

function getTouchServerSnapshot() {
    return true;
}

export function CursorGlow() {
    const { x, y } = useMousePosition();
    const reduced = useReducedMotion();
    const isTouch = useSyncExternalStore(subscribeTouch, getTouchSnapshot, getTouchServerSnapshot);

    if (reduced || isTouch) return null;

    return (
        <motion.div
            className="pointer-events-none fixed z-[9998] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[80px]"
            style={{
                left: x,
                top: y,
                background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
            }}
            aria-hidden="true"
        />
    );
}
