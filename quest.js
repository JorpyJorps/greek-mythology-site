import { questCatalog } from "./quest-data.js";
import { recordQuestEnding } from "./stats.js";

// ── Storage ────────────────────────────────────────────────
const SCROLL_KEY = "miles-scrolls";

// ── Hero metadata for the picker ──────────────────────────
const HERO_META = {
  theseus:  { icon: "🧵", label: "THESEUS" },
  perseus:  { icon: "🛡️", label: "PERSEUS" },
  hercules: { icon: "💪", label: "HERACLES" },
  odysseus: { icon: "⚓", label: "ODYSSEUS" },
  atalanta: { icon: "🏹", label: "ATALANTA" },
  jason:    { icon: "🐏", label: "JASON" },
};

// ── Scroll rewards by ending type ─────────────────────────
const SCROLL_REWARDS = {
  "legend-path": 5,   // followed the real myth — best reward
  "win":         3,
  "close":       3,
  "twist":       2,
  "fail":        1,   // still earns something
};

// ── DOM refs ──────────────────────────────────────────────
const pickerEl      = document.querySelector("#quest-picker");
const readerEl      = document.querySelector("#quest-reader");
const heroGrid      = document.querySelector("#quest-hero-grid");
const questTitle    = document.querySelector("#quest-title");
const questText     = document.querySelector("#quest-text");
const choiceStack   = document.querySelector("#quest-choice-stack");
const endingPanel   = document.querySelector("#quest-ending");
const endingKicker  = document.querySelector("#quest-ending-kicker");
const endingTitle   = document.querySelector("#quest-ending-title");
const endingText    = document.querySelector("#quest-ending-text");
const endingEpilogue = document.querySelector("#quest-ending-epilogue");
const stepHud       = document.querySelector("#quest-step-hud");
const backBtn       = document.querySelector("#quest-back-btn");
const replayBtn     = document.querySelector("#quest-replay");
const newBtn        = document.querySelector("#quest-new");
const scrollFlash   = document.querySelector("#quest-scroll-flash");
const scrollMsg     = document.querySelector("#quest-scroll-msg");
const scrollCountPicker = document.querySelector("#scroll-count-picker");
const scrollCountReader = document.querySelector("#scroll-count-reader");

// ── State ─────────────────────────────────────────────────
let activeQuest   = null;
let activeNode    = null;
let stepIndex     = 0;
let totalSteps    = 0;

// ── Scroll helpers ────────────────────────────────────────
function getScrolls() {
  return parseInt(localStorage.getItem(SCROLL_KEY) || "0", 10);
}

function addScrolls(n) {
  const total = getScrolls() + n;
  localStorage.setItem(SCROLL_KEY, String(total));
  renderScrollHud();
  showScrollFlash(n);
}

function renderScrollHud() {
  const n = String(getScrolls());
  if (scrollCountPicker) scrollCountPicker.textContent = n;
  if (scrollCountReader) scrollCountReader.textContent = n;
}

function showScrollFlash(n) {
  if (!scrollFlash) return;
  scrollMsg.textContent = `+${n} SCROLL${n !== 1 ? "S" : ""}!`;
  scrollFlash.classList.remove("is-active");
  requestAnimationFrame(() => scrollFlash.classList.add("is-active"));
  setTimeout(() => scrollFlash.classList.remove("is-active"), 2000);
}

// ── Phase switching ───────────────────────────────────────
function showPicker() {
  pickerEl.hidden = false;
  readerEl.hidden = true;
  activeQuest = null;
  activeNode  = null;
  renderScrollHud();
}

function showReader() {
  pickerEl.hidden = true;
  readerEl.hidden = false;
  renderScrollHud();
}

// ── Picker ────────────────────────────────────────────────
function renderPicker() {
  heroGrid.innerHTML = "";
  questCatalog.forEach(quest => {
    const meta = HERO_META[quest.hero] || { icon: "⚡", label: quest.hero.toUpperCase() };
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quest-hero-card pixel";
    btn.innerHTML = `
      <span class="quest-hero-icon">${meta.icon}</span>
      <span class="quest-hero-name">${meta.label}</span>
      <span class="quest-hero-sub">${quest.title}</span>
    `;
    btn.addEventListener("click", () => startQuest(quest));
    heroGrid.appendChild(btn);
  });
}

// ── Quest logic ───────────────────────────────────────────
function getNode(id) {
  if (activeQuest.start.id === id) return activeQuest.start;
  return activeQuest.steps?.find(s => s.id === id) || null;
}

function getEnding(id) {
  return activeQuest.endings?.find(e => e.id === id) || null;
}

function startQuest(quest) {
  activeQuest = quest;
  totalSteps  = quest.sceneCount || (quest.steps?.length || 0) + 1;
  stepIndex   = 0;
  activeNode  = quest.start;
  endingPanel.hidden = true;
  showReader();
  renderNode();
}

function renderNode() {
  endingPanel.hidden = true;
  choiceStack.innerHTML = "";
  questTitle.textContent = activeQuest.title.toUpperCase();
  questText.textContent  = activeNode.text;
  stepHud.textContent    = `${stepIndex + 1} / ${totalSteps}`;

  activeNode.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quest-story-choice";
    btn.textContent = choice.label;
    btn.addEventListener("click", () => handleChoice(choice));
    choiceStack.appendChild(btn);
  });
}

function handleChoice(choice) {
  const next = choice.next;
  const node = getNode(next);
  if (node) {
    activeNode = node;
    stepIndex += 1;
    renderNode();
    return;
  }
  const ending = getEnding(next);
  if (ending) showEnding(ending);
}

function showEnding(ending) {
  recordQuestEnding({
    hero: activeQuest.hero,
    result: ending.result,
    mythTrue: Boolean(ending.mythTrue),
  });

  choiceStack.innerHTML = "";
  questText.textContent = "";
  stepHud.textContent   = `${totalSteps} / ${totalSteps}`;

  const kicker = ending.mythTrue ? "★ LEGEND PATH" :
    ending.result === "win"   ? "HERO WIN"   :
    ending.result === "close" ? "CLOSE CALL" :
    ending.result === "twist" ? "TWIST"      : "TRY AGAIN";

  endingKicker.textContent   = kicker;
  endingTitle.textContent    = ending.title || "";
  endingText.textContent     = ending.text  || "";
  if (ending.epilogue) {
    endingEpilogue.textContent = ending.epilogue;
    endingEpilogue.hidden = false;
  } else {
    endingEpilogue.hidden = true;
  }

  endingPanel.hidden = false;

  // earn scrolls
  const resultKey = ending.mythTrue ? "legend-path" : (ending.result || "fail");
  const earned = SCROLL_REWARDS[resultKey] ?? 1;
  addScrolls(earned);
}

// ── Controls ──────────────────────────────────────────────
backBtn.addEventListener("click", showPicker);
replayBtn.addEventListener("click", () => {
  if (activeQuest) startQuest(activeQuest);
});
newBtn.addEventListener("click", showPicker);

// ── Init ──────────────────────────────────────────────────
renderPicker();
showPicker();
