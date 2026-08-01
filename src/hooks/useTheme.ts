import { useCallback } from "react";
import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
    const { theme, setTheme, resolvedTheme, systemTheme, themes } = useNextTheme();

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, [resolvedTheme, setTheme]);

    return {
        theme,
        resolvedTheme,
        systemTheme,
        themes,
        setTheme,
        toggleTheme,
    };
};
