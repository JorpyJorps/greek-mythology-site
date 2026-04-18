"use strict";

// ── Custom sprite slots ────────────────────────────────────
// To swap in art made in ChatGPT, do:
//   const img = new Image(); img.src = '/assets/theseus.png'; playerImg = img;
let playerImg   = null;
let minotaurImg = null;
let relicImg    = null;

// ── Storage ────────────────────────────────────────────────
const STORAGE_KEY  = "miles-math-progress";
const MAZE_LVL_KEY = "miles-maze-level";
const EASTER_KEY   = "secret-maze-easter-egg";
const UNLOCK_DAILY = 40;

// ── Difficulty config (10 levels) ─────────────────────────
const PLAYER_SPEED = 4.2;   // tiles / second
const BASE_M_SPD   = 2.3;   // minotaur base speed
const WAKE_SECS    = 2.2;   // seconds before minotaur starts moving

//          passages  speedMult  relics  theme
const LVLS = [
  { p: 9,  sm: 1.00, rel: 3, th: 0 }, // 1
  { p: 9,  sm: 1.13, rel: 3, th: 0 }, // 2
  { p: 9,  sm: 1.27, rel: 3, th: 0 }, // 3
  { p:11,  sm: 1.42, rel: 4, th: 1 }, // 4
  { p:11,  sm: 1.58, rel: 4, th: 1 }, // 5
  { p:11,  sm: 1.75, rel: 4, th: 1 }, // 6
  { p:13,  sm: 1.93, rel: 5, th: 2 }, // 7
  { p:13,  sm: 2.12, rel: 5, th: 2 }, // 8
  { p:13,  sm: 2.32, rel: 5, th: 2 }, // 9
  { p:15,  sm: 2.50, rel: 6, th: 3 }, // 10
];

const THEMES = [
  { label:"HEDGE LABYRINTH",    wall:"#1e4a18", wallHi:"#2d6022", fg:"#0f1e0c", accent:"#f3c969" },
  { label:"ANCIENT RUINS",      wall:"#4a3a1e", wallHi:"#5e4c28", fg:"#1a1108", accent:"#f3c969" },
  { label:"DEEP DUNGEON",       wall:"#1a2440", wallHi:"#263258", fg:"#08090f", accent:"#88b8ff" },
  { label:"MINOTAUR'S CHAMBER", wall:"#5c0f0f", wallHi:"#781818", fg:"#100404", accent:"#ff8c42" },
];

// ── DOM refs ───────────────────────────────────────────────
const canvas     = document.querySelector("#maze-canvas");
const ctx        = canvas.getContext("2d");
const overlayEl  = document.querySelector("#maze-overlay");
const oIconEl    = document.querySelector("#maze-o-icon");
const oTitleEl   = document.querySelector("#maze-o-title");
const oMsgEl     = document.querySelector("#maze-o-msg");
const oBtnEl     = document.querySelector("#maze-o-btn");
const oBtn2El    = document.querySelector("#maze-o-btn2");
const hudLvlEl   = document.querySelector("#maze-hud-level");
const hudLivEl   = document.querySelector("#maze-hud-lives");
const hudRelEl   = document.querySelector("#maze-hud-relics");
const hudStatEl  = document.querySelector("#maze-hud-status");
const dpadEl     = document.querySelector("#maze-dpad");

// ── Game state ─────────────────────────────────────────────
let maze       = null;   // { grid, size, exitR, exitC }
let TILE       = 32;
let lvlIdx     = 0;
let lives      = 2;
let relicTiles = [];
let relicsLeft = 0;
let state      = "overlay"; // overlay | playing
let rafId      = null;
let lastTs     = 0;
let wakeTimer  = 0;

const player = { r:1, c:1, pr:1.0, pc:1.0, dr:0, dc:1, pdr:0, pdc:0, moving:false, prog:0 };
const mino   = { r:1, c:1, pr:1.0, pc:1.0, dr:0, dc:0,         moving:false, prog:0 };

