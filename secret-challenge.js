const STORAGE_KEY = "miles-math-progress";
const UNLOCK_TOTAL = 40;
const EASTER_EGG_KEY = "secret-maze-easter-egg";

const LEVELS = [
  {
    name: "Level 1",
    subtitle: "First hedge maze",
    minotaurSpeed: 1,
    rows: [
      "############",
      "#S..#......#",
      "#.#.#.####.#",
      "#.#...#....#",
      "#.###.#.##.#",
      "#...#.#.#..#",
      "###.#.#.#.##",
      "#...#...#..#",
      "#.#####.##.#",
      "#.....#....#",
      "#.###.####.#",
      "#...#.....E#"
    ],
    minotaurStart: { row: 10, col: 1 }
  },
  {
    name: "Level 2",
    subtitle: "Twisty grove",
    minotaurSpeed: 1,
    rows: [
      "############",
      "#S#...#....#",
      "#.#.#.#.##.#",
      "#...#...#..#",
      "###.###.#.##",
      "#.....#.#..#",
      "#.###.#.##.#",
      "#.#...#....#",
      "#.#.#####.##",
      "#...#......#",
      "#.#######..#",
      "#.........E#"
    ],
    minotaurStart: { row: 9, col: 10 }
  },
  {
    name: "Level 3",
    subtitle: "Royal maze",
    minotaurSpeed: 1,
    rows: [
      "############",
      "#S........##",
      "###.#####..#",
      "#...#...#..#",
      "#.###.#.#.##",
      "#.....#.#..#",
      "#.#####.#..#",
      "#.#.....##.#",
      "#.#.###....#",
      "#...#..###.#",
      "###.#......#",
      "#.........E#"
    ],
    minotaurStart: { row: 10, col: 1 }
  },
  {
    name: "Level 4",
    subtitle: "Minotaur champion",
    minotaurSpeed: 1,
    rows: [
      "############",
      "#S.......#.#",
      "###.####.#.#",
      "#...#....#.#",
      "#.###.##.#.#",
      "#.....##.#.#",
      "#.######.#.#",
      "#.#......#.#",
      "#.#.######.#",
      "#...#......#",
      "###.#.####.#",
      "#.........E#"
    ],
    minotaurStart: { row: 10, col: 1 }
  }
];

const TILE_SIZE = 44;
const WALL = "#";
const START = "S";
const EXIT = "E";

const lockedPanel = document.querySelector("#secret-locked-panel");
const lockedTitle = document.querySelector("#secret-locked-title");
const lockedCopy = document.querySelector("#secret-locked-copy");
const gamePanel = document.querySelector("#secret-game-panel");
const canvas = document.querySelector("#secret-canvas");
const restartButton = document.querySelector("#secret-restart");
const statusLabel = document.querySelector("#secret-status");
const movesLabel = document.querySelector("#secret-moves");
const correctCountLabel = document.querySelector("#secret-correct-count");
const levelLabel = document.querySelector("#secret-level");
const relicsLabel = document.querySelector("#secret-relics");
const livesLabel = document.querySelector("#secret-lives");
const timerLabel = document.querySelector("#secret-timer");
const tipLabel = document.querySelector("#secret-tip");
const banner = document.querySelector("#secret-banner");
const bannerTitle = document.querySelector("#secret-banner-title");
const bannerCopy = document.querySelector("#secret-banner-copy");

const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;

let easterEggMode = false;
let moveCount = 0;
let gameState = "playing";
let player = { row: 0, col: 0 };
let minotaur = { row: 0, col: 0 };
let exitTile = { row: 0, col: 0 };
let activeLevel = LEVELS[0];
let activeLevelIndex = 0;
let playerStart = { row: 0, col: 0 };
let relicTiles = [];
let collectedRelics = 0;
let livesRemaining = 3;
let elapsedSeconds = 0;
let timerInterval = null;

function getUnlockedLevelIndex(progress) {
  return Math.min(
    LEVELS.length - 1,
    Math.max(0, Math.floor(((progress.dailyCorrect || 0) - UNLOCK_TOTAL) / UNLOCK_TOTAL))
  );
}

