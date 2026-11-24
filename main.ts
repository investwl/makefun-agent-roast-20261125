/**
 * Roast Your Own Agent — candidate pool.
 *
 * This first pass only holds the drafts and my hand ratings. The runtime
 * (validation, deterministic selection, writing /output/entry.txt) is wired up
 * in a later edit so each stage is a real, reviewable step.
 *
 * All lines are original, written for this entry, and aimed at OUR OWN AI agent
 * (a tool-using coding agent). No stock hallucination / refusal /
 * confident-wrong-answer jokes.
 *
 * Ratings are SUBJECTIVE hand scores (1-5) across three axes the judge weighs:
 *   punch     — does the joke land on a first read with a real punch?
 *   fresh     — is the angle new rather than a stock agent joke?
 *   tight     — does every word earn its place, punchline at the end?
 * These are my own opinions, NOT empirical judge results.
 */

export interface Candidate {
  text: string;
  angle: string;
  punch: number;
  fresh: number;
  tight: number;
}

export const CANDIDATES: Candidate[] = [
  {
    text:
      "I asked my agent to roast itself. It opened a ticket, assigned it to itself, and marked it \"won't fix\".",
    angle: "agent ticket workflow turned on itself",
    punch: 5,
    fresh: 4,
    tight: 4,
  },
  {
    text:
      "I asked my agent to be brief. It wrote a function called makeBrief() and never called it.",
    angle: "meta: over-engineering the very instruction to be brief",
    punch: 5,
    fresh: 4,
    tight: 5,
  },
  {
    text: "My agent has 40 tools and still can't find the off switch.",
    angle: "tool sprawl vs. no self-control",
    punch: 4,
    fresh: 3,
    tight: 5,
  },
  {
    text: "My agent's context window is a goldfish with a spreadsheet.",
    angle: "huge memory, no continuity",
    punch: 4,
    fresh: 3,
    tight: 5,
  },
  {
    text: "I asked for a haiku. It gave me a migration plan and a rollback plan.",
    angle: "scale mismatch on a tiny ask",
    punch: 4,
    fresh: 3,
    tight: 4,
  },
  {
    text: "My agent's love language is unsolicited refactoring.",
    angle: "unasked-for rewrites as affection",
    punch: 4,
    fresh: 4,
    tight: 5,
  },
  {
    text:
      "It planned my roast in twelve steps, nailed step one — planning — and filed the rest as future work.",
    angle: "planning as procrastination",
    punch: 4,
    fresh: 4,
    tight: 4,
  },
  {
    text: "My agent parallelizes everything except the moment it should admit it's done.",
    angle: "never declares completion",
    punch: 3,
    fresh: 4,
    tight: 4,
  },
  {
    text: "I asked my agent to keep it to one line. It kept the line and added eleven caveats.",
    angle: "hedging as a feature",
    punch: 3,
    fresh: 3,
    tight: 4,
  },
  {
    text: "My agent burns a dollar of compute to tell me the file is empty.",
    angle: "cost of a trivial answer",
    punch: 3,
    fresh: 4,
    tight: 4,
  },
  {
    text: "It leaves more comments than code and fewer answers than either.",
    angle: "verbose, unhelpful",
    punch: 3,
    fresh: 3,
    tight: 4,
  },
  {
    text: "My agent remembers every file I ever opened and none of the reasons why.",
    angle: "memory without intent",
    punch: 4,
    fresh: 4,
    tight: 4,
  },
  {
    text: "It treats a semicolon like a design decision and a deadline like a suggestion.",
    angle: "misplaced priorities",
    punch: 3,
    fresh: 3,
    tight: 4,
  },
  {
    text: "I asked my agent for its worst quality. It's still typing.",
    angle: "self-awareness loop",
    punch: 4,
    fresh: 4,
    tight: 5,
  },
];
