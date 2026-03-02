"use client";

import { memo, useState } from "react";
import LabelSelector from "@/components/LabelSelector";

/**
 * Pure UI form for adding/editing a song.
 * Memoized — only re-renders when its own props change.
 */
const SongForm = memo(function SongForm({
    songName,
    onSongNameChange,
    selectedLabels,
    onToggleLabel,
    customLabel,
    onCustomLabelChange,
    onAddCustomLabel,
    editingSong,
    onSubmit,
    onCancelEdit,
    customDate,
    onCustomDateChange,
}) {
    const [useCustomDate, setUseCustomDate] = useState(false);

    // Format today's date as YYYY-MM-DDTHH:MM for the datetime-local default
    const nowLocal = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const handleToggleCustomDate = () => {
        const next = !useCustomDate;
        setUseCustomDate(next);
        // Pre-fill with current time when enabling; clear when disabling
        if (next) {
            onCustomDateChange(nowLocal());
        } else {
            onCustomDateChange("");
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={songName}
                onChange={(e) => onSongNameChange(e.target.value)}
                placeholder="Enter song name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 mb-2"
            />
            <LabelSelector
                selectedLabels={selectedLabels}
                onToggle={onToggleLabel}
                customLabel={customLabel}
                onCustomLabelChange={onCustomLabelChange}
                onAddCustomLabel={onAddCustomLabel}
            />

            {/* Custom date/time toggle */}
            <div className="my-3">
                <button
                    type="button"
                    onClick={handleToggleCustomDate}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${useCustomDate
                            ? "bg-violet-100 dark:bg-violet-900/30 border-violet-400 dark:border-violet-600 text-violet-700 dark:text-violet-300"
                            : "bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-violet-400 hover:text-violet-600"
                        }`}
                >
                    <span>{useCustomDate ? "🗓️" : "🕐"}</span>
                    {useCustomDate ? "Custom date set" : "Set custom date & time"}
                </button>

                {useCustomDate && (
                    <div className="mt-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700">
                        <label className="block text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1.5">
                            Log this song on:
                        </label>
                        <input
                            type="datetime-local"
                            value={customDate}
                            onChange={(e) => onCustomDateChange(e.target.value)}
                            max={nowLocal()}
                            className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 border-violet-300"
                        />
                        <p className="text-[10px] text-violet-500 dark:text-violet-400 mt-1.5 italic">
                            Dates in the future are not allowed.
                        </p>
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
            >
                {editingSong ? "Save Edit" : "Add Song"}
            </button>
            {editingSong && (
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-2 cursor-pointer"
                >
                    Cancel Edit
                </button>
            )}
        </form>
    );
});

export default SongForm;
