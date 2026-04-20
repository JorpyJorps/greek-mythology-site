import { triviaLevels, getEntryById } from "./data.js";
import {
  recordBattleResult,
  recordMemoryComplete,
  recordTriviaAnswer,
  recordWordSearchComplete,
  recordWordSearchFound
} from "./stats.js";

// ── Storage ────────────────────────────────────────────────
const BOLT_KEY   = "miles-bolts";
const SCROLL_KEY = "miles-scrolls";
const GAMES_KEY  = "miles-games-progress";

const TRIVIA_DAILY_CAP      = 15;
const MEMORY_DAILY_CAP      = 10;
const BATTLE_DAILY_CAP      = 5;
const WORDSEARCH_DAILY_CAP  = 10;

const QUESTIONS_PER_ROUND = 10;
const TRIVIA_LEVEL_UP_AT  = 7;

// ── DOM: picker ───────────────────────────────────────────
const pickerSection = document.querySelector("#games-picker");
const gameTiles     = document.querySelectorAll(".game-tile");
const pickerBolts   = document.querySelector("#picker-bolts");
const pickerScrolls = document.querySelector("#picker-scrolls");

// ── DOM: panels ───────────────────────────────────────────
const panelTrivia     = document.querySelector("#panel-trivia");
const panelMemory     = document.querySelector("#panel-memory");
const panelBattle     = document.querySelector("#panel-battle");
const panelWordsearch = document.querySelector("#panel-wordsearch");

// ── DOM: trivia ───────────────────────────────────────────
const triviaProgress  = document.querySelector("#trivia-progress");
const triviaCatTag    = document.querySelector("#trivia-cat-tag");
const triviaQuestion  = document.querySelector("#trivia-question");
const triviaOptions   = document.querySelector("#trivia-options");
const triviaFeedback  = document.querySelector("#trivia-feedback");
const triviaBoltCount = document.querySelector("#trivia-bolt-count");
const triviaBoltFill  = document.querySelector("#trivia-bolt-fill");
const triviaBoltLabel = document.querySelector("#trivia-bolt-label");

// ── DOM: memory ───────────────────────────────────────────
const memoryGrid         = document.querySelector("#memory-grid");
const memoryReset        = document.querySelector("#memory-reset");
const memoryStatus       = document.querySelector("#memory-status");
const memoryLevelButtons = document.querySelectorAll("[data-memory-level]");
const memoryBoltCount    = document.querySelector("#memory-bolt-count");

// ── DOM: battle ───────────────────────────────────────────
const battleHero      = document.querySelector("#battle-hero");
const battleMonster   = document.querySelector("#battle-monster");
const battleRun       = document.querySelector("#battle-run");
const battleRandom    = document.querySelector("#battle-random");
const battleResult    = document.querySelector("#battle-result");
const battleBoltCount = document.querySelector("#battle-bolt-count");

// ── DOM: word search ──────────────────────────────────────
const wordSearchGrid            = document.querySelector("#wordsearch-grid");
const wordSearchList            = document.querySelector("#wordsearch-list");
const wordSearchStatus          = document.querySelector("#wordsearch-status");
const wordSearchReset           = document.querySelector("#wordsearch-reset");
const wordSearchCategoryButtons = document.querySelectorAll("[data-wordsearch-category]");
const wordsearchScrollCount     = document.querySelector("#wordsearch-scroll-count");

// ── DOM: shared flash ─────────────────────────────────────
const gamesFlash = document.querySelector("#games-flash");

// ── Progress persistence ──────────────────────────────────
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function loadGamesProgress() {
  const today = getTodayKey();
  const fallback = {
    dailyDate: today,
    triviaBoltsEarned: 0,
    memoryBoltsEarned: 0,
    battleBoltsEarned: 0,
    wordsearchScrollsEarned: 0,
  };
  try {
    const raw = localStorage.getItem(GAMES_KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw);
    if (p.dailyDate !== today) return { ...fallback };
    return { ...fallback, ...p };
  } catch {
    return fallback;
  }
}

function saveGamesProgress() {
  localStorage.setItem(GAMES_KEY, JSON.stringify(gamesProgress));
}

let gamesProgress = loadGamesProgress();

function getStoredBolts()   { return parseInt(localStorage.getItem(BOLT_KEY)   || "0", 10); }
function getStoredScrolls() { return parseInt(localStorage.getItem(SCROLL_KEY) || "0", 10); }

function addBoltFromGame(game) {
  const capMap   = { trivia: TRIVIA_DAILY_CAP, memory: MEMORY_DAILY_CAP, battle: BATTLE_DAILY_CAP };
  const earnedKey = `${game}BoltsEarned`;
  if ((gamesProgress[earnedKey] || 0) >= (capMap[game] || 10)) return false;
  gamesProgress[earnedKey] = (gamesProgress[earnedKey] || 0) + 1;
  localStorage.setItem(BOLT_KEY, String(getStoredBolts() + 1));
  saveGamesProgress();
  renderHuds();
  return true;
}

function addScrollsFromGame(n) {
  let added = 0;
  for (let i = 0; i < n; i++) {
    if (gamesProgress.wordsearchScrollsEarned >= WORDSEARCH_DAILY_CAP) break;
    gamesProgress.wordsearchScrollsEarned += 1;
    localStorage.setItem(SCROLL_KEY, String(getStoredScrolls() + 1));
    added++;
  }
  if (added) { saveGamesProgress(); renderHuds(); }
  return added;
}

