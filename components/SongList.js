"use client";

import { memo, useRef, useCallback } from "react";
import SongItem from "@/components/SongItem";

/**
 * Pure UI: renders the song list and export/import buttons.
 * Memoized so it only re-renders when songs array or callbacks change.
 */
const SongList = memo(function SongList({ songs, onEdit, onDelete, onImportCSV, onExportCSV }) {
    const fileInputRef = useRef(null);

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
                </div>
            </div>
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
