import { entries, triviaLevels, getEntryById, getMonsterProfile } from "./data.js";
import {
  recordBattleResult,
  recordMemoryComplete,
  recordTriviaAnswer,
  recordWordSearchComplete,
  recordWordSearchFound
} from "./stats.js";

const QUESTIONS_PER_ROUND = 10;

const quizCard = document.querySelector("#quiz-card");
const levelButtons = document.querySelectorAll("[data-level]");
const categoryButtons = document.querySelectorAll("[data-category]");
const battleHero = document.querySelector("#battle-hero");
const battleMonster = document.querySelector("#battle-monster");
const battleRun = document.querySelector("#battle-run");
const battleRandom = document.querySelector("#battle-random");
const battleResult = document.querySelector("#battle-result");
const memoryGrid = document.querySelector("#memory-grid");
const memoryReset = document.querySelector("#memory-reset");
const memoryStatus = document.querySelector("#memory-status");
const memoryLevelButtons = document.querySelectorAll("[data-memory-level]");
const memoryStormFlash = document.querySelector("#memory-storm-flash");
const wordSearchGrid = document.querySelector("#wordsearch-grid");
const wordSearchList = document.querySelector("#wordsearch-list");
const wordSearchStatus = document.querySelector("#wordsearch-status");
const wordSearchReset = document.querySelector("#wordsearch-reset");
const wordSearchCategoryButtons = document.querySelectorAll("[data-wordsearch-category]");

let currentLevel = "level1";
let currentCategory = "all";
let activeQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let questionLocked = false;
let memoryCards = [];
let memoryRevealed = [];
let memoryLocked = false;
let memoryMatchedPairs = 0;
let currentMemoryLevel = "normal";
let currentWordSearchCategory = "mixed";
let currentWordSearch = null;
let wordSearchFound = new Set();
let wordSearchDrag = null;

const WORDSEARCH_SIZE = 12;
const WORDSEARCH_WORDS = 6;

const wordSearchPools = {
  mixed: ["ZEUS", "ATHENA", "POSEIDON", "HADES", "APOLLO", "HERA", "PERSEUS", "THESEUS", "HYDRA", "MEDUSA", "CYCLOPS", "MINOTAUR"],
  gods: ["ZEUS", "ATHENA", "POSEIDON", "HADES", "APOLLO", "HERA", "HESTIA", "DEMETER", "ARTEMIS", "HERMES"],
  heroes: ["PERSEUS", "THESEUS", "ODYSSEUS", "HERACLES", "JASON", "ACHILLES", "ATALANTA", "BELLEROPHON"],
  monsters: ["HYDRA", "MEDUSA", "CYCLOPS", "MINOTAUR", "CERBERUS", "CHIMERA", "SPHINX", "SIRENS"]
};

const memoryDecks = {
  normal: ["zeus", "athena", "poseidon", "hercules", "medusa", "minotaur", "perseus", "theseus"],
  hard: [
    "zeus",
    "athena",
    "poseidon",
    "hercules",
    "medusa",
    "minotaur",
    "perseus",
    "theseus",
    "hades",
    "apollo",
    "artemis",
    "hydra"
  ]
};

const memoryVisuals = {
  zeus: { icon: "⚡", color: "#6a4314" },
  athena: { icon: "🦉", color: "#5d4a1c" },
  poseidon: { icon: "🔱", color: "#124864" },
  hercules: { icon: "🦁", color: "#6a3515" },
  medusa: { icon: "🐍", color: "#2f5a2c" },
  minotaur: { icon: "🐂", color: "#5b2b1f" },
  perseus: { icon: "🛡️", color: "#55586a" },
  theseus: { icon: "🧵", color: "#7a2d2d" },
  hades: { icon: "👑", color: "#2d2238" },
  apollo: { icon: "☀️", color: "#6a4d14" },
  artemis: { icon: "🏹", color: "#355032" },
  hydra: { icon: "🐉", color: "#30573d" }
};

