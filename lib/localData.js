import getDb from "@/lib/db";

export async function getLocalSongs() {
  try {
    return await getDb().songs.orderBy("date").reverse().toArray();
  } catch {
    return [];
  }
}

export function getLocalSpecialSongs() {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("song_logger_special_songs") || "[]");
  } catch {
    return [];
  }
}
