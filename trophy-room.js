import { loadSiteStats } from "./stats.js";

const MATH_KEY = "miles-math-progress";
const trophyGrid = document.querySelector("#trophy-grid");

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

function loadMathProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(MATH_KEY) || "{}");
  } catch {
    return {};
  }
}

function addCard(title, copy, kicker = "Trophy") {
  const card = document.createElement("article");
  card.className = "story-card";
  card.innerHTML = `
    <p class="card-kicker">${kicker}</p>
    <h3>${title}</h3>
    <p>${copy}</p>
  `;
  trophyGrid.appendChild(card);
}

const stats = loadSiteStats();
const mathProgress = loadMathProgress();
const totalCorrect = mathProgress.totalCorrect || 0;
const bestStreak = mathProgress.bestStreak || 0;
const minotaurWins = mathProgress.minotaurWins || 0;
const secretAchievementCount = Math.floor(minotaurWins / 5);

rewardItems
  .filter((reward) => totalCorrect >= reward.threshold)
  .forEach((reward) => {
    addCard(`${reward.icon} ${reward.name}`, `Unlocked by reaching ${reward.threshold} total correct answers in Math Quest.`, "Math Reward");
  });

if (bestStreak >= 20) {
  addCard("Storm Starter", `Best math streak: ${bestStreak}.`, "Streak");
}

if (stats.quest.legendPaths > 0) {
  addCard("Legend Path Finder", `${stats.quest.legendPaths} myth-true quest ending${stats.quest.legendPaths === 1 ? "" : "s"} found.`, "Quest");
}

if (stats.memory.gamesCompleted > 0) {
  addCard("Memory Master", `${stats.memory.gamesCompleted} memory board${stats.memory.gamesCompleted === 1 ? "" : "s"} cleared.`, "Games");
}

if (stats.wordSearch.puzzlesCompleted > 0) {
  addCard("Word Hunter", `${stats.wordSearch.puzzlesCompleted} word search puzzle${stats.wordSearch.puzzlesCompleted === 1 ? "" : "s"} completed.`, "Games");
}

if (secretAchievementCount > 0) {
  addCard(
    "Secret Minotaur Buster",
    `Unlocked ${secretAchievementCount} time${secretAchievementCount === 1 ? "" : "s"} by beating the Minotaur maze every 5 wins. Total maze wins: ${minotaurWins}.`,
    "Secret"
  );
}

if (!trophyGrid.children.length) {
  addCard("No trophies yet", "Keep playing games, reading quests, and doing math to fill the room.", "Start Here");
}
