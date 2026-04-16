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

  const exportToCSV = useCallback(() => {
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
      if (!supabase || !user) return;

      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());

      if (lines.length < 2) {
        showMessage("CSV file is empty or has no data rows.");
        return;
      }

      const header = lines[0].toLowerCase();
      const isNewFormat = header.startsWith("timestamp");
      const existingKeys = new Set(
        songs.map((song) => buildSongKey(song.songName, song.date))
      );

      const newSongs = [];
      for (let i = 1; i < lines.length; i++) {
        const { fields, quoted } = parseCsvLine(lines[i]);

        let date;
        let songName;
        let labelsStr;

        if (isNewFormat) {
          if (fields.length < 2) continue;
          date = fields[0];
          songName = fields[1];
          labelsStr = fields[2] || "";
        } else {
          if (fields.length < 3) continue;
          const dateStr = fields[0];
          const timeStr = fields[1];
          const lastIsQuotedLabel = quoted[fields.length - 1] && fields.length > 3;

          if (lastIsQuotedLabel) {
            labelsStr = fields[fields.length - 1];
            songName = fields.slice(2, fields.length - 1).join(",");
          } else {
            labelsStr = "";
            songName = fields.slice(2).join(",");
          }

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

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) continue;
        date = parsedDate.toISOString();

        const key = buildSongKey(songName, date);
        if (existingKeys.has(key)) continue;

        const labels = labelsStr
          ? labelsStr.split(",").map((l) => l.trim()).filter(Boolean)
          : [];

        newSongs.push({
          user_id: user.id,
          song_name: songName.trim(),
          date,
          labels,
        });
        existingKeys.add(key);
      }

      if (newSongs.length === 0) {
        showMessage("No new songs to import (all duplicates or empty).");
        return;
      }

      const { error } = await supabase.from("songs").insert(newSongs);
      if (error) {
        showMessage(error.message);
        return;
      }

      await loadSongs();
      showMessage(`Imported ${newSongs.length} song(s) successfully!`);
    },
    [loadSongs, showMessage, songs, supabase, user]
  );

  const importFromLocalSongs = useCallback(async () => {
    if (!supabase || !user) {
      return { imported: 0, available: 0 };
    }

    const localSongs = await getLocalSongs();
    const existingKeys = new Set(
      songs.map((song) => buildSongKey(song.songName, song.date))
    );

    const songsToInsert = localSongs
      .map((song) => {
        const parsedDate = new Date(song.date);
        if (!song.songName || isNaN(parsedDate.getTime())) {
          return null;
        }

        return {
          user_id: user.id,
          song_name: song.songName.trim(),
          date: parsedDate.toISOString(),
          labels: Array.isArray(song.labels)
            ? song.labels.map((label) => label.trim()).filter(Boolean)
            : [],
        };
      })
      .filter(Boolean)
      .filter((song) => {
        const key = buildSongKey(song.song_name, song.date);
        if (existingKeys.has(key)) return false;
        existingKeys.add(key);
        return true;
      });

    if (songsToInsert.length === 0) {
      return { imported: 0, available: localSongs.length };
    }

    const { error } = await supabase.from("songs").insert(songsToInsert);
    if (error) {
      throw error;
    }

    await loadSongs();
    return { imported: songsToInsert.length, available: localSongs.length };
  }, [loadSongs, songs, supabase, user]);

  return {
    songs,
    message,
    loading,
    addSong,
    updateSong,
    deleteSong,
    deleteAllSongs,
    importFromCSV,
    exportToCSV,
    importFromLocalSongs,
  };
}
