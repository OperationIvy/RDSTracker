# PRD: RDS Tracker — Runout Drill System Companion App

## Problem Statement

Players practicing Dr. Dave's Runout Drill System (RDS, BU Exam IV) need to track three-rack frames, apply level-up/down rules correctly, and remember their current level between sessions. Paper score sheets work but are easy to mis-score, don't enforce the 2-of-3 / 0-of-3 rules automatically, and don't preserve structured history for later analysis. An existing iOS app covers some of this, but there is no simple, purpose-built tracker aligned with how the progressive/adaptive RDS format is actually played.

## Solution

A simple web companion app that shows the current RDS level (diagram + level-specific rules), lets the player mark each of three racks as a win or loss via an intuitive grid, submits the frame when complete, automatically adjusts level per official rules, persists frame- and rack-level results locally, and restores the player's level on return.

## User Stories

### Core practice flow

1. As a pool player, I want to see my current RDS level prominently, so that I know which drill setup to run.
2. As a pool player, I want to see the diagram for my current level, so that I know how to rack the balls.
3. As a pool player, I want to see the rules and instructions specific to my current level, so that I don't have to reference the PDF mid-session.
4. As a pool player, I want a grid with columns for racks 1, 2, and 3 and rows for Win and Loss, so that I can quickly record each rack outcome.
5. As a pool player, I want tapping Win or Loss for a rack to mark that outcome with a green check or red X, so that results are visually obvious at a glance.
6. As a pool player, I want only one outcome selectable per rack (Win or Loss), so that each rack has an unambiguous result.
7. As a pool player, I want selecting the opposite outcome for a rack to replace the previous selection, so that I can correct mistakes before submitting.
8. As a pool player, I want the Submit button hidden until all three racks have a result, so that I can't accidentally submit an incomplete frame.
9. As a pool player, I want to press Submit after completing three racks, so that the frame is recorded and my level is updated automatically.
10. As a pool player, I want the win/loss grid cleared after submission, so that I'm ready to start the next frame immediately.

### Level progression (official RDS rules)

11. As a pool player, I want the app to advance me one level when I run 2 of 3 racks at my current level, so that progression matches BU Exam IV rules.
12. As a pool player, I want the app to keep me at my current level when I run exactly 1 of 3 racks, so that progression matches BU Exam IV rules.
13. As a pool player, I want the app to drop me one level when I miss all 3 racks (0 of 3), so that progression matches BU Exam IV rules.
14. As a pool player, I want level changes capped at level 16 (no higher) and level 1 (no lower), so that bounds match the RDS system.
15. As a pool player, I want the updated level and its diagram/rules shown immediately after submission, so that I can continue practicing without interruption.

### Session continuity

16. As a returning player, I want the app to remember my current level from my last session, so that I can start where I left off per RDS guidance.
17. As a first-time user, I want to pick a starting level I'm confident I can run 2 of 3 at, so that I follow RDS first-time guidance.
18. As a returning player, I want to change my current level manually if needed, so that I can recover from an incorrect starting level or long break.

### Data and history

19. As a pool player, I want each submitted frame stored with its aggregate result (e.g. 2-1, 0-3, 3-0), so that I have a session-level record.
20. As a pool player, I want each individual rack result stored (level, rack number, win/loss), so that fine-grained analytics are possible later.
21. As a pool player, I want each frame record to include the level before and after submission, so that I can trace progression over time.
22. As a pool player, I want each record timestamped, so that I can analyze practice frequency and trends by date.
23. As a pool player, I want my data stored locally on my device, so that I can practice at the table without network access.

### Level content

24. As a pool player, I want all 16 RDS levels available with accurate rules text, so that the app covers novice through world-class drills.
25. As a pool player, I want each level to show its associated skill rating label (e.g. "mid intermediate (C)"), so that I understand what my level means.
26. As a pool player, I want Level 1 marked as optional in the UI, so that I'm not confused about whether it's required.

### UX and simplicity

27. As a pool player, I want the interface minimal with no clutter, so that I can use it quickly between racks.
28. As a pool player, I want the app usable on a phone at the table (tap targets, readable text), so that I don't need a laptop.
29. As a pool player, I want clear visual feedback when I tap a cell (check/X appears immediately), so that I trust my input was registered.
30. As a pool player, I want to see my frame tally before submitting (e.g. "2 wins, 1 loss"), so that I can confirm before the level changes.

