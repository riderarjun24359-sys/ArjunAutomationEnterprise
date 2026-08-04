"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

const STRENGTH = 0.35;

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>() {
    const ref = useRef<T>(null);
    const reduced = useReducedMotion();

    const onMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (reduced || !ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            ref.current.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
        },
        [reduced],
    );

    const onMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = "translate(0, 0)";
    }, []);

    return { ref, onMouseMove, onMouseLeave, reduced };
}
