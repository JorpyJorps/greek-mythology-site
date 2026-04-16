import {
  entries,
  getEntryById,
  getRelatedEntries,
  getMonsterProfile,
  getStoryForEntry
} from "./data.js";

const params = new URLSearchParams(window.location.search);
const legacyIdMap = {
  heracles: "hercules",
  hercules: "hercules"
};

function resolveEntryFromParams() {
  const rawHash = window.location.hash.replace(/^#/, "");
  const rawId = rawHash || params.get("id");
  if (!rawId) {
    return entries[0];
  }

  const normalizedId = rawId.trim().toLowerCase();
  return getEntryById(normalizedId) || getEntryById(legacyIdMap[normalizedId]) || null;
}

const entry = resolveEntryFromParams();

const profileName = document.querySelector("#profile-name");
const profileType = document.querySelector("#profile-type");
const profileTitle = document.querySelector("#profile-title");
const profileSummary = document.querySelector("#profile-summary");
const profileAbout = document.querySelector("#profile-about");
const profileSymbol = document.querySelector("#profile-symbol");
const profileHome = document.querySelector("#profile-home");
const profileColor = document.querySelector("#profile-color");
const profileStory = document.querySelector("#profile-story");
const profileFacts = document.querySelector("#profile-facts");
const profilePowers = document.querySelector("#profile-powers");
const relatedGrid = document.querySelector("#related-grid");
const miniStage = document.querySelector("#mini-stage");
const miniTitle = document.querySelector("#mini-title");
const readAloudButton = document.querySelector("#read-aloud");
const favoriteButton = document.querySelector("#favorite-profile");
const mapLink = document.querySelector("#map-link");
const compareCopy = document.querySelector("#compare-copy");
const monsterPanel = document.querySelector("#monster-panel");
const monsterDanger = document.querySelector("#monster-danger");
const monsterSize = document.querySelector("#monster-size");
const monsterWeakness = document.querySelector("#monster-weakness");
const profileStoryLink = document.querySelector("#profile-story-link");

const FAVORITES_KEY = "myth-favorites";
const portraitImageMap = {
  aphrodite: "./assets/Characters/aphrodite.png",
  apollo: "./assets/Characters/apollo.png",
  artemis: "./assets/Characters/artemis.png",
  athena: "./assets/Characters/athena.png",
  demeter: "./assets/Characters/demeter.png",
  hades: "./assets/Characters/hades.png",
  hephaestus: "./assets/Characters/hephaestus.png",
  hera: "./assets/Characters/hera.png",
  hestia: "./assets/Characters/hestia.png",
  poseidon: "./assets/Characters/poseidon.png",
  zeus: "./assets/Characters/zeus.png"
};

function loadFavorites() {
  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

if (!entry) {
  document.title = "Legend Not Found | Miles' Greek Mythology Explorer";
  profileName.textContent = "Legend not found";
  profileType.textContent = "Missing Legend";
  profileTitle.textContent = "That page link did not match a myth profile";
  profileSummary.textContent =
    "Try going back to the explorer and opening the profile again from the correct card.";
  profileAbout.textContent =
    "This page could not explain who this legend is because the profile link did not match a saved entry.";
  profileSymbol.textContent = "Symbol: Unknown";
  profileHome.textContent = "Home: Unknown";
  profileColor.textContent = "Legend Color: Unknown";
  profileStory.textContent =
    "The requested legend id was not found in the site data, so this page could not load a profile.";
  miniTitle.textContent = "Legend build unavailable";
  miniStage.innerHTML = "";
}

function buildAboutText(currentEntry) {
  const baseRole = `${currentEntry.name} is ${/^[aeiou]/i.test(currentEntry.title) ? "an" : "a"} ${currentEntry.title.toLowerCase()}.`;
  const importance = `They are important because ${currentEntry.summary.charAt(0).toLowerCase()}${currentEntry.summary.slice(1)}`;

  const customAbout = {
    zeus:
      "Zeus is the king of the gods in Greek mythology. He is important because he rules the sky, storms, and thunder, and many other gods and heroes connect back to his stories.",
    athena:
      "Athena is the goddess of wisdom in Greek mythology. She is important because she guides smart plans, brave heroes, and careful thinking in many famous myths.",
    poseidon:
      "Poseidon is the god of the sea in Greek mythology. He is important because he controls the waves, storms, and earthquakes, so sailors and heroes often fear or seek his help.",
    hades:
      "Hades is the ruler of the Underworld in Greek mythology. He is important because he guards the realm of the dead and plays a major part in stories about life, loss, and fate.",
    artemis:
      "Artemis is the goddess of the hunt in Greek mythology. She is important because she protects wild places, animals, and young people, and she is known for her skill with a bow."
  };
  const relationshipNotes = {
    zeus: "He is married to Hera and is the son of the Titans Cronus and Rhea.",
    athena: "She is a daughter of Zeus and is closely linked to the city of Athens.",
    poseidon: "He is a brother of Zeus and Hades and a son of Cronus and Rhea.",
    apollo: "He is the twin brother of Artemis and a son of Zeus.",
    artemis: "She is the twin sister of Apollo and a daughter of Zeus.",
    hera: "She is the wife of Zeus and one of the main rulers of Olympus.",
    demeter: "She is the mother of Persephone, and their story helps explain the seasons.",
    hestia: "She is one of the elder Olympian sisters and a daughter of Cronus and Rhea.",
    ares: "He is a son of Zeus and Hera and one of the war gods of Olympus.",
    hades:
      "He is a brother of Zeus and Poseidon and is often connected with Persephone as queen of the Underworld.",
    hermes: "He is a son of Zeus and often carries messages between gods, heroes, and the Underworld.",
    dionysus: "He is a son of Zeus and one of the younger Olympian gods.",
    persephone: "She is Demeter's daughter and is closely linked with Hades and the Underworld.",
    hercules: "He is a son of Zeus and is one of the most famous demigod heroes.",
    odysseus: "He is the hero of the Odyssey and is tied to stories about Ithaca, the Cyclops, and the Sirens.",
    perseus: "He is most closely linked to Medusa and is famous for defeating her with a mirrored shield.",
    theseus: "He is the hero most closely linked to the Minotaur and the city of Athens.",
    jason: "He led the Argonauts on the quest for the Golden Fleece.",
    bellerophon: "He is famous for riding Pegasus and battling the Chimera.",
    cronus: "He is the father of Zeus, Poseidon, Hades, Hera, Demeter, and Hestia.",
    rhea: "She is the mother of Zeus, Poseidon, Hades, Hera, Demeter, and Hestia.",
    atlas: "He fought on the Titan side against Zeus and the Olympian gods.",
    prometheus: "He is a Titan best known for helping humans and angering Zeus by bringing them fire.",
    hyperion: "He belongs to the older Titan generation that came before the Olympian gods.",
    oceanus: "He is one of the elder Titans and belongs to the older world before Olympus ruled.",
    medusa: "She is most closely linked to Perseus, who defeats her with a mirrored shield.",
    minotaur: "He is the monster most closely linked to Theseus and the Labyrinth of Crete.",
    cyclops: "The most famous Cyclops is Polyphemus, who is closely linked to Odysseus.",
    cerberus: "He guards Hades's realm and is famously captured by Heracles in one labor.",
    hydra: "It is one of Heracles's most famous monster battles.",
    chimera: "It is most closely linked to Bellerophon, who fights it while riding Pegasus.",
    sphinx: "It is linked to the city of Thebes and the famous riddle answered by Oedipus.",
    sirens: "They are most closely linked to Odysseus and his long voyage home.",
    scylla: "She is one of the sea dangers Odysseus faces on his voyage.",
    charybdis: "She is paired with Scylla in one of Odysseus's hardest sea choices.",
    "nemean-lion": "It is one of Heracles's most famous labors, and he later wears its lion skin."
  };

  if (customAbout[currentEntry.id]) {
    return relationshipNotes[currentEntry.id]
      ? `${customAbout[currentEntry.id]} ${relationshipNotes[currentEntry.id]}`
      : customAbout[currentEntry.id];
  }

  return relationshipNotes[currentEntry.id]
    ? `${baseRole} ${importance} ${relationshipNotes[currentEntry.id]}`
    : `${baseRole} ${importance}`;
}

const portraitThemes = {
  zeus: {
    suit: "#efe0a1",
    accent: "#f3c969",
    cape: "#f7edd0",
    hair: "#f7f1db",
    head: "#f6c27a",
    accessory: "bolt",
    emblem: "lightning",
    backdrop: "storm"
  },
  athena: {
    suit: "#d9ddd8",
    accent: "#c8a24a",
    cape: "#f1efe6",
    hair: "#4a2f1f",
    head: "#efbd86",
    hairStyle: "long",
    feminine: true,
    accessory: "owl-spear",
    emblem: "owl",
    backdrop: "temple"
  },
  poseidon: {
    suit: "#3f7ea6",
    accent: "#9ed7ff",
    cape: "#205c82",
    hair: "#f2f5f7",
    head: "#f1c289",
    accessory: "trident",
    emblem: "wave",
    backdrop: "sea"
  },
  artemis: {
    suit: "#7ea57a",
    accent: "#d5e8b0",
    cape: "#5f7d56",
    hair: "#6c4a2c",
    head: "#efbe88",
    hairStyle: "long",
    feminine: true,
    accessory: "bow-quiver",
    emblem: "moon",
    backdrop: "forest"
  },
  apollo: {
    suit: "#f0c85a",
    accent: "#fff2b2",
    cape: "#f49f34",
    hair: "#f0d978",
    head: "#f0c389",
    accessory: "sun-lyre",
    emblem: "sun",
    backdrop: "sun"
  },
  hera: {
    suit: "#d6b66d",
    accent: "#fff0b8",
    cape: "#f3e0a8",
    hair: "#5f351f",
    head: "#efbf88",
    hairStyle: "long",
    feminine: true,
    accessory: "crown-staff",
    emblem: "star",
    backdrop: "temple"
  },
  demeter: {
    suit: "#c7a34d",
    accent: "#f5df95",
    cape: "#86611d",
    hair: "#7a5022",
    head: "#efc18b",
    hairStyle: "long",
    feminine: true,
    accessory: "wheat",
    emblem: "leaf",
    backdrop: "spring"
  },
  hestia: {
    suit: "#db9f59",
    accent: "#ffd79d",
    cape: "#954522",
    hair: "#6b3f25",
    head: "#efc18a",
    hairStyle: "long",
    feminine: true,
    accessory: "hearth-flame",
    emblem: "fire",
    backdrop: "temple"
  },
  hercules: {
    suit: "#8d5b35",
    accent: "#d59a47",
    cape: "#c46f2e",
    hair: "#6a3d24",
    head: "#efbc83",
    accessory: "club",
    emblem: "lion",
    backdrop: "arena"
  },
  aphrodite: {
    suit: "#d48ca5",
    accent: "#ffd4df",
    cape: "#8f4b64",
    hair: "#b46a5d",
    head: "#efc18c",
    hairStyle: "long",
    feminine: true,
    accessory: "mirror",
    emblem: "leaf",
    backdrop: "spring"
  },
  hephaestus: {
    suit: "#8f5a36",
    accent: "#f0b36e",
    cape: "#542e18",
    hair: "#4c2b18",
    head: "#e7b682",
    accessory: "hammer",
    emblem: "fire",
    backdrop: "mountain"
  },
  ares: {
    suit: "#9e4741",
    accent: "#f0a58d",
    cape: "#5c1f1f",
    hair: "#4d2718",
    head: "#e6b27e",
    accessory: "war-spear",
    emblem: "star",
    backdrop: "arena"
  },
  odysseus: {
    suit: "#5b6f86",
    accent: "#cfb07c",
    cape: "#3c4f66",
    hair: "#51311e",
    head: "#edbb84",
    accessory: "sword",
    emblem: "ship",
    backdrop: "sea"
  },
  hades: {
    suit: "#3f424c",
    accent: "#8ba6d9",
    cape: "#262833",
    hair: "#1b1b1b",
    head: "#e2b07a",
    accessory: "bident",
    emblem: "flame",
    backdrop: "underworld"
  },
  hermes: {
    suit: "#d4b565",
    accent: "#f7f0cc",
    cape: "#9f8c4a",
    hair: "#5e3d24",
    head: "#efc48b",
    accessory: "caduceus",
    emblem: "wing",
    backdrop: "sky"
  },
  dionysus: {
    suit: "#7c5aa8",
    accent: "#d8c2f2",
    cape: "#4d2c74",
    hair: "#5d3724",
    head: "#efbf89",
    accessory: "vine-staff",
    emblem: "leaf",
    backdrop: "forest"
  },
  persephone: {
    suit: "#bb5f76",
    accent: "#f0c4d0",
    cape: "#7c2f4b",
    hair: "#5c2a1e",
    head: "#efc28b",
    hairStyle: "long",
    feminine: true,
    accessory: "pomegranate",
    emblem: "leaf",
    backdrop: "spring"
  },
  perseus: {
    suit: "#8ca0b0",
    accent: "#f2db9e",
    cape: "#56697d",
    hair: "#5a3b23",
    head: "#efc289",
    accessory: "shield-sword",
    emblem: "star",
    backdrop: "sky"
  },
  theseus: {
    suit: "#a8773d",
    accent: "#f2d08b",
    cape: "#5f3b28",
    hair: "#4a2917",
    head: "#efbe85",
    accessory: "thread-sword",
    emblem: "maze",
    backdrop: "temple"
  },
  achilles: {
    suit: "#8c6b4f",
    accent: "#f3d897",
    cape: "#7c3f2c",
    hair: "#8b5a2c",
    head: "#efc088",
    accessory: "spear-shield",
    emblem: "star",
    backdrop: "arena"
  },
  atalanta: {
    suit: "#5e8f64",
    accent: "#dceaa0",
    cape: "#3f5a3d",
    hair: "#6a4728",
    head: "#efbf88",
    hairStyle: "long",
    feminine: true,
    accessory: "bow-quiver",
    emblem: "leaf",
    backdrop: "forest"
  },
  jason: {
    suit: "#5c7294",
    accent: "#efd189",
    cape: "#344861",
    hair: "#593620",
    head: "#efbe84",
    accessory: "golden-fleece",
    emblem: "ship",
    backdrop: "sea"
  },
  bellerophon: {
    suit: "#7d95ad",
    accent: "#f6dd9d",
    cape: "#4a5f73",
    hair: "#5f3d24",
    head: "#ecbc84",
    accessory: "winged-spear",
    emblem: "sky",
    backdrop: "sky"
  },
  medusa: {
    suit: "#6a8c63",
    accent: "#bdd39d",
    cape: "#4a5c3d",
    hair: "#557442",
    head: "#d1a36f",
    hairStyle: "long",
    feminine: true,
    accessory: "snake",
    emblem: "stone",
    backdrop: "cave"
  },
  minotaur: {
    suit: "#6d4f3a",
    accent: "#ceb17a",
    cape: "#493123",
    hair: "#3a2417",
    head: "#7b5639",
    accessory: "axe",
    emblem: "maze",
    backdrop: "cave"
  },
  cyclops: {
    suit: "#7e6d62",
    accent: "#b0a79f",
    cape: "#564940",
    hair: "#4b3a32",
    head: "#d3ab84",
    accessory: "boulder",
    emblem: "eye",
    backdrop: "cave"
  },
  cerberus: {
    suit: "#6b3b35",
    accent: "#d8ae7c",
    cape: "#301b19",
    hair: "#181212",
    head: "#8a5a42",
    accessory: "chain",
    emblem: "flame",
    backdrop: "underworld"
  },
  hydra: {
    suit: "#4b7b5f",
    accent: "#ace0bf",
    cape: "#315441",
    hair: "#385841",
    head: "#d3aa81",
    accessory: "hydra",
    emblem: "drop",
    backdrop: "swamp"
  },
  chimera: {
    suit: "#b36c40",
    accent: "#f0c57d",
    cape: "#6b3127",
    hair: "#5c3420",
    head: "#d5a47a",
    accessory: "flame",
    emblem: "fire",
    backdrop: "mountain"
  },
  sphinx: {
    suit: "#c7a261",
    accent: "#f0d18d",
    cape: "#8c6338",
    hair: "#614123",
    head: "#d9ad7d",
    accessory: "scroll",
    emblem: "riddle",
    backdrop: "desert"
  },
  sirens: {
    suit: "#6aa5a6",
    accent: "#c9f0ef",
    cape: "#396d72",
    hair: "#b35c4d",
    head: "#efbe88",
    hairStyle: "long",
    feminine: true,
    accessory: "harp-shell",
    emblem: "wave",
    backdrop: "sea"
  },
  harpies: {
    suit: "#7b7363",
    accent: "#d9d1bb",
    cape: "#4f4a40",
    hair: "#5c4633",
    head: "#dcb086",
    hairStyle: "long",
    feminine: true,
    accessory: "talon-wing",
    emblem: "wing",
    backdrop: "sky"
  },
  scylla: {
    suit: "#477e8f",
    accent: "#a5d9da",
    cape: "#294d59",
    hair: "#507180",
    head: "#dfb486",
    hairStyle: "long",
    feminine: true,
    accessory: "sea-serpent",
    emblem: "wave",
    backdrop: "sea"
  },
  charybdis: {
    suit: "#3d6883",
    accent: "#a9ddf0",
    cape: "#223f50",
    hair: "#d7eef8",
    head: "#e4bb8a",
    accessory: "whirlpool",
    emblem: "wave",
    backdrop: "sea"
  },
  "nemean-lion": {
    suit: "#b58a46",
    accent: "#f4db97",
    cape: "#7a5527",
    hair: "#6c461c",
    head: "#deaf7e",
    accessory: "lion-claw",
    emblem: "lion",
    backdrop: "arena"
  },
  cronus: {
    suit: "#927149",
    accent: "#e3c27c",
    cape: "#5c3b1f",
    hair: "#d8d0b5",
    head: "#e7b881",
    accessory: "sickle",
    emblem: "maze",
    backdrop: "mountain"
  },
  rhea: {
    suit: "#b26f81",
    accent: "#f0c7cf",
    cape: "#7b4051",
    hair: "#6a3e29",
    head: "#efbf89",
    hairStyle: "long",
    feminine: true,
    accessory: "crown",
    emblem: "leaf",
    backdrop: "spring"
  },
  atlas: {
    suit: "#6f7a86",
    accent: "#c6d6df",
    cape: "#42515e",
    hair: "#5a3c29",
    head: "#e3b380",
    accessory: "globe",
    emblem: "star",
    backdrop: "sky"
  },
  prometheus: {
    suit: "#9b6238",
    accent: "#f0bb69",
    cape: "#653219",
    hair: "#5d3420",
    head: "#e8b783",
    accessory: "torch",
    emblem: "fire",
    backdrop: "mountain"
  },
  hyperion: {
    suit: "#c39a3f",
    accent: "#ffe099",
    cape: "#8e5c1f",
    hair: "#d2b35f",
    head: "#efbf88",
    accessory: "sunstaff",
    emblem: "sun",
    backdrop: "sun"
  },
  oceanus: {
    suit: "#467f97",
    accent: "#a8e3f3",
    cape: "#1f5268",
    hair: "#d8f3ff",
    head: "#e8bb84",
    accessory: "wave-staff",
    emblem: "wave",
    backdrop: "sea"
  }
};

function getTheme(entryId) {
  return portraitThemes[entryId] || portraitThemes.zeus;
}

function getBackdrop(theme) {
  const backdrops = {
    storm:
      '<circle cx="300" cy="120" r="68" fill="rgba(255,223,155,0.25)"/><path d="M70 100 C130 30 230 35 280 92" stroke="#f7e4aa" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.45"/><path d="M310 95 C380 25 500 30 560 115" stroke="#f7e4aa" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.38"/>',
    temple:
      '<path d="M90 134 H510" stroke="#f4dfac" stroke-width="8"/><path d="M125 130 V70 M195 130 V70 M265 130 V70 M335 130 V70 M405 130 V70 M475 130 V70" stroke="#f4dfac" stroke-width="10" stroke-linecap="round" opacity="0.55"/><path d="M105 72 L300 24 L495 72" fill="rgba(244,223,172,0.14)" stroke="#f4dfac" stroke-width="8" stroke-linejoin="round"/>',
    sea:
      '<path d="M0 112 Q45 90 90 112 T180 112 T270 112 T360 112 T450 112 T540 112 T630 112 V180 H0 Z" fill="rgba(94,173,219,0.28)"/><path d="M0 136 Q45 114 90 136 T180 136 T270 136 T360 136 T450 136 T540 136 T630 136" stroke="#aee8ff" stroke-width="7" fill="none" opacity="0.5"/>',
    forest:
      '<path d="M60 155 L110 55 L160 155 Z" fill="rgba(132,181,117,0.35)"/><path d="M150 165 L220 42 L290 165 Z" fill="rgba(132,181,117,0.28)"/><path d="M315 165 L385 48 L455 165 Z" fill="rgba(132,181,117,0.34)"/><path d="M430 155 L485 60 L540 155 Z" fill="rgba(132,181,117,0.25)"/>',
    sun:
      '<circle cx="300" cy="95" r="76" fill="rgba(255,219,120,0.38)"/><path d="M300 8 V42 M300 148 V182 M212 95 H246 M354 95 H388 M239 34 L262 57 M338 133 L361 156 M239 156 L262 133 M338 57 L361 34" stroke="#ffe49d" stroke-width="8" stroke-linecap="round" opacity="0.65"/>',
    arena:
      '<path d="M75 150 Q300 85 525 150" stroke="rgba(255,216,146,0.45)" stroke-width="14" fill="none"/><path d="M100 125 Q300 70 500 125" stroke="rgba(255,216,146,0.24)" stroke-width="10" fill="none"/>',
    underworld:
      '<circle cx="300" cy="95" r="70" fill="rgba(133,95,255,0.16)"/><path d="M120 170 Q165 120 210 170 T300 170 T390 170 T480 170" stroke="#96a5ff" stroke-width="8" fill="none" opacity="0.45"/><path d="M190 130 C205 108 225 108 240 130 C252 150 270 150 282 130" stroke="#93a2ff" stroke-width="7" fill="none" opacity="0.45"/>',
    spring:
      '<circle cx="300" cy="96" r="72" fill="rgba(255,206,222,0.22)"/><circle cx="190" cy="82" r="13" fill="rgba(255,198,220,0.55)"/><circle cx="420" cy="88" r="12" fill="rgba(255,198,220,0.45)"/><circle cx="468" cy="126" r="10" fill="rgba(189,240,168,0.45)"/><circle cx="146" cy="130" r="9" fill="rgba(189,240,168,0.4)"/>',
    sky:
      '<path d="M70 120 C100 85 145 85 175 120 C185 95 220 90 245 118 C275 82 340 78 372 118 C392 102 430 100 456 124 C478 108 515 110 535 132" fill="rgba(246,233,197,0.22)"/>',
    cave:
      '<path d="M0 0 H600 V115 C520 78 430 82 365 120 C310 155 236 162 168 132 C118 110 75 98 0 120 Z" fill="rgba(0,0,0,0.26)"/><path d="M0 152 C72 130 138 128 198 148 C254 166 335 168 392 146 C448 124 514 126 600 154 V200 H0 Z" fill="rgba(255,243,190,0.08)"/>',
    swamp:
      '<path d="M0 150 Q72 132 140 150 T280 150 T420 150 T600 150 V200 H0 Z" fill="rgba(97,153,126,0.28)"/><circle cx="160" cy="120" r="12" fill="rgba(198,255,212,0.18)"/><circle cx="418" cy="112" r="10" fill="rgba(198,255,212,0.14)"/>',
    mountain:
      '<path d="M75 165 L175 58 L275 165 Z" fill="rgba(240,197,125,0.25)"/><path d="M225 165 L340 36 L455 165 Z" fill="rgba(240,197,125,0.18)"/><path d="M365 165 L458 75 L551 165 Z" fill="rgba(240,197,125,0.12)"/>',
    desert:
      '<path d="M0 145 Q105 95 210 145 T420 145 T600 145 V200 H0 Z" fill="rgba(245,205,128,0.2)"/><circle cx="450" cy="78" r="52" fill="rgba(255,223,155,0.22)"/>'
  };

  return backdrops[theme.backdrop] || backdrops.temple;
}

function getEmblem(theme) {
  const emblems = {
    lightning: '<path d="M0 0 L18 0 L8 18 L18 18 L-3 48 L6 25 L-5 25 Z" fill="#ffd86b"/>',
    owl: '<circle cx="0" cy="0" r="16" fill="#f6dd99"/><circle cx="-6" cy="-2" r="4" fill="#3b2512"/><circle cx="6" cy="-2" r="4" fill="#3b2512"/><path d="M-8 10 Q0 16 8 10" stroke="#3b2512" stroke-width="3" fill="none"/>',
    wave: '<path d="M-20 5 Q-10 -10 0 5 T20 5" stroke="#d6f8ff" stroke-width="6" fill="none" stroke-linecap="round"/>',
    moon: '<path d="M2 -18 A18 18 0 1 0 2 18 A13 13 0 1 1 2 -18 Z" fill="#f5efc9"/>',
    sun: '<circle cx="0" cy="0" r="13" fill="#ffe48f"/><path d="M0 -24 V-16 M0 16 V24 M-24 0 H-16 M16 0 H24 M-17 -17 L-11 -11 M17 -17 L11 -11 M-17 17 L-11 11 M17 17 L11 11" stroke="#ffe48f" stroke-width="4" stroke-linecap="round"/>',
    lion: '<circle cx="0" cy="0" r="18" fill="#e3ac5f"/><circle cx="0" cy="0" r="11" fill="#ffd89e"/><circle cx="-4" cy="-2" r="2.5" fill="#53311d"/><circle cx="4" cy="-2" r="2.5" fill="#53311d"/>',
    ship: '<path d="M-18 10 H18 L10 22 H-10 Z" fill="#d6b37b"/><path d="M0 -20 V10" stroke="#fff1d1" stroke-width="4"/><path d="M0 -18 L14 -4 L0 -4 Z" fill="#f8e5b1"/>',
    flame: '<path d="M0 -24 C12 -10 18 0 14 12 C10 24 -8 26 -15 12 C-21 -1 -11 -11 0 -24 Z" fill="#8ea4ff"/><path d="M1 -10 C8 -2 8 5 5 12 C1 17 -8 13 -8 5 C-8 -1 -4 -4 1 -10 Z" fill="#dfe5ff"/>',
    wing: '<path d="M-18 4 C-8 -20 12 -20 20 3 C10 -3 2 3 -2 13 C-7 10 -13 8 -18 4 Z" fill="#f6efd3"/>',
    sky: '<path d="M-20 6 C-14 -16 -2 -20 10 -18 C6 -10 6 -4 14 2 C10 10 2 16 -10 18 C-18 16 -22 12 -20 6 Z" fill="#dff4ff"/><path d="M2 -18 L12 -8 L2 2" stroke="#fff7d7" stroke-width="4" fill="none" stroke-linecap="round"/>',
    leaf: '<path d="M0 -18 C18 -12 22 6 0 20 C-22 6 -18 -12 0 -18 Z" fill="#bddf92"/>',
    star: '<path d="M0 -18 L5 -5 L18 -5 L8 3 L12 16 L0 8 L-12 16 L-8 3 L-18 -5 L-5 -5 Z" fill="#ffe0a2"/>',
    maze: '<path d="M-18 -18 H18 V18 H-12 V-6 H6 V6" stroke="#f5dda1" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    stone: '<polygon points="-18,-4 -5,-18 14,-12 18,6 2,18 -15,12" fill="#d0d1d4"/>',
    eye: '<path d="M-22 0 Q0 -16 22 0 Q0 16 -22 0 Z" fill="#e8ddd1"/><circle cx="0" cy="0" r="7" fill="#57453b"/>',
    drop: '<path d="M0 -22 C13 -5 16 3 16 12 C16 22 8 28 0 28 C-8 28 -16 22 -16 12 C-16 3 -13 -5 0 -22 Z" fill="#b7f2c7"/>',
    fire: '<path d="M0 -23 C11 -11 15 -1 11 11 C7 22 -7 22 -11 11 C-15 -1 -9 -11 0 -23 Z" fill="#ffbf68"/>',
    riddle: '<path d="M0 -22 C11 -22 18 -15 18 -6 C18 4 10 10 2 12 L2 18" stroke="#f8e0a4" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="2" cy="27" r="3.5" fill="#f8e0a4"/>'
  };

  return emblems[theme.emblem] || emblems.star;
}

function getAccessory(theme) {
  const accessories = {
    bolt: '<path d="M0 -58 L18 -58 L4 -24 L20 -24 L-10 34 L-2 -6 L-16 -6 Z" fill="#ffd768" stroke="#fff2bf" stroke-width="4" stroke-linejoin="round"/>',
    "owl-spear": '<g><path d="M0 -62 L12 -42 L0 -50 L-12 -42 Z" fill="#d4d7da"/><path d="M0 -44 V42" stroke="#b8894e" stroke-width="7" stroke-linecap="round"/><circle cx="18" cy="-28" r="10" fill="#efe0b4"/><circle cx="14" cy="-30" r="2.6" fill="#3b2512"/><circle cx="22" cy="-30" r="2.6" fill="#3b2512"/></g>',
    spear: '<path d="M0 -62 L12 -42 L0 -50 L-12 -42 Z" fill="#d4d7da"/><path d="M0 -44 V42" stroke="#b8894e" stroke-width="7" stroke-linecap="round"/>',
    "war-spear": '<g><path d="M0 -62 L12 -42 L0 -50 L-12 -42 Z" fill="#d4d7da"/><path d="M0 -44 V42" stroke="#b8894e" stroke-width="7" stroke-linecap="round"/><circle cx="18" cy="-10" r="12" fill="#c94f4f" stroke="#f2d49a" stroke-width="4"/></g>',
    trident: '<path d="M0 -66 V42" stroke="#b8eeff" stroke-width="7" stroke-linecap="round"/><path d="M-18 -42 L-10 -64 L-2 -42 M18 -42 L10 -64 L2 -42 M0 -42 L0 -70" stroke="#b8eeff" stroke-width="6" stroke-linecap="round" fill="none"/>',
    bow: '<path d="M-8 -56 C20 -28 20 28 -8 56" stroke="#efe9d0" stroke-width="6" fill="none"/><path d="M-6 -48 V48" stroke="#d6c28e" stroke-width="3"/>',
    "bow-quiver": '<g><path d="M-8 -56 C20 -28 20 28 -8 56" stroke="#efe9d0" stroke-width="6" fill="none"/><path d="M-6 -48 V48" stroke="#d6c28e" stroke-width="3"/><rect x="12" y="-50" width="16" height="34" rx="8" fill="#6b4b2d"/><path d="M16 -48 V-62 M20 -48 V-62 M24 -48 V-62" stroke="#efead2" stroke-width="3" stroke-linecap="round"/></g>',
    "crown-staff": '<g><path d="M0 -58 V42" stroke="#d7c49a" stroke-width="7" stroke-linecap="round"/><path d="M-18 -64 L-8 -78 L0 -64 L8 -78 L18 -64" stroke="#ffe7a5" stroke-width="5" fill="none" stroke-linecap="round"/></g>',
    lyre: '<path d="M-18 -46 C-18 -62 -6 -70 0 -70 C6 -70 18 -62 18 -46 V10" stroke="#ffefbb" stroke-width="5" fill="none"/><path d="M-18 10 H18" stroke="#ffefbb" stroke-width="5"/><path d="M-6 -46 V10 M0 -48 V10 M6 -46 V10" stroke="#ffefbb" stroke-width="3"/>',
    "sun-lyre": '<g><path d="M-18 -46 C-18 -62 -6 -70 0 -70 C6 -70 18 -62 18 -46 V10" stroke="#ffefbb" stroke-width="5" fill="none"/><path d="M-18 10 H18" stroke="#ffefbb" stroke-width="5"/><path d="M-6 -46 V10 M0 -48 V10 M6 -46 V10" stroke="#ffefbb" stroke-width="3"/><circle cx="0" cy="-82" r="10" fill="#ffe38d"/></g>',
    club: '<path d="M-8 -52 C12 -62 24 -50 20 -34 C17 -20 6 -12 -2 -3 L-8 42" stroke="#6c3d1f" stroke-width="12" stroke-linecap="round" fill="none"/>',
    sword: '<path d="M0 -60 V18" stroke="#e3edf3" stroke-width="7" stroke-linecap="round"/><path d="M-16 18 H16" stroke="#d2b176" stroke-width="7" stroke-linecap="round"/><path d="M0 18 V40" stroke="#845b34" stroke-width="7" stroke-linecap="round"/>',
    staff: '<path d="M0 -58 V44" stroke="#8ba6d9" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-68" r="12" fill="#d9e0ff"/>',
    bident: '<path d="M0 -64 V42" stroke="#aebff0" stroke-width="7" stroke-linecap="round"/><path d="M-12 -44 L-4 -66 M12 -44 L4 -66" stroke="#aebff0" stroke-width="6" stroke-linecap="round" fill="none"/>',
    caduceus: '<path d="M0 -56 V40" stroke="#f6edcb" stroke-width="6" stroke-linecap="round"/><path d="M-16 -30 C-2 -42 6 -40 16 -24" stroke="#f6edcb" stroke-width="4" fill="none"/><path d="M-16 -12 C-2 0 6 -2 16 14" stroke="#f6edcb" stroke-width="4" fill="none"/><path d="M-10 -58 L0 -70 L10 -58" stroke="#f6edcb" stroke-width="4" fill="none" stroke-linecap="round"/>',
    hammer: '<path d="M0 -30 V40" stroke="#8b5a2a" stroke-width="7" stroke-linecap="round"/><rect x="-20" y="-42" width="40" height="18" rx="4" fill="#d0d3d6"/>',
    "vine-staff": '<path d="M0 -56 V40" stroke="#b28f5a" stroke-width="7" stroke-linecap="round"/><path d="M-14 -36 C-4 -52 10 -48 14 -30 C8 -24 2 -22 -6 -16" stroke="#a5d08f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-6 -6 C6 -18 18 -10 14 6 C6 12 0 14 -10 22" stroke="#a5d08f" stroke-width="5" fill="none" stroke-linecap="round"/>',
    flower: '<circle cx="0" cy="-48" r="9" fill="#ffd4df"/><circle cx="-10" cy="-40" r="9" fill="#ffd4df"/><circle cx="10" cy="-40" r="9" fill="#ffd4df"/><circle cx="0" cy="-32" r="9" fill="#ffd4df"/><circle cx="0" cy="-40" r="6" fill="#ffe593"/><path d="M0 -30 V40" stroke="#bddf92" stroke-width="6"/>',
    wheat: '<g><path d="M0 -54 V40" stroke="#b28f5a" stroke-width="6" stroke-linecap="round"/><path d="M0 -44 L10 -54 M0 -32 L12 -42 M0 -20 L12 -30 M0 -8 L12 -18 M0 -44 L-10 -54 M0 -32 L-12 -42 M0 -20 L-12 -30 M0 -8 L-12 -18" stroke="#f3d97c" stroke-width="4" stroke-linecap="round"/></g>',
    "hearth-flame": '<g><circle cx="0" cy="16" r="14" fill="#7e5534"/><path d="M0 -38 C12 -22 18 -8 16 8 C14 26 4 36 0 48 C-4 36 -14 26 -16 8 C-18 -8 -12 -22 0 -38 Z" fill="#ffbf68"/></g>',
    shield: '<path d="M0 -62 L24 -48 L18 12 L0 44 L-18 12 L-24 -48 Z" fill="#cdd7df" stroke="#f6e1a3" stroke-width="5"/><circle cx="0" cy="-10" r="10" fill="#f6e1a3"/>',
    "shield-sword": '<g><path d="M-14 -58 L10 -44 L4 6 L-14 34 L-28 6 L-32 -44 Z" fill="#cdd7df" stroke="#f6e1a3" stroke-width="5"/><path d="M22 -56 V18" stroke="#e3edf3" stroke-width="6" stroke-linecap="round"/><path d="M8 18 H34" stroke="#d2b176" stroke-width="6" stroke-linecap="round"/><path d="M22 18 V40" stroke="#845b34" stroke-width="6" stroke-linecap="round"/></g>',
    thread: '<path d="M-14 -52 C20 -40 24 -12 4 2 C-20 18 -10 36 16 44" stroke="#ffdba2" stroke-width="6" fill="none" stroke-linecap="round"/>',
    "thread-sword": '<g><path d="M-20 -40 C10 -30 12 -4 -6 8 C-22 18 -14 34 8 40" stroke="#ffdba2" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M18 -56 V18" stroke="#e3edf3" stroke-width="6" stroke-linecap="round"/><path d="M4 18 H30" stroke="#d2b176" stroke-width="6" stroke-linecap="round"/><path d="M18 18 V40" stroke="#845b34" stroke-width="6" stroke-linecap="round"/></g>',
    "spear-shield": '<g><path d="M-12 -58 L12 -44 L6 6 L-12 34 L-26 6 L-30 -44 Z" fill="#cdd7df" stroke="#f6e1a3" stroke-width="5"/><path d="M24 -62 L36 -42 L24 -50 L12 -42 Z" fill="#d4d7da"/><path d="M24 -44 V42" stroke="#b8894e" stroke-width="7" stroke-linecap="round"/></g>',
    snake: '<path d="M-16 -50 C18 -52 12 -8 -10 -8 C-26 -8 -26 22 0 22 C24 22 26 52 -10 50" stroke="#95bd77" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-10" cy="50" r="5" fill="#95bd77"/>',
    axe: '<path d="M0 -54 V42" stroke="#ceb58b" stroke-width="7" stroke-linecap="round"/><path d="M0 -40 C26 -44 34 -20 8 -2 L0 -2 Z" fill="#d3d3d3"/>',
    boulder: '<path d="M-24 26 C-24 2 -8 -14 12 -14 C28 -14 42 -2 42 18 C42 36 26 48 4 48 C-10 48 -24 40 -24 26 Z" fill="#98928d"/>',
    chain: '<path d="M-15 -44 C-2 -56 14 -52 16 -34 C18 -20 8 -10 -4 -10 C-16 -10 -26 -20 -24 -34 C-22 -42 -20 -46 -15 -44 Z" stroke="#e8c89a" stroke-width="5" fill="none"/><path d="M-6 -6 C7 -18 23 -14 25 4 C27 18 17 28 5 28 C-7 28 -17 18 -15 4 C-13 -4 -11 -8 -6 -6 Z" stroke="#e8c89a" stroke-width="5" fill="none"/>',
    hydra: '<path d="M0 40 C-8 12 -18 -16 -38 -34 M0 40 C0 10 0 -10 0 -34 M0 40 C8 12 18 -16 38 -34" stroke="#b5e6bf" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-38" cy="-34" r="7" fill="#b5e6bf"/><circle cx="0" cy="-34" r="7" fill="#b5e6bf"/><circle cx="38" cy="-34" r="7" fill="#b5e6bf"/>',
    flame: '<path d="M0 -58 C12 -42 18 -26 16 -8 C14 12 4 24 0 38 C-4 24 -14 12 -16 -8 C-18 -26 -12 -42 0 -58 Z" fill="#ffbf68"/>',
    scroll: '<rect x="-20" y="-26" width="40" height="58" rx="8" fill="#f4e0aa"/><path d="M-20 -18 C-28 -18 -28 -32 -20 -32 M20 -18 C28 -18 28 -32 20 -32" stroke="#caa56d" stroke-width="4" fill="none"/>',
    shell: '<path d="M0 -42 C20 -38 34 -22 36 4 C20 14 6 16 0 42 C-6 16 -20 14 -36 4 C-34 -22 -20 -38 0 -42 Z" fill="#d4f1ef"/>',
    mirror: '<g><circle cx="0" cy="-30" r="18" fill="#d8f0ff" stroke="#f0d8a4" stroke-width="5"/><path d="M0 -12 V36" stroke="#c7905a" stroke-width="7" stroke-linecap="round"/></g>',
    sickle: '<path d="M2 -58 V34" stroke="#cda36e" stroke-width="7" stroke-linecap="round"/><path d="M2 -58 C34 -58 44 -24 24 -2 C10 13 -8 10 -18 -2" stroke="#e5e5e5" stroke-width="7" fill="none" stroke-linecap="round"/>',
    crown: '<path d="M-18 -62 L-8 -78 L0 -62 L8 -78 L18 -62 L18 -48 H-18 Z" fill="#ffe39a" stroke="#f0d18a" stroke-width="4"/>',
    globe: '<circle cx="0" cy="-30" r="24" fill="#9ed1f2" stroke="#f1e1ab" stroke-width="4"/><path d="M0 -6 V42" stroke="#c79c67" stroke-width="7" stroke-linecap="round"/><path d="M-18 -30 H18 M0 -48 V-12" stroke="rgba(255,255,255,0.5)" stroke-width="3"/>',
    torch: '<g><path d="M0 -18 V40" stroke="#8b5a2a" stroke-width="7" stroke-linecap="round"/><path d="M0 -58 C12 -42 18 -26 16 -8 C14 8 4 18 0 28 C-4 18 -14 8 -16 -8 C-18 -26 -12 -42 0 -58 Z" fill="#ffbf68"/></g>',
    pomegranate: '<g><circle cx="0" cy="-18" r="18" fill="#a11f3c"/><path d="M0 -44 L6 -32 H-6 Z" fill="#f0c98c"/></g>',
    sunstaff: '<circle cx="0" cy="-56" r="16" fill="#ffe38d"/><path d="M0 -80 V-70 M0 -42 V-32 M-24 -56 H-14 M14 -56 H24 M-17 -73 L-10 -66 M17 -73 L10 -66 M-17 -39 L-10 -46 M17 -39 L10 -46" stroke="#ffe38d" stroke-width="4" stroke-linecap="round"/><path d="M0 -32 V40" stroke="#c88e45" stroke-width="7" stroke-linecap="round"/>',
    "wave-staff": '<path d="M0 -58 V40" stroke="#d4f3ff" stroke-width="7" stroke-linecap="round"/><path d="M-16 -44 Q-8 -58 0 -44 T16 -44" stroke="#d4f3ff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-12 -24 Q-4 -38 4 -24 T20 -24" stroke="#d4f3ff" stroke-width="5" fill="none" stroke-linecap="round"/>',
    "harp-shell": '<g><path d="M0 -42 C20 -38 34 -22 36 4 C20 14 6 16 0 42 C-6 16 -20 14 -36 4 C-34 -22 -20 -38 0 -42 Z" fill="#d4f1ef"/><path d="M-10 -16 V20 M0 -18 V22 M10 -16 V20" stroke="#ffffff" stroke-width="3"/></g>'
    ,
    "golden-fleece": '<g><path d="M-22 -40 C-24 -58 -6 -66 8 -60 C24 -66 36 -54 32 -36 C36 -18 26 4 8 12 C-10 4 -24 -14 -22 -40 Z" fill="#f3cf6f" stroke="#fff0b5" stroke-width="4"/><path d="M-10 -34 C-2 -28 -2 -18 -10 -12 M8 -40 C18 -34 20 -24 12 -14 M-2 -4 C8 0 10 10 2 18" stroke="#e2b84e" stroke-width="4" fill="none" stroke-linecap="round"/></g>',
    "winged-spear": '<g><path d="M0 -62 L12 -42 L0 -50 L-12 -42 Z" fill="#d4d7da"/><path d="M0 -44 V42" stroke="#b8894e" stroke-width="7" stroke-linecap="round"/><path d="M-20 -34 C-10 -48 0 -46 10 -34" stroke="#f6efd3" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M10 -34 C18 -46 28 -44 36 -32" stroke="#f6efd3" stroke-width="4" fill="none" stroke-linecap="round"/></g>',
    "talon-wing": '<g><path d="M-26 -8 C-14 -34 8 -34 26 -4 C10 -8 -4 4 -10 18 C-18 14 -24 6 -26 -8 Z" fill="#d5d1c5"/><path d="M8 14 L18 30 L8 42 L-2 30 Z" fill="#d09a68"/></g>',
    "sea-serpent": '<g><path d="M-24 30 C-8 0 0 -10 10 -24 C18 -36 30 -36 34 -20 C38 -2 24 10 10 8 C-6 6 -8 20 6 22 C20 24 22 40 8 46" stroke="#9ed0b8" stroke-width="8" fill="none" stroke-linecap="round"/></g>',
    whirlpool: '<g><path d="M-18 -28 C10 -32 22 -10 12 8 C4 22 -18 22 -12 2 C-6 -12 10 -10 8 2" stroke="#c9f2ff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-6 -4 C8 -6 10 4 4 10" stroke="#c9f2ff" stroke-width="5" fill="none" stroke-linecap="round"/></g>',
    "lion-claw": '<g><path d="M-12 -18 C-20 -40 -8 -52 6 -46 C20 -42 24 -24 16 -6" stroke="#f4db97" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-6 -2 L-14 22 M4 -4 L-2 22 M14 -6 L10 22" stroke="#fff2cb" stroke-width="4" stroke-linecap="round"/></g>'
  };

  return accessories[theme.accessory] || accessories.shield;
}

function getHair(theme) {
  if (theme.hairStyle === "long") {
    return `
      <path d="M-86 -44 C-96 -126 -38 -184 0 -184 C38 -184 96 -126 86 -44 C78 8 66 56 48 104 H-48 C-66 56 -78 8 -86 -44 Z" fill="${theme.hair}" opacity="0.98"></path>
      <path d="M-72 -114 C-60 -168 60 -168 72 -114 V-70 H-72 Z" fill="${theme.hair}"></path>
      <path d="M-82 -66 C-98 -6 -86 54 -58 112" stroke="${theme.hair}" stroke-width="18" stroke-linecap="round" opacity="0.94"></path>
      <path d="M82 -66 C98 -6 86 54 58 112" stroke="${theme.hair}" stroke-width="18" stroke-linecap="round" opacity="0.94"></path>
    `;
  }

  return `<path d="M-74 -124 C-60 -178 60 -178 74 -124 V-66 H-74 Z" fill="${theme.hair}"></path>`;
}

function getFaceDetails(theme) {
  if (theme.feminine) {
    return `
      <path d="M-34 -30 Q-18 -40 -6 -34" stroke="#5b3123" stroke-width="4" fill="none" stroke-linecap="round"></path>
      <path d="M6 -34 Q18 -40 34 -30" stroke="#5b3123" stroke-width="4" fill="none" stroke-linecap="round"></path>
      <path d="M-30 -6 Q-20 2 -10 -8" stroke="#5b3123" stroke-width="3" fill="none" stroke-linecap="round"></path>
      <path d="M10 -8 Q20 2 30 -6" stroke="#5b3123" stroke-width="3" fill="none" stroke-linecap="round"></path>
      <circle cx="-40" cy="28" r="9" fill="#efab97" opacity="0.45"></circle>
      <circle cx="40" cy="28" r="9" fill="#efab97" opacity="0.45"></circle>
      <path d="M-22 44 Q0 56 22 44" stroke="#b15466" stroke-width="5" fill="none" stroke-linecap="round"></path>
      <circle cx="-50" cy="54" r="5" fill="${theme.accent}" opacity="0.95"></circle>
      <circle cx="50" cy="54" r="5" fill="${theme.accent}" opacity="0.95"></circle>
    `;
  }

  return `
    <path d="M-30 -30 Q-14 -40 -2 -32" stroke="#5b3123" stroke-width="4" fill="none" stroke-linecap="round"></path>
    <path d="M2 -32 Q14 -40 30 -30" stroke="#5b3123" stroke-width="4" fill="none" stroke-linecap="round"></path>
    <path d="M-20 46 Q0 60 20 46" stroke="#8c4f32" stroke-width="6" fill="none" stroke-linecap="round"></path>
  `;
}

function getPortraitFaceExtras(entryId, theme) {
  const extras = {
    zeus: `
      <path d="M-86 -100 C-64 -170 64 -170 86 -100" stroke="${theme.hair}" stroke-width="24" fill="none" stroke-linecap="round"></path>
      <path d="M-96 -70 C-114 -18 -98 54 -56 112" stroke="${theme.hair}" stroke-width="20" fill="none" stroke-linecap="round"></path>
      <path d="M96 -70 C114 -18 98 54 56 112" stroke="${theme.hair}" stroke-width="20" fill="none" stroke-linecap="round"></path>
      <path d="M-54 54 C-46 116 -20 156 0 170 C20 156 46 116 54 54" stroke="${theme.hair}" stroke-width="22" fill="none" stroke-linecap="round"></path>
      <path d="M-30 74 C-20 110 -8 130 0 136 C8 130 20 110 30 74" stroke="${theme.hair}" stroke-width="14" fill="none" stroke-linecap="round"></path>
      <path d="M-46 48 Q0 72 46 48" stroke="${theme.hair}" stroke-width="12" fill="none" stroke-linecap="round"></path>
      <path d="M-26 -34 Q-14 -40 -2 -36" stroke="#51453b" stroke-width="5" fill="none" stroke-linecap="round"></path>
      <path d="M2 -36 Q14 -40 26 -34" stroke="#51453b" stroke-width="5" fill="none" stroke-linecap="round"></path>
      <path d="M-28 32 Q0 46 28 32" stroke="#7c5a3b" stroke-width="6" fill="none" stroke-linecap="round"></path>
    `,
    poseidon: `
      <path d="M-44 60 C-36 100 -18 126 0 136 C18 126 36 100 44 60" stroke="${theme.hair}" stroke-width="16" fill="none" stroke-linecap="round"></path>
      <path d="M-66 -118 Q-34 -150 0 -150 Q34 -150 66 -118" stroke="${theme.accent}" stroke-width="7" fill="none" stroke-linecap="round"></path>
    `,
    hades: `
      <path d="M-38 62 C-32 96 -16 122 0 132 C16 122 32 96 38 62" stroke="${theme.hair}" stroke-width="14" fill="none" stroke-linecap="round"></path>
      <path d="M-14 76 Q0 90 14 76" stroke="${theme.hair}" stroke-width="10" fill="none" stroke-linecap="round"></path>
    `,
    hermes: `
      <path d="M-60 -104 C-40 -132 -14 -140 10 -130" stroke="#f7f0cc" stroke-width="6" fill="none" stroke-linecap="round"></path>
      <path d="M60 -104 C40 -132 14 -140 -10 -130" stroke="#f7f0cc" stroke-width="6" fill="none" stroke-linecap="round"></path>
    `,
    medusa: `
      <path d="M-62 -84 C-78 -58 -74 -28 -54 -12" stroke="#95bd77" stroke-width="12" fill="none" stroke-linecap="round"></path>
      <path d="M62 -84 C78 -58 74 -28 54 -12" stroke="#95bd77" stroke-width="12" fill="none" stroke-linecap="round"></path>
    `,
    minotaur: `
      <circle cx="-26" cy="-8" r="7" fill="#2b160f"></circle>
      <circle cx="26" cy="-8" r="7" fill="#2b160f"></circle>
      <path d="M-32 34 Q0 56 32 34" stroke="#3b2016" stroke-width="8" fill="none" stroke-linecap="round"></path>
    `
  };

  return extras[entryId] || "";
}

function getPortraitCostume(entryId, theme) {
  const costumes = {
    zeus: `
      <path d="M-178 184 C-146 78 -70 34 0 34 C70 34 146 78 178 184" fill="${theme.cape}" opacity="0.9"></path>
      <path d="M-132 184 C-112 84 -54 44 0 44 C54 44 112 84 132 184" fill="#fbf5e7"></path>
      <path d="M-126 184 C-108 120 -78 82 -30 66 L-8 184 Z" fill="#ffffff" opacity="0.96"></path>
      <path d="M126 184 C108 120 78 82 30 66 L8 184 Z" fill="#ffffff" opacity="0.96"></path>
      <path d="M-40 54 H40" stroke="${theme.accent}" stroke-width="12" stroke-linecap="round"></path>
      <path d="M-82 34 C-46 8 46 8 82 34" stroke="${theme.accent}" stroke-width="8" fill="none" stroke-linecap="round"></path>
      <path d="M-104 128 C-84 92 -64 72 -42 64" stroke="#f7edd0" stroke-width="20" fill="none" stroke-linecap="round" opacity="0.92"></path>
      <path d="M104 128 C84 92 64 72 42 64" stroke="#f7edd0" stroke-width="20" fill="none" stroke-linecap="round" opacity="0.92"></path>
    `,
    poseidon: `
      <path d="M-166 184 C-132 92 -66 38 0 38 C66 38 132 92 166 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-124 184 C-108 100 -48 54 0 54 C48 54 108 100 124 184" fill="${theme.suit}"></path>
      <path d="M-66 96 Q0 68 66 96" stroke="${theme.accent}" stroke-width="10" fill="none" stroke-linecap="round"></path>
      <path d="M-58 -92 C-46 -148 46 -148 58 -92" stroke="${theme.hair}" stroke-width="20" stroke-linecap="round"></path>
      <path d="M-48 82 C-40 112 -20 142 0 154 C20 142 40 112 48 82" stroke="${theme.hair}" stroke-width="18" fill="none" stroke-linecap="round"></path>
    `,
    hades: `
      <path d="M-166 184 C-136 82 -62 34 0 34 C62 34 136 82 166 184" fill="${theme.cape}" opacity="0.98"></path>
      <path d="M-126 184 C-110 94 -50 48 0 48 C50 48 110 94 126 184" fill="${theme.suit}"></path>
      <path d="M-52 -122 L-28 -154 L0 -128 L28 -154 L52 -122" fill="${theme.accent}" opacity="0.88"></path>
      <path d="M-58 -96 C-44 -144 44 -144 58 -96" stroke="${theme.hair}" stroke-width="18" stroke-linecap="round"></path>
      <path d="M-42 86 C-36 118 -18 140 0 152 C18 140 36 118 42 86" stroke="${theme.hair}" stroke-width="16" fill="none" stroke-linecap="round"></path>
    `,
    athena: `
      <path d="M-170 184 C-136 86 -64 46 0 46 C64 46 136 86 170 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-126 184 C-108 100 -54 58 0 58 C54 58 108 100 126 184" fill="${theme.suit}"></path>
      <path d="M-78 92 H78" stroke="${theme.accent}" stroke-width="9" stroke-linecap="round"></path>
      <path d="M-72 -106 L0 -162 L72 -106 V-82 H-72 Z" fill="${theme.accent}" opacity="0.96"></path>
      <path d="M0 -184 L18 -150 L-18 -150 Z" fill="${theme.accent}"></path>
      <path d="M-48 -94 V-144 M0 -88 V-154 M48 -94 V-144" stroke="#f5ead1" stroke-width="6" stroke-linecap="round" opacity="0.7"></path>
    `,
    ares: `
      <path d="M-170 184 C-136 86 -66 42 0 42 C66 42 136 86 170 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-128 184 C-110 98 -56 52 0 52 C56 52 110 98 128 184" fill="${theme.suit}"></path>
      <path d="M-76 100 H76" stroke="${theme.accent}" stroke-width="10" stroke-linecap="round"></path>
      <path d="M-70 -112 L0 -156 L70 -112 V-82 H-70 Z" fill="#7a7f89"></path>
      <path d="M0 -182 L16 -150 H-16 Z" fill="#7a7f89"></path>
      <circle cx="-54" cy="106" r="14" fill="#7a7f89"></circle>
      <circle cx="54" cy="106" r="14" fill="#7a7f89"></circle>
    `,
    hera: `
      <path d="M-166 184 C-132 86 -60 40 0 40 C60 40 132 86 166 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-122 184 C-106 98 -46 52 0 52 C46 52 106 98 122 184" fill="${theme.suit}"></path>
      <path d="M-58 -132 L-32 -162 L0 -136 L32 -162 L58 -132 L58 -112 H-58 Z" fill="${theme.accent}"></path>
      <path d="M-72 92 H72" stroke="#fff3cb" stroke-width="8" stroke-linecap="round"></path>
    `,
    artemis: `
      <path d="M-162 184 C-132 90 -62 44 0 44 C62 44 132 90 162 184" fill="${theme.cape}" opacity="0.98"></path>
      <path d="M-118 184 C-102 98 -48 56 0 56 C48 56 102 98 118 184" fill="${theme.suit}"></path>
      <path d="M-90 -76 C-90 -152 -40 -176 0 -176 C20 -176 40 -170 58 -154 C34 -140 16 -118 6 -84 C-24 -80 -56 -78 -90 -76 Z" fill="${theme.cape}"></path>
      <circle cx="46" cy="-128" r="14" fill="#f3ebc3"></circle>
      <circle cx="58" cy="-128" r="14" fill="rgba(42,12,18,0.86)"></circle>
    `,
    apollo: `
      <path d="M-164 184 C-132 92 -62 42 0 42 C62 42 132 92 164 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-122 184 C-106 100 -48 54 0 54 C48 54 106 100 122 184" fill="${theme.suit}"></path>
      <circle cx="0" cy="-148" r="34" fill="rgba(255,227,141,0.78)"></circle>
      <path d="M-60 -110 C-48 -140 48 -140 60 -110" stroke="${theme.hair}" stroke-width="18" stroke-linecap="round"></path>
      <path d="M-76 88 H76" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round"></path>
    `,
    aphrodite: `
      <path d="M-164 184 C-132 92 -58 40 0 40 C58 40 132 92 164 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-118 184 C-102 96 -42 48 0 48 C42 48 102 96 118 184" fill="${theme.suit}"></path>
      <path d="M-62 90 H62" stroke="#fff0f3" stroke-width="8" stroke-linecap="round"></path>
      <path d="M-72 -122 C-38 -156 38 -156 72 -122" stroke="${theme.accent}" stroke-width="8" fill="none" stroke-linecap="round"></path>
    `,
    hephaestus: `
      <path d="M-170 184 C-134 88 -66 46 0 46 C66 46 134 88 170 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-126 184 C-110 100 -54 58 0 58 C54 58 110 100 126 184" fill="${theme.suit}"></path>
      <rect x="-58" y="78" width="116" height="92" rx="16" fill="#5a3118" opacity="0.74"></rect>
      <path d="M-38 94 L0 134 L38 94" stroke="${theme.accent}" stroke-width="9" fill="none" stroke-linecap="round"></path>
    `,
    hermes: `
      <path d="M-166 184 C-136 92 -62 44 0 44 C62 44 136 92 166 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-122 184 C-106 100 -50 54 0 54 C50 54 106 100 122 184" fill="${theme.suit}"></path>
      <path d="M-70 -114 C-52 -132 -36 -136 -18 -126 C-30 -106 -36 -96 -38 -78" fill="#f7f0cc"></path>
      <path d="M70 -114 C52 -132 36 -136 18 -126 C30 -106 36 -96 38 -78" fill="#f7f0cc"></path>
      <path d="M-74 88 H74" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round"></path>
    `,
    dionysus: `
      <path d="M-164 184 C-132 88 -60 42 0 42 C60 42 132 88 164 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-120 184 C-104 96 -46 50 0 50 C46 50 104 96 120 184" fill="${theme.suit}"></path>
      <path d="M-78 -118 C-54 -144 -26 -150 0 -150 C26 -150 54 -144 78 -118" stroke="#a5d08f" stroke-width="10" fill="none" stroke-linecap="round"></path>
      <circle cx="-44" cy="-138" r="8" fill="#a5d08f"></circle>
      <circle cx="0" cy="-148" r="8" fill="#a5d08f"></circle>
      <circle cx="44" cy="-138" r="8" fill="#a5d08f"></circle>
    `,
    persephone: `
      <path d="M-164 184 C-132 90 -60 42 0 42 C60 42 132 90 164 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-118 184 C-104 98 -42 50 0 50 C42 50 104 98 118 184" fill="${theme.suit}"></path>
      <path d="M-58 -122 C-26 -152 26 -152 58 -122" stroke="${theme.accent}" stroke-width="8" fill="none" stroke-linecap="round"></path>
      <circle cx="-42" cy="-130" r="8" fill="#f0c4d0"></circle>
      <circle cx="42" cy="-130" r="8" fill="#f0c4d0"></circle>
    `,
    medusa: `
      <path d="M-166 184 C-132 90 -62 40 0 40 C62 40 132 90 166 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-122 184 C-106 98 -48 50 0 50 C48 50 106 98 122 184" fill="${theme.suit}"></path>
      <path d="M-96 -98 C-72 -152 -42 -164 -18 -156 C-28 -130 -30 -108 -18 -90" stroke="#95bd77" stroke-width="16" fill="none" stroke-linecap="round"></path>
      <path d="M-54 -128 C-34 -164 -8 -170 10 -160 C4 -130 4 -108 16 -92" stroke="#95bd77" stroke-width="16" fill="none" stroke-linecap="round"></path>
      <path d="M10 -132 C34 -166 62 -166 84 -148 C64 -122 58 -100 66 -82" stroke="#95bd77" stroke-width="16" fill="none" stroke-linecap="round"></path>
      <path d="M-74 88 H74" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round"></path>
    `,
    minotaur: `
      <path d="M-176 184 C-140 86 -72 34 0 34 C72 34 140 86 176 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-132 184 C-116 94 -60 44 0 44 C60 44 116 94 132 184" fill="${theme.suit}"></path>
      <path d="M-76 -112 C-110 -146 -126 -170 -108 -186 C-84 -188 -60 -172 -38 -134" fill="${theme.hair}"></path>
      <path d="M76 -112 C110 -146 126 -170 108 -186 C84 -188 60 -172 38 -134" fill="${theme.hair}"></path>
      <ellipse cx="0" cy="-18" rx="78" ry="86" fill="${theme.head}"></ellipse>
      <path d="M-42 28 Q0 58 42 28" stroke="#4b2f1f" stroke-width="10" fill="none" stroke-linecap="round"></path>
    `,
    cyclops: `
      <path d="M-170 184 C-136 88 -66 40 0 40 C66 40 136 88 170 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-128 184 C-110 96 -54 48 0 48 C54 48 110 96 128 184" fill="${theme.suit}"></path>
      <circle cx="0" cy="-8" r="24" fill="#382014"></circle>
      <path d="M-64 -106 C-50 -146 50 -146 64 -106" stroke="${theme.hair}" stroke-width="20" stroke-linecap="round"></path>
    `,
    cerberus: `
      <path d="M-168 184 C-136 88 -68 44 0 44 C68 44 136 88 168 184" fill="${theme.cape}" opacity="0.98"></path>
      <path d="M-124 184 C-108 96 -52 50 0 50 C52 50 108 96 124 184" fill="${theme.suit}"></path>
      <circle cx="-66" cy="-24" r="32" fill="${theme.head}" opacity="0.95"></circle>
      <circle cx="66" cy="-24" r="32" fill="${theme.head}" opacity="0.95"></circle>
      <path d="M-56 96 H56" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round"></path>
    `,
    hydra: `
      <path d="M-170 184 C-136 90 -64 44 0 44 C64 44 136 90 170 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-124 184 C-108 98 -50 50 0 50 C50 50 108 98 124 184" fill="${theme.suit}"></path>
      <path d="M-72 -46 C-90 -112 -58 -148 -20 -142 C-24 -104 -18 -70 0 -48" stroke="#b5e6bf" stroke-width="16" fill="none" stroke-linecap="round"></path>
      <path d="M0 -52 C-10 -122 10 -156 40 -150 C40 -118 46 -88 58 -60" stroke="#b5e6bf" stroke-width="16" fill="none" stroke-linecap="round"></path>
      <path d="M66 -38 C48 -102 72 -138 108 -130 C102 -96 100 -66 110 -40" stroke="#b5e6bf" stroke-width="16" fill="none" stroke-linecap="round"></path>
    `,
    sphinx: `
      <path d="M-168 184 C-136 90 -60 44 0 44 C60 44 136 90 168 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-122 184 C-106 98 -46 52 0 52 C46 52 106 98 122 184" fill="${theme.suit}"></path>
      <path d="M-96 -26 C-122 -46 -126 -86 -106 -102 C-80 -96 -58 -80 -44 -58" fill="${theme.accent}" opacity="0.8"></path>
      <path d="M96 -26 C122 -46 126 -86 106 -102 C80 -96 58 -80 44 -58" fill="${theme.accent}" opacity="0.8"></path>
    `,
    sirens: `
      <path d="M-164 184 C-130 90 -58 44 0 44 C58 44 130 90 164 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-118 184 C-102 98 -44 52 0 52 C44 52 102 98 118 184" fill="${theme.suit}"></path>
      <path d="M-116 -32 C-124 -84 -98 -118 -54 -126 C-44 -88 -24 -66 0 -56" fill="#dff4ff" opacity="0.88"></path>
      <path d="M116 -32 C124 -84 98 -118 54 -126 C44 -88 24 -66 0 -56" fill="#dff4ff" opacity="0.88"></path>
    `,
    harpies: `
      <path d="M-164 184 C-130 90 -58 44 0 44 C58 44 130 90 164 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-118 184 C-102 98 -44 52 0 52 C44 52 102 98 118 184" fill="${theme.suit}"></path>
      <path d="M-116 -20 C-126 -74 -100 -108 -56 -116 C-48 -80 -26 -56 0 -46" fill="#d9d1bb" opacity="0.86"></path>
      <path d="M116 -20 C126 -74 100 -108 56 -116 C48 -80 26 -56 0 -46" fill="#d9d1bb" opacity="0.86"></path>
    `
  };

  return (
    costumes[entryId] ||
    `
      <path d="M-166 184 C-134 90 -62 44 0 44 C62 44 134 90 166 184" fill="${theme.cape}" opacity="0.96"></path>
      <path d="M-122 184 C-106 98 -48 52 0 52 C48 52 106 98 122 184" fill="${theme.suit}"></path>
      <path d="M-70 92 H70" stroke="${theme.accent}" stroke-width="8" stroke-linecap="round"></path>
    `
  );
}

function getPortraitHeadwear(entryId, theme) {
  const headwear = {
    zeus: `
      <circle cx="0" cy="-148" r="44" fill="rgba(255,227,133,0.34)"></circle>
      <path d="M-14 -176 L8 -176 L-2 -150 L16 -150 L-18 -104 L-8 -140 L-24 -140 Z" fill="#ffe07f" opacity="0.96"></path>
      <path d="M-86 -120 C-52 -148 -18 -158 0 -156 C18 -158 52 -148 86 -120" stroke="rgba(255,235,184,0.75)" stroke-width="8" fill="none" stroke-linecap="round"></path>
    `,
    demeter: '<path d="M-72 -128 C-32 -154 32 -154 72 -128" stroke="#f3d97c" stroke-width="9" fill="none" stroke-linecap="round"></path>',
    hestia: '<path d="M-44 -138 C-30 -160 30 -160 44 -138" stroke="#ffbf68" stroke-width="10" fill="none" stroke-linecap="round"></path>',
    hercules: '<path d="M-70 -120 C-44 -152 44 -152 70 -120" stroke="#d59a47" stroke-width="18" fill="none" stroke-linecap="round"></path>',
    odysseus: '<path d="M-62 -120 C-38 -146 38 -146 62 -120" stroke="#cfb07c" stroke-width="9" fill="none" stroke-linecap="round"></path>',
    perseus: '<path d="M-54 -122 L0 -152 L54 -122" stroke="#f6e1a3" stroke-width="8" fill="none" stroke-linecap="round"></path>',
    theseus: '<path d="M-58 -118 C-24 -144 24 -144 58 -118" stroke="#f2d08b" stroke-width="8" fill="none" stroke-linecap="round"></path>',
    achilles: '<path d="M-56 -118 L0 -150 L56 -118" stroke="#f3d897" stroke-width="8" fill="none" stroke-linecap="round"></path>',
    jason: '<circle cx="0" cy="-134" r="14" fill="#f3cf6f" opacity="0.85"></circle>',
    bellerophon: '<path d="M-66 -118 C-42 -138 -24 -138 -6 -118" stroke="#f6efd3" stroke-width="6" fill="none" stroke-linecap="round"></path><path d="M66 -118 C42 -138 24 -138 6 -118" stroke="#f6efd3" stroke-width="6" fill="none" stroke-linecap="round"></path>',
    rhea: '<path d="M-56 -130 L-30 -158 L0 -132 L30 -158 L56 -130" fill="#f0c7cf"></path>'
  };

  return headwear[entryId] || "";
}

function renderMiniFigure() {
  miniTitle.textContent = entry.name;

  const portraitImage = portraitImageMap[entry.id];
  if (portraitImage) {
    miniStage.innerHTML = `
      <img
        class="mini-svg portrait-image"
        src="${portraitImage}"
        alt="${entry.name} portrait card"
        loading="eager"
      />
    `;
    return;
  }

  miniStage.innerHTML = `
    <div class="portrait-empty">
      <div class="portrait-empty-mark">Ω</div>
      <p>Portrait coming soon</p>
    </div>
  `;
}

function renderProfile() {
  if (!entry) {
    return;
  }

  document.title = `${entry.name} | Miles' Greek Mythology Explorer`;
  profileName.textContent = entry.name;
  profileType.textContent = entry.typeLabel;
  profileTitle.textContent = entry.title;
  profileSummary.textContent = entry.summary;
  profileAbout.textContent = buildAboutText(entry);
  profileSymbol.textContent = `Symbol: ${entry.symbol}`;
  profileHome.textContent = `Home: ${entry.home}`;
  profileColor.textContent = `Legend Color: ${entry.color}`;
  profileStory.textContent = entry.story;
  mapLink.href = `./map.html#${encodeURIComponent(entry.home)}`;

  const linkedStory = getStoryForEntry(entry.id);
  if (linkedStory) {
    profileStoryLink.hidden = false;
    profileStoryLink.href = `./story.html#${linkedStory.id}`;
  } else {
    profileStoryLink.hidden = true;
    profileStoryLink.removeAttribute("href");
  }

  profileFacts.innerHTML = "";
  entry.facts.forEach((fact) => {
    const item = document.createElement("li");
    item.textContent = fact;
    profileFacts.appendChild(item);
  });

  profilePowers.innerHTML = "";
  entry.powers.forEach((power) => {
    const item = document.createElement("li");
    item.textContent = power;
    profilePowers.appendChild(item);
  });

  const monsterProfile = getMonsterProfile(entry.id);
  if (monsterProfile) {
    monsterPanel.hidden = false;
    monsterPanel.style.display = "";
    monsterDanger.textContent = `Danger: ${"★".repeat(monsterProfile.danger)}`;
    monsterSize.textContent = `Size: ${monsterProfile.size}`;
    monsterWeakness.textContent = `Weakness: ${monsterProfile.weakness}`;
  } else {
    monsterPanel.hidden = true;
    monsterPanel.style.display = "none";
    monsterDanger.textContent = "";
    monsterSize.textContent = "";
    monsterWeakness.textContent = "";
  }

  renderMiniFigure();
}

function renderRelated() {
  if (!entry) {
    return;
  }

  compareCopy.textContent = "Three smart next picks based on family, home, or category.";

  getRelatedEntries(entry.id).forEach((relatedEntry) => {
    const card = document.createElement("article");
    card.className = "story-card related-card";
    card.innerHTML = `
      <p class="card-kicker">${relatedEntry.typeLabel}</p>
      <h3>${relatedEntry.name}</h3>
      <p>${relatedEntry.summary}</p>
      <div class="entry-actions">
        <a class="button button-outline" href="./profile.html#${relatedEntry.id}">Open Profile</a>
      </div>
    `;
    relatedGrid.appendChild(card);
  });
}

function wireProfileActions() {
  if (!entry) {
    return;
  }

  const favorites = loadFavorites();
  favoriteButton.textContent = favorites.includes(entry.id) ? "Unstar Legend" : "Star Legend";
  favoriteButton.addEventListener("click", () => {
    const current = loadFavorites();
    const next = current.includes(entry.id)
      ? current.filter((item) => item !== entry.id)
      : [...current, entry.id];
    saveFavorites(next);
    favoriteButton.textContent = next.includes(entry.id) ? "Unstar Legend" : "Star Legend";
  });

  readAloudButton.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${entry.name}. ${entry.summary}. ${entry.story}.`
    );
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  });
}

renderProfile();
renderRelated();
wireProfileActions();
