export const predefinedLabels = [
    "Chill",
    "Energetic",
    "Focus",
    "Romantic",
    "Sad",
    "Uplifting",
    "Pop",
    "Rock",
    "Hip-Hop",
    "EDM",
    "Hindi",
    "Phonk",
    "Instrumental",
    "OG",
    "Nostalgia",
    "Spiritual",
];

const colorMap = {
    Chill: "bg-indigo-500",
    Energetic: "bg-orange-500",
    Focus: "bg-teal-500",
    Romantic: "bg-pink-500",
    Sad: "bg-blue-500",
    Uplifting: "bg-green-500",
    Pop: "bg-rose-500",
    Rock: "bg-zinc-600",
    "Hip-Hop": "bg-amber-700",
    EDM: "bg-cyan-500",
    Hindi: "bg-orange-600",
    Phonk: "bg-purple-500",
    Instrumental: "bg-emerald-500",
    OG: "bg-red-600",
    Nostalgia: "bg-lime-600",
    Spiritual: "bg-amber-600",
};

// Available color choices for custom labels (displayed as swatches)
export const customColorOptions = [
    { label: "Gray", value: "bg-gray-500" },
    { label: "Red", value: "bg-red-500" },
    { label: "Orange", value: "bg-orange-500" },
    { label: "Yellow", value: "bg-yellow-500" },
    { label: "Green", value: "bg-green-500" },
    { label: "Teal", value: "bg-teal-500" },
    { label: "Blue", value: "bg-blue-500" },
    { label: "Indigo", value: "bg-indigo-500" },
    { label: "Purple", value: "bg-purple-500" },
    { label: "Pink", value: "bg-pink-500" },
    { label: "Rose", value: "bg-rose-500" },
    { label: "Cyan", value: "bg-cyan-500" },
];

// Hex equivalents so we can render inline swatch circles
// (Tailwind JIT classes won't work on dynamic values)
export const colorSwatchHex = {
    "bg-gray-500": "#6b7280",
    "bg-red-500": "#ef4444",
    "bg-orange-500": "#f97316",
    "bg-yellow-500": "#eab308",
    "bg-green-500": "#22c55e",
    "bg-teal-500": "#14b8a6",
    "bg-blue-500": "#3b82f6",
    "bg-indigo-500": "#6366f1",
    "bg-purple-500": "#a855f7",
    "bg-pink-500": "#ec4899",
    "bg-rose-500": "#f43f5e",
    "bg-cyan-500": "#06b6d4",
};

function loadCustomColorMap() {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem("customLabelColors") || "{}");
    } catch {
        return {};
    }
}

export function setCustomLabelColor(label, colorClass) {
    const map = loadCustomColorMap();
    map[label] = colorClass;
    localStorage.setItem("customLabelColors", JSON.stringify(map));
}

export function getLabelColor(label) {
    const custom = loadCustomColorMap();
    if (custom[label]) return custom[label];
    return colorMap[label] || "bg-gray-500";
}