function renderHuds() {
  const bolts   = String(getStoredBolts());
  const scrolls = String(getStoredScrolls());
  if (pickerBolts)           pickerBolts.textContent           = bolts;
  if (pickerScrolls)         pickerScrolls.textContent         = scrolls;
  if (triviaBoltCount)       triviaBoltCount.textContent       = bolts;
  if (memoryBoltCount)       memoryBoltCount.textContent       = bolts;
  if (battleBoltCount)       battleBoltCount.textContent       = bolts;
  if (wordsearchScrollCount) wordsearchScrollCount.textContent = scrolls;

  if (triviaBoltFill) {
    const pct = Math.min(100, (gamesProgress.triviaBoltsEarned / TRIVIA_DAILY_CAP) * 100);
    triviaBoltFill.style.width = `${pct}%`;
  }
  if (triviaBoltLabel) {
    const capped = gamesProgress.triviaBoltsEarned >= TRIVIA_DAILY_CAP;
    triviaBoltLabel.textContent = capped
      ? "MAX BOLTS TODAY ⚡"
      : `${gamesProgress.triviaBoltsEarned} BOLTS TODAY`;
  }
}

// ── Flash ─────────────────────────────────────────────────
function triggerFlash() {
  if (!gamesFlash) return;
  gamesFlash.classList.remove("is-active");
  requestAnimationFrame(() => gamesFlash.classList.add("is-active"));
  setTimeout(() => gamesFlash.classList.remove("is-active"), 950);
}

// ── Game picker navigation ────────────────────────────────
function showPicker() {
  pickerSection.hidden   = false;
  panelTrivia.hidden     = true;
  panelMemory.hidden     = true;
  panelBattle.hidden     = true;
  panelWordsearch.hidden = true;
  renderHuds();
}

function showPanel(name) {
  pickerSection.hidden   = true;
  panelTrivia.hidden     = name !== "trivia";
  panelMemory.hidden     = name !== "memory";
  panelBattle.hidden     = name !== "battle";
  panelWordsearch.hidden = name !== "wordsearch";
  renderHuds();
  if (name === "trivia")     startTrivia();
  if (name === "memory")     startMemory();
  if (name === "battle")     startBattle();
  if (name === "wordsearch") startWordsearch();
}

gameTiles.forEach(tile =>
  tile.addEventListener("click", () => showPanel(tile.dataset.game))
);
document.querySelector("#back-trivia").addEventListener("click", showPicker);
document.querySelector("#back-memory").addEventListener("click", showPicker);
document.querySelector("#back-battle").addEventListener("click", showPicker);
document.querySelector("#back-wordsearch").addEventListener("click", showPicker);

// ── Shared helpers ────────────────────────────────────────
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── TRIVIA ────────────────────────────────────────────────
const CAT_LABELS = { gods: "GODS", heroes: "HEROES", monsters: "BEASTS", places: "PLACES" };

let triviaQueue         = [];
let triviaQueueIndex    = 0;
let triviaSessionLevel  = "level1";
let triviaSessionCorrect = 0;
let triviaLocked        = false;
let triviaTotal         = 0;   // questions answered this session

function getQuestionCategory(question) {
  const text = `${question.question} ${question.answer}`.toLowerCase();
  if (/(zeus|athena|poseidon|apollo|artemis|hades|hermes|hera|demeter|hestia|aphrodite|hephaestus|ares|dionysus|persephone|god|goddess)/.test(text))
    return "gods";
  if (/(hercules|heracles|perseus|theseus|odysseus|achilles|atalanta|jason|bellerophon|hero)/.test(text))
    return "heroes";
  if (/(minotaur|hydra|cerberus|cyclops|sphinx|chimera|medusa|siren|monster|lion)/.test(text))
    return "monsters";
  if (/(olympus|underworld|labyrinth|athens|crete|lerna|thebes|nemea|place|lived|where)/.test(text))
    return "places";
  return "all";
}

function refillTriviaQueue() {
  const pool = triviaLevels[triviaSessionLevel];
  triviaQueue = shuffle(pool).slice(0, QUESTIONS_PER_ROUND);
  triviaQueueIndex = 0;
}

function startTrivia() {
  triviaSessionCorrect = 0;
  triviaTotal          = 0;
  triviaSessionLevel   = "level1";
  refillTriviaQueue();
  renderTriviaQuestion();
}

function renderTriviaQuestion() {
  if (triviaQueueIndex >= triviaQueue.length) refillTriviaQueue();

  const q = triviaQueue[triviaQueueIndex];
  triviaLocked = false;
  triviaTotal++;

  const cat = getQuestionCategory(q);
  triviaCatTag.textContent  = CAT_LABELS[cat] || "?";
  triviaQuestion.textContent = q.question;
  triviaProgress.textContent = `${triviaTotal} / —`;
  triviaFeedback.textContent = "\u00A0";
  triviaFeedback.className   = "math-feedback pixel";
  triviaOptions.innerHTML    = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "math-choice pixel";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleTriviaAnswer(opt, btn, q));
    triviaOptions.appendChild(btn);
  });
}

function handleTriviaAnswer(opt, btn, q) {
  if (triviaLocked) return;
  triviaLocked = true;

  const correct = opt === q.answer;
  recordTriviaAnswer({ question: q.question, correct, category: getQuestionCategory(q) });

  triviaOptions.querySelectorAll(".math-choice").forEach(b => {
    b.disabled = true;
    if (b.textContent === q.answer) b.classList.add("is-correct");
    else if (b === btn)             b.classList.add("is-wrong");
  });

  if (correct) {
    triviaSessionCorrect++;
    triviaFeedback.textContent = "✓ CORRECT!";
    triviaFeedback.classList.add("is-correct");
    addBoltFromGame("trivia");

    if (triviaSessionLevel === "level1" && triviaSessionCorrect >= TRIVIA_LEVEL_UP_AT) {
      triviaSessionLevel = "level2";
      refillTriviaQueue();
    }
  } else {
    triviaFeedback.textContent = `✗  ${q.answer}`;
    triviaFeedback.classList.add("is-wrong");
  }

  triviaQueueIndex++;
  setTimeout(renderTriviaQuestion, correct ? 900 : 1400);
}

