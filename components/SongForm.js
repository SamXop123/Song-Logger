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
        <form onSubmit={onSubmit} className="flex flex-col h-full mt-2">
            <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Song Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={songName}
                        onChange={(e) => onSongNameChange(e.target.value)}
                        placeholder="song here..."
                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 dark:focus:ring-violet-400/50 dark:focus:border-violet-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="mb-5">
                <LabelSelector
                    selectedLabels={selectedLabels}
                    onToggle={onToggleLabel}
                    customLabel={customLabel}
                    onCustomLabelChange={onCustomLabelChange}
                    onAddCustomLabel={onAddCustomLabel}
                />
            </div>

            {/* Custom date/time toggle */}
            <div className="mb-6">
                <button
                    type="button"
                    onClick={handleToggleCustomDate}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm ${useCustomDate
                        ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-700/50"
                        : "bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                >
                    <span>{useCustomDate ? "🗓️" : "🕐"}</span>
                    {useCustomDate ? "Custom date active" : "Set custom date & time"}
                </button>

                {useCustomDate && (
                    <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-100 dark:border-violet-800/30 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">
                            Log this song on:
                        </label>
                        <input
                            type="datetime-local"
                            value={customDate}
                            onChange={(e) => onCustomDateChange(e.target.value)}
                            max={nowLocal()}
                            className="w-full px-4 py-2.5 text-sm bg-white/80 dark:bg-slate-950/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-slate-900 dark:text-slate-100 dark:border-violet-800/50 border-violet-200 transition-all shadow-sm"
                        />
                        <p className="text-[10px] text-violet-500/70 dark:text-violet-400/80 mt-2 font-medium">
                            Dates in the future are not allowed.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-3">
                <button
                    type="submit"
                    className="w-full relative group overflow-hidden bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm tracking-wide p-3.5 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                        {editingSong ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Save Changes
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Add to Log
                            </>
                        )}
                    </span>
                </button>
                {editingSong && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
    );
});

export default SongForm;
