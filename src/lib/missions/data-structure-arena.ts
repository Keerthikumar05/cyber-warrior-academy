import type { Mission } from "./types";

export const dataStructureArenaMissions: Mission[] = [
  {
    slug: "array-arena",
    worldSlug: "data-structure-arena",
    title: "Array Arena",
    subtitle: "Index. Slice. Conquer.",
    difficulty: 2,
    estMinutes: 10,
    xpBase: 110,
    topics: ["arrays", "lists", "indexing", "slicing"],
    steps: [
      {
        kind: "intro",
        title: "The arena floor",
        story:
          "Arrays are the ground beneath every data structure. Numbered tiles. Random access. Master them and you walk on solid stone.",
        visual: "forge",
      },
      {
        kind: "concept",
        title: "Cells with addresses",
        body:
          "An array stores values in a row. Each cell has an index starting at 0. arr[0] is the first, arr[len(arr)-1] is the last. Python lists ARE dynamic arrays.",
        demo: {
          type: "ds-viz",
          structure: "array",
          ops: [
            { label: "Start: arr = [5, 2, 8, 1, 9]", cells: [5, 2, 8, 1, 9] },
            { label: "arr[0]  → 5", cells: [5, 2, 8, 1, 9], highlight: [0] },
            { label: "arr[2]  → 8", cells: [5, 2, 8, 1, 9], highlight: [2] },
            { label: "arr[-1] → 9 (last)", cells: [5, 2, 8, 1, 9], highlight: [4] },
            { label: "arr[1:4] → [2, 8, 1] (slice)", cells: [5, 2, 8, 1, 9], highlight: [1, 2, 3] },
          ],
        },
      },
      {
        kind: "practice",
        title: "Read the slice",
        challenge: {
          type: "predict",
          prompt: "arr = [10, 20, 30, 40, 50] — what is arr[1:4]?",
          code: "arr = [10, 20, 30, 40, 50]\nprint(arr[1:4])",
          options: ["[10, 20, 30]", "[20, 30, 40]", "[20, 30, 40, 50]", "[30, 40]"],
          correctIndex: 1,
          explain: "Slice [1:4] takes indexes 1, 2, 3 — end exclusive.",
        },
      },
      {
        kind: "code",
        title: "Find the max — without max()",
        brief:
          "Implement `find_max(nums)` that returns the largest number. You may NOT use Python's `max()`. Print find_max([3, 7, 2, 9, 4, 1]).",
        language: "python",
        starter: "def find_max(nums):\n    pass\n\nprint(find_max([3, 7, 2, 9, 4, 1]))\n",
        tests: [
          { label: "Returns 9", expectExact: "9" },
        ],
        hintTopic: "Track a `best` variable starting at nums[0], iterate and update.",
      },
      {
        kind: "boss",
        title: "Boss — Reverse In Place",
        story:
          "No new array allowed. Swap from both ends toward the middle.",
        challenge: {
          type: "code",
          brief:
            "Implement `reverse_in_place(arr)` that reverses the list IN PLACE (no new list, no arr[::-1], no .reverse()). Print arr after.",
          language: "python",
          starter:
            "def reverse_in_place(arr):\n    # swap arr[i] and arr[len-1-i] for i in left half\n    pass\n\narr = [1, 2, 3, 4, 5]\nreverse_in_place(arr)\nprint(arr)\n",
          tests: [
            { label: "Reversed correctly", expectExact: "[5, 4, 3, 2, 1]" },
          ],
          hintTopic: "Two pointers: i from 0, j from len-1. Swap arr[i], arr[j]. Move toward each other.",
        },
      },
      {
        kind: "mastery",
        title: "Array Arena: Cleared",
        summary:
          "You can read, slice, scan, and mutate arrays without crutches. This is the foundation for every higher structure.",
        takeaways: [
          "Index from 0; last is len-1 or -1",
          "Slice [a:b] is half-open",
          "Two-pointer technique unlocks in-place algorithms",
        ],
        xpReward: 140,
        badgeSlug: "array-champion",
        badgeName: "Array Champion",
      },
    ],
  },

  {
    slug: "stack-keep",
    worldSlug: "data-structure-arena",
    title: "Stack Keep",
    subtitle: "Last in, first out. The undo button of computing.",
    difficulty: 2,
    estMinutes: 10,
    xpBase: 110,
    topics: ["stack", "LIFO", "push/pop"],
    steps: [
      {
        kind: "intro",
        title: "Tower of plates",
        story:
          "You stack plates. The last one on top is the first one you grab. That's a stack. Browser back, undo, function calls — all stacks.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "push / pop / peek",
        body:
          "push() adds to the top. pop() removes from the top. peek() looks without removing. In Python, a list is already a stack: .append() and .pop().",
        demo: {
          type: "ds-viz",
          structure: "stack",
          ops: [
            { label: "empty", cells: [] },
            { label: "push(1)", cells: [1], highlight: [0] },
            { label: "push(2)", cells: [1, 2], highlight: [1] },
            { label: "push(3)", cells: [1, 2, 3], highlight: [2] },
            { label: "pop() → 3", cells: [1, 2], highlight: [1] },
            { label: "peek() → 2", cells: [1, 2], highlight: [1] },
          ],
        },
      },
      {
        kind: "practice",
        title: "Predict the stack",
        challenge: {
          type: "predict",
          prompt: "After: push 1, push 2, push 3, pop, push 4 — what's on top?",
          code: "s=[]; s.append(1); s.append(2); s.append(3); s.pop(); s.append(4); print(s[-1])",
          options: ["1", "2", "3", "4"],
          correctIndex: 3,
          explain: "After pop, top is 2. Push 4 → top is 4.",
        },
      },
      {
        kind: "code",
        title: "Reverse a string with a stack",
        brief:
          "Implement `reverse_string(s)` using a stack (push every char, then pop into a result). Print reverse_string('quest').",
        language: "python",
        starter: "def reverse_string(s):\n    pass\n\nprint(reverse_string('quest'))\n",
        tests: [
          { label: "Returns 'tseuq'", expectExact: "tseuq" },
        ],
        hintTopic: "stack = list(s); then pop in a loop and concatenate.",
      },
      {
        kind: "boss",
        title: "Boss — Balanced Brackets",
        story:
          "A parser needs to know if brackets match: '(([]))' valid, '([)]' invalid.",
        challenge: {
          type: "code",
          brief:
            "Implement `is_balanced(s)` returning True if every (, [, { has its matching closer in correct order. Print is_balanced('(([]))') and is_balanced('([)]').",
          language: "python",
          starter: "def is_balanced(s):\n    pass\n\nprint(is_balanced('(([]))'))\nprint(is_balanced('([)]'))\n",
          tests: [
            { label: "True then False", expectExact: "True\nFalse" },
          ],
          hintTopic: "Push openers onto a stack. For a closer, pop and check it matches. End with empty stack.",
        },
      },
      {
        kind: "mastery",
        title: "Stack Keep: Defended",
        summary:
          "You wield a stack. Undo, parsing, recursion — they all live here.",
        takeaways: [
          "LIFO: last in, first out",
          "Python list: .append() is push, .pop() is pop, [-1] is peek",
          "Balanced-bracket pattern shows up in interviews constantly",
        ],
        xpReward: 140,
        badgeSlug: "stack-master",
        badgeName: "Stack Master",
      },
    ],
  },

  {
    slug: "queue-gate",
    worldSlug: "data-structure-arena",
    title: "Queue Gate",
    subtitle: "First in, first out. Fairness encoded.",
    difficulty: 2,
    estMinutes: 10,
    xpBase: 110,
    topics: ["queue", "FIFO", "deque"],
    steps: [
      {
        kind: "intro",
        title: "The line at the gate",
        story:
          "Whoever arrives first leaves first. Print queues, message buses, BFS traversal — all queues.",
        visual: "gate",
      },
      {
        kind: "concept",
        title: "enqueue at back, dequeue at front",
        body:
          "Python's `collections.deque` is the right tool — O(1) appends and pops on both ends. Using a list with .pop(0) is O(n) and slow.",
        demo: {
          type: "ds-viz",
          structure: "queue",
          ops: [
            { label: "empty", cells: [] },
            { label: "enqueue(A)", cells: ["A"], highlight: [0] },
            { label: "enqueue(B)", cells: ["A", "B"], highlight: [1] },
            { label: "enqueue(C)", cells: ["A", "B", "C"], highlight: [2] },
            { label: "dequeue() → A", cells: ["B", "C"], highlight: [0] },
            { label: "dequeue() → B", cells: ["C"], highlight: [0] },
          ],
        },
      },
      {
        kind: "practice",
        title: "Which structure?",
        challenge: {
          type: "mcq",
          prompt: "You need a fair task queue where the oldest job runs next. Use:",
          options: ["Stack", "Queue", "Set", "Dictionary"],
          correctIndex: 1,
          explain: "Oldest first = FIFO = queue.",
        },
      },
      {
        kind: "code",
        title: "Build a printer queue",
        brief:
          "Use `collections.deque`. Enqueue 'doc1','doc2','doc3'. Then dequeue once. Print the remaining queue as a list.",
        language: "python",
        starter:
          "from collections import deque\n\nq = deque()\n# enqueue three docs, dequeue one, then print list(q)\n",
        tests: [
          { label: "Remaining is ['doc2', 'doc3']", expectExact: "['doc2', 'doc3']" },
        ],
        hintTopic: "q.append(x) to enqueue; q.popleft() to dequeue. print(list(q)) at the end.",
      },
      {
        kind: "boss",
        title: "Boss — Hot Potato",
        story:
          "n warriors in a circle, count k. Every k-th is eliminated. Return the survivor's name.",
        challenge: {
          type: "code",
          brief:
            "Implement `hot_potato(names, k)` — rotate the queue k-1 times (move front to back), then dequeue. Repeat until one remains. Print hot_potato(['A','B','C','D','E'], 3).",
          language: "python",
          starter:
            "from collections import deque\n\ndef hot_potato(names, k):\n    pass\n\nprint(hot_potato(['A','B','C','D','E'], 3))\n",
          tests: [
            { label: "Survivor is D", expectExact: "D" },
          ],
          hintTopic: "Loop while len(q) > 1: for _ in range(k-1): q.append(q.popleft()); then q.popleft().",
        },
      },
      {
        kind: "mastery",
        title: "Queue Gate: Held",
        summary:
          "You command FIFO order. The same pattern powers BFS, schedulers, and message buses.",
        takeaways: [
          "FIFO: first in, first out",
          "Use collections.deque, NOT list.pop(0)",
          "Rotation trick: pop front, append back",
        ],
        xpReward: 140,
        badgeSlug: "queue-warden",
        badgeName: "Queue Warden",
      },
    ],
  },

  {
    slug: "tree-grove",
    worldSlug: "data-structure-arena",
    title: "Binary Tree Grove",
    subtitle: "Branching paths. Recursive thinking.",
    difficulty: 3,
    estMinutes: 14,
    xpBase: 160,
    topics: ["trees", "recursion", "traversal"],
    steps: [
      {
        kind: "intro",
        title: "The grove of two paths",
        story:
          "Every node points to at most two children. File systems, parsers, decision engines — they all grow here.",
        visual: "decision",
      },
      {
        kind: "concept",
        title: "in-order traversal",
        body:
          "Visit left subtree, then the node, then right subtree. On a binary search tree this visits values in sorted order.",
        demo: {
          type: "ds-viz",
          structure: "tree",
          ops: [
            {
              label: "Start at root (4)",
              tree: [
                { value: 4, left: 1, right: 2 },
                { value: 2, left: 3, right: 4 },
                { value: 6, left: 5, right: 6 },
                { value: 1 }, { value: 3 }, { value: 5 }, { value: 7 },
              ],
              highlight: [0],
            },
            { label: "Go left → (2)", tree: [{value:4,left:1,right:2},{value:2,left:3,right:4},{value:6,left:5,right:6},{value:1},{value:3},{value:5},{value:7}], highlight: [1] },
            { label: "Left again → (1) — visit 1", tree: [{value:4,left:1,right:2},{value:2,left:3,right:4},{value:6,left:5,right:6},{value:1},{value:3},{value:5},{value:7}], highlight: [3] },
            { label: "Back to 2 — visit 2", tree: [{value:4,left:1,right:2},{value:2,left:3,right:4},{value:6,left:5,right:6},{value:1},{value:3},{value:5},{value:7}], highlight: [1] },
            { label: "Right of 2 → visit 3", tree: [{value:4,left:1,right:2},{value:2,left:3,right:4},{value:6,left:5,right:6},{value:1},{value:3},{value:5},{value:7}], highlight: [4] },
            { label: "Back to root — visit 4", tree: [{value:4,left:1,right:2},{value:2,left:3,right:4},{value:6,left:5,right:6},{value:1},{value:3},{value:5},{value:7}], highlight: [0] },
            { label: "Result: 1, 2, 3, 4, 5, 6, 7", tree: [{value:4,left:1,right:2},{value:2,left:3,right:4},{value:6,left:5,right:6},{value:1},{value:3},{value:5},{value:7}], highlight: [3,1,4,0,5,2,6] },
          ],
        },
      },
      {
        kind: "practice",
        title: "What order?",
        challenge: {
          type: "mcq",
          prompt: "Which traversal visits nodes in sorted order on a binary search tree?",
          options: ["pre-order", "in-order", "post-order", "level-order"],
          correctIndex: 1,
          explain: "in-order = left, node, right → sorted ascending on a BST.",
        },
      },
      {
        kind: "code",
        title: "Sum a tree recursively",
        brief:
          "A tree is a dict {'value': v, 'left': sub, 'right': sub} (or None). Implement `sum_tree(node)`. Test with the provided tree.",
        language: "python",
        starter:
          "def sum_tree(node):\n    # return 0 if node is None, else value + sum of children\n    pass\n\nt = {'value': 4,\n     'left':  {'value': 2, 'left': {'value': 1, 'left': None, 'right': None}, 'right': {'value': 3, 'left': None, 'right': None}},\n     'right': {'value': 6, 'left': {'value': 5, 'left': None, 'right': None}, 'right': {'value': 7, 'left': None, 'right': None}}}\n\nprint(sum_tree(t))\n",
        tests: [
          { label: "Returns 28", expectExact: "28" },
        ],
        hintTopic: "Base case: node is None → 0. Recursive: node['value'] + sum_tree(left) + sum_tree(right).",
      },
      {
        kind: "boss",
        title: "Boss — Max Depth",
        story:
          "Find the longest root-to-leaf path. The recursive shape is identical to sum_tree.",
        challenge: {
          type: "code",
          brief:
            "Implement `max_depth(node)` — depth of empty tree is 0; otherwise 1 + max(left_depth, right_depth). Print max_depth(t) for the tree below.",
          language: "python",
          starter:
            "def max_depth(node):\n    pass\n\nt = {'value': 1,\n     'left':  {'value': 2, 'left': {'value': 4, 'left': None, 'right': None}, 'right': None},\n     'right': {'value': 3, 'left': None, 'right': None}}\n\nprint(max_depth(t))\n",
          tests: [
            { label: "Returns 3", expectExact: "3" },
          ],
          hintTopic: "if node is None: return 0; else return 1 + max(max_depth(node['left']), max_depth(node['right'])).",
        },
      },
      {
        kind: "mastery",
        title: "Binary Tree Grove: Mapped",
        summary:
          "You can recurse on trees. This pattern — base case + combine children — is half of every algorithm interview.",
        takeaways: [
          "Base case first: empty tree = 0 / None",
          "Recursive case: combine results from children",
          "In-order traversal on a BST gives sorted output",
        ],
        xpReward: 180,
        badgeSlug: "tree-walker",
        badgeName: "Tree Walker",
      },
    ],
  },
];