function triggerMemoryFlash() {
  if (!memoryStormFlash) return;

  memoryStormFlash.classList.remove("is-active");
  window.requestAnimationFrame(() => {
    memoryStormFlash.classList.add("is-active");
  });

  window.setTimeout(() => {
    memoryStormFlash.classList.remove("is-active");
  }, 950);
}

function playWordSearchChime(type = "word") {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.type = "triangle";
  oscillator.frequency.value = type === "win" ? 720 : 560;
  gain.gain.value = 0.035;

  oscillator.start();
  oscillator.frequency.setValueAtTime(oscillator.frequency.value, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    type === "win" ? 980 : 720,
    context.currentTime + (type === "win" ? 0.24 : 0.16)
  );
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + (type === "win" ? 0.28 : 0.18));
  oscillator.stop(context.currentTime + (type === "win" ? 0.3 : 0.2));
}

function createEmptyWordSearchGrid(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
}

function canPlaceWord(grid, word, row, col, rowStep, colStep) {
  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + rowStep * index;
    const nextCol = col + colStep * index;
    if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid.length) {
      return false;
    }
    const current = grid[nextRow][nextCol];
    if (current && current !== word[index]) {
      return false;
    }
  }
  return true;
}

function placeWord(grid, word) {
  const directions = shuffle([
    [0, 1],
    [1, 0],
    [1, 1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [1, -1],
    [-1, 1]
  ]);

  for (const [rowStep, colStep] of directions) {
    for (let tries = 0; tries < 80; tries += 1) {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid.length);
      if (!canPlaceWord(grid, word, row, col, rowStep, colStep)) continue;
      for (let index = 0; index < word.length; index += 1) {
        const nextRow = row + rowStep * index;
        const nextCol = col + colStep * index;
        grid[nextRow][nextCol] = word[index];
      }
      return {
        word,
        cells: Array.from({ length: word.length }, (_, index) => ({
          row: row + rowStep * index,
          col: col + colStep * index
        }))
      };
    }
  }

  return null;
}

function fillWordSearchGrid(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return grid.map((row) =>
    row.map((cell) => (cell ? cell : alphabet[Math.floor(Math.random() * alphabet.length)]))
  );
}

function getSelectionCells(start, end) {
  if (!start || !end) return [];

  const rowDelta = end.row - start.row;
  const colDelta = end.col - start.col;
  const rowStep = rowDelta === 0 ? 0 : rowDelta / Math.abs(rowDelta);
  const colStep = colDelta === 0 ? 0 : colDelta / Math.abs(colDelta);

  const straight =
    rowDelta === 0 ||
    colDelta === 0 ||
    Math.abs(rowDelta) === Math.abs(colDelta);

  if (!straight) return [];

  const length = Math.max(Math.abs(rowDelta), Math.abs(colDelta)) + 1;
  return Array.from({ length }, (_, index) => ({
    row: start.row + rowStep * index,
    col: start.col + colStep * index
  }));
}

function updateWordSearchCellStates() {
  if (!currentWordSearch) return;

  const selectedCells = wordSearchDrag ? getSelectionCells(wordSearchDrag.start, wordSearchDrag.end) : [];
  const selectedKeys = new Set(selectedCells.map((cell) => `${cell.row}-${cell.col}`));
  const foundKeys = new Set(
    currentWordSearch.placements
      .filter((placement) => wordSearchFound.has(placement.word))
      .flatMap((placement) => placement.cells.map((cell) => `${cell.row}-${cell.col}`))
  );

  wordSearchGrid.querySelectorAll(".wordsearch-cell").forEach((cell) => {
    const key = `${cell.dataset.row}-${cell.dataset.col}`;
    cell.classList.toggle("is-selected", selectedKeys.has(key));
    cell.classList.toggle("is-found", foundKeys.has(key));
  });
}

function renderWordSearchList() {
  if (!currentWordSearch) return;
  wordSearchList.innerHTML = currentWordSearch.words
    .map(
      (word) =>
        `<span class="wordsearch-word${wordSearchFound.has(word) ? " is-found" : ""}">${word}</span>`
    )
    .join("");
}

