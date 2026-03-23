"use client";

export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white cursor-pointer"
        >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}
