import { getStoryById } from "./data.js";

const storyId = window.location.hash.replace(/^#/, "");
const pageTitle = document.querySelector("#story-page-title");
const storyTitle = document.querySelector("#story-title");
const storyLevel = document.querySelector("#story-level");
const storyBadges = document.querySelector("#story-badges");
const storyBody = document.querySelector("#story-body");

const story = getStoryById(storyId);

if (story) {
  pageTitle.textContent = story.title;
  storyTitle.textContent = story.title;
  storyLevel.textContent = `${story.level} • ${story.readTime}`;
  storyBadges.innerHTML = `
    <span>${story.level}</span>
    <span>${story.readTime}</span>
    <span>Myth Story</span>
  `;
  storyBody.innerHTML = story.body.map((paragraph) => `<p>${paragraph}</p>`).join("");
}
