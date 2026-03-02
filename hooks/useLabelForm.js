"use client";

import { useState, useCallback } from "react";
import { setCustomLabelColor } from "@/lib/labelColors";

/**
 * Manages label selection state (predefined + custom).
 * Extracted so SongForm doesn't own this logic.
 */
export function useLabelForm(initialLabels = []) {
    const [selectedLabels, setSelectedLabels] = useState(initialLabels);
    const [customLabel, setCustomLabel] = useState("");

    const toggleLabel = useCallback((label) => {
        setSelectedLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    }, []);

    // Now accepts an optional colorClass for custom labels
    const addCustomLabel = useCallback((labelName, colorClass) => {
        const trimmed = (labelName ?? customLabel).trim();
        if (!trimmed) return;

        // Persist the color choice so getLabelColor picks it up everywhere
        if (colorClass) {
            setCustomLabelColor(trimmed, colorClass);
        }

        setSelectedLabels((prev) =>
            prev.includes(trimmed) ? prev : [...prev, trimmed]
        );
        setCustomLabel("");
    }, [customLabel]);

    const resetLabels = useCallback((labels = []) => {
        setSelectedLabels(labels);
        setCustomLabel("");
    }, []);

    return {
        selectedLabels,
        customLabel,
        setCustomLabel,
        toggleLabel,
        addCustomLabel,
        resetLabels,
    };
}