// ── Maze generation ────────────────────────────────────────
function generateMaze(passages) {
  const sz = passages * 2 + 1;
  const grid = Array.from({ length: sz }, () => new Uint8Array(sz).fill(1));

  // Open all passage cells (odd row, odd col)
  for (let r = 0; r < passages; r++)
    for (let c = 0; c < passages; c++)
      grid[r * 2 + 1][c * 2 + 1] = 0;

  // Iterative recursive-backtracker
  const vis = Array.from({ length: passages }, () => new Uint8Array(passages));
  const stack = [{ r: 0, c: 0 }];
  vis[0][0] = 1;

  while (stack.length) {
    const cur = stack[stack.length - 1];
    const dirs = shuffle([[-1,0],[1,0],[0,-1],[0,1]]).filter(([dr, dc]) => {
      const nr = cur.r + dr, nc = cur.c + dc;
      return nr >= 0 && nr < passages && nc >= 0 && nc < passages && !vis[nr][nc];
    });
    if (!dirs.length) { stack.pop(); continue; }
    const [dr, dc] = dirs[0];
    grid[cur.r * 2 + 1 + dr][cur.c * 2 + 1 + dc] = 0; // knock down wall
    const nr = cur.r + dr, nc = cur.c + dc;
    vis[nr][nc] = 1;
    stack.push({ r: nr, c: nc });
  }

  // Add ~15% loops so multiple paths exist (Pac-Man needs options)
  const walls = [];
  for (let r = 1; r < sz - 1; r++)
    for (let c = 1; c < sz - 1; c++)
      if (grid[r][c] === 1 && ((r % 2 === 0 && c % 2 === 1) || (r % 2 === 1 && c % 2 === 0)))
        walls.push([r, c]);
  shuffle(walls).slice(0, Math.floor(walls.length * 0.15))
    .forEach(([r, c]) => { grid[r][c] = 0; });

  // Mark exit (bottom-right passage cell)
  const exitR = sz - 2, exitC = sz - 2;
  grid[exitR][exitC] = 2; // 2 = exit tile

  return { grid, size: sz, exitR, exitC };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── BFS: one step toward target ────────────────────────────
function bfsStep(grid, sz, fr, fc, tr, tc) {
  if (fr === tr && fc === tc) return { dr: 0, dc: 0 };
  const sk = fr * sz + fc;
  const tk = tr * sz + tc;
  const prev = new Map([[sk, -1]]);
  const queue = [sk];

  outer: for (let i = 0; i < queue.length; i++) {
    const k = queue[i];
    const r = Math.floor(k / sz), c = k % sz;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= sz || nc < 0 || nc >= sz || grid[nr][nc] === 1) continue;
      const nk = nr * sz + nc;
      if (prev.has(nk)) continue;
      prev.set(nk, k);
      if (nk === tk) break outer;
      queue.push(nk);
    }
  }

  if (!prev.has(tk)) return { dr: 0, dc: 0 };

  // Trace back to find the first step from start
  let cur = tk;
  while (prev.get(cur) !== sk) cur = prev.get(cur);
  return { dr: Math.floor(cur / sz) - fr, dc: cur % sz - fc };
}

// ── Relic placement ────────────────────────────────────────
function placeRelics(count) {
  const { grid, size } = maze;
  const cands = [];
  for (let r = 1; r < size - 1; r++)
    for (let c = 1; c < size - 1; c++)
      if (grid[r][c] === 0 && Math.abs(r - 1) + Math.abs(c - 1) > 4)
        cands.push({ r, c });
  shuffle(cands);
  relicTiles = cands.slice(0, count);
  relicsLeft = count;
}

// ── Canvas sizing ──────────────────────────────────────────
function computeTileSize() {
  const sz = maze.size;
  const maxPx = Math.min(window.innerWidth - 24, window.innerHeight - 180, 620);
  return Math.max(Math.floor(maxPx / sz), 8);
}

function resizeCanvas() {
  if (!maze) return;
  TILE = computeTileSize();
  canvas.width  = maze.size * TILE;
  canvas.height = maze.size * TILE;
}

// ── Input ──────────────────────────────────────────────────
const KEY_MAP = {
  ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1],
  w:[-1,0], s:[1,0], a:[0,-1], d:[0,1],
};

function applyDir(dr, dc) {
  if (state !== "playing") return;
  player.pdr = dr;
  player.pdc = dc;
  if (!player.moving) tryStartPlayer();
}

document.addEventListener("keydown", e => {
  const d = KEY_MAP[e.key];
  if (d) { e.preventDefault(); applyDir(d[0], d[1]); }
});

