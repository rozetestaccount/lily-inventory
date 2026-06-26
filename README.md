# LILY — Inventaire des stocks restants

## What this is
A complete, standalone Vite + React project. No Claude dependency. Data is
saved with the browser's `localStorage` — meaning it's saved per-device only
(not shared live between phones). If you later want everyone to see the same
live data, swap `src/storage.js` for a real backend (e.g. Firebase) — the rest
of the app code (`App.jsx`) doesn't need to change since it only calls
`localStore.get/set`.

## File map (where everything goes)
```
lily-inventory-vite/
├── package.json          ← dependency list + scripts
├── index.html             ← HTML entry point, loads src/main.jsx
├── vite.config.js         ← build config (set "base" for GitHub Pages here)
├── tailwind.config.js     ← Tailwind setup
├── postcss.config.js      ← required by Tailwind
└── src/
    ├── main.jsx            ← React root, mounts <App />
    ├── App.jsx             ← the entire app (UI, logic, seed data)
    ├── storage.js          ← localStorage wrapper (swap this for a real backend later)
    └── index.css           ← Tailwind imports
```

## Run it locally (test before deploying)
1. Install [Node.js](https://nodejs.org) if you don't have it.
2. Open a terminal in this folder.
3. Run:
   ```
   npm install
   npm run dev
   ```
4. Open the link it prints (usually `http://localhost:5173`).

## Deploy to GitHub Pages
1. Create a new repo on GitHub, e.g. `lily-inventory`.
2. **Important:** open `vite.config.js` and make sure the `base` value matches
   your repo name exactly, e.g. `base: "/lily-inventory/"`.
3. Push this project to that repo:
   ```
   git init
   git add .
   git commit -m "Lily inventory app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/lily-inventory.git
   git push -u origin main
   ```
4. Build and deploy:
   ```
   npm install
   npm run deploy
   ```
   This builds the app and pushes it to a `gh-pages` branch automatically
   (via the `gh-pages` package already included).
5. In your GitHub repo, go to **Settings → Pages**, and under "Source" choose
   the `gh-pages` branch. GitHub will give you a live link like:
   `https://YOUR-USERNAME.github.io/lily-inventory/`

## Deploy to StackBlitz instead (faster, no GitHub needed)
1. Go to [stackblitz.com](https://stackblitz.com) → "Create new project" →
   "Import from local folder" (or drag this folder in).
2. It auto-installs and runs the project, giving you an instant shareable
   preview link.

## Important limitation to know
`localStorage` only exists inside one browser on one device. If two different
people open the link on two different phones, they will NOT see each other's
entries — each device keeps its own separate copy. This is fine for a single
person tracking inventory, or as a fallback/offline mode, but it is **not** a
shared "Google Sheets" style experience. For that, the storage layer needs to
be swapped for a real shared database (Firebase Firestore is a good free
option) — only `src/storage.js` would need to change.
