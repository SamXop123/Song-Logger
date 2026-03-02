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
    onAddCustomLabel,   // now receives (label, colorClass)
}) {
    const [selectedColor, setSelectedColor] = useState("bg-gray-500");

    const handleAdd = () => {
        if (customLabel.trim()) {
            onAddCustomLabel(customLabel.trim(), selectedColor);
            setSelectedColor("bg-gray-500");
        }
    };

    return (
        <>
            <div className="mb-2">
                <label className="text-sm text-gray-900 dark:text-white">
                    Select Labels (optional):
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {predefinedLabels.map((lbl) => (
                        <button
                            key={lbl}
                            type="button"
                            onClick={() => onToggle(lbl)}
                            className={`px-2 py-1 rounded text-sm cursor-pointer ${selectedLabels.includes(lbl)
                                    ? `${getLabelColor(lbl)} text-white`
                                    : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
                                }`}
                        >
                            {lbl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom label input + color picker */}
            <div className="mb-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => onCustomLabelChange(e.target.value)}
                        placeholder="Add custom label"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer shrink-0"
                    >
                        Add
                    </button>
                </div>

                {/* Color swatches — only show when there's something typed */}
                {customLabel.trim() && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {customColorOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                title={opt.label}
                                onClick={() => setSelectedColor(opt.value)}
                                style={{ backgroundColor: colorSwatchHex[opt.value] }}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${selectedColor === opt.value
                                        ? "ring-2 ring-offset-1 ring-gray-800 dark:ring-white scale-110"
                                        : "hover:scale-110"
                                    }`}
                            />
                        ))}
                        <span
                            className={`ml-1 self-center text-xs text-white px-2 py-0.5 rounded ${selectedColor}`}
                        >
                            {customLabel}
                        </span>
                    </div>
                )}
            </div>

            {selectedLabels.length > 0 && (
                <div className="mb-2">
                    <span className="text-sm text-gray-900 dark:text-white">
                        Selected:{" "}
                    </span>
                    {selectedLabels.map((lbl) => (
                        <span
                            key={lbl}
                            className={`text-sm text-white px-2 py-1 rounded ${getLabelColor(lbl)} mr-1`}
                        >
                            {lbl}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
}
