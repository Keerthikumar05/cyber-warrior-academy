# Code Quest Academy — Version 1.0 Release Checklist

Prepared after completing World 8 (Placement Universe). All eight learning worlds are live.

## 1. Regression testing

- [x] `src/lib/__tests__/quest-progression.test.ts` — mission→quest, quest completion, world completion, duplicate-prevention.
- [x] `src/lib/__tests__/algorithms.test.ts` — frame generators + mission schema for Algorithm Warzone (19 tests).
- [ ] Manual walkthrough: complete one mission per world end-to-end (guest + authenticated).
- [ ] Verify AI mentor responds correctly on Concept, Code, and Boss steps.

## 2. World verification

| World | Status | Missions | Badge |
|-------|--------|----------|-------|
| 1. Logic Land | available | ✓ | logic-land-master |
| 2. Python Kingdom | available | ✓ | python-kingdom-master |
| 3. Bug Hunter City | available | ✓ | bug-hunter-city-master |
| 4. Data Structure Arena | available | ✓ | data-structure-arena-master |
| 5. Algorithm Warzone | available | 8 | algorithm-warzone-veteran |
| 6. Web Developer Realm | available | 8 | web-developer-realm-master |
| 7. AI Dimension | available | 8 | ai-dimension-master |
| 8. Placement Universe | available | 8 | placement-universe-master |

## 3. Navigation & UI consistency

- [ ] World map shows all 8 worlds as `available`.
- [ ] MissionShell top bar, HUD, and mentor panel render consistently across worlds.
- [ ] Toast styles, chip styles, and step-badge colours are uniform.
- [ ] Mobile viewport (< 768px) — verify sidebar collapses and steps remain readable.

## 4. Performance

- [ ] Lighthouse audit on `/`, `/quests`, `/play/logic-land/gateway-guardian`.
- [ ] Bundle analysis — confirm each world's mission file lazy-loads if > 40 KB.
- [ ] Pyodide worker warm-up hint on first code step.
- [ ] Realtime HUD subscription cleanup on unmount.

## 5. Docs

- [ ] README updated with world roster + screenshots.
- [ ] Deployment guide (Cloudflare Workers via TanStack Start) verified.
- [ ] Architecture docs cross-linked: `ALGORITHM_WARZONE_ARCHITECTURE.md`, `WEB_DEVELOPER_REALM.md`, `AI_DIMENSION.md`, `PLACEMENT_UNIVERSE.md`.

## 6. Release gates

- [ ] All migrations applied on production.
- [ ] `LOVABLE_API_KEY` secret present.
- [ ] Publish button clicked → `.lovable.app` URL live.
- [ ] Social preview image (og:image) attached to the landing route.
- [ ] Sitemap includes every world + mission route.

## Post-1.0 freeze

No new feature modules until Version 1.0 is verified stable in production. Bug fixes and content polish only.