// D-pad (shows on touch devices via CSS `pointer: coarse`)
if (dpadEl) {
  const DMAP = { up:[-1,0], down:[1,0], left:[0,-1], right:[0,1] };
  dpadEl.querySelectorAll("[data-dir]").forEach(btn => {
    const [dr, dc] = DMAP[btn.dataset.dir];
    const onPress = e => { e.preventDefault(); applyDir(dr, dc); };
    btn.addEventListener("pointerdown", onPress);
  });
}

// ── Player movement ────────────────────────────────────────
function isOpen(r, c) {
  const { grid, size } = maze;
  return r >= 0 && r < size && c >= 0 && c < size && grid[r][c] !== 1;
}

function tryStartPlayer() {
  // Prefer pending direction
  if ((player.pdr || player.pdc) && isOpen(player.r + player.pdr, player.c + player.pdc)) {
    player.dr   = player.pdr;
    player.dc   = player.pdc;
    player.pdr  = 0;
    player.pdc  = 0;
    player.moving = true;
    player.prog   = 0;
    return;
  }
  // Continue current direction
  if ((player.dr || player.dc) && isOpen(player.r + player.dr, player.c + player.dc)) {
    player.moving = true;
    player.prog   = 0;
  }
}

function stepPlayer(dt) {
  if (!player.moving) { tryStartPlayer(); return; }

  player.prog += PLAYER_SPEED * dt;

  if (player.prog >= 1.0) {
    const over = player.prog - 1.0;
    player.r += player.dr;
    player.c += player.dc;
    player.pr = player.r;
    player.pc = player.c;
    player.moving = false;
    player.prog   = 0;
    onPlayerTile();
    if (player.moving) player.prog = Math.min(over, 0.95);
  } else {
    player.pr = player.r + player.dr * player.prog;
    player.pc = player.c + player.dc * player.prog;
  }
}

function onPlayerTile() {
  // Collect relic?
  const ri = relicTiles.findIndex(t => t.r === player.r && t.c === player.c);
  if (ri !== -1) {
    relicTiles.splice(ri, 1);
    relicsLeft--;
    updateHud();
    setStatus(relicsLeft > 0 ? `${relicsLeft} RELIC${relicsLeft !== 1 ? "S" : ""} LEFT` : "GATE OPEN — RUN!");
  }

  // Reached exit?
  if (relicsLeft === 0 && maze.grid[player.r][player.c] === 2) {
    handleWin();
    return;
  }

  tryStartPlayer();
}

// ── Minotaur movement ──────────────────────────────────────
function stepMino(dt) {
  if (wakeTimer > 0) { wakeTimer -= dt; return; }

  if (!mino.moving) {
    const { dr, dc } = bfsStep(maze.grid, maze.size, mino.r, mino.c, player.r, player.c);
    if (!dr && !dc) return;
    mino.dr = dr;
    mino.dc = dc;
    mino.moving = true;
    mino.prog   = 0;
  }

  mino.prog += BASE_M_SPD * LVLS[lvlIdx].sm * dt;

  if (mino.prog >= 1.0) {
    mino.r += mino.dr;
    mino.c += mino.dc;
    mino.pr = mino.r;
    mino.pc = mino.c;
    mino.moving = false;
    mino.prog   = 0;
  } else {
    mino.pr = mino.r + mino.dr * mino.prog;
    mino.pc = mino.c + mino.dc * mino.prog;
  }
}

// ── Collision ──────────────────────────────────────────────
function checkCollision() {
  if (Math.abs(player.pr - mino.pr) + Math.abs(player.pc - mino.pc) < 0.75) {
    handleCaught();
  }
}

// ── Events ────────────────────────────────────────────────
function handleCaught() {
  if (state !== "playing") return;
  state = "overlay";
  lives--;
  if (lives <= 0) {
    showOverlay("💀", "CAUGHT!", "The Minotaur got you. No lives left.",
      "RETRY", () => startLevel(lvlIdx, true), null, null);
  } else {
    showOverlay("😤", "CAUGHT!", `You have ${lives} life remaining.`,
      "TRY AGAIN", () => startLevel(lvlIdx, false), null, null);
  }
}

