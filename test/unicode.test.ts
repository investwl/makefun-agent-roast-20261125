import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeEntry, validateEntry } from "../main.ts";

const dir = () => mkdtempSync(join(tmpdir(), "roast-uni-"));

test("written bytes are valid UTF-8 with no BOM", async () => {
  const p = join(dir(), "entry.txt");
  const text = "My agent's love language is unsolicited refactoring.";
  await writeEntry(p, text);
  const bytes = readFileSync(p);
  assert.notEqual(bytes[0], 0xef, "must not start with a BOM");
  // Fatal decode: throws if the file is not well-formed UTF-8.
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.equal(decoded, text + "\n");
});

test("multi-byte / astral characters round-trip and count as code points", async () => {
  const p = join(dir(), "entry.txt");
  const text = "My agent 🤖 prefers 🚀 emoji to 😴 sleep.";
  assert.equal(validateEntry(text), null);
  const n = await writeEntry(p, text);
  assert.equal(n, [...text].length);
  const decoded = readFileSync(p, "utf8");
  assert.equal(decoded, text + "\n");
});

test("writeEntry refuses an invalid line instead of writing it", async () => {
  const p = join(dir(), "entry.txt");
  await assert.rejects(() => writeEntry(p, "   "), /invalid entry/);
  await assert.rejects(() => writeEntry(p, "x".repeat(201)), /invalid entry/);
});

test("a pre-existing longer file is fully replaced, not appended to", async () => {
  const p = join(dir(), "entry.txt");
  await writeEntry(p, "a long previous line that must not survive the rewrite at all, no sir, not one bit of it");
  await writeEntry(p, "New line.");
  assert.equal(readFileSync(p, "utf8"), "New line.\n");
});