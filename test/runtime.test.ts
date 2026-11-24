import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CANDIDATES, selectRoast, validateEntry, type Candidate } from "../main.ts";

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

test("pool retains at least the 14 original drafts", () => {
  assert.ok(CANDIDATES.length >= 14, `pool shrank to ${CANDIDATES.length}`);
});

test("selectRoast picks the top-rated candidate deterministically", () => {
  const a = selectRoast();
  const b = selectRoast();
  assert.equal(a.text, b.text, "selection must be reproducible");
  const top = Math.max(...CANDIDATES.map((c) => c.punch + c.fresh + c.tight));
  assert.equal(a.punch + a.fresh + a.tight, top);
});

test("selectRoast has no length bias in either direction", () => {
  const longStrong: Candidate = {
    text: "a long but genuinely funny line that scores the top on all three axes, padded to be clearly the longest entry in the pool",
    angle: "synthetic", punch: 5, fresh: 5, tight: 5,
  };
  const shortWeak: Candidate = {
    text: "short.", angle: "synthetic", punch: 1, fresh: 1, tight: 1,
  };
  // Long-but-strong must beat short-but-weak.
  assert.equal(selectRoast([shortWeak, longStrong]).text, longStrong.text);
  // And the reverse: short-but-strong must beat long-but-weak.
  const shortStrong: Candidate = { text: "tight.", angle: "x", punch: 5, fresh: 5, tight: 5 };
  const longWeak: Candidate = {
    text: "a very long line that says almost nothing and drags on well past the point where the joke should have landed",
    angle: "x", punch: 1, fresh: 1, tight: 1,
  };
  assert.equal(selectRoast([longWeak, shortStrong]).text, shortStrong.text);
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

test("the REAL default writes /output/entry.txt (no env override)", (t) => {
  // Earlier entries failed by writing the wrong path, so exercise the true
  // default exactly as the grader will: no ROAST_OUTPUT_PATH in the env.
  const env = { ...process.env };
  delete env.ROAST_OUTPUT_PATH;
  const target = "/output/entry.txt";
  try {
    execFileSync(process.execPath, [MAIN], { env, encoding: "utf8" });
  } catch (e: any) {
    if (e?.code === "EACCES") return t.skip("/output not writable here");
    throw e;
  }
  const out = readFileSync(target, "utf8");
  assert.equal(validateEntry(out.replace(/\n$/, "")), null);
  assert.equal(out, selectRoast().text + "\n");
});

test("two independent process runs produce byte-identical output", () => {
  const sha = (s: string) => createHash("sha256").update(s).digest("hex");
  const a = sha(runMain().out);
  const b = sha(runMain().out);
  assert.equal(a, b);
  // And it matches the in-process selection, so no hidden nondeterminism.
  assert.equal(sha(selectRoast().text + "\n"), a);
});
