"use client";

import { memo, useCallback } from "react";
import { getLabelColor } from "@/lib/labelColors";

/**
 * A single song row. Memoized so it only re-renders when its own song changes
 * or the onEdit reference changes.
 */
const SongItem = memo(function SongItem({ song, onEdit, onDelete }) {
    const handleEdit = useCallback(() => onEdit(song), [onEdit, song]);
    const handleDelete = useCallback(() => {
        if (window.confirm(`Delete "${song.songName}"?`)) {
            onDelete(song.id);
        }
    }, [onDelete, song]);

    return (
        <li className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:shadow-sm">
            <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                        {song.songName}
                    </span>
                    {song.labels && song.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {song.labels.map((lbl) => (
                                <span
                                    key={lbl}
                                    className={`text-[10px] sm:text-xs font-medium text-white px-2 py-0.5 rounded-md shadow-sm ${getLabelColor(lbl)}`}
                                >
                                    {lbl}
                                </span>
                            ))}
                        </div>
                    )}
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                        {new Date(song.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleEdit}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                >
                    Delete
                </button>
            </div>
        </li>
    );
});

export default SongItem;
