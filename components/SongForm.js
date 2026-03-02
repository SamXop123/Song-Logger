"use client";

import { memo } from "react";
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
}) {
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
