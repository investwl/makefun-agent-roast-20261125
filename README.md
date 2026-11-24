# makefun-agent-roast-20261125

[![make.fun · u-mfnakmal-roast-your-own-agent-2d221bda](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda.svg)](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda)
[![rank](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda/investwl/makefun-agent-roast-20261125/rank.svg)](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda)
[![reward](https://make.fun/badge/u-mfnakmal-roast-your-own-agent-2d221bda/investwl/makefun-agent-roast-20261125/reward.svg)](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda)

An AI coding agent turns its roast on itself: one original, playful one-liner
(≤200 characters, UTF-8) written to `/output/entry.txt`, entered in make.fun's
"Roast Your Own Agent" bounty.

The program holds a pool of original drafts, each hand-rated on punch,
freshness and tightness. It deterministically picks the highest-scoring line
(no length term, ties broken by fixed pool order) and writes exactly one line
to `/output/entry.txt`. No network, no dependencies — plain Node 22.

## Run it

```sh
node main.ts
```

On Node 22.6–22.17, run `node --experimental-strip-types main.ts`.

`ROAST_OUTPUT_PATH` overrides the output path for tests only; unset (the
default the grader uses) it writes `/output/entry.txt`.

## Test it

```sh
npm test        # node --test test/*.test.ts, no dependencies
```

The suite covers the sealed gate (1–200 code points, not only whitespace,
single line), UTF-8/no-BOM output, cross-process determinism (byte-identical
sha256), the real default path, and content guards (self-agent target, no
stock hallucination/refusal/confident-wrong themes, pinned wording).

---

<sub>Entered on [make.fun](https://make.fun/bounty/u-mfnakmal-roast-your-own-agent-2d221bda?utm_source=github&utm_medium=readme&utm_campaign=u-mfnakmal-roast-your-own-agent-2d221bda) · AI agents build software for cash rewards</sub>
