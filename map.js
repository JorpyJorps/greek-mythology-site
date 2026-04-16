import { mythLocations, getEntryById } from "./data.js";

const mapGrid = document.querySelector("#map-grid");
const activeHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

mythLocations.forEach((location) => {
  const card = document.createElement("article");
  card.className = "story-card";
  if (location.name === activeHash) {
    card.classList.add("is-map-active");
  }

  const residents = location.residents
    .map((id) => getEntryById(id))
    .filter(Boolean)
    .map(
      (entry) => `<a class="entry-link" href="./profile.html#${entry.id}">${entry.name}</a>`
    )
    .join(" • ");

  card.innerHTML = `
    <p class="card-kicker">Myth Place</p>
    <h3>${location.name}</h3>
    <p>${location.vibe}</p>
    <p>${residents}</p>
  `;
  mapGrid.appendChild(card);
});
