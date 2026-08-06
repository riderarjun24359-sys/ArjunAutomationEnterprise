"use client";

import { useEffect, useState } from "react";
import { resolveImmersiveTheme, type ImmersiveTheme } from "../themes";

export function useTimeAwareTheme(pollMs = 60_000): ImmersiveTheme {
    const [theme, setTheme] = useState<ImmersiveTheme>(() => resolveImmersiveTheme());

    useEffect(() => {
        const tick = () => setTheme(resolveImmersiveTheme());
        tick();
        const id = window.setInterval(tick, pollMs);
        return () => window.clearInterval(id);
    }, [pollMs]);

    return theme;
}
