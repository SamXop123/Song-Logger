# Song Logger

A sleek, client‑side song‑logging web app built with **Next.js**, **React**, **Dexie.js** (IndexedDB), and **Tailwind CSS**. It lets you add, edit, delete, and tag songs, export/import CSV logs, and customize label colors.

## Features
- Add, edit, delete songs with timestamps.
- Tag songs with predefined or custom labels.
- Custom label colors (choose from a palette).
- Export song list to CSV.
- Import an existing CSV (Date,Time,Song Name,Labels) to restore a previous log.
- Dark / light theme toggle with animated particles background.
- Responsive UI with premium design (glass‑morphism, micro‑animations).

## Tech Stack
- **Framework**: Next.js (App Router) – React 18
- **State / DB**: React hooks + Dexie.js (IndexedDB) – SSR‑safe lazy singleton.
- **Styling**: Tailwind CSS (dark mode, custom colors).
- **Particles**: tsparticles for a dynamic background.

## Usage
1. **Add a song** – type a name, select or create labels, click **Add Song**.
2. **Edit** – click **Edit** on a row, modify fields, then **Save Edit**.
3. **Delete** – click **Delete** (confirmation dialog).
4. **Custom label colors** – when adding a custom label, pick a color swatch before clicking **Add**.
5. **Export CSV** – click **Export to CSV** (downloaded file includes Date, Time, Song Name, Labels).
6. **Import CSV** – click **Import CSV**, select a previously exported file; new songs are merged (duplicates are ignored).
7. **Theme** – toggle dark/light mode with the moon/sun button.
8. **Custom date** - log your song entries on any date you missed.
9. **Favorite Songs** - add your month/year specific favorite songs from the favorites wall.

## License & Credits
- © SamXop123 2026. All rights reserved.
- Built with open‑source libraries: Next.js, React, Dexie.js, Tailwind CSS, tsparticles.
