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
        <li className="group p-4 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-white/90 dark:hover:bg-slate-800/80 hover:border-violet-200/50 dark:hover:border-violet-700/50">
            <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                        {song.songName}
                    </h3>
                    {song.labels && song.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {song.labels.map((lbl) => (
                                <span
                                    key={lbl}
                                    className={`text-[10px] sm:text-xs font-semibold text-white px-2.5 py-0.5 rounded-full shadow-sm ring-1 ring-white/20 transition-all ${getLabelColor(lbl)}`}
                                >
                                    {lbl}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <time dateTime={song.date}>
                            {new Date(song.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </time>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <button
                    onClick={handleEdit}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors cursor-pointer"
                    title="Edit song"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors cursor-pointer"
                    title="Delete song"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </li>
    );
});

export default SongItem;
