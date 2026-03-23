"use client";

import { memo, useRef, useCallback, useState } from "react";
import SongItem from "@/components/SongItem";

/**
 * Pure UI: renders the song list and export/import buttons.
 * Memoized so it only re-renders when songs array or callbacks change.
 */
const SongList = memo(function SongList({ songs, onEdit, onDelete, onDeleteAll, onImportCSV, onExportCSV }) {
    const fileInputRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFileChange = useCallback(
        (e) => {
            const file = e.target.files?.[0];
            if (file) {
                onImportCSV(file);
                e.target.value = "";
            }
        },
        [onImportCSV]
    );

    const handleDeleteAllConfirmed = useCallback(() => {
        onDeleteAll();
        setShowConfirm(false);
    }, [onDeleteAll]);

    return (
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-slate-700/50 w-full h-full flex flex-col transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                    </span>
                    Your Log
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-1">
                        {songs.length}
                    </span>
                </h2>
                
                <div className="flex flex-wrap gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-violet-300 dark:hover:border-violet-600 transition-all cursor-pointer shadow-sm"
                        title="Import CSV"
                    >
                        Import
                    </button>
                    <button
                        onClick={onExportCSV}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-violet-300 dark:hover:border-violet-600 transition-all cursor-pointer shadow-sm"
                        title="Export CSV"
                    >
                        Export
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={songs.length === 0}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete all songs"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Confirmation dialog */}
            {showConfirm && (
                <div className="mb-6 p-5 border border-red-300 dark:border-red-800/60 rounded-2xl bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                        <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-2 rounded-full shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <div>
                            <p className="text-red-800 dark:text-red-300 font-semibold mb-1 text-sm">
                                Clear entire song log?
                            </p>
                            <p className="text-red-600 dark:text-red-400/80 text-xs mb-3">
                                This action cannot be undone. All entries will be permanently deleted.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDeleteAllConfirmed}
                                    className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 cursor-pointer text-xs font-bold shadow-sm shadow-red-500/30 transition-all"
                                >
                                    Yes, delete
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-4 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-xs font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {songs.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path></svg>
                    </div>
                    <p className="text-slate-900 dark:text-slate-200 font-semibold mb-1">Your log is empty</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Add your first song using the form, or import a previously exported CSV file.
                    </p>
                </div>
            ) : (
                <div className="flex-grow -mr-2 pr-2">
                    <ul className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pb-4 pr-1">
                        {songs.map((song) => (
                            <SongItem key={song.id} song={song} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
});

export default SongList;
