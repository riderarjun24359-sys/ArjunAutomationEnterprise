"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/src/design-os/motion/hooks/useReducedMotion";

export function useParallaxAmbient(enabled = true) {
    const reduced = useReducedMotion();
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const active = enabled && !reduced;

    useEffect(() => {
        if (!active) return;

        let frame = 0;
        const onMove = (event: PointerEvent) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const x = (event.clientX / window.innerWidth - 0.5) * 12;
                const y = (event.clientY / window.innerHeight - 0.5) * 10;
                setOffset({ x, y });
            });
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onMove);
        };
    }, [active]);

    return { offset: active ? offset : { x: 0, y: 0 }, reduced };
}
