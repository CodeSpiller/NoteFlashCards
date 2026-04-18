# NoteFlashCards

A mobile-first web app for practicing music note recognition.

## Game modes

- **Treble Clef Notes** — a flashcard image appears; pick the correct letter before the timer runs out. If time runs out, the app advances to the next card automatically. The pool includes 20 notes ranging from `low-low-F` (well below the staff) through `high-B` (two ledger lines above).
- _Bass Clef_, _Intervals_, and _Key Signatures_ are placeholders on the home screen for future modes.

## Settings

Tap the gear icon on the home screen to open Settings. You can set the countdown timer anywhere from 1.0s to 10.0s in 0.1s steps, using the −/+ buttons, the slider, or the preset chips. The choice is saved in `localStorage` and applied at the start of the next round (it won't interrupt a round in progress).

You can also switch between **letter** note names (A, B, C, D, E, F, G) and **solfège** names (la, si, do, re, mi, fa, sol). Mapping: A=la, B=si, C=do, D=re, E=mi, F=fa, G=sol. The answer buttons in the game update immediately.

## Deploy to GitHub Pages

The repo is pre-wired for GitHub Pages. To publish it:

1. Create an **empty** repo on github.com named `noteflashcards` (no README, no `.gitignore`, no license — the repo already has everything).
2. Add the remote and push:

   ```sh
   git remote add origin https://github.com/<your-username>/noteflashcards.git
   git push -u origin main
   ```

3. On github.com, open the repo → **Settings → Pages**, and under **Source** pick **GitHub Actions**.
4. The first push already triggered the workflow. Watch it at the repo's **Actions** tab. When it finishes (1–2 min), your site is live at:

   ```
   https://<your-username>.github.io/noteflashcards/
   ```

Every subsequent push to `main` auto-deploys. Custom domain: add a `CNAME` file in `static/` and configure it in Pages settings.

## Run it

First time:

```sh
npm install
```

Then:

```sh
npm run dev -- --host
```

The dev server prints a local URL plus a LAN URL (thanks to `--host`). Open the LAN URL on your phone (same Wi-Fi) to try it on a real device.

## Build

```sh
npm run build
npm run preview
```

## Stack

- SvelteKit + Vite
- Mobile-first CSS (safe-area insets, `100dvh` layout, tap-friendly sizes, no text selection)
- Flashcard images served from `static/notes/treble/`

## Project layout

```
src/
  app.html              # mobile viewport + theme-color meta
  app.css               # CSS variables and resets
  lib/
    notes.js            # note pool (letter + image path) + round picker
  routes/
    +layout.svelte      # app shell (max-width, safe-area)
    +page.svelte        # home screen — game mode list
    game/treble/+page.svelte  # the note-identification game
static/
  notes/treble/         # the 10 JPG flashcards
```

## Tweaks

- **Timer length** — edit `ROUND_MS` in `src/routes/game/treble/+page.svelte`.
- **Note pool** — edit `TREBLE_NOTES` in `src/lib/notes.js`. To add a new card, drop a JPG into `static/notes/treble/` and add an entry with its letter and image path.
- **Colors** — edit the `:root` variables in `src/app.css`.
- **Source images** — the originals live in `Pictures/SingleNotesTrebleClef/`; what the app actually serves is the copy in `static/notes/treble/`.
