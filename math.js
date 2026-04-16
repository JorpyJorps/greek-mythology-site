import { recordMathAnswer } from "./stats.js";

// ── Storage keys ──────────────────────────────────────────
const STORAGE_KEY   = "miles-math-progress";
const BOLT_KEY      = "miles-bolts";
const EASTER_EGG_KEY = "secret-maze-easter-egg";

// ── Constants ─────────────────────────────────────────────
const DAILY_BOLT_CAP    = 20;   // max bolts earnable from math per day
const MILESTONE_TEN     = 10;   // lightning flash every N correct
const MILESTONE_UNLOCK  = 40;   // correct today → unlock maze
const STREAK_DISPLAY    = 5;    // dots shown in streak HUD

// ── DOM refs ──────────────────────────────────────────────
const mathProblem    = document.querySelector("#math-problem");
const mathOptions    = document.querySelector("#math-options");
const mathFeedback   = document.querySelector("#math-feedback");
const mathSkillSymbol = document.querySelector("#math-skill-symbol");
const mathStormFlash = document.querySelector("#math-storm-flash");
const mathChestFlash = document.querySelector("#math-chest-flash");
const mathChestTitle = document.querySelector("#math-chest-title");
const boltCountEl    = document.querySelector("#bolt-count");
const streakHud      = document.querySelector("#streak-hud");
const dailyFill      = document.querySelector("#math-daily-fill");
const dailyLabel     = document.querySelector("#math-daily-label");

// ── State ─────────────────────────────────────────────────
let progress     = loadProgress();
let sessionCorrect = 0;
let currentProblem = null;
let answered     = false;
let recentProblemKeys = [];

// ── Progress persistence ───────────────────────────────────
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function loadProgress() {
  const today = getTodayKey();
  const fallback = {
    totalCorrect: 0,
    totalAnswered: 0,
    bestStreak: 0,
    currentStreak: 0,
    dailyDate: today,
    dailyCorrect: 0,
    dailyAnswered: 0,
    dailyBoltsEarned: 0,
    highestCelebratedTier: 0,
    completedSecretLevels: 0,
    minotaurWins: 0,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw);
    if (p.dailyDate !== today) {
      return { ...p, dailyDate: today, dailyCorrect: 0, dailyAnswered: 0,
               dailyBoltsEarned: 0, completedSecretLevels: 0, currentStreak: 0 };
    }
    return { ...fallback, ...p };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ── Bolt earning ───────────────────────────────────────────
function getStoredBolts() {
  return parseInt(localStorage.getItem(BOLT_KEY) || "0", 10);
}

function addBolt() {
  if (progress.dailyBoltsEarned >= DAILY_BOLT_CAP) return;
  progress.dailyBoltsEarned += 1;
  const total = getStoredBolts() + 1;
  localStorage.setItem(BOLT_KEY, String(total));
  if (boltCountEl) boltCountEl.textContent = String(total);
}

// ── Adaptive difficulty ───────────────────────────────────
function getMathLevel() {
  if (progress.totalCorrect >= 160) return 5;
  if (progress.totalCorrect >= 80)  return 4;
  if (progress.totalCorrect >= 40)  return 3;
  if (progress.totalCorrect >= 15)  return 2;
  return 1;
}

function getUnlockedSecretTier() {
  return Math.floor(progress.dailyCorrect / MILESTONE_UNLOCK);
}

function hasAvailableSecretChallenge() {
  return getUnlockedSecretTier() > (progress.completedSecretLevels || 0);
}

// ── Problem generation ────────────────────────────────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rememberProblem(key) {
  recentProblemKeys.push(key);
  if (recentProblemKeys.length > 30) recentProblemKeys = recentProblemKeys.slice(-30);
}

function buildAddition(level) {
  const ranges = [
    [[2,9],[1,8]],
    [[8,19],[3,11]],
    [[15,39],[8,22]],
    [[30,59],[14,34]],
    [[45,89],[22,48]],
  ];
  const [r1, r2] = ranges[Math.min(level-1, 4)];
  const left  = randomInt(r1[0], r1[1]);
  const right = randomInt(r2[0], r2[1]);
  return { operator:"+", left, right, answer:left+right,
           prompt:`${left} + ${right} = ?`, key:`add:${level}:${left}+${right}` };
}

function buildSubtraction(level) {
  const tops = [[6,14],[10,22],[16,36],[24,54],[38,78]];
  const [tMin, tMax] = tops[Math.min(level-1, 4)];
  const left  = randomInt(tMin, tMax);
  const right = randomInt(1, Math.max(1, Math.floor(left * 0.6)));
  return { operator:"-", left, right, answer:left-right,
           prompt:`${left} - ${right} = ?`, key:`sub:${level}:${left}-${right}` };
}

function buildMissingNumber(level) {
  const base = buildAddition(Math.max(1, level - 1));
  return { operator:"+", left:base.left, right:base.right, answer:base.right,
           prompt:`${base.left} + ? = ${base.answer}`, key:`miss:${base.left}+?=${base.answer}` };
}

function buildMultiply(level) {
  const maxFactor = [2,5,6,9,12][Math.min(level-1, 4)];
  const left  = randomInt(2, maxFactor);
  const right = randomInt(1, Math.min(maxFactor, 10));
  return { operator:"×", left, right, answer:left*right,
           prompt:`${left} × ${right} = ?`, key:`mul:${left}x${right}` };
}

