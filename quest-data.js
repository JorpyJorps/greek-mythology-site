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
        "BOOM. The door slammed shut behind Theseus. Darkness swallowed the maze. The air smelled like wet stone and something alive. He tied Ariadne's red thread near the door. Far ahead — a heavy STOMP. The floor shook. His heart pounded. One choice, right now.",
      choices: [
        { label: "Follow the wall with one hand", next: "wall-path", tone: "careful" },
        { label: "Run toward the stomp", next: "stomp-path", tone: "brave" },
        { label: "Unspool the thread and map the halls", next: "thread-path", tone: "clever" }
      ]
    },
    steps: [
      {
        id: "wall-path",
        text:
          "Stone. Cold and rough under his fingers. Theseus moved inch by inch. The maze stayed quiet — too quiet. Then he smelled it. Something animal. Something huge. Two passages opened ahead. One dark. One darker.",
        choices: [
          { label: "Take the less dark passage slowly", next: "maze-door", tone: "careful" },
          { label: "Sprint into the darkest one — surprise it!", next: "brave-charge-win", tone: "brave" },
          { label: "Tie a thread marker and think", next: "thread-crossing", tone: "clever" }
        ]
      },
      {
        id: "stomp-path",
        text:
          "BOOM. BOOM. The Minotaur was close. Theseus could feel it in his teeth. Then — silence. The beast had stopped. It was listening for HIM. Theseus froze. He could hear it breathing. Hot breath drifted around the corner.",
        choices: [
          { label: "Press flat against the wall and wait", next: "maze-door", tone: "careful" },
          { label: "Shout and charge — catch it off guard!", next: "brave-shout-win", tone: "brave" },
          { label: "Lay the thread quietly and back away", next: "thread-crossing", tone: "clever" }
        ]
      },
      {
        id: "thread-path",
        text:
          "Smart. The red thread unspooled behind him like a trail of bread crumbs. Left turn. Right turn. Dead end — back up. The thread remembered everything. Soon he found a wide hall with tall shadows. The Minotaur had been HERE. The hoofprints were deep in the stone.",
        choices: [
          { label: "Move slowly and stay low", next: "maze-door", tone: "careful" },
          { label: "Yell — make it come to YOU", next: "twist-start", tone: "brave" },
          { label: "Follow the thread to the center", next: "center-shadow", tone: "clever" }
        ]
      },
      {
        id: "brave-charge-win",
        text:
          "Theseus sprinted into the dark — and fell straight into a hidden chamber! Torches on the walls. A golden shield. And a second door that led AROUND the Minotaur entirely. Theseus laughed out loud. Sometimes the wild choice finds the shortcut.",
        choices: [
          { label: "Grab the shield and keep going", next: "center-room", tone: "brave" },
          { label: "Take the second door carefully", next: "center-shadow", tone: "careful" },
          { label: "Mark it on the thread and plan the final route", next: "center-room", tone: "clever" }
        ]
      },
      {
        id: "brave-shout-win",
        text:
          "THESEUS ROARED. The Minotaur roared back — and the echo bounced so wildly off the walls that it confused ITSELF. It crashed into a dead-end passage. Theseus heard it bellowing and rattling around in the wrong tunnel. The path ahead was clear!",
        choices: [
          { label: "Race for the center room NOW", next: "center-room", tone: "brave" },
          { label: "Move quietly while it's stuck", next: "center-shadow", tone: "careful" },
          { label: "Follow the thread to make sure you don't get lost", next: "center-room", tone: "clever" }
        ]
      },
      {
        id: "maze-door",
        text:
          "A bronze door. Old. Heavy. With a crack along the bottom. Something breathed on the other side. Long slow breaths. The Minotaur was resting. Theseus could hear its hooves scrape the floor as it shifted. This was it. The center room was just beyond.",
        choices: [
          { label: "Wait for it to move away from the door", next: "center-shadow", tone: "careful" },
          { label: "KICK IT OPEN and rush in!", next: "fail-charge", tone: "brave" },
          { label: "Loop the thread through the crack to check the room", next: "center-shadow", tone: "clever" }
        ]
      },
      {
        id: "thread-crossing",
        text:
          "Four passages. The thread was a perfect X at his feet. Theseus closed his eyes and thought. One path smelled like mud. One felt cold. One had tiny sounds — dripping water. One was totally silent. Ariadne had told him: follow the cold air. It leads out.",
        choices: [
          { label: "Follow the silent path", next: "center-shadow", tone: "careful" },
          { label: "Chase the dripping — water means a way through!", next: "twist-start", tone: "brave" },
          { label: "Follow the cold air like Ariadne said", next: "hero-win", tone: "clever" }
        ]
      },
      {
        id: "center-shadow",
        text:
          "The hall widened. Huge shadows stretched up the walls — some of them MOVING. Theseus looked down. Hoofprints, fresh ones, led straight ahead. The thread tugged at his hand like a finger pointing home. Almost there.",
        choices: [
          { label: "Keep low and creep forward", next: "center-room", tone: "careful" },
          { label: "Yell and challenge the Minotaur to face you!", next: "fail-charge", tone: "brave" },
          { label: "Follow the thread and keep it taut", next: "center-room", tone: "clever" }
        ]
      },
      {
        id: "center-room",
        text:
          "The center room. Round walls. Bones on the floor. A massive shape in the far corner — the Minotaur, huge as a horse, bull-headed, watching with red eyes. It snorted. Hot steam rose from its nostrils. Theseus gripped the thread. This was what he came for.",
        choices: [
          { label: "Use the thread as a guide and move calmly", next: "legend-path", tone: "careful" },
          { label: "CHARGE! Full speed!", next: "fail-charge", tone: "brave" },
          { label: "Circle the room and find the angle", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "The True Legend",
        text:
          "Theseus didn't panic. He held the thread. He moved like water — calm, steady. The Minotaur charged. He stepped aside. It crashed into the wall. He used the thread to find his way back through every twist and turn, and walked out into golden sunlight. Ariadne was waiting.",
        epilogue:
          "That's the real myth. The thread was everything. Bravery got him IN. Cleverness got him OUT. That's what made Theseus a legend.",
        reward: "Legend reward: True Hero Choice",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Theseus found his own path through. Not exactly the old story — but he made it out, and the Minotaur did NOT. He followed the cold air back to sunlight, thread trailing behind him like a red river.",
        epilogue:
          "Not every hero follows the old map. Sometimes you make your own. That still counts.",
        reward: "Reward: Maze Master",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Theseus heard the Minotaur coming and made a fast choice: retreat. He followed the thread back at a dead run, burst through the entrance, and slammed the door behind him. Safe.",
        epilogue:
          "Running away is not failure. Knowing when to stop is what keeps a hero alive to try again.",
        reward: "Outcome: Safe Escape",
        result: "close"
      },
      {
        id: "twist-start",
        title: "Twist Ending",
        text:
          "Theseus yelled into the maze. The echo bounced back from a hundred walls — and came back sounding like TEN different people yelling. The Minotaur panicked, crashed through three wrong passages, and ended up blocking its own way out. Theseus jogged past it while it was stuck.",
        epilogue:
          "The maze did the hard work for him. He was too surprised to feel proud. But he made it out.",
        reward: "Outcome: Echo Trick",
        result: "twist"
      },
      {
        id: "fail-charge",
        title: "Oops! Try Again",
        text:
          "Theseus ran straight at the Minotaur. The Minotaur also ran straight at Theseus. BOOM. He bounced off it like a rubber ball and landed in a pile of old hay. The Minotaur looked at him. He looked at the Minotaur. He ran.",
        epilogue:
          "Even heroes bounce sometimes. Try again!",
        reward: "Try again: The maze is waiting",
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
        "The cave was so dark Perseus couldn't see his own hand. Water dripped everywhere. He raised the bronze shield and tilted it — and the tiny reflection showed the cave around him like a flickering mirror. Something moved deep inside. Something that turned everything it touched to stone.",
      choices: [
        { label: "Watch the cave through the shield reflection", next: "shield-path", tone: "clever" },
        { label: "Walk straight ahead — he's brave enough", next: "rush-path", tone: "brave" },
        { label: "Stop and listen for sounds first", next: "listen-path", tone: "careful" }
      ]
    },
    steps: [
      {
        id: "shield-path",
        text:
          "The shield showed everything backwards and tiny — but it was enough. A shape behind a rock. Snakes moving. Eyes like headlights. Perseus kept his own eyes glued to the reflection and breathed very, very slowly.",
        choices: [
          { label: "Step sideways around the rock, eyes down", next: "stone-bridge", tone: "careful" },
          { label: "Angle the shield higher for a better view", next: "echo-room", tone: "clever" },
          { label: "Hold the shield up and just walk forward boldly", next: "brave-shield-walk", tone: "brave" }
        ]
      },
      {
        id: "rush-path",
        text:
          "Perseus took three big steps into the cave — and immediately heard a hiss so loud it bounced off every wall at once. The air went cold. Very cold. He could feel the cave going STILL around him. He needed to do something smart, right now.",
        choices: [
          { label: "Jump sideways and press against the wall", next: "stone-bridge", tone: "careful" },
          { label: "Whip up the shield and look through it", next: "echo-room", tone: "clever" },
          { label: "Keep charging — he came this far!", next: "fail-stare", tone: "brave" }
        ]
      },
      {
        id: "listen-path",
        text:
          "Perseus held his breath. Scrape. Scrape. A soft hiss. Then — nothing. The danger didn't know he was here yet. He still had time to pick his move. Every second he stayed still was one more second of advantage.",
        choices: [
          { label: "Use the shield reflection to move forward", next: "stone-bridge", tone: "clever" },
          { label: "Throw a rock to make noise somewhere else", next: "twist-ending", tone: "brave" },
          { label: "Back slowly toward the entrance", next: "close-call", tone: "careful" }
        ]
      },
      {
        id: "brave-shield-walk",
        text:
          "Perseus raised the shield like a lantern and walked forward with giant steady steps — CLANG, CLANG, CLANG. The Medusa heard him and turned toward the sound. But she turned toward the SOUND of the shield, not his face. He was already past her on the left.",
        choices: [
          { label: "Keep moving, eyes on the reflection only", next: "echo-room", tone: "careful" },
          { label: "Make MORE noise — confuse her further!", next: "echo-room", tone: "brave" },
          { label: "Use the noise as cover to get around her", next: "hero-win", tone: "clever" }
        ]
      },
      {
        id: "stone-bridge",
        text:
          "A narrow stone bridge over a black crack in the floor. One wrong step — SPLASH — and the cave would know exactly where Perseus was. He looked at the reflection in the shield. Something large was moving behind him, slowly.",
        choices: [
          { label: "Walk slowly heel-to-toe with the shield up", next: "mirror-pool", tone: "careful" },
          { label: "Sprint across before it gets close!", next: "fail-stare", tone: "brave" },
          { label: "Test each stone first with one foot", next: "mirror-pool", tone: "clever" }
        ]
      },
      {
        id: "mirror-pool",
        text:
          "A still black pool. The shield AND the pool both showed tiny reflections. Together they were like two mirrors pointing at each other — Perseus could see almost the whole cave at once. He saw Medusa. She was close. She hadn't seen him yet.",
        choices: [
          { label: "Watch both reflections and move along the wall", next: "echo-room", tone: "careful" },
          { label: "Use the double reflection to get close — then strike!", next: "echo-room", tone: "brave" },
          { label: "Angle the shield to use both reflections perfectly", next: "legend-path", tone: "clever" }
        ]
      },
      {
        id: "echo-room",
        text:
          "A round room where every sound came back twice. The shield showed Medusa near the far wall — her snakes moving, her eyes sweeping left and right. One clear chance. One direction where she wasn't looking. Perseus's hand tightened on the sword.",
        choices: [
          { label: "Use the shield and look away — let the reflection guide the strike", next: "legend-path", tone: "careful" },
          { label: "Race for the door right now while her back is partly turned", next: "close-call", tone: "brave" },
          { label: "Move along the wall and keep the shield between you", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "The True Legend",
        text:
          "Perseus kept his eyes on the reflection. Not once did he look directly at Medusa. His sword arm moved on its own — guided by nothing but the tiny upside-down image in the shield. One clean strike. Then silence. Then the cave was just a cave again.",
        epilogue:
          "That's exactly how the myth goes. The shield wasn't just a weapon — it was the only tool that worked. Perseus walked out carrying something no one else had ever managed to bring back.",
        reward: "Legend reward: Myth Master Move",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Perseus found his way through. Not exactly the old story path — but he used the shield well, kept his eyes down, and got the job done. The cave spat him out on the other side, slightly shaky but definitely victorious.",
        epilogue:
          "Smart choices look different every time. He was still brave. He was still clever. He still won.",
        reward: "Reward: Shield Smart",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Perseus decided the cave wasn't worth the risk today. He backed toward the entrance, step by step, eyes on the reflection until he felt sunlight on his back. He'd come back with a better plan.",
        epilogue:
          "The cave kept its secret one more day. Perseus kept his head. Both good outcomes, honestly.",
        reward: "Outcome: Narrow Escape",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Perseus threw a rock deep into the cave. It bounced, cracked, and knocked over a pile of old pottery that clanged around the cave for a full thirty seconds. When the noise stopped, he heard Medusa on the complete other side of the cave, totally confused. He walked past her in the silence.",
        epilogue:
          "Sometimes the messiest plan works the best. He still isn't sure how.",
        reward: "Outcome: Pottery Chaos",
        result: "twist"
      },
      {
        id: "fail-stare",
        title: "Oops! Try Again",
        text:
          "Perseus moved too fast — and accidentally looked up for exactly half a second. He saw something he definitely should not have. He slammed his eyes shut and ran for the entrance at full speed, bouncing off walls the whole way. He made it out. His eyes stayed shut for a while after, just in case.",
        epilogue:
          "The shield is there for a reason! Try again — and keep those eyes DOWN.",
        reward: "Try again: Shield first, always",
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
        "Heracles was the strongest man alive. He once held up the sky. He once wrestled a river. And yet the Lernaean Hydra still made his stomach drop. Nine heads. NINE. And every time you cut one off — two more grew back. He stood at the swamp edge. The torch in his hand was as tall as a child. Something enormous rose from the reeds.",
      choices: [
        { label: "Wade into the swamp to meet it", next: "swamp-path", tone: "brave" },
        { label: "Hold the torch high and study the beast", next: "torch-path", tone: "clever" },
        { label: "Wait and watch how it moves", next: "watch-path", tone: "careful" }
      ]
    },
    steps: [
      {
        id: "swamp-path",
        text:
          "SPLASH. Heracles waded in, mud sucking at his boots. The Hydra rose from the water — all nine heads swaying like a horrible tree. 'ROAR!' He grabbed the nearest neck and WHACK — cut the head clean off. Then he heard it. A wet gurgling noise. And two new heads pushed out of the stump.",
        choices: [
          { label: "KEEP CUTTING — more cuts, more wins!", next: "fail-more-heads", tone: "brave" },
          { label: "Back up to dry ground and think", next: "dry-path", tone: "careful" },
          { label: "Shove the torch at the neck stump — fire might stop the growing!", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "torch-path",
        text:
          "The torchlight showed all nine heads clearly. They each moved differently — some fast, some slow. Heracles remembered something his nephew Iolaus had said: 'The heads grow back. But fire closes the wound.' The torch in his hand suddenly felt more important than his sword.",
        choices: [
          { label: "Take the dry path around to get closer safely", next: "dry-path", tone: "careful" },
          { label: "Wave the torch at all nine heads at once — scare them!", next: "twist-ending", tone: "brave" },
          { label: "Target just the biggest head first, then torch the stump", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "watch-path",
        text:
          "Heracles stayed very still. The Hydra sniffed the air — all nine heads sniffing in different directions. It couldn't find him. He noticed something: the heads in the center moved slower. And beneath the water, he could see where the beast's body was. One solid target.",
        choices: [
          { label: "Move carefully to dry ground for a better position", next: "dry-path", tone: "careful" },
          { label: "Jump at the slow center head — NOW!", next: "fail-more-heads", tone: "brave" },
          { label: "Use the torch on the body — where the heads connect", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "fail-more-heads",
        text:
          "Heracles swung his sword left, right, up, down. CUT. CUT. CUT. And with every cut — pop, pop, pop — two new heads sprouted. He stopped and stared. He now faced seventeen heads. They all looked at him at the same time. He counted again. Still seventeen.",
        choices: [
          { label: "Stop cutting. Back away slowly.", next: "dry-path", tone: "careful" },
          { label: "FINE. Cut FASTER.", next: "fail-charge", tone: "brave" },
          { label: "The torch! The torch is the answer!", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "dry-path",
        text:
          "Dry ground. Finally. Heracles caught his breath. The Hydra lurked in the water nearby. He could hear all nine heads splashing. He couldn't beat it by fighting the way he usually fought. He needed a different kind of strength — the kind that thinks.",
        choices: [
          { label: "Circle the swamp to find the best attack point", next: "reed-gate", tone: "careful" },
          { label: "Leap back in and fight harder than ever!", next: "fail-charge", tone: "brave" },
          { label: "Heat the torch as hot as possible and aim for the stumps", next: "reed-path", tone: "clever" }
        ]
      },
      {
        id: "reed-path",
        text:
          "Heracles swung hard — and burned the stump the instant the head fell. The neck went dark. Nothing grew. He let out a massive shout. THAT was how you did it. He just had to be fast enough: cut and burn, cut and burn. Eight heads to go.",
        choices: [
          { label: "Work steadily through each one", next: "reed-gate", tone: "careful" },
          { label: "Cut and torch as FAST AS POSSIBLE!", next: "hero-win", tone: "brave" },
          { label: "Save the immortal center head for last — that one needs a rock, not fire", next: "reed-gate", tone: "clever" }
        ]
      },
      {
        id: "reed-gate",
        text:
          "One head left. The immortal one. Fire hadn't worked on it. Heracles stared at it. It stared back. Then he saw a heavy flat boulder near the swamp's edge — the kind you could bury something under. Iolaus had mentioned this too.",
        choices: [
          { label: "Bury the immortal head under the boulder", next: "legend-path", tone: "careful" },
          { label: "Hit it so hard it CAN'T grow back", next: "fail-charge", tone: "brave" },
          { label: "Roll the boulder over it while the head is distracted", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "The True Legend",
        text:
          "Cut and torch. Cut and torch. Eight heads down, one to go — the one that couldn't die. Heracles didn't try to kill it. He rolled the massive boulder right on top of it and held it there with both hands until the swamp went still. Done.",
        epilogue:
          "That's the real story. The Hydra wasn't beaten by the strongest arms in Greece — it was beaten by the right tool at the right time. Heracles was smart enough to figure that out. Eventually.",
        reward: "Legend reward: True Hero Strength",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Heracles found his own version of the cut-and-torch method and worked through every head as fast as he possibly could. His arm was on fire (not literally, but almost) by the end. The Hydra finally sank into the swamp. He collapsed on dry ground and stared at the sky.",
        epilogue:
          "He found his own way to the right answer. Strength AND brains. That's a hero's win.",
        reward: "Reward: Swamp Survivor",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Heracles scared the Hydra back into the deep water, bought himself time, and got out of the swamp before it came back. He lived. He'd try again with a better plan and a bigger torch.",
        epilogue:
          "A live hero with a plan beats a reckless hero every time. The swamp will still be there.",
        reward: "Outcome: Near Victory",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Heracles swung the torch in a huge blazing circle above his head and let out the loudest war cry in Greek history. Every single frog, bird, fish, and swamp creature within a mile launched itself into the air at once. The Hydra got so spooked by the sudden wall of noise and wings that it dove underwater and didn't come back up for an hour. Heracles used the hour to make a better plan.",
        epilogue:
          "Sometimes winning means buying yourself time. And nobody has ever cleared a swamp faster.",
        reward: "Outcome: Swamp Panic",
        result: "twist"
      },
      {
        id: "fail-charge",
        title: "Oops! Try Again",
        text:
          "Heracles cut heads. More heads appeared. He cut those. Even more heads appeared. He stopped and counted: twenty-three heads. Twenty-THREE. One of them sneezed on him. He retreated from the swamp at top speed and did not look back.",
        epilogue:
          "The sword alone cannot beat the Hydra. Fire is the key! Try again.",
        reward: "Try again: Use the torch on the stumps!",
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
        "The song was beautiful. That was the dangerous part. Odysseus stood at the cliff edge and felt it pulling at him like a hook in his chest. The Sirens sang from the rocks below, and every note said: come closer, just a little closer. He wrapped his rope around his wrist and thought hard. No hero had survived this before. Odysseus planned to be the first.",
      choices: [
        { label: "Listen from far away — don't get closer yet", next: "mist-path", tone: "careful" },
        { label: "Walk toward the song — understand it better", next: "song-path", tone: "brave" },
        { label: "Tie the rope to a stone post NOW before the song gets louder", next: "rope-path", tone: "clever" }
      ]
    },
    steps: [
      {
        id: "mist-path",
        text:
          "Odysseus pressed against the cliff wall and breathed steadily. The song rose and fell. He noticed something: it was louder on the sea side and quieter on the stone side. The wall itself blocked some of it. Two paths branched ahead — one bright, one shadowed.",
        choices: [
          { label: "Take the shadowed path — it's quieter", next: "cliff-turn", tone: "careful" },
          { label: "Run fast down the bright path before the song catches him", next: "fail-song", tone: "brave" },
          { label: "Anchor the rope to the cliff wall before moving at all", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "song-path",
        text:
          "The song got louder. And louder. Odysseus felt his feet moving forward before he'd decided to move them. The rocks below were sharp and black. He shook his head hard — once, twice. He knew this trick. Knowing it was a trick almost wasn't enough.",
        choices: [
          { label: "Pull himself back and think clearly", next: "cliff-turn", tone: "careful" },
          { label: "Call back to the Sirens — maybe they'll ANSWER", next: "twist-ending", tone: "brave" },
          { label: "Grab the rope and anchor to the nearest rock — fast", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "rope-path",
        text:
          "The rope was tied. Good. Even if the song made him forget everything else, the rope would hold. He tested it — tight. He could now move forward and explore, knowing the rope would stop him before the cliffs did. Clever Odysseus. He almost smiled.",
        choices: [
          { label: "Follow the cliff wall slowly, rope tight", next: "cliff-turn", tone: "careful" },
          { label: "Lean out toward the song — see how far the rope lets him go", next: "close-call", tone: "brave" },
          { label: "Keep the rope tight and move toward the sea arch", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "cliff-turn",
        text:
          "At the bend, Odysseus found something: scratch marks in the stone. NAMES. Other sailors who'd been here. None of the names were famous for surviving. He stood very still and thought about that. The song floated up from below, sweet as honey, deadly as a wave.",
        choices: [
          { label: "Stay pressed against the rock wall and move carefully", next: "rope-gate", tone: "careful" },
          { label: "Climb up onto the cliff edge to see the Sirens directly!", next: "fail-song", tone: "brave" },
          { label: "Use the rope to test the ground ahead before each step", next: "rope-gate", tone: "clever" }
        ]
      },
      {
        id: "rope-gate",
        text:
          "A stone arch over the path, and beyond it — the open sea, churning white. The song was loudest here. Odysseus noticed that if he hummed something else, another tune, really loudly inside his own head — it helped block the Sirens out. He tried it. It helped.",
        choices: [
          { label: "Keep humming, keep moving, keep the rope tight", next: "sea-arch", tone: "careful" },
          { label: "Untie the rope — he wants to get close enough to SEE them", next: "fail-song", tone: "brave" },
          { label: "Hum loudly and use the rope-length to stay safe under the arch", next: "sea-arch", tone: "clever" }
        ]
      },
      {
        id: "sea-arch",
        text:
          "Under the arch. The full weight of the song hit him. His knees actually wobbled. The rope pulled tight at his waist. Below: the rocks, the sea, the Sirens on their island. He could see them now — beautiful, terrible, singing just for him. The rope was the only thing between him and disaster.",
        choices: [
          { label: "Keep his eyes forward, hum, trust the rope, and walk past", next: "legend-path", tone: "careful" },
          { label: "Leap toward the voices — just to get closer —", next: "fail-song", tone: "brave" },
          { label: "Use the rope like a guide rail and slip along the cliff edge past them", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "The True Legend",
        text:
          "Odysseus walked past the Sirens with his eyes straight ahead, humming a sailor's song so loudly he couldn't hear his own thoughts. The rope pulled tight twice. Twice he stopped, breathed, and kept going. When the song faded behind him, he finally let himself smile. He was the first to hear the Sirens and survive.",
        epilogue:
          "That's the real Odyssey. He WANTED to hear them — so he found a way to do it safely. Not brave enough to ignore the danger. Not careful enough to skip it. Perfectly, exactly Odysseus.",
        reward: "Legend reward: Sea-Clever Choice",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Odysseus used the rope and the cliff wall and his own humming to push through. He slipped past the sea arch like a shadow. The Sirens' song faded. The sea opened ahead of him. He'd made it through — not the old story exactly, but HIS way.",
        epilogue:
          "Odysseus always found his own version of clever. That's why they still tell stories about him.",
        reward: "Reward: Stormy Escape",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "The rope pulled tight and Odysseus couldn't make himself let go of the cliff. He held on until the song changed direction, then scrambled back the way he came. He was shaking. He made it out. He'd need wax for his sailors' ears next time.",
        epilogue:
          "Knowing when you're losing is a kind of cleverness too. He kept his life and his plan.",
        reward: "Outcome: Narrow Escape",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Odysseus called back to the Sirens, imitating their own tune — badly but loudly. They stopped singing. There was a long pause. Then, from the rocks below, a very irritated voice said: 'That is NOT how it goes.' A seagull flew into his face. He escaped while they were still complaining about his singing.",
        epilogue:
          "Even the Sirens were not ready for someone to argue with their performance. Only Odysseus could pull that off.",
        reward: "Outcome: Musical Disagreement",
        result: "twist"
      },
      {
        id: "fail-song",
        title: "Oops! Try Again",
        text:
          "Odysseus moved toward the song. Just a little closer. Just to hear it better. His foot found the edge of the cliff. He looked down. The rocks were very, very far below. He grabbed the rope with both hands and pulled himself back, sweating. He sat down on the cliff path and took six deep breaths.",
        epilogue:
          "The rope is there for a reason. The ROPE is always the answer. Try again!",
        reward: "Try again: Trust the rope, not the song",
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
        "Atalanta was faster than anyone alive. She could outrun horses. She'd beaten every man who'd ever raced her. And today she was hunting the Calydonian Boar — a beast as big as a cart, with tusks like swords. It had already wrecked three villages. The other hunters were still at camp. Atalanta was already on its trail.",
      choices: [
        { label: "Move silently between the trees — don't spook it", next: "tree-path", tone: "careful" },
        { label: "Sprint ahead and cut it off before it reaches the ridge", next: "rush-path", tone: "brave" },
        { label: "Nock an arrow and read the tracks before moving", next: "bow-path", tone: "clever" }
      ]
    },
    steps: [
      {
        id: "tree-path",
        text:
          "Atalanta ghosted through the forest. No sound. Not one snapped twig. She found the tracks — huge, deep, heavy. The boar was enormous. Then she found something else: a tree, scratched ten feet up. The boar had sharpened its tusks there. She stared at the gouge marks and swallowed.",
        choices: [
          { label: "Follow the tracks very slowly", next: "creek-path", tone: "careful" },
          { label: "Sprint after it right now — catch it before it reaches open ground!", next: "fail-rush", tone: "brave" },
          { label: "Climb the tree for a higher view of the trail ahead", next: "ridge-path", tone: "clever" }
        ]
      },
      {
        id: "rush-path",
        text:
          "Atalanta RAN. Nobody ran like Atalanta. She covered ground so fast that birds barely had time to get out of her way. She heard the boar ahead — crashing, snorting — and pushed harder. But she was moving so fast the forest was a blur, and she had no idea where the boar was going to TURN.",
        choices: [
          { label: "Slow down before you run into it face-first", next: "creek-path", tone: "careful" },
          { label: "Jump over the next bush and LAND on it!", next: "fail-rush", tone: "brave" },
          { label: "Veer left — get parallel to it and get ahead for an angle shot", next: "ridge-path", tone: "clever" }
        ]
      },
      {
        id: "bow-path",
        text:
          "Atalanta crouched and studied the ground. Three tracks going forward. One track turning left. The boar had doubled back — it was SMART. A smart boar. She adjusted her grip on the bow. Smart hunters beat smart beasts by being just a little smarter.",
        choices: [
          { label: "Follow the doubling-back track to where it leads", next: "creek-path", tone: "careful" },
          { label: "Rush to where the track turns and catch it mid-turn!", next: "twist-ending", tone: "brave" },
          { label: "Circle wide to get ahead of where it's going", next: "ridge-path", tone: "clever" }
        ]
      },
      {
        id: "creek-path",
        text:
          "A shallow creek. Atalanta saw the hoofprints in the mud — and the boar's track going straight through the water. It had WADED. She watched the far bank. Reeds moving. A flash of grey bristle. The boar was on the other side, less than thirty steps away, not looking her direction.",
        choices: [
          { label: "Nock an arrow and creep to the bank silently", next: "hunter-ring", tone: "careful" },
          { label: "Sprint across the creek and close the distance NOW!", next: "fail-rush", tone: "brave" },
          { label: "Use the creek noise to cover your crossing — step on the stones quickly", next: "hunter-ring", tone: "clever" }
        ]
      },
      {
        id: "ridge-path",
        text:
          "From the ridge, Atalanta could see the whole forest floor. The boar was circling a clearing below — it was confused, checking for danger. She had the height advantage. She had a clear line. She had one clean shot, but only if she moved to exactly the right spot on the ridge before it moved again.",
        choices: [
          { label: "Slide down the ridge quietly to get in range", next: "hunter-ring", tone: "careful" },
          { label: "Jump off the ridge — fall straight on it from above!", next: "fail-rush", tone: "brave" },
          { label: "Take the shot from here — maximum range, but you're ATALANTA", next: "hero-win", tone: "clever" }
        ]
      },
      {
        id: "hunter-ring",
        text:
          "The boar stepped into a ring of old oak trees. It turned its head slowly. It was enormous. The tusks were exactly as bad as the scratch marks had promised. Atalanta had one arrow nocked and one clear line. She breathed in. She breathed out. Her hands were perfectly steady.",
        choices: [
          { label: "Wait for it to fully stop — then release", next: "legend-path", tone: "careful" },
          { label: "Shout and release at the same instant — surprise shot!", next: "brave-shout-shot", tone: "brave" },
          { label: "Step sideways for a better angle, then shoot", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "The True Legend",
        text:
          "The boar stopped. Atalanta released. The arrow flew clean and true through the ring of oaks and struck exactly where she'd aimed. The Calydonian Boar went down. The other hunters arrived twenty minutes later and found Atalanta sitting on a log, eating an apple, with the boar already dealt with.",
        epilogue:
          "That's the real myth. Atalanta drew first blood in the Calydonian Boar hunt — the first hunter to land a shot. Speed, yes. But the winning shot was calm, cold, and perfectly placed.",
        reward: "Legend reward: Hunter's Aim",
        result: "legend",
        mythTrue: true
      },
      {
        id: "brave-shout-shot",
        title: "Hero Win (Bold Shot)",
        text:
          "ATALANTA YELLED. The boar spun toward the sound — and she released the arrow in that exact instant, aimed at where she knew it would spin to. The arrow hit. She was already laughing before the boar went down. It was an impossible shot. It worked because she's ATALANTA.",
        epilogue:
          "Speed AND nerve. She knew exactly what she was doing. The other hunters will never believe it.",
        reward: "Reward: Bold Hunter's Shot",
        result: "win"
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "Atalanta took her angle, made her shot, and the hunt was over. It wasn't the cleanest or most elegant moment — but the boar was down, and she was the one who'd done it. Again.",
        epilogue:
          "She always figures it out. That's what makes her Atalanta.",
        reward: "Reward: Forest Champion",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "The boar heard her and charged. Atalanta ran — and nobody outruns Atalanta. She was safe before the boar had taken three steps. She'd try again with a better position. The forest trail would be ready.",
        epilogue:
          "Running away doesn't count as losing when you're the fastest human alive. It just counts as strategic.",
        reward: "Outcome: Beast Escapes",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Atalanta crashed through the brush and hit a hornets' nest. The hornets hit the boar. The boar ran away faster than Atalanta had ever seen anything run. She stood in the clearing, covered in leaves, watching it vanish into the distance. Then she started laughing.",
        epilogue:
          "The boar escaped. The hornets did not. It was not the hunt she planned. It was funnier.",
        reward: "Outcome: Hornet Assist",
        result: "twist"
      },
      {
        id: "fail-rush",
        title: "Oops! Try Again",
        text:
          "Atalanta ran so fast she got ahead of the boar, then ran past where it turned, then ran in completely the wrong direction for a while, then had to stop and figure out where she was. By the time she found the trail again, the boar was long gone and the other hunters were confused about why she was out of breath.",
        epilogue:
          "Even the fastest hunter needs to know where she's GOING. Read the tracks first. Try again!",
        reward: "Try again: Speed needs a direction",
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
        "Before the Golden Fleece, before the monsters and the sea dragons — there was just this: Jason standing at the harbor before dawn with a sea map that Chiron the centaur had given him. The Argo was somewhere in this harbor. His crew was waiting. A rival captain had tampered with the dock markers to make Jason get on the wrong boat. Jason could see three shapes in the fog. Only one was the Argo.",
      choices: [
        { label: "Study the map carefully before moving", next: "map-path", tone: "clever" },
        { label: "Run to the nearest boat — time is short!", next: "rush-path", tone: "brave" },
        { label: "Kneel by the water and listen to the harbor", next: "dock-path", tone: "careful" }
      ]
    },
    steps: [
      {
        id: "map-path",
        text:
          "Jason spread the map flat on a dock post. The harbor was right there, marked in detail. Chiron had drawn every dock, every post, every warning — including a red X on the far dock. 'Do not board the boat at the red X.' The fog was thick, but Jason had the map. He could figure this out.",
        choices: [
          { label: "Follow the map to the safe dock first", next: "rope-bridge", tone: "careful" },
          { label: "Ignore the X and check that boat anyway — it might be a trick", next: "fail-rush", tone: "brave" },
          { label: "Use the map to mark where all three boats are positioned", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "rush-path",
        text:
          "Jason sprinted across the wet dock boards — and a loose plank shot out from under his foot like a banana peel. He grabbed a rope post, swung around wildly, and ended up facing back the way he came. His crew (watching from a window) did not look impressed. He had about thirty seconds before the tide turned.",
        choices: [
          { label: "Stop and look around before moving again", next: "rope-bridge", tone: "careful" },
          { label: "JUMP to the nearest boat right now!", next: "fail-rush", tone: "brave" },
          { label: "Pull out the map and use the last thirty seconds to think", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "dock-path",
        text:
          "Jason pressed his hand to the dock and listened to the water. The harbor had a rhythm — tide pulling, ropes creaking, wood groaning. He'd been on enough boats to know: the Argo had a sound. Chiron had told him. A deep wooden groan, like it was always ready to go.",
        choices: [
          { label: "Follow the sound toward the deep groan", next: "rope-bridge", tone: "careful" },
          { label: "Call out into the fog — someone will answer!", next: "twist-ending", tone: "brave" },
          { label: "Match the sound to the map — find the position of each boat", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "rope-bridge",
        text:
          "A narrow rope bridge between two dock sections. Slick boards. The fog was so thick Jason could barely see his next footstep. But the harbor sounds were clearer now — one boat thumping loudly, one boat barely moving, one boat making that deep, confident groan he was listening for.",
        choices: [
          { label: "Step across carefully, one board at a time", next: "harbor-turn", tone: "careful" },
          { label: "Run across before the bridge sways and tips him!", next: "fail-rush", tone: "brave" },
          { label: "Check the map's direction markings while crossing slowly", next: "harbor-turn", tone: "clever" }
        ]
      },
      {
        id: "harbor-turn",
        text:
          "Three boats, tied in a row. Jason stood in front of them. On the left: a big cargo ship with too much rope and a smell of old fish. In the middle: a sleek fast boat with a torn sail. On the right: the deep groan. A long, wide ship with a golden prow painted at the bow. Jason checked the map. The right-side boat matched every marking.",
        choices: [
          { label: "Board the right-side boat — it matches the map perfectly", next: "golden-bow", tone: "careful" },
          { label: "Try the middle one first — that fast boat looks amazing", next: "fail-rush", tone: "brave" },
          { label: "Double-check the prow marking against Chiron's drawing", next: "golden-bow", tone: "clever" }
        ]
      },
      {
        id: "golden-bow",
        text:
          "Aboard the Argo. The ship felt right the second his feet hit the deck. His crew appeared from the fog — grinning, ready. The locked chest in the middle had a small key tied to the mast. Chiron had mentioned this. One last check before they sailed.",
        choices: [
          { label: "Use the map's final marking to find the safe route out of the harbor", next: "legend-path", tone: "careful" },
          { label: "Cast off right now and figure out the route as they go!", next: "fail-rush", tone: "brave" },
          { label: "Open the chest with the key — the route is written inside", next: "hero-win", tone: "clever" }
        ]
      }
    ],
    endings: [
      {
        id: "legend-path",
        title: "The True Legend",
        text:
          "Jason found the Argo. He rallied his crew. He read the final map marking and called the route out clearly, and the Argo slipped out of the harbor through the fog just as the sun came up. The crew cheered. Jason didn't cheer. He was already studying the next part of the map.",
        epilogue:
          "The real Jason was never just brave. He was the leader who made a PLAN and trusted it. The Golden Fleece was waiting, and he was already thinking three steps ahead.",
        reward: "Legend reward: Captain's Route",
        result: "legend",
        mythTrue: true
      },
      {
        id: "hero-win",
        title: "Hero Win",
        text:
          "The chest had the full route to open water inside, written in Chiron's careful hand. Jason read it aloud to the crew and they sailed out of the harbor perfectly. He might have figured out the route himself anyway. Probably. Either way, the Argo was free.",
        epilogue:
          "A good leader uses every tool available. The map, the crew, the chest — all of it. That's how you start a quest right.",
        reward: "Reward: Harbor Captain",
        result: "win"
      },
      {
        id: "close-call",
        title: "Close Call",
        text:
          "Jason got the crew on board but couldn't figure out the harbor route before the tide shifted. They had to drop anchor and wait. He used the time to study the map. An hour later, he had it figured out and the Argo sailed out into a perfectly clear morning.",
        epilogue:
          "Sometimes the best move is to stop and plan when you have the chance. The Golden Fleece would still be there in an hour.",
        reward: "Outcome: Safe Return",
        result: "close"
      },
      {
        id: "twist-ending",
        title: "Twist Ending",
        text:
          "Jason called into the fog. His voice echoed around the whole harbor. Every single person in the harbor — dock workers, fishermen, rival sailors — called back at once, thinking it was a signal. The resulting noise was so confusing that the rival captain who had tampered with the markers panicked, tripped over his own ropes, and fell into the harbor. This somehow made it very easy to identify the Argo (it was the only boat nobody was falling off of).",
        epilogue:
          "Sometimes chaos works in your favor. Jason would put this in his list of plans. Right at the bottom, under 'last resort.'",
        reward: "Outcome: Harbor Confusion",
        result: "twist"
      },
      {
        id: "fail-rush",
        title: "Oops! Try Again",
        text:
          "Jason boarded a boat that was absolutely not the Argo. He knew something was wrong immediately. The boat smelled wrong, felt wrong, and the map didn't match anything about it at all. He got off before anyone saw him (someone absolutely saw him). Back to the dock.",
        epilogue:
          "The map was right there in his hands! Read the map FIRST. Try again!",
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