function handleWin() {
  if (state !== "playing") return;
  state = "overlay";

  // Save furthest level
  const best = parseInt(localStorage.getItem(MAZE_LVL_KEY) || "0", 10);
  if (lvlIdx + 1 > best) localStorage.setItem(MAZE_LVL_KEY, String(lvlIdx + 1));

  if (lvlIdx >= LVLS.length - 1) {
    // Final level — send to battle
    showOverlay("⚔️", "YOU FOUND HIM!",
      "You've navigated the full labyrinth. Now face the Minotaur in battle!",
      "FIGHT THE MINOTAUR", () => { window.location.href = "./games.html?battle=theseus"; },
      "PLAY AGAIN", () => startLevel(0, true));
  } else {
    const next = lvlIdx + 1;
    const nextTheme = THEMES[LVLS[next].th];
    showOverlay("🏆", `LEVEL ${lvlIdx + 1} CLEARED!`,
      `Entering: ${nextTheme.label}`,
      "NEXT LEVEL", () => startLevel(next, true), null, null);
  }
}

// ── Overlay ────────────────────────────────────────────────
function showOverlay(icon, title, msg, btn1, fn1, btn2, fn2) {
  oIconEl.textContent  = icon;
  oTitleEl.textContent = title;
  oMsgEl.textContent   = msg;
  oBtnEl.textContent   = btn1;
  oBtnEl.onclick = () => { hideOverlay(); fn1(); };

  if (btn2 && oBtn2El) {
    oBtn2El.hidden = false;
    oBtn2El.textContent = btn2;
    oBtn2El.onclick = () => { hideOverlay(); fn2(); };
  } else if (oBtn2El) {
    oBtn2El.hidden = true;
  }

  overlayEl.hidden = false;
  state = "overlay";
}

function hideOverlay() {
  overlayEl.hidden = true;
}

// ── HUD ────────────────────────────────────────────────────
function updateHud() {
  const cfg = LVLS[lvlIdx];
  const theme = THEMES[cfg.th];
  if (hudLvlEl)  hudLvlEl.textContent  = `${theme.label}  ·  LVL ${lvlIdx + 1}`;
  if (hudLivEl)  hudLivEl.textContent  = "❤️".repeat(lives);
  if (hudRelEl)  hudRelEl.textContent  = `⭐ ${cfg.rel - relicsLeft} / ${cfg.rel}`;
}

function setStatus(msg) {
  if (hudStatEl) hudStatEl.textContent = msg;
}

// ── Rendering ──────────────────────────────────────────────
function draw() {
  const T = TILE;
  const { grid, size } = maze;
  const theme = THEMES[LVLS[lvlIdx].th];

  // Background
  ctx.fillStyle = theme.fg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tiles
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const x = c * T, y = r * T, v = grid[r][c];
      if (v === 1) {
        ctx.fillStyle = theme.wall;
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = theme.wallHi;
        ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
      } else {
        ctx.fillStyle = (r + c) % 2 === 0 ? "rgba(0,0,0,0.07)" : "rgba(0,0,0,0)";
        ctx.fillRect(x, y, T, T);
        if (v === 2) drawExit(x, y, T, theme);
      }
    }
  }

  // Relics
  relicTiles.forEach(t => drawRelic(t.c * T + T / 2, t.r * T + T / 2, T));

  // Minotaur (draw under player so player is always visible)
  drawMino(mino.pc * T + T / 2, mino.pr * T + T / 2, T, theme);

  // Player
  drawPlayer(player.pc * T + T / 2, player.pr * T + T / 2, T, theme);
}