// ── MEMORY MATCH ──────────────────────────────────────────
const WORDSEARCH_SIZE  = 12;
const WORDSEARCH_WORDS = 6;

const wordSearchPools = {
  mixed:    ["ZEUS","ATHENA","POSEIDON","HADES","APOLLO","HERA","PERSEUS","THESEUS","HYDRA","MEDUSA","CYCLOPS","MINOTAUR"],
  gods:     ["ZEUS","ATHENA","POSEIDON","HADES","APOLLO","HERA","HESTIA","DEMETER","ARTEMIS","HERMES"],
  heroes:   ["PERSEUS","THESEUS","ODYSSEUS","HERACLES","JASON","ACHILLES","ATALANTA","BELLEROPHON"],
  monsters: ["HYDRA","MEDUSA","CYCLOPS","MINOTAUR","CERBERUS","CHIMERA","SPHINX","SIRENS"]
};

const memoryDecks = {
  normal: ["zeus","athena","poseidon","hercules","medusa","minotaur","perseus","theseus"],
  hard:   ["zeus","athena","poseidon","hercules","medusa","minotaur","perseus","theseus","hades","apollo","artemis","hydra"]
};

const memoryVisuals = {
  zeus:      { icon:"⚡", color:"#6a4314" },
  athena:    { icon:"🦉", color:"#5d4a1c" },
  poseidon:  { icon:"🔱", color:"#124864" },
  hercules:  { icon:"🦁", color:"#6a3515" },
  medusa:    { icon:"🐍", color:"#2f5a2c" },
  minotaur:  { icon:"🐂", color:"#5b2b1f" },
  perseus:   { icon:"🛡️", color:"#55586a" },
  theseus:   { icon:"🧵", color:"#7a2d2d" },
  hades:     { icon:"👑", color:"#2d2238" },
  apollo:    { icon:"☀️", color:"#6a4d14" },
  artemis:   { icon:"🏹", color:"#355032" },
  hydra:     { icon:"🐉", color:"#30573d" }
};

let memoryCards       = [];
let memoryRevealed    = [];
let memoryLocked      = false;
let memoryMatchedPairs = 0;
let currentMemoryLevel = "normal";

function startMemory() {
  buildMemoryDeck();
  renderMemoryGame();
}

function buildMemoryDeck() {
  const deckEntries = memoryDecks[currentMemoryLevel].map(id => getEntryById(id)).filter(Boolean);
  memoryCards = shuffle(
    deckEntries.flatMap(entry => [
      { id:`${entry.id}-a`, pairId:entry.id, label:entry.name, type:entry.typeLabel,
        icon:memoryVisuals[entry.id]?.icon || "Ω", color:memoryVisuals[entry.id]?.color || "#4a2430" },
      { id:`${entry.id}-b`, pairId:entry.id, label:entry.name, type:entry.typeLabel,
        icon:memoryVisuals[entry.id]?.icon || "Ω", color:memoryVisuals[entry.id]?.color || "#4a2430" }
    ])
  );
  memoryRevealed     = [];
  memoryLocked       = false;
  memoryMatchedPairs = 0;
}

function renderMemoryGame() {
  memoryGrid.innerHTML = "";
  memoryGrid.dataset.memoryLevel = currentMemoryLevel;
  memoryLevelButtons.forEach(b =>
    b.classList.toggle("is-selected", b.dataset.memoryLevel === currentMemoryLevel)
  );

  memoryCards.forEach(card => {
    const isRevealed = memoryRevealed.includes(card.id);
    const isMatched  = card.matched;
    const btn = document.createElement("button");
    btn.className = "memory-card";
    btn.type      = "button";
    btn.disabled  = memoryLocked || isMatched;
    btn.style.setProperty("--memory-card-accent", card.color);
    btn.innerHTML = isRevealed || isMatched
      ? `<span class="memory-card-icon">${card.icon}</span><span class="memory-card-face">${card.label}</span><span class="memory-card-type">${card.type}</span>`
      : `<span class="memory-card-back">Ω</span>`;
    if (isRevealed || isMatched) btn.classList.add("is-revealed");
    if (isMatched)               btn.classList.add("is-matched");
    btn.addEventListener("click", () => handleMemoryPick(card.id));
    memoryGrid.appendChild(btn);
  });
}

function handleMemoryPick(cardId) {
  if (memoryLocked || memoryRevealed.includes(cardId)) return;
  memoryRevealed = [...memoryRevealed, cardId];
  renderMemoryGame();

  if (memoryRevealed.length < 2) {
    memoryStatus.textContent = "FIND THE MATCH";
    return;
  }

  memoryLocked = true;
  const [firstId, secondId] = memoryRevealed;
  const firstCard  = memoryCards.find(c => c.id === firstId);
  const secondCard = memoryCards.find(c => c.id === secondId);

  if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
    firstCard.matched  = true;
    secondCard.matched = true;
    memoryMatchedPairs++;
    memoryStatus.textContent = `✓ ${firstCard.label.toUpperCase()}`;
    memoryRevealed = [];
    memoryLocked   = false;
    renderMemoryGame();

    if (memoryMatchedPairs === memoryCards.length / 2) {
      memoryStatus.textContent = "ALL PAIRS FOUND!";
      recordMemoryComplete({ level: currentMemoryLevel });
      const reward = currentMemoryLevel === "hard" ? 5 : 3;
      let earned = 0;
      for (let i = 0; i < reward; i++) { if (addBoltFromGame("memory")) earned++; else break; }
      if (earned) triggerFlash();
    }
    return;
  }

  memoryStatus.textContent = "NOT A MATCH";
  setTimeout(() => {
    memoryRevealed = [];
    memoryLocked   = false;
    renderMemoryGame();
    memoryStatus.textContent = "MEMORY MATCH";
  }, 1200);
}

