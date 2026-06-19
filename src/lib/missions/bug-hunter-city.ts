import type { Mission } from "./types";

export const bugHunterCityMissions: Mission[] = [
  {
    slug: "off-by-one",
    worldSlug: "bug-hunter-city",
    title: "The Off-By-One Heist",
    subtitle: "A thief is escaping through a misaligned loop.",
    difficulty: 2,
    estMinutes: 10,
    xpBase: 100,
    topics: ["debugging", "loops", "ranges"],
    steps: [
      {
        kind: "intro",
        title: "Neon alley, broken alarm",
        story:
          "The city's alarm grid sweeps cameras 1 through 10 every second. But camera 10 is dark — the thief slips past it every loop. Hunt the off-by-one.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "range() is half-open",
        body:
          "`range(1, 10)` produces 1..9 — NOT 1..10. The end is excluded. The most common bug in every codebase is forgetting this.",
        demo: {
          type: "bug-diff",
          before: "for cam in range(1, 10):\n    sweep(cam)",
          after: "for cam in range(1, 11):\n    sweep(cam)",
          explain: "We want cameras 1..10 inclusive, so the range must end at 11.",
        },
      },
      {
        kind: "practice",
        title: "Spot the broken loop",
        challenge: {
          type: "predict",
          prompt: "What does this print?",
          code: "total = 0\nfor i in range(5):\n    total += i\nprint(total)",
          options: ["10", "15", "5", "20"],
          correctIndex: 0,
          explain: "range(5) is 0,1,2,3,4 → sum is 10.",
        },
      },
      {
        kind: "code",
        title: "Fix the alarm sweep",
        brief:
          "Below is a broken loop. Make it print every camera number from 1 to 10 inclusive, one per line.",
        language: "python",
        starter: "# BUG: camera 10 is never swept. Fix it.\nfor cam in range(1, 10):\n    print(cam)\n",
        tests: [
          { label: "Prints 10", expectIncludes: ["10"] },
          { label: "Prints all cameras 1..10", expectExact: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" },
        ],
        hintTopic: "range(start, stop) excludes stop. To include 10, use range(1, 11).",
      },
      {
        kind: "boss",
        title: "Boss — The Phantom Index",
        story:
          "A list of 5 guards. The phantom sneaks in when you try to read guard #5 — because indexes start at 0.",
        challenge: {
          type: "code",
          brief:
            "guards = [\"A\",\"B\",\"C\",\"D\",\"E\"]\nThis code crashes with IndexError. Fix it so it prints the LAST guard's name.",
          language: "python",
          starter: "guards = [\"A\",\"B\",\"C\",\"D\",\"E\"]\nprint(guards[len(guards)])\n",
          tests: [
            { label: "Prints E", expectExact: "E" },
          ],
          hintTopic: "len(list) gives the count. The last index is len(list) - 1, or use guards[-1].",
        },
      },
      {
        kind: "mastery",
        title: "Off-By-One: Slain",
        summary:
          "You learned the two deadliest off-by-one patterns: range end-exclusivity, and index = length - 1. These two bugs cause more outages than almost any other.",
        takeaways: [
          "range(a, b) is a..b-1",
          "list[len(list) - 1] or list[-1] is the last element",
          "When in doubt, print the loop variable to verify",
        ],
        xpReward: 120,
        badgeSlug: "off-by-one-slayer",
        badgeName: "Off-By-One Slayer",
      },
    ],
  },

  {
    slug: "silent-mutation",
    worldSlug: "bug-hunter-city",
    title: "The Silent Mutation",
    subtitle: "A list changes when you swore you didn't touch it.",
    difficulty: 3,
    estMinutes: 12,
    xpBase: 120,
    topics: ["debugging", "references", "mutability"],
    steps: [
      {
        kind: "intro",
        title: "The duplicate ledger",
        story:
          "Two ledgers. You copied one to back it up. You added an entry to the copy. But somehow the original changed too. The bugs are laughing.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "Names point to the same object",
        body:
          "`b = a` does NOT copy a list. It makes `b` another name for the same object. Mutating one mutates both. To copy: `b = a.copy()` or `b = list(a)` or `b = a[:]`.",
        demo: {
          type: "bug-diff",
          before: "backup = ledger\nbackup.append('X')\n# ledger now also has 'X'!",
          after: "backup = ledger.copy()\nbackup.append('X')\n# ledger is untouched.",
          explain: "Assignment binds a name. .copy() creates a new list object.",
        },
      },
      {
        kind: "practice",
        title: "Trace the references",
        challenge: {
          type: "predict",
          prompt: "What does this print?",
          code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)",
          options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "Error"],
          correctIndex: 1,
          explain: "b and a name the same list, so appending via b changes what a sees.",
        },
      },
      {
        kind: "code",
        title: "Fix the backup function",
        brief:
          "Complete the function so the original list is UNCHANGED after a backup is taken.",
        language: "python",
        starter:
          "def backup(ledger):\n    # BUG: this still mutates ledger when caller appends.\n    copy = ledger\n    return copy\n\noriginal = [10, 20, 30]\nb = backup(original)\nb.append(99)\nprint(original)\n",
        tests: [
          { label: "original unchanged", expectExact: "[10, 20, 30]" },
        ],
        hintTopic: "Use ledger.copy() or list(ledger) to create a real copy.",
      },
      {
        kind: "boss",
        title: "Boss — Default Argument Trap",
        story:
          "Mutable default arguments are a haunted house. The same list is shared across every call.",
        challenge: {
          type: "code",
          brief:
            "This function appends to a haunted default list. Fix it so each call starts with an empty list.",
          language: "python",
          starter:
            "def add_warrior(name, roster=[]):\n    roster.append(name)\n    return roster\n\nprint(add_warrior('Kai'))\nprint(add_warrior('Aria'))\n",
          tests: [
            { label: "Each call returns only its own warrior", expectExact: "['Kai']\n['Aria']" },
          ],
          hintTopic: "Use roster=None and inside: if roster is None: roster = []",
        },
      },
      {
        kind: "mastery",
        title: "Silent Mutation: Exposed",
        summary:
          "Reference semantics is the #1 cause of \"impossible\" bugs in Python. You now see through the illusion.",
        takeaways: [
          "Assignment never copies — it rebinds names",
          "Use .copy(), list(x), or x[:] to copy a list",
          "Never use a mutable default argument",
        ],
        xpReward: 140,
        badgeSlug: "mutation-hunter",
        badgeName: "Mutation Hunter",
      },
    ],
  },

  {
    slug: "exception-detective",
    worldSlug: "bug-hunter-city",
    title: "The Exception Detective",
    subtitle: "Read the traceback. Find the criminal.",
    difficulty: 2,
    estMinutes: 10,
    xpBase: 100,
    topics: ["debugging", "exceptions", "try/except"],
    steps: [
      {
        kind: "intro",
        title: "Crime scene: stdout",
        story:
          "A program crashed at 3 AM. The traceback is the crime scene photo. You learn to read it from the bottom up.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "Read tracebacks bottom-up",
        body:
          "The LAST line of a traceback is the error message — that's the verdict. The lines above are the path that led there. Start at the bottom, work upward.",
        demo: {
          type: "code-trace",
          lines: [
            "Traceback (most recent call last):",
            '  File "main.py", line 5, in <module>',
            "    print(stock['banana'])",
            "KeyError: 'banana'",
          ],
          explain: ["", "", "", "← read this first: missing key"],
        },
      },
      {
        kind: "practice",
        title: "What kind of error?",
        challenge: {
          type: "mcq",
          prompt: "x = int('hello') raises which exception?",
          options: ["TypeError", "ValueError", "KeyError", "NameError"],
          correctIndex: 1,
          explain: "int() got a string of the right TYPE but the wrong VALUE → ValueError.",
        },
      },
      {
        kind: "code",
        title: "Guard the divide",
        brief:
          "Complete `safe_div(a, b)` so it returns a / b normally, but returns the string 'undefined' if b is 0. Do NOT use an if; use try/except.",
        language: "python",
        starter:
          "def safe_div(a, b):\n    # use try / except ZeroDivisionError\n    pass\n\nprint(safe_div(10, 2))\nprint(safe_div(7, 0))\n",
        tests: [
          { label: "Normal division works", expectIncludes: ["5"] },
          { label: "Zero division returns 'undefined'", expectIncludes: ["undefined"] },
        ],
        hintTopic: "try: return a / b  except ZeroDivisionError: return 'undefined'",
      },
      {
        kind: "boss",
        title: "Boss — The Dictionary Phantom",
        story:
          "A KeyError lurks. Catch it; never let it crash the program.",
        challenge: {
          type: "code",
          brief:
            "Given inventory = {'sword': 3, 'shield': 1}, write `count(item)` that returns the count, or 0 if missing. Print count('sword') and count('potion').",
          language: "python",
          starter: "inventory = {'sword': 3, 'shield': 1}\n\ndef count(item):\n    pass\n\nprint(count('sword'))\nprint(count('potion'))\n",
          tests: [
            { label: "Prints 3 then 0", expectExact: "3\n0" },
          ],
          hintTopic: "Either try/except KeyError, or use inventory.get(item, 0).",
        },
      },
      {
        kind: "mastery",
        title: "Exception Detective: Promoted",
        summary:
          "You can now read tracebacks like a pro and trap errors before they nuke the process.",
        takeaways: [
          "Read tracebacks BOTTOM-UP — last line = verdict",
          "Wrap risky lines in try/except with a SPECIFIC exception",
          "Use dict.get(key, default) to avoid KeyError",
        ],
        xpReward: 130,
        badgeSlug: "exception-detective",
        badgeName: "Exception Detective",
      },
    ],
  },

  {
    slug: "performance-trap",
    worldSlug: "bug-hunter-city",
    title: "The Performance Trap",
    subtitle: "The code works. It's just unbearably slow.",
    difficulty: 3,
    estMinutes: 12,
    xpBase: 140,
    topics: ["debugging", "complexity", "sets", "performance"],
    steps: [
      {
        kind: "intro",
        title: "The frozen dashboard",
        story:
          "The dashboard takes 30 seconds to load. The code is correct. The bug is hiding in O(n²).",
        visual: "loop",
      },
      {
        kind: "concept",
        title: "set lookups are O(1)",
        body:
          "Checking `x in some_list` scans the whole list (O(n)). Checking `x in some_set` is instant (O(1)). When you do membership checks inside a loop, prefer a set.",
        demo: {
          type: "bug-diff",
          before: "blocked = ['a','b','c','d',...]  # list\nfor u in users:\n    if u in blocked: ...   # O(n) every iter → O(n*m)",
          after: "blocked = {'a','b','c','d',...}  # set\nfor u in users:\n    if u in blocked: ...   # O(1) every iter → O(n)",
          explain: "A set is a hash table. Membership is constant time regardless of size.",
        },
      },
      {
        kind: "practice",
        title: "Which is faster?",
        challenge: {
          type: "mcq",
          prompt: "Membership test `x in container` is fastest when container is a:",
          options: ["list", "tuple", "set", "string"],
          correctIndex: 2,
          explain: "Sets (and dicts) use hashing → O(1) average lookup.",
        },
      },
      {
        kind: "code",
        title: "Speed up the filter",
        brief:
          "Filter `users` to only those NOT in `blocked`. The current code uses a list — rewrite using a set for fast lookup. Print the resulting list.",
        language: "python",
        starter:
          "users = ['alice','bob','carol','dave','eve']\nblocked_list = ['bob','dave']\n\n# Replace blocked_list with a set called `blocked` and build `allowed`.\nblocked = blocked_list\nallowed = [u for u in users if u not in blocked]\nprint(allowed)\n",
        tests: [
          { label: "Allowed list correct", expectExact: "['alice', 'carol', 'eve']" },
          { label: "blocked is a set", expectEval: { expr: "isinstance(blocked, set)", equals: true } },
        ],
        hintTopic: "blocked = set(blocked_list) — that's the whole fix.",
      },
      {
        kind: "boss",
        title: "Boss — Deduplicate the Logs",
        story:
          "10,000 log lines. Many duplicates. Return the unique ones, order preserved.",
        challenge: {
          type: "code",
          brief:
            "Implement `dedupe(seq)` that returns a list of unique items in their first-seen order. Test:\nprint(dedupe([1,2,2,3,1,4,3]))  # → [1,2,3,4]",
          language: "python",
          starter: "def dedupe(seq):\n    pass\n\nprint(dedupe([1,2,2,3,1,4,3]))\n",
          tests: [
            { label: "Correct unique order", expectExact: "[1, 2, 3, 4]" },
          ],
          hintTopic: "Track a set of seen items; append to a result list only when not seen.",
        },
      },
      {
        kind: "mastery",
        title: "Performance Trap: Defused",
        summary:
          "You know the most common performance fix in real code: turn a list into a set when you do membership checks in a loop.",
        takeaways: [
          "Membership: list = O(n), set = O(1)",
          "Profile before optimizing — but membership-in-loop is almost always the bug",
          "set(list) is the one-line speedup",
        ],
        xpReward: 160,
        badgeSlug: "speed-hunter",
        badgeName: "Speed Hunter",
      },
    ],
  },
];
