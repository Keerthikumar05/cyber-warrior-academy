import type { Mission } from "./types";

// World 8 — Placement Universe.
// Interview prep: aptitude, DSA, core CS, resume, HR, technical, company tracks, final simulation.
// All coding challenges run in Pyodide with hidden expectEval / expectExact tests.
// Company tracks are UNOFFICIAL preparation material and clearly disclaimed.

export const placementUniverseMissions: Mission[] = [
  // ------------------------------------------------------------------
  // 1. APTITUDE ARENA
  // ------------------------------------------------------------------
  {
    slug: "aptitude-arena",
    worldSlug: "placement-universe",
    title: "Aptitude Arena",
    subtitle: "Quantitative, logical, and verbal — under the clock.",
    difficulty: 2,
    estMinutes: 15,
    xpBase: 130,
    topics: ["aptitude", "quant", "logical reasoning", "verbal"],
    steps: [
      {
        kind: "intro",
        title: "The first filter",
        story:
          "Almost every campus placement opens with an aptitude test. Speed matters as much as accuracy. Train the reflexes now — under 60 seconds per question is the target.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "Three pillars of aptitude",
        body:
          "Quantitative: percentages, ratios, time-speed-distance, probability.\nLogical: series, coding-decoding, blood relations, syllogisms.\nVerbal: reading comprehension, synonyms, sentence correction.\n\nRule of thumb: skip a question after 90s and revisit later. Guessing negative-marked questions is usually a bad trade.",
        demo: {
          type: "code-trace",
          lines: [
            "# Percentage change trick",
            "old, new = 80, 100",
            "pct = (new - old) / old * 100",
            "# = 25% increase",
            "# Reverse: 100 → 80 is 20% decrease (NOT 25).",
          ],
          explain: [
            "Percent increase and decrease are asymmetric.",
            "Always divide by the starting value, not the ending value.",
            "This trips up ~30% of candidates in the first round.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Time & Work",
        challenge: {
          type: "mcq",
          prompt:
            "A can finish a job in 12 days, B in 18 days. Working together, how many days?",
          options: ["6", "7.2", "8", "10"],
          correctIndex: 1,
          explain:
            "Combined rate = 1/12 + 1/18 = 5/36 per day. Days = 36/5 = 7.2.",
        },
      },
      {
        kind: "code",
        title: "Series solver",
        brief:
          "Write `next_term(seq)` that returns the next number in an arithmetic OR geometric sequence. Assume input has at least 3 terms and is one of the two types.",
        language: "python",
        starter:
          "def next_term(seq):\n    # detect arithmetic vs geometric, return next term\n    pass\n",
        tests: [
          { label: "arithmetic +3", expectEval: { expr: "next_term([2,5,8,11])", equals: 14 } },
          { label: "geometric x2", expectEval: { expr: "next_term([3,6,12,24])", equals: 48 } },
          { label: "arithmetic -5", expectEval: { expr: "next_term([20,15,10])", equals: 5 } },
        ],
        hintTopic: "check if differences are constant (arithmetic) or ratios are constant (geometric)",
      },
      {
        kind: "boss",
        title: "Timed round",
        story:
          "The proctor starts the clock. Five questions, five minutes. Focus on the pattern, not the arithmetic.",
        challenge: {
          type: "pattern",
          prompt: "Complete the series: 2, 6, 12, 20, 30, ?",
          sequence: [2, 6, 12, 20, 30],
          options: [36, 40, 42, 44],
          correctIndex: 2,
          explain: "Differences are 4,6,8,10 → next diff 12. 30+12=42. Also n(n+1).",
        },
      },
      {
        kind: "mastery",
        title: "Aptitude Cleared",
        summary:
          "You now recognise the three families of aptitude questions and their fastest solving patterns. Practice daily — speed compounds.",
        takeaways: [
          "Skip after 90s; revisit.",
          "Percent change is asymmetric.",
          "Combined work rate = sum of individual rates.",
          "Series → try differences AND ratios.",
        ],
        xpReward: 130,
        badgeSlug: "aptitude-arena",
        badgeName: "Aptitude Ace",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 2. DSA CHALLENGE ZONE
  // ------------------------------------------------------------------
  {
    slug: "dsa-challenge-zone",
    worldSlug: "placement-universe",
    title: "DSA Challenge Zone",
    subtitle: "Arrays, strings, lists, trees, graphs, DP — revised.",
    difficulty: 3,
    estMinutes: 20,
    xpBase: 160,
    topics: ["arrays", "strings", "linked-list", "trees", "graphs", "dp"],
    steps: [
      {
        kind: "intro",
        title: "The 6 families",
        story:
          "Interviewers rotate the same six DSA families. Master the canonical pattern in each and you cover ~80% of coding rounds.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "Pattern cheatsheet",
        body:
          "Arrays → two pointers, sliding window.\nStrings → frequency map, palindrome expansion.\nLinked list → slow/fast pointer, dummy head.\nTrees → recursion + base case.\nGraphs → BFS for shortest, DFS for connectivity.\nDP → define state, recurrence, base, order.",
        demo: {
          type: "code-trace",
          lines: [
            "# Two-pointer: pair sum in sorted array",
            "def has_pair(a, target):",
            "    i, j = 0, len(a)-1",
            "    while i < j:",
            "        s = a[i] + a[j]",
            "        if s == target: return True",
            "        if s < target: i += 1",
            "        else: j -= 1",
            "    return False",
          ],
          explain: [
            "Sorted array = pointers can move deterministically.",
            "Sum too small → move left pointer right.",
            "Sum too big → move right pointer left.",
            "O(n) instead of O(n²).",
          ],
        },
      },
      {
        kind: "practice",
        title: "Which pattern?",
        challenge: {
          type: "mcq",
          prompt:
            "Detect a cycle in a linked list without extra memory. Best approach?",
          options: [
            "Hash every node visited.",
            "Floyd's tortoise & hare (slow/fast pointers).",
            "Sort the list first.",
            "Reverse the list.",
          ],
          correctIndex: 1,
          explain:
            "Slow moves 1, fast moves 2. If they meet, a cycle exists. O(1) memory.",
        },
      },
      {
        kind: "code",
        title: "Longest substring without repeats",
        brief:
          "Write `lswr(s)` returning the length of the longest substring of s with all distinct characters. Sliding window over a set.",
        language: "python",
        starter:
          "def lswr(s):\n    # sliding window: expand right, shrink left when duplicate\n    pass\n",
        tests: [
          { label: "abcabcbb → 3", expectEval: { expr: "lswr('abcabcbb')", equals: 3 } },
          { label: "bbbbb → 1", expectEval: { expr: "lswr('bbbbb')", equals: 1 } },
          { label: "pwwkew → 3", expectEval: { expr: "lswr('pwwkew')", equals: 3 } },
          { label: "empty → 0", expectEval: { expr: "lswr('')", equals: 0 } },
        ],
        hintTopic: "sliding window with a set; move left pointer past the previous duplicate",
      },
      {
        kind: "boss",
        title: "Boss: BFS shortest path",
        story:
          "You're given a grid where 0 = walkable, 1 = wall. Return the length of the shortest path from top-left to bottom-right, moving 4-directionally. Return -1 if unreachable.",
        challenge: {
          type: "code",
          brief:
            "Implement `shortest_path(grid)` returning path length (number of cells) or -1.",
          language: "python",
          starter:
            "from collections import deque\n\ndef shortest_path(grid):\n    # BFS from (0,0)\n    pass\n",
          tests: [
            { label: "3x3 open", expectEval: { expr: "shortest_path([[0,0,0],[0,0,0],[0,0,0]])", equals: 5 } },
            { label: "blocked", expectEval: { expr: "shortest_path([[0,1],[1,0]])", equals: -1 } },
            { label: "single cell", expectEval: { expr: "shortest_path([[0]])", equals: 1 } },
          ],
          hintTopic: "BFS with a queue; track visited; return steps+1 when you reach the target",
        },
      },
      {
        kind: "mastery",
        title: "DSA Revised",
        summary:
          "You've refreshed the six DSA families with the canonical pattern for each. Rotate through these weekly until placement season.",
        takeaways: [
          "Two pointers on sorted data.",
          "Sliding window for substrings.",
          "Floyd's for cycle detection.",
          "BFS = shortest in unweighted graphs.",
        ],
        xpReward: 160,
        badgeSlug: "dsa-challenge-zone",
        badgeName: "DSA Veteran",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 3. CORE CS VAULT
  // ------------------------------------------------------------------
  {
    slug: "core-cs-vault",
    worldSlug: "placement-universe",
    title: "Core CS Vault",
    subtitle: "OOP, DBMS, OS, Networks, SQL — the fundamentals interviewers grill on.",
    difficulty: 2,
    estMinutes: 16,
    xpBase: 140,
    topics: ["oop", "dbms", "operating-systems", "networks", "sql"],
    steps: [
      {
        kind: "intro",
        title: "The unavoidable 5",
        story:
          "Every technical interview loops back to OOP, DBMS, OS, Networks, or SQL. Depth over breadth — know the WHY.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "OOP pillars & OS scheduling",
        body:
          "OOP: Encapsulation (hide state), Inheritance (reuse), Polymorphism (many forms), Abstraction (hide impl).\n\nOS: process = program in execution; thread = lightest unit of scheduling. Deadlock needs 4 conditions: mutual exclusion, hold-and-wait, no preemption, circular wait.\n\nNetworks: TCP is reliable/ordered, UDP is fire-and-forget. HTTPS = HTTP over TLS.",
        demo: {
          type: "code-trace",
          lines: [
            "# Polymorphism example",
            "class Shape:",
            "    def area(self): pass",
            "class Circle(Shape):",
            "    def __init__(self, r): self.r = r",
            "    def area(self): return 3.14 * self.r * self.r",
            "shapes = [Circle(2), Circle(3)]",
            "areas = [s.area() for s in shapes]",
          ],
          explain: [
            "Same method call, different behaviours per subclass.",
            "That is runtime polymorphism.",
            "Interviewers love asking: 'give me a real example'.",
          ],
        },
      },
      {
        kind: "practice",
        title: "SQL join intuition",
        challenge: {
          type: "mcq",
          prompt:
            "You want ALL employees plus their department name — including employees with no department. Which join?",
          options: ["INNER JOIN", "LEFT JOIN employees→departments", "RIGHT JOIN", "CROSS JOIN"],
          correctIndex: 1,
          explain:
            "LEFT JOIN keeps every row from the left table (employees) even when the right side has no match — NULL fills the gap.",
        },
      },
      {
        kind: "code",
        title: "Compose a SQL query",
        brief:
          "Return a string containing a SQL query that lists employee name and department name for ALL employees (including those without a department). Tables: employees(id,name,dept_id), departments(id,name). Alias columns as emp_name and dept_name.",
        language: "python",
        starter:
          "def query():\n    return \"\"\"\n    -- write SQL here\n    \"\"\"\n",
        tests: [
          {
            label: "uses LEFT JOIN",
            expectEval: { expr: "'left join' in query().lower()", equals: true },
          },
          {
            label: "aliases correctly",
            expectEval: { expr: "'emp_name' in query().lower() and 'dept_name' in query().lower()", equals: true },
          },
          {
            label: "selects from employees",
            expectEval: { expr: "'from employees' in query().lower()", equals: true },
          },
        ],
        hintTopic: "SELECT e.name AS emp_name, d.name AS dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id",
      },
      {
        kind: "boss",
        title: "Boss: Deadlock diagnosis",
        story:
          "A junior engineer reports their multi-threaded service hangs randomly. You inspect: two threads each hold one mutex and wait for the other's. Which of Coffman's 4 conditions must you break to guarantee no deadlock?",
        challenge: {
          type: "mcq",
          prompt:
            "Cheapest condition to break in most application code?",
          options: [
            "Mutual exclusion (remove all locks)",
            "Hold-and-wait (acquire all locks up front, or none)",
            "No preemption (kill random threads)",
            "Circular wait (impossible without redesign)",
          ],
          correctIndex: 1,
          explain:
            "Breaking hold-and-wait via lock ordering or up-front acquisition is the standard practical fix.",
        },
      },
      {
        kind: "mastery",
        title: "Core CS Locked In",
        summary:
          "You can now defend the four OOP pillars, distinguish TCP vs UDP, diagnose deadlocks, and write joins with intent.",
        takeaways: [
          "Polymorphism = one call, many behaviours.",
          "TCP reliable, UDP fast.",
          "LEFT JOIN keeps unmatched left rows.",
          "Break hold-and-wait to fix deadlocks in app code.",
        ],
        xpReward: 140,
        badgeSlug: "core-cs-vault",
        badgeName: "Core CS Guardian",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 4. RESUME WORKSHOP
  // ------------------------------------------------------------------
  {
    slug: "resume-workshop",
    worldSlug: "placement-universe",
    title: "Resume Workshop",
    subtitle: "ATS-clean, one page, impact-first.",
    difficulty: 1,
    estMinutes: 12,
    xpBase: 110,
    topics: ["resume", "ats", "linkedin", "github"],
    steps: [
      {
        kind: "intro",
        title: "6 seconds to impress",
        story:
          "Recruiters skim resumes in 6 seconds. ATS bots reject before humans read. Your resume must be scannable AND parseable.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "The impact bullet formula",
        body:
          "Every bullet: Action verb + What you built + Tech + Measurable outcome.\n\nATS rules: no tables, no images, no fancy fonts, no headers/footers with vital info. Use standard section names: Experience, Projects, Skills, Education.\n\nGitHub: pin 4-6 real projects with a README. LinkedIn: match your resume; add a headline and About section.",
        demo: {
          type: "bug-diff",
          before: "• Worked on a website using React.",
          after: "• Built responsive React dashboard reducing report generation time by 60% for 200+ users.",
          explain:
            "The 'after' bullet is verb-first, tech-specific, and quantifies impact — parseable by ATS and skimmed easily by humans.",
        },
      },
      {
        kind: "practice",
        title: "Spot the ATS killer",
        challenge: {
          type: "mcq",
          prompt: "Which of these will hurt ATS parsing the most?",
          options: [
            "Standard bullet points",
            "A two-column layout with an image sidebar",
            "Section header 'Projects'",
            "Bold text on job titles",
          ],
          correctIndex: 1,
          explain:
            "Most ATS parsers scan top-to-bottom, left-to-right. Two columns and images scramble the extracted text order.",
        },
      },
      {
        kind: "code",
        title: "Score an impact bullet",
        brief:
          "Write `score_bullet(text)` returning an int score (0–4). +1 if it starts with a capitalised verb (letter A-Z followed by lowercase). +1 if it contains a digit. +1 if it mentions at least one tech keyword from ['python','react','node','sql','aws','java']. +1 if length is between 60 and 200 chars.",
        language: "python",
        starter:
          "def score_bullet(text):\n    # return integer 0..4\n    pass\n",
        tests: [
          {
            label: "great bullet",
            expectEval: {
              expr: "score_bullet('Built responsive React dashboard reducing report time by 60% for 200 users daily')",
              equals: 4,
            },
          },
          {
            label: "weak bullet",
            expectEval: { expr: "score_bullet('worked on stuff')", equals: 0 } ,
          },
          {
            label: "partial",
            expectEval: {
              expr: "score_bullet('Shipped a Python service handling requests')",
              equals: 2,
            },
          },
        ],
        hintTopic: "check first-word capitalisation, digits via any(c.isdigit()), keyword membership, and len()",
      },
      {
        kind: "boss",
        title: "Boss: The final review",
        story:
          "You have one line to describe your capstone project. Which is strongest?",
        challenge: {
          type: "mcq",
          prompt: "Pick the best resume bullet:",
          options: [
            "Made a chat app.",
            "Developed chat application using React and Node.",
            "Built real-time chat app (React, Node, WebSockets) supporting 500 concurrent users with <100ms latency.",
            "Was responsible for the frontend of a chat app.",
          ],
          correctIndex: 2,
          explain:
            "Verb-first, tech-specific, quantified, mentions scale AND performance. That is a hire-me bullet.",
        },
      },
      {
        kind: "mastery",
        title: "Resume Ready",
        summary:
          "Your resume, GitHub, and LinkedIn now speak the same language: impact-first, ATS-friendly, one page.",
        takeaways: [
          "Verb + What + Tech + Metric.",
          "No tables, no images.",
          "Pin real projects on GitHub with a README.",
          "Match LinkedIn headline to target role.",
        ],
        xpReward: 110,
        badgeSlug: "resume-workshop",
        badgeName: "Resume Architect",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 5. HR INTERVIEW STUDIO
  // ------------------------------------------------------------------
  {
    slug: "hr-interview-studio",
    worldSlug: "placement-universe",
    title: "HR Interview Studio",
    subtitle: "STAR stories, behavioural depth, calm delivery.",
    difficulty: 1,
    estMinutes: 12,
    xpBase: 110,
    topics: ["hr", "behavioural", "star", "communication"],
    steps: [
      {
        kind: "intro",
        title: "Culture round",
        story:
          "After coding rounds, HR decides whether the team wants to work with you. Prepare stories — not scripts.",
        visual: "decision",
      },
      {
        kind: "concept",
        title: "The STAR method",
        body:
          "S — Situation (context in one sentence).\nT — Task (your responsibility).\nA — Action (what YOU did, not the team).\nR — Result (measurable, or lesson learned).\n\nKeep each story under 90 seconds. Prep 5 stories that flex across 20 common questions.",
        demo: {
          type: "bug-diff",
          before:
            "Q: Tell me about a conflict.\nA: We had a disagreement and worked it out.",
          after:
            "S: Sprint 3, our team disagreed on API design.\nT: I owned the integration and had 2 days.\nA: Ran a 30-min spike, benchmarked both options, presented data.\nR: Team picked the faster option; shipped on time; adopted spikes as team norm.",
          explain:
            "The STAR answer is concrete, quantified, and shows initiative — not just resolution.",
        },
      },
      {
        kind: "practice",
        title: "Pick the strongest STAR",
        challenge: {
          type: "mcq",
          prompt: "Which answer best fits 'Tell me about a failure'?",
          options: [
            "I don't really fail.",
            "I once broke prod but fixed it fast.",
            "S: Launched a feature without tests. T: Owned deployment. A: Prod crashed 20min; I rolled back, wrote regression tests, added a pre-deploy checklist. R: Zero recurrences in 6 months.",
            "My biggest failure was working too hard.",
          ],
          correctIndex: 2,
          explain: "Owns the failure, describes concrete recovery, and shows lasting change.",
        },
      },
      {
        kind: "code",
        title: "Validate a STAR response",
        brief:
          "Write `is_star(answer)` returning True only if the string contains all four markers (case-insensitive): 'situation', 'task', 'action', 'result'.",
        language: "python",
        starter:
          "def is_star(answer):\n    pass\n",
        tests: [
          {
            label: "full STAR",
            expectEval: {
              expr: "is_star('Situation: sprint. Task: owner. Action: refactor. Result: 30% faster.')",
              equals: true,
            },
          },
          {
            label: "missing result",
            expectEval: { expr: "is_star('Situation and Task and Action only')", equals: false },
          },
          {
            label: "case insensitive",
            expectEval: {
              expr: "is_star('SITUATION x TASK y ACTION z RESULT w')",
              equals: true,
            },
          },
        ],
        hintTopic: "lowercase the string and check all(marker in a.lower() for marker in [...])",
      },
      {
        kind: "boss",
        title: "Boss: Why should we hire you?",
        story:
          "The classic closer. Interviewers want a 60-second pitch tying your strengths to the role.",
        challenge: {
          type: "mcq",
          prompt: "Best structure for the answer?",
          options: [
            "List every skill on your resume.",
            "Match 2-3 role-specific strengths, back each with a concrete example, close with enthusiasm for the mission.",
            "Say 'because I need a job'.",
            "Compare yourself favourably to other candidates.",
          ],
          correctIndex: 1,
          explain:
            "Relevance + evidence + fit for THIS company. Comparing yourself to others is unprofessional.",
        },
      },
      {
        kind: "mastery",
        title: "HR Round Cleared",
        summary:
          "You can tell 5 STAR stories that flex across any behavioural prompt, and land a 60-second pitch.",
        takeaways: [
          "Prep 5 stories, not 20 scripts.",
          "STAR structure, 90s max.",
          "Own failures; show change.",
          "Match strengths to the role.",
        ],
        xpReward: 110,
        badgeSlug: "hr-interview-studio",
        badgeName: "HR Storyteller",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 6. TECHNICAL INTERVIEW LAB
  // ------------------------------------------------------------------
  {
    slug: "technical-interview-lab",
    worldSlug: "placement-universe",
    title: "Technical Interview Lab",
    subtitle: "Live coding, system design basics, debugging out loud.",
    difficulty: 3,
    estMinutes: 20,
    xpBase: 170,
    topics: ["coding-interview", "system-design", "debugging", "communication"],
    steps: [
      {
        kind: "intro",
        title: "Think out loud",
        story:
          "The signal isn't just the answer — it's how you get there. Interviewers hire clear thinkers who can be helped.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "The 4-step framework",
        body:
          "1. Clarify — restate problem, ask about input size, edge cases.\n2. Plan — describe approach; state complexity BEFORE coding.\n3. Code — narrate as you type; name variables clearly.\n4. Verify — walk a test case; discuss trade-offs; mention alternatives.\n\nSystem design basics: start with functional requirements → estimate scale → sketch API → data model → components → bottlenecks.",
        demo: {
          type: "code-trace",
          lines: [
            "# Interview: reverse words in a string",
            "# Clarify: single spaces? unicode?",
            "# Plan: split, reverse list, join. O(n) time/space.",
            "def reverse_words(s):",
            "    return ' '.join(s.split()[::-1])",
            "# Verify: 'hello world' → 'world hello' ✓",
          ],
          explain: [
            "Notice: clarify first, then plan, then code.",
            "State complexity BEFORE writing code.",
            "Verify with an example at the end.",
          ],
        },
      },
      {
        kind: "practice",
        title: "System design instinct",
        challenge: {
          type: "mcq",
          prompt:
            "Designing a URL shortener for 100M links. Which is the MOST critical bottleneck to plan for first?",
          options: [
            "Font choice on the landing page",
            "Unique short-code generation at scale + read cache",
            "The color of the primary button",
            "Which cloud provider is cheapest",
          ],
          correctIndex: 1,
          explain:
            "Reads dominate writes ~100:1. Plan cache + collision-free short codes first; provider comes later.",
        },
      },
      {
        kind: "code",
        title: "Debug this function",
        brief:
          "The intern wrote `is_palindrome(s)` but it fails on mixed-case and spaces. Fix it: ignore case and non-alphanumeric characters. Empty and single-char strings are palindromes.",
        language: "python",
        starter:
          "def is_palindrome(s):\n    # normalise then compare\n    return s == s[::-1]\n",
        tests: [
          { label: "classic", expectEval: { expr: "is_palindrome('racecar')", equals: true } },
          { label: "mixed case", expectEval: { expr: "is_palindrome('RaceCar')", equals: true } },
          { label: "with spaces", expectEval: { expr: "is_palindrome('A man a plan a canal Panama')", equals: true } },
          { label: "not palindrome", expectEval: { expr: "is_palindrome('hello')", equals: false } },
          { label: "empty", expectEval: { expr: "is_palindrome('')", equals: true } },
        ],
        hintTopic: "filter with c.isalnum(), lowercase, then check equals its reverse",
      },
      {
        kind: "boss",
        title: "Boss: Live coding round",
        story:
          "You have 25 minutes. Design and implement `group_anagrams(words)` grouping strings that are anagrams of each other. Talk through your approach mentally before coding.",
        challenge: {
          type: "code",
          brief:
            "Return a list of groups (each group is a list of words). Order of groups doesn't matter; within each group order doesn't matter.",
          language: "python",
          starter:
            "def group_anagrams(words):\n    # key each word by its sorted letters\n    pass\n",
          tests: [
            {
              label: "sorts into groups",
              expectEval: {
                expr: "sorted([sorted(g) for g in group_anagrams(['eat','tea','tan','ate','nat','bat'])]) == sorted([['ate','eat','tea'], ['nat','tan'], ['bat']])",
                equals: true,
              },
            },
            {
              label: "single word",
              expectEval: {
                expr: "group_anagrams(['x']) == [['x']]",
                equals: true,
              },
            },
            {
              label: "empty list",
              expectEval: { expr: "group_anagrams([]) == []", equals: true },
            },
          ],
          hintTopic: "use a dict keyed by ''.join(sorted(word)) — O(n·k log k) total",
        },
      },
      {
        kind: "mastery",
        title: "Technical Round Cleared",
        summary:
          "You can clarify, plan, code, and verify — out loud. You can sketch a system design and defend trade-offs.",
        takeaways: [
          "Clarify before coding.",
          "State complexity before typing.",
          "Narrate; interviewers hire clear thinkers.",
          "System design: functional → scale → API → data → components.",
        ],
        xpReward: 170,
        badgeSlug: "technical-interview-lab",
        badgeName: "Interview Engineer",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 7. COMPANY TRACKS
  // ------------------------------------------------------------------
  {
    slug: "company-tracks",
    worldSlug: "placement-universe",
    title: "Company Tracks",
    subtitle: "Infosys · TCS · Wipro · Accenture · Cognizant · Capgemini · Deloitte · IBM.",
    difficulty: 2,
    estMinutes: 15,
    xpBase: 140,
    topics: ["company-prep", "infosys", "tcs", "wipro", "accenture"],
    steps: [
      {
        kind: "intro",
        title: "Unofficial prep — read carefully",
        story:
          "DISCLAIMER: These tracks are UNOFFICIAL preparation material compiled from publicly reported patterns. They are NOT endorsed by any company and hiring processes change frequently. Always verify with the official career portal of each company before applying.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "The typical funnel",
        body:
          "Most Indian IT service majors follow a similar 4-stage funnel:\n\n1. Aptitude + English (30–60 mins, adaptive).\n2. Coding round (1–3 problems, easy-medium).\n3. Technical interview (DSA + Core CS + projects).\n4. HR interview (behavioural + location flexibility).\n\nEach company weights the stages differently — Infosys leans coding-heavy, TCS emphasises verbal & pseudo-code, Accenture emphasises communication.",
        demo: {
          type: "code-trace",
          lines: [
            "TRACKS = {",
            "  'Infosys':   ['aptitude', 'coding', 'tech', 'hr'],",
            "  'TCS':       ['aptitude', 'coding', 'tech', 'hr'],",
            "  'Wipro':     ['aptitude', 'coding', 'tech', 'hr'],",
            "  'Accenture': ['aptitude', 'coding', 'comm', 'hr'],",
            "  'Cognizant': ['aptitude', 'coding', 'tech', 'hr'],",
            "  'Capgemini': ['aptitude', 'coding', 'tech', 'hr'],",
            "  'Deloitte':  ['aptitude', 'case', 'tech', 'hr'],",
            "  'IBM':       ['aptitude', 'coding', 'tech', 'hr'],",
            "}",
          ],
          explain: [
            "Every track ends with HR — culture fit matters.",
            "Accenture is known for a communication assessment.",
            "Deloitte often includes a case-study round.",
            "Always confirm on the official careers site.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Prep priorities",
        challenge: {
          type: "mcq",
          prompt:
            "You have 4 weeks and target IT-services placements. Best time allocation?",
          options: [
            "100% competitive programming.",
            "40% aptitude, 30% DSA (easy-medium), 20% core CS, 10% HR/communication.",
            "100% system design.",
            "100% memorising HR answers.",
          ],
          correctIndex: 1,
          explain:
            "IT-services rounds emphasise aptitude and easy-medium DSA; system design isn't typically asked at entry level.",
        },
      },
      {
        kind: "code",
        title: "Match candidate to track",
        brief:
          "Write `pick_track(profile)` where profile is a dict with keys 'apt' (int 0-100), 'dsa' (int), 'comm' (int). Return the track name (string) with the highest matching weight from these rules: if comm >= 80 → 'Accenture'; else if dsa >= 80 → 'Infosys'; else if apt >= 80 → 'TCS'; else 'Capgemini'.",
        language: "python",
        starter:
          "def pick_track(profile):\n    pass\n",
        tests: [
          { label: "comm-strong", expectEval: { expr: "pick_track({'apt': 60, 'dsa': 60, 'comm': 85})", equals: "Accenture" } },
          { label: "dsa-strong", expectEval: { expr: "pick_track({'apt': 60, 'dsa': 90, 'comm': 60})", equals: "Infosys" } },
          { label: "apt-strong", expectEval: { expr: "pick_track({'apt': 85, 'dsa': 60, 'comm': 60})", equals: "TCS" } },
          { label: "default", expectEval: { expr: "pick_track({'apt': 50, 'dsa': 50, 'comm': 50})", equals: "Capgemini" } },
        ],
        hintTopic: "chained if/elif in the order given by the spec",
      },
      {
        kind: "boss",
        title: "Boss: Track selection",
        story:
          "A candidate has strong aptitude (85), average DSA (65), strong communication (82). They want maximum interview count with minimum risk. Reminder: this is unofficial guidance.",
        challenge: {
          type: "mcq",
          prompt: "Best PRIMARY track to invest in first?",
          options: [
            "Infosys — coding heavy",
            "Accenture — communication assessment plays to their strengths",
            "Deloitte — case-study heavy",
            "Skip placements",
          ],
          correctIndex: 1,
          explain:
            "Play to the strongest signal; apply to more companies in parallel — this is a portfolio, not a single bet.",
        },
      },
      {
        kind: "mastery",
        title: "Tracks Mapped",
        summary:
          "You know the shape of each IT-services funnel and can allocate prep time efficiently. All content is unofficial — verify against each company's official careers page.",
        takeaways: [
          "Every funnel ends with HR.",
          "Accenture weights communication.",
          "Deloitte often adds case study.",
          "Always verify on the official careers portal.",
        ],
        xpReward: 140,
        badgeSlug: "company-tracks",
        badgeName: "Track Strategist",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 8. FINAL BOSS — PLACEMENT CHALLENGE
  // ------------------------------------------------------------------
  {
    slug: "placement-challenge",
    worldSlug: "placement-universe",
    title: "Final Boss: Placement Challenge",
    subtitle: "Full simulation — aptitude, coding, technical, HR.",
    difficulty: 5,
    estMinutes: 30,
    xpBase: 300,
    topics: ["placement", "simulation", "certificate"],
    steps: [
      {
        kind: "intro",
        title: "The full loop",
        story:
          "You've trained every round separately. Now run them back-to-back — a real hiring simulation. Complete this to earn the Code Quest Academy final certificate.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "How this round is scored",
        body:
          "Four sub-rounds — aptitude, coding, technical, HR — each contributing to a Placement Readiness Score. You pass by clearing every sub-round in sequence, just like a real interview loop.\n\nAfter completion the AI mentor generates a readiness report highlighting which axes are strong (ship it) and which need one more week of practice.",
        demo: {
          type: "code-trace",
          lines: [
            "readiness = {",
            "  'aptitude':  cleared_apt,",
            "  'coding':    cleared_code,",
            "  'technical': cleared_tech,",
            "  'hr':        cleared_hr,",
            "}",
            "passed = all(readiness.values())",
          ],
          explain: [
            "Every axis must clear — like a real loop.",
            "One weak axis sinks the offer.",
            "The report tells you exactly which to retrain.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Aptitude round",
        challenge: {
          type: "mcq",
          prompt:
            "A shopkeeper marks up an item 40% then gives a 25% discount. Net profit percent?",
          options: ["5%", "10%", "15%", "20%"],
          correctIndex: 0,
          explain:
            "SP = 1.40 × 0.75 = 1.05 → 5% profit. Beware of adding/subtracting percentages directly.",
        },
      },
      {
        kind: "code",
        title: "Coding round",
        brief:
          "Write `two_sum(nums, target)` returning the indices [i, j] (i<j) of the two numbers that add to target. Exactly one solution exists. O(n) expected.",
        language: "python",
        starter:
          "def two_sum(nums, target):\n    # hash map from value → index\n    pass\n",
        tests: [
          { label: "basic", expectEval: { expr: "two_sum([2,7,11,15], 9) == [0,1]", equals: true } },
          { label: "later pair", expectEval: { expr: "two_sum([3,2,4], 6) == [1,2]", equals: true } },
          { label: "duplicates", expectEval: { expr: "two_sum([3,3], 6) == [0,1]", equals: true } },
        ],
        hintTopic: "as you scan, check if (target - num) is already in a dict; else store num→index",
      },
      {
        kind: "boss",
        title: "Technical + HR combined",
        story:
          "The panel has one final ask: implement `valid_parens(s)` matching (), [], {}. Then, in your own words, explain a time you shipped under pressure. Two skills, one round.",
        challenge: {
          type: "code",
          brief:
            "Return True iff every opener has a matching closer in the correct order. Stack-based, O(n).",
          language: "python",
          starter:
            "def valid_parens(s):\n    pass\n",
          tests: [
            { label: "balanced", expectEval: { expr: "valid_parens('()[]{}')", equals: true } },
            { label: "mismatched", expectEval: { expr: "valid_parens('(]')", equals: false } },
            { label: "nested", expectEval: { expr: "valid_parens('([{}])')", equals: true } },
            { label: "unclosed", expectEval: { expr: "valid_parens('(')", equals: false } },
            { label: "empty", expectEval: { expr: "valid_parens('')", equals: true } },
          ],
          hintTopic: "push openers on a stack; on a closer, pop and check the pair matches",
        },
      },
      {
        kind: "mastery",
        title: "Code Quest Academy — Graduate",
        summary:
          "You cleared every round of a full hiring simulation. Aptitude, coding, technical, HR — all green. The Placement Readiness Report is unlocked in your profile, and the Code Quest Academy final certificate is yours.",
        takeaways: [
          "Aptitude: watch percent-of-percent traps.",
          "Coding: hash maps beat nested loops.",
          "Technical: stacks solve matching problems.",
          "HR: STAR stories, 90s each.",
        ],
        xpReward: 300,
        badgeSlug: "placement-universe-master",
        badgeName: "Code Quest Academy — Graduate",
      },
    ],
  },
];
