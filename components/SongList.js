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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Song Log
                </h2>
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Import CSV
                    </button>
                    <button
                        onClick={onExportCSV}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                    >
                        Export to CSV
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                        title="Delete all songs"
                    >
                        Delete All
                    </button>
                </div>
            </div>

            {/* Confirmation dialog */}
            {showConfirm && (
                <div className="mb-4 p-4 border border-red-400 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="text-red-700 dark:text-red-400 font-semibold mb-3">
                        ⚠️ Are you sure you want to delete <span className="underline">all songs</span>? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDeleteAllConfirmed}
                            className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 cursor-pointer font-medium"
                        >
                            Yes, delete everything
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {songs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No songs logged yet.</p>
            ) : (
                <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                    {songs.map((song) => (
                        <SongItem key={song.id} song={song} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </ul>
            )}
        </div>
    );
});

export default SongList;
