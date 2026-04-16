"use client";

import { useState, useEffect, useCallback } from "react";
import { getLocalSongs } from "@/lib/localData";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

function mapSongRow(song) {
  return {
    id: song.id,
    songName: song.song_name,
    date: song.date,
    labels: Array.isArray(song.labels) ? song.labels : [],
  };
}

function buildSongKey(songName, date) {
  return `${songName.trim().toLowerCase()}|||${new Date(date).toISOString()}`;
}

function csvEscape(val) {
  if (/[,"\n\r]/.test(val)) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function parseCsvLine(line) {
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
}

export function useSupabaseSongs(user) {
  const supabase = isSupabaseConfigured() ? getSupabaseBrowserClient() : null;

  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(Boolean(supabase && user));

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  const loadSongs = useCallback(async () => {
    if (!supabase || !user) {
      setSongs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("songs")
      .select("id, song_name, date, labels")
      .order("date", { ascending: false });

    if (error) {
      showMessage(error.message);
      setLoading(false);
      return;
    }

    setSongs((data || []).map(mapSongRow));
    setLoading(false);
  }, [showMessage, supabase, user]);

  useEffect(() => {
    if (!supabase || !user) return;

    let active = true;

    async function syncSongs() {
      await loadSongs();
      if (!active) return;
    }

    void syncSongs();

    return () => {
      active = false;
    };
  }, [loadSongs, supabase, user]);

  const addSong = useCallback(
    async (songName, labels, customDate) => {
      if (!supabase || !user) return;

      const date = customDate
        ? new Date(customDate).toISOString()
        : new Date().toISOString();

      const { data, error } = await supabase
        .from("songs")
        .insert({
          user_id: user.id,
          song_name: songName.trim(),
          date,
          labels,
        })
        .select("id, song_name, date, labels")
        .single();

      if (error) {
        showMessage(error.message);
        return;
      }

      const newSong = mapSongRow(data);
      setSongs((prev) => {
        const updated = [newSong, ...prev];
        return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      showMessage("Song added successfully!");
    },
    [showMessage, supabase, user]
  );

  const updateSong = useCallback(
    async (existingSong, songName, labels) => {
      if (!supabase || !user) return;

      const { data, error } = await supabase
        .from("songs")
        .update({
          song_name: songName.trim(),
          labels,
        })
        .eq("id", existingSong.id)
        .eq("user_id", user.id)
        .select("id, song_name, date, labels")
        .single();

      if (error) {
        showMessage(error.message);
        return;
      }

      const updated = mapSongRow(data);
      setSongs((prev) =>
        prev.map((song) => (song.id === existingSong.id ? updated : song))
      );
      showMessage("Song updated successfully!");
    },
    [showMessage, supabase, user]
  );

  const deleteSong = useCallback(
    async (id) => {
      if (!supabase || !user) return;

      const { error } = await supabase
        .from("songs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        showMessage(error.message);
        return;
      }

      setSongs((prev) => prev.filter((song) => song.id !== id));
      showMessage("Song deleted successfully!");
    },
    [showMessage, supabase, user]
  );

  const deleteAllSongs = useCallback(async () => {
    if (!supabase || !user) return;

    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      showMessage(error.message);
      return;
    }

    setSongs([]);
    showMessage("All songs deleted.");
  }, [showMessage, supabase, user]);

