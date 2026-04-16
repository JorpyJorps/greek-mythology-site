import {
  entries,
  storyHighlights,
  triviaLevels,
  getEntryById,
  getStoryForEntry,
  getMonsterProfile,
  getDailyQuest
} from "./data.js";
import { loadSiteStats } from "./stats.js";

const FAVORITES_KEY = "myth-favorites";
const MATH_KEY = "miles-math-progress";
const SOUND_KEY = "myth-sound-enabled";
const QUESTIONS_PER_ROUND = 10;
const HOMEPAGE_REWARDS = [
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

const godGrid = document.querySelector("#god-grid");
const titanGrid = document.querySelector("#titan-grid");
const heroGrid = document.querySelector("#hero-grid");
const monsterGrid = document.querySelector("#monster-grid");
const detailName = document.querySelector("#detail-name");
const detailType = document.querySelector("#detail-type");
const detailTitle = document.querySelector("#detail-title");
const detailSymbol = document.querySelector("#detail-symbol");
const detailHome = document.querySelector("#detail-home");
const detailStory = document.querySelector("#detail-story");
const detailFacts = document.querySelector("#detail-facts");
const detailPowers = document.querySelector("#detail-powers");
const detailColor = document.querySelector("#detail-color");
const detailLink = document.querySelector("#detail-link");
const detailStoryLink = document.querySelector("#detail-story-link");
const detailNext = document.querySelector("#detail-next");
const detailSlideTitle = document.querySelector("#detail-slide-title");
const detailSlideBody = document.querySelector("#detail-slide-body");
const storyGrid = document.querySelector("#story-grid");
const favoritesGrid = document.querySelector("#favorites-grid");
const stickerGrid = document.querySelector("#sticker-grid");
const searchInput = document.querySelector("#legend-search");
const searchResults = document.querySelector("#search-results");
const explorerSection = document.querySelector("#explorer");
const dailyQuest = document.querySelector("#daily-quest");
const soundToggle = document.querySelector("#sound-toggle");
const quizCard = document.querySelector("#quiz-card");
const levelButtons = document.querySelectorAll("[data-level]");
const categoryButtons = document.querySelectorAll("[data-category]");
const totalCount = document.querySelector("#total-count");
const totalGodCount = document.querySelector("#god-count");
const totalTitanCount = document.querySelector("#titan-count");
const totalHeroCount = document.querySelector("#hero-count");
const totalMonsterCount = document.querySelector("#monster-count");
const battleHero = document.querySelector("#battle-hero");
const battleMonster = document.querySelector("#battle-monster");
const battleRun = document.querySelector("#battle-run");
const battleRandom = document.querySelector("#battle-random");
const battleResult = document.querySelector("#battle-result");
const memoryGrid = document.querySelector("#memory-grid");
const memoryReset = document.querySelector("#memory-reset");
const memoryStatus = document.querySelector("#memory-status");

let currentLevel = "level1";
let currentCategory = "all";
let activeQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let questionLocked = false;
let activeLegendSlides = [];
let activeLegendSlideIndex = 0;
let favorites = loadFavorites();
let soundEnabled = loadSoundSetting();
let memoryCards = [];
let memoryRevealed = [];
let memoryLocked = false;
let memoryMatchedPairs = 0;

function loadFavorites() {
  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites() {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function loadSoundSetting() {
  return window.localStorage.getItem(SOUND_KEY) === "true";
}

function saveSoundSetting() {
  window.localStorage.setItem(SOUND_KEY, String(soundEnabled));
}

function getMathProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(MATH_KEY) || "{}");
  } catch {
    return {};
  }
}