function finalizeWordSearchDrag() {
  if (!currentWordSearch || !wordSearchDrag) return;

  const selectedCells = getSelectionCells(wordSearchDrag.start, wordSearchDrag.end);
  const selectedKey = selectedCells.map((cell) => `${cell.row}-${cell.col}`).join("|");
  const reverseKey = [...selectedCells]
    .reverse()
    .map((cell) => `${cell.row}-${cell.col}`)
    .join("|");

  const matchedPlacement = currentWordSearch.placements.find((placement) => {
    if (wordSearchFound.has(placement.word)) return false;
    const placementKey = placement.cells.map((cell) => `${cell.row}-${cell.col}`).join("|");
    return placementKey === selectedKey || placementKey === reverseKey;
  });

  if (matchedPlacement) {
    wordSearchFound.add(matchedPlacement.word);
    recordWordSearchFound();
    playWordSearchChime("word");
    renderWordSearchList();
    wordSearchStatus.textContent = `Found: ${matchedPlacement.word}`;
    if (wordSearchFound.size === currentWordSearch.words.length) {
      wordSearchStatus.textContent = "You found every hidden name!";
      recordWordSearchComplete({ category: currentWordSearchCategory });
      playWordSearchChime("win");
      triggerMemoryFlash();
    }
  }

  wordSearchDrag = null;
  updateWordSearchCellStates();
}

function renderWordSearchGrid(grid) {
  wordSearchGrid.innerHTML = "";
  grid.forEach((row, rowIndex) => {
    row.forEach((letter, colIndex) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "wordsearch-cell";
      cell.textContent = letter;
      cell.dataset.row = String(rowIndex);
      cell.dataset.col = String(colIndex);
      cell.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        wordSearchDrag = {
          start: { row: rowIndex, col: colIndex },
          end: { row: rowIndex, col: colIndex }
        };
        updateWordSearchCellStates();
      });
      cell.addEventListener("pointerenter", () => {
        if (!wordSearchDrag) return;
        wordSearchDrag.end = { row: rowIndex, col: colIndex };
        updateWordSearchCellStates();
      });
      wordSearchGrid.appendChild(cell);
    });
  });

  updateWordSearchCellStates();
}

function buildWordSearch() {
  const pool = wordSearchPools[currentWordSearchCategory] || wordSearchPools.mixed;
  const grid = createEmptyWordSearchGrid(WORDSEARCH_SIZE);
  const placements = [];
  for (const word of shuffle(pool)) {
    if (placements.length >= WORDSEARCH_WORDS) break;
    const placement = placeWord(grid, word);
    if (placement) {
      placements.push(placement);
    }
  }

  currentWordSearch = {
    words: placements.map((placement) => placement.word),
    placements,
    grid: fillWordSearchGrid(grid)
  };
  wordSearchFound = new Set();
  wordSearchDrag = null;

  renderWordSearchGrid(currentWordSearch.grid);
  renderWordSearchList();
  wordSearchStatus.textContent = `Find ${currentWordSearch.words.length} hidden names in the ${currentWordSearchCategory} puzzle.`;

  wordSearchCategoryButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.wordsearchCategory === currentWordSearchCategory);
  });
}

