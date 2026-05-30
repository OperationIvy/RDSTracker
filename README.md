# RDS Tracker

Companion web app for [Dr. Dave's Runout Drill System](https://drdavepoolinfo.com/faq/drill/rds/) (BU Exam IV).

Track 3-rack frames, apply official level-up/down rules, and persist frame- and rack-level results locally for future analytics.

## Docs

- [PRD](docs/PRD.md)
- [BU Exam IV instructions PDF](BU_Exam-IV_Runout_Drill_System.pdf)

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Project structure

```
src/modules/
  level-catalog/   Static level definitions (rules, ratings, diagram paths)
  frame-scoring/   Pure frame scoring and level adjustment logic
  session/         In-progress frame draft state helpers
  persistence/     Local storage + submit/history API
src/components/    UI shell
```

## Diagrams

Each level renders a compact SVG rack diagram (see `src/components/RackDiagram.tsx` and `src/modules/level-catalog/rack-layouts.ts`). Balls are gray unless rules require key balls (8-ball center, solid/stripe corners, 9-ball 1 and 9, etc.).

## Data

All data is stored in `localStorage` under the key `rds-tracker-data`:

- Current level
- Frame records (aggregate W-L, level before/after, timestamp)
- Rack records (per-rack win/loss linked to frame)