function playTone(type = "soft") {
  if (!soundEnabled) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.type = type === "spark" ? "triangle" : "sine";
  oscillator.frequency.value = type === "spark" ? 540 : 380;
  gain.gain.value = 0.03;
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

function toggleFavorite(entryId) {
  if (favorites.includes(entryId)) {
    favorites = favorites.filter((item) => item !== entryId);
  } else {
    favorites = [...favorites, entryId];
    playTone("spark");
  }

  saveFavorites();
  renderCards();
  renderFavorites();
}

function renderSoundToggle() {
  soundToggle.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
}

function createCard(entry, isActive = false) {
  const card = document.createElement("article");
  card.className = "entry-card";
  card.dataset.entryId = entry.id;
  card.tabIndex = 0;
  if (isActive) {
    card.classList.add("is-active");
  }

  const isFavorite = favorites.includes(entry.id);
  const monsterProfile = getMonsterProfile(entry.id);

  card.innerHTML = `
    <span class="entry-type">${entry.typeLabel}</span>
    <h4>${entry.name}</h4>
    <p>${entry.summary}</p>
    ${monsterProfile ? `<p class="entry-meta">Danger ${"★".repeat(monsterProfile.danger)} • Weakness clue: ${monsterProfile.weakness}</p>` : ""}
    <div class="entry-actions">
      <button class="entry-preview" type="button">Open Quick View</button>
      <button class="entry-preview favorite-toggle" type="button">${isFavorite ? "Unstar" : "Star"}</button>
      <a class="entry-link" href="./profile.html#${entry.id}">Open Full Page</a>
    </div>
  `;

  card.querySelector(".favorite-toggle").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(entry.id);
  });

  card.addEventListener("click", (event) => {
    const interactiveTarget = event.target.closest("a, button");
    if (interactiveTarget?.classList.contains("entry-link")) {
      return;
    }

    setActiveEntry(entry.id);
    playTone();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveEntry(entry.id);
    }
  });

  return card;
}

function renderCards() {
  [godGrid, titanGrid, heroGrid, monsterGrid].forEach((grid) => {
    grid.innerHTML = "";
  });

  entries.forEach((entry, index) => {
    const card = createCard(entry, index === 0);
    if (entry.category === "god") godGrid.appendChild(card);
    else if (entry.category === "titan") titanGrid.appendChild(card);
    else if (entry.category === "hero") heroGrid.appendChild(card);
    else monsterGrid.appendChild(card);
  });
}

function getLegendSlides(entry) {
  const monsterProfile = getMonsterProfile(entry.id);

  return [
    { title: "Story", body: entry.story },
    { title: "Fun Fact", body: entry.facts[0] },
    {
      title: monsterProfile ? "Weakness Clue" : "Power Move",
      body: monsterProfile ? monsterProfile.weakness : `${entry.name} is known for ${entry.powers[0].toLowerCase()}.`
    }
  ];
}

function renderLegendSlide() {
  const slide = activeLegendSlides[activeLegendSlideIndex];
  if (!slide) return;
  detailSlideTitle.textContent = `${slide.title} ${activeLegendSlideIndex + 1}`;
  detailSlideBody.textContent = slide.body;
}

function setActiveEntry(entryId) {
  const entry = getEntryById(entryId);
  if (!entry) return;

  document.querySelectorAll(".entry-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.entryId === entryId);
  });

  const monsterProfile = getMonsterProfile(entryId);
  detailType.textContent = entry.typeLabel;
  detailName.textContent = entry.name;
  detailTitle.textContent = monsterProfile ? `${entry.title} • Danger ${"★".repeat(monsterProfile.danger)}` : entry.title;
  detailSymbol.textContent = `Symbol: ${entry.symbol}`;
  detailHome.textContent = `Home: ${entry.home}`;
  detailColor.textContent = `Legend Color: ${entry.color}`;
  detailStory.textContent = entry.story;
  detailLink.href = `./profile.html#${entry.id}`;

  const linkedStory = getStoryForEntry(entry.id);
  if (linkedStory) {
    detailStoryLink.hidden = false;
    detailStoryLink.href = `./story.html#${linkedStory.id}`;
  } else {
    detailStoryLink.hidden = true;
    detailStoryLink.removeAttribute("href");
  }

  activeLegendSlides = getLegendSlides(entry);
  activeLegendSlideIndex = 0;
  renderLegendSlide();

  detailFacts.innerHTML = "";
  entry.facts.forEach((fact) => {
    const item = document.createElement("li");
    item.textContent = fact;
    detailFacts.appendChild(item);
  });

  if (monsterProfile) {
    const clue = document.createElement("li");
    clue.textContent = `Weakness clue: ${monsterProfile.weakness}`;
    detailFacts.appendChild(clue);
  }

  detailPowers.innerHTML = "";
  entry.powers.forEach((power) => {
    const item = document.createElement("li");
    item.textContent = power;
    detailPowers.appendChild(item);
  });
}

function renderStories() {
  storyGrid.innerHTML = "";
  storyHighlights.forEach((story) => {
    const card = document.createElement("article");
    card.className = "story-card";
    card.innerHTML = `
      <p class="card-kicker">${story.level} • ${story.readTime}</p>
      <h3>${story.title}</h3>
      <p>${story.summary}</p>
      <div class="entry-actions">
        <a class="button button-outline" href="./story.html#${story.id}">Read Story</a>
      </div>
    `;
    storyGrid.appendChild(card);
  });
}