function getMinotaurWakeMoves() {
  return [6, 6, 7, 7][activeLevelIndex] || 6;
}

function getMinotaurStride() {
  return [2, 2, 2, 2][activeLevelIndex] || 2;
}

function getCompletedSecretLevels(progress) {
  return progress.completedSecretLevels || 0;
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ensureTodayFields(parsed) {
  const currentTodayKey = getTodayKey();
  if (parsed.dateMode !== "local-v1" || (parsed.dailyDate || "") !== currentTodayKey) {
    return {
      ...parsed,
      dateMode: "local-v1",
      dailyDate: currentTodayKey,
      dailyCorrect: 0,
      dailyAnswered: 0,
      completedSecretLevels: 0
    };
  }

  return {
    ...parsed,
    dateMode: "local-v1",
    dailyDate: currentTodayKey,
    dailyCorrect: parsed.dailyCorrect || 0,
    dailyAnswered: parsed.dailyAnswered || 0,
    completedSecretLevels: parsed.completedSecretLevels || 0
  };
}

function loadProgress() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      totalCorrect: 0,
      dailyCorrect: 0,
      dailyDate: getTodayKey(),
      dateMode: "local-v1",
      completedSecretLevels: 0,
      minotaurWins: 0
    };
  }

  try {
    const parsed = ensureTodayFields(JSON.parse(saved));
    return {
      ...parsed,
      totalCorrect: parsed.totalCorrect || 0,
      dailyCorrect: parsed.dailyCorrect || 0,
      completedSecretLevels: parsed.completedSecretLevels || 0,
      minotaurWins: parsed.minotaurWins || 0
    };
  } catch {
    return {
      totalCorrect: 0,
      dailyCorrect: 0,
      dailyDate: getTodayKey(),
      dateMode: "local-v1",
      completedSecretLevels: 0,
      minotaurWins: 0
    };
  }
}

