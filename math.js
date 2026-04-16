import { recordMathAnswer } from "./stats.js";

const STORAGE_KEY = "miles-math-progress";
const MILESTONE_TEN = 10;
const MILESTONE_FORTY = 40;
const EASTER_EGG_KEY = "secret-maze-easter-egg";

const rewardItems = [
  { icon: "⚡", name: "Thunder Gem", threshold: 10 },
  { icon: "🛡️", name: "Hero Shield", threshold: 20 },
  { icon: "🦉", name: "Athena Owl", threshold: 30 },
  { icon: "🔱", name: "Poseidon Trident", threshold: 40 },
  { icon: "🔥", name: "Forge Flame", threshold: 50 },
  { icon: "🏛️", name: "Temple Token", threshold: 60 },
  { icon: "🪽", name: "Hermes Wing", threshold: 75 },
  { icon: "🌟", name: "Olympus Star", threshold: 90 },
  { icon: "👑", name: "Golden Crown", threshold: 105 },
  { icon: "🧿", name: "Myth Eye", threshold: 120 },
  { icon: "🐚", name: "Sea Shell", threshold: 140 },
  { icon: "🌩️", name: "Storm Crest", threshold: 160 }
];

const badgeLevels = [
  { min: 0, name: "Hero", title: "Storm Starter", icon: "⚡", copy: "Miles is warming up his thunder powers." },
  {
    min: 20,
    name: "Champion",
    title: "Shield Runner",
    icon: "🛡️",
    copy: "A 20-answer streak powers up the champion form."
  },
  {
    min: 40,
    name: "Thunder Mind",
    title: "Bolt Keeper",
    icon: "🌩️",
    copy: "A 40-answer streak means the lightning mind is fully awake."
  },
  {
    min: 75,
    name: "Olympus Master",
    title: "Sky Captain",
    icon: "👑",
    copy: "A 75-answer streak is true Mount Olympus level solving."
  }
];

const modeDescriptions = {
  mixed: "Mixed Review pulls from addition, subtraction, missing numbers, doubles, make 10, and some multiplication.",
  add: "Addition mode mixes facts, doubles, make 10, and bigger two-digit addition.",
  subtract: "Subtraction mode uses difference problems built from the same number ranges as addition.",
  multiply: "Multiply mode uses easy single-digit puzzles like 3 × ? = 9.",
  bonus: "Super Bonus mixes strong addition, subtraction, missing numbers, and multiplication."
};

const modeTitles = {
  mixed: "Mixed Review",
  add: "Addition Mode",
  subtract: "Subtraction Mode",
  multiply: "Multiply Mode",
  bonus: "Super Bonus Mode"
};

const modeProgressKeys = ["mixed", "add", "subtract", "multiply", "bonus"];

const mathProblem = document.querySelector("#math-problem");
const mathSubtext = document.querySelector("#math-subtext");
const mathOptions = document.querySelector("#math-options");
const mathFeedback = document.querySelector("#math-feedback");
const mathNext = document.querySelector("#math-next");
const mathReset = document.querySelector("#math-reset");
const mathResetConfirm = document.querySelector("#math-reset-confirm");
const mathResetYes = document.querySelector("#math-reset-yes");
const mathResetNo = document.querySelector("#math-reset-no");
const mathTotalCorrect = document.querySelector("#math-total-correct");
const mathStreak = document.querySelector("#math-streak");
const mathTotalCard = document.querySelector("#math-total-card");
const mathSessionCard = document.querySelector("#math-session-card");
const mathBestCard = document.querySelector("#math-best-card");
const mathAccuracyCard = document.querySelector("#math-accuracy-card");
const mathLevelCard = document.querySelector("#math-level-card");
const mathBadgeCard = document.querySelector("#math-badge-card");
const mathTodayCard = document.querySelector("#math-today-card");
const mathSpeedCard = document.querySelector("#math-speed-card");
const mathStatusTitle = document.querySelector("#math-status-title");
const mathStatusCopy = document.querySelector("#math-status-copy");
const mathBoltStage = document.querySelector("#math-bolt-stage");
const mathSecretAction = document.querySelector("#math-secret-action");
const mathStormFlash = document.querySelector("#math-storm-flash");
const mathChestFlash = document.querySelector("#math-chest-flash");
const mathChestTitle = document.querySelector("#math-chest-title");
const mathChestCopy = document.querySelector("#math-chest-copy");
const mathModeButtons = document.querySelectorAll("[data-mode]");
const mathModeCopy = document.querySelector("#math-mode-copy");
const mathModeTitle = document.querySelector("#math-mode-title");
const mathAvatarFigure = document.querySelector("#math-avatar-figure");
const mathAvatarTitle = document.querySelector("#math-avatar-title");
const mathAvatarCopy = document.querySelector("#math-avatar-copy");
const mathRewardGrid = document.querySelector("#math-reward-grid");

