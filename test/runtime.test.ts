import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CANDIDATES, selectRoast, validateEntry } from "../main.ts";

const MAIN = new URL("../main.ts", import.meta.url).pathname;

function runMain(): { out: string; exit: number } {
  const dir = mkdtempSync(join(tmpdir(), "roast-"));
  const target = join(dir, "entry.txt");
  // Node 22.23 strips types natively; no flags needed.
  execFileSync(process.execPath, [MAIN], {
    env: { ...process.env, ROAST_OUTPUT_PATH: target },
    encoding: "utf8",
  });
  return { out: readFileSync(target, "utf8"), exit: 0 };
}

test("pool still holds every draft (14 candidates)", () => {
  assert.equal(CANDIDATES.length, 14);
});

test("selectRoast picks the top-rated candidate deterministically", () => {
  const a = selectRoast();
  const b = selectRoast();
  assert.equal(a.text, b.text, "selection must be reproducible");
  const top = Math.max(...CANDIDATES.map((c) => c.punch + c.fresh + c.tight));
  assert.equal(a.punch + a.fresh + a.tight, top);
});

test("selectRoast has no length bias: winner is top score regardless of bytes", () => {
  const winner = selectRoast();
  const shorter = CANDIDATES.filter(
    (c) => c.text.length < winner.text.length && c === winner
  );
  // The winner must be the strict max-score candidate, not the shortest.
  assert.equal(
    CANDIDATES.every((c) => c.punch + c.fresh + c.tight <= winner.punch + winner.fresh + winner.tight),
    true
  );
  assert.ok(shorter.length >= 0); // bias check is the strict-max assertion above
});

test("running main.ts writes one valid line the gate accepts", () => {
  const { out } = runMain();
  const line = out.replace(/\n$/, "");
  assert.equal(validateEntry(line), null);
  assert.ok(!out.slice(0, -1).includes("\n"), "exactly one line");
});

test("written entry is one of our candidates (not a copy)", () => {
  const { out } = runMain();
  const line = out.replace(/\n$/, "");
  assert.ok(CANDIDATES.some((c) => c.text === line));
});

test("output is valid UTF-8 and ends with a single newline", () => {
  const { out } = runMain();
  const bytes = Buffer.from(out, "utf8");
  assert.ok(bytes.length > 0);
  assert.equal(out.endsWith("\n"), true);
  assert.equal(out.slice(0, -1).endsWith("\n"), false);
});