memoryLevelButtons.forEach(b =>
  b.addEventListener("click", () => {
    currentMemoryLevel = b.dataset.memoryLevel;
    buildMemoryDeck();
    renderMemoryGame();
    memoryStatus.textContent = "MEMORY MATCH";
  })
);

memoryReset.addEventListener("click", () => {
  buildMemoryDeck();
  renderMemoryGame();
  memoryStatus.textContent = "MEMORY MATCH";
});

// ── BATTLE CARDS (Pokémon-style) ──────────────────────────

const BP_HEROES = {
  theseus:  { name:"THESEUS",  icon:"🧵", hp:100, color:"#7a2d2d", moves:[
    { name:"THREAD TRICK",   power:[20,28], effect:null,      flavor:"used Ariadne's thread to dodge!" },
    { name:"SHIELD BASH",    power:[25,35], effect:null,      flavor:"slammed the shield hard!" },
    { name:"MAZE RUSH",      power:[15,22], effect:"stun",    flavor:"sprinted through the labyrinth!" },
    { name:"COURAGE",        power:[0,0],   effect:"heal",    flavor:"drew on heroic courage!" },
  ]},
  perseus:  { name:"PERSEUS",  icon:"🛡️", hp:100, color:"#55586a", moves:[
    { name:"REFLECT SHIELD", power:[28,38], effect:null,      flavor:"reflected the attack back!" },
    { name:"HARPE STRIKE",   power:[22,30], effect:null,      flavor:"struck with the divine blade!" },
    { name:"DIVINE WINGS",   power:[15,20], effect:"stun",    flavor:"swooped in from above!" },
    { name:"GORGON GAZE",    power:[30,42], effect:null,      flavor:"turned Medusa's power on the foe!" },
  ]},
  hercules: { name:"HERACLES", icon:"💪", hp:120, color:"#6a3515", moves:[
    { name:"TITAN SMASH",    power:[30,42], effect:null,      flavor:"unleashed legendary strength!" },
    { name:"LION SKIN",      power:[0,0],   effect:"shield",  flavor:"the Nemean hide absorbs the blow!" },
    { name:"WAR CRY",        power:[20,28], effect:"stun",    flavor:"roared across the battlefield!" },
    { name:"IRON GRIP",      power:[25,35], effect:null,      flavor:"grabbed and crushed!" },
  ]},
  odysseus: { name:"ODYSSEUS", icon:"⚓", hp:90,  color:"#124864", moves:[
    { name:"CLEVER TRICK",   power:[25,35], effect:null,      flavor:"outsmarted the enemy!" },
    { name:"WAX EARS",       power:[0,0],   effect:"shield",  flavor:"blocked the next attack!" },
    { name:"SEA WIND",       power:[20,30], effect:null,      flavor:"called the winds of Poseidon!" },
    { name:"MAST BIND",      power:[15,20], effect:"stun",    flavor:"lashed the enemy in place!" },
  ]},
  atalanta: { name:"ATALANTA", icon:"🏹", hp:95,  color:"#355032", moves:[
    { name:"ARROW RAIN",     power:[28,38], effect:null,      flavor:"let loose a volley of arrows!" },
    { name:"SWIFT FEET",     power:[15,22], effect:"stun",    flavor:"dodged at impossible speed!" },
    { name:"HUNTER'S EYE",   power:[25,35], effect:null,      flavor:"landed a perfect shot!" },
    { name:"BEAR SPIRIT",    power:[0,0],   effect:"heal",    flavor:"channeled Artemis's blessing!" },
  ]},
  jason:    { name:"JASON",    icon:"🐏", hp:95,  color:"#4a2a18", moves:[
    { name:"GOLDEN FLEECE",  power:[0,0],   effect:"heal",    flavor:"the fleece restores strength!" },
    { name:"ARGONAUT RALLY", power:[20,28], effect:"stun",    flavor:"called the Argonauts to charge!" },
    { name:"COLCHIS FIRE",   power:[28,38], effect:null,      flavor:"unleashed the fire of Colchis!" },
    { name:"SPEAR THRUST",   power:[25,32], effect:null,      flavor:"struck with the hero's spear!" },
  ]},
};

