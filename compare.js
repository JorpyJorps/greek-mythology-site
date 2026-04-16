import { getEntryById } from "./data.js";

const params = new URLSearchParams(window.location.search);
const compareGrid = document.querySelector("#compare-grid");
const compareTitle = document.querySelector("#compare-title");
const compareIntro = document.querySelector("#compare-intro");

const aliasMap = {
  heracles: "hercules",
  hercules: "hercules"
};

function normalizeEntryId(value) {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  return aliasMap[normalized] || normalized;
}

function resolveEntry(paramName) {
  const entryId = normalizeEntryId(params.get(paramName));
  return getEntryById(entryId) || null;
}

const first = resolveEntry("a");
const second = resolveEntry("b");

if (!first || !second) {
  compareTitle.textContent = "Compare Legends";
  compareIntro.textContent = "Pick two legends from the profile pages to compare them here.";
  compareGrid.innerHTML = `
    <article class="story-card">
      <p class="card-kicker">No comparison loaded</p>
      <h3>Open this from a legend page</h3>
      <p>This page needs two legends, like Zeus and Ares, to show the face-off.</p>
      <a class="button button-outline" href="./index.html">Back To Home</a>
    </article>
  `;
} else {
  compareTitle.textContent = `${first.name} vs ${second.name}`;
  compareIntro.textContent = "A quick side-by-side look at two legends.";

  [first, second].forEach((entry) => {
    const card = document.createElement("article");
    card.className = "story-card";
    card.innerHTML = `
      <p class="card-kicker">${entry.typeLabel}</p>
      <h3>${entry.name}</h3>
      <p><strong>Home:</strong> ${entry.home}</p>
      <p><strong>Symbol:</strong> ${entry.symbol}</p>
      <p>${entry.summary}</p>
      <p><strong>Powers:</strong> ${entry.powers.join(", ")}</p>
      <a class="button button-outline" href="./profile.html#${entry.id}">Open Profile</a>
    `;
    compareGrid.appendChild(card);
  });
}
