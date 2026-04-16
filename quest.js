import { questCatalog, questHeroes, questPlaces, questHelpers, getQuestBySelection } from "./quest-data.js?v=2";
import { recordQuestEnding } from "./stats.js";

const heroGrid = document.querySelector("#quest-hero-grid");
const placeGrid = document.querySelector("#quest-place-grid");
const helperGrid = document.querySelector("#quest-helper-grid");
const startButton = document.querySelector("#quest-start");
const resetButton = document.querySelector("#quest-reset");
const replayButton = document.querySelector("#quest-replay");
const newButton = document.querySelector("#quest-new");
const badges = document.querySelector("#quest-badges");
const trail = document.querySelector("#quest-trail");
const progressLabel = document.querySelector("#quest-progress");
const titleLabel = document.querySelector("#quest-title");
const textLabel = document.querySelector("#quest-text");
const choiceStack = document.querySelector("#quest-choice-stack");
const endingPanel = document.querySelector("#quest-ending");
const endingKicker = document.querySelector("#quest-ending-kicker");
const endingTitle = document.querySelector("#quest-ending-title");
const endingText = document.querySelector("#quest-ending-text");
const endingEpilogue = document.querySelector("#quest-ending-epilogue");
const endingReward = document.querySelector("#quest-ending-reward");
const buildPhase = document.querySelector(".quest-build-phase");
const readPhase = document.querySelector(".quest-read-phase");

let selectedHero = "";
let selectedPlace = "";
let selectedHelper = "";
let activeQuest = null;
let activeNode = null;
let currentStepIndex = 0;
let totalStorySteps = 0;
let choiceHistory = [];

function setQuestPhase(phase) {
  document.body.dataset.questPhase = phase;
  buildPhase.hidden = phase === "read";
  readPhase.hidden = false;
}

function getAvailableQuestForHero(heroId) {
  return questCatalog.find((quest) => quest.hero === heroId);
}

function getAvailableSelectionIds(heroId) {
  const quest = getAvailableQuestForHero(heroId);
  if (!quest) {
    return { placeId: "", helperId: "" };
  }

  return { placeId: quest.place, helperId: quest.helper };
}

function updateBadges() {
  const heroLabel = questHeroes.find((item) => item.id === selectedHero)?.label || "-";
  const placeLabel = questPlaces.find((item) => item.id === selectedPlace)?.label || "-";
  const helperLabel = questHelpers.find((item) => item.id === selectedHelper)?.label || "-";

  badges.innerHTML = `
    <span>Hero: ${heroLabel}</span>
    <span>Place: ${placeLabel}</span>
    <span>Helper: ${helperLabel}</span>
  `;
}

function renderTrail() {
  if (!trail) return;
  if (!choiceHistory.length) {
    trail.innerHTML = "";
    trail.hidden = true;
    return;
  }

  trail.hidden = false;
  trail.innerHTML = choiceHistory
    .map(
      (item, index) => `<span class="quest-trail-chip">${index + 1}. ${item}</span>`
    )
    .join("");
}

function createChoiceButton(item, selectedId, onSelect, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "quest-choice-card";
  button.textContent = item.label;
  button.disabled = disabled;
  button.classList.toggle("is-selected", item.id === selectedId);
  if (disabled) {
    button.classList.add("is-disabled");
  }
  button.addEventListener("click", () => onSelect(item.id));
  return button;
}

function renderHeroChoices() {
  heroGrid.innerHTML = "";
  questHeroes.forEach((hero) => {
    heroGrid.appendChild(
      createChoiceButton(hero, selectedHero, (heroId) => {
        selectedHero = heroId;
        const available = getAvailableSelectionIds(heroId);
        selectedPlace = available.placeId;
        selectedHelper = available.helperId;
        activeQuest = null;
        renderSelections();
      })
    );
  });
}

function renderPlaceChoices() {
  placeGrid.innerHTML = "";
  const available = getAvailableSelectionIds(selectedHero);

  questPlaces.forEach((place) => {
    const disabled = !selectedHero || place.id !== available.placeId;
    placeGrid.appendChild(
      createChoiceButton(
        place,
        selectedPlace,
        (placeId) => {
          selectedPlace = placeId;
          renderSelections();
        },
        disabled
      )
    );
  });
}

function renderHelperChoices() {
  helperGrid.innerHTML = "";
  const available = getAvailableSelectionIds(selectedHero);

  questHelpers.forEach((helper) => {
    const disabled = !selectedHero || helper.id !== available.helperId;
    helperGrid.appendChild(
      createChoiceButton(
        helper,
        selectedHelper,
        (helperId) => {
          selectedHelper = helperId;
          renderSelections();
        },
        disabled
      )
    );
  });
}

