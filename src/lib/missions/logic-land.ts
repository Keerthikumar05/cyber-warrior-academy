import type { Mission } from "./types";

export const logicLandMissions: Mission[] = [
  {
    slug: "awakening-sequence",
    worldSlug: "logic-land",
    title: "Awakening Sequence",
    subtitle: "Order matters — boot the dormant guardian.",
    difficulty: 1,
    estMinutes: 8,
    xpBase: 60,
    topics: ["sequencing", "step-by-step thinking"],
    steps: [
      {
        kind: "intro",
        title: "The dormant guardian",
        story:
          "A massive guardian sleeps in the ruins of Logic Land. Power has returned, but its boot sequence is corrupted. If the steps run in the wrong order, the guardian will reject them — and the bugs will breach the gate.",
        visual: "robot",
      },
      {
        kind: "concept",
        title: "Sequence: do A, then B, then C",
        body:
          "Computers do exactly what you tell them, in the order you tell them. Each line runs top to bottom. Swap two lines and the result changes.",
        demo: {
          type: "sequence-demo",
          items: ["Open eyes", "Stand up", "Walk forward"],
        },
      },
      {
        kind: "practice",
        title: "Boot sequence — sort it",
        challenge: {
          type: "sequence",
          prompt: "Drag these steps into the correct order to boot the guardian:",
          shuffled: ["Activate core", "Run self-test", "Connect power", "Open visor"],
          correct: ["Connect power", "Activate core", "Run self-test", "Open visor"],
        },
      },
      {
        kind: "boss",
        title: "Boss — Corrupted Routine",
        story:
          "The guardian's combat routine has been scrambled. Restore the correct sequence before the bugs reach the gate.",
        challenge: {
          type: "sequence",
          prompt: "Restore the combat routine in the right order:",
          shuffled: [
            "Strike target",
            "Scan for enemies",
            "Lock onto nearest threat",
            "Raise shield",
            "Reset stance",
          ],
          correct: [
            "Scan for enemies",
            "Lock onto nearest threat",
            "Raise shield",
            "Strike target",
            "Reset stance",
          ],
        },
      },
      {
        kind: "mastery",
        title: "Mission complete",
        summary: "You restored the guardian. Sequence is the first law of code: order changes outcome.",
        takeaways: [
          "Code runs top to bottom, line by line.",
          "Swapping two lines can break or change the program.",
          "Break any task into ordered steps before writing code.",
        ],
        xpReward: 60,
        badgeSlug: "first-boot",
        badgeName: "First Boot",
      },
    ],
  },

  {
    slug: "locked-gate",
    worldSlug: "logic-land",
    title: "The Locked Gate",
    subtitle: "If the key matches, the gate opens.",
    difficulty: 1,
    estMinutes: 9,
    xpBase: 70,
    topics: ["conditionals", "boolean logic"],
    steps: [
      {
        kind: "intro",
        title: "The Logic Gate",
        story:
          "An ancient gate blocks your path. It listens for two signals — power and clearance — and only opens when both are TRUE. Learn the language of AND, OR, NOT and you control every door in this world.",
        visual: "gate",
      },
      {
        kind: "concept",
        title: "Truth tables: AND, OR, NOT",
        body:
          "A condition is a question that answers true or false. Combine them with AND (both true), OR (either true), NOT (flip it).",
        demo: {
          type: "truth-table",
          rows: [
            { a: true, b: true, out: true, label: "true AND true" },
            { a: true, b: false, out: false, label: "true AND false" },
            { a: true, b: false, out: true, label: "true OR false" },
            { a: true, out: false, label: "NOT true" },
          ],
        },
      },
      {
        kind: "practice",
        title: "Pick the right gate",
        challenge: {
          type: "mcq",
          prompt:
            "The vault opens only when the player has the key AND is standing on the pressure plate. Which gate?",
          options: ["AND", "OR", "NOT", "XOR"],
          correctIndex: 0,
          explain: "Both conditions must be true — that is AND.",
        },
      },
      {
        kind: "boss",
        title: "Boss — Triple Gate",
        story:
          "The Triple Gate opens only when (power AND clearance) OR override is true. Predict the outcome before it locks you out.",
        challenge: {
          type: "predict",
          prompt: "Given power=true, clearance=false, override=true — does the gate open?",
          code: "open = (power AND clearance) OR override",
          options: ["Opens", "Stays locked", "Errors out"],
          correctIndex: 0,
          explain:
            "(true AND false) is false, but false OR true is true. So the gate opens.",
        },
      },
      {
        kind: "mastery",
        title: "Gatekeeper unlocked",
        summary: "You can now reason about any condition by breaking it into AND / OR / NOT pieces.",
        takeaways: [
          "Every if-statement is a truth question.",
          "AND needs all true. OR needs at least one true. NOT flips the answer.",
          "Combine them with parentheses to express any rule.",
        ],
        xpReward: 70,
        badgeSlug: "gatekeeper",
        badgeName: "Gatekeeper",
      },
    ],
  },

  {
    slug: "loop-bridge",
    worldSlug: "logic-land",
    title: "Loop Bridge",
    subtitle: "Repeat until you cross.",
    difficulty: 2,
    estMinutes: 9,
    xpBase: 80,
    topics: ["loops", "repetition", "counting"],
    steps: [
      {
        kind: "intro",
        title: "The bridge of planks",
        story:
          "A long bridge stretches across the void. To cross, your drone must step on every plank — one at a time. Writing 'step' a thousand times is madness. Loops let you say 'do this 1000 times' in one line.",
        visual: "loop",
      },
      {
        kind: "concept",
        title: "Loops repeat work",
        body:
          "A loop runs the same block of code many times. Each pass is called an iteration. A counter remembers which iteration you're on.",
        demo: { type: "loop-counter", from: 1, to: 5 },
      },
      {
        kind: "practice",
        title: "Count the iterations",
        challenge: {
          type: "predict",
          prompt: "How many times does the body run?",
          code: "for i from 1 to 7:\n    step()",
          options: ["6", "7", "8"],
          correctIndex: 1,
          explain: "from 1 to 7 inclusive = 7 iterations (1,2,3,4,5,6,7).",
        },
      },
      {
        kind: "boss",
        title: "Boss — Crossed Wires",
        story:
          "Two loops cross. The drone must walk only on planks numbered by 3 (3, 6, 9...). Which loop body is correct?",
        challenge: {
          type: "mcq",
          prompt: "Walk only on planks whose number is divisible by 3:",
          options: [
            "for i from 1 to 12: step()",
            "for i from 1 to 12: if i mod 3 == 0: step()",
            "for i from 3 to 12: step()",
            "for i from 1 to 12: if i / 3 == 0: step()",
          ],
          correctIndex: 1,
          explain:
            "We loop through all planks, but only step when the number divides evenly by 3 — that's `i mod 3 == 0`.",
        },
      },
      {
        kind: "mastery",
        title: "Bridge crossed",
        summary: "You traded brute repetition for a loop. This is the heart of automation.",
        takeaways: [
          "A loop = repeat work N times.",
          "Combine a loop with a condition to act selectively.",
          "Counters let you reason about the current step.",
        ],
        xpReward: 80,
        badgeSlug: "looper",
        badgeName: "Looper",
      },
    ],
  },

  {
    slug: "pattern-cipher",
    worldSlug: "logic-land",
    title: "Pattern Cipher",
    subtitle: "Spot the rule, break the code.",
    difficulty: 2,
    estMinutes: 7,
    xpBase: 80,
    topics: ["pattern recognition", "algorithms"],
    steps: [
      {
        kind: "intro",
        title: "The Cipher Wall",
        story:
          "A wall of glowing glyphs hums in front of you. Each row follows a hidden rule. Programmers are pattern-hunters — find the rule and the wall opens.",
        visual: "cipher",
      },
      {
        kind: "concept",
        title: "Patterns are rules",
        body:
          "A sequence like 2, 4, 6, 8 follows the rule '+2'. A sequence like 1, 1, 2, 3, 5 follows 'each = sum of previous two'. Algorithms are recipes built from such rules.",
        demo: {
          type: "code-trace",
          lines: ["a = 1", "b = 1", "next = a + b", "# next = 2"],
          explain: [
            "Start with two numbers.",
            "Add them.",
            "The next number in the sequence.",
            "Apply the rule again to extend it.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Find the next number",
        challenge: {
          type: "pattern",
          prompt: "What comes next? 2, 4, 8, 16, ?",
          sequence: [2, 4, 8, 16],
          options: [18, 24, 32, 64],
          correctIndex: 2,
          explain: "Each term doubles: ×2 rule. 16 × 2 = 32.",
        },
      },
      {
        kind: "boss",
        title: "Boss — Fibonacci Lock",
        story:
          "The final lock reads 1, 1, 2, 3, 5, 8, ? The watcher will only accept the next Fibonacci number.",
        challenge: {
          type: "pattern",
          prompt: "Continue: 1, 1, 2, 3, 5, 8, ?",
          sequence: [1, 1, 2, 3, 5, 8],
          options: [10, 11, 13, 16],
          correctIndex: 2,
          explain: "Each = sum of the two before. 5 + 8 = 13.",
        },
      },
      {
        kind: "mastery",
        title: "Cipher broken",
        summary: "Pattern recognition is the bridge from logic to real algorithms.",
        takeaways: [
          "Look for the rule that turns one term into the next.",
          "Many famous algorithms are simple rules applied many times.",
          "When stuck, write the first 3–4 steps by hand.",
        ],
        xpReward: 80,
      },
    ],
  },

  {
    slug: "corrupted-ai",
    worldSlug: "logic-land",
    title: "Boss: The Corrupted AI",
    subtitle: "Combine sequence, condition, and loop to defeat it.",
    difficulty: 3,
    estMinutes: 12,
    xpBase: 120,
    topics: ["sequencing", "conditionals", "loops"],
    steps: [
      {
        kind: "intro",
        title: "Final stand",
        story:
          "The Corrupted AI has assembled an army of broken routines. To overload it, you must run a counter-program: scan, decide, strike — looping until its shields fall.",
        visual: "ai",
      },
      {
        kind: "concept",
        title: "Programs combine all three",
        body:
          "Every program you ever write is built from these three ideas: sequence, condition, repetition. Master them and any language is just syntax.",
        demo: {
          type: "code-trace",
          lines: [
            "while shield > 0:",
            "    if has_opening():",
            "        strike()",
            "    else:",
            "        wait()",
          ],
          explain: [
            "Loop while the boss still has shield.",
            "Check for an opening.",
            "Attack when safe.",
            "Otherwise, hold position.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Predict the run",
        challenge: {
          type: "predict",
          prompt:
            "If openings appear every 3rd tick and shield starts at 5, how many strikes before shield reaches 0?",
          code: "while shield > 0:\n    if tick % 3 == 0: strike(); shield -= 1\n    tick += 1",
          options: ["3", "5", "7"],
          correctIndex: 1,
          explain:
            "You need 5 strikes to drop shield from 5 to 0. Each strike happens on a 3rd-tick opening.",
        },
      },
      {
        kind: "boss",
        title: "Boss — Final routine",
        story:
          "Choose the routine that defeats the AI without wasting strikes.",
        challenge: {
          type: "mcq",
          prompt: "Which routine best defeats the boss?",
          options: [
            "Strike forever, ignore shield.",
            "Strike only when an opening appears AND shield > 0.",
            "Wait forever until the AI gives up.",
            "Strike once, then stop.",
          ],
          correctIndex: 1,
          explain: "Combine condition (opening AND alive) with a loop (while shield > 0).",
        },
      },
      {
        kind: "mastery",
        title: "World 1 complete",
        summary:
          "You've mastered the three pillars of programming logic. The Python Kingdom is now open — time to write real code.",
        takeaways: [
          "Sequence: order operations.",
          "Condition: choose between paths.",
          "Loop: repeat work efficiently.",
          "Real programs combine all three.",
        ],
        xpReward: 120,
        badgeSlug: "logic-master",
        badgeName: "Logic Master",
      },
    ],
  },
];