### Edge cases and corrections

31. As a pool player, I want to change a rack result before submitting, so that I can fix input errors.
32. As a pool player, I want confirmation or a brief summary on submit showing level change (e.g. "Level 7 → Level 8"), so that I understand what happened.
33. As a pool player, I want the app to handle being at level 16 with 2/3 wins gracefully (stay at 16), so that top-level players aren't broken.
34. As a pool player, I want the app to handle being at level 1 with 0/3 losses gracefully (stay at 1), so that beginners aren't broken.
35. As a pool player, I want to clear a rack selection before submitting by tapping the active cell again, so that I can undo a mistaken tap — and the Submit button should hide again until all three racks have a value.

### Future-ready (data model only in v1)

36. As a pool player, I want rack-level data stored in a queryable structure, so that future win-rate charts and analytics can be built without migration pain.
37. As a pool player, I want frame-level aggregates precomputed at write time, so that future dashboards load quickly.

## Implementation Decisions

### Scope: progressive/adaptive RDS only

This app tracks the **standard progressive RDS format** (3 racks per level, level up/down rules). **RDS 100** (scored one-rack-per-level format) is out of scope for v1.

### Platform

Responsive **web app** (Vite + React + TypeScript). Local persistence via IndexedDB. No backend, auth, or sync in v1.

### Modules

| Module | Responsibility |
|--------|----------------|
| **Level catalog** | Static definitions for levels 1–16: title, rating label, rules/instructions text, diagram asset reference |
| **Frame scoring engine** | Pure logic: given 3 rack results + current level → frame aggregate, level delta, new level |
| **Session state** | Current level, in-progress rack selections (nullable × 3), derived can-submit flag |
| **Persistence** | Read/write current level; append frame + rack records |
| **UI shell** | Level header, diagram, rules panel, 3×2 scoring grid, conditional submit, post-submit feedback |

**FrameOutcome shape:**

```
{
  wins: number          // 0–3
  losses: number        // 0–3
  aggregate: string     // e.g. "2-1"
  levelBefore: number
  levelAfter: number
  levelChange: -1 | 0 | 1
}
```

**Scoring rules (canonical):**

- 2 or 3 wins → level +1 (clamp at 16)
- Exactly 1 win → stay
- 0 wins → level −1 (clamp at 1)

### Data schema

**Settings (singleton):** `currentLevel: number` (1–16)

**Frames:** `id`, `timestamp`, `levelBefore`, `levelAfter`, `wins`, `losses`, `aggregate`

**Racks:** `id`, `frameId`, `rackNumber` (1|2|3), `level`, `result` (win|loss), `timestamp`

### UI layout

Single main screen: level header + diagram + rules, 3-column win/loss grid (green check / red X), frame tally, Submit (visible only when all 3 racks have a value). Tapping the active cell clears that rack and hides Submit until all three are filled again.

### Level content source

Level metadata and diagram assets from [BU Exam IV Runout Drill System PDF](https://billiarduniversity.org/documents/BU_Exam-IV_Runout_Drill_System.pdf). Diagram images bundled under `public/diagrams/`.

## Testing Decisions

Test external behavior and pure logic, not UI implementation details.

| Module | Priority | Examples |
|--------|----------|----------|
| Frame scoring engine | High | 3-0, 2-1, 1-2, 0-3 at levels 1, 7, 16; boundary clamping |
| Persistence | High | Submit writes 1 frame + 3 racks; currentLevel updates |
| Session state | Medium | Win↔Loss toggle, clear rack, canSubmit gating |
| Level catalog | Medium | 16 levels, required fields present |

## Out of Scope (v1)

- Win-rate charts, graphs, and analytics dashboards
- RDS 100 scored format
- Multi-user / accounts / cloud sync
- Session timers, practice duration tracking
- Export/import (CSV)
- Social sharing or leaderboards

## Further Notes

Global RDS rules (WPA, CB fouls only, break scratch rules, call-pocket vs rotation) should appear in a collapsible "General rules" section. Reference: [Dr. Dave RDS FAQ](https://drdavepoolinfo.com/faq/drill/rds/).
