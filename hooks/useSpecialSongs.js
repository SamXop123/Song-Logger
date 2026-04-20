"use client";

import { useState, useCallback } from "react";
import { sortMonthSpecialSongs, sortYearSpecialSongs } from "@/lib/specialSongSort";

/**
 * Manages the special songs (Song of the Month / Song of the Year) using localStorage.
 * Kept separate from main song list.
 */
export function useSpecialSongs() {
    const sortAllSpecialSongs = useCallback((songs) => {
        return [
            ...sortYearSpecialSongs(songs.filter((song) => song.type === "year")),
            ...sortMonthSpecialSongs(songs.filter((song) => song.type === "month")),
        ];
    }, []);

    const [specialSongs, setSpecialSongs] = useState(() => {
        if (typeof window === "undefined") return [];

        const stored = localStorage.getItem("song_logger_special_songs");
        if (!stored) return [];

        try {
            return sortAllSpecialSongs(JSON.parse(stored));
        } catch {
            console.error("Failed to parse special songs from localStorage");
            return [];
        }
    });

    // Load on mount — client-side only

    const addSpecialSong = useCallback(
        (type, songName, year, month = null) => {
            const date = new Date().toISOString();
            const newSong = {
                id: crypto.randomUUID(),
                type,
                songName: songName.trim(),
                year,
                month,
                dateAdded: date,
            };
            
            setSpecialSongs((prev) => {
                const sorted = sortAllSpecialSongs([newSong, ...prev]);
                localStorage.setItem("song_logger_special_songs", JSON.stringify(sorted));
                return sorted;
            });
        },
        [sortAllSpecialSongs]
    );

    const deleteSpecialSong = useCallback(
        (id) => {
            setSpecialSongs((prev) => {
                const updated = prev.filter((s) => s.id !== id);
                localStorage.setItem("song_logger_special_songs", JSON.stringify(updated));
                return updated;
            });
        },
        []
    );

    return { specialSongs, addSpecialSong, deleteSpecialSong };
}
