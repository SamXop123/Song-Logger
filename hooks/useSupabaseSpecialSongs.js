"use client";

import { useState, useEffect, useCallback } from "react";
import { getLocalSpecialSongs } from "@/lib/localData";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

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

    setSpecialSongs((data || []).map(mapSpecialSongRow));
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