function renderFavorites() {
  favoritesGrid.innerHTML = "";

  if (favorites.length === 0) {
    favoritesGrid.innerHTML = `<article class="story-card"><h3>No favorites yet</h3><p>Star any legend from the explorer to build Miles' team.</p></article>`;
    return;
  }

  favorites
    .map((id) => getEntryById(id))
    .filter(Boolean)
    .forEach((entry) => {
      const card = document.createElement("article");
      card.className = "story-card";
      card.innerHTML = `
        <p class="card-kicker">${entry.typeLabel}</p>
        <h3>${entry.name}</h3>
        <p>${entry.summary}</p>
        <div class="entry-actions">
          <a class="button button-outline" href="./profile.html#${entry.id}">Open Profile</a>
          <button class="entry-preview" type="button" data-remove="${entry.id}">Unstar</button>
        </div>
      `;
      card.querySelector("[data-remove]").addEventListener("click", () => toggleFavorite(entry.id));
      favoritesGrid.appendChild(card);
    });
}

function renderSearchResults(matches = []) {
  searchResults.innerHTML = "";
  matches.forEach((entry) => {
    const button = document.createElement("button");
    button.className = "search-result";
    button.type = "button";
    button.textContent = `${entry.name} • ${entry.typeLabel}`;
    button.addEventListener("click", () => {
      setActiveEntry(entry.id);
      searchInput.value = entry.name;
      searchResults.innerHTML = "";
      explorerSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    searchResults.appendChild(button);
  });
}

function renderDailyQuest() {
  const quest = getDailyQuest();
  dailyQuest.innerHTML = `
    <p><strong>Featured legend:</strong> ${quest.featured.name}</p>
    <p><strong>Trivia:</strong> ${quest.triviaQuestion.question}</p>
    <div class="entry-actions">
      <a class="button button-outline" href="./profile.html#${quest.featured.id}">Open Legend</a>
      <a class="button button-outline" href="./math.html">Do Math Quest</a>
      <a class="button button-outline" href="./games.html#trivia">Play Trivia</a>
    </div>
  `;
}

function renderStickerShelf() {
  stickerGrid.innerHTML = "";
  const progress = getMathProgress();
  const dailyCorrect = progress.dailyCorrect || 0;
  const upcomingRewards = HOMEPAGE_REWARDS.filter((reward) => reward.threshold > dailyCorrect).slice(0, 4);
  const stats = loadSiteStats();

  if (upcomingRewards.length === 0) {
    const card = document.createElement("article");
    card.className = "story-card";
    card.innerHTML = `
      <h3>Today's reward track is clear</h3>
      <p>Miles already reached every reward on today's Math Quest track.</p>
    `;
    stickerGrid.appendChild(card);
  } else {
    upcomingRewards.forEach((reward) => {
      const card = document.createElement("article");
      card.className = "story-card";
      const remaining = reward.threshold - dailyCorrect;
      card.innerHTML = `
        <p class="card-kicker">Up next</p>
        <h3>${reward.icon} ${reward.name}</h3>
        <p>${remaining} more right today to unlock this reward in Math Quest.</p>
      `;
      stickerGrid.appendChild(card);
    });
  }

  const trophyCard = document.createElement("article");
  trophyCard.className = "story-card";
  trophyCard.innerHTML = `
    <p class="card-kicker">Trophy Room</p>
    <h3>Earned wins and big moments</h3>
    <p>${stats.quest.legendPaths || 0} legend paths, ${stats.memory.gamesCompleted || 0} memory clears, and more.</p>
    <a class="button button-outline" href="./trophy-room.html">Open Trophy Room</a>
  `;
  stickerGrid.appendChild(trophyCard);
}

function renderCounts() {
  totalCount.textContent = String(entries.length);
  totalGodCount.textContent = String(entries.filter((entry) => entry.category === "god").length);
  totalTitanCount.textContent = String(entries.filter((entry) => entry.category === "titan").length);
  totalHeroCount.textContent = String(entries.filter((entry) => entry.category === "hero").length);
  totalMonsterCount.textContent = String(entries.filter((entry) => entry.category === "monster").length);
}

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
        playTone("spark");
      }

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

levelButtons.forEach((button) => {
  button.addEventListener("click", () => startRound(button.dataset.level));
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    startRound(currentLevel);
  });
});

