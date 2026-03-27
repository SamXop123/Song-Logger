"use client";

import { useState } from "react";
import { useSpecialSongs } from "@/hooks/useSpecialSongs";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function SpecialSongs() {
    const { specialSongs, addSpecialSong, deleteSpecialSong } = useSpecialSongs();
    
    // States for adding month song
    const [monthSongInput, setMonthSongInput] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
    const [monthYearInput, setMonthYearInput] = useState(new Date().getFullYear().toString());

    // States for adding year song
    const [yearSongInput, setYearSongInput] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    const handleAddMonth = (e) => {
        e.preventDefault();
        if (!monthSongInput.trim() || !monthYearInput) return;
        addSpecialSong("month", monthSongInput, monthYearInput, selectedMonth);
        setMonthSongInput("");
    };

    const handleAddYear = (e) => {
        e.preventDefault();
        if (!yearSongInput.trim() || !selectedYear) return;
        addSpecialSong("year", yearSongInput, selectedYear);
        setYearSongInput("");
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this special song?")) {
            deleteSpecialSong(id);
        }
    };

    const monthSongs = specialSongs.filter(s => s.type === "month");
    const yearSongs = specialSongs.filter(s => s.type === "year");

    return (
        <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl shadow-indigo-500/5 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/60 dark:border-slate-700/50 w-full h-full flex flex-col transition-all">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 p-1.5 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                </span>
                Favorites Wall
            </h2>

            <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-3 flex-grow max-h-[650px] pb-4">
                {/* Add Song of the Year Form */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Log Song of the Year</h3>
                    <form onSubmit={handleAddYear} className="flex flex-col gap-2">
                        <div className="flex gap-2 min-w-0">
                            <input
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-20 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-medium text-center"
                            />
                            <input
                                type="text"
                                value={yearSongInput}
                                onChange={(e) => setYearSongInput(e.target.value)}
                                placeholder="Song name..."
                                className="flex-grow min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                            />
                        </div>
                        <button type="submit" className="w-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/70 border border-yellow-200 dark:border-yellow-800/50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
                            Save as Best of {selectedYear || 'Year'}
                        </button>
                    </form>
                </div>

                {/* Yearly Wall Map */}
                {yearSongs.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {yearSongs.map(s => (
                            <div key={s.id} className="group flex justify-between items-center bg-white/60 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-yellow-400 dark:hover:border-yellow-600/50">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded inline-block mb-1">
                                        Year {s.year}
                                    </p>
                                    <p className="font-bold border-b border-transparent group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-yellow-500 group-hover:text-transparent group-hover:bg-clip-text transition-all text-slate-800 dark:text-slate-200 truncate">
                                        {s.songName}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(s.id)} className="shrink-0 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1" title="Remove">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <hr className="border-slate-200 dark:border-slate-700/50 mx-2" />

                {/* Add Song of the Month Form */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Log Song of the Month</h3>
                    <form onSubmit={handleAddMonth} className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-[100px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium"
                            >
                                {MONTHS.map(m => (
                                    <option key={m} value={m}>{m.slice(0,3)}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={monthYearInput}
                                onChange={(e) => setMonthYearInput(e.target.value)}
                                className="w-[70px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-center"
                            />
                        </div>
                        <input
                            type="text"
                            value={monthSongInput}
                            onChange={(e) => setMonthSongInput(e.target.value)}
                            placeholder="Song name..."
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all w-full"
                        />
                        <button type="submit" className="w-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/70 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
                            Save as Best of {selectedMonth.slice(0,3)} {monthYearInput || '...'}
                        </button>
                    </form>
                </div>

                {/* Monthly Wall Map */}
                {monthSongs.length > 0 && (
                    <div className="flex flex-col gap-2 pb-4">
                        {monthSongs.map(s => (
                            <div key={s.id} className="group flex justify-between items-center bg-white/60 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-amber-300 dark:hover:border-amber-700/50">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded inline-block mb-1 border border-slate-200 dark:border-slate-700">
                                        {s.month} {s.year}
                                    </p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        {s.songName}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(s.id)} className="shrink-0 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1" title="Remove">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {specialSongs.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-4 py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl opacity-60">
                         <p className="text-sm text-slate-500 font-medium">No favorites logged yet.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
