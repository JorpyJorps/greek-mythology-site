import { familyTree, getEntryById } from "./data.js";

const treeTitle = document.querySelector("#tree-title");
const treeIntro = document.querySelector("#tree-intro");
const treeNote = document.querySelector("#tree-note");
const treeBoard = document.querySelector("#tree-board");

function createPersonNode(person) {
  const entry = getEntryById(person.id);
  const node = document.createElement("a");
  node.className = "tree-node";
  node.href = `./profile.html#${person.id}`;
  node.innerHTML = `
    <span class="tree-node-kicker">${entry?.typeLabel || "Legend"}</span>
    <h3>${person.label}</h3>
    <p>${person.note}</p>
  `;
  return node;
}

function renderGenerations() {
  const wrap = document.createElement("section");
  wrap.className = "tree-section";

  familyTree.generations.forEach((generation, generationIndex) => {
    const block = document.createElement("article");
    block.className = "tree-generation";

    block.innerHTML = `
      <div class="tree-generation-header">
        <p class="card-kicker">Generation ${generationIndex + 1}</p>
        <h3>${generation.title}</h3>
        <p>${generation.subtitle}</p>
      </div>
    `;

    const people = document.createElement("div");
    people.className = "tree-generation-grid";
    generation.people.forEach((person) => people.appendChild(createPersonNode(person)));

    block.appendChild(people);
    wrap.appendChild(block);
  });

  return wrap;
}

function renderBranches() {
  const wrap = document.createElement("section");
  wrap.className = "tree-section";

  const header = document.createElement("div");
  header.className = "section-heading";
  header.innerHTML = `
    <p class="eyebrow">Family branches</p>
    <h2>Best-known family lines</h2>
    <p class="hero-text">This is where the genealogy becomes more specific.</p>
  `;
  wrap.appendChild(header);

  const branchGrid = document.createElement("div");
  branchGrid.className = "tree-branch-grid";

  familyTree.branches.forEach((branch) => {
    const article = document.createElement("article");
    article.className = "tree-branch";

    const parents = branch.parents.map((id) => getEntryById(id)).filter(Boolean);
    const children = branch.children.map((id) => getEntryById(id)).filter(Boolean);

    article.innerHTML = `
      <p class="card-kicker">${branch.title}</p>
      <div class="tree-branch-parents"></div>
      <div class="tree-branch-line" aria-hidden="true"></div>
      <div class="tree-branch-children"></div>
      <p class="tree-branch-note">${branch.note}</p>
    `;

    const parentWrap = article.querySelector(".tree-branch-parents");
    const childWrap = article.querySelector(".tree-branch-children");

    parents.forEach((entry) => {
      parentWrap.appendChild(
        createPersonNode({
          id: entry.id,
          label: entry.name,
          note: entry.title
        })
      );
    });

    if (children.length === 0) {
      const relationship = document.createElement("p");
      relationship.className = "tree-branch-relationship";
      relationship.textContent = "Marriage link";
      childWrap.appendChild(relationship);
    } else {
      children.forEach((entry) => {
        childWrap.appendChild(
          createPersonNode({
            id: entry.id,
            label: entry.name,
            note: entry.title
          })
        );
      });
    }

    branchGrid.appendChild(article);
  });

  wrap.appendChild(branchGrid);
  return wrap;
}

function renderQuickLinks() {
  const legend = document.createElement("section");
  legend.className = "tree-links";

  const heading = document.createElement("div");
  heading.className = "section-heading";
  heading.innerHTML = `
    <p class="eyebrow">Quick relationship list</p>
    <h2>Core links on this page</h2>
  `;
  legend.appendChild(heading);

  familyTree.links.forEach((link) => {
    const from = getEntryById(link.from);
    const to = getEntryById(link.to);
    const line = document.createElement("p");
    line.className = "tree-link-item";
    line.textContent = `${from?.name || link.from} ${link.label || "connects to"} ${to?.name || link.to}`;
    legend.appendChild(line);
  });

  return legend;
}

function renderTree() {
  treeTitle.textContent = familyTree.title;
  treeIntro.textContent = familyTree.intro;
  treeNote.textContent = familyTree.note;

  treeBoard.appendChild(renderGenerations());
  treeBoard.appendChild(renderBranches());
  treeBoard.appendChild(renderQuickLinks());
}

renderTree();