const BP_MONSTERS = {
  minotaur: { name:"MINOTAUR", icon:"🐂", hp:110, color:"#5b2b1f", moves:[
    { name:"GORE",            power:[22,32], effect:null,      flavor:"charged with horns!" },
    { name:"LABYRINTH RAGE",  power:[28,40], effect:null,      flavor:"went berserk in the maze!" },
    { name:"BULL RUSH",       power:[18,25], effect:"stun",    flavor:"sent the hero stumbling!" },
    { name:"ROAR",            power:[15,20], effect:null,      flavor:"shook the labyrinth walls!" },
  ]},
  medusa:   { name:"MEDUSA",   icon:"🐍", hp:95,  color:"#2f5a2c", moves:[
    { name:"STONE GAZE",      power:[30,42], effect:null,      flavor:"tried to petrify the hero!" },
    { name:"SNAKE STRIKE",    power:[20,30], effect:null,      flavor:"lunged with venomous fangs!" },
    { name:"HISS",            power:[15,22], effect:"stun",    flavor:"froze the hero with terror!" },
    { name:"PETRIFY",         power:[25,35], effect:null,      flavor:"the gorgon stare struck hard!" },
  ]},
  hydra:    { name:"HYDRA",    icon:"🐉", hp:130, color:"#30573d", moves:[
    { name:"MULTI-HEAD",      power:[25,35], effect:null,      flavor:"attacked with all nine heads!" },
    { name:"REGROW",          power:[0,0],   effect:"heal",    flavor:"two heads grew back!" },
    { name:"TOXIC BITE",      power:[20,30], effect:null,      flavor:"bit with venomous jaws!" },
    { name:"ACID SPRAY",      power:[28,38], effect:"stun",    flavor:"sprayed burning acid!" },
  ]},
  cyclops:  { name:"CYCLOPS",  icon:"👁️", hp:120, color:"#4a3820", moves:[
    { name:"BOULDER THROW",   power:[28,38], effect:null,      flavor:"hurled a massive rock!" },
    { name:"STOMP",           power:[22,30], effect:"stun",    flavor:"shook the ground!" },
    { name:"ONE-EYE GLARE",   power:[18,25], effect:null,      flavor:"glared with terrible fury!" },
    { name:"GIANT SWIPE",     power:[25,35], effect:null,      flavor:"swept a huge fist!" },
  ]},
  cerberus: { name:"CERBERUS", icon:"🐕", hp:115, color:"#2d2238", moves:[
    { name:"THREE-HEAD BITE", power:[30,42], effect:null,      flavor:"bit with three mouths at once!" },
    { name:"HELLFIRE",        power:[25,35], effect:null,      flavor:"breathed the fires of Hades!" },
    { name:"GUARD BRACE",     power:[0,0],   effect:"shield",  flavor:"the guard dog braced itself!" },
    { name:"UNDERWORLD HOWL", power:[18,25], effect:"stun",    flavor:"howled and stunned the hero!" },
  ]},
  chimera:  { name:"CHIMERA",  icon:"🔥", hp:105, color:"#6a1c14", moves:[
    { name:"FIRE BREATH",     power:[28,40], effect:null,      flavor:"breathed a column of fire!" },
    { name:"LION CLAW",       power:[22,30], effect:null,      flavor:"slashed with lion claws!" },
    { name:"GOAT CHARGE",     power:[18,25], effect:"stun",    flavor:"the goat head rammed hard!" },
    { name:"DRAGON TAIL",     power:[20,28], effect:null,      flavor:"whipped with the snake tail!" },
  ]},
};

// canon matchup: hero deals +25% damage
const BP_CANON = {
  theseus:  ["minotaur"],
  perseus:  ["medusa"],
  hercules: ["hydra","cerberus"],
  odysseus: ["cyclops"],
  jason:    ["chimera"],
  atalanta: [],
};

// ── Battle DOM refs ───────────────────────────────────────
const bpSelect      = document.querySelector("#bp-select");
const bpHeroGrid    = document.querySelector("#bp-hero-grid");
const bpVsHint      = document.querySelector("#bp-vs-hint");
const bpMonsterGrid = document.querySelector("#bp-monster-grid");
const bpGoBtn       = document.querySelector("#bp-go-btn");
const bpFight       = document.querySelector("#bp-fight");
const bpEnemyName   = document.querySelector("#bp-enemy-name");
const bpEnemyHpFill = document.querySelector("#bp-enemy-hp-fill");
const bpEnemyHpNum  = document.querySelector("#bp-enemy-hp-num");
const bpEnemySprite = document.querySelector("#bp-enemy-sprite");
const bpHeroName    = document.querySelector("#bp-hero-name");
const bpHeroHpFill  = document.querySelector("#bp-hero-hp-fill");
const bpHeroHpNum   = document.querySelector("#bp-hero-hp-num");
const bpHeroSprite  = document.querySelector("#bp-hero-sprite");
const bpMsgBox      = document.querySelector("#bp-msgbox");
const bpMsg         = document.querySelector("#bp-msg");
const bpMoves       = document.querySelector("#bp-moves");
const bpEndActions  = document.querySelector("#bp-end-actions");
const bpRematch     = document.querySelector("#bp-rematch");
const bpNewMatch    = document.querySelector("#bp-new-match");
const bpPhaseLabel  = document.querySelector("#battle-phase-label");

// ── Battle state ──────────────────────────────────────────
let bpHeroKey    = null;
let bpMonsterKey = null;
let bpHeroHp     = 0;
let bpMonsterHp  = 0;
let bpHeroMaxHp  = 0;
let bpMonsterMaxHp = 0;
let bpHeroShield   = false;
let bpMonsterShield = false;
let bpEnemyStunned = false;
let bpHeroStunned  = false;
let bpBusy         = false;

function startBattle() {
  bpSelect.hidden = false;
  bpFight.hidden  = true;
  bpHeroKey       = null;
  bpMonsterKey    = null;
  bpVsHint.hidden      = true;
  bpMonsterGrid.hidden = true;
  bpGoBtn.hidden       = true;
  bpPhaseLabel.textContent = "BATTLE";
  renderBpHeroGrid();
}

