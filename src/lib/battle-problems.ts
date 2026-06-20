export interface BattleProblem {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  starter: string;
  /** Python expression evaluated against user solution — must return True for win */
  test: string;
  timeLimitSec: number;
}

export const battleProblems: BattleProblem[] = [
  {
    slug: "sum-pair",
    title: "Sum the Pair",
    difficulty: "easy",
    description: "Write a function `solve(a, b)` that returns a + b.",
    starter: "def solve(a, b):\n    # your code\n    pass\n",
    test: "solve(2, 3) == 5 and solve(-1, 1) == 0 and solve(100, 200) == 300",
    timeLimitSec: 120,
  },
  {
    slug: "reverse-string",
    title: "Mirror Words",
    difficulty: "easy",
    description: "Write `solve(s)` that returns the reversed string.",
    starter: "def solve(s):\n    pass\n",
    test: "solve('hello') == 'olleh' and solve('') == '' and solve('ab') == 'ba'",
    timeLimitSec: 120,
  },
  {
    slug: "max-of-list",
    title: "Strongest Number",
    difficulty: "easy",
    description: "Write `solve(nums)` that returns the largest number in a list.",
    starter: "def solve(nums):\n    pass\n",
    test: "solve([1,7,3]) == 7 and solve([-5,-1,-10]) == -1 and solve([42]) == 42",
    timeLimitSec: 150,
  },
  {
    slug: "is-prime",
    title: "Prime Trial",
    difficulty: "medium",
    description: "Write `solve(n)` that returns True if n is prime, else False.",
    starter: "def solve(n):\n    pass\n",
    test: "solve(2)==True and solve(7)==True and solve(1)==False and solve(9)==False and solve(13)==True",
    timeLimitSec: 240,
  },
  {
    slug: "fizz-buzz",
    title: "Fizz Buzz Duel",
    difficulty: "medium",
    description: "Write `solve(n)` returning a list of strings (1..n) — 'Fizz', 'Buzz', or 'FizzBuzz' for multiples.",
    starter: "def solve(n):\n    pass\n",
    test: "solve(5) == ['1','2','Fizz','4','Buzz'] and solve(15)[-1] == 'FizzBuzz'",
    timeLimitSec: 240,
  },
];

export function getBattleProblem(slug: string): BattleProblem | undefined {
  return battleProblems.find((p) => p.slug === slug);
}

export function randomBattleProblem(): BattleProblem {
  return battleProblems[Math.floor(Math.random() * battleProblems.length)];
}
