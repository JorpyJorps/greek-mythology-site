# CLAUDE.md — Miles' Greek Mythology App

## Project context
Built by Jordan (dad) for Miles (son, age 7.5, Grade 1). Greek mythology educational gaming site. Miles loves video games, choose-your-own-adventure books, and Greek myths. He plays on both PC (browser) and mobile (iPhone). Jordan deploys via GitHub → Vercel. No backend, no build step — pure static HTML/CSS/JS.

## Running locally
```bash
npm run dev   # serves on port 3000-something via the `serve` package
```

## Architecture
Multi-page vanilla JS app. No framework, no TypeScript, no bundler.

| Page | HTML | JS | Notes |
|---|---|---|---|
| Home hub | `index.html` | `script.js` | Star field canvas, menu sounds, currency display |
| Games arena | `games.html` | `games.js` | Trivia, Memory Match, Battle Cards, Word Search |
| Math quest | `math.html` | `math.js` | School-style vertical layout, adaptive levels 1-5 |
| Reading quests | `quest.html` | `quest.js` | Choose-your-own-adventure, 6 heroes |
| Minotaur maze | `secret-challenge.html` | `secret-challenge.js` | Pac-Man style, 10 levels, LOCKED until earned |
| Character wiki | `wiki.html` | inline script | Search + filter, 40+ characters |
| Character profile | `profile.html` | `profile.js` | Individual character pages |
| Stats/progress | `stats.html` | `stats.js` | Parent-facing dashboard |
| Family tree | `family-tree.html` | `family-tree.js` | |
| Character comparison | `compare.html` | `compare.js` | |

**Shared files:**
- `styles.css` — single global stylesheet, CSS custom properties for theming. Version-bumped on every change (e.g. `styles.css?v=53`). All HTML files must use the same version.
- `nav.js` — loaded on every page. Contains: service worker registration, Konami code easter egg (keyboard + touch-swipe), mobile bottom nav injection.
- `data.js` — ~1300 lines, all mythology entries.
- `quest-data.js` — branching story data for 6 heroes.

**Version bumping rule:** Every time styles.css changes, bump the `?v=XX` query string in ALL HTML files. Same for each JS file's own version. Use `sed` to do all HTML files at once.

## Currency system
Two currencies, both stored in `localStorage`:
- **⚡ Bolts** (`miles-bolts`) — earned from math, trivia, memory, battle
- **📜 Scrolls** (`miles-scrolls`) — earned from quest/word search

## Key localStorage keys
| Key | Purpose |
|---|---|
| `miles-math-progress` | Math game state (JSON: totalCorrect, dailyCorrect, streak, etc.) |
| `miles-bolts` | Total bolt count |
| `miles-scrolls` | Total scroll count |
| `miles-math-level-override` | Manual level override (1-5, or absent = auto) |
| `miles-sfx` | Sound toggle ("off" or absent = on) |
| `miles-maze-level` | Current maze level (1-10) |
| `secret-maze-easter-egg` | Set to "true" when maze is unlocked |

## Math game (math.js)
- **Levels 1-5**, auto-advances based on `totalCorrect` thresholds (15/40/80/160)
- **MILESTONE_UNLOCK = 20** — Miles needs 20 correct answers today to unlock the maze
- **BOLT_EVERY = 10** — 1 bolt earned per 10 correct answers
- **DAILY_BOLT_CAP = 20** — max bolts from math per day
- Problem types: addition, subtraction, missing number, multiplication (level 3+)
- Vertical school-style layout (numbers stacked, operator on left)
- Footer bar shows maze unlock progress (X/20) until unlocked, then switches to bolt progress
- `playSelect()` — quiet triangle-wave blip on answer tap
- `playGoal()` — ascending two-note chime when bolt is earned
- SFX toggle button 🔊/🔇 in topbar

## Minotaur maze (secret-challenge.js)
- **LOCKED** — requires `secret-maze-easter-egg = "true"` in localStorage
- Two unlock paths: (1) 20 correct math answers today, (2) finish a reading quest with legend/win result
- Pac-Man style movement, smooth tile-to-tile, direction buffering
- 10 levels: increasing maze size (passages 9→15), speed (1.0x→2.5x), relics (3→6), 4 visual themes
- Procedural maze generation (recursive backtracker + 15% loop removal)
- Minotaur uses BFS pathfinding, starts 2.2s after player, slower than player
- 2 lives — caught = restart level, 0 lives = game over overlay
- Level 10 win → redirects to `games.html?battle=theseus`
- Konami code easter egg (keyboard any page, swipe gesture home page only) also bypasses to maze
- Mobile D-pad shown when `pointer: coarse`