function saveProgress(progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function consumeEasterEggBypass() {
  const queryBypass = new URLSearchParams(window.location.search).get("egg") === "olympus-star";
  const storageBypass = window.localStorage.getItem(EASTER_EGG_KEY) === "true";

  if (storageBypass) {
    window.localStorage.removeItem(EASTER_EGG_KEY);
  }

  return queryBypass || storageBypass;
}

function clonePosition(position) {
  return { row: position.row, col: position.col };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function findTile(symbol) {
  for (let row = 0; row < activeLevel.rows.length; row += 1) {
    const col = activeLevel.rows[row].indexOf(symbol);
    if (col !== -1) {
      return { row, col };
    }
  }

  return { row: 0, col: 0 };
}

function getRelicGoal() {
  return [3, 3, 4, 4][activeLevelIndex] || 4;
}

function positionsMatch(a, b) {
  return a.row === b.row && a.col === b.col;
}

function getAllWalkableTiles() {
  const tiles = [];
  for (let row = 0; row < activeLevel.rows.length; row += 1) {
    for (let col = 0; col < activeLevel.rows[row].length; col += 1) {
      if (isWalkable(row, col) && activeLevel.rows[row][col] !== START && activeLevel.rows[row][col] !== EXIT) {
        tiles.push({ row, col });
      }
    }
  }
  return tiles;
}

function createRelics() {
  const walkable = getAllWalkableTiles().filter(
    (tile) =>
      !positionsMatch(tile, playerStart) &&
      !positionsMatch(tile, exitTile) &&
      !positionsMatch(tile, minotaur)
  );

  const selected = [];
  const targetCount = Math.min(getRelicGoal(), walkable.length);
  while (selected.length < targetCount && walkable.length > 0) {
    const index = Math.floor(Math.random() * walkable.length);
    const candidate = walkable.splice(index, 1)[0];
    if (selected.some((tile) => Math.abs(tile.row - candidate.row) + Math.abs(tile.col - candidate.col) < 2)) {
      continue;
    }
    selected.push(candidate);
  }

  relicTiles = selected;
  collectedRelics = 0;
}

function collectRelicIfPresent() {
  const relicIndex = relicTiles.findIndex((tile) => positionsMatch(tile, player));
  if (relicIndex === -1) {
    return false;
  }

  relicTiles.splice(relicIndex, 1);
  collectedRelics += 1;
  return true;
}

function updateBanner(title = "", copy = "", visible = false) {
  banner.hidden = !visible;
  bannerTitle.textContent = title;
  bannerCopy.textContent = copy;
}

function stopTimer() {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();
  timerInterval = window.setInterval(() => {
    if (gameState !== "playing") {
      return;
    }
    elapsedSeconds += 1;
    timerLabel.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function isWall(row, col) {
  return activeLevel.rows[row]?.[col] === WALL;
}

function isWalkable(row, col) {
  return !isWall(row, col) && activeLevel.rows[row]?.[col];
}

function findNearestWalkable(position) {
  if (isWalkable(position.row, position.col)) {
    return clonePosition(position);
  }

  const queue = [clonePosition(position)];
  const visited = new Set([`${position.row},${position.col}`]);

  while (queue.length > 0) {
    const current = queue.shift();
    const candidates = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 }
    ];

    for (const tile of candidates) {
      const key = `${tile.row},${tile.col}`;
      const inBounds =
        tile.row >= 0 &&
        tile.row < activeLevel.rows.length &&
        tile.col >= 0 &&
        tile.col < activeLevel.rows[0].length;

      if (!inBounds || visited.has(key)) {
        continue;
      }

      if (isWalkable(tile.row, tile.col)) {
        return tile;
      }

      visited.add(key);
      queue.push(tile);
    }
  }

  return findTile(START);
}

function getNeighbors(position) {
  const candidates = [
    { row: position.row - 1, col: position.col },
    { row: position.row + 1, col: position.col },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 }
  ];

  return candidates.filter((tile) => {
    const inBounds =
      tile.row >= 0 &&
      tile.row < activeLevel.rows.length &&
      tile.col >= 0 &&
      tile.col < activeLevel.rows[0].length;

    return inBounds && !isWall(tile.row, tile.col);
  });
}

function getPathStepToward(start, target) {
  if (start.row === target.row && start.col === target.col) {
    return start;
  }

  const queue = [start];
  const visited = new Set([`${start.row},${start.col}`]);
  const cameFrom = new Map();

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.row === target.row && current.col === target.col) {
      break;
    }

    getNeighbors(current).forEach((neighbor) => {
      const key = `${neighbor.row},${neighbor.col}`;
      if (visited.has(key)) {
        return;
      }

      visited.add(key);
      cameFrom.set(key, current);
      queue.push(neighbor);
    });
  }

  const targetKey = `${target.row},${target.col}`;
  if (!cameFrom.has(targetKey)) {
    const neighbors = getNeighbors(start);
    return neighbors[0] || start;
  }

  let step = target;
  let previous = cameFrom.get(targetKey);

  while (previous && (previous.row !== start.row || previous.col !== start.col)) {
    step = previous;
    previous = cameFrom.get(`${previous.row},${previous.col}`);
  }

  return step;
}

function updateHud(progress) {
  movesLabel.textContent = String(moveCount);
  correctCountLabel.textContent = String(progress.dailyCorrect || 0);
  levelLabel.textContent = `${activeLevel.name} • ${activeLevel.subtitle}`;
  relicsLabel.textContent = `${collectedRelics} / ${getRelicGoal()}`;
  livesLabel.textContent = String(livesRemaining);
  timerLabel.textContent = formatTime(elapsedSeconds);
  tipLabel.textContent =
    activeLevelIndex >= 2
      ? "The Minotaur now moves one square at a time, but the later mazes still punish wrong turns."
      : "The Minotaur waits a few moves before chasing. Grab relics, then head for the gate.";
}

function setStatus(message) {
  statusLabel.textContent = message;
}