let progress = loadProgress();
let sessionCorrect = 0;
let currentProblem = null;
let answered = false;
let currentMode = "mixed";
let recentProblemKeys = [];
let questionStartedAt = performance.now();
let midnightResetTimer = null;

function normalizeModeProgress(savedProgress = {}) {
  return Object.fromEntries(modeProgressKeys.map((key) => [key, savedProgress[key] || 0]));
}

function ensureTodayFields(parsed) {
  const currentTodayKey = getTodayKey();
  if (parsed.dateMode !== "local-v1") {
    return {
      ...parsed,
      dateMode: "local-v1",
      dailyDate: currentTodayKey,
      dailyCorrect: 0,
      dailyAnswered: 0,
      dailyModeCorrect: normalizeModeProgress(),
      completedSecretLevels: 0
    };
  }

  if ((parsed.dailyDate || "") !== currentTodayKey) {
    return {
      ...parsed,
      dateMode: "local-v1",
      dailyDate: currentTodayKey,
      dailyCorrect: 0,
      dailyAnswered: 0,
      dailyModeCorrect: normalizeModeProgress(),
      completedSecretLevels: 0
    };
  }

  return {
    ...parsed,
    dateMode: "local-v1",
    dailyDate: currentTodayKey,
    dailyCorrect: parsed.dailyCorrect || 0,
    dailyAnswered: parsed.dailyAnswered || 0,
    dailyModeCorrect: normalizeModeProgress(parsed.dailyModeCorrect)
  };
}

function loadProgress() {
  const currentTodayKey = getTodayKey();
  const fallback = {
    totalCorrect: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalAnswered: 0,
    dailyDate: currentTodayKey,
    dailyCorrect: 0,
    dailyAnswered: 0,
    dailyModeCorrect: normalizeModeProgress(),
    dateMode: "local-v1",
    highestCelebratedTier: 0,
    completedSecretLevels: 0,
    minotaurWins: 0
  };

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return fallback;
  }

  try {
    const parsed = ensureTodayFields(JSON.parse(saved));
    return {
      totalCorrect: parsed.totalCorrect || 0,
      bestStreak: parsed.bestStreak || 0,
      currentStreak: parsed.currentStreak || 0,
      totalAnswered: parsed.totalAnswered || 0,
      dailyDate: parsed.dailyDate,
      dailyCorrect: parsed.dailyCorrect || 0,
      dailyAnswered: parsed.dailyAnswered || 0,
      dailyModeCorrect: normalizeModeProgress(parsed.dailyModeCorrect),
      dateMode: parsed.dateMode || "local-v1",
      completedSecretLevels: parsed.completedSecretLevels || 0,
      minotaurWins: parsed.minotaurWins || 0,
      highestCelebratedTier:
        typeof parsed.highestCelebratedTier === "number"
          ? parsed.highestCelebratedTier
          : Math.floor((parsed.totalCorrect || 0) / MILESTONE_FORTY)
    };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function msUntilNextMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight.getTime() - now.getTime();
}

