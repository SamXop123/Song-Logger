"use client";

import { useState } from "react";
import {
    predefinedLabels,
    getLabelColor,
    customColorOptions,
    colorSwatchHex,
} from "@/lib/labelColors";

export default function LabelSelector({
    selectedLabels,
    onToggle,
    customLabel,
    onCustomLabelChange,
    onAddCustomLabel,
}) {
    const [selectedColor, setSelectedColor] = useState("bg-slate-500");

    const handleAdd = () => {
        if (customLabel.trim()) {
            onAddCustomLabel(customLabel.trim(), selectedColor);
            setSelectedColor("bg-slate-500");
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Select Labels
                </label>
                {/* Predefined labels list */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex flex-wrap gap-2">
                        {predefinedLabels.map((lbl) => (
                            <button
                                key={lbl}
                                type="button"
                                onClick={() => onToggle(lbl)}
                                className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${selectedLabels.includes(lbl)
                                    ? `${getLabelColor(lbl)} text-white ring-2 ring-violet-500/30 scale-105`
                                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:-translate-y-0.5"
                                    }`}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom label input + color picker */}
            <div className="bg-slate-50/30 dark:bg-slate-800/20 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700/60 focus-within:border-violet-400 dark:focus-within:border-violet-600 transition-colors">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => onCustomLabelChange(e.target.value)}
                        placeholder="Type a new label..."
                        className="w-full px-3 py-2 text-sm bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white transition-all"
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!customLabel.trim()}
                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                    >
                        Add
                    </button>
                </div>

                {/* Color swatches — only show when there's something typed */}
                {customLabel.trim() && (
                    <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                        <div className="flex flex-wrap gap-2 p-2 bg-white/80 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
                            {customColorOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    title={opt.label}
                                    onClick={() => setSelectedColor(opt.value)}
                                    style={{ backgroundColor: colorSwatchHex[opt.value] }}
                                    className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-200 ${selectedColor === opt.value
                                        ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-violet-500 scale-110 shadow-md"
                                        : "hover:scale-110 opacity-60 hover:opacity-100 hover:shadow-sm"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preview:</span>
                            <span
                                className={`text-[11px] sm:text-xs text-white px-3 py-1 rounded-full font-bold shadow-sm transition-all duration-300 ${selectedColor}`}
                            >
                                {customLabel}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected labels container with wrapping */}
            {selectedLabels.length > 0 && (
                <div className="p-3 bg-violet-50/50 dark:bg-violet-900/10 rounded-xl border border-violet-100/50 dark:border-violet-900/30 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                            Added Labels ({selectedLabels.length}):
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-hidden">
                        {selectedLabels.map((lbl) => (
                            <button
                                key={lbl}
                                type="button"
                                onClick={() => onToggle(lbl)}
                                className={`group flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white px-3 py-1 rounded-full shadow-sm animate-in fade-in zoom-in duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all ${getLabelColor(lbl)}`}
                                title={`Remove ${lbl}`}
                            >
                                <span>{lbl}</span>
                                <div className="bg-black/10 group-hover:bg-black/20 rounded-full p-0.5 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