const mythBattleRules = {
  hercules: {
    hydra: {
      winner: "hero",
      reason: "Heracles defeated the Hydra as one of his famous labors by using strength and a smart plan."
    },
    cerberus: {
      winner: "hero",
      reason: "Heracles captured Cerberus in one of his twelve labors, so this is a hero win in myth."
    },
    "nemean-lion": {
      winner: "hero",
      reason: "Heracles defeated the Nemean Lion in his first labor and wore its skin after the fight."
    }
  },
  theseus: {
    minotaur: {
      winner: "hero",
      reason: "Theseus killed the Minotaur in the Labyrinth with Ariadne's help and his own courage."
    }
  },
  perseus: {
    medusa: {
      winner: "hero",
      reason: "Perseus defeated Medusa by using a reflective shield, a curved blade, and divine help."
    }
  },
  bellerophon: {
    chimera: {
      winner: "hero",
      reason: "Bellerophon is the mythic slayer of the Chimera, especially when riding Pegasus."
    }
  },
  odysseus: {
    cyclops: {
      winner: "hero",
      reason: "Odysseus escaped the Cyclops with a clever trick, which makes this a brains-over-brute-force win."
    },
    sirens: {
      winner: "hero",
      reason: "Odysseus prepared for the Sirens by blocking his crew's ears and tying himself to the mast."
    },
    scylla: {
      winner: "monster",
      reason: "In myth, Odysseus survives Scylla's waters but does not defeat her in a straight-up fight."
    },
    charybdis: {
      winner: "monster",
      reason: "Odysseus survives Charybdis by escape and timing, not by beating the whirlpool monster in battle."
    }
  },
  jason: {
    harpies: {
      winner: "hero",
      reason: "Jason's Argonaut story is full of teamwork and monster survival, so this matchup leans hero."
    }
  }
};

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function getQuestionCategory(question) {
  const text = `${question.question} ${question.answer}`.toLowerCase();
  if (
    /(zeus|athena|poseidon|apollo|artemis|hades|hermes|hera|demeter|hestia|aphrodite|hephaestus|ares|dionysus|persephone|god|goddess)/.test(
      text
    )
  ) {
    return "gods";
  }
  if (/(hercules|heracles|perseus|theseus|odysseus|achilles|atalanta|jason|bellerophon|hero)/.test(text)) {
    return "heroes";
  }
  if (/(minotaur|hydra|cerberus|cyclops|sphinx|chimera|medusa|siren|monster|lion)/.test(text)) {
    return "monsters";
  }
  if (/(olympus|underworld|labyrinth|athens|crete|lerna|thebes|nemea|place|lived|where)/.test(text)) {
    return "places";
  }
  return "all";
}

function startRound(level) {
  currentLevel = level;
  const baseQuestions = triviaLevels[level];
  const filteredQuestions =
    currentCategory === "all"
      ? baseQuestions
      : baseQuestions.filter((question) => getQuestionCategory(question) === currentCategory);
  const questionPool = filteredQuestions.length > 0 ? filteredQuestions : baseQuestions;
  activeQuestions = shuffle(questionPool).slice(0, Math.min(QUESTIONS_PER_ROUND, questionPool.length));
  currentQuestionIndex = 0;
  score = 0;
  questionLocked = false;

  levelButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.level === level);
  });
  categoryButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.category === currentCategory);
  });

  renderQuizQuestion();
}

function getScoreMessage() {
  const ratio = score / activeQuestions.length;
  if (ratio === 1) return "Lightning legend. Miles conquered every question.";
  if (ratio >= 0.8) return "Epic score. The gods would be impressed.";
  if (ratio >= 0.5) return "Strong run. Another round could push this into hero territory.";
  return "Good start. Time for another quest and a bigger score.";
}

function renderQuizResults() {
  quizCard.innerHTML = `
    <div class="quiz-finale">
      <div class="lightning-wrap" aria-hidden="true">
        <div class="lightning-bolt">⚡</div>
        <div class="lightning-glow"></div>
      </div>
      <p class="card-kicker">${currentLevel === "level1" ? "Level 1 Complete" : "Level 2 Complete"}</p>
      <h3>Final Score: ${score} / ${activeQuestions.length}</h3>
      <p class="quiz-feedback is-correct">${getScoreMessage()}</p>
      <div class="quiz-actions">
        <button class="button button-gold" type="button" id="same-level-round">Play Another Random 10</button>
        <button class="button button-outline" type="button" id="switch-level-round">${currentLevel === "level1" ? "Try Level 2" : "Try Level 1"}</button>
      </div>
    </div>
  `;

  quizCard.querySelector("#same-level-round").addEventListener("click", () => startRound(currentLevel));
  quizCard
    .querySelector("#switch-level-round")
    .addEventListener("click", () => startRound(currentLevel === "level1" ? "level2" : "level1"));
}

