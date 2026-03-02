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
        <li className="p-2 bg-gray-50 dark:bg-gray-700 rounded flex justify-between items-center">
            <div>
                <span className="font-medium text-gray-900 dark:text-white">
                    {song.songName}
                </span>
                {song.labels && song.labels.length > 0 && (
                    <div className="mt-1">
                        {song.labels.map((lbl) => (
                            <span
                                key={lbl}
                                className={`text-sm text-white px-2 py-1 rounded ${getLabelColor(lbl)} mr-1`}
                            >
                                {lbl}
                            </span>
                        ))}
                    </div>
                )}
                <br />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(song.date).toLocaleString()}
                </span>
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