function resetDailyMathState() {
  const freshTodayKey = getTodayKey();
  progress.dailyDate = freshTodayKey;
  progress.dailyCorrect = 0;
  progress.dailyAnswered = 0;
  progress.dailyModeCorrect = normalizeModeProgress();
  progress.completedSecretLevels = 0;
  progress.currentStreak = 0;
  sessionCorrect = 0;
  recentProblemKeys = [];
  mathSpeedCard.textContent = "Steady";
  window.localStorage.removeItem(EASTER_EGG_KEY);
  saveProgress();
  renderProgress();
  renderProblem();
}

function scheduleMidnightReset() {
  if (midnightResetTimer) {
    window.clearTimeout(midnightResetTimer);
  }

  midnightResetTimer = window.setTimeout(() => {
    resetDailyMathState();
    scheduleMidnightReset();
  }, msUntilNextMidnight() + 1000);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTotalTier() {
  if (progress.totalCorrect >= 160) return 4;
  if (progress.totalCorrect >= 120) return 3;
  if (progress.totalCorrect >= 80) return 2;
  if (progress.totalCorrect >= 40) return 1;
  return 0;
}

function getSessionTier() {
  if (sessionCorrect >= 40) return 2;
  if (sessionCorrect >= 20) return 1;
  return 0;
}

function getMathLevel() {
  return 1 + getTotalTier() + getSessionTier();
}

function getModeDifficultyBoost(modeKey) {
  const solvedToday = progress.dailyModeCorrect?.[modeKey] || 0;
  if (solvedToday >= 36) return 3;
  if (solvedToday >= 24) return 2;
  if (solvedToday >= 12) return 1;
  return 0;
}

function getEffectiveModeLevel(modeKey, baseLevel, offset = 0) {
  return Math.max(1, Math.min(5, baseLevel + getModeDifficultyBoost(modeKey) + offset));
}

function getCurrentBadge() {
  return [...badgeLevels].reverse().find((badge) => progress.currentStreak >= badge.min) || badgeLevels[0];
}

function getUnlockedSecretTier() {
  return Math.floor(progress.dailyCorrect / MILESTONE_FORTY);
}

function hasAvailableSecretChallenge() {
  return getUnlockedSecretTier() > (progress.completedSecretLevels || 0);
}

function getStormTier() {
  return Math.min(4, Math.floor(progress.totalCorrect / MILESTONE_TEN));
}

function setStormTier() {
  document.body.dataset.stormTier = String(getStormTier());
}

function rememberProblem(key) {
  recentProblemKeys.push(key);
  if (recentProblemKeys.length > 30) {
    recentProblemKeys = recentProblemKeys.slice(-30);
  }
}

function buildMixedTemplate(level) {
  if (level <= 1) {
    return [
      { first: [4, 9], second: [3, 9] },
      { first: [8, 18], second: [2, 9] },
      { first: [10, 24], second: [6, 15] }
    ];
  }

  if (level === 2) {
    return [
      { first: [12, 28], second: [8, 18] },
      { first: [18, 34], second: [9, 24] },
      { first: [24, 39], second: [12, 28] }
    ];
  }

  if (level === 3) {
    return [
      { first: [22, 44], second: [11, 27] },
      { first: [28, 52], second: [18, 34] },
      { first: [36, 58], second: [16, 39] }
    ];
  }

  if (level === 4) {
    return [
      { first: [35, 59], second: [21, 38] },
      { first: [42, 67], second: [24, 44] },
      { first: [48, 72], second: [28, 48] }
    ];
  }

  return [
    { first: [52, 79], second: [24, 48] },
    { first: [58, 86], second: [31, 56] },
    { first: [64, 94], second: [36, 67] }
  ];
}

function getMixedLevelPool(level) {
  if (level <= 1) return [1];
  if (level === 2) return [1, 2];
  if (level === 3) return [1, 2, 3];
  if (level === 4) return [1, 2, 3, 4];
  if (level === 5) return [1, 2, 3, 4, 5];
  return [2, 3, 4, 5];
}

function buildAdditionCandidate(level) {
  const mixedPool = getMixedLevelPool(level);
  const chosenLevel = mixedPool[randomInt(0, mixedPool.length - 1)];
  const templates = buildMixedTemplate(chosenLevel);
  const pattern = templates[randomInt(0, templates.length - 1)];

  return {
    operator: "+",
    left: randomInt(pattern.first[0], pattern.first[1]),
    right: randomInt(pattern.second[0], pattern.second[1]),
    get result() {
      return this.left + this.right;
    },
    get prompt() {
      return `${this.left} + ${this.right} = ?`;
    },
    get answerValue() {
      return this.left + this.right;
    },
    get key() {
      return `add:${chosenLevel}:${this.left}+${this.right}`;
    }
  };
}

function buildSubtractionCandidate(level) {
  const subtractLevel = getEffectiveModeLevel("subtract", level, -1);
  let topMin = 8;
  let topMax = 16;
  let subtractMin = 1;
  let subtractMax = 6;

  if (subtractLevel === 2) {
    topMin = 10;
    topMax = 20;
    subtractMin = 1;
    subtractMax = 9;
  } else if (subtractLevel === 3) {
    topMin = 14;
    topMax = 28;
    subtractMin = 3;
    subtractMax = 12;
  } else if (subtractLevel === 4) {
    topMin = 20;
    topMax = 38;
    subtractMin = 5;
    subtractMax = 16;
  } else if (subtractLevel >= 5) {
    topMin = 26;
    topMax = 54;
    subtractMin = 7;
    subtractMax = 22;
  }

  const left = randomInt(topMin, topMax);
  const right = randomInt(subtractMin, Math.min(subtractMax, left - 1));
  return {
    operator: "-",
    left,
    right,
    result: left - right,
    prompt: `${left} - ${right} = ?`,
    answerValue: left - right,
    key: `sub:${subtractLevel}:${left}-${right}`
  };
}

function buildMissingNumberCandidate(level) {
  const missingLevel = getEffectiveModeLevel("mixed", level, -1);
  const addition = buildAdditionCandidate(missingLevel);
  return {
    operator: "+",
    left: addition.left,
    right: addition.right,
    result: addition.result,
    prompt: `${addition.left} + ? = ${addition.result}`,
    answerValue: addition.right,
    key: `missing:${addition.left}+?=${addition.result}`
  };
}

function buildMixedCandidate(level) {
  const mixedLevel = getEffectiveModeLevel("mixed", level, -1);
  const roll = Math.random();

  if (roll < 0.3) {
    return buildAdditionCandidate(mixedLevel);
  }

  if (roll < 0.55) {
    return buildSubtractionCandidate(mixedLevel);
  }

  if (roll < 0.7) {
    return buildMissingNumberCandidate(mixedLevel);
  }

  if (roll < 0.8) {
    return buildCandidate("doubles", Math.max(1, Math.min(mixedLevel, 4)));
  }

  if (roll < 0.9) {
    return buildCandidate("make10", Math.max(1, Math.min(mixedLevel, 4)));
  }

  return buildCandidate("multiply", Math.max(1, Math.min(mixedLevel, 3)));
}

function buildAdditionModeCandidate(level) {
  const addLevel = getEffectiveModeLevel("add", level);
  const roll = Math.random();

  if (roll < 0.45) {
    return buildAdditionCandidate(addLevel);
  }

  if (roll < 0.65) {
    return buildCandidate("doubles", Math.max(1, Math.min(addLevel, 4)));
  }

  if (roll < 0.82) {
    return buildCandidate("make10", Math.max(1, Math.min(addLevel, 4)));
  }

  return buildCandidate("big", Math.max(1, addLevel));
}

function buildCandidate(mode, level) {
  if (mode === "multiply") {
    const multiplyLevel = Math.max(1, Math.min(4, getEffectiveModeLevel("multiply", level, -1)));
    const first = randomInt(2, Math.min(6, 2 + multiplyLevel));
    const missing = randomInt(1, Math.min(8, 3 + multiplyLevel));
    return {
      operator: "×",
      left: first,
      right: missing,
      result: first * missing,
      prompt: `${first} × ? = ${first * missing}`,
      answerValue: missing,
      key: `multiply:${first}x?=${first * missing}`
    };
  }

  if (mode === "bonus") {
    const bonusLevel = getEffectiveModeLevel("bonus", level, 1);
    if (Math.random() < 0.4) {
      return buildCandidate("multiply", Math.max(1, bonusLevel - 1));
    }

    const bonusMode = ["mixed", "add", "subtract"][randomInt(0, 2)];
    return buildCandidate(bonusMode, bonusLevel);
  }

  if (mode === "add") {
    return buildAdditionModeCandidate(level);
  }

  if (mode === "subtract") {
    return buildSubtractionCandidate(level);
  }

  if (mode === "doubles") {
    const min = level <= 1 ? 3 : 6 + level * 3;
    const max = level <= 2 ? 16 + level * 6 : 28 + level * 8;
    const value = randomInt(min, max);
    return {
      operator: "+",
      left: value,
      right: value,
      result: value + value,
      prompt: `${value} + ${value} = ?`,
      answerValue: value + value,
      key: `doubles:${value}+${value}`
    };
  }

  if (mode === "make10") {
    const anchor = level <= 2 ? randomInt(10, 20) : randomInt(12, 40);
    const first = randomInt(Math.max(3, anchor - 9), anchor - 1);
    const second = anchor - first + (level >= 4 ? randomInt(0, 6) : 0);
    const safeSecond = Math.max(1, second);
    return {
      operator: "+",
      left: first,
      right: safeSecond,
      result: first + safeSecond,
      prompt: `${first} + ${safeSecond} = ?`,
      answerValue: first + safeSecond,
      key: `make10:${first}+${safeSecond}`
    };
  }

  if (mode === "big") {
    const first = randomInt(20 + level * 8, 36 + level * 12);
    const second = randomInt(14 + level * 6, 28 + level * 10);
    return {
      operator: "+",
      left: first,
      right: second,
      result: first + second,
      prompt: `${first} + ${second} = ?`,
      answerValue: first + second,
      key: `big:${first}+${second}`
    };
  }

  return buildMixedCandidate(level);
}

function buildProblem() {
  const level = getMathLevel();

  for (let attempts = 0; attempts < 60; attempts += 1) {
    const candidate = buildCandidate(currentMode, level);
    const key = candidate.key;

    if (recentProblemKeys.includes(key)) {
      continue;
    }

    const answer = candidate.answerValue;
    const spread = Math.min(18, Math.max(5, Math.round(answer * 0.16)));
    const wrongAnswers = new Set();

    while (wrongAnswers.size < 3) {
      const offset = randomInt(-spread, spread) || randomInt(2, 5);
      const guess = answer + offset;
      if (guess > 0 && guess !== answer) {
        wrongAnswers.add(guess);
      }
    }

    const options = [...wrongAnswers, answer]
      .sort(() => Math.random() - 0.5)
      .map(String);

    rememberProblem(key);

    return {
      left: candidate.left,
      right: candidate.right,
      operator: candidate.operator,
      prompt: candidate.prompt,
      result: candidate.result,
      answer: String(answer),
      options
    };
  }

  recentProblemKeys = [];
  return buildProblem();
}

function getSpeedPraise(elapsedMs) {
  if (elapsedMs <= 2400) return "Lightning Fast";
  if (elapsedMs <= 4200) return "Quick Solve";
  if (elapsedMs <= 6500) return "Sharp Thinking";
  return "Steady";
}

function renderRewards() {
  mathRewardGrid.innerHTML = "";

  rewardItems.forEach((reward) => {
    const card = document.createElement("article");
    card.className = "math-reward-card";
    const earnedToday = progress.dailyCorrect >= reward.threshold;
    if (earnedToday) {
      card.classList.add("is-earned");
    }

    const isOlympusStar = reward.name === "Olympus Star";
    const iconMarkup =
      isOlympusStar
        ? `<a class="math-reward-icon math-reward-secret" href="./secret-challenge.html" aria-label="Olympus Star" title="Olympus Star">${reward.icon}</a>`
        : `<div class="math-reward-icon">${reward.icon}</div>`;

    card.innerHTML = `
      ${iconMarkup}
      <h3>${reward.name}</h3>
      <p>${earnedToday ? "Earned today" : `Unlock at ${reward.threshold} right today`}</p>
    `;
    mathRewardGrid.appendChild(card);
  });
}

function renderAvatar() {
  const badge = getCurrentBadge();
  mathAvatarFigure.textContent = badge.icon;
  mathAvatarTitle.textContent = badge.title;
  mathAvatarCopy.textContent = badge.copy;
  mathBadgeCard.textContent = badge.name;
}

function renderModeButtons() {
  mathModeButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.mode === currentMode);
  });
  mathModeTitle.textContent = modeTitles[currentMode];
  mathModeCopy.textContent = modeDescriptions[currentMode];
}

