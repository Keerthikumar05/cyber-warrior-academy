# Project Memory

## Core
Code Quest — gamified coding-learning platform. Dark cyberpunk neon: near-black bg, neon cyan primary, neon purple secondary, gold accents.
Fonts: Orbitron (display), Space Grotesk (body), JetBrains Mono (code). Never serif.
Guest mode allowed — Logic Land Mission 1 playable without sign-up; account prompted after first completion.
AI Mentor "Cipher" via Lovable AI Gateway (default model `google/gemini-3-flash-preview`). Defaults to hints, not full answers.
Avoid `motion.div` with `initial opacity: 0` — they don't animate after SSR hydration in this stack. Use CSS `animate-fade-in` instead.
Mission engine is data-driven via `src/lib/missions/`. New worlds plug in by adding a missions file and registering in `worlds[]`.
Python execution uses Pyodide loaded from CDN client-side; tests support expectExact, expectIncludes, expectEval.

## Memories
- (none yet)
