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
];
