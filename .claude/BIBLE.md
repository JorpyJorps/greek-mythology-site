# THE BIBLE
### Rules we check at the start and end of every session

---

## BEFORE WE START
- [ ] Read this file top to bottom
- [ ] Read `memory/project_miles_site.md` to re-orient on where we are
- [ ] Ask Jordan: "anything broken since last session, anything Miles said about the site?"
- [ ] If Jordan says "let's brainstorm" → do the interview first, build second

---

## WHILE WE BUILD
- [ ] **No explanatory text in the UI** — icons and symbols only, no instruction paragraphs
- [ ] **No manual difficulty selectors for Miles** — everything auto-adapts, parent overrides go in Dad's Stats only
- [ ] **No timers** — Miles doesn't like them
- [ ] **Show don't tell** — if we can't figure out the UI without reading text, redesign it
- [ ] **Both currencies matter** — every new activity earns either ⚡ Bolts or 📜 Scrolls (not neither)
- [ ] **Daily caps on everything** — no single activity can be farmed all day
- [ ] **Pixel font (Press Start 2P) for headings/UI only** — body text, questions, answer buttons, and anything Miles reads or taps uses Trebuchet MS (the body font). Never put pixel font on content.
- [ ] **Maroon + gold always** — `--bg: #120506`, `--gold: #f3c969`
- [ ] **Bump CSS version** in the HTML page when styles.css changes (`?v=XX`)
- [ ] **Bump JS version** in the HTML page when a JS file changes (`?v=XX`)

---

## BEFORE WE STOP
- [ ] Test the thing we just built (don't just write it, verify it runs)
- [ ] Check for CSS version mismatches — all active pages should be on the same `?v=XX`
- [ ] Commit and push to GitHub so Vercel has the latest code
- [ ] Confirm Vercel deploy triggered (check the push went through)

---

## GIT RULES
- Push at the **end of every session** or when a feature is working and testable
- Never leave session changes uncommitted overnight — Vercel won't have them
- Commit message format: what changed + why (not just "update files")
- Don't push broken half-finished work to main — Miles plays on Vercel

---

## THE GAME LOOP (never break this)
Math / Trivia / Memory → earn ⚡ Bolts
Reading Quest / Word Search → earn 📜 Scrolls
Both currencies → fill meter → unlock Minotaur Maze

---

## MILES' RULES (design for him, not for us)
- Age 7.5, reads independently, encyclopedic mythology knowledge
- Mild ADHD-adjacent — gets distracted, hates failing immediately, moves fast
- Favorite colors: maroon and gold (already the theme ✓)
- Loves Zelda, Pokémon, Super Nintendo — retro game feel is correct
- Sessions are 15–30 min max — don't build for marathon grinding
- No personal device — plays on dad's PC or parents' phones (mobile must work)

---

## WHAT TO ADD NEXT (current backlog order)
1. Minotaur Maze — Pac-Man clone, canvas, Theseus vs Minotaur AI
2. Dad's Stats page — per-skill math, bolt/scroll totals, session history
3. Badge system — Greek mythology items, hard thresholds, gold flash on earn
4. Battle expansion — ITEMS button (spend ⚡/📜 mid-fight), starter hero system

---

*Last updated: Session 2 — Battle Cards Pokémon rebuild, Games Arena, Homepage wiring*