function buildProblem() {
  const level = getMathLevel();

  for (let attempt = 0; attempt < 60; attempt++) {
    let candidate;
    const roll = Math.random();

    if (level <= 2) {
      // early: mostly + and −
      candidate = roll < 0.55 ? buildAddition(level)
                : roll < 0.80 ? buildSubtraction(level)
                : buildMissingNumber(level);
    } else if (level === 3) {
      // introduce ×
      candidate = roll < 0.40 ? buildAddition(level)
                : roll < 0.65 ? buildSubtraction(level)
                : roll < 0.82 ? buildMissingNumber(level)
                : buildMultiply(1);
    } else {
      // level 4-5: mix with more ×
      candidate = roll < 0.30 ? buildAddition(level)
                : roll < 0.50 ? buildSubtraction(level)
                : roll < 0.65 ? buildMissingNumber(level)
                : buildMultiply(level - 2);
    }

    if (recentProblemKeys.includes(candidate.key)) continue;

    // build wrong answers
    const answer = candidate.answer;
    const spread = Math.max(4, Math.round(answer * 0.2));
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const g = answer + (randomInt(-spread, spread) || randomInt(2, 5));
      if (g > 0 && g !== answer) wrongs.add(g);
    }

    rememberProblem(candidate.key);
    return {
      ...candidate,
      options: [...wrongs, answer].sort(() => Math.random() - 0.5).map(String),
    };
  }

  recentProblemKeys = [];
  return buildProblem();
}

// ── Rendering ──────────────────────────────────────────────
function renderStreak() {
  const streak = Math.min(progress.currentStreak, STREAK_DISPLAY);
  streakHud.textContent =
    "●".repeat(streak) + "○".repeat(STREAK_DISPLAY - streak);
}

function renderDailyBar() {
  const pct = Math.min(100, (progress.dailyBoltsEarned / DAILY_BOLT_CAP) * 100);
  dailyFill.style.width = `${pct}%`;
  const capped = progress.dailyBoltsEarned >= DAILY_BOLT_CAP;
  dailyLabel.textContent = capped
    ? `MAX BOLTS TODAY ⚡`
    : `${progress.dailyBoltsEarned} / ${DAILY_BOLT_CAP} BOLTS TODAY`;
}

function renderHud() {
  if (boltCountEl) boltCountEl.textContent = String(getStoredBolts());
  renderStreak();
  renderDailyBar();
}

function showLightningFlash() {
  mathStormFlash.classList.remove("is-active");
  requestAnimationFrame(() => mathStormFlash.classList.add("is-active"));
  setTimeout(() => mathStormFlash.classList.remove("is-active"), 900);
}

function showMazeUnlock(tier) {
  if (mathChestTitle) mathChestTitle.textContent = `MAZE UNLOCKED!`;
  mathChestFlash.classList.remove("is-active");
  requestAnimationFrame(() => mathChestFlash.classList.add("is-active"));
  setTimeout(() => mathChestFlash.classList.remove("is-active"), 2800);
}

function renderProblem() {
  currentProblem = buildProblem();
  answered = false;

  mathSkillSymbol.textContent = currentProblem.operator;
  mathProblem.textContent = currentProblem.prompt;
  mathFeedback.textContent = "\u00A0";
  mathFeedback.className = "math-feedback pixel";
  mathOptions.innerHTML = "";

  currentProblem.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "math-choice pixel";
    btn.type = "button";
    btn.textContent = option;
    btn.addEventListener("click", () => handleAnswer(option, btn));
    mathOptions.appendChild(btn);
  });
}

function handleAnswer(option, btn) {
  if (answered) return;
  answered = true;

  const correct = option === String(currentProblem.answer);
  const prevTier = getUnlockedSecretTier();

  progress.totalAnswered += 1;
  progress.dailyAnswered += 1;

  if (correct) {
    progress.totalCorrect += 1;
    progress.dailyCorrect += 1;
    progress.currentStreak += 1;
    progress.bestStreak = Math.max(progress.bestStreak, progress.currentStreak);
    sessionCorrect += 1;
    addBolt();
  } else {
    progress.currentStreak = 0;
  }

  // secret unlock check
  const newTier = getUnlockedSecretTier();
  if (newTier > prevTier && newTier > (progress.highestCelebratedTier || 0)) {
    progress.highestCelebratedTier = newTier;
    showMazeUnlock(newTier);
  }

  recordMathAnswer({ mode: "auto", correct, streak: progress.currentStreak });
  saveProgress();
  renderHud();

  // color the buttons
  mathOptions.querySelectorAll(".math-choice").forEach(b => {
    b.disabled = true;
    if (b.textContent === String(currentProblem.answer)) b.classList.add("is-correct");
    else if (b === btn) b.classList.add("is-wrong");
  });

  if (correct && progress.totalCorrect % MILESTONE_TEN === 0) {
    showLightningFlash();
    mathFeedback.textContent = `⚡ ${progress.totalCorrect} CORRECT!`;
    mathFeedback.classList.add("is-correct");
  } else {
    mathFeedback.textContent = correct ? "✓ CORRECT!" : `✗  ${currentProblem.answer}`;
    mathFeedback.classList.add(correct ? "is-correct" : "is-wrong");
  }

  // auto-advance after a short delay
  setTimeout(() => renderProblem(), correct ? 900 : 1400);
}

// ── Init ───────────────────────────────────────────────────
renderHud();
renderProblem();

// midnight reset
const now = new Date();
const msToMidnight = new Date(now).setHours(24,0,0,0) - now;
setTimeout(() => {
  progress = loadProgress();
  renderHud();
  renderProblem();
}, msToMidnight + 1000);
