"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseSongs } from "@/hooks/useSupabaseSongs";
import { useSupabaseSpecialSongs } from "@/hooks/useSupabaseSpecialSongs";
import { useTheme } from "@/hooks/useTheme";
import { useLabelForm } from "@/hooks/useLabelForm";
import ParticlesBackground from "@/components/ParticlesBackground";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import SongForm from "@/components/SongForm";
import SongList from "@/components/SongList";
import CloudSpecialSongs from "@/components/CloudSpecialSongs";
import AuthCard from "@/components/AuthCard";
import SetupCard from "@/components/SetupCard";

/**
 * Thin orchestration shell.
 * All business logic lives in hooks; this component only wires them together.
 */
export default function Home() {
  const {
    user,
    loading: authLoading,
    error: authError,
    isConfigured,
    signInWithGoogle,
    signOut,
  } = useAuth();
  const {
    songs,
    message,
    loading: songsLoading,
    addSong,
    updateSong,
    deleteSong,
    deleteAllSongs,
    importFromCSV,
    exportToCSV,
    importFromLocalSongs,
  } = useSupabaseSongs(user);
  const {
    specialSongs,
    loading: specialSongsLoading,
    addSpecialSong,
    deleteSpecialSong,
    importFromLocalSpecialSongs,
  } = useSupabaseSpecialSongs(user);
  const { theme, toggleTheme } = useTheme();
  const { selectedLabels, customLabel, setCustomLabel, toggleLabel, addCustomLabel, resetLabels } =
    useLabelForm();

  const [songName, setSongName] = useState("");
  const [editingSong, setEditingSong] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [migrationMessage, setMigrationMessage] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

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

  const handleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    setMigrationMessage("");
    const { error } = await signInWithGoogle();
    if (error) {
      setMigrationMessage(error.message);
      setIsSigningIn(false);
    }
  }, [signInWithGoogle]);

  const handleSignOut = useCallback(async () => {
    setMigrationMessage("");
    await signOut();
    resetForm();
  }, [resetForm, signOut]);

  const handleImportLocalData = useCallback(async () => {
    setIsMigrating(true);
    setMigrationMessage("");

    try {
      const [songResult, specialResult] = await Promise.all([
        importFromLocalSongs(),
        importFromLocalSpecialSongs(),
      ]);

      const importedParts = [];
      if (songResult.imported > 0) {
        importedParts.push(`${songResult.imported} song(s)`);
      }
      if (specialResult.imported > 0) {
        importedParts.push(`${specialResult.imported} favorite(s)`);
      }

      if (importedParts.length === 0) {
        setMigrationMessage("No new local songs or favorites were found in this browser.");
      } else {
        setMigrationMessage(
          `Imported ${importedParts.join(
            " and "
          )} from this browser. Your local data was left untouched as a backup.`
        );
      }
    } catch (error) {
      setMigrationMessage(error.message || "Local data import failed.");
    } finally {
      setIsMigrating(false);
    }
  }, [importFromLocalSongs, importFromLocalSpecialSongs]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <ParticlesBackground theme={theme} />
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <div className="relative z-10 w-full flex justify-center">
          <SetupCard />
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <ParticlesBackground theme={theme} />
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl px-8 py-12 text-center shadow-2xl shadow-indigo-500/5 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin"></div>
          <p className="mt-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden px-4 py-8 sm:py-10">
        <ParticlesBackground theme={theme} />

        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className="relative z-10 mx-auto mt-14 sm:mt-16 w-full max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-stretch">
            <section className="relative rounded-[2rem] border border-white/60 dark:border-slate-700/50 bg-white/75 dark:bg-slate-900/45 backdrop-blur-xl p-7 sm:p-10 shadow-2xl shadow-indigo-500/10 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="absolute inset-0 opacity-70 dark:opacity-40 bg-[radial-gradient(circle_at_12%_18%,rgba(124,58,237,0.2),transparent_45%),radial-gradient(circle_at_88%_30%,rgba(6,182,212,0.2),transparent_48%)]" />
              <div className="relative">
                <p className="inline-flex items-center rounded-full border border-violet-200/70 dark:border-violet-500/30 bg-violet-50/80 dark:bg-violet-900/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
                  Song Logger v4.0
                </p>
                <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                  Your music memory,
                  <br />
                  beautifully organized.
                </h1>
                <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-300 leading-7 text-base sm:text-lg">
                  Log songs in seconds, group them with custom labels, and keep
                  your personal timeline connected to your account.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/45 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-semibold">
                      Fast logging
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Add a track in one tap.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/45 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-semibold">
                      Smart labels
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Build your own vibe taxonomy.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/45 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-semibold">
                      Personal space
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Private account-based logs.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/45">
                    CSV import/export
                  </span>
                  <span className="rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/45">
                    Theme toggle
                  </span>
                  <span className="rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/45">
                    Favorites wall
                  </span>
                </div>
              </div>
            </section>

            <div className="flex items-center animate-in fade-in slide-in-from-right-4 duration-700">
              <AuthCard
                onSignIn={handleSignIn}
                isLoading={isSigningIn}
                error={migrationMessage || authError}
              />
            </div>
          </div>

          <p className="mt-5 px-1 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Designed for personal tracking, now powered by secure account-based sync.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 relative overflow-hidden">
      <ParticlesBackground theme={theme} />

      {/* Main glass wrapper, made extremely wide to fit 3 columns on large screens */}
      <div className="flex flex-col mt-4 sm:mt-8 lg:flex-row gap-6 w-full max-w-7xl xl:max-w-[90rem] z-10 transition-all duration-500">
        {/* Left panel - Add/Edit Form */}
        <div className="relative z-30 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl shadow-indigo-500/5 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/60 dark:border-slate-700/50 w-full lg:w-[35%] xl:w-[34%] flex flex-col transition-all">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-300">
                Song Logger
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Track your musical journey
              </p>
            </div>
            <UserMenu
              user={user}
              theme={theme}
              onToggleTheme={toggleTheme}
              onImportLocalData={handleImportLocalData}
              onSignOut={handleSignOut}
              isMigrating={isMigrating}
            />
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
            <div className="mt-4 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium text-center border border-emerald-100 dark:border-emerald-800/50 animate-in fade-in slide-in-from-bottom-2">
              {message}
            </div>
          )}
          {migrationMessage && (
            <div className="mt-4 p-3 rounded-2xl bg-violet-50/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium text-center border border-violet-100 dark:border-violet-800/50 animate-in fade-in slide-in-from-bottom-2">
              {migrationMessage}
            </div>
          )}
          {authError && (
            <div className="mt-4 p-3 rounded-2xl bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm font-medium text-center border border-red-100 dark:border-red-800/50 animate-in fade-in slide-in-from-bottom-2">
              {authError}
            </div>
          )}

          <footer className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            &copy; SamXop123 &mdash; 2026
          </footer>
        </div>

        {/* Middle panel - List */}
        <div className="relative z-10 w-full lg:w-[40%] xl:w-[45%] flex flex-col">
          <SongList
            songs={songs}
            isLoading={songsLoading}
            onEdit={handleEdit}
            onDelete={deleteSong}
            onDeleteAll={deleteAllSongs}
            onImportCSV={importFromCSV}
            onExportCSV={exportToCSV}
          />
        </div>

        {/* Right panel - Favorites Wall */}
        <div className="relative z-10 w-full lg:w-[25%] xl:w-[25%] flex flex-col">
          <CloudSpecialSongs
            specialSongs={specialSongs}
            isLoading={specialSongsLoading}
            onAddSpecialSong={addSpecialSong}
            onDeleteSpecialSong={deleteSpecialSong}
          />
        </div>
      </div>
    </div>
  );
}
