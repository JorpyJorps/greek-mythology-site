# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Server

```bash
npm run dev   # starts a local HTTP server via the `serve` package
```

No build step, no transpilation, no linting. This is plain HTML/CSS/JS served directly.

## Architecture

Multi-page vanilla JavaScript app (no framework). Each page is a self-contained HTML + JS pair:

| Page | HTML | JS |
|---|---|---|
| Main explorer | `index.html` | `script.js` |
| Games (trivia, memory, battle, word search) | `games.html` | `games.js` |
| Math challenges | `math.html` | `math.js` |
| Choose-your-own-adventure quests | `quest.html` | `quest.js` |
| Character profiles | `profile.html` | `profile.js` |
| Stats & achievements | `stats.html` | `stats.js` / `stats-page.js` |
| Family tree | `family-tree.html` | `family-tree.js` |
| Character comparison | `compare.html` | `compare.js` |

**Central data sources:**
- `data.js` — All mythology entries (~1300 lines). Each entry has: `name`, `title`, `symbol`, `home`, `story`, `facts`, `powers`, `color`.
- `quest-data.js` — Branching narrative data for quests.

**Persistence:** All state (favorites, math progress, game scores, sound settings) is stored in `localStorage`. There is no backend.

**Styling:** Single global `styles.css` (~48KB). Uses CSS custom properties for theming (`--bg`, `--panel`, `--gold`, `--text`, etc.). Storm tier backgrounds are applied via the `data-storm-tier` attribute on the root element.

**JS modules:** Files use ES6 `import`/`export`. `data.js` and `quest-data.js` are imported into page scripts as modules.