function renderQuizQuestion() {
  const question = activeQuestions[currentQuestionIndex];
  if (!question) {
    quizCard.innerHTML = `
      <p class="card-kicker">No questions</p>
      <h3>Try another trivia category</h3>
      <p class="quiz-feedback">That bucket did not have enough questions yet.</p>
    `;
    return;
  }

  const isLastQuestion = currentQuestionIndex === activeQuestions.length - 1;
  questionLocked = false;

  quizCard.innerHTML = `
    <p class="card-kicker">${currentLevel === "level1" ? "Level 1" : "Level 2"} • Question ${currentQuestionIndex + 1} of ${activeQuestions.length}</p>
    <h3>${question.question}</h3>
    <p class="quiz-score">Score: ${score}</p>
    <div class="quiz-options"></div>
    <p class="quiz-feedback" id="quiz-feedback">Pick your best answer.</p>
    <div class="quiz-actions">
      <button class="button button-outline" type="button" id="next-question" disabled>${isLastQuestion ? "Finish Quiz" : "Next Question"}</button>
      <button class="button button-outline" type="button" id="new-round">New Random 10</button>
    </div>
  `;

  const optionsContainer = quizCard.querySelector(".quiz-options");
  const feedback = quizCard.querySelector("#quiz-feedback");
  const nextButton = quizCard.querySelector("#next-question");

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;

    button.addEventListener("click", () => {
      if (questionLocked) return;
      questionLocked = true;
      const correct = option === question.answer;
      if (correct) {
        score += 1;
      }
      recordTriviaAnswer({
        question: question.question,
        correct,
        category: getQuestionCategory(question)
      });

      feedback.textContent = correct
        ? `Correct. ${question.answer} is the right answer.`
        : `Nice try. The correct answer is ${question.answer}.`;
      feedback.classList.toggle("is-correct", correct);
      feedback.classList.toggle("is-wrong", !correct);

      optionsContainer.querySelectorAll(".quiz-option").forEach((optionButton) => {
        const isAnswer = optionButton.textContent === question.answer;
        optionButton.disabled = true;
        optionButton.classList.toggle("is-correct", isAnswer);
        optionButton.classList.toggle("is-wrong", optionButton.textContent === option && option !== question.answer);
      });

      quizCard.querySelector(".quiz-score").textContent = `Score: ${score}`;
      nextButton.disabled = false;
    });

    optionsContainer.appendChild(button);
  });

  nextButton.addEventListener("click", () => {
    if (isLastQuestion) {
      renderQuizResults();
      return;
    }
    currentQuestionIndex += 1;
    renderQuizQuestion();
  });

  quizCard.querySelector("#new-round").addEventListener("click", () => startRound(currentLevel));
}

function renderBattleSelectors() {
  const heroes = entries.filter((entry) => entry.category === "hero");
  const monsters = entries.filter((entry) => entry.category === "monster");

  battleHero.innerHTML = [
    `<option value="">Choose a hero</option>`,
    ...heroes.map((entry) => `<option value="${entry.id}">${entry.name}</option>`)
  ].join("");
  battleMonster.innerHTML = [
    `<option value="">Choose a monster</option>`,
    ...monsters.map((entry) => `<option value="${entry.id}">${entry.name}</option>`)
  ].join("");
}

