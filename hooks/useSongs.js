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
        async (songName, labels) => {
            const newSong = {
                songName: songName.trim(),
                date: new Date().toISOString(),
                labels,
            };
            const id = await getDb().songs.add(newSong);
            setSongs((prev) => [{ ...newSong, id }, ...prev]);
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

    const exportToCSV = useCallback(() => {
        const headers = "Date,Time,Song Name,Labels\n";
        const csv = songs.reduce((acc, song) => {
            const d = new Date(song.date);
            const labels = (song.labels || []).join(", ");
            return (
                acc +
                `${d.toLocaleDateString()},${d.toLocaleTimeString()},${song.songName},"${labels}"\n`
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

            const existingNames = new Set(
                (await getDb().songs.toArray()).map((s) => s.songName.toLowerCase())
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
                if (existingNames.has(songName.toLowerCase())) continue;

                // Try to reconstruct a proper date from the locale strings
                let date;
                try {
                    date = new Date(`${dateStr} ${timeStr}`).toISOString();
                } catch {
                    date = new Date().toISOString();
                }

                const labels = labelsStr
                    ? labelsStr.split(",").map((l) => l.trim()).filter(Boolean)
                    : [];

                newSongs.push({ songName, date, labels });
                existingNames.add(songName.toLowerCase());
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

    return { songs, message, addSong, updateSong, deleteSong, importFromCSV, exportToCSV };
}