## Reading quests (quest.js + quest-data.js)
- 6 heroes: Theseus, Perseus, Heracles, Odysseus, Atalanta, Jason
- Each story: 6 scenes, 3 choices per scene, 5 possible endings
- Ending types: legend-path (mythTrue, best ending), hero-win, close-call, twist-ending, fail
- **Brave choices sometimes WIN** — stories are genuinely unpredictable (fixed from original AI-generated flat version)
- Twist endings are all different, funny for a 7-year-old
- Fail endings are funny/encouraging, NOT preachy
- Completing legend-path or hero-win triggers maze unlock (`triggerMazeUnlock()`)
- Earns 📜 Scrolls on completion

## Games arena (games.js)
- **Trivia** — myth Q&A, earns ⚡ bolts
- **Memory Match** — card flip pairs, 4×4 or 6×4, earns ⚡ bolts
- **Battle Cards** — Final Fantasy-style turn combat, heroes vs monsters
- **Word Search** — 12×12 grid, categories: gods/heroes/monsters/all, earns 📜 scrolls
  - Mobile drag fixed: uses `pointermove` + `elementFromPoint` on grid container (NOT per-cell `pointerenter`)

## Nav and sounds
- `nav.js` injects bottom mobile nav on every page: Home, Games, Math, Quest, Wiki
- All sounds use Web Audio API (no audio files), procedural synthesis
- `playMenuSelect()` in script.js — home menu tap sound (420→300Hz triangle)
- `playSelect()` in math.js — answer tap blip (360→260Hz triangle)
- `playGoal()` in math.js — bolt earned chime (380Hz + 600Hz ascending)
- Konami sound in nav.js — 7-note run + C-major chord, square wave

## Mobile considerations
- `touch-action: none` on word search grid/cells
- `pointer: coarse` media query shows D-pad in maze
- `-webkit-tap-highlight-color: transparent` on interactive elements
- Math choice buttons: `focus` outline suppressed, `focus-visible` kept for keyboard
- Bottom nav always visible on mobile

## What Miles is like
- Age 7.5, Grade 1 (Bridges math curriculum)
- Currently doing: counting by 10s, coins (pennies/dimes), add/subtract to 100
- Reading: heart words (sight words), phonics (oa/ow/oe, ie/igh/i sounds)
- Loves: video games, mazes, CYOA books, Greek myths, his own website
- Gets bored fast if no reward/progress visible
- Reads to his friends that "my dad built me a website"

## TODO / Backlog (priority order)
1. **Battle mode depth** — ITEMS button mid-fight, starter hero progression, wire `games.html?battle=theseus` URL param from maze Level 10 win
2. **Coins mini-game** — visual mechanic (see coins, count value) — needs its own page, not shoehorned into math
3. **Sight word drill** — flash card style, earns scrolls, tied to his actual Grade 1 heart words
4. **Number path game** — squirrel on a number line, counting by 10s, maps to his actual homework
5. **Site rename** — "Miles' Myth Wiki" is outdated, ask Miles what he wants to call it
6. **Custom maze sprites** — Jordan will make art in ChatGPT; slot exists in secret-challenge.js (playerImg, minotaurImg, relicImg)
7. **Parent stats page** — per-skill tracking, session history (stats.html exists, needs work)
8. **Badge/trophy system** — mythology item trophies, hard unlock thresholds
9. **More quest stories** — currently 6, could add more heroes (Achilles, Artemis, etc.)

## Jordan's preferences
- Keep responses short and direct
- Don't add features beyond what's asked
- Don't add comments to code unless the WHY is non-obvious
- Commit and push after every meaningful chunk of work
- Version bump ALL HTML files when styles.css changes (use sed, don't do one by one)
- When a page is broken, fix the root cause — don't patch around it
- Jordan approves the direction first before building; don't surprise him with big structural changes