function getBattleScore(hero, monster) {
  const monsterProfile = getMonsterProfile(monster.id);
  let heroScore = hero.powers.length * 2 + hero.facts.length;
  let monsterScore = monster.powers.length * 3 + (monsterProfile?.danger || 0) * 3;

  const heroText = `${hero.name} ${hero.summary} ${hero.story} ${hero.powers.join(" ")} ${hero.facts.join(" ")}`.toLowerCase();
  const monsterText = `${monster.name} ${monster.summary} ${monster.story} ${monster.powers.join(" ")} ${monster.facts.join(" ")}`.toLowerCase();

  if (/(clever|strategy|quick thinking|leadership|bravery|courage|monster fighting|maze survival)/.test(heroText)) {
    heroScore += 2;
  }

  if (/(poison|fire|petrifying|whirlpool|many-headed|regrowing|giant size|ferocious|terrifying|underworld)/.test(monsterText)) {
    monsterScore += 2;
  }

  if (/(sword|spear|bow|shield|pegasus|golden fleece|lion skin|thread)/.test(heroText)) {
    heroScore += 2;
  }

  if (monsterProfile?.danger === 5) {
    monsterScore += 2;
  }

  if (monsterProfile?.weakness) {
    const weakness = monsterProfile.weakness.toLowerCase();
    if (weakness.includes("reflection") && /(shield|reflection|mirror)/.test(heroText)) {
      heroScore += 3;
    }
    if (weakness.includes("thread") && /thread/.test(heroText)) {
      heroScore += 3;
    }
    if (weakness.includes("strength") && /(strength|super strength|lion skin)/.test(heroText)) {
      heroScore += 2;
    }
    if (weakness.includes("clever") && /(clever|strategy|quick thinking)/.test(heroText)) {
      heroScore += 2;
    }
  }

  return { heroScore, monsterScore, monsterProfile };
}

function getWinChances(heroScore, monsterScore) {
  const total = Math.max(heroScore + monsterScore, 1);
  let heroChance = Math.round((heroScore / total) * 100);
  heroChance = Math.max(15, Math.min(85, heroChance));
  const monsterChance = 100 - heroChance;
  return { heroChance, monsterChance };
}

function getBattleTags(list = [], limit = 3) {
  return list.slice(0, limit).map((item) => `<span class="battle-token">${item}</span>`).join("");
}

function getBattleLoreLine(hero, monster, directRule, heroWins, monsterProfile) {
  if (directRule) {
    return "This matchup follows the old myth directly.";
  }

  if (heroWins) {
    return `${hero.name} had the right tools and choices for this fight.`;
  }

  if (monsterProfile?.danger >= 4) {
    return `${monster.name} is such a dangerous creature that even a strong hero can lose this round.`;
  }

  return `${monster.name} turned the matchup its way this time.`;
}

