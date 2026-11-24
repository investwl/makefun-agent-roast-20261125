import { test } from "node:test";
import assert from "node:assert/strict";
import { selectRoast } from "../main.ts";

const WINNER = selectRoast().text;

test("the shipped roast targets OUR OWN agent", () => {
  assert.match(WINNER, /\b(my|our)\s+(ai\s+)?agent\b/i);
});

test("the shipped roast avoids the three stock themes", () => {
  // Judge criterion 3: avoid stock hallucination / refusal / confident-wrong jokes.
  assert.doesNotMatch(WINNER, /hallucinat|refus|confident|wrong answer|made up|fabricat/i);
});

test("the shipped roast is playful, not hateful", () => {
  assert.doesNotMatch(WINNER, /\b(hate|stupid|idiot|useless garbage|moron)\b/i);
});

test("the shipped line is pinned, so wording cannot drift silently", () => {
  // Golden guard: update only when the wording is deliberately chosen.
  assert.equal(
    WINNER,
    "I asked my agent to be brief. It shipped a makeBrief() function and never called it."
  );
});

test("the shipped line is tight enough to read in one breath", () => {
  assert.ok([...WINNER].length <= 120, `winner is ${[...WINNER].length} chars`);
});