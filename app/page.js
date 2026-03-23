"use client";

import { useState, useCallback } from "react";
import { useSongs } from "@/hooks/useSongs";
import { useTheme } from "@/hooks/useTheme";
import { useLabelForm } from "@/hooks/useLabelForm";
import ParticlesBackground from "@/components/ParticlesBackground";
import ThemeToggle from "@/components/ThemeToggle";
import SongForm from "@/components/SongForm";
import SongList from "@/components/SongList";

/**
 * Thin orchestration shell.
 * All business logic lives in hooks; this component only wires them together.
 */
export default function Home() {
  const { songs, message, addSong, updateSong, deleteSong, deleteAllSongs, importFromCSV, exportToCSV } = useSongs();
  const { theme, toggleTheme } = useTheme();
  const { selectedLabels, customLabel, setCustomLabel, toggleLabel, addCustomLabel, resetLabels } =
    useLabelForm();

  const [songName, setSongName] = useState("");
  const [editingSong, setEditingSong] = useState(null);
  const [customDate, setCustomDate] = useState("");

  // --- Form state helpers ---
  const resetForm = useCallback(() => {
    setSongName("");
    resetLabels();
    setEditingSong(null);
    setCustomDate("");
  }, [resetLabels]);

  const handleEdit = useCallback(
    (song) => {
      setEditingSong(song);
      setSongName(song.songName);
      resetLabels(song.labels || []);
    },
    [resetLabels]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!songName.trim()) return;
      await addSong(songName, selectedLabels, customDate || null);
      resetForm();
    },
    [songName, selectedLabels, customDate, addSong, resetForm]
  );

  const handleSaveEdit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!songName.trim()) return;
      await updateSong(editingSong, songName, selectedLabels);
      resetForm();
    },
    [songName, selectedLabels, editingSong, updateSong, resetForm]
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-start justify-center p-4 relative">
      <ParticlesBackground theme={theme} />
      <div className="flex flex-col mt-10 lg:flex-row gap-6 w-full max-w-4xl z-10">
        {/* Left panel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Song Log
            </h1>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          <div className="flex-grow">
            <SongForm
              songName={songName}
              onSongNameChange={setSongName}
              selectedLabels={selectedLabels}
              onToggleLabel={toggleLabel}
              customLabel={customLabel}
              onCustomLabelChange={setCustomLabel}
              onAddCustomLabel={addCustomLabel}
              editingSong={editingSong}
              onSubmit={editingSong ? handleSaveEdit : handleSubmit}
              onCancelEdit={resetForm}
              customDate={customDate}
              onCustomDateChange={setCustomDate}
            />
          </div>

          {message && (
            <p className="text-green-500 text-center mb-4">{message}</p>
          )}
          <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            &copy; SamXop123 - Song Logger 2026
          </footer>
        </div>

        {/* Right panel */}
        <SongList songs={songs} onEdit={handleEdit} onDelete={deleteSong} onDeleteAll={deleteAllSongs} onImportCSV={importFromCSV} onExportCSV={exportToCSV} />
      </div>
    </div>
  );
}
