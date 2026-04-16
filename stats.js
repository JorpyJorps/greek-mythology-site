const STATS_KEY = "miles-site-stats";

const triviaCategories = ["gods", "heroes", "monsters", "places"];
const mathModes = ["mixed", "add", "subtract", "multiply", "bonus"];
const questEndingTypes = ["legend", "win", "close", "twist", "fail"];
const wordSearchCategories = ["mixed", "gods", "heroes", "monsters"];

function buildCounts(keys) {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

function createDefaultStats() {
  return {
    trivia: {
      totalRight: 0,
      totalWrong: 0,
      missedQuestions: {},
      categoryStats: Object.fromEntries(
        triviaCategories.map((category) => [category, { right: 0, wrong: 0 }])
      )
    },
    math: {
      totalAnswered: 0,
      totalCorrect: 0,
      modeStats: Object.fromEntries(
        mathModes.map((mode) => [mode, { answered: 0, correct: 0 }])
      ),
      bestStreak: 0
    },
    quest: {
      totalCompleted: 0,
      legendPaths: 0,
      heroPicks: {},
      endingCounts: buildCounts(questEndingTypes)
    },
    battle: {
      heroWins: {},
      monsterWins: {}
    },
    wordSearch: {
      puzzlesCompleted: 0,
      totalWordsFound: 0,
      categoryCounts: buildCounts(wordSearchCategories)
    },
    memory: {
      gamesCompleted: 0,
      normalClears: 0,
      hardClears: 0
    }
  };
}

function withDefaults(parsed = {}) {
  const defaults = createDefaultStats();
  return {
    trivia: {
      totalRight: parsed.trivia?.totalRight || 0,
      totalWrong: parsed.trivia?.totalWrong || 0,
      missedQuestions: parsed.trivia?.missedQuestions || {},
      categoryStats: {
        ...defaults.trivia.categoryStats,
        ...parsed.trivia?.categoryStats
      }
    },
    math: {
      totalAnswered: parsed.math?.totalAnswered || 0,
      totalCorrect: parsed.math?.totalCorrect || 0,
      bestStreak: parsed.math?.bestStreak || 0,
      modeStats: {
        ...defaults.math.modeStats,
        ...parsed.math?.modeStats
      }
    },
    quest: {
      totalCompleted: parsed.quest?.totalCompleted || 0,
      legendPaths: parsed.quest?.legendPaths || 0,
      heroPicks: parsed.quest?.heroPicks || {},
      endingCounts: {
        ...defaults.quest.endingCounts,
        ...parsed.quest?.endingCounts
      }
    },
    battle: {
      heroWins: parsed.battle?.heroWins || {},
      monsterWins: parsed.battle?.monsterWins || {}
    },
    wordSearch: {
      puzzlesCompleted: parsed.wordSearch?.puzzlesCompleted || 0,
      totalWordsFound: parsed.wordSearch?.totalWordsFound || 0,
      categoryCounts: {
        ...defaults.wordSearch.categoryCounts,
        ...parsed.wordSearch?.categoryCounts
      }
    },
    memory: {
      gamesCompleted: parsed.memory?.gamesCompleted || 0,
      normalClears: parsed.memory?.normalClears || 0,
      hardClears: parsed.memory?.hardClears || 0
    }
  };
}

export function loadSiteStats() {
  const saved = window.localStorage.getItem(STATS_KEY);
  if (!saved) return createDefaultStats();

  try {
    return withDefaults(JSON.parse(saved));
  } catch {
    return createDefaultStats();
  }
}

export function saveSiteStats(stats) {
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateSiteStats(updater) {
  const nextStats = updater(loadSiteStats());
  saveSiteStats(nextStats);
  return nextStats;
}

export function recordTriviaAnswer({ question, correct, category }) {
  updateSiteStats((stats) => {
    if (correct) {
      stats.trivia.totalRight += 1;
    } else {
      stats.trivia.totalWrong += 1;
      stats.trivia.missedQuestions[question] = (stats.trivia.missedQuestions[question] || 0) + 1;
    }

    if (stats.trivia.categoryStats[category]) {
      if (correct) {
        stats.trivia.categoryStats[category].right += 1;
      } else {
        stats.trivia.categoryStats[category].wrong += 1;
      }
    }

    return stats;
  });
}

export function recordMathAnswer({ mode, correct, streak }) {
  updateSiteStats((stats) => {
    stats.math.totalAnswered += 1;
    if (correct) stats.math.totalCorrect += 1;

    if (stats.math.modeStats[mode]) {
      stats.math.modeStats[mode].answered += 1;
      if (correct) {
        stats.math.modeStats[mode].correct += 1;
      }
    }

    stats.math.bestStreak = Math.max(stats.math.bestStreak, streak || 0);
    return stats;
  });
}

export function recordQuestEnding({ hero, result, mythTrue }) {
  updateSiteStats((stats) => {
    stats.quest.totalCompleted += 1;
    stats.quest.heroPicks[hero] = (stats.quest.heroPicks[hero] || 0) + 1;
    if (mythTrue) {
      stats.quest.legendPaths += 1;
    }

    const endingKey = mythTrue ? "legend" : result;
    if (stats.quest.endingCounts[endingKey] !== undefined) {
      stats.quest.endingCounts[endingKey] += 1;
    }

    return stats;
  });
}

export function recordBattleResult({ winnerType, winnerId }) {
  updateSiteStats((stats) => {
    if (winnerType === "hero") {
      stats.battle.heroWins[winnerId] = (stats.battle.heroWins[winnerId] || 0) + 1;
    } else {
      stats.battle.monsterWins[winnerId] = (stats.battle.monsterWins[winnerId] || 0) + 1;
    }

    return stats;
  });
}

export function recordWordSearchFound() {
  updateSiteStats((stats) => {
    stats.wordSearch.totalWordsFound += 1;
    return stats;
  });
}

export function recordWordSearchComplete({ category }) {
  updateSiteStats((stats) => {
    stats.wordSearch.puzzlesCompleted += 1;
    if (stats.wordSearch.categoryCounts[category] !== undefined) {
      stats.wordSearch.categoryCounts[category] += 1;
    }
    return stats;
  });
}

export function recordMemoryComplete({ level }) {
  updateSiteStats((stats) => {
    stats.memory.gamesCompleted += 1;
    if (level === "hard") {
      stats.memory.hardClears += 1;
    } else {
      stats.memory.normalClears += 1;
    }
    return stats;
  });
}

function toSortedEntries(record = {}) {
  return Object.entries(record).sort((left, right) => right[1] - left[1]);
}

export function getTopEntries(record, limit = 3) {
  return toSortedEntries(record).slice(0, limit);
}

export function getMostMissedQuestions(stats, limit = 5) {
  return getTopEntries(stats.trivia.missedQuestions, limit);
}

export function getTriviaCategorySummary(stats) {
  const summaries = triviaCategories
    .map((category) => {
      const right = stats.trivia.categoryStats[category]?.right || 0;
      const wrong = stats.trivia.categoryStats[category]?.wrong || 0;
      const total = right + wrong;
      return {
        category,
        total,
        percent: total ? Math.round((right / total) * 100) : null
      };
    })
    .filter((item) => item.total > 0);

  return {
    strongest: [...summaries].sort((a, b) => (b.percent || 0) - (a.percent || 0))[0] || null,
    weakest: [...summaries].sort((a, b) => (a.percent || 0) - (b.percent || 0))[0] || null
  };
}

export function getMathModeSummary(stats) {
  const summaries = mathModes
    .map((mode) => {
      const answered = stats.math.modeStats[mode]?.answered || 0;
      const correct = stats.math.modeStats[mode]?.correct || 0;
      return {
        mode,
        answered,
        percent: answered ? Math.round((correct / answered) * 100) : null
      };
    })
    .filter((item) => item.answered > 0);

  return {
    hardest: [...summaries].sort((a, b) => (a.percent || 0) - (b.percent || 0))[0] || null,
    summaries
  };
}

export function getMostPickedQuestHero(stats) {
  return getTopEntries(stats.quest.heroPicks, 1)[0] || null;
}

export function getMostCommonQuestEnding(stats) {
  return getTopEntries(stats.quest.endingCounts, 1)[0] || null;
}

export function getFavoriteWordSearchCategory(stats) {
  return getTopEntries(stats.wordSearch.categoryCounts, 1)[0] || null;
}