function drawBoard() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#130c0d";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < activeLevel.rows.length; row += 1) {
    for (let col = 0; col < activeLevel.rows[row].length; col += 1) {
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;
      const tile = activeLevel.rows[row][col];

      if (tile === WALL) {
        context.fillStyle = "#24401f";
        context.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        context.fillStyle = "#35522e";
        context.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        context.fillStyle = "rgba(255, 255, 255, 0.06)";
        context.fillRect(x + 8, y + 8, TILE_SIZE - 16, TILE_SIZE - 16);
      } else {
        context.fillStyle = (row + col) % 2 === 0 ? "#1d1113" : "#211417";
        context.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }

      if (tile === EXIT) {
        const exitUnlocked = collectedRelics >= getRelicGoal();
        context.fillStyle = exitUnlocked ? "#f3c969" : "#7c6d4a";
        context.fillRect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
        context.strokeStyle = exitUnlocked ? "#fff2bf" : "#c9b488";
        context.lineWidth = 3;
        context.strokeRect(x + 10, y + 10, TILE_SIZE - 20, TILE_SIZE - 20);
        if (!exitUnlocked) {
          context.fillStyle = "#f8e6b8";
          context.beginPath();
          context.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2 - 4, 5, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
  }

  relicTiles.forEach((tile) => {
    const centerX = tile.col * TILE_SIZE + TILE_SIZE / 2;
    const centerY = tile.row * TILE_SIZE + TILE_SIZE / 2;
    context.fillStyle = "#ffe381";
    context.beginPath();
    context.moveTo(centerX, centerY - 11);
    context.lineTo(centerX + 7, centerY - 2);
    context.lineTo(centerX + 12, centerY + 10);
    context.lineTo(centerX, centerY + 4);
    context.lineTo(centerX - 12, centerY + 10);
    context.lineTo(centerX - 7, centerY - 2);
    context.closePath();
    context.fill();
  });

  const playerX = player.col * TILE_SIZE + TILE_SIZE / 2;
  const playerY = player.row * TILE_SIZE + TILE_SIZE / 2;
  context.fillStyle = "#7cc4ff";
  context.beginPath();
  context.arc(playerX, playerY, 13, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(playerX + 4, playerY - 4, 2.6, 0, Math.PI * 2);
  context.fill();

  const minotaurX = minotaur.col * TILE_SIZE + TILE_SIZE / 2;
  const minotaurY = minotaur.row * TILE_SIZE + TILE_SIZE / 2;
  context.fillStyle = "#8f4228";
  context.beginPath();
  context.arc(minotaurX, minotaurY, 14, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#e7bb7f";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(minotaurX - 10, minotaurY - 8);
  context.lineTo(minotaurX - 16, minotaurY - 18);
  context.moveTo(minotaurX + 10, minotaurY - 8);
  context.lineTo(minotaurX + 16, minotaurY - 18);
  context.stroke();
}

function resetGame(progress) {
  if (!easterEggMode) {
    activeLevelIndex = getCompletedSecretLevels(progress);
  }
  activeLevel = LEVELS[activeLevelIndex];
  canvas.width = activeLevel.rows[0].length * TILE_SIZE;
  canvas.height = activeLevel.rows.length * TILE_SIZE;
  playerStart = findTile(START);
  player = clonePosition(playerStart);
  exitTile = findTile(EXIT);
  minotaur = findNearestWalkable(activeLevel.minotaurStart);
  moveCount = 0;
  gameState = "playing";
  livesRemaining = 3;
  elapsedSeconds = 0;
  createRelics();
  updateBanner("", "", false);
  setStatus("Stay ahead of the Minotaur");
  updateHud(progress);
  drawBoard();
  startTimer();
}

function handleWin() {
  gameState = "won";
  stopTimer();
  const progress = loadProgress();
  progress.minotaurWins = (progress.minotaurWins || 0) + 1;
  if (!easterEggMode) {
    progress.completedSecretLevels = Math.max(getCompletedSecretLevels(progress), activeLevelIndex + 1);
  }
  saveProgress(progress);
  setStatus("Level cleared");
  updateBanner(
    "Maze cleared",
    `You escaped in ${formatTime(elapsedSeconds)} with ${livesRemaining} lives left and ${collectedRelics} relics collected.`,
    true
  );
  drawBoard();

  if (easterEggMode && activeLevelIndex < LEVELS.length - 1) {
    window.setTimeout(() => {
      activeLevelIndex += 1;
      resetGame(loadProgress());
      setStatus(`Level ${activeLevelIndex + 1} begins`);
    }, 1400);
  }
}

function handleLoss() {
  livesRemaining -= 1;
  if (livesRemaining > 0) {
    player = clonePosition(playerStart);
    minotaur = findNearestWalkable(activeLevel.minotaurStart);
    setStatus("Caught by the Minotaur. Try again from the start.");
    updateHud(loadProgress());
    drawBoard();
    return;
  }

  gameState = "lost";
  stopTimer();
  setStatus("The Minotaur caught you");
  updateBanner(
    "Maze over",
    `The Minotaur used up all 3 lives. Hit restart and try a different path.`,
    true
  );
  drawBoard();
}

function moveMinotaur() {
  if (moveCount <= getMinotaurWakeMoves()) {
    return;
  }

  if (moveCount % getMinotaurStride() !== 0) {
    return;
  }

  for (let stepCount = 0; stepCount < activeLevel.minotaurSpeed; stepCount += 1) {
    const nextStep = getPathStepToward(minotaur, player);
    minotaur = clonePosition(nextStep);
    if (player.row === minotaur.row && player.col === minotaur.col) {
      break;
    }
  }
}

function tryMovePlayer(nextRow, nextCol) {
  if (gameState !== "playing" || isWall(nextRow, nextCol)) {
    return;
  }

  player = { row: nextRow, col: nextCol };
  moveCount += 1;
  const gotRelic = collectRelicIfPresent();
  if (gotRelic) {
    setStatus("Relic collected");
  }

  if (player.row === exitTile.row && player.col === exitTile.col && collectedRelics >= getRelicGoal()) {
    handleWin();
    return;
  }

  moveMinotaur();

  if (player.row === minotaur.row && player.col === minotaur.col) {
    handleLoss();
    return;
  }

  if (!gotRelic) {
    setStatus(collectedRelics >= getRelicGoal() ? "The gate is open. Run." : "Keep moving");
  }
  updateHud(loadProgress());
  drawBoard();
}

function handleKeydown(event) {
  const moves = {
    ArrowUp: { row: -1, col: 0 },
    ArrowDown: { row: 1, col: 0 },
    ArrowLeft: { row: 0, col: -1 },
    ArrowRight: { row: 0, col: 1 }
  };

  const move = moves[event.key];
  if (!move) {
    return;
  }

  event.preventDefault();
  tryMovePlayer(player.row + move.row, player.col + move.col);
}

function init() {
  const progress = loadProgress();
  if (consumeEasterEggBypass()) {
    easterEggMode = true;
    activeLevelIndex = 0;
    lockedPanel.hidden = true;
    gamePanel.hidden = false;
    updateHud(progress);
    resetGame(progress);
    setStatus("Secret star path unlocked");
    window.addEventListener("keydown", handleKeydown);
    restartButton.addEventListener("click", () => {
      resetGame(progress);
    });
    return;
  }

  const unlockedCount = Math.floor((progress.dailyCorrect || 0) / UNLOCK_TOTAL);
  const completedCount = getCompletedSecretLevels(progress);

  if (unlockedCount === 0) {
    lockedPanel.hidden = false;
    gamePanel.hidden = true;
    lockedTitle.textContent = "Secret Challenge Not Ready Yet";
    lockedCopy.textContent = "This page unlocks after 40 correct answers today in Math Quest.";
    return;
  }

  if (completedCount >= unlockedCount) {
    lockedPanel.hidden = false;
    gamePanel.hidden = true;
    lockedTitle.textContent = "Secret Challenge Cleared";
    lockedCopy.textContent =
      "Miles beat the current secret maze. The next one appears after 40 more correct answers today.";
    return;
  }

  lockedPanel.hidden = true;
  gamePanel.hidden = false;
  updateHud(progress);
  resetGame(progress);
  window.addEventListener("keydown", handleKeydown);
  restartButton.addEventListener("click", () => {
    resetGame(progress);
  });
}

init();
