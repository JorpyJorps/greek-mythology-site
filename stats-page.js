import {
  getFavoriteWordSearchCategory,
  getMathModeSummary,
  getMostCommonQuestEnding,
  getMostMissedQuestions,
  getMostPickedQuestHero,
  getTopEntries,
  getTriviaCategorySummary,
  loadSiteStats
} from "./stats.js";
import { getEntryById } from "./data.js";

const stats = loadSiteStats();

function titleize(value = "") {
  return value
    .split(/[-\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function entryName(id) {
  return getEntryById(id)?.name || titleize(id);
}

function renderList(targetId, items, formatter, emptyText = "Nothing yet.") {
  const target = document.querySelector(targetId);
  if (!target) return;

  if (!items.length) {
    target.innerHTML = `<li>${emptyText}</li>`;
    return;
  }

  target.innerHTML = items.map((item) => `<li>${formatter(item)}</li>`).join("");
}

function setText(targetId, text) {
  const target = document.querySelector(targetId);
  if (target) target.textContent = text;
}

const triviaSummary = getTriviaCategorySummary(stats);
const mathSummary = getMathModeSummary(stats);
const topHeroWinners = getTopEntries(stats.battle.heroWins, 5);
const topMonsterWinners = getTopEntries(stats.battle.monsterWins, 5);
const missedQuestions = getMostMissedQuestions(stats, 5);
const favoriteWordSearchCategory = getFavoriteWordSearchCategory(stats);
const mostPickedHero = getMostPickedQuestHero(stats);
const mostCommonEnding = getMostCommonQuestEnding(stats);

setText("#stats-trivia-total", `${stats.trivia.totalRight} right / ${stats.trivia.totalWrong} wrong`);
setText(
  "#stats-trivia-strongest",
  triviaSummary.strongest ? `${titleize(triviaSummary.strongest.category)} • ${triviaSummary.strongest.percent}%` : "Not enough data"
);
setText(
  "#stats-trivia-weakest",
  triviaSummary.weakest ? `${titleize(triviaSummary.weakest.category)} • ${triviaSummary.weakest.percent}%` : "Not enough data"
);
renderList(
  "#stats-missed-questions",
  missedQuestions,
  ([question, count]) => `${question} <span>${count} missed</span>`
);

setText("#stats-math-total", `${stats.math.totalCorrect} correct out of ${stats.math.totalAnswered}`);
setText("#stats-math-best-streak", String(stats.math.bestStreak));
setText(
  "#stats-math-hardest",
  mathSummary.hardest ? `${titleize(mathSummary.hardest.mode)} • ${mathSummary.hardest.percent}%` : "Not enough data"
);
renderList(
  "#stats-math-modes",
  mathSummary.summaries,
  (item) => `${titleize(item.mode)} <span>${item.percent}% right</span>`
);

setText("#stats-quest-total", String(stats.quest.totalCompleted));
setText("#stats-quest-legend", String(stats.quest.legendPaths));
setText(
  "#stats-quest-hero",
  mostPickedHero ? `${entryName(mostPickedHero[0])} • ${mostPickedHero[1]} picks` : "Not enough data"
);
setText(
  "#stats-quest-ending",
  mostCommonEnding ? `${titleize(mostCommonEnding[0])} • ${mostCommonEnding[1]} times` : "Not enough data"
);

renderList(
  "#stats-battle-heroes",
  topHeroWinners,
  ([id, count]) => `${entryName(id)} <span>${count} wins</span>`
);
renderList(
  "#stats-battle-monsters",
  topMonsterWinners,
  ([id, count]) => `${entryName(id)} <span>${count} wins</span>`
);

setText("#stats-wordsearch-total", String(stats.wordSearch.puzzlesCompleted));
setText("#stats-wordsearch-words", String(stats.wordSearch.totalWordsFound));
setText(
  "#stats-wordsearch-favorite",
  favoriteWordSearchCategory
    ? `${titleize(favoriteWordSearchCategory[0])} • ${favoriteWordSearchCategory[1]} clears`
    : "Not enough data"
);

setText("#stats-memory-total", String(stats.memory.gamesCompleted));
setText("#stats-memory-normal", String(stats.memory.normalClears));
setText("#stats-memory-hard", String(stats.memory.hardClears));
