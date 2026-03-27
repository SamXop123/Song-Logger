/**
 * Lazy Dexie singleton.
 *
 * `new Dexie(...)` accesses IndexedDB, which doesn't exist on the server.
 * By wrapping in a getter that only runs on first client-side call, we
 * guarantee this module is safe to import anywhere in the Next.js module graph
 * without causing SSR errors.
 */

let _db = null;

function getDb() {
  if (_db) return _db;

  // This branch is ONLY reached on the client (inside useEffect / callbacks).
  const Dexie = require("dexie").default;

  _db = new Dexie("SongLogDB");

  _db
    .version(3)
    .stores({
      songs: "++id,date,songName,labels",
    })
    .upgrade((tx) => {
      return tx
        .table("songs")
        .toCollection()
        .modify((song) => {
          song.labels = song.label ? [song.label] : [];
        });
    });

  // Adding specialSongs table for 'Song of the Month / Year'
  _db.version(4).stores({
    specialSongs: "++id, type, songName, date",
  });

  return _db;
}

export default getDb;
