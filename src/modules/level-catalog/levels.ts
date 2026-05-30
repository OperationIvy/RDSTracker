export interface LevelDefinition {
  level: number;
  title: string;
  rating: string;
  optional?: boolean;
  diagramPath: string;
  instructions: string[];
}

const diagram = (level: number) => `/diagrams/level-${String(level).padStart(2, "0")}.png`;

export const LEVELS: LevelDefinition[] = [
  {
    level: 1,
    title: "6 balls, pocket OBs directly with no CB",
    rating: "lower novice",
    optional: true,
    diagramPath: diagram(1),
    instructions: [
      "Break a rack of 6 balls.",
      "Remove the cue ball.",
      "Pocket each object ball directly, in any order.",
      "Wipe chalk marks off the balls when done.",
    ],
  },
  {
    level: 2,
    title: "6 balls, any order, BIH on every shot",
    rating: "mid novice",
    diagramPath: diagram(2),
    instructions: [
      "Break a rack of 6 balls.",
      "Take cue ball in hand for each shot.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 3,
    title: "6 balls, any order, 3 extra BIHs",
    rating: "upper novice",
    diagramPath: diagram(3),
    instructions: [
      "Break a rack of 6 balls.",
      "Take cue ball in hand after the break and any 3 other times during the run.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 4,
    title: "6 balls, any order, 2 extra BIHs",
    rating: "lower beginner (D-)",
    diagramPath: diagram(4),
    instructions: [
      "Break a rack of 6 balls.",
      "Take cue ball in hand after the break and any 2 other times during the run.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 5,
    title: "6 balls, any order, 1 extra BIH",
    rating: "mid beginner (D)",
    diagramPath: diagram(5),
    instructions: [
      "Break a rack of 6 balls.",
      "Take cue ball in hand after the break and once any time during the run.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 6,
    title: "7 balls (3 solids, 3 stripes, 8), 8-ball rules, 1 extra BIH",
    rating: "upper beginner (D+)",
    diagramPath: diagram(6),
    instructions: [
      "Break a rack of 6 balls (3 solids, 3 stripes) with the 8 ball added (in the center or back).",
      "Play standard 8-ball rules, except take cue ball in hand after the break and once any time during the run.",
      "Pocket all the stripes or all the solids, and then the 8.",
    ],
  },
  {
    level: 7,
    title: "9 balls, any order, 1 extra BIH",
    rating: "lower intermediate (C-)",
    diagramPath: diagram(7),
    instructions: [
      "Break a rack of 9 balls.",
      "Take cue ball in hand after the break and once any time during the run.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 8,
    title: "9 balls (4 solids, 4 stripes, 8), 8-ball rules, 1 extra BIH",
    rating: "mid intermediate (C)",
    diagramPath: diagram(8),
    instructions: [
      "Break a rack of 9 balls (4 solids, 4 stripes, with the 8 ball in the center).",
      "Play standard 8-ball rules, except take cue ball in hand after the break and once any time during the run.",
      "Pocket all the stripes or all the solids, and then the 8.",
    ],
  },
  {
    level: 9,
    title: "15 balls, any order, 2 extra BIHs",
    rating: "upper intermediate (C+)",
    diagramPath: diagram(9),
    instructions: [
      "Break a rack of 15 balls.",
      "Take cue ball in hand after the break and any 2 other times during the run.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 10,
    title: "6 balls, in order",
    rating: "lower advanced (B-)",
    diagramPath: diagram(10),
    instructions: [
      "Break a rack of 6 balls.",
      "Take cue ball in hand after the break.",
      "Shoot the balls in rotation, always hitting the lowest-numbered ball first.",
    ],
  },
  {
    level: 11,
    title: "15 balls, any order",
    rating: "mid advanced (B)",
    diagramPath: diagram(11),
    instructions: [
      "Break a rack of 15 balls.",
      "Take cue ball in hand after the break.",
      "Pocket each ball in any order.",
    ],
  },
  {
    level: 12,
    title: "15 balls, 8-ball rules",
    rating: "upper advanced (B+)",
    diagramPath: diagram(12),
    instructions: [
      "Break a rack of 15 balls.",
      "Play standard 8-ball rules, except take cue ball in hand after the break.",
      "Pocket all the stripes or all the solids, and then the 8.",
    ],
  },
  {
    level: 13,
    title: "9 balls (4 solids, 4 stripes, 8), 8-ball rules, remaining balls in order",
    rating: "lower shortstop (A-)",
    diagramPath: diagram(13),
    instructions: [
      "Break a rack of 9 balls (4 solids, 4 stripes, with the 8 ball in the center).",
      "Play standard 8-ball rules, except take cue ball in hand after the break.",
      "Pocket all the stripes or all the solids, and then the 8.",
      "Then pocket the remaining balls in rotation, always hitting the lowest numbered ball first.",
    ],
  },
  {
    level: 14,
    title: "9 balls, 9-ball rules",
    rating: "upper shortstop (A)",
    diagramPath: diagram(14),
    instructions: [
      "Break a rack of 9 balls.",
      "Play standard 9-ball rules, except take cue ball in hand after the break.",
      "Shoot the balls in rotation, always hitting the lowest-numbered ball first.",
      "Pocketing the 9 at any time (even on the break) with a legal shot is a win and you get credit for all balls.",
    ],
  },
  {
    level: 15,
    title: "15 balls, 8-ball rules, remaining balls in order",
    rating: "semipro / pro (A+/AA)",
    diagramPath: diagram(15),
    instructions: [
      "Break a rack of 15 balls.",
      "Play standard 8-ball rules, except take cue ball in hand after the break.",
      "Pocket all the stripes or all the solids, and then the 8.",
      "Then pocket the remaining balls in rotation, always hitting the lowest numbered ball first.",
    ],
  },
  {
    level: 16,
    title: "15 balls, in order",
    rating: "world class pro (A++/AAA)",
    diagramPath: diagram(16),
    instructions: [
      "Break a rack of 15 balls.",
      "Take cue ball in hand after the break.",
      "Shoot the balls in rotation, always hitting the lowest-numbered ball first.",
    ],
  },
];

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 16;

export function getLevel(level: number): LevelDefinition {
  const found = LEVELS.find((entry) => entry.level === level);
  if (!found) {
    throw new RangeError(`Invalid RDS level: ${level}`);
  }
  return found;
}

export function getAllLevels(): LevelDefinition[] {
  return [...LEVELS];
}

export const GENERAL_RULES = [
  "RDS consists of 16 break-and-run challenges of increasing difficulty.",
  "In each level, start with a break shot, then take ball in hand (BIH) after the break.",
  "No penalty for a scratch on the break; balls pocketed on the break remain down (except the 8 in 8-ball racks — spot it or re-rack).",
  "A miss or scratch after the break ends a run.",
  "Run 2 of 3 racks to advance, 1 of 3 to stay, 0 of 3 in a row to drop a level.",
  "Use standard WPA rules with CB fouls only and no 3-point 9-ball break rule.",
  "In 8-ball and straight pool racks, balls must be pocketed in called pockets (slop does not count).",
  "In rotation racks, combos are fine and slop counts; you must still run remaining balls in rotation (except Level 14).",
];
