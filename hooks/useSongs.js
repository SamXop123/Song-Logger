"use client";

import { useState, useEffect, useCallback } from "react";
import getDb from "@/lib/db";

/**
 * Manages the songs list with full CRUD against Dexie IndexedDB.
 *
 * SSR safety:
 * - `getDb()` is a lazy singleton — IndexedDB is never touched during SSR.
 * - All db calls happen inside `useEffect` or async user-event callbacks,
 *   both of which only run on the client.
 */
export function useSongs() {
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState("");

    // Load on mount — client-side only
    useEffect(() => {
        getDb().songs.orderBy("date").reverse().toArray().then(setSongs);
    }, []);

    const showMessage = useCallback((msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    }, []);

    const addSong = useCallback(
        async (songName, labels, customDate) => {
            const date = customDate
                ? new Date(customDate).toISOString()
                : new Date().toISOString();
            const newSong = {
                songName: songName.trim(),
                date,
                labels,
            };
            const id = await getDb().songs.add(newSong);
            setSongs((prev) => {
                const updated = [{ ...newSong, id }, ...prev];
                // Re-sort by date descending so a backdated song appears in the right place
                return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
            });
            showMessage("Song added successfully!");
        },
        [showMessage]
    );

    const updateSong = useCallback(
        async (existingSong, songName, labels) => {
            const updated = { ...existingSong, songName: songName.trim(), labels };
            await getDb().songs.update(existingSong.id, {
                songName: songName.trim(),
                labels,
            });
            setSongs((prev) =>
                prev.map((s) => (s.id === existingSong.id ? updated : s))
            );
            showMessage("Song updated successfully!");
        },
        [showMessage]
    );

    const deleteSong = useCallback(
        async (id) => {
            await getDb().songs.delete(id);
            setSongs((prev) => prev.filter((s) => s.id !== id));
            showMessage("Song deleted successfully!");
        },
        [showMessage]
    );

    const deleteAllSongs = useCallback(async () => {
        await getDb().songs.clear();
        setSongs([]);
        showMessage("All songs deleted.");
    }, [showMessage]);

    /** Escape a value for CSV: wrap in quotes if it contains comma, quote, or newline. */
    const csvEscape = (val) => {
        if (/[,"\n\r]/.test(val)) {
            return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
    };

    const exportToCSV = useCallback(() => {
        const headers = "Date,Time,Song Name,Labels\n";
        const csv = songs.reduce((acc, song) => {
            const d = new Date(song.date);
            // Use stable ISO-style date (YYYY-MM-DD) and 24h time (HH:MM:SS)
            const dateStr = d.toISOString().split("T")[0];
            const timeStr = d.toTimeString().split(" ")[0]; // HH:MM:SS
            const labels = (song.labels || []).join(", ");
            return (
                acc +
                `${dateStr},${timeStr},${csvEscape(song.songName)},${csvEscape(labels)}\n`
            );
        }, headers);

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `song_log_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [songs]);

    const importFromCSV = useCallback(
        async (file) => {
            const text = await file.text();
            const lines = text.split("\n").filter((l) => l.trim());

            // Skip header row
            if (lines.length < 2) {
                showMessage("CSV file is empty or has no data rows.");
                return;
            }

            // Deduplicate by composite key: songName (lowered) + date ISO string
            const existingKeys = new Set(
                (await getDb().songs.toArray()).map(
                    (s) => `${s.songName.toLowerCase()}|||${s.date}`
                )
            );

            const newSongs = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];

                // Parse CSV respecting quoted fields
                // Format: Date,Time,Song Name,"Label1, Label2"
                let fields = [];
                let current = "";
                let inQuotes = false;
                for (let c = 0; c < line.length; c++) {
                    const ch = line[c];
                    if (ch === '"') {
                        inQuotes = !inQuotes;
                    } else if (ch === "," && !inQuotes) {
                        fields.push(current.trim());
                        current = "";
                    } else {
                        current += ch;
                    }
                }
                fields.push(current.trim());

                if (fields.length < 3) continue;

                const dateStr = fields[0];
                const timeStr = fields[1];
                const songName = fields[2];
                const labelsStr = fields[3] || "";

                if (!songName) continue;

                // Try to reconstruct a proper date
                let date;
                try {
                    // Handle ISO format (YYYY-MM-DD HH:MM:SS) or locale format
                    const parsed = new Date(`${dateStr}T${timeStr}`);
                    if (!isNaN(parsed.getTime())) {
                        date = parsed.toISOString();
                    } else {
                        // Fallback: try space-separated (for old locale-format CSVs)
                        const parsed2 = new Date(`${dateStr} ${timeStr}`);
                        date = !isNaN(parsed2.getTime())
                            ? parsed2.toISOString()
                            : new Date().toISOString();
                    }
                } catch {
                    date = new Date().toISOString();
                }

                const key = `${songName.toLowerCase()}|||${date}`;
                if (existingKeys.has(key)) continue;

                const labels = labelsStr
                    ? labelsStr.split(",").map((l) => l.trim()).filter(Boolean)
                    : [];

                newSongs.push({ songName, date, labels });
                existingKeys.add(key);
            }

            if (newSongs.length === 0) {
                showMessage("No new songs to import (all duplicates or empty).");
                return;
            }

            await getDb().songs.bulkAdd(newSongs);
            const allSongs = await getDb().songs.orderBy("date").reverse().toArray();
            setSongs(allSongs);
            showMessage(`Imported ${newSongs.length} song(s) successfully!`);
        },
        [showMessage]
    );

    return { songs, message, addSong, updateSong, deleteSong, deleteAllSongs, importFromCSV, exportToCSV };
}
