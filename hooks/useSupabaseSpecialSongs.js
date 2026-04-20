"use client";

import { useState, useEffect, useCallback } from "react";
import { getLocalSpecialSongs } from "@/lib/localData";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { sortMonthSpecialSongs, sortYearSpecialSongs } from "@/lib/specialSongSort";

function mapSpecialSongRow(song) {
  return {
    id: song.id,
    type: song.type,
    songName: song.song_name,
    year: String(song.year),
    month: song.month,
    dateAdded: song.date_added,
  };
}

function buildSpecialSongKey(song) {
  return [
    song.type,
    String(song.year),
    song.month || "",
    song.songName.trim().toLowerCase(),
  ].join("|||");
}

function sortAllSpecialSongs(songs) {
  return [
    ...sortYearSpecialSongs(songs.filter((song) => song.type === "year")),
    ...sortMonthSpecialSongs(songs.filter((song) => song.type === "month")),
  ];
}

export function useSupabaseSpecialSongs(user) {
  const supabase = isSupabaseConfigured() ? getSupabaseBrowserClient() : null;

  const [specialSongs, setSpecialSongs] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase && user));

  const loadSpecialSongs = useCallback(async () => {
    if (!supabase || !user) {
      setSpecialSongs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("special_songs")
      .select("id, type, song_name, year, month, date_added")
      .order("date_added", { ascending: false });

    if (error) {
      console.error("Failed to load special songs", error.message);
      setLoading(false);
      return;
    }

    setSpecialSongs(sortAllSpecialSongs((data || []).map(mapSpecialSongRow)));
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase || !user) return;

    let active = true;

    async function syncSpecialSongs() {
      await loadSpecialSongs();
      if (!active) return;
    }

    void syncSpecialSongs();

    return () => {
      active = false;
    };
  }, [loadSpecialSongs, supabase, user]);

  const addSpecialSong = useCallback(
    async (type, songName, year, month = null) => {
      if (!supabase || !user) return;

      const { data, error } = await supabase
        .from("special_songs")
        .insert({
          user_id: user.id,
          type,
          song_name: songName.trim(),
          year: Number.parseInt(year, 10) || new Date().getFullYear(),
          month,
        })
        .select("id, type, song_name, year, month, date_added")
        .single();

      if (error) {
        console.error("Failed to add special song", error.message);
        return;
      }

      setSpecialSongs((prev) => sortAllSpecialSongs([mapSpecialSongRow(data), ...prev]));
    },
    [supabase, user]
  );

  const deleteSpecialSong = useCallback(
    async (id) => {
      if (!supabase || !user) return;

      const { error } = await supabase
        .from("special_songs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to delete special song", error.message);
        return;
      }

      setSpecialSongs((prev) => prev.filter((song) => song.id !== id));
    },
    [supabase, user]
  );

  const importFromLocalSpecialSongs = useCallback(async () => {
    if (!supabase || !user) {
      return { imported: 0, available: 0 };
    }

    const localSpecialSongs = getLocalSpecialSongs();
    const existingKeys = new Set(specialSongs.map(buildSpecialSongKey));

    const songsToInsert = localSpecialSongs
      .map((song) => {
        if (!song.songName || !song.type) return null;

        return {
          user_id: user.id,
          type: song.type,
          song_name: song.songName.trim(),
          year: Number.parseInt(song.year, 10) || new Date().getFullYear(),
          month: song.month || null,
        };
      })
      .filter(Boolean)
      .filter((song) => {
        const key = buildSpecialSongKey({
          type: song.type,
          year: song.year,
          month: song.month,
          songName: song.song_name,
        });
        if (existingKeys.has(key)) return false;
        existingKeys.add(key);
        return true;
      });

    if (songsToInsert.length === 0) {
      return { imported: 0, available: localSpecialSongs.length };
    }

    const { error } = await supabase.from("special_songs").insert(songsToInsert);
    if (error) {
      throw error;
    }

    await loadSpecialSongs();
    return { imported: songsToInsert.length, available: localSpecialSongs.length };
  }, [loadSpecialSongs, specialSongs, supabase, user]);

  return {
    specialSongs,
    loading,
    addSpecialSong,
    deleteSpecialSong,
    importFromLocalSpecialSongs,
  };
}
