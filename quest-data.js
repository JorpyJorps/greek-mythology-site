export const questCatalog = [
  {
    id: "theseus-labyrinth",
    hero: "theseus",
    place: "labyrinth",
    helper: "thread",
    title: "Theseus in the Labyrinth",
    summary: "Use the thread, stay calm, and find the best path through the maze.",
    sceneCount: 6,
    start: {
      id: "start",
      text:
        "Theseus stood at the mouth of the maze. The halls were dark and cold. He tied a red thread near the door. A heavy stomp echoed ahead.",
      choices: [
        { label: "Follow the wall", next: "wall-path", tone: "careful" },
        { label: "Walk toward the stomp", next: "stomp-path", tone: "brave" },
        { label: "Pull out more thread", next: "thread-path", tone: "clever" }
      ]
    },
    steps: [
      {
        id: "wall-path",
        text:
          "Theseus slid one hand along the stone wall. The path was quiet here. He saw two turns ahead. One looked wide. One looked safe.",
        choices: [
          { label: "Take the safe turn", next: "maze-door", tone: "careful" },
          { label: "Run through the wide hall", next: "fail-charge", tone: "brave" },
          { label: "Mark the wall with thread", next: "thread-crossing", tone: "clever" }
        ]
      },
      {
        id: "stomp-path",
        text:
          "Theseus moved toward the sound. Dust shook from the floor. The roar was close now. He knew he had to choose fast.",
        choices: [
          { label: "Hide behind a stone", next: "maze-door", tone: "careful" },
          { label: "Rush into the room", next: "fail-charge", tone: "brave" },
          { label: "Back up and use the thread", next: "thread-crossing", tone: "clever" }
        ]
      },
      {
        id: "thread-path",
        text:
          "Theseus pulled out more red thread. He tied it at each turn. Soon he came to a dark center hall. The maze felt less confusing now.",
        choices: [
          { label: "Move slowly and listen", next: "maze-door", tone: "careful" },
          { label: "Call out to the monster", next: "twist-start", tone: "brave" },
          { label: "Follow the thread back first", next: "close-call", tone: "clever" }
        ]
      },
      {
        id: "maze-door",
        text:
          "Theseus found a bronze door deep in the maze. It was closed, but there was a crack below it. He heard the Minotaur on the other side.",
        choices: [
          { label: "Stay quiet and wait", next: "center-shadow", tone: "careful" },
          { label: "Kick the door open", next: "fail-charge", tone: "brave" },
          { label: "Use the thread to mark the door", next: "center-shadow", tone: "clever" }
        ]
      },
      {
        id: "thread-crossing",
        text:
          "The thread led Theseus to a four-way crossing. One path smelled like dust. One felt cool. One was full of echoes. One was almost silent.",
        choices: [
          { label: "Take the silent path", next: "center-shadow", tone: "careful" },
          { label: "Chase the echoes", next: "twist-start", tone: "brave" },
          { label: "Follow the coolest air", next: "hero-win", tone: "clever" }
        ]
      },
      {
        id: "center-shadow",
        text:
          "Theseus reached a hall with tall shadows on both sides. He heard hooves scrape the floor ahead. The thread tugged softly behind him like a guide back home.",
        choices: [
          { label: "Keep low and move slowly", next: "center-room", tone: "careful" },
          { label: "Shout and challenge the beast", next: "fail-charge", tone: "brave" },
          { label: "Check the thread and mark one more turn", next: "center-room", tone: "clever" }
        ]
      },
      {
        id: "center-room",
        text:
          "At last Theseus reached the center room. He could hear the Minotaur breathing in the dark. He tightened his grip on the thread and looked for the best move.",
        choices: [
          { label: "Use the thread and stay calm", next: "legend-path", tone: "careful" },
          { label: "Charge at once", next: "fail-charge", tone: "brave" },
          { label: "Circle the room first", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "Legend Path",
        text:
          "Theseus stayed calm and used the red thread well. He found the right way through the maze. He moved like the true hero of the story and reached safety.",
        epilogue:
          "When he stepped back into the light, the maze no longer felt bigger than he was. He had followed the path that made him a legend.",
        reward: "Legend reward: True Hero Choice",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Theseus made a smart choice and marked the maze well. He did not take the exact path from the old tale, but he still found his way and won.",
        epilogue:
          "His path was not the old myth exactly, but it was still brave and clever. The maze could not keep him forever.",
        reward: "Reward: Maze Master",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Theseus escaped the danger, but he had to turn back before reaching the center. He made it out safe, though the maze still felt full of secrets.",
        epilogue:
          "Sometimes the brave choice is knowing when to leave and try again later. The maze is still waiting for another run.",
        reward: "Outcome: Safe Escape",
        result: "close"
      },
      {
        id: "twist-start",
        title: "Twist Ending",
        text:
          "Theseus called out into the maze. The sound bounced off the walls and came back at him from every side. He followed the wrong echo and ended up back at the entrance.",
        epilogue:
          "The maze almost seemed to laugh at him. At least he learned that not every loud choice is the right one.",
        reward: "Outcome: Wild Turn",
        result: "twist"
      },
      {
        id: "fail-charge",
        title: "Try Again",
        text:
          "Theseus rushed too fast into danger. The Minotaur heard him at once. He had to run for the door and try the maze again another time.",
        epilogue:
          "Next time he will need more than courage. He will need a cooler head and a better plan.",
        reward: "Try again: The maze beats rushing",
        result: "fail"
      }
    ]
  },
  {
    id: "perseus-cave",
    hero: "perseus",
    place: "dark-cave",
    helper: "shield",
    title: "Perseus in the Dark Cave",
    summary: "Use the bright shield and make careful choices in the cave.",
    sceneCount: 6,
    start: {
      id: "start",
      text:
        "Perseus stepped into the dark cave. Water dripped from the ceiling. He held up his bright shield. Something moved in the shadows ahead.",
      choices: [
        { label: "Look into the shield", next: "shield-path", tone: "clever" },
        { label: "Walk straight ahead", next: "rush-path", tone: "brave" },
        { label: "Listen for a sound", next: "listen-path", tone: "careful" }
      ]
    },
    steps: [
      {
        id: "shield-path",
        text:
          "Perseus watched the cave in the shine of the shield. A shape moved behind a rock. He kept his eyes low and his steps slow.",
        choices: [
          { label: "Step around the rock", next: "stone-bridge", tone: "careful" },
          { label: "Raise the shield higher", next: "echo-room", tone: "clever" },
          { label: "Run deeper into the cave", next: "close-call", tone: "brave" }
        ]
      },
      {
        id: "rush-path",
        text:
          "Perseus took three quick steps into the cave. A hiss rose in the dark. The air felt cold and dangerous around him.",
        choices: [
          { label: "Jump back", next: "stone-bridge", tone: "careful" },
          { label: "Use the shield now", next: "echo-room", tone: "clever" },
          { label: "Keep running", next: "fail-stare", tone: "brave" }
        ]
      },
      {
        id: "listen-path",
        text:
          "Perseus stopped and listened. He heard a scrape of stone and a soft hiss. He could still choose a smart path before the danger saw him.",
        choices: [
          { label: "Use the shield reflection", next: "stone-bridge", tone: "clever" },
          { label: "Throw a rock to distract it", next: "twist-ending", tone: "brave" },
          { label: "Back out of the cave", next: "close-call", tone: "careful" }
        ]
      },
      {
        id: "stone-bridge",
        text:
          "Perseus found a narrow stone bridge over a dark crack in the cave floor. The air was still here. One wrong step could make a loud noise.",
        choices: [
          { label: "Walk slowly with the shield", next: "mirror-pool", tone: "careful" },
          { label: "Run across fast", next: "fail-stare", tone: "brave" },
          { label: "Tap each stone first", next: "mirror-pool", tone: "clever" }
        ]
      },
      {
        id: "mirror-pool",
        text:
          "Beyond the bridge, Perseus found a still black pool. The shield and the water both gave back little flashes of the cave. He could use that shine to move one step closer.",
        choices: [
          { label: "Watch the pool and keep your eyes low", next: "echo-room", tone: "careful" },
          { label: "Rush past before anything moves", next: "close-call", tone: "brave" },
          { label: "Angle the shield toward the pool", next: "echo-room", tone: "clever" }
        ]
      },
      {
        id: "echo-room",
        text:
          "Perseus entered a round room where every sound came back twice. In the shield, he saw danger moving near the far wall. He had one smart chance left.",
        choices: [
          { label: "Use the shield and avoid a direct look", next: "legend-path", tone: "careful" },
          { label: "Race for the door", next: "close-call", tone: "brave" },
          { label: "Move by the wall and keep the shield up", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "Legend Path",
        text:
          "Perseus used the shield the right way and never stared straight at danger. That was the smart move from the old myth. He made it through like a true legend.",
        epilogue:
          "His courage mattered, but his careful thinking mattered just as much. That is what made this the true myth path.",
        reward: "Legend reward: Myth Master Move",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Perseus stayed brave and careful. He used the shield to keep himself safe and found a clear path out of the cave.",
        epilogue:
          "It was not the exact old-story path, but it was still the work of a smart hero with steady nerves.",
        reward: "Reward: Shield Smart",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Perseus escaped, but he had to leave before he finished the quest. He stayed safe, even if the cave still held its mystery.",
        epilogue:
          "The cave kept its secret for one more day. Perseus lived to return with a better plan.",
        reward: "Outcome: Narrow Escape",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "The rock bounced off the cave wall and made a loud crash. Bats flew everywhere. Perseus laughed, ducked low, and hurried out through the fluttering dark.",
        epilogue:
          "It was messy, noisy, and not at all graceful, but it made for a great story on the way home.",
        reward: "Outcome: Bat Storm",
        result: "twist"
      },
      {
        id: "fail-stare",
        title: "Try Again",
        text:
          "Perseus moved too fast and forgot the safest rule. He had to leap away and escape before the danger closed in. Next time, he will need a smarter plan.",
        epilogue:
          "Some quests cannot be won by rushing. The shield must lead the way next time.",
        reward: "Try again: Slow down and think",
        result: "fail"
      }
    ]
  },
  {
    id: "heracles-swamp",
    hero: "hercules",
    place: "swamp-edge",
    helper: "torch",
    title: "Heracles and the Swamp Beast",
    summary: "Strength helps, but the best path still needs smart choices.",
    sceneCount: 6,
    start: {
      id: "start",
      text:
        "Heracles stood near a dark swamp. Mist rolled over the water. He held a bright torch in one hand. In the reeds, something large began to move.",
      choices: [
        { label: "Walk into the swamp", next: "swamp-path", tone: "brave" },
        { label: "Hold the torch high", next: "torch-path", tone: "clever" },
        { label: "Wait and watch", next: "watch-path", tone: "careful" }
      ]
    },
    steps: [
      {
        id: "swamp-path",
        text:
          "Heracles splashed into the muddy water. The ground was soft under his feet. He heard a low growl near the reeds.",
        choices: [
          { label: "Charge at the sound", next: "fail-charge", tone: "brave" },
          { label: "Step back to firm ground", next: "dry-path", tone: "careful" },
          { label: "Lift the torch and look", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "torch-path",
        text:
          "The torchlight showed a safer path by the dry edge of the swamp. Heracles could see where the mud was deep and where the reeds were thin.",
        choices: [
          { label: "Follow the dry path", next: "dry-path", tone: "careful" },
          { label: "Swing the torch in the air", next: "twist-ending", tone: "brave" },
          { label: "Call out to the beast", next: "close-call", tone: "clever" }
        ]
      },
      {
        id: "watch-path",
        text:
          "Heracles stayed still and watched the swamp. Soon he saw bubbles in one place and broken reeds in another. Now he knew where danger was hiding.",
        choices: [
          { label: "Move around the reeds", next: "dry-path", tone: "careful" },
          { label: "Leap toward the bubbles", next: "fail-charge", tone: "brave" },
          { label: "Use the torch to test the mud", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "dry-path",
        text:
          "Heracles found a strip of dry ground beside the swamp. The torch showed old footprints there. The beast was close, but the path was safer than the mud.",
        choices: [
          { label: "Stay on the dry ground", next: "reed-gate", tone: "careful" },
          { label: "Jump off the path", next: "fail-charge", tone: "brave" },
          { label: "Test the ground with the torch", next: "reed-gate", tone: "clever" }
        ]
      },
      {
        id: "reed-path",
        text:
          "The reeds opened to a dark pool. Heracles heard the beast breathing nearby. He could fight wildly, or he could make one smart final move.",
        choices: [
          { label: "Circle the pool slowly", next: "reed-gate", tone: "careful" },
          { label: "Roar and rush in", next: "fail-charge", tone: "brave" },
          { label: "Hold the torch low and watch the reeds", next: "hero-win", tone: "clever" }
        ]
      },
      {
        id: "reed-gate",
        text:
          "At the far end of the reeds, Heracles found a narrow gate of roots and mud. The beast was just beyond it. One path looked solid, and one looked quick but risky.",
        choices: [
          { label: "Take the solid path", next: "beast-den", tone: "careful" },
          { label: "Break through the roots", next: "fail-charge", tone: "brave" },
          { label: "Use the torch to test each step", next: "beast-den", tone: "clever" }
        ]
      },
      {
        id: "beast-den",
        text:
          "At the edge of the beast's den, Heracles saw deep mud, broken reeds, and one safe way forward. He had the strength to charge, but wisdom would decide the quest.",
        choices: [
          { label: "Take the safe way and stay steady", next: "legend-path", tone: "careful" },
          { label: "Charge into the dark", next: "fail-charge", tone: "brave" },
          { label: "Use the torch to guide each step", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "Legend Path",
        text:
          "Heracles used both strength and smart thinking. He stayed out of the deepest mud and chose the safest way forward. Like the best hero tales, he won by more than muscle alone.",
        epilogue:
          "The swamp did not beat him, because he used wisdom as well as power. That is what made this the strongest ending.",
        reward: "Legend reward: True Hero Strength",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Heracles made a strong and smart choice. He did not follow the exact old-story path, but he still got through the swamp and won the day.",
        epilogue:
          "He found a good ending by trusting both his hands and his head. That still counts as a hero's win.",
        reward: "Reward: Swamp Survivor",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Heracles scared the beast away, but he had to leave before finishing the whole quest. It was a brave escape and a near win.",
        epilogue:
          "The beast slipped back into the reeds, and the swamp stayed dangerous. Heracles would need another chance to finish the job.",
        reward: "Outcome: Near Victory",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Heracles swung the torch in a huge circle. The light scared a flock of birds out of the reeds. He laughed as they burst into the air and raced above the swamp.",
        epilogue:
          "He did not find the beast, but he turned the swamp into a wild flashing storm of wings and light.",
        reward: "Outcome: Torch Tornado",
        result: "twist"
      },
      {
        id: "fail-charge",
        title: "Try Again",
        text:
          "Heracles rushed at the wrong moment. The mud slowed him down, and the beast slipped away into the swamp. He would need a better plan next time.",
        epilogue:
          "Even the strongest hero can lose to bad footing and bad timing. Next time, the swamp must be read before it is fought.",
        reward: "Try again: Strength needs a plan",
        result: "fail"
      }
    ]
  },
  {
    id: "odysseus-sea-cliffs",
    hero: "odysseus",
    place: "sea-cliffs",
    helper: "rope",
    title: "Odysseus by the Sea Cliffs",
    summary: "Brains matter most when the sea, wind, and strange voices all pull at once.",
    sceneCount: 6,
    start: {
      id: "start",
      text:
        "Odysseus stood by tall sea cliffs as waves crashed below. He wrapped a strong rope around his arm. Somewhere over the water, a strange song floated through the mist.",
      choices: [
        { label: "Listen from far away", next: "mist-path", tone: "careful" },
        { label: "Walk toward the song", next: "song-path", tone: "brave" },
        { label: "Tie the rope to a stone post", next: "rope-path", tone: "clever" }
      ]
    },
    steps: [
      {
        id: "mist-path",
        text:
          "Odysseus stayed near the cliff wall. The song rose and fell with the wind. He saw two narrow paths ahead. One was bright with sea spray. One was shaded and quiet.",
        choices: [
          { label: "Take the quiet path", next: "cliff-turn", tone: "careful" },
          { label: "Run down the bright path", next: "fail-song", tone: "brave" },
          { label: "Anchor the rope first", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "song-path",
        text:
          "Odysseus stepped closer to the song. The music sounded sweet, but the rocks below looked sharp and black. He knew beautiful things could still be dangerous.",
        choices: [
          { label: "Step back and think", next: "cliff-turn", tone: "careful" },
          { label: "Call back to the voices", next: "twist-ending", tone: "brave" },
          { label: "Use the rope to hold fast", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "rope-path",
        text:
          "Odysseus tied the rope tight to an old stone post. The wind pulled at him, but the rope held. Now he could move and still keep himself from rushing toward danger.",
        choices: [
          { label: "Follow the wall slowly", next: "cliff-turn", tone: "careful" },
          { label: "Lean toward the song", next: "close-call", tone: "brave" },
          { label: "Keep the rope tight and move on", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "cliff-turn",
        text:
          "At a bend in the cliff path, Odysseus found broken shells and old rope marks in the stone. Someone else had stood here before and chosen badly.",
        choices: [
          { label: "Stay by the rock wall", next: "rope-gate", tone: "careful" },
          { label: "Climb onto the edge", next: "fail-song", tone: "brave" },
          { label: "Test the ground with the rope", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "rope-gate",
        text:
          "The path opened to a stone arch facing the sea. The song was loud now. Odysseus had one last choice before the cliffs dropped away below him.",
        choices: [
          { label: "Keep tied and trust your plan", next: "sea-arch", tone: "careful" },
          { label: "Break free and race forward", next: "fail-song", tone: "brave" },
          { label: "Use the rope to guide each step", next: "sea-arch", tone: "clever" }
        ]
      },
      {
        id: "sea-arch",
        text:
          "Under the arch, Odysseus could hear the full pull of the singing. The sea flashed below, and the rope pulled steady at his waist. Cleverness would decide the ending now.",
        choices: [
          { label: "Ignore the song and move past it", next: "legend-path", tone: "careful" },
          { label: "Leap toward the voices", next: "fail-song", tone: "brave" },
          { label: "Use the rope and slip by the edge", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "Legend Path",
        text:
          "Odysseus trusted the rope and his careful plan. He passed the danger without giving in to the song. That is the truest path for the clever hero of the Odyssey.",
        epilogue:
          "He won because he planned ahead and did not trust the sweet voices. The sea still roared, but it did not trick him.",
        reward: "Legend reward: Sea-Clever Choice",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Odysseus stayed smart and used the rope well. He found a safe way beyond the cliff path and left the singing behind him.",
        epilogue:
          "It was not the exact old-story version, but it still felt like the work of a hero who wins with brains first.",
        reward: "Reward: Stormy Escape",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Odysseus pulled away from the song just in time. He escaped the cliffs, but he had to leave the path unfinished.",
        epilogue:
          "The voices faded behind him, and that alone was a victory. Next time he may find the stronger ending.",
        reward: "Outcome: Narrow Escape",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Odysseus called back to the singing, and a flock of sea birds burst out of the mist instead. The song vanished at once, and only the birds answered him.",
        epilogue:
          "He laughed at the strange trick of the sea. Even when the path went oddly, it still made a good tale.",
        reward: "Outcome: Sea Bird Surprise",
        result: "twist"
      },
      {
        id: "fail-song",
        title: "Try Again",
        text:
          "Odysseus moved too close to the singing and forgot his careful plan. He had to grab the rope and pull himself back before the cliffs won.",
        epilogue:
          "The sea is not a place for rushed choices. Next time he must trust his plan from the very start.",
        reward: "Try again: Clever beats rushing",
        result: "fail"
      }
    ]
  },
  {
    id: "atalanta-forest-run",
    hero: "atalanta",
    place: "forest-trail",
    helper: "bow",
    title: "Atalanta on the Forest Trail",
    summary: "Speed helps, but the best forest path still rewards calm aim and sharp eyes.",
    sceneCount: 6,
    start: {
      id: "start",
      text:
        "Atalanta stood on a forest trail with her bow ready. The trees were tall and quiet. Ahead, a wild beast crashed through the brush and shook the leaves.",
      choices: [
        { label: "Move silently between the trees", next: "tree-path", tone: "careful" },
        { label: "Race after the beast", next: "rush-path", tone: "brave" },
        { label: "Nock an arrow and study the trail", next: "bow-path", tone: "clever" }
      ]
    },
    steps: [
      {
        id: "tree-path",
        text:
          "Atalanta slipped between two thick trees. She found fresh tracks in the dirt and broken branches low to the ground. The beast was near, but it had not seen her yet.",
        choices: [
          { label: "Follow the tracks slowly", next: "creek-path", tone: "careful" },
          { label: "Jump over the brush and charge", next: "fail-rush", tone: "brave" },
          { label: "Mark the trail with an arrow scratch", next: "ridge-path", tone: "clever" }
        ]
      },
      {
        id: "rush-path",
        text:
          "Atalanta ran fast down the trail. The branches slapped past her shoulders. She heard the beast ahead, but speed alone made the forest hard to read.",
        choices: [
          { label: "Slow down and listen", next: "creek-path", tone: "careful" },
          { label: "Leap toward the sound", next: "fail-rush", tone: "brave" },
          { label: "Climb a low rock to look ahead", next: "ridge-path", tone: "clever" }
        ]
      },
      {
        id: "bow-path",
        text:
          "Atalanta lifted her bow and studied the trail. One branch bent toward a creek. Another pointed up toward a ridge. A smart hunter could read both the ground and the trees.",
        choices: [
          { label: "Head toward the creek", next: "creek-path", tone: "careful" },
          { label: "Run through the brush now", next: "twist-ending", tone: "brave" },
          { label: "Take the ridge for a better view", next: "ridge-path", tone: "clever" }
        ]
      },
      {
        id: "creek-path",
        text:
          "The trail crossed a shallow creek. Atalanta saw clear hoofprints in the mud and one safe stone path over the water. The wrong step would splash and give her away.",
        choices: [
          { label: "Cross on the stones", next: "hunter-ring", tone: "careful" },
          { label: "Splash straight through", next: "fail-rush", tone: "brave" },
          { label: "Use the bow to test each stone", next: "hunter-ring", tone: "clever" }
        ]
      },
      {
        id: "ridge-path",
        text:
          "From the ridge, Atalanta could see the trail curve through a ring of trees. The beast circled there below. She had the better view now, but she still needed the better choice.",
        choices: [
          { label: "Move down quietly", next: "hunter-ring", tone: "careful" },
          { label: "Jump from the ridge", next: "fail-rush", tone: "brave" },
          { label: "Line up the path with the bow", next: "hunter-ring", tone: "clever" }
        ]
      },
      {
        id: "hunter-ring",
        text:
          "Atalanta reached a ring of old trees where the beast paced in the shadows. She had a clear line, a steady bow, and one last chance to choose the right hunter's move.",
        choices: [
          { label: "Wait, breathe, and aim true", next: "legend-path", tone: "careful" },
          { label: "Rush in with a shout", next: "fail-rush", tone: "brave" },
          { label: "Circle wide and take the shot", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "Legend Path",
        text:
          "Atalanta stayed calm, read the forest well, and made the clean hunter's choice. She won with speed, skill, and perfect aim.",
        epilogue:
          "The forest fell quiet around her. She had followed the strongest path for a hero known for sharp eyes and fast feet.",
        reward: "Legend reward: Hunter's Aim",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Atalanta circled wide, kept her balance, and found a smart shot. It was not the most classic path, but it still ended in a hero's victory.",
        epilogue:
          "The trail behind her showed quick thinking and strong skill. The forest remembered the win anyway.",
        reward: "Reward: Forest Champion",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Atalanta escaped the danger and kept herself safe, but the beast broke away before the quest was done.",
        epilogue:
          "A fast retreat can still be a smart move. The forest trail will be ready when she returns.",
        reward: "Outcome: Beast Escapes",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Atalanta rushed through the brush and startled a whole family of deer instead. They burst across the trail in every direction while the real beast slipped away.",
        epilogue:
          "The forest answered her speed with chaos. It was not the ending she wanted, but it was a wild one.",
        reward: "Outcome: Deer Dash",
        result: "twist"
      },
      {
        id: "fail-rush",
        title: "Try Again",
        text:
          "Atalanta moved too fast and gave her place away. The beast crashed deeper into the woods before she could finish the hunt.",
        epilogue:
          "Even a swift hero must sometimes slow down. The best hunter reads the forest before taking the shot.",
        reward: "Try again: Slow aim beats fast feet",
        result: "fail"
      }
    ]
  },
  {
    id: "jason-harbor-run",
    hero: "jason",
    place: "harbor-docks",
    helper: "map",
    title: "Jason at the Harbor Docks",
    summary: "A quest at the docks where a careful plan matters more than rushing onto the water.",
    sceneCount: 6,
    start: {
      id: "start",
      text:
        "Jason stood at the harbor docks before sunrise. He held a sea map in both hands. The tide was low, the ropes creaked, and a shadow moved between the boats.",
      choices: [
        { label: "Study the map first", next: "map-path", tone: "clever" },
        { label: "Run to the nearest boat", next: "rush-path", tone: "brave" },
        { label: "Listen by the water", next: "dock-path", tone: "careful" }
      ]
    },
    steps: [
      {
        id: "map-path",
        text:
          "Jason traced the harbor with one finger. The map showed a safe dock, a narrow gangplank, and a warning mark near the far boats. He could plan his path before he moved.",
        choices: [
          { label: "Take the safe dock", next: "rope-bridge", tone: "careful" },
          { label: "Dash for the far boats", next: "fail-rush", tone: "brave" },
          { label: "Mark the warning spot on the map", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "rush-path",
        text:
          "Jason ran across the wet boards. The harbor wind pushed at his cloak. One loose plank knocked under his foot, and the dark water slapped the side of the dock.",
        choices: [
          { label: "Slow down and look around", next: "rope-bridge", tone: "careful" },
          { label: "Leap to the next boat", next: "fail-rush", tone: "brave" },
          { label: "Pull out the map now", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "dock-path",
        text:
          "Jason knelt near the edge of the dock. He heard water moving under the boards and a rope tapping a mast in the wind. The harbor had a rhythm if he listened closely.",
        choices: [
          { label: "Follow the quiet rhythm", next: "rope-bridge", tone: "careful" },
          { label: "Call out into the fog", next: "twist-ending", tone: "brave" },
          { label: "Check the map with the tide sounds", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "rope-bridge",
        text:
          "Jason reached a narrow rope bridge between two dock posts. The boards were slick, but a line of lantern hooks showed the steady route forward.",
        choices: [
          { label: "Step across one board at a time", next: "harbor-turn", tone: "careful" },
          { label: "Run before the bridge sways", next: "fail-rush", tone: "brave" },
          { label: "Use the map to check your direction", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "harbor-turn",
        text:
          "At the far side of the bridge, Jason saw three boats tied together. One held cargo, one looked empty, and one had a torn sail. The map showed only one as safe.",
        choices: [
          { label: "Board the safe boat", next: "golden-bow", tone: "careful" },
          { label: "Jump to the torn-sail boat", next: "fail-rush", tone: "brave" },
          { label: "Check the map against the sail marks", next: "golden-bow", tone: "clever" }
        ]
      },
      {
        id: "golden-bow",
        text:
          "On the safe boat, Jason found a locked chest and a gold-painted prow facing open water. The harbor path was nearly won, but the last choice still mattered.",
        choices: [
          { label: "Trust the map and take the marked route", next: "legend-path", tone: "careful" },
          { label: "Push off at once and hope", next: "fail-rush", tone: "brave" },
          { label: "Use the map and tide marks together", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "Legend Path",
        text:
          "Jason trusted the map, read the harbor well, and followed the safest marked route. He won like a true quest leader who knows planning beats rushing.",
        epilogue:
          "The dawn opened over the water as he left the docks behind. Calm thinking guided him better than speed ever could.",
        reward: "Legend reward: Captain's Route",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Jason used the map and the tide together. It was not the straight old-story path, but it was a smart one, and it carried him safely through the harbor.",
        epilogue:
          "He earned the win by thinking like a leader and moving at the right moment.",
        reward: "Reward: Harbor Captain",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Jason found a safe way back from the docks, but he had to stop before the quest was fully won. He kept the map and lived to sail again.",
        epilogue:
          "Sometimes a good retreat saves the next adventure. The harbor still holds more to discover.",
        reward: "Outcome: Safe Return",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Jason called into the fog, and five dock birds answered him at once. They burst from a mast rope in a loud flapping cloud and nearly knocked his map from his hands.",
        epilogue:
          "The harbor answered with noise, feathers, and surprise. It was not the neat ending he wanted, but it was a funny one.",
        reward: "Outcome: Dock Bird Burst",
        result: "twist"
      },
      {
        id: "fail-rush",
        title: "Try Again",
        text:
          "Jason moved too fast over the wet docks and lost the best route. He had to grab a post, pull himself back, and begin again with a calmer head.",
        epilogue:
          "A great quest leader does not just run first. Next time, the map must lead the way.",
        reward: "Try again: Read the route first",
        result: "fail"
      }
    ]
  }
];

export const questHeroes = [
  { id: "theseus", label: "Theseus" },
  { id: "perseus", label: "Perseus" },
  { id: "hercules", label: "Heracles" },
  { id: "odysseus", label: "Odysseus" },
  { id: "atalanta", label: "Atalanta" },
  { id: "jason", label: "Jason" }
];

export const questPlaces = [
  { id: "labyrinth", label: "Labyrinth" },
  { id: "dark-cave", label: "Dark Cave" },
  { id: "swamp-edge", label: "Swamp Edge" },
  { id: "sea-cliffs", label: "Sea Cliffs" },
  { id: "forest-trail", label: "Forest Trail" },
  { id: "harbor-docks", label: "Harbor Docks" }
];

export const questHelpers = [
  { id: "thread", label: "Red Thread" },
  { id: "shield", label: "Bright Shield" },
  { id: "torch", label: "Magic Torch" },
  { id: "rope", label: "Strong Rope" },
  { id: "bow", label: "Hunter's Bow" },
  { id: "map", label: "Sea Map" }
];

export function getQuestBySelection(heroId, placeId, helperId) {
  return questCatalog.find(
    (quest) => quest.hero === heroId && quest.place === placeId && quest.helper === helperId
  );
}
