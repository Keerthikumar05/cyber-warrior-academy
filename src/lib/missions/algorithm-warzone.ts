import type { Mission } from "./types";

// Algorithm Warzone — learning world. Missions 1–4 of 8.
// Each mission: intro → concept (AlgoVisualizer) → practice → code → boss → mastery.

export const algorithmWarzoneMissions: Mission[] = [
  // -------------------- 1. LINEAR SEARCH --------------------
  {
    slug: "linear-search",
    worldSlug: "algorithm-warzone",
    title: "Scout the Convoy",
    subtitle: "Linear search — check every cell.",
    difficulty: 1,
    estMinutes: 10,
    xpBase: 100,
    topics: ["linear search", "arrays", "O(n)"],
    steps: [
      {
        kind: "intro",
        title: "A convoy at dawn",
        story:
          "A convoy of seven trucks rolls past. One carries the stolen artifact. You have no map, no manifest — only your eyes. Check each truck in order until you find it. That's linear search.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "Sweep left to right",
        body:
          "Linear search visits every element in order until it finds the target — or runs out of array. Works on any list. No sorting needed. Worst case: every element. That's O(n).",
        demo: {
          type: "algo-viz",
          algo: "linear-search",
          input: [4, 9, 2, 7, 1, 8, 3],
          target: 8,
        },
      },
      {
        kind: "practice",
        title: "Count the comparisons",
        challenge: {
          type: "mcq",
          prompt:
            "An array of length 12 contains target=42 at index 9. How many comparisons does linear search make?",
          options: ["1", "9", "10", "12"],
          correctIndex: 2,
          explain:
            "Indexes 0..9 are checked — 10 comparisons. Index counts from 0, but you still touched index 9.",
        },
      },
      {
        kind: "code",
        title: "Write linear_search",
        brief:
          "Implement `linear_search(arr, target)` that returns the index of `target`, or -1 if not found. Then print `linear_search([4,9,2,7,1,8,3], 8)`.\nExpected output:\n5",
        language: "python",
        starter:
          "def linear_search(arr, target):\n    # loop and return the matching index, else -1\n    pass\n\nprint(linear_search([4,9,2,7,1,8,3], 8))\n",
        tests: [
          { label: "Prints 5 for the demo input", expectExact: "5" },
          {
            label: "Returns -1 when missing",
            expectEval: { expr: "linear_search([1,2,3], 9)", equals: -1 },
          },
          {
            label: "Returns first index on duplicates",
            expectEval: { expr: "linear_search([7,3,3,9], 3)", equals: 1 },
          },
          {
            label: "Works on an empty array",
            expectEval: { expr: "linear_search([], 5)", equals: -1 },
          },
        ],
        hintTopic:
          "Use `for i, v in enumerate(arr): if v == target: return i` and return -1 after the loop.",
      },
      {
        kind: "boss",
        title: "Boss — All Sightings",
        story:
          "The convoy splits and trucks return. Some carry decoys. Find EVERY index where the target appears.",
        challenge: {
          type: "code",
          brief:
            "Implement `all_indices(arr, target)` returning a list of all indexes where target appears.\nPrint `all_indices([1,3,7,3,9,3,2], 3)`.\nExpected output:\n[1, 3, 5]",
          language: "python",
          starter:
            "def all_indices(arr, target):\n    # return list of every matching index in order\n    pass\n\nprint(all_indices([1,3,7,3,9,3,2], 3))\n",
          tests: [
            { label: "Prints [1, 3, 5]", expectExact: "[1, 3, 5]" },
            {
              label: "Empty list when no match",
              expectEval: { expr: "all_indices([1,2,4], 9)", equals: [] },
            },
            {
              label: "All indices when all match",
              expectEval: { expr: "all_indices([5,5,5], 5)", equals: [0, 1, 2] },
            },
          ],
          hintTopic:
            "Build the list with a comprehension: `[i for i, v in enumerate(arr) if v == target]`.",
        },
      },
      {
        kind: "mastery",
        title: "Linear search — mapped",
        summary:
          "Linear search is the brute baseline. Slow on huge data, but unbeatable when the array is unsorted or tiny.",
        takeaways: [
          "Visit every element until match or end.",
          "Worst case O(n). Best case O(1) at index 0.",
          "Works on any list — no preconditions.",
        ],
        xpReward: 100,
        badgeSlug: "scout",
        badgeName: "Convoy Scout",
      },
    ],
  },

  // -------------------- 2. BINARY SEARCH --------------------
  {
    slug: "binary-search",
    worldSlug: "algorithm-warzone",
    title: "Splitting the Battlefield",
    subtitle: "Binary search — halve the window.",
    difficulty: 2,
    estMinutes: 12,
    xpBase: 120,
    topics: ["binary search", "sorted arrays", "O(log n)", "invariants"],
    steps: [
      {
        kind: "intro",
        title: "The sorted ranks",
        story:
          "Soldiers line up tallest at the back. To find one of exact height, you don't walk the row — you bisect. Look at the middle, then keep only the half that could contain them.",
        visual: "decision",
      },
      {
        kind: "concept",
        title: "Halve, halve, halve",
        body:
          "Binary search needs a SORTED array. Compare the target with the middle: equal → done; smaller → search left half; larger → search right half. Each step throws away half the data. That's O(log n).",
        demo: {
          type: "algo-viz",
          algo: "binary-search",
          input: [1, 3, 5, 7, 9, 11, 13, 17, 21, 25],
          target: 17,
        },
      },
      {
        kind: "practice",
        title: "When does it fail?",
        challenge: {
          type: "mcq",
          prompt: "Binary search returns the wrong answer when…",
          options: [
            "The array contains duplicates",
            "The array is not sorted",
            "The target is larger than every element",
            "The array has odd length",
          ],
          correctIndex: 1,
          explain:
            "Sortedness is the invariant — without it, the 'discard half' step is wrong. Duplicates, large targets, and odd lengths are all fine.",
        },
      },
      {
        kind: "code",
        title: "Write binary_search",
        brief:
          "Implement `binary_search(arr, target)` for a SORTED arr. Return the index, or -1 if absent.\nPrint `binary_search([1,3,5,7,9,11,13,17,21,25], 17)`.\nExpected output:\n7",
        language: "python",
        starter:
          "def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    # halve the window until you find target or lo > hi\n    pass\n\nprint(binary_search([1,3,5,7,9,11,13,17,21,25], 17))\n",
        tests: [
          { label: "Finds 17 at index 7", expectExact: "7" },
          {
            label: "Returns -1 when missing",
            expectEval: { expr: "binary_search([1,3,5,7,9], 4)", equals: -1 },
          },
          {
            label: "Finds the first element",
            expectEval: { expr: "binary_search([2,4,6,8], 2)", equals: 0 },
          },
          {
            label: "Finds the last element",
            expectEval: { expr: "binary_search([2,4,6,8], 8)", equals: 3 },
          },
          {
            label: "Empty array → -1",
            expectEval: { expr: "binary_search([], 1)", equals: -1 },
          },
        ],
        hintTopic:
          "Loop while `lo <= hi`. Compute `mid = (lo + hi) // 2`. If arr[mid] < target: lo = mid+1, else if greater: hi = mid-1, else return mid.",
      },
      {
        kind: "boss",
        title: "Boss — Insertion Point",
        story:
          "A new soldier wants to join the line without breaking the sorted order. Find the index where they belong.",
        challenge: {
          type: "code",
          brief:
            "Implement `insertion_point(arr, x)` returning the smallest index i such that all arr[0..i-1] < x and (i == len(arr) or arr[i] >= x). Must run in O(log n) — use binary search bounds.\nPrint `insertion_point([1,3,5,7,9], 6)`.\nExpected output:\n3",
          language: "python",
          starter:
            "def insertion_point(arr, x):\n    lo, hi = 0, len(arr)\n    # narrow lo, hi until lo == hi\n    pass\n\nprint(insertion_point([1,3,5,7,9], 6))\n",
          tests: [
            { label: "6 belongs at index 3", expectExact: "3" },
            {
              label: "Smaller than all → 0",
              expectEval: { expr: "insertion_point([1,3,5], 0)", equals: 0 },
            },
            {
              label: "Larger than all → len(arr)",
              expectEval: { expr: "insertion_point([1,3,5], 9)", equals: 3 },
            },
            {
              label: "Equal value goes to leftmost slot",
              expectEval: { expr: "insertion_point([1,3,3,5], 3)", equals: 1 },
            },
          ],
          hintTopic:
            "Use half-open bounds: while lo < hi, mid = (lo+hi)//2, if arr[mid] < x: lo = mid+1 else hi = mid. Return lo.",
        },
      },
      {
        kind: "mastery",
        title: "Binary search — mapped",
        summary:
          "When the array is sorted, halving turns O(n) into O(log n). The discipline is the invariant: every step preserves 'target lies in [lo, hi]'.",
        takeaways: [
          "Sortedness is non-negotiable.",
          "Each step halves the search space.",
          "log₂(1,000,000) ≈ 20 — twenty checks for a million items.",
        ],
        xpReward: 120,
        badgeSlug: "bisector",
        badgeName: "Bisector",
      },
    ],
  },

  // -------------------- 3. BUBBLE SORT --------------------
  {
    slug: "bubble-sort",
    worldSlug: "algorithm-warzone",
    title: "Rising Bubbles",
    subtitle: "Bubble sort — swap adjacent out-of-order pairs.",
    difficulty: 2,
    estMinutes: 12,
    xpBase: 130,
    topics: ["bubble sort", "in-place sorting", "stability", "O(n²)"],
    steps: [
      {
        kind: "intro",
        title: "The lazy tide",
        story:
          "Rows of treasure chests in the wrong order. Too lazy to rearrange them all, you just swap neighbors when the left is heavier. Pass after pass, the heaviest sinks to the right.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "Bubble up the biggest",
        body:
          "Walk the array. For each adjacent pair (j, j+1), if arr[j] > arr[j+1], swap. After one full pass, the largest value is at the end. Repeat for the rest. If a pass makes zero swaps, you're done.",
        demo: {
          type: "algo-viz",
          algo: "bubble-sort",
          input: [5, 1, 4, 2, 8],
        },
      },
      {
        kind: "practice",
        title: "Count the swaps",
        challenge: {
          type: "predict",
          prompt:
            "How many swaps does bubble sort perform on [3, 1, 2]?",
          code:
            "# pass 1: (3,1)→swap [1,3,2]; (3,2)→swap [1,2,3]\n# pass 2: no swaps\n",
          options: ["0", "1", "2", "3"],
          correctIndex: 2,
          explain:
            "Two swaps in pass 1 finish the sort. Pass 2 confirms no work to do — early exit.",
        },
      },
      {
        kind: "code",
        title: "Write bubble_sort",
        brief:
          "Implement `bubble_sort(arr)` that returns a NEW sorted list (do not mutate the original). Use the early-exit optimization: stop if a pass made no swaps.\nPrint `bubble_sort([5,1,4,2,8])`.\nExpected output:\n[1, 2, 4, 5, 8]",
        language: "python",
        starter:
          "def bubble_sort(arr):\n    a = list(arr)\n    # bubble largest to the end each pass; early-exit when a pass has no swaps\n    pass\n\nprint(bubble_sort([5,1,4,2,8]))\n",
        tests: [
          { label: "Sorts the demo input", expectExact: "[1, 2, 4, 5, 8]" },
          {
            label: "Already sorted stays sorted",
            expectEval: { expr: "bubble_sort([1,2,3,4])", equals: [1, 2, 3, 4] },
          },
          {
            label: "Handles duplicates",
            expectEval: { expr: "bubble_sort([3,1,3,2,1])", equals: [1, 1, 2, 3, 3] },
          },
          {
            label: "Empty stays empty",
            expectEval: { expr: "bubble_sort([])", equals: [] },
          },
          {
            label: "Does not mutate the original",
            expectEval: {
              expr: "(lambda x: (bubble_sort(x), x)[1])([3,1,2])",
              equals: [3, 1, 2],
            },
          },
        ],
        hintTopic:
          "Outer loop over passes. Track `swapped` per pass; if it stays False, break. Use a tuple swap: a[j], a[j+1] = a[j+1], a[j].",
      },
      {
        kind: "boss",
        title: "Boss — Optimized Sort",
        story:
          "The Quartermaster wants proof your sort is efficient when the data is nearly sorted. Return the sorted list AND the number of passes used.",
        challenge: {
          type: "code",
          brief:
            "Implement `bubble_sort_stats(arr)` returning (sorted_list, passes_used). For an already-sorted input it must take EXACTLY 1 pass (and exit early).\nPrint `bubble_sort_stats([1,2,3,4,5])`.\nExpected output:\n([1, 2, 3, 4, 5], 1)",
          language: "python",
          starter:
            "def bubble_sort_stats(arr):\n    a = list(arr)\n    passes = 0\n    # implement with early exit\n    pass\n\nprint(bubble_sort_stats([1,2,3,4,5]))\n",
          tests: [
            {
              label: "Sorted input → 1 pass",
              expectExact: "([1, 2, 3, 4, 5], 1)",
            },
            {
              label: "Reverse sorted finishes correctly",
              expectEval: {
                expr: "bubble_sort_stats([5,4,3,2,1])[0]",
                equals: [1, 2, 3, 4, 5],
              },
            },
            {
              label: "Reverse sorted needs n-1 passes",
              expectEval: { expr: "bubble_sort_stats([5,4,3,2,1])[1]", equals: 4 },
            },
          ],
          hintTopic:
            "Increment `passes` at the START of each outer iteration so the early-exit pass still counts.",
        },
      },
      {
        kind: "mastery",
        title: "Bubble sort — mapped",
        summary:
          "Bubble sort is slow (O(n²)) but stable and dead simple. The 'no swaps → done' trick gives you O(n) on already-sorted data.",
        takeaways: [
          "Each pass guarantees one more element in final position.",
          "Early exit when a pass makes zero swaps.",
          "Stable: equal elements keep their relative order.",
        ],
        xpReward: 130,
        badgeSlug: "bubbler",
        badgeName: "Bubbler",
      },
    ],
  },

  // -------------------- 4. MERGE SORT --------------------
  {
    slug: "merge-sort",
    worldSlug: "algorithm-warzone",
    title: "Divide the Front",
    subtitle: "Merge sort — split, sort, merge.",
    difficulty: 3,
    estMinutes: 15,
    xpBase: 160,
    topics: ["merge sort", "divide and conquer", "recursion", "O(n log n)"],
    steps: [
      {
        kind: "intro",
        title: "Two captains, one army",
        story:
          "An army too big to sort at once. Split it in half, hand each half to a captain. They split again, and again, until each squad has one soldier. Then merge sorted squads upward. The whole army falls into line.",
        visual: "forge",
      },
      {
        kind: "concept",
        title: "Split, then merge sorted halves",
        body:
          "Recursively split the array down to size-1 pieces. Then merge each pair of sorted pieces into a sorted whole by walking two pointers and writing the smaller value. log n levels × n work per level = O(n log n).",
        demo: {
          type: "algo-viz",
          algo: "merge-sort",
          input: [38, 27, 43, 3, 9, 82, 10],
        },
      },
      {
        kind: "practice",
        title: "Why O(n log n)?",
        challenge: {
          type: "mcq",
          prompt:
            "An array of length 8 is merge-sorted. How many split levels deep does the recursion go?",
          options: ["2", "3", "4", "8"],
          correctIndex: 1,
          explain:
            "log₂(8) = 3 levels of splitting (8 → 4 → 2 → 1). Each level merges n items, so total work is n × log n.",
        },
      },
      {
        kind: "code",
        title: "Write the merge step",
        brief:
          "Implement `merge(left, right)` that takes two SORTED lists and returns one sorted list with all their elements. This is the heart of merge sort.\nPrint `merge([1,4,7], [2,3,8])`.\nExpected output:\n[1, 2, 3, 4, 7, 8]",
        language: "python",
        starter:
          "def merge(left, right):\n    out = []\n    i = j = 0\n    # walk two pointers, append the smaller; then flush leftovers\n    pass\n\nprint(merge([1,4,7], [2,3,8]))\n",
        tests: [
          { label: "Merges interleaved halves", expectExact: "[1, 2, 3, 4, 7, 8]" },
          {
            label: "One side empty",
            expectEval: { expr: "merge([], [1,2,3])", equals: [1, 2, 3] },
          },
          {
            label: "All-left then all-right",
            expectEval: { expr: "merge([1,2,3], [4,5,6])", equals: [1, 2, 3, 4, 5, 6] },
          },
          {
            label: "Equal values keep left-first (stability)",
            expectEval: {
              expr: "merge([1,2], [2,3])",
              equals: [1, 2, 2, 3],
            },
          },
        ],
        hintTopic:
          "While both have items, compare left[i] and right[j]. Append the smaller (use `<=` for stability) and advance that pointer. After the loop, extend with the leftovers.",
      },
      {
        kind: "boss",
        title: "Boss — Full Merge Sort",
        story:
          "Now wire your merge into the full divide-and-conquer. Sort the whole army.",
        challenge: {
          type: "code",
          brief:
            "Implement `merge_sort(arr)` that returns a new sorted list using recursion + your merge logic.\nPrint `merge_sort([38,27,43,3,9,82,10])`.\nExpected output:\n[3, 9, 10, 27, 38, 43, 82]",
          language: "python",
          starter:
            "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    out.extend(left[i:]); out.extend(right[j:])\n    return out\n\ndef merge_sort(arr):\n    # base case + split + recurse + merge\n    pass\n\nprint(merge_sort([38,27,43,3,9,82,10]))\n",
          tests: [
            {
              label: "Sorts the army",
              expectExact: "[3, 9, 10, 27, 38, 43, 82]",
            },
            {
              label: "Single element is base case",
              expectEval: { expr: "merge_sort([7])", equals: [7] },
            },
            {
              label: "Empty stays empty",
              expectEval: { expr: "merge_sort([])", equals: [] },
            },
            {
              label: "Handles duplicates and negatives",
              expectEval: {
                expr: "merge_sort([3,-1,2,3,0,-5])",
                equals: [-5, -1, 0, 2, 3, 3],
              },
            },
          ],
          hintTopic:
            "Base case: if len(arr) <= 1 return arr. Otherwise mid = len(arr)//2; recurse on arr[:mid] and arr[mid:]; return merge(left_sorted, right_sorted).",
        },
      },
      {
        kind: "mastery",
        title: "Merge sort — mapped",
        summary:
          "Divide-and-conquer turned a quadratic problem into n log n. The pattern (split → solve halves → combine) reappears everywhere: quicksort, FFT, segment trees.",
        takeaways: [
          "Split until trivial, then combine.",
          "n log n beats n² hard on large inputs.",
          "Merge sort is stable; extra O(n) memory is the trade-off.",
        ],
        xpReward: 160,
        badgeSlug: "divider",
        badgeName: "Divider of Armies",
      },
    ],
  },

  // -------------------- 5. RECURSION --------------------
  {
    slug: "recursion",
    worldSlug: "algorithm-warzone",
    title: "Echo Chamber",
    subtitle: "Recursion — a function that calls itself toward a base case.",
    difficulty: 3,
    estMinutes: 14,
    xpBase: 140,
    topics: ["recursion", "call stack", "base case"],
    steps: [
      {
        kind: "intro",
        title: "Echoes in the chamber",
        story:
          "A magician shouts into a chamber. The echo returns smaller, then smaller again, until it dies away. Every recursive function works the same: each call delegates a slightly easier version to itself, until a BASE CASE returns without recursing.",
        visual: "spell",
      },
      {
        kind: "concept",
        title: "Base case + recursive case",
        body:
          "Recursion needs two parts: a BASE CASE that stops the recursion, and a RECURSIVE CASE that calls the function on a smaller input and combines the result. Missing the base case → infinite recursion → stack overflow.",
        demo: { type: "algo-viz", algo: "recursion", input: [], n: 5 },
      },
      {
        kind: "practice",
        title: "Spot the base case",
        challenge: {
          type: "mcq",
          prompt:
            "Which line is the base case in:\n\ndef f(n):\n    if n <= 1: return 1\n    return n * f(n-1)",
          options: ["return n * f(n-1)", "if n <= 1: return 1", "def f(n):", "There is none"],
          correctIndex: 1,
          explain:
            "The base case is the condition that returns WITHOUT calling f again — here, when n ≤ 1.",
        },
      },
      {
        kind: "code",
        title: "Write factorial + sum_digits + reverse_string",
        brief:
          "Implement three recursive functions:\n• `factorial(n)` for n ≥ 0\n• `sum_digits(n)` — sum of decimal digits of n ≥ 0\n• `reverse_string(s)` — reversed string\nPrint `factorial(5), sum_digits(1729), reverse_string('echo')`.\nExpected output:\n(120, 19, 'ohce')",
        language: "python",
        starter:
          "def factorial(n):\n    pass\n\ndef sum_digits(n):\n    pass\n\ndef reverse_string(s):\n    pass\n\nprint((factorial(5), sum_digits(1729), reverse_string('echo')))\n",
        tests: [
          { label: "Trio prints correctly", expectExact: "(120, 19, 'ohce')" },
          { label: "factorial(0) = 1 (base case)", expectEval: { expr: "factorial(0)", equals: 1 } },
          { label: "factorial(7) = 5040", expectEval: { expr: "factorial(7)", equals: 5040 } },
          { label: "sum_digits(0) = 0", expectEval: { expr: "sum_digits(0)", equals: 0 } },
          {
            label: "reverse_string('') = ''",
            expectEval: { expr: "reverse_string('')", equals: "" },
          },
          {
            label: "reverse_string('a') = 'a'",
            expectEval: { expr: "reverse_string('a')", equals: "a" },
          },
        ],
        hintTopic:
          "factorial(n) → if n<=1: return 1 else n*factorial(n-1). sum_digits(n) → if n<10: return n else n%10 + sum_digits(n//10). reverse_string(s) → if len(s)<=1: return s else reverse_string(s[1:]) + s[0].",
      },
      {
        kind: "boss",
        title: "Boss — Tower of Hanoi",
        story:
          "Three pegs, n disks, one rule: never stack a bigger disk on a smaller one. Print every move to relocate the tower from A to C.",
        challenge: {
          type: "code",
          brief:
            "Implement `hanoi_moves(n, frm='A', to='C', via='B')` returning a list of moves as 'frm->to' strings, in the order they should be performed.\nPrint `hanoi_moves(3)`.\nExpected output:\n['A->C', 'A->B', 'C->B', 'A->C', 'B->A', 'B->C', 'A->C']",
          language: "python",
          starter:
            "def hanoi_moves(n, frm='A', to='C', via='B'):\n    # base case: n == 0 → no moves\n    # else: move n-1 from frm→via, move 1 frm→to, move n-1 via→to\n    pass\n\nprint(hanoi_moves(3))\n",
          tests: [
            {
              label: "n=3 produces the canonical sequence",
              expectExact:
                "['A->C', 'A->B', 'C->B', 'A->C', 'B->A', 'B->C', 'A->C']",
            },
            { label: "n=0 → no moves", expectEval: { expr: "hanoi_moves(0)", equals: [] } },
            { label: "n=1 → single move", expectEval: { expr: "hanoi_moves(1)", equals: ["A->C"] } },
            {
              label: "n=4 takes 2^n - 1 = 15 moves",
              expectEval: { expr: "len(hanoi_moves(4))", equals: 15 },
            },
          ],
          hintTopic:
            "Recursive structure: T(n) = T(n-1) + [frm->to] + T(n-1) with peg roles rotated. Number of moves = 2^n - 1.",
        },
      },
      {
        kind: "mastery",
        title: "Recursion — mapped",
        summary:
          "Recursion turns a hard problem into a slightly smaller copy of itself. The stack does the bookkeeping for you — every active call is a frame.",
        takeaways: [
          "Always write the base case first.",
          "Each recursive call must move toward the base case.",
          "The call stack is finite — deep recursion can overflow.",
        ],
        xpReward: 140,
        badgeSlug: "echo-keeper",
        badgeName: "Echo Keeper",
      },
    ],
  },

  // -------------------- 6. GREEDY --------------------
  {
    slug: "greedy",
    worldSlug: "algorithm-warzone",
    title: "The Quick Draw",
    subtitle: "Greedy — take the locally best choice.",
    difficulty: 3,
    estMinutes: 13,
    xpBase: 150,
    topics: ["greedy", "optimization", "counterexamples"],
    steps: [
      {
        kind: "intro",
        title: "The fastest gun",
        story:
          "A duelist who never thinks ahead — always shoots whatever target looks biggest right now. Sometimes she wins. Sometimes she misses a smarter shot that would have ended the fight in one move. Welcome to greedy.",
        visual: "decision",
      },
      {
        kind: "concept",
        title: "Locally best ≠ globally best",
        body:
          "A greedy algorithm picks the locally optimal choice at each step. For some problems (US coins, activity selection) greedy IS optimal. For others (coins [1,3,4], amount 6 → greedy picks 4+1+1=3, optimal is 3+3=2), greedy fails.",
        demo: { type: "algo-viz", algo: "greedy", input: [], coins: [25, 10, 5, 1], amount: 41 },
      },
      {
        kind: "practice",
        title: "When does greedy fail?",
        challenge: {
          type: "mcq",
          prompt:
            "Greedy coin change with coins [1, 3, 4] for amount 6 picks coins [4, 1, 1] = 3 coins. What is the optimum?",
          options: ["3 coins", "2 coins (3 + 3)", "4 coins (1+1+1+3)", "1 coin"],
          correctIndex: 1,
          explain:
            "Two 3's sum to 6 with just 2 coins. Greedy was lured by the locally biggest coin and missed it.",
        },
      },
      {
        kind: "code",
        title: "Write greedy_change + activity_select",
        brief:
          "Implement two greedy functions:\n• `greedy_change(amount, coins)` — return list of coins (largest-first) summing to amount. Assume a coin set where greedy is optimal. Sort coins descending inside.\n• `activity_select(intervals)` — given list of (start, end), return the max count of non-overlapping intervals you can pick (greedy by EARLIEST END TIME).\nPrint `greedy_change(41, [1, 5, 10, 25]), activity_select([(1,3),(2,5),(3,6),(5,7),(8,9)])`.\nExpected output:\n([25, 10, 5, 1], 3)",
        language: "python",
        starter:
          "def greedy_change(amount, coins):\n    pass\n\ndef activity_select(intervals):\n    # sort by end time; pick if start >= last picked end\n    pass\n\nprint((greedy_change(41, [1, 5, 10, 25]), activity_select([(1,3),(2,5),(3,6),(5,7),(8,9)])))\n",
        tests: [
          {
            label: "Demo case",
            expectExact: "([25, 10, 5, 1], 3)",
          },
          {
            label: "greedy_change(30, [1,5,10,25])",
            expectEval: { expr: "greedy_change(30, [1,5,10,25])", equals: [25, 5] },
          },
          {
            label: "greedy_change(0, [...]) → []",
            expectEval: { expr: "greedy_change(0, [1,5,10,25])", equals: [] },
          },
          {
            label: "activity_select picks 4 from 5 friendly intervals",
            expectEval: {
              expr: "activity_select([(1,2),(2,3),(3,4),(4,5),(0,10)])",
              equals: 4,
            },
          },
          {
            label: "activity_select empty → 0",
            expectEval: { expr: "activity_select([])", equals: 0 },
          },
        ],
        hintTopic:
          "greedy_change: sort coins desc; for each coin, take amount//coin times. activity_select: sort by interval[1]; keep last_end = -inf; if start >= last_end, count += 1 and last_end = end.",
      },
      {
        kind: "boss",
        title: "Boss — Min Meeting Rooms",
        story:
          "The Quartermaster needs to schedule overlapping meetings. How many rooms minimum?",
        challenge: {
          type: "code",
          brief:
            "Implement `min_rooms(intervals)` returning the minimum number of rooms needed so no two overlapping meetings share a room. Use the two-pointer / sweep trick (separate sorted starts and ends).\nPrint `min_rooms([(0,30),(5,10),(15,20)])`.\nExpected output:\n2",
          language: "python",
          starter:
            "def min_rooms(intervals):\n    # sort starts and ends separately; sweep both pointers\n    pass\n\nprint(min_rooms([(0,30),(5,10),(15,20)]))\n",
          tests: [
            { label: "Demo case", expectExact: "2" },
            {
              label: "Non-overlapping intervals → 1 room",
              expectEval: { expr: "min_rooms([(0,5),(6,10),(11,15)])", equals: 1 },
            },
            {
              label: "All overlap → n rooms",
              expectEval: { expr: "min_rooms([(0,10),(1,11),(2,12)])", equals: 3 },
            },
            {
              label: "Empty input → 0",
              expectEval: { expr: "min_rooms([])", equals: 0 },
            },
          ],
          hintTopic:
            "Sort starts S, ends E. Walk i over S; if S[i] < E[j] you need a new room; else j+=1. Track max concurrent.",
        },
      },
      {
        kind: "mastery",
        title: "Greedy — mapped",
        summary:
          "Greedy is the fastest pattern in the kit, but it must be PROVEN optimal for each problem. When it isn't, switch to DP.",
        takeaways: [
          "Greedy = pick the locally best choice; never revise.",
          "It works when the problem has the 'greedy choice' property.",
          "Always look for a counterexample before trusting a greedy.",
        ],
        xpReward: 150,
        badgeSlug: "quick-draw",
        badgeName: "Quick Draw",
      },
    ],
  },

  // -------------------- 7. DYNAMIC PROGRAMMING BASICS --------------------
  {
    slug: "dp-basics",
    worldSlug: "algorithm-warzone",
    title: "Memory Bunker",
    subtitle: "DP — solve each subproblem once, remember the answer.",
    difficulty: 4,
    estMinutes: 16,
    xpBase: 180,
    topics: ["dynamic programming", "memoization", "tabulation"],
    steps: [
      {
        kind: "intro",
        title: "The bunker of remembered answers",
        story:
          "An archive room where every sub-question already has an answer written down. When you face a new puzzle, you don't recompute — you LOOK UP. That archive is dp[].",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "Memoization vs tabulation",
        body:
          "DP solves problems with overlapping subproblems by storing results. Two flavors:\n• MEMOIZATION (top-down): recursion + cache.\n• TABULATION (bottom-up): iterate from the smallest subproblems and fill a table.\nBoth turn exponential brute force into polynomial.",
        demo: { type: "algo-viz", algo: "dp", input: [], n: 8 },
      },
      {
        kind: "practice",
        title: "Why does DP win?",
        challenge: {
          type: "mcq",
          prompt:
            "Naive recursive fib(n) makes ~2^n calls. Memoized fib(n) makes how many distinct sub-calls?",
          options: ["O(log n)", "O(n)", "O(n log n)", "O(2^n)"],
          correctIndex: 1,
          explain:
            "Only n distinct subproblems (fib(0), fib(1), ..., fib(n)). Each is computed once, then cached.",
        },
      },
      {
        kind: "code",
        title: "Write fib_memo + fib_tab + climb_stairs",
        brief:
          "Implement three DP functions:\n• `fib_memo(n)` using a dict cache.\n• `fib_tab(n)` using a list (bottom-up).\n• `climb_stairs(n)` — number of distinct ways to climb n stairs taking 1 or 2 steps.\nPrint `fib_memo(30), fib_tab(30), climb_stairs(10)`.\nExpected output:\n(832040, 832040, 89)",
        language: "python",
        starter:
          "def fib_memo(n, cache=None):\n    pass\n\ndef fib_tab(n):\n    pass\n\ndef climb_stairs(n):\n    pass\n\nprint((fib_memo(30), fib_tab(30), climb_stairs(10)))\n",
        tests: [
          { label: "Trio prints correctly", expectExact: "(832040, 832040, 89)" },
          { label: "fib_memo(0) = 0", expectEval: { expr: "fib_memo(0)", equals: 0 } },
          { label: "fib_tab(1) = 1", expectEval: { expr: "fib_tab(1)", equals: 1 } },
          { label: "fib_memo == fib_tab for 20", expectEval: { expr: "fib_memo(20) == fib_tab(20)", equals: true } },
          { label: "climb_stairs(1) = 1", expectEval: { expr: "climb_stairs(1)", equals: 1 } },
          { label: "climb_stairs(2) = 2", expectEval: { expr: "climb_stairs(2)", equals: 2 } },
          { label: "climb_stairs(5) = 8", expectEval: { expr: "climb_stairs(5)", equals: 8 } },
        ],
        hintTopic:
          "fib_memo: if n in cache return; cache[n] = fib_memo(n-1)+fib_memo(n-2). fib_tab: dp=[0,1]; for i in range(2,n+1): dp.append(dp[-1]+dp[-2]). climb_stairs(n) is just fib(n+1) under a different name.",
      },
      {
        kind: "boss",
        title: "Boss — 0/1 Knapsack",
        story:
          "The vault has items with weights and values. You carry a sack of fixed capacity. Maximize the value you take — each item either in or out.",
        challenge: {
          type: "code",
          brief:
            "Implement `knapsack(weights, values, W)` returning the maximum total value with total weight ≤ W. Use a 2D DP table dp[i][w].\nPrint `knapsack([2,3,4,5], [3,4,5,6], 5)`.\nExpected output:\n7",
          language: "python",
          starter:
            "def knapsack(weights, values, W):\n    n = len(weights)\n    # dp[i][w] = best value using first i items with capacity w\n    pass\n\nprint(knapsack([2,3,4,5], [3,4,5,6], 5))\n",
          tests: [
            { label: "Classic instance → 7", expectExact: "7" },
            {
              label: "Empty items → 0",
              expectEval: { expr: "knapsack([], [], 10)", equals: 0 },
            },
            {
              label: "Capacity 0 → 0",
              expectEval: { expr: "knapsack([1,2,3], [10,20,30], 0)", equals: 0 },
            },
            {
              label: "Single item fits",
              expectEval: { expr: "knapsack([3], [9], 5)", equals: 9 },
            },
            {
              label: "Single item too big",
              expectEval: { expr: "knapsack([6], [9], 5)", equals: 0 },
            },
            {
              label: "Take all when capacity is huge",
              expectEval: { expr: "knapsack([1,2,3], [6,10,12], 100)", equals: 28 },
            },
          ],
          hintTopic:
            "Recurrence: dp[i][w] = dp[i-1][w] if weights[i-1] > w else max(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1]). Initialize dp[0][*] = 0 and dp[*][0] = 0.",
        },
      },
      {
        kind: "mastery",
        title: "Dynamic programming — mapped",
        summary:
          "DP isn't a single algorithm — it's a strategy. Identify overlapping subproblems, define a recurrence, pick top-down or bottom-up, and fill the cache.",
        takeaways: [
          "DP needs OVERLAPPING SUBPROBLEMS and OPTIMAL SUBSTRUCTURE.",
          "Memoize when the recursion is natural; tabulate when you want explicit control.",
          "Always write the recurrence on paper before coding.",
        ],
        xpReward: 180,
        badgeSlug: "archivist",
        badgeName: "Bunker Archivist",
      },
    ],
  },

  // -------------------- 8. BACKTRACKING --------------------
  {
    slug: "backtracking",
    worldSlug: "algorithm-warzone",
    title: "The Labyrinth",
    subtitle: "Backtracking — try, recurse, undo, prune.",
    difficulty: 4,
    estMinutes: 18,
    xpBase: 200,
    topics: ["backtracking", "pruning", "n-queens", "maze"],
    steps: [
      {
        kind: "intro",
        title: "The branching corridors",
        story:
          "A maze. At every fork you pick a direction, mark the floor, walk on. If you hit a wall — you BACKTRACK, erase your mark, and try another branch. The trick is to PRUNE: detect dead-ends fast so you stop wasting steps.",
        visual: "gate",
      },
      {
        kind: "concept",
        title: "Choose → recurse → undo",
        body:
          "Backtracking is DFS over a decision tree. At each node you (1) try a choice, (2) recurse into the consequence, (3) UNDO the choice before trying the next sibling. Pruning means cutting whole branches you can prove cannot contain a solution.",
        demo: { type: "algo-viz", algo: "backtracking", input: [], n: 4 },
      },
      {
        kind: "practice",
        title: "Why prune?",
        challenge: {
          type: "mcq",
          prompt:
            "In 8-Queens, pruning attacks early reduces the search space by approximately…",
          options: [
            "Nothing — it's still 8! permutations",
            "About 2× — half the branches",
            "Orders of magnitude — from 8^8 ≈ 16M down to 113 placements",
            "It only helps for n ≥ 16",
          ],
          correctIndex: 2,
          explain:
            "Brute force is 8^8 ≈ 16.7M cells to try. Pruning attacks per-row leaves around 2k node visits — orders of magnitude smaller. Pruning IS the algorithm.",
        },
      },
      {
        kind: "code",
        title: "Write count_n_queens + subset_sum",
        brief:
          "Implement two backtracking functions:\n• `count_n_queens(n)` — number of distinct solutions placing n queens on an n×n board with no two attacking.\n• `subset_sum(nums, target)` — return True iff some subset of nums sums to exactly target.\nPrint `count_n_queens(4), subset_sum([3, 34, 4, 12, 5, 2], 9)`.\nExpected output:\n(2, True)",
        language: "python",
        starter:
          "def count_n_queens(n):\n    # backtrack row-by-row; track used cols, diags, anti-diags as sets\n    pass\n\ndef subset_sum(nums, target):\n    # for each item: include or exclude; prune when target < 0\n    pass\n\nprint((count_n_queens(4), subset_sum([3, 34, 4, 12, 5, 2], 9)))\n",
        tests: [
          { label: "Demo trio", expectExact: "(2, True)" },
          { label: "count_n_queens(1) = 1", expectEval: { expr: "count_n_queens(1)", equals: 1 } },
          { label: "count_n_queens(2) = 0", expectEval: { expr: "count_n_queens(2)", equals: 0 } },
          { label: "count_n_queens(3) = 0", expectEval: { expr: "count_n_queens(3)", equals: 0 } },
          { label: "count_n_queens(5) = 10", expectEval: { expr: "count_n_queens(5)", equals: 10 } },
          {
            label: "subset_sum impossible target",
            expectEval: { expr: "subset_sum([1, 2, 3], 100)", equals: false },
          },
          {
            label: "subset_sum target 0 → True (empty subset)",
            expectEval: { expr: "subset_sum([1, 2, 3], 0)", equals: true },
          },
        ],
        hintTopic:
          "N-Queens: recurse on row; for c in range(n): if c not in cols and (row+c) not in diag1 and (row-c) not in diag2 → add, recurse, remove. subset_sum: bt(i, t): if t==0 True; if i==len(nums) or t<0 False; return bt(i+1, t-nums[i]) or bt(i+1, t).",
      },
      {
        kind: "boss",
        title: "Boss — Rat in a Maze",
        story:
          "A rat starts at the top-left of an n×n grid. 1 = open, 0 = blocked. It can move Down or Right only. Find ANY path to the bottom-right (return the list of moves).",
        challenge: {
          type: "code",
          brief:
            "Implement `solve_maze(grid)` for an n×n list-of-lists grid (1=open, 0=blocked). Return a list of moves ('D' or 'R') from (0,0) to (n-1,n-1), or `[]` if no path. Backtrack when stuck.\nPrint `solve_maze([[1,0,0],[1,1,0],[0,1,1]])`.\nExpected output:\n['D', 'R', 'D', 'R']",
          language: "python",
          starter:
            "def solve_maze(grid):\n    n = len(grid)\n    if not n or grid[0][0] == 0 or grid[n-1][n-1] == 0:\n        return []\n    path = []\n    # try D then R, backtrack if stuck\n    pass\n\nprint(solve_maze([[1,0,0],[1,1,0],[0,1,1]]))\n",
          tests: [
            { label: "Demo maze", expectExact: "['D', 'R', 'D', 'R']" },
            {
              label: "Blocked start → []",
              expectEval: { expr: "solve_maze([[0,1],[1,1]])", equals: [] },
            },
            {
              label: "Blocked goal → []",
              expectEval: { expr: "solve_maze([[1,1],[1,0]])", equals: [] },
            },
            {
              label: "Straight path — n=1",
              expectEval: { expr: "solve_maze([[1]])", equals: [] },
            },
            {
              label: "Diagonal-only path",
              expectEval: {
                expr: "solve_maze([[1,1,1],[0,0,1],[0,0,1]])",
                equals: ["R", "R", "D", "D"],
              },
            },
          ],
          hintTopic:
            "Recursive bt(r, c): if (r,c) is goal, return True. Try D then R: if in-bounds and grid open and not visited, append move, recurse; if recursion fails, pop and try the other.",
        },
      },
      {
        kind: "mastery",
        title: "Backtracking — mapped & World Cleared",
        summary:
          "Backtracking is DFS with the discipline of UNDO. Every constraint-satisfaction problem (queens, sudoku, mazes, parsing) wants this pattern. You've now cleared Algorithm Warzone — search, sort, recursion, greedy, DP, and backtracking are in your toolbox.",
        takeaways: [
          "Choose → recurse → undo — always undo before the next sibling.",
          "Prune aggressively: dead branches are cheap to detect, expensive to walk.",
          "Backtracking is brute force with brakes.",
        ],
        xpReward: 200,
        badgeSlug: "algorithm-warzone-veteran",
        badgeName: "Algorithm Warzone Veteran",
      },
    ],
  },
];