function renderBpHeroGrid() {
  bpHeroGrid.innerHTML = "";
  Object.entries(BP_HEROES).forEach(([key, hero]) => {
    const btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "bp-pick-card";
    btn.dataset.key = key;
    btn.innerHTML = `<span class="bp-pick-icon">${hero.icon}</span><span class="pixel bp-pick-name">${hero.name}</span>`;
    btn.addEventListener("click", () => {
      bpHeroKey = key;
      bpHeroGrid.querySelectorAll(".bp-pick-card").forEach(b => b.classList.toggle("is-selected", b.dataset.key === key));
      bpVsHint.hidden      = false;
      bpMonsterGrid.hidden = false;
      if (bpMonsterKey) bpGoBtn.hidden = false;
    });
    bpHeroGrid.appendChild(btn);
  });
}

function renderBpMonsterGrid() {
  bpMonsterGrid.innerHTML = "";
  Object.entries(BP_MONSTERS).forEach(([key, monster]) => {
    const btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "bp-pick-card";
    btn.dataset.key = key;
    btn.innerHTML = `<span class="bp-pick-icon">${monster.icon}</span><span class="pixel bp-pick-name">${monster.name}</span>`;
    btn.addEventListener("click", () => {
      bpMonsterKey = key;
      bpMonsterGrid.querySelectorAll(".bp-pick-card").forEach(b => b.classList.toggle("is-selected", b.dataset.key === key));
      if (bpHeroKey) bpGoBtn.hidden = false;
    });
    bpMonsterGrid.appendChild(btn);
  });
}