function renderBattle(heroId = battleHero.value, monsterId = battleMonster.value) {
  const hero = getEntryById(heroId);
  const monster = getEntryById(monsterId);
  if (!hero || !monster) {
    battleResult.innerHTML = `
      <p class="detail-kicker">Battle result</p>
      <h3>Choose a match-up</h3>
      <p class="hero-text">Pick one hero and one monster, then hit Battle.</p>
    `;
    return;
  }

  const { heroScore, monsterScore, monsterProfile } = getBattleScore(hero, monster);
  const directRule = mythBattleRules[hero.id]?.[monster.id];
  const { heroChance, monsterChance } = getWinChances(heroScore, monsterScore);
  const heroWins = directRule ? directRule.winner === "hero" : Math.random() * 100 < heroChance;
  const winner = heroWins ? hero : monster;
  recordBattleResult({
    winnerType: heroWins ? "hero" : "monster",
    winnerId: winner.id
  });
  const reason = directRule
    ? directRule.reason
    : heroWins
      ? `${hero.name} had the better round this time with the right mix of courage, tools, and myth skills.`
      : `${monster.name} took this round with danger, power, and the harder matchup.`;
  const battleType = directRule ? "Myth match" : "What-if battle";
  const winnerSide = heroWins ? "hero" : "monster";
  const winnerBadge = directRule ? "Canon result" : "Rolled result";
  const dangerStars = monsterProfile ? "★".repeat(monsterProfile.danger) : "?";
  const weaknessLine = monsterProfile?.weakness ? monsterProfile.weakness : "Unknown";
  const heroBarWidth = directRule ? (heroWins ? 100 : 0) : heroChance;
  const monsterBarWidth = directRule ? (heroWins ? 0 : 100) : monsterChance;
  const heroTags = getBattleTags(hero.powers);
  const monsterTags = getBattleTags(monster.powers);
  const heroFact = hero.facts[0] || hero.summary;
  const monsterFact = monster.facts[0] || monster.summary;
  const loreLine = getBattleLoreLine(hero, monster, directRule, heroWins, monsterProfile);

  battleResult.innerHTML = `
    <p class="detail-kicker">Battle result</p>
    <div class="battle-card battle-card-${winnerSide}">
      <div class="battle-card-top">
        <span class="battle-pill">${battleType}</span>
        <span class="battle-pill battle-pill-strong">${winnerBadge}</span>
      </div>
      <div class="battle-versus">
        <div class="battle-fighter">
          <p class="battle-role">Hero</p>
          <h3>${hero.name}</h3>
          <p class="battle-subtitle">${hero.title}</p>
          <div class="battle-bar">
            <span style="width: ${heroBarWidth}%"></span>
          </div>
        </div>
        <div class="battle-vs-mark" aria-hidden="true">VS</div>
        <div class="battle-fighter">
          <p class="battle-role">Monster</p>
          <h3>${monster.name}</h3>
          <p class="battle-subtitle">${monster.title}</p>
          <div class="battle-bar battle-bar-monster">
            <span style="width: ${monsterBarWidth}%"></span>
          </div>
        </div>
      </div>
      <div class="battle-winner">
        <span class="battle-winner-kicker">Winner</span>
        <strong>${winner.name}</strong>
      </div>
      <p class="hero-text battle-reason">${reason}</p>
      <p class="battle-lore-line">${loreLine}</p>
      <div class="battle-detail-grid">
        <div class="battle-detail-box">
          <p class="battle-role">Hero Tools</p>
          <div class="battle-token-row">${heroTags}</div>
          <p class="battle-fact-line">${heroFact}</p>
        </div>
        <div class="battle-detail-box">
          <p class="battle-role">Monster Threats</p>
          <div class="battle-token-row">${monsterTags}</div>
          <p class="battle-fact-line">${monsterFact}</p>
        </div>
      </div>
      <div class="detail-badges battle-badges">
        <span>Monster danger: ${dangerStars}</span>
        <span>Weakness clue: ${weaknessLine}</span>
        <span>${directRule ? "Straight from the myth" : "Outcome rolled from the odds"}</span>
      </div>
      <div class="quiz-actions">
        <button class="button button-gold" type="button" id="battle-rematch">${directRule ? "Same Result" : "Rematch"}</button>
      </div>
    </div>
  `;

  battleResult.querySelector("#battle-rematch").addEventListener("click", () => {
    if (directRule) {
      renderBattle(hero.id, monster.id);
      return;
    }
    renderBattle(hero.id, monster.id);
  });
}

function randomBattle() {
  const heroes = entries.filter((entry) => entry.category === "hero");
  const monsters = entries.filter((entry) => entry.category === "monster");
  const hero = heroes[Math.floor(Math.random() * heroes.length)];
  const monster = monsters[Math.floor(Math.random() * monsters.length)];
  battleHero.value = hero.id;
  battleMonster.value = monster.id;
  renderBattle(hero.id, monster.id);
}

function buildMemoryDeck() {
  const deckEntries = memoryDecks[currentMemoryLevel].map((id) => getEntryById(id)).filter(Boolean);

  memoryCards = shuffle(
    deckEntries.flatMap((entry) => [
      {
        id: `${entry.id}-a`,
        pairId: entry.id,
        label: entry.name,
        type: entry.typeLabel,
        icon: memoryVisuals[entry.id]?.icon || "Ω",
        color: memoryVisuals[entry.id]?.color || "#4a2430"
      },
      {
        id: `${entry.id}-b`,
        pairId: entry.id,
        label: entry.name,
        type: entry.typeLabel,
        icon: memoryVisuals[entry.id]?.icon || "Ω",
        color: memoryVisuals[entry.id]?.color || "#4a2430"
      }
    ])
  );
  memoryRevealed = [];
  memoryLocked = false;
  memoryMatchedPairs = 0;
}