function renderSelections() {
  renderHeroChoices();
  renderPlaceChoices();
  renderHelperChoices();
  updateBadges();

  const validQuest = getQuestBySelection(selectedHero, selectedPlace, selectedHelper);
  startButton.disabled = !validQuest;

  if (!activeQuest) {
    progressLabel.textContent = "Step 0 of 0";
    titleLabel.textContent = validQuest ? validQuest.title : "Build a quest to begin.";
    textLabel.textContent = validQuest
      ? validQuest.summary
      : "Pick a hero, place, and helper on the left. Then the story will begin here.";
    choiceStack.innerHTML = "";
    choiceHistory = [];
    renderTrail();
    endingPanel.hidden = true;
    setQuestPhase("build");
  }
}

function getStoryNode(quest, nodeId) {
  if (quest.start.id === nodeId) return quest.start;
  return quest.steps.find((step) => step.id === nodeId) || null;
}

function getEnding(quest, endingId) {
  return quest.endings.find((ending) => ending.id === endingId) || null;
}

function getEndingKicker(result, mythTrue) {
  if (mythTrue) return "Legend Path";
  if (result === "win") return "Hero Win";
  if (result === "close") return "Close Call";
  if (result === "twist") return "Twist Ending";
  return "Try Again";
}

function showEnding(ending) {
  recordQuestEnding({
    hero: activeQuest.hero,
    result: ending.result,
    mythTrue: Boolean(ending.mythTrue)
  });
  progressLabel.textContent = `Step ${totalStorySteps} of ${totalStorySteps}`;
  titleLabel.textContent = activeQuest.title;
  textLabel.textContent = "Quest complete.";
  choiceStack.innerHTML = "";
  endingPanel.hidden = false;
  endingKicker.textContent = getEndingKicker(ending.result, ending.mythTrue);
  endingTitle.textContent = ending.title;
  endingText.textContent = ending.text;
  endingEpilogue.textContent = ending.epilogue || "";
  endingReward.textContent = ending.reward || "";
  endingEpilogue.hidden = !ending.epilogue;
  endingReward.hidden = !ending.reward;
  renderTrail();
}

function renderStoryNode() {
  endingPanel.hidden = true;
  progressLabel.textContent = `Step ${currentStepIndex + 1} of ${totalStorySteps}`;
  titleLabel.textContent = activeQuest.title;
  textLabel.textContent = activeNode.text;
  choiceStack.innerHTML = "";

  activeNode.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option quest-story-choice";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      choiceHistory = [...choiceHistory, choice.label];
      const nextNode = getStoryNode(activeQuest, choice.next);
      if (nextNode) {
        activeNode = nextNode;
        currentStepIndex += 1;
        renderTrail();
        renderStoryNode();
        return;
      }

      const ending = getEnding(activeQuest, choice.next);
      if (ending) {
        showEnding(ending);
      }
    });
    choiceStack.appendChild(button);
  });
}

function startQuest() {
  activeQuest = getQuestBySelection(selectedHero, selectedPlace, selectedHelper);
  if (!activeQuest) {
    return;
  }

  totalStorySteps = activeQuest.sceneCount || activeQuest.steps.length + 1;
  currentStepIndex = 0;
  activeNode = activeQuest.start;
  choiceHistory = [];
  renderTrail();
  setQuestPhase("read");
  readPhase.scrollIntoView({ behavior: "smooth", block: "start" });
  renderStoryNode();
}

function resetSelections() {
  selectedHero = "";
  selectedPlace = "";
  selectedHelper = "";
  activeQuest = null;
  activeNode = null;
  currentStepIndex = 0;
  totalStorySteps = 0;
  choiceHistory = [];
  renderSelections();
}

function replayQuest() {
  if (!activeQuest) {
    return;
  }

  totalStorySteps = activeQuest.sceneCount || activeQuest.steps.length + 1;
  currentStepIndex = 0;
  activeNode = activeQuest.start;
  choiceHistory = [];
  renderTrail();
  setQuestPhase("read");
  renderStoryNode();
}

startButton.addEventListener("click", startQuest);
resetButton.addEventListener("click", resetSelections);
replayButton.addEventListener("click", replayQuest);
newButton.addEventListener("click", resetSelections);

setQuestPhase("build");
renderSelections();