function bpRollDamage(move) {
  const [min, max] = move.power;
  if (min === 0 && max === 0) return 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bpApplyDamage(base, isHero, shielded) {
  let dmg = base;
  if (shielded) dmg = Math.floor(dmg / 2);
  if (isHero) {
    // hero attacking monster — check canon bonus
    if (BP_CANON[bpHeroKey]?.includes(bpMonsterKey)) dmg = Math.floor(dmg * 1.25);
  }
  return dmg;
}

function bpSetHp(isHero, newHp) {
  if (isHero) {
    bpHeroHp = Math.max(0, Math.min(bpHeroMaxHp, newHp));
    const pct = (bpHeroHp / bpHeroMaxHp) * 100;
    bpHeroHpFill.style.width = `${pct}%`;
    bpHeroHpFill.classList.toggle("bp-hp-low",    pct <= 25);
    bpHeroHpFill.classList.toggle("bp-hp-medium",  pct > 25 && pct <= 50);
    bpHeroHpNum.textContent = bpHeroHp;
  } else {
    bpMonsterHp = Math.max(0, Math.min(bpMonsterMaxHp, newHp));
    const pct = (bpMonsterHp / bpMonsterMaxHp) * 100;
    bpEnemyHpFill.style.width = `${pct}%`;
    bpEnemyHpFill.classList.toggle("bp-hp-low",    pct <= 25);
    bpEnemyHpFill.classList.toggle("bp-hp-medium",  pct > 25 && pct <= 50);
    bpEnemyHpNum.textContent = bpMonsterHp;
  }
}

function bpShake(el) {
  el.classList.remove("bp-shake");
  requestAnimationFrame(() => el.classList.add("bp-shake"));
  setTimeout(() => el.classList.remove("bp-shake"), 500);
}

function bpSetMsg(text) { bpMsg.textContent = text; }

function bpSetMoves(enabled) {
  bpMoves.querySelectorAll(".bp-move-btn").forEach(b => { b.disabled = !enabled; });
}

function bpStartFight() {
  const hero    = BP_HEROES[bpHeroKey];
  const monster = BP_MONSTERS[bpMonsterKey];

  bpHeroMaxHp    = hero.hp;
  bpMonsterMaxHp = monster.hp;
  bpHeroHp       = hero.hp;
  bpMonsterHp    = monster.hp;
  bpHeroShield   = false;
  bpMonsterShield = false;
  bpEnemyStunned = false;
  bpHeroStunned  = false;
  bpBusy         = false;

  bpSelect.hidden = true;
  bpFight.hidden  = false;
  bpEndActions.hidden = true;
  bpPhaseLabel.textContent = `${hero.name} VS ${monster.name}`;

  bpHeroSprite.textContent  = hero.icon;
  bpEnemySprite.textContent = monster.icon;
  bpHeroName.textContent    = hero.name;
  bpEnemyName.textContent   = monster.name;

  const isCanon = BP_CANON[bpHeroKey]?.includes(bpMonsterKey);
  bpSetHp(true,  hero.hp);
  bpSetHp(false, monster.hp);
  bpSetMsg(isCanon
    ? `A legendary matchup! What will ${hero.name} do?`
    : `What will ${hero.name} do?`);

  bpMoves.innerHTML = "";
  hero.moves.forEach((move, i) => {
    const btn = document.createElement("button");
    btn.type      = "button";
    btn.className = "bp-move-btn pixel";
    btn.textContent = move.name;
    btn.addEventListener("click", () => bpPlayerTurn(i));
    bpMoves.appendChild(btn);
  });
}

function bpDelay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function bpPlayerTurn(moveIndex) {
  if (bpBusy) return;
  bpBusy = true;
  bpSetMoves(false);

  const hero    = BP_HEROES[bpHeroKey];
  const monster = BP_MONSTERS[bpMonsterKey];
  const move    = hero.moves[moveIndex];

  bpSetMsg(`${hero.name} used ${move.name}!`);
  bpShake(bpEnemySprite);
  await bpDelay(700);

  if (move.effect === "heal") {
    const restored = Math.floor(Math.random() * 15) + 20;
    bpSetHp(true, bpHeroHp + restored);
    bpSetMsg(`${hero.name} ${move.flavor} Restored ${restored} HP!`);
  } else if (move.effect === "shield") {
    bpHeroShield = true;
    bpSetMsg(`${hero.name} ${move.flavor} Next hit reduced!`);
  } else {
    const base = bpRollDamage(move);
    const dmg  = bpApplyDamage(base, true, bpMonsterShield);
    bpMonsterShield = false;
    const isCanon = BP_CANON[bpHeroKey]?.includes(bpMonsterKey);
    bpSetHp(false, bpMonsterHp - dmg);
    const bonus = isCanon && dmg > base ? " Super effective!" : "";
    bpSetMsg(`${hero.name} ${move.flavor} ${dmg} damage!${bonus}`);
    if (move.effect === "stun") bpEnemyStunned = true;
  }

  await bpDelay(900);

  if (bpMonsterHp <= 0) { bpEndBattle(true); return; }

  // enemy turn
  if (bpEnemyStunned) {
    bpEnemyStunned = false;
    bpSetMsg(`${monster.name} is stunned and can't move!`);
    await bpDelay(900);
  } else {
    const eMove = monster.moves[Math.floor(Math.random() * monster.moves.length)];
    bpSetMsg(`${monster.name} used ${eMove.name}!`);
    bpShake(bpHeroSprite);
    await bpDelay(700);

    if (eMove.effect === "heal") {
      const restored = Math.floor(Math.random() * 15) + 20;
      bpSetHp(false, bpMonsterHp + restored);
      bpSetMsg(`${monster.name} ${eMove.flavor} Restored ${restored} HP!`);
    } else if (eMove.effect === "shield") {
      bpMonsterShield = true;
      bpSetMsg(`${monster.name} ${eMove.flavor} Next hit reduced!`);
    } else {
      const base = bpRollDamage(eMove);
      const dmg  = bpApplyDamage(base, false, bpHeroShield);
      bpHeroShield = false;
      bpSetHp(true, bpHeroHp - dmg);
      bpSetMsg(`${monster.name} ${eMove.flavor} ${dmg} damage!`);
      if (eMove.effect === "stun") bpHeroStunned = true;
    }
    await bpDelay(900);
  }

  if (bpHeroHp <= 0) { bpEndBattle(false); return; }

  if (bpHeroStunned) {
    bpHeroStunned = false;
    bpSetMsg(`${hero.name} is stunned! Shake it off…`);
    await bpDelay(900);
  }

  bpSetMsg(`What will ${hero.name} do?`);
  bpBusy = false;
  bpSetMoves(true);
}

function bpEndBattle(heroWon) {
  const hero    = BP_HEROES[bpHeroKey];
  const monster = BP_MONSTERS[bpMonsterKey];
  recordBattleResult({ winnerType: heroWon ? "hero" : "monster", winnerId: heroWon ? bpHeroKey : bpMonsterKey });

  if (heroWon) {
    triggerFlash();
    bpHeroSprite.classList.add("bp-winner-dance");
    bpSetMsg(`${hero.name} wins! ⚡`);
    const earned = addBoltFromGame("battle");
    if (earned) setTimeout(() => bpSetMsg(`${hero.name} wins! ⚡ +1 BOLT!`), 600);
  } else {
    bpSetMsg(`${monster.name} wins! Try again, hero…`);
  }

  bpEndActions.hidden = false;
  bpBusy = false;
}

bpGoBtn.addEventListener("click", () => {
  if (bpHeroKey && bpMonsterKey) bpStartFight();
});

bpRematch.addEventListener("click", () => {
  bpHeroSprite.classList.remove("bp-winner-dance");
  bpStartFight();
});

bpNewMatch.addEventListener("click", () => {
  bpHeroSprite.classList.remove("bp-winner-dance");
  startBattle();
});

// Render monster grid after hero grid (always visible after first hero pick)
renderBpMonsterGrid();

// ── WORD SEARCH ───────────────────────────────────────────
let currentWordSearchCategory = "mixed";
let currentWordSearch         = null;
let wordSearchFound           = new Set();
let wordSearchDrag            = null;

function startWordsearch() {
  buildWordSearch();
}

function playWordSearchChime(type = "word") {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx  = new AC();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "triangle";
  osc.frequency.value = type === "win" ? 720 : 560;
  gain.gain.value = 0.035;
  osc.start();
  osc.frequency.exponentialRampToValueAtTime(type === "win" ? 980 : 720, ctx.currentTime + (type === "win" ? 0.24 : 0.16));
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (type === "win" ? 0.28 : 0.18));
  osc.stop(ctx.currentTime + (type === "win" ? 0.3 : 0.2));
}

function createEmptyGrid(size) {
  return Array.from({ length:size }, () => Array.from({ length:size }, () => ""));
}

function canPlaceWord(grid, word, row, col, rStep, cStep) {
  for (let i = 0; i < word.length; i++) {
    const r = row + rStep * i, c = col + cStep * i;
    if (r < 0 || r >= grid.length || c < 0 || c >= grid.length) return false;
    const cur = grid[r][c];
    if (cur && cur !== word[i]) return false;
  }
  return true;
}

function placeWord(grid, word) {
  const dirs = shuffle([[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]]);
  for (const [rS, cS] of dirs) {
    for (let t = 0; t < 80; t++) {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid.length);
      if (!canPlaceWord(grid, word, row, col, rS, cS)) continue;
      for (let i = 0; i < word.length; i++) grid[row + rS*i][col + cS*i] = word[i];
      return { word, cells: Array.from({ length:word.length }, (_, i) => ({ row:row+rS*i, col:col+cS*i })) };
    }
  }
  return null;
}

function fillGrid(grid) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return grid.map(row => row.map(cell => cell || alpha[Math.floor(Math.random() * alpha.length)]));
}