if (detailNext) {
  detailNext.addEventListener("click", () => {
    activeLegendSlideIndex = (activeLegendSlideIndex + 1) % activeLegendSlides.length;
    renderLegendSlide();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = "";
      return;
    }

    const matches = entries
      .filter((entry) =>
        `${entry.name} ${entry.typeLabel} ${entry.home} ${entry.summary}`.toLowerCase().includes(query)
      )
      .slice(0, 6);

    renderSearchResults(matches);
  });
}

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    saveSoundSetting();
    renderSoundToggle();
    playTone();
  });
}

function renderBattleSelectors() {
  const heroes = entries.filter((entry) => entry.category === "hero");
  const monsters = entries.filter((entry) => entry.category === "monster");

  battleHero.innerHTML = heroes
    .map((entry) => `<option value="${entry.id}">${entry.name}</option>`)
    .join("");
  battleMonster.innerHTML = monsters
    .map((entry) => `<option value="${entry.id}">${entry.name}</option>`)
    .join("");
}

function getBattleScore(hero, monster) {
  const monsterProfile = getMonsterProfile(monster.id);
  const heroScore = hero.powers.length * 2 + hero.facts.length + (hero.name.includes("Hercules") ? 2 : 0);
  const monsterScore = monster.powers.length * 2 + (monsterProfile?.danger || 0) * 2;
  return { heroScore, monsterScore, monsterProfile };
}

function renderBattle(heroId = battleHero.value, monsterId = battleMonster.value) {
  const hero = getEntryById(heroId);
  const monster = getEntryById(monsterId);
  if (!hero || !monster) {
    return;
  }

  const { heroScore, monsterScore, monsterProfile } = getBattleScore(hero, monster);
  const heroWins = heroScore >= monsterScore;
  const winner = heroWins ? hero : monster;
  const reason = heroWins
    ? `${hero.name} has the better plan, stronger myth tools, and the right traits for this battle.`
    : `${monster.name} is too dangerous right now and would probably overpower ${hero.name}.`;

  battleResult.innerHTML = `
    <p class="detail-kicker">Battle result</p>
    <h3>${hero.name} vs ${monster.name}</h3>
    <p class="hero-text"><strong>Winner:</strong> ${winner.name}</p>
    <p class="hero-text">${reason}</p>
    <div class="detail-badges">
      <span>Hero score: ${heroScore}</span>
      <span>Monster danger: ${monsterProfile ? "★".repeat(monsterProfile.danger) : "?"}</span>
    </div>
  `;
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
  const deckEntries = [
    getEntryById("zeus"),
    getEntryById("athena"),
    getEntryById("poseidon"),
    getEntryById("hercules"),
    getEntryById("medusa"),
    getEntryById("minotaur")
  ].filter(Boolean);

  memoryCards = shuffle(
    deckEntries.flatMap((entry) => [
      { id: `${entry.id}-a`, pairId: entry.id, label: entry.name, type: entry.typeLabel },
      { id: `${entry.id}-b`, pairId: entry.id, label: entry.name, type: entry.typeLabel }
    ])
  );
  memoryRevealed = [];
  memoryLocked = false;
  memoryMatchedPairs = 0;
}

function renderMemoryGame() {
  memoryGrid.innerHTML = "";
  memoryCards.forEach((card) => {
    const isRevealed = memoryRevealed.includes(card.id);
    const isMatched = card.matched;
    const button = document.createElement("button");
    button.className = "memory-card";
    button.type = "button";
    button.disabled = memoryLocked || isMatched;
    button.innerHTML =
      isRevealed || isMatched
        ? `<span class="memory-card-face">${card.label}</span><span class="memory-card-type">${card.type}</span>`
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
  if (memoryLocked || memoryRevealed.includes(cardId)) {
    return;
  }

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
    }
    return;
  }

  memoryStatus.textContent = "Not a match. Try again.";
  window.setTimeout(() => {
    memoryRevealed = [];
    memoryLocked = false;
    renderMemoryGame();
  }, 900);
}

if (battleRun) {
  battleRun.addEventListener("click", () => renderBattle());
}

if (battleRandom) {
  battleRandom.addEventListener("click", randomBattle);
}

if (memoryReset) {
  memoryReset.addEventListener("click", () => {
    buildMemoryDeck();
    memoryStatus.textContent = "Find all the matching pairs.";
    renderMemoryGame();
  });
}

renderCards();
renderStories();
renderCounts();
renderFavorites();
renderDailyQuest();
renderStickerShelf();
renderSoundToggle();
if (battleHero && battleMonster && battleResult) {
  renderBattleSelectors();
  renderBattle();
}
if (memoryGrid) {
  buildMemoryDeck();
  renderMemoryGame();
}
if (quizCard) {
  startRound("level1");
}
setActiveEntry("zeus");