function showLightningCelebration() {
  mathStormFlash.classList.remove("is-active");
  window.requestAnimationFrame(() => {
    mathStormFlash.classList.add("is-active");
  });

  window.setTimeout(() => {
    mathStormFlash.classList.remove("is-active");
  }, 900);

  mathFeedback.innerHTML = `
    <span class="lightning-inline">⚡</span>
    Lightning blast. Miles reached ${progress.totalCorrect} total correct answers.
  `;
  mathFeedback.classList.add("is-correct", "math-celebrate");
}

function showChestCelebration(secretTier) {
  mathChestTitle.textContent = `Secret Maze Level ${secretTier} Unlocked`;
  mathChestCopy.textContent = "A new hedge maze challenge is ready for today.";
  mathChestFlash.classList.remove("is-active");

  window.requestAnimationFrame(() => {
    mathChestFlash.classList.add("is-active");
  });

  window.setTimeout(() => {
    mathChestFlash.classList.remove("is-active");
  }, 2200);

  mathSecretAction.hidden = false;
}

function renderProgress() {
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  mathTotalCorrect.textContent = String(progress.totalCorrect);
  mathStreak.textContent = String(progress.currentStreak);
  mathTotalCard.textContent = String(progress.totalCorrect);
  mathSessionCard.textContent = String(sessionCorrect);
  mathBestCard.textContent = String(progress.bestStreak);
  mathAccuracyCard.textContent = `${accuracy}%`;
  mathLevelCard.textContent = String(getMathLevel());
  mathTodayCard.textContent = String(progress.dailyCorrect);

  renderAvatar();
  renderRewards();
  renderModeButtons();
  setStormTier();

  if (progress.dailyCorrect >= MILESTONE_FORTY) {
    mathBoltStage.classList.add("is-unlocked");
    mathBoltStage.classList.remove("is-charged");
    mathStatusTitle.textContent = "Lightning master";
    mathStatusCopy.textContent = `Math level ${getMathLevel()} is active. Secret maze progress is based on today's total.`;
    mathSecretAction.hidden = !hasAvailableSecretChallenge();
  } else if (progress.totalCorrect >= MILESTONE_TEN) {
    mathBoltStage.classList.add("is-charged");
    mathBoltStage.classList.remove("is-unlocked");
    mathStatusTitle.textContent = "Bolt charged";
    mathStatusCopy.textContent = `Math level ${getMathLevel()} is active.`;
    mathSecretAction.hidden = true;
  } else {
    mathBoltStage.classList.remove("is-unlocked", "is-charged");
    mathStatusTitle.textContent = "Spark level";
    mathStatusCopy.textContent = `Math level ${getMathLevel()} is active.`;
    mathSecretAction.hidden = true;
  }
}

