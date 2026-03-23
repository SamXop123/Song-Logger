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
        // Single Timestamp column (raw ISO 8601) avoids all timezone split issues
        const headers = "Timestamp,Song Name,Labels\n";
        const csv = songs.reduce((acc, song) => {
            const labels = (song.labels || []).join(", ");
            return (
                acc +
                `${song.date},${csvEscape(song.songName)},${csvEscape(labels)}\n`
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

            if (lines.length < 2) {
                showMessage("CSV file is empty or has no data rows.");
                return;
            }

            // Detect format from header
            const header = lines[0].toLowerCase();
            // New format: Timestamp,Song Name,Labels  (3 columns)
            // Old format: Date,Time,Song Name,Labels  (4 columns)
            const isNewFormat = header.startsWith("timestamp");

            // Deduplicate by composite key: songName (lowered) + exact ISO date string
            const existingKeys = new Set(
                (await getDb().songs.toArray()).map(
                    (s) => `${s.songName.toLowerCase()}|||${s.date}`
                )
            );

            /** Parse a single CSV line; returns { fields, quoted[] } */
            const parseLine = (line) => {
                const fields = [];
                const quoted = [];
                let current = "";
                let inQuotes = false;
                let fieldIsQuoted = false;
                for (let c = 0; c < line.length; c++) {
                    const ch = line[c];
                    if (ch === '"') {
                        if (inQuotes && line[c + 1] === '"') {
                            current += '"';
                            c++;
                        } else {
                            inQuotes = !inQuotes;
                            if (inQuotes) fieldIsQuoted = true;
                        }
                    } else if (ch === "," && !inQuotes) {
                        fields.push(current.trim());
                        quoted.push(fieldIsQuoted);
                        current = "";
                        fieldIsQuoted = false;
                    } else {
                        current += ch;
                    }
                }
                fields.push(current.trim());
                quoted.push(fieldIsQuoted);
                return { fields, quoted };
            };

            const newSongs = [];
            for (let i = 1; i < lines.length; i++) {
                const { fields, quoted } = parseLine(lines[i]);

                let date, songName, labelsStr;

                if (isNewFormat) {
                    // Timestamp,Song Name,Labels
                    if (fields.length < 2) continue;
                    date = fields[0];
                    songName = fields[1];
                    labelsStr = fields[2] || "";
                } else {
                    // Old format: Date,Time,Song Name[,Song Name continued...],["Labels"]
                    // The labels field is always the last field AND was originally quoted.
                    // If the last field is not quoted, the row has no labels.
                    if (fields.length < 3) continue;
                    const dateStr = fields[0];
                    const timeStr = fields[1];

                    const lastIsQuotedLabel = quoted[fields.length - 1] && fields.length > 3;
                    if (lastIsQuotedLabel) {
                        labelsStr = fields[fields.length - 1];
                        // Song name: all unquoted fields between time and labels, rejoined
                        songName = fields.slice(2, fields.length - 1).join(",");
                    } else {
                        // No labels field — everything from field[2] onward is the song name
                        labelsStr = "";
                        songName = fields.slice(2).join(",");
                    }

                    // Parse DD-MM-YYYY or YYYY-MM-DD
                    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dateStr);
                    const isoDate = ddmmyyyy
                        ? `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`
                        : dateStr;
                    const localAttempt = new Date(`${isoDate}T${timeStr}`);
                    date = !isNaN(localAttempt.getTime())
                        ? localAttempt.toISOString()
                        : new Date().toISOString();
                }

                if (!songName) continue;

                // Validate / normalise the date to a proper ISO string
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) continue;
                date = parsedDate.toISOString();

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
