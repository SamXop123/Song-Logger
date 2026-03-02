"use client";

export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white cursor-pointer"
        >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}
