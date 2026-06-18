import type { Mission } from "./types";

export const pythonKingdomMissions: Mission[] = [
  {
    slug: "hello-warrior",
    worldSlug: "python-kingdom",
    title: "Hello, Code Warrior",
    subtitle: "Speak your first words in Python.",
    difficulty: 1,
    estMinutes: 8,
    xpBase: 80,
    topics: ["print", "strings", "variables"],
    steps: [
      {
        kind: "intro",
        title: "The summoning circle",
        story:
          "The Python Kingdom listens to incantations. To prove you belong, speak your true name through the terminal. `print()` is the spell that makes the machine speak.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "print() and variables",
        body:
          "`print(...)` displays text. A variable stores a value. `name = \"Aria\"` creates a label called name pointing at the string \"Aria\".",
        demo: {
          type: "var-box",
          values: [
            { name: "name", value: "\"Aria\"", type: "string" },
            { name: "level", value: "1", type: "int" },
            { name: "alive", value: "True", type: "bool" },
          ],
        },
      },
      {
        kind: "code",
        title: "Print your warrior name",
        brief:
          "Create a variable named `warrior` set to the string \"Code Warrior\". Then print exactly:\n\nHello, Code Warrior",
        language: "python",
        starter: "# Create the variable and print the greeting\nwarrior = \n",
        tests: [
          { label: "Output contains the greeting", expectIncludes: ["Hello, Code Warrior"] },
          { label: "`warrior` variable equals \"Code Warrior\"", expectEval: { expr: "warrior", equals: "Code Warrior" } },
        ],
        hintTopic: "Use print(f\"Hello, {warrior}\") or print(\"Hello, \" + warrior).",
      },
      {
        kind: "boss",
        title: "Boss — The Echo Spirit",
        story:
          "The Echo Spirit demands you build your battle cry from variables. Set `name`, `class_`, `level` and print:\n\nI am <name> the <class_>, level <level>!",
        challenge: {
          type: "code",
          brief:
            "Set:\n  name   = \"Kai\"\n  class_ = \"Mage\"\n  level  = 7\nThen print exactly:\nI am Kai the Mage, level 7!",
          language: "python",
          starter: "name = \nclass_ = \nlevel = \n# print the battle cry\n",
          tests: [
            { label: "Prints the full battle cry", expectExact: "I am Kai the Mage, level 7!" },
          ],
          hintTopic: "Use an f-string: print(f\"I am {name} the {class_}, level {level}!\")",
        },
      },
      {
        kind: "mastery",
        title: "First spell cast",
        summary: "You can now make Python speak and remember values. Everything else builds on this.",
        takeaways: [
          "print() shows output.",
          "Variables store values you can reuse.",
          "f-strings let you mix variables into text.",
        ],
        xpReward: 80,
        badgeSlug: "first-spell",
        badgeName: "First Spell",
      },
    ],
  },

  {
    slug: "variable-vault",
    worldSlug: "python-kingdom",
    title: "The Variable Vault",
    subtitle: "Numbers, strings, and the math that binds them.",
    difficulty: 2,
    estMinutes: 9,
    xpBase: 90,
    topics: ["data types", "arithmetic", "input"],
    steps: [
      {
        kind: "intro",
        title: "The Vault of Values",
        story:
          "Inside the vault, runes count gold, weigh potions, and measure time. Python knows numbers (int, float), text (str), and truth (bool) — and the math that binds them.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "Types and arithmetic",
        body:
          "Operators: + - * / // % **. Mixing types matters: \"3\" + \"4\" makes \"34\", but 3 + 4 makes 7. Convert with int(), float(), str().",
        demo: {
          type: "code-trace",
          lines: ["gold = 50", "tax = gold * 0.1", "left = gold - tax", "print(left)"],
          explain: ["Start with 50 gold.", "10% tax = 5.0.", "Subtract — 45.0 remains.", "Show the result."],
        },
      },
      {
        kind: "code",
        title: "Inventory math",
        brief:
          "Given:\n  potions = 12\n  cost_each = 7\nCompute total cost and print exactly:\nTotal: 84 gold",
        language: "python",
        starter: "potions = 12\ncost_each = 7\n# compute and print\n",
        tests: [{ label: "Prints the right total", expectExact: "Total: 84 gold" }],
        hintTopic: "Multiply potions * cost_each, then print f\"Total: {total} gold\"",
      },
      {
        kind: "boss",
        title: "Boss — The Conversion Trial",
        story:
          "The Vault Keeper hands you a string \"15\" and demands its half — as a number.",
        challenge: {
          type: "code",
          brief:
            "Given `raw = \"15\"`, convert it to a number, divide by 2, and print exactly:\n7.5",
          language: "python",
          starter: "raw = \"15\"\n# convert and print half\n",
          tests: [{ label: "Prints 7.5", expectExact: "7.5" }],
          hintTopic: "Use int(raw) or float(raw) to convert before dividing.",
        },
      },
      {
        kind: "mastery",
        title: "Vault sealed",
        summary: "You can store, compute, and convert values — the everyday work of every program.",
        takeaways: [
          "int, float, str, bool are Python's core types.",
          "+ - * / // % ** are arithmetic operators.",
          "Convert with int(x), float(x), str(x).",
        ],
        xpReward: 90,
      },
    ],
  },

  {
    slug: "decision-gate",
    worldSlug: "python-kingdom",
    title: "Decision Gate",
    subtitle: "if, elif, else — choose your path.",
    difficulty: 2,
    estMinutes: 10,
    xpBase: 100,
    topics: ["conditionals", "comparison"],
    steps: [
      {
        kind: "intro",
        title: "Two doors, one fate",
        story:
          "A fork in the road. The Gatekeeper reads your stats and sends you down the right path. You write the rules that decide.",
        visual: "decision",
      },
      {
        kind: "concept",
        title: "if / elif / else",
        body:
          "Conditions: == != < > <= >=. Combine with and/or/not. Indentation defines the branch — 4 spaces.",
        demo: {
          type: "code-trace",
          lines: [
            "if hp > 50:",
            "    print(\"healthy\")",
            "elif hp > 20:",
            "    print(\"wounded\")",
            "else:",
            "    print(\"critical\")",
          ],
          explain: [
            "Top condition checked first.",
            "Branch runs only if true.",
            "elif = otherwise check this.",
            "Indented body belongs to the branch.",
            "else covers everything left.",
            "Only one branch runs.",
          ],
        },
      },
      {
        kind: "code",
        title: "Grade the warrior",
        brief:
          "Given a variable `score` (we'll set it to 78), print:\n  \"S\" if score >= 90\n  \"A\" if score >= 75\n  \"B\" if score >= 50\n  \"F\" otherwise\nFor score=78 it should print exactly:\nA",
        language: "python",
        starter: "score = 78\n# print the grade\n",
        tests: [{ label: "Prints A for score 78", expectExact: "A" }],
        hintTopic: "Order matters — check the highest threshold first with if/elif/else.",
      },
      {
        kind: "boss",
        title: "Boss — The Fork",
        story:
          "Given `hp = 18` and `has_potion = True`, print `\"heal\"` if hp < 20 AND has_potion, else print `\"flee\"`.",
        challenge: {
          type: "code",
          brief:
            "hp = 18\nhas_potion = True\nPrint exactly:\nheal",
          language: "python",
          starter: "hp = 18\nhas_potion = True\n# decide and print\n",
          tests: [{ label: "Prints heal", expectExact: "heal" }],
          hintTopic: "Use `if hp < 20 and has_potion:` then print(\"heal\") else print(\"flee\").",
        },
      },
      {
        kind: "mastery",
        title: "Path chosen",
        summary: "if/elif/else gives your program agency. Combine with and/or for richer rules.",
        takeaways: [
          "Indent the branch body 4 spaces.",
          "Order if/elif from most specific to most general.",
          "Combine conditions with and / or / not.",
        ],
        xpReward: 100,
      },
    ],
  },

  {
    slug: "spell-loops",
    worldSlug: "python-kingdom",
    title: "Spell Loops",
    subtitle: "for and while — repeat the magic.",
    difficulty: 3,
    estMinutes: 11,
    xpBase: 110,
    topics: ["loops", "range", "iteration"],
    steps: [
      {
        kind: "intro",
        title: "The repeating chant",
        story:
          "A great spell needs the same chant, ten times. Writing it ten times wastes ink. Loops repeat for you — and let you change a number each pass.",
        visual: "spell",
      },
      {
        kind: "concept",
        title: "for and while",
        body:
          "`for i in range(5):` runs the body 5 times with i = 0..4. `while condition:` runs as long as the condition stays true.",
        demo: {
          type: "loop-counter",
          from: 0,
          to: 4,
        },
      },
      {
        kind: "code",
        title: "Sum 1 to 10",
        brief:
          "Use a loop to compute 1+2+3+...+10. Print exactly:\n55",
        language: "python",
        starter: "total = 0\n# loop and add\nprint(total)\n",
        tests: [{ label: "Prints 55", expectExact: "55" }],
        hintTopic: "for i in range(1, 11): total += i  — note range(1, 11) stops before 11.",
      },
      {
        kind: "boss",
        title: "Boss — Only the Evens",
        story:
          "The Even-Eater demands the sum of every even number from 1 to 20.",
        challenge: {
          type: "code",
          brief:
            "Sum every even number from 1 through 20 inclusive. Print exactly:\n110",
          language: "python",
          starter: "total = 0\n# loop and add only evens\nprint(total)\n",
          tests: [{ label: "Prints 110", expectExact: "110" }],
          hintTopic: "Either use `range(2, 21, 2)` or check `if i % 2 == 0:` inside the loop.",
        },
      },
      {
        kind: "mastery",
        title: "Chant mastered",
        summary: "Loops turn manual work into one expressive line. Combine with conditions for power.",
        takeaways: [
          "for runs a known number of times.",
          "while runs until a condition becomes false.",
          "range(a, b, step) generates numbers a..b-1.",
        ],
        xpReward: 110,
        badgeSlug: "loop-mage",
        badgeName: "Loop Mage",
      },
    ],
  },

  {
    slug: "function-forge",
    worldSlug: "python-kingdom",
    title: "Boss: Function Forge",
    subtitle: "Wrap logic in reusable spells.",
    difficulty: 4,
    estMinutes: 14,
    xpBase: 160,
    topics: ["functions", "parameters", "return", "lists"],
    steps: [
      {
        kind: "intro",
        title: "The forge of spells",
        story:
          "The Forge turns raw logic into named spells you can cast anywhere. A function takes inputs, runs your code, and returns a result. Master this and your code stops repeating itself.",
        visual: "forge",
      },
      {
        kind: "concept",
        title: "def, parameters, return",
        body:
          "`def greet(name):` defines a function. Call it with `greet(\"Aria\")`. `return value` sends a result back.",
        demo: {
          type: "code-trace",
          lines: [
            "def double(x):",
            "    return x * 2",
            "",
            "result = double(5)",
            "print(result)  # 10",
          ],
          explain: [
            "Define a reusable spell.",
            "Send a value back to the caller.",
            "",
            "Call it with the argument 5.",
            "Store and print the returned value.",
          ],
        },
      },
      {
        kind: "code",
        title: "Forge a function",
        brief:
          "Write a function `square(n)` that returns n*n. Then print `square(9)`. Expected output:\n81",
        language: "python",
        starter: "def square(n):\n    # return n squared\n    pass\n\nprint(square(9))\n",
        tests: [
          { label: "Prints 81", expectExact: "81" },
          { label: "square(4) equals 16", expectEval: { expr: "square(4)", equals: 16 } },
        ],
        hintTopic: "Inside the function, replace `pass` with `return n * n`.",
      },
      {
        kind: "boss",
        title: "Boss — The List Smith",
        story:
          "The List Smith hands you a roster of warriors. Forge a function that returns only the warriors of level ≥ 5.",
        challenge: {
          type: "code",
          brief:
            "Roster: warriors = [\n  {\"name\": \"Aria\", \"level\": 7},\n  {\"name\": \"Kai\",  \"level\": 3},\n  {\"name\": \"Rin\",  \"level\": 5},\n  {\"name\": \"Sol\",  \"level\": 2},\n]\nWrite `def veterans(roster):` that returns a list of NAMES (strings) where level >= 5.\nThen print veterans(warriors). Expected output:\n['Aria', 'Rin']",
          language: "python",
          starter:
            "warriors = [\n    {\"name\": \"Aria\", \"level\": 7},\n    {\"name\": \"Kai\",  \"level\": 3},\n    {\"name\": \"Rin\",  \"level\": 5},\n    {\"name\": \"Sol\",  \"level\": 2},\n]\n\ndef veterans(roster):\n    # return list of names where level >= 5\n    pass\n\nprint(veterans(warriors))\n",
          tests: [
            { label: "Prints exactly the veterans list", expectExact: "['Aria', 'Rin']" },
            {
              label: "veterans returns a list",
              expectEval: { expr: "veterans(warriors)", equals: ["Aria", "Rin"] },
            },
          ],
          hintTopic:
            "Try a list comprehension: return [w[\"name\"] for w in roster if w[\"level\"] >= 5].",
        },
      },
      {
        kind: "mastery",
        title: "Forge mastered — Python Kingdom cleared",
        summary:
          "You've covered variables, types, conditionals, loops, lists, and functions — the working core of Python.",
        takeaways: [
          "Functions package logic for reuse.",
          "Parameters are inputs; return sends a result out.",
          "Combine loops + conditions + lists to filter and transform data.",
          "You're ready for World 3: Bug Hunter City.",
        ],
        xpReward: 160,
        badgeSlug: "python-knight",
        badgeName: "Python Knight",
      },
    ],
  },
];