function drawExit(x, y, T, theme) {
  const open = relicsLeft === 0;
  const m = Math.max(3, Math.floor(T * 0.18));
  ctx.fillStyle = open ? theme.accent : "rgba(243,201,105,0.22)";
  ctx.fillRect(x + m, y + m, T - m * 2, T - m * 2);
  if (!open) {
    ctx.font = `${Math.floor(T * 0.42)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔒", x + T / 2, y + T / 2);
  }
}

function drawPlayer(x, y, T, theme) {
  const r = T * 0.38;
  if (playerImg && playerImg.complete && playerImg.naturalWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(playerImg, x - r, y - r, r * 2, r * 2);
    ctx.restore();
    return;
  }
  // Default: gold circle
  ctx.fillStyle = theme.accent;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `${Math.floor(r * 1.05)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🗡️", x, y);
}

function drawMino(x, y, T, theme) {
  const r = T * 0.40;
  if (minotaurImg && minotaurImg.complete && minotaurImg.naturalWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(minotaurImg, x - r, y - r, r * 2, r * 2);
    ctx.restore();
    return;
  }
  // Default: dark red circle with horns
  ctx.fillStyle = "#7a1a1a";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#c97b3b";
  ctx.lineWidth = Math.max(2, T * 0.06);
  ctx.beginPath();
  ctx.moveTo(x - r * 0.55, y - r * 0.55);
  ctx.lineTo(x - r * 0.95, y - r * 1.1);
  ctx.moveTo(x + r * 0.55, y - r * 0.55);
  ctx.lineTo(x + r * 0.95, y - r * 1.1);
  ctx.stroke();
}

function drawRelic(x, y, T) {
  const R = T * 0.26, r2 = R * 0.44;
  if (relicImg && relicImg.complete && relicImg.naturalWidth) {
    ctx.drawImage(relicImg, x - R, y - R, R * 2, R * 2);
    return;
  }
  ctx.fillStyle = "#ffe066";
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI / 5) - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r2;
    i === 0
      ? ctx.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad)
      : ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

// ── Game loop ──────────────────────────────────────────────
function loop(ts) {
  const dt = Math.min((ts - lastTs) / 1000, 0.1);
  lastTs = ts;

  if (state === "playing") {
    stepPlayer(dt);
    stepMino(dt);
    checkCollision();
    draw();
  }

  rafId = requestAnimationFrame(loop);
}

// ── Level setup ────────────────────────────────────────────
function resetPositions() {
  const sz = maze.size;
  player.r = 1; player.c = 1;
  player.pr = 1; player.pc = 1;
  player.dr = 0; player.dc = 1;
  player.pdr = 0; player.pdc = 0;
  player.moving = false; player.prog = 0;

  // Minotaur starts at opposite corner
  mino.r = sz - 2; mino.c = 1;
  mino.pr = sz - 2; mino.pc = 1;
  mino.dr = 0; mino.dc = 0;
  mino.moving = false; mino.prog = 0;
  wakeTimer = WAKE_SECS;
}

function startLevel(idx, resetLives) {
  lvlIdx = Math.max(0, Math.min(idx, LVLS.length - 1));
  if (resetLives) lives = 2;
  maze = generateMaze(LVLS[lvlIdx].p);
  resizeCanvas();
  placeRelics(LVLS[lvlIdx].rel);
  resetPositions();
  updateHud();
  setStatus("FIND THE RELICS!");
  hideOverlay();
  state = "playing";

  if (!rafId) {
    lastTs = performance.now();
    rafId = requestAnimationFrame(loop);
  }
}

// ── Date util ──────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ── Init / unlock gate ─────────────────────────────────────
function init() {
  // Easter egg bypass
  const bypass = new URLSearchParams(location.search).get("egg") === "olympus-star"
    || localStorage.getItem(EASTER_KEY) === "true";
  if (bypass) {
    localStorage.removeItem(EASTER_KEY);
    startLevel(0, true);
    return;
  }

  // Check daily math unlock
  let dailyCorrect = 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.dailyDate === todayKey()) dailyCorrect = p.dailyCorrect || 0;
    }
  } catch { /* ignore */ }

  if (dailyCorrect < UNLOCK_DAILY) {
    showOverlay("🔒", "MAZE LOCKED",
      `Answer ${UNLOCK_DAILY - dailyCorrect} more math questions correctly today to unlock the maze.`,
      "GO TO MATH", () => { window.location.href = "./math.html"; }, null, null);

    // Still start the loop so canvas renders (shows locked overlay over the maze)
    maze = generateMaze(LVLS[0].p);
    resizeCanvas();
    placeRelics(LVLS[0].rel);
    resetPositions();
    lastTs = performance.now();
    rafId = requestAnimationFrame(loop);
    return;
  }

  // Resume furthest reached level
  const best = Math.min(parseInt(localStorage.getItem(MAZE_LVL_KEY) || "0", 10), LVLS.length - 1);
  startLevel(best, true);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  if (maze && state !== "overlay") draw();
});

init();
