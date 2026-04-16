"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Reads/persists theme from localStorage.
 * Applies the `dark` class to <html> — all DOM work is inside effects.
 */
export function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        return localStorage.getItem("theme") || "light";
    });

    // Sync class + storage whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    return { theme, toggleTheme };
}
