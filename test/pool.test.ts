import { test } from "node:test";
import assert from "node:assert/strict";
import { CANDIDATES, validateEntry } from "../main.ts";

test("every candidate passes the sealed gate", () => {
  for (const c of CANDIDATES) {
    assert.equal(validateEntry(c.text), null, `rejected: ${c.text}`);
  }
});

test("gate rejects over-length text at 201 code points", () => {
  // 201 distinct code points — would a naive .length check miss a multi-byte char? No,
  // but counting must be by code points so emoji/astral chars don't over-count.
  const s = "x".repeat(200) + "y";
  assert.match(validateEntry(s) ?? "", /201 chars/);
});

test("gate counts code points, not UTF-16 units", () => {
  // One astral emoji = 2 UTF-16 units but 1 code point. 199 emojis + 1 = 200 points, valid.
  const s = "\u{1F916}".repeat(200);
  assert.equal(validateEntry(s), null);
  assert.equal(validateEntry(s + "\u{1F916}"), "entry is 201 chars (max 200)");
});

test("gate rejects whitespace-only and empty entries", () => {
  assert.ok(validateEntry(""));
  assert.ok(validateEntry("   \t  "));
});

test("gate rejects multi-line entries", () => {
  assert.match(validateEntry("two\nlines") ?? "", /line break/);
});

test("pool has no duplicate roast text", () => {
  const seen = new Set();
  for (const c of CANDIDATES) {
    assert.ok(!seen.has(c.text), `duplicate: ${c.text}`);
    seen.add(c.text);
  }
});

test("every candidate has hand ratings on all three axes", () => {
  for (const c of CANDIDATES) {
    for (const k of ["punch", "fresh", "tight"] as const) {
      assert.ok(
        Number.isInteger(c[k]) && c[k] >= 1 && c[k] <= 5,
        `bad ${k} on: ${c.text}`
      );
    }
    assert.ok(c.angle && c.angle.length > 0, `missing angle: ${c.text}`);
  }
});
