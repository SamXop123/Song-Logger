"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Manages the special songs (Song of the Month / Song of the Year) using localStorage.
 * Kept separate from main song list.
 */
export function useSpecialSongs() {
    const [specialSongs, setSpecialSongs] = useState([]);

    // Load on mount — client-side only
    useEffect(() => {
        const stored = localStorage.getItem("song_logger_special_songs");
        if (stored) {
            try {
                setSpecialSongs(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse special songs from localStorage");
            }
        }
    }, []);

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
                const updated = [newSong, ...prev];
                // Keep it sorted by year descending, then month descending if we mapped months to numbers
                // For simplicity, just sort by dateAdded descending so newest is at the top
                const sorted = updated.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                localStorage.setItem("song_logger_special_songs", JSON.stringify(sorted));
                return sorted;
            });
        },
        []
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
