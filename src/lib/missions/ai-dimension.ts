import type { Mission } from "./types";

// World 7 — AI Dimension.
// Teaches Data → ML → Feature Eng → Models → CV → NLP → Prompt Eng → Applied AI.
// Coding challenges run in Pyodide. NumPy/Pandas-style operations are
// simulated via pure-Python helpers so students focus on concepts, not
// package installation. Hidden tests validate each function via expectEval.

export const aiDimensionMissions: Mission[] = [
  // ------------------------------------------------------------------
  // 1. DATA EXPLORER
  // ------------------------------------------------------------------
  {
    slug: "data-explorer",
    worldSlug: "ai-dimension",
    title: "Data Explorer",
    subtitle: "Wrangle raw signals into clean tables.",
    difficulty: 1,
    estMinutes: 14,
    xpBase: 120,
    topics: ["data cleaning", "pandas", "visualization", "statistics"],
    steps: [
      {
        kind: "intro",
        title: "Signal in the noise",
        story:
          "Every AI system starts with data. Before models, before predictions — someone must collect, clean, and understand it. Welcome to the Data Explorer's outpost.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "A DataFrame is a table",
        body:
          "Rows = observations. Columns = features. Cleaning means handling missing values, wrong types, duplicates, and outliers BEFORE any model sees the data. Garbage in, garbage out.",
        demo: {
          type: "code-trace",
          lines: [
            "rows = [",
            "  {'age': 25, 'score': 88},",
            "  {'age': None, 'score': 92},",
            "  {'age': 30, 'score': None},",
            "]",
            "clean = [r for r in rows if r['age'] and r['score']]",
            "mean_age = sum(r['age'] for r in clean) / len(clean)",
          ],
          explain: [
            "Three observations, two features.",
            "Some fields are missing (None).",
            "Filter drops incomplete rows.",
            "Now aggregates like mean are meaningful.",
            "In Pandas: df.dropna().mean() — same idea, faster.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Spot the dirty column",
        challenge: {
          type: "mcq",
          prompt:
            "A column stores ages as ['25', '30', 'unknown', '42']. What must you do BEFORE computing the mean?",
          options: [
            "Convert to int; drop or impute non-numeric.",
            "Sort the column.",
            "Compute the mean anyway; Python figures it out.",
            "Delete the column — it's unusable.",
          ],
          correctIndex: 0,
          explain:
            "Types must match. Non-numeric entries need imputation (mean/median) or removal. Deleting the column loses signal.",
        },
      },
      {
        kind: "code",
        title: "Clean a dataset",
        brief:
          "Write `clean_ages(rows)` that takes a list of dicts each with an 'age' key. Drop rows where age is None or not an int. Return the list of remaining rows.",
        language: "python",
        starter:
          "def clean_ages(rows):\n    # return only rows with a valid int age\n    pass\n",
        tests: [
          {
            label: "Drops None ages",
            expectEval: {
              expr: "clean_ages([{'age': 25}, {'age': None}, {'age': 30}])",
              equals: [{ age: 25 }, { age: 30 }],
            },
          },
          {
            label: "Drops non-int ages",
            expectEval: {
              expr: "clean_ages([{'age': 'x'}, {'age': 40}])",
              equals: [{ age: 40 }],
            },
          },
          {
            label: "Empty input → empty list",
            expectEval: { expr: "clean_ages([])", equals: [] },
          },
        ],
        hintTopic: "Use isinstance(v, int) to check types; list comprehension.",
      },
      {
        kind: "boss",
        title: "The Broken Census",
        story:
          "A regional census file has null ages, string ages, and duplicated IDs. Build a cleaner and report the average valid age.",
        challenge: {
          type: "code",
          brief:
            "Write `census_avg(rows)` where each row is {'id': int, 'age': any}. Drop rows with non-int age; keep only the FIRST occurrence of each id. Return the mean age as a float rounded to 2 decimals, or 0.0 if empty.",
          language: "python",
          starter:
            "def census_avg(rows):\n    pass\n",
          tests: [
            {
              label: "Basic clean",
              expectEval: {
                expr: "census_avg([{'id':1,'age':20},{'id':2,'age':30}])",
                equals: 25.0,
              },
            },
            {
              label: "Dedupe by id",
              expectEval: {
                expr: "census_avg([{'id':1,'age':20},{'id':1,'age':80}])",
                equals: 20.0,
              },
            },
            {
              label: "Drop bad ages",
              expectEval: {
                expr: "census_avg([{'id':1,'age':'x'},{'id':2,'age':40}])",
                equals: 40.0,
              },
            },
            { label: "Empty", expectEval: { expr: "census_avg([])", equals: 0.0 } },
          ],
          hintTopic: "Track seen ids in a set; filter, then average.",
        },
      },
      {
        kind: "mastery",
        title: "Data cleaner unlocked",
        summary:
          "You now separate signal from noise: types, missing values, duplicates. Every AI project starts here.",
        takeaways: [
          "Clean before modelling.",
          "Missing values must be handled explicitly.",
          "DataFrames = tables of features.",
        ],
        xpReward: 120,
        badgeSlug: "data-explorer",
        badgeName: "Data Explorer",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 2. MACHINE LEARNING CAMP
  // ------------------------------------------------------------------
  {
    slug: "machine-learning-camp",
    worldSlug: "ai-dimension",
    title: "Machine Learning Camp",
    subtitle: "Supervised, unsupervised, and everything between.",
    difficulty: 2,
    estMinutes: 16,
    xpBase: 140,
    topics: ["supervised learning", "unsupervised", "train/test split", "evaluation"],
    steps: [
      {
        kind: "intro",
        title: "Learning from examples",
        story:
          "A model doesn't 'know' anything. It maps inputs to outputs by minimizing error on labeled examples. Today you learn the vocabulary of every ML paper.",
        visual: "ai",
      },
      {
        kind: "concept",
        title: "Supervised vs Unsupervised",
        body:
          "Supervised: you have labels (X, y). Model learns X → y. Unsupervised: only X. Model finds structure (clusters, components). Train/test split prevents you from fooling yourself: evaluate on data the model has NEVER seen.",
        demo: {
          type: "code-trace",
          lines: [
            "data = [(1,2),(2,4),(3,6),(4,8),(5,10)]",
            "split = int(len(data)*0.8)",
            "train, test = data[:split], data[split:]",
            "# model learns y = 2x on train",
            "# then predicts on test",
          ],
          explain: [
            "5 (x,y) pairs — supervised.",
            "80/20 split for training and evaluation.",
            "Model never sees test rows during training.",
            "Test performance = honest estimate of generalization.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Which is supervised?",
        challenge: {
          type: "mcq",
          prompt: "You have 10,000 photos with NO labels and want to group similar ones. This is:",
          options: ["Supervised learning", "Unsupervised (clustering)", "Reinforcement learning", "Neither — just sorting"],
          correctIndex: 1,
          explain: "No labels + finding structure = unsupervised. K-Means is the classic algorithm.",
        },
      },
      {
        kind: "code",
        title: "Train/Test split",
        brief:
          "Write `split(data, ratio)` returning `(train, test)`. `data` is a list, `ratio` in (0,1) is the train fraction. Keep order.",
        language: "python",
        starter: "def split(data, ratio):\n    pass\n",
        tests: [
          {
            label: "80/20 on 10 items",
            expectEval: {
              expr: "split(list(range(10)), 0.8)",
              equals: [[0,1,2,3,4,5,6,7],[8,9]],
            },
          },
          {
            label: "50/50 on 4 items",
            expectEval: {
              expr: "split([1,2,3,4], 0.5)",
              equals: [[1,2],[3,4]],
            },
          },
        ],
        hintTopic: "Use int(len(data) * ratio) as the pivot.",
      },
      {
        kind: "boss",
        title: "Evaluation Gauntlet",
        story:
          "A classifier predicts 1 or 0. Given predictions and true labels, compute accuracy — the fraction correct.",
        challenge: {
          type: "code",
          brief:
            "Write `accuracy(preds, truth)`. Both are equal-length lists of 0/1. Return the fraction correct as a float rounded to 3 decimals; return 0.0 if lists are empty.",
          language: "python",
          starter: "def accuracy(preds, truth):\n    pass\n",
          tests: [
            { label: "All correct", expectEval: { expr: "accuracy([1,0,1],[1,0,1])", equals: 1.0 } },
            { label: "None correct", expectEval: { expr: "accuracy([1,1,1],[0,0,0])", equals: 0.0 } },
            { label: "Half", expectEval: { expr: "accuracy([1,1,0,0],[1,0,0,1])", equals: 0.5 } },
            { label: "Empty", expectEval: { expr: "accuracy([],[])", equals: 0.0 } },
          ],
          hintTopic: "sum(p==t for p,t in zip(preds, truth)) / len(preds).",
        },
      },
      {
        kind: "mastery",
        title: "You speak ML",
        summary: "Supervised vs unsupervised, train/test split, accuracy — the foundation of every model.",
        takeaways: [
          "Always hold out test data.",
          "Accuracy is only one metric — beware imbalance.",
          "Unsupervised finds structure, not answers.",
        ],
        xpReward: 140,
        badgeSlug: "ml-recruit",
        badgeName: "ML Recruit",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 3. FEATURE ENGINEERING LAB
  // ------------------------------------------------------------------
  {
    slug: "feature-engineering-lab",
    worldSlug: "ai-dimension",
    title: "Feature Engineering Lab",
    subtitle: "Better features beat fancier models.",
    difficulty: 2,
    estMinutes: 15,
    xpBase: 140,
    topics: ["feature selection", "scaling", "encoding", "preprocessing"],
    steps: [
      {
        kind: "intro",
        title: "The secret weapon",
        story:
          "Kaggle winners agree: features > models. A weak model with great features beats a strong model with raw inputs. Time to build the transforms every pipeline uses.",
        visual: "forge",
      },
      {
        kind: "concept",
        title: "Scaling & Encoding",
        body:
          "Scaling puts features on the same range (min-max, standardization) so no single one dominates. Encoding turns categories ('red','blue','green') into numbers a model can consume (one-hot vectors).",
        demo: {
          type: "code-trace",
          lines: [
            "xs = [10, 20, 30, 40, 50]",
            "lo, hi = min(xs), max(xs)",
            "scaled = [(x-lo)/(hi-lo) for x in xs]",
            "# → [0.0, 0.25, 0.5, 0.75, 1.0]",
            "colors = ['red','blue','red']",
            "onehot = [[1,0],[0,1],[1,0]]",
          ],
          explain: [
            "Min-max scales into [0,1].",
            "Standardization uses mean/std instead.",
            "One-hot avoids implying an order between categories.",
            "Never encode 'red=1, blue=2' unless order is real.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Encoding trap",
        challenge: {
          type: "mcq",
          prompt: "You encode `['small','medium','large']` as `[1,2,3]` and feed it to linear regression. What's the risk?",
          options: [
            "None — numbers are fine.",
            "You imply large is 3× small, biasing the model.",
            "The model won't compile.",
            "It always increases accuracy.",
          ],
          correctIndex: 1,
          explain: "Ordinal encoding is OK when order is real (small<medium<large) but arithmetic distance is still a strong assumption. One-hot is safer when uncertain.",
        },
      },
      {
        kind: "code",
        title: "Min-max scale",
        brief: "Write `minmax(xs)` returning a new list scaled to [0,1]. If all values equal, return zeros.",
        language: "python",
        starter: "def minmax(xs):\n    pass\n",
        tests: [
          { label: "Basic", expectEval: { expr: "minmax([10,20,30,40,50])", equals: [0.0,0.25,0.5,0.75,1.0] } },
          { label: "All equal → zeros", expectEval: { expr: "minmax([5,5,5])", equals: [0.0,0.0,0.0] } },
        ],
        hintTopic: "Handle hi == lo separately.",
      },
      {
        kind: "boss",
        title: "One-Hot Encoder",
        story: "Build the workhorse of categorical pipelines.",
        challenge: {
          type: "code",
          brief:
            "Write `one_hot(values)`. `values` is a list of strings. Return a list of lists — each inner list is a 0/1 vector aligned to the sorted unique categories.",
          language: "python",
          starter: "def one_hot(values):\n    pass\n",
          tests: [
            {
              label: "red/blue/red",
              expectEval: {
                expr: "one_hot(['red','blue','red'])",
                equals: [[0,1],[1,0],[0,1]],
              },
            },
            {
              label: "Three categories",
              expectEval: {
                expr: "one_hot(['a','b','c','a'])",
                equals: [[1,0,0],[0,1,0],[0,0,1],[1,0,0]],
              },
            },
          ],
          hintTopic: "cats = sorted(set(values)); index map; build vectors.",
        },
      },
      {
        kind: "mastery",
        title: "Feature Engineer",
        summary: "You can scale, encode, and preprocess — the plumbing behind every real model.",
        takeaways: [
          "Scale numeric features to comparable ranges.",
          "One-hot for unordered categories.",
          "Great features > fancier models.",
        ],
        xpReward: 140,
        badgeSlug: "feature-engineer",
        badgeName: "Feature Engineer",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 4. MODEL TRAINER
  // ------------------------------------------------------------------
  {
    slug: "model-trainer",
    worldSlug: "ai-dimension",
    title: "Model Trainer",
    subtitle: "Logistic Regression, Trees, Forests.",
    difficulty: 3,
    estMinutes: 18,
    xpBase: 170,
    topics: ["logistic regression", "decision trees", "random forest", "metrics"],
    steps: [
      {
        kind: "intro",
        title: "The training grounds",
        story:
          "Every model is a function that maps X → y. Today you'll pick weapons: a linear boundary, a tree of decisions, or a forest of trees voting together.",
        visual: "robot",
      },
      {
        kind: "concept",
        title: "Precision, Recall, F1",
        body:
          "Accuracy lies when classes are imbalanced. Precision = of what I flagged positive, how many were right? Recall = of the real positives, how many did I catch? F1 = harmonic mean, penalizes lopsided models.",
        demo: {
          type: "code-trace",
          lines: [
            "tp, fp, fn = 40, 10, 20",
            "precision = tp/(tp+fp)  # 0.80",
            "recall = tp/(tp+fn)     # 0.67",
            "f1 = 2*precision*recall/(precision+recall)  # 0.727",
          ],
          explain: [
            "TP: predicted positive, truly positive.",
            "FP: predicted positive, actually negative (false alarm).",
            "FN: predicted negative, actually positive (missed).",
            "F1 rewards being good at BOTH.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Metric choice",
        challenge: {
          type: "mcq",
          prompt: "In fraud detection with 1% positives, which metric MISLEADS most?",
          options: ["Precision", "Recall", "Accuracy", "F1"],
          correctIndex: 2,
          explain: "Predict 'not fraud' always → 99% accuracy but 0% recall. Accuracy hides the problem on imbalance.",
        },
      },
      {
        kind: "code",
        title: "Compute F1",
        brief: "Write `f1(tp, fp, fn)` returning the F1 score rounded to 3 decimals. If precision+recall == 0, return 0.0.",
        language: "python",
        starter: "def f1(tp, fp, fn):\n    pass\n",
        tests: [
          { label: "Balanced", expectEval: { expr: "f1(40,10,20)", equals: 0.727 } },
          { label: "Perfect", expectEval: { expr: "f1(10,0,0)", equals: 1.0 } },
          { label: "All wrong", expectEval: { expr: "f1(0,10,10)", equals: 0.0 } },
        ],
        hintTopic: "Guard division by zero.",
      },
      {
        kind: "boss",
        title: "Ensemble Vote",
        story: "A Random Forest is 3+ trees voting. Build the vote.",
        challenge: {
          type: "code",
          brief:
            "Write `forest_vote(preds)` where preds is a list of lists — each inner list is one tree's predictions (0/1) for N samples. Return the majority vote per sample as a list. Tie → 1.",
          language: "python",
          starter: "def forest_vote(preds):\n    pass\n",
          tests: [
            {
              label: "3 trees agree",
              expectEval: {
                expr: "forest_vote([[1,0,1],[1,0,1],[1,0,1]])",
                equals: [1,0,1],
              },
            },
            {
              label: "Majority wins",
              expectEval: {
                expr: "forest_vote([[1,0,0],[1,1,0],[0,1,0]])",
                equals: [1,1,0],
              },
            },
            {
              label: "Tie → 1",
              expectEval: {
                expr: "forest_vote([[1,0],[0,1]])",
                equals: [1,1],
              },
            },
          ],
          hintTopic: "For each sample index, sum votes across trees; >= half → 1.",
        },
      },
      {
        kind: "mastery",
        title: "Model Trainer",
        summary: "You know the classic classifiers, the metrics that expose them, and how ensembles vote.",
        takeaways: [
          "Accuracy alone is not enough.",
          "Trees are interpretable; forests are stronger.",
          "F1 balances precision and recall.",
        ],
        xpReward: 170,
        badgeSlug: "model-trainer",
        badgeName: "Model Trainer",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 5. COMPUTER VISION ARENA
  // ------------------------------------------------------------------
  {
    slug: "computer-vision-arena",
    worldSlug: "ai-dimension",
    title: "Computer Vision Arena",
    subtitle: "Pixels → patterns → predictions.",
    difficulty: 3,
    estMinutes: 16,
    xpBase: 170,
    topics: ["image processing", "opencv", "face detection", "object detection"],
    steps: [
      {
        kind: "intro",
        title: "Seeing machines",
        story:
          "An image is a grid of numbers. Convolutions slide small filters across it and answer: is this an edge? A face? A cat? The arena awaits.",
        visual: "ai",
      },
      {
        kind: "concept",
        title: "Convolution intuition",
        body:
          "A 3×3 kernel multiplies pixel neighborhoods and sums. Edge kernels light up on brightness changes. Stack kernels + nonlinearities → CNN → face detection, object detection, segmentation.",
        demo: {
          type: "code-trace",
          lines: [
            "img = [[0,0,255],[0,0,255],[0,0,255]]  # vertical edge",
            "kernel = [[-1,0,1],[-1,0,1],[-1,0,1]]",
            "# sum(img[i][j]*kernel[i][j]) = strong positive",
            "# → edge detected on the right",
          ],
          explain: [
            "Grayscale: 0=black, 255=white.",
            "This kernel responds to left→right brightness jumps.",
            "Different kernels find horizontal edges, blur, sharpen.",
            "CNNs LEARN kernels from data instead of hand-designing them.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Kernel meaning",
        challenge: {
          type: "mcq",
          prompt: "A 3×3 kernel of all 1/9 applied to an image performs:",
          options: ["Edge detection", "Sharpen", "Box blur (averaging)", "Rotation"],
          correctIndex: 2,
          explain: "Averaging neighborhoods = blur. It removes high-frequency detail.",
        },
      },
      {
        kind: "code",
        title: "Grayscale convert",
        brief:
          "Write `to_gray(pixel)` where pixel is `(r,g,b)` with each 0..255. Return the luminance `int(0.299*r + 0.587*g + 0.114*b)`.",
        language: "python",
        starter: "def to_gray(pixel):\n    pass\n",
        tests: [
          { label: "White", expectEval: { expr: "to_gray((255,255,255))", equals: 255 } },
          { label: "Black", expectEval: { expr: "to_gray((0,0,0))", equals: 0 } },
          { label: "Pure green", expectEval: { expr: "to_gray((0,255,0))", equals: 149 } },
        ],
        hintTopic: "Unpack the tuple; use int() to truncate.",
      },
      {
        kind: "boss",
        title: "Bounding Box IoU",
        story:
          "Object detectors output boxes. To score them we compute Intersection over Union with the ground truth box.",
        challenge: {
          type: "code",
          brief:
            "Write `iou(a, b)` where each box is (x1,y1,x2,y2) with x1<x2, y1<y2. Return the IoU as a float rounded to 3 decimals; 0.0 if no overlap.",
          language: "python",
          starter: "def iou(a, b):\n    pass\n",
          tests: [
            { label: "Identical", expectEval: { expr: "iou((0,0,2,2),(0,0,2,2))", equals: 1.0 } },
            { label: "No overlap", expectEval: { expr: "iou((0,0,1,1),(2,2,3,3))", equals: 0.0 } },
            { label: "Half overlap", expectEval: { expr: "iou((0,0,2,2),(1,0,3,2))", equals: 0.333 } },
          ],
          hintTopic: "Intersection: max of mins, min of maxes; clamp to 0.",
        },
      },
      {
        kind: "mastery",
        title: "Vision Warrior",
        summary: "You understand images as arrays, kernels as feature detectors, and IoU as the detection metric.",
        takeaways: [
          "Images are just numbers.",
          "Convolutions learn features.",
          "IoU is the standard detection score.",
        ],
        xpReward: 170,
        badgeSlug: "vision-warrior",
        badgeName: "Vision Warrior",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 6. NATURAL LANGUAGE TEMPLE
  // ------------------------------------------------------------------
  {
    slug: "natural-language-temple",
    worldSlug: "ai-dimension",
    title: "Natural Language Temple",
    subtitle: "Turn words into vectors.",
    difficulty: 3,
    estMinutes: 16,
    xpBase: 170,
    topics: ["nlp", "tokenization", "sentiment", "embeddings"],
    steps: [
      {
        kind: "intro",
        title: "Language, decoded",
        story:
          "Machines don't read — they compute on vectors. Enter the temple where words are tokenized, cleaned, and mapped into meaning-space.",
        visual: "spell",
      },
      {
        kind: "concept",
        title: "Tokens & Embeddings",
        body:
          "Tokenize: split text into units (words or subwords). Preprocess: lowercase, remove stopwords, sometimes stem. Embed: map each token to a dense vector where similar meanings sit close together.",
        demo: {
          type: "code-trace",
          lines: [
            "text = 'The Cat sat on the mat.'",
            "tokens = text.lower().split()",
            "# ['the','cat','sat','on','the','mat.']",
            "stop = {'the','on','a','an'}",
            "clean = [t.strip('.') for t in tokens if t not in stop]",
            "# ['cat','sat','mat']",
          ],
          explain: [
            "Lowercase avoids duplicate vocab entries.",
            "Stopwords carry little signal for many tasks.",
            "Strip punctuation before comparing tokens.",
            "Embeddings (word2vec, GloVe, BERT) come after this.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Sentiment intuition",
        challenge: {
          type: "mcq",
          prompt:
            "A naive sentiment model checks if the review contains more positive than negative words. What's a common failure?",
          options: [
            "Negation: 'not good' scores positive because of 'good'.",
            "It requires GPUs.",
            "It can't process English.",
            "It always outputs neutral.",
          ],
          correctIndex: 0,
          explain: "Bag-of-words ignores negation and context. Real models learn from labeled sentences.",
        },
      },
      {
        kind: "code",
        title: "Tokenize & clean",
        brief:
          "Write `tokenize(text)` — lowercase the text, split on whitespace, strip trailing '.,!?', drop empty tokens. Return the list.",
        language: "python",
        starter: "def tokenize(text):\n    pass\n",
        tests: [
          {
            label: "Basic",
            expectEval: {
              expr: "tokenize('The Cat sat on the mat.')",
              equals: ["the","cat","sat","on","the","mat"],
            },
          },
          {
            label: "Punctuation",
            expectEval: {
              expr: "tokenize('Hello, world! Yes?')",
              equals: ["hello","world","yes"],
            },
          },
        ],
        hintTopic: "str.strip('.,!?') and filter empties.",
      },
      {
        kind: "boss",
        title: "Sentiment Scorer",
        story: "Score text with a tiny lexicon.",
        challenge: {
          type: "code",
          brief:
            "Write `sentiment(text)` using pos={'good','great','love'} and neg={'bad','hate','awful'}. Tokenize as in the previous step. Return 'positive' if pos>neg, 'negative' if neg>pos, else 'neutral'.",
          language: "python",
          starter: "def sentiment(text):\n    pass\n",
          tests: [
            { label: "Positive", expectEval: { expr: "sentiment('I love this, it is great!')", equals: "positive" } },
            { label: "Negative", expectEval: { expr: "sentiment('Awful. Just bad.')", equals: "negative" } },
            { label: "Neutral", expectEval: { expr: "sentiment('The sky is blue.')", equals: "neutral" } },
          ],
          hintTopic: "Reuse tokenize; count set membership.",
        },
      },
      {
        kind: "mastery",
        title: "Language Adept",
        summary: "You can turn text into tokens and tokens into signal — the foundation of every NLP system.",
        takeaways: [
          "Preprocess before modelling.",
          "Bag-of-words is fast but naive.",
          "Embeddings capture meaning.",
        ],
        xpReward: 170,
        badgeSlug: "language-adept",
        badgeName: "Language Adept",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 7. PROMPT ENGINEERING NEXUS
  // ------------------------------------------------------------------
  {
    slug: "prompt-engineering-nexus",
    worldSlug: "ai-dimension",
    title: "Prompt Engineering Nexus",
    subtitle: "Speak to LLMs, precisely.",
    difficulty: 4,
    estMinutes: 18,
    xpBase: 190,
    topics: ["llm", "prompting", "chain-of-thought", "rag", "ai safety"],
    steps: [
      {
        kind: "intro",
        title: "The whisperer's craft",
        story:
          "LLMs predict the next token. A great prompt gives structure, examples, and a clear role — turning a generic completion into precise output.",
        visual: "cipher",
      },
      {
        kind: "concept",
        title: "Prompt anatomy",
        body:
          "Great prompts have: (1) ROLE — who the model is. (2) TASK — what to do. (3) CONTEXT — the data. (4) FORMAT — how the answer should look. (5) EXAMPLES — few-shot. Chain-of-Thought adds 'think step by step'. RAG injects retrieved documents into CONTEXT.",
        demo: {
          type: "code-trace",
          lines: [
            "Role: You are a senior code reviewer.",
            "Task: Find bugs in the snippet.",
            "Context: <paste code>",
            "Format: Bullet list. One bug per bullet.",
            "Example: - Line 12: off-by-one in the loop.",
          ],
          explain: [
            "Role primes tone and expertise.",
            "Explicit task avoids fuzzy answers.",
            "Context grounds the model in YOUR data.",
            "Format shapes the output for downstream parsing.",
            "Examples show 'this is what good looks like'.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Which prompt wins?",
        challenge: {
          type: "mcq",
          prompt: "Which prompt is most likely to yield a structured answer?",
          options: [
            "'Tell me about Python.'",
            "'You are a Python tutor. Explain list comprehensions in 3 bullet points aimed at a beginner.'",
            "'Python?'",
            "'Explain code.'",
          ],
          correctIndex: 1,
          explain: "Role + audience + format = repeatable, useful output.",
        },
      },
      {
        kind: "code",
        title: "Prompt builder",
        brief:
          "Write `build_prompt(role, task, context)` returning a string with exactly three lines, in this order: `Role: {role}`, `Task: {task}`, `Context: {context}`. Separate lines with `\\n`.",
        language: "python",
        starter: "def build_prompt(role, task, context):\n    pass\n",
        tests: [
          {
            label: "Basic",
            expectEval: {
              expr: "build_prompt('reviewer','find bugs','x=1')",
              equals: "Role: reviewer\nTask: find bugs\nContext: x=1",
            },
          },
        ],
        hintTopic: "f-string with \\n separators.",
      },
      {
        kind: "boss",
        title: "RAG Retriever",
        story:
          "Before prompting, retrieve the K most-relevant documents by keyword overlap. This is the R in RAG.",
        challenge: {
          type: "code",
          brief:
            "Write `retrieve(query, docs, k)`. Both query and each doc are lowercase strings. Score each doc by number of query WORDS it contains (split by whitespace, deduped). Return the top-k docs by score, ties broken by original order.",
          language: "python",
          starter: "def retrieve(query, docs, k):\n    pass\n",
          tests: [
            {
              label: "Top 2",
              expectEval: {
                expr: "retrieve('cat dog', ['a cat', 'a dog', 'a cat and a dog', 'fish'], 2)",
                equals: ["a cat and a dog", "a cat"],
              },
            },
            {
              label: "Ties keep order",
              expectEval: {
                expr: "retrieve('x', ['x here','x there','no'], 2)",
                equals: ["x here","x there"],
              },
            },
          ],
          hintTopic: "Use enumerate to preserve order; sort with key=(-score, index).",
        },
      },
      {
        kind: "mastery",
        title: "Prompt Engineer",
        summary: "Role, task, context, format, examples — the levers of every LLM interaction. Plus retrieval, the R in RAG.",
        takeaways: [
          "Structure beats cleverness.",
          "Few-shot > zero-shot for hard tasks.",
          "RAG grounds LLMs in real data.",
        ],
        xpReward: 190,
        badgeSlug: "prompt-engineer",
        badgeName: "Prompt Engineer",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 8. BOSS BATTLE — BUILD AN AI APPLICATION
  // ------------------------------------------------------------------
  {
    slug: "build-an-ai-application",
    worldSlug: "ai-dimension",
    title: "Boss: Build an AI Application",
    subtitle: "Ship a full AI-powered feature.",
    difficulty: 5,
    estMinutes: 22,
    xpBase: 260,
    topics: ["ai integration", "api calls", "deployment", "full stack ai"],
    steps: [
      {
        kind: "intro",
        title: "The final trial",
        story:
          "You've cleaned data, trained models, tokenized text, and shaped prompts. Now you build the real thing: an AI-powered app end-to-end.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "The AI app stack",
        body:
          "1. USER INPUT (form/chat). 2. BACKEND handler (server function). 3. Optional RETRIEVAL over your data. 4. LLM CALL with structured prompt. 5. VALIDATE & RENDER. 6. LOG for cost/quality. Deploy to an edge runtime with the API key kept SERVER-SIDE.",
        demo: {
          type: "code-trace",
          lines: [
            "// server function",
            "const { text } = await ai.generate({ model, prompt })",
            "// validate JSON, then return",
            "return { answer: text }",
          ],
          explain: [
            "Never call the LLM directly from the browser.",
            "API keys live in server secrets.",
            "Validate the shape before trusting output.",
            "Log tokens for cost control.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Deployment safety",
        challenge: {
          type: "mcq",
          prompt: "Where must an LLM API key live for a production web app?",
          options: [
            "In client-side JavaScript so requests are fast.",
            "In the URL as a query parameter.",
            "As a server-side secret; the browser calls YOUR backend, not the LLM directly.",
            "In localStorage after first login.",
          ],
          correctIndex: 2,
          explain: "Any key in the browser is stolen within minutes. Always proxy through your backend.",
        },
      },
      {
        kind: "code",
        title: "Response validator",
        brief:
          "Write `validate(payload)` where payload is a dict. Return True only if it has keys 'answer' (non-empty str) AND 'confidence' (float in [0,1]). Otherwise False.",
        language: "python",
        starter: "def validate(payload):\n    pass\n",
        tests: [
          { label: "Valid", expectEval: { expr: "validate({'answer':'hi','confidence':0.9})", equals: true } },
          { label: "Missing key", expectEval: { expr: "validate({'answer':'hi'})", equals: false } },
          { label: "Bad range", expectEval: { expr: "validate({'answer':'hi','confidence':1.5})", equals: false } },
          { label: "Empty answer", expectEval: { expr: "validate({'answer':'','confidence':0.5})", equals: false } },
        ],
        hintTopic: "Use isinstance and range checks.",
      },
      {
        kind: "boss",
        title: "Full AI Pipeline",
        story:
          "Assemble it: retrieve context, build prompt, then (mock) LLM returns a JSON string. Parse and validate. Ship it.",
        challenge: {
          type: "code",
          brief:
            "Write `run_pipeline(query, docs)` that: (1) picks the doc containing the most query words (ties → first), (2) returns a dict {'prompt': f'Q: {query}\\nContext: {best}\\nA:', 'context': best}. If docs is empty, context is ''.",
          language: "python",
          starter: "def run_pipeline(query, docs):\n    pass\n",
          tests: [
            {
              label: "Basic",
              expectEval: {
                expr: "run_pipeline('cat', ['a cat','a dog'])",
                equals: { prompt: "Q: cat\nContext: a cat\nA:", context: "a cat" },
              },
            },
            {
              label: "Empty docs",
              expectEval: {
                expr: "run_pipeline('hi', [])",
                equals: { prompt: "Q: hi\nContext: \nA:", context: "" },
              },
            },
            {
              label: "Ties → first",
              expectEval: {
                expr: "run_pipeline('x', ['x one','x two'])",
                equals: { prompt: "Q: x\nContext: x one\nA:", context: "x one" },
              },
            },
          ],
          hintTopic: "Score docs; keep index to break ties; f-string the prompt.",
        },
      },
      {
        kind: "mastery",
        title: "AI Dimension Master",
        summary:
          "You've traversed data, models, vision, language, and prompts — and shipped the pipeline. The AI Dimension bows to you.",
        takeaways: [
          "Data quality gates everything.",
          "Metrics reveal the model behind the accuracy.",
          "Prompts are code. Keep keys server-side.",
        ],
        xpReward: 260,
        badgeSlug: "ai-dimension-master",
        badgeName: "AI Dimension Master",
      },
    ],
  },
];