function getSelectionCells(start, end) {
  if (!start || !end) return [];
  const rDelta = end.row - start.row, cDelta = end.col - start.col;
  const rStep = rDelta === 0 ? 0 : rDelta / Math.abs(rDelta);
  const cStep = cDelta === 0 ? 0 : cDelta / Math.abs(cDelta);
  const straight = rDelta === 0 || cDelta === 0 || Math.abs(rDelta) === Math.abs(cDelta);
  if (!straight) return [];
  const len = Math.max(Math.abs(rDelta), Math.abs(cDelta)) + 1;
  return Array.from({ length:len }, (_, i) => ({ row:start.row + rStep*i, col:start.col + cStep*i }));
}

function updateWordSearchCellStates() {
  if (!currentWordSearch) return;
  const selCells = wordSearchDrag ? getSelectionCells(wordSearchDrag.start, wordSearchDrag.end) : [];
  const selKeys  = new Set(selCells.map(c => `${c.row}-${c.col}`));
  const foundKeys = new Set(
    currentWordSearch.placements
      .filter(p => wordSearchFound.has(p.word))
      .flatMap(p => p.cells.map(c => `${c.row}-${c.col}`))
  );
  wordSearchGrid.querySelectorAll(".wordsearch-cell").forEach(cell => {
    const key = `${cell.dataset.row}-${cell.dataset.col}`;
    cell.classList.toggle("is-selected", selKeys.has(key));
    cell.classList.toggle("is-found",    foundKeys.has(key));
  });
}

function renderWordSearchList() {
  if (!currentWordSearch) return;
  wordSearchList.innerHTML = currentWordSearch.words
    .map(w => `<span class="wordsearch-word${wordSearchFound.has(w) ? " is-found" : ""}">${w}</span>`)
    .join("");
}

function finalizeWordSearchDrag() {
  if (!currentWordSearch || !wordSearchDrag) return;
  const selCells  = getSelectionCells(wordSearchDrag.start, wordSearchDrag.end);
  const selKey    = selCells.map(c => `${c.row}-${c.col}`).join("|");
  const reverseKey = [...selCells].reverse().map(c => `${c.row}-${c.col}`).join("|");

  const match = currentWordSearch.placements.find(p => {
    if (wordSearchFound.has(p.word)) return false;
    const pKey = p.cells.map(c => `${c.row}-${c.col}`).join("|");
    return pKey === selKey || pKey === reverseKey;
  });

  if (match) {
    wordSearchFound.add(match.word);
    recordWordSearchFound();
    playWordSearchChime("word");
    renderWordSearchList();
    wordSearchStatus.textContent = `✓ ${match.word}`;

    if (wordSearchFound.size === currentWordSearch.words.length) {
      wordSearchStatus.textContent = "ALL FOUND!";
      recordWordSearchComplete({ category: currentWordSearchCategory });
      playWordSearchChime("win");
      const earned = addScrollsFromGame(3);
      if (earned) triggerFlash();
    }
  }

  wordSearchDrag = null;
  updateWordSearchCellStates();
}

function renderWordSearchGridEl(grid) {
  wordSearchGrid.innerHTML = "";
  grid.forEach((row, ri) => {
    row.forEach((letter, ci) => {
      const cell = document.createElement("button");
      cell.type      = "button";
      cell.className = "wordsearch-cell";
      cell.textContent  = letter;
      cell.dataset.row  = String(ri);
      cell.dataset.col  = String(ci);
      cell.addEventListener("pointerdown", e => {
        e.preventDefault();
        wordSearchDrag = { start:{ row:ri, col:ci }, end:{ row:ri, col:ci } };
        updateWordSearchCellStates();
      });
      wordSearchGrid.appendChild(cell);
    });
  });
  updateWordSearchCellStates();
}

function buildWordSearch() {
  const pool       = wordSearchPools[currentWordSearchCategory] || wordSearchPools.mixed;
  const grid       = createEmptyGrid(WORDSEARCH_SIZE);
  const placements = [];
  for (const word of shuffle(pool)) {
    if (placements.length >= WORDSEARCH_WORDS) break;
    const p = placeWord(grid, word);
    if (p) placements.push(p);
  }
  currentWordSearch = { words:placements.map(p => p.word), placements, grid:fillGrid(grid) };
  wordSearchFound   = new Set();
  wordSearchDrag    = null;

  renderWordSearchGridEl(currentWordSearch.grid);
  renderWordSearchList();
  wordSearchStatus.textContent = `FIND ALL ${currentWordSearch.words.length}`;

  wordSearchCategoryButtons.forEach(b =>
    b.classList.toggle("is-selected", b.dataset.wordsearchCategory === currentWordSearchCategory)
  );
}

wordSearchCategoryButtons.forEach(b =>
  b.addEventListener("click", () => {
    currentWordSearchCategory = b.dataset.wordsearchCategory;
    buildWordSearch();
  })
);

wordSearchReset.addEventListener("click", buildWordSearch);

// Mobile drag: use pointermove + elementFromPoint on the grid so touch drag
// works reliably — pointerenter on sibling cells doesn't fire during touch
wordSearchGrid.addEventListener("pointermove", e => {
  if (!wordSearchDrag) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el || !el.dataset.row) return;
  const r = parseInt(el.dataset.row, 10);
  const c = parseInt(el.dataset.col, 10);
  if (wordSearchDrag.end.row === r && wordSearchDrag.end.col === c) return;
  wordSearchDrag.end = { row: r, col: c };
  updateWordSearchCellStates();
});

window.addEventListener("pointerup", finalizeWordSearchDrag);

// ── Init ───────────────────────────────────────────────────
showPicker();