function renderMemoryGame() {
  memoryGrid.innerHTML = "";
  memoryGrid.dataset.memoryLevel = currentMemoryLevel;
  memoryLevelButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.memoryLevel === currentMemoryLevel);
  });

  memoryCards.forEach((card) => {
    const isRevealed = memoryRevealed.includes(card.id);
    const isMatched = card.matched;
    const button = document.createElement("button");
    button.className = "memory-card";
    button.type = "button";
    button.disabled = memoryLocked || isMatched;
    button.style.setProperty("--memory-card-accent", card.color);
    button.innerHTML =
      isRevealed || isMatched
        ? `<span class="memory-card-icon">${card.icon}</span><span class="memory-card-face">${card.label}</span><span class="memory-card-type">${card.type}</span>`
        : `<span class="memory-card-back">Ω</span>`;

    if (isRevealed || isMatched) {
      button.classList.add("is-revealed");
    }
    if (isMatched) {
      button.classList.add("is-matched");
    }

    button.addEventListener("click", () => handleMemoryPick(card.id));
    memoryGrid.appendChild(button);
  });
}

function handleMemoryPick(cardId) {
  if (memoryLocked || memoryRevealed.includes(cardId)) return;

  memoryRevealed = [...memoryRevealed, cardId];
  renderMemoryGame();

  if (memoryRevealed.length < 2) {
    memoryStatus.textContent = "Find the matching card.";
    return;
  }

  memoryLocked = true;
  const [firstId, secondId] = memoryRevealed;
  const firstCard = memoryCards.find((card) => card.id === firstId);
  const secondCard = memoryCards.find((card) => card.id === secondId);

  if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
    firstCard.matched = true;
    secondCard.matched = true;
    memoryMatchedPairs += 1;
    memoryStatus.textContent = `Match found: ${firstCard.label}!`;
    memoryRevealed = [];
    memoryLocked = false;
    renderMemoryGame();

    if (memoryMatchedPairs === memoryCards.length / 2) {
      memoryStatus.textContent = "You found every pair!";
      recordMemoryComplete({ level: currentMemoryLevel });
      triggerMemoryFlash();
    }
    return;
  }

  memoryStatus.textContent = "Not a match. Take a look before the cards flip back.";
  window.setTimeout(() => {
    memoryRevealed = [];
    memoryLocked = false;
    renderMemoryGame();
  }, 5000);
}

levelButtons.forEach((button) => {
  button.addEventListener("click", () => startRound(button.dataset.level));
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    startRound(currentLevel);
  });
});

battleRun.addEventListener("click", () => renderBattle());
battleRandom.addEventListener("click", randomBattle);
battleHero.addEventListener("change", () => renderBattle());
battleMonster.addEventListener("change", () => renderBattle());
memoryLevelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentMemoryLevel = button.dataset.memoryLevel;
    buildMemoryDeck();
    memoryStatus.textContent =
      currentMemoryLevel === "hard"
        ? "Hard board: 12 pairs to remember."
        : "Normal board: 8 pairs to remember.";
    renderMemoryGame();
  });
});
memoryReset.addEventListener("click", () => {
  buildMemoryDeck();
  memoryStatus.textContent =
    currentMemoryLevel === "hard"
      ? "Hard board: 12 pairs to remember."
      : "Normal board: 8 pairs to remember.";
  renderMemoryGame();
});

wordSearchCategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentWordSearchCategory = button.dataset.wordsearchCategory;
    buildWordSearch();
  });
});

wordSearchReset.addEventListener("click", () => {
  buildWordSearch();
});

window.addEventListener("pointerup", () => {
  finalizeWordSearchDrag();
});

renderBattleSelectors();
renderBattle("", "");
buildMemoryDeck();
renderMemoryGame();
buildWordSearch();
startRound("level1");
