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
    const [selectedColor, setSelectedColor] = useState("bg-gray-500");

    const handleAdd = () => {
        if (customLabel.trim()) {
            onAddCustomLabel(customLabel.trim(), selectedColor);
            setSelectedColor("bg-gray-500");
        }
    };

    return (
        <div className="space-y-3">
            <div className="mb-1">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select Labels:
                </label>
                {/* Predefined labels list */}
                <div className="mt-1 p-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        {predefinedLabels.map((lbl) => (
                            <button
                                key={lbl}
                                type="button"
                                onClick={() => onToggle(lbl)}
                                className={`px-2 py-1 rounded-md text-sm transition-all cursor-pointer ${selectedLabels.includes(lbl)
                                    ? `${getLabelColor(lbl)} text-white shadow-sm ring-1 ring-white/20`
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border border-transparent"
                                    }`}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom label input + color picker */}
            <div className="mb-2 bg-gray-50/30 dark:bg-gray-800/20 p-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => onCustomLabelChange(e.target.value)}
                        placeholder="New custom label..."
                        className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!customLabel.trim()}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        Add
                    </button>
                </div>

                {/* Color swatches — only show when there's something typed */}
                {customLabel.trim() && (
                    <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-1.5 p-1 bg-white dark:bg-gray-900 rounded-md ring-1 ring-gray-200 dark:ring-gray-700">
                            {customColorOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    title={opt.label}
                                    onClick={() => setSelectedColor(opt.value)}
                                    style={{ backgroundColor: colorSwatchHex[opt.value] }}
                                    className={`w-6 h-6 rounded-full cursor-pointer transition-all ${selectedColor === opt.value
                                        ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-blue-500 scale-110 shadow-md"
                                        : "hover:scale-110 opacity-70 hover:opacity-100"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Preview:</span>
                            <span
                                className={`text-xs text-white px-3 py-1 rounded-full font-medium shadow-sm transition-all ${selectedColor}`}
                            >
                                {customLabel}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected labels container with wrapping */}
            {selectedLabels.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            Selected ({selectedLabels.length}):
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                        {selectedLabels.map((lbl) => (
                            <span
                                key={lbl}
                                className={`text-xs font-semibold text-white px-2.5 py-1 rounded-lg shadow-sm animate-in fade-in zoom-in duration-200 ${getLabelColor(lbl)}`}
                            >
                                {lbl}
                            </span>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