function renderProblem() {
  currentProblem = buildProblem();
  answered = false;
  questionStartedAt = performance.now();
  mathProblem.textContent = currentProblem.prompt;
  mathSubtext.textContent = `Pick the right answer. ${modeDescriptions[currentMode]} Level ${getMathLevel()}.`;
  mathFeedback.textContent =
    currentMode === "multiply"
      ? "A new multiplication mystery appears every round."
      : "A new math question appears every round.";
  mathFeedback.classList.remove("is-correct", "is-wrong", "math-celebrate");
  mathNext.disabled = true;
  mathOptions.innerHTML = "";

  currentProblem.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;

    button.addEventListener("click", () => {
      if (answered) {
        return;
      }

      answered = true;
      const elapsedMs = performance.now() - questionStartedAt;
      const speedPraise = getSpeedPraise(elapsedMs);
      const correct = option === currentProblem.answer;
      const previousSecretTier = getUnlockedSecretTier();

      progress.totalAnswered += 1;
      progress.dailyAnswered += 1;

      if (correct) {
        progress.totalCorrect += 1;
        progress.dailyCorrect += 1;
        progress.dailyModeCorrect[currentMode] = (progress.dailyModeCorrect[currentMode] || 0) + 1;
        progress.currentStreak += 1;
        progress.bestStreak = Math.max(progress.bestStreak, progress.currentStreak);
        sessionCorrect += 1;
        mathSpeedCard.textContent = speedPraise;
      } else {
        progress.currentStreak = 0;
        mathSpeedCard.textContent = "Steady";
      }

      const newSecretTier = getUnlockedSecretTier();
      if (newSecretTier > previousSecretTier && newSecretTier > progress.highestCelebratedTier) {
        progress.highestCelebratedTier = newSecretTier;
        showChestCelebration(newSecretTier);
      }

      recordMathAnswer({
        mode: currentMode,
        correct,
        streak: progress.currentStreak
      });

      saveProgress();
      renderProgress();

      mathOptions.querySelectorAll(".quiz-option").forEach((choice) => {
        choice.disabled = true;
        if (choice.textContent === currentProblem.answer) {
          choice.classList.add("is-correct");
        } else if (choice.textContent === option) {
          choice.classList.add("is-wrong");
        }
      });

      if (correct && progress.totalCorrect % MILESTONE_TEN === 0) {
        showLightningCelebration();
      } else {
        mathFeedback.textContent = correct
          ? `${speedPraise}. ${currentProblem.prompt.replace("?", currentProblem.answer)}.`
          : `Nice try. ${currentProblem.prompt.replace("?", currentProblem.answer)}.`;
        mathFeedback.classList.toggle("is-correct", correct);
        mathFeedback.classList.toggle("is-wrong", !correct);
      }

      mathNext.disabled = false;
    });

    mathOptions.appendChild(button);
  });
}

mathModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.mode;
    recentProblemKeys = [];
    renderModeButtons();
    renderProblem();
  });
});

mathNext.addEventListener("click", () => {
  renderProblem();
});

mathRewardGrid.addEventListener("click", (event) => {
  const starIcon = event.target.closest(".math-reward-secret");
  if (!starIcon) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  window.localStorage.setItem(EASTER_EGG_KEY, "true");
  window.location.href = "./secret-challenge.html";
});

mathReset.addEventListener("click", () => {
  mathResetConfirm.hidden = false;
});

mathResetYes.addEventListener("click", () => {
  sessionCorrect = 0;
  progress.currentStreak = 0;
  recentProblemKeys = [];
  mathSpeedCard.textContent = "Steady";
  saveProgress();
  renderProgress();
  renderProblem();
  mathResetConfirm.hidden = true;
});

mathResetNo.addEventListener("click", () => {
  mathResetConfirm.hidden = true;
});

renderProgress();
renderProblem();
scheduleMidnightReset();
