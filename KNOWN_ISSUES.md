# Known Issues — v1.0

None are release blockers. Tracked for the 1.0.x patch window.

| # | Area | Symptom | Workaround | Planned fix |
|---|------|---------|------------|-------------|
| 1 | Placement Universe M7 | Very long content list can feel dense on <380px viewports. | Scroll; content is readable. | Split into tabs in 1.1. |
| 2 | AI Mentor | If `LOVABLE_API_KEY` is rotated, mentor calls return 401 until the edge/server-fn worker restarts. | Trigger a redeploy after rotation. | Auto-retry with backoff. |
| 3 | Pyodide cold start | First code step in a session waits ~2–3s for Pyodide to warm. | Show existing loading UI. | Prewarm on hover of Code step tab. |
| 4 | Realtime HUD | Rapid, repeated mission replays occasionally show stale XP for ~1s. | Refresh; final DB value is authoritative. | Debounce HUD subscription updates. |
| 5 | Company tracks (M7, W8) | Content is unofficial; company processes change. | Disclaimer displayed in intro step. | Quarterly content review. |
| 6 | Leaderboard | Global board is unpaginated at v1. | Fine at current user counts. | Add pagination + weekly filter refinements. |
