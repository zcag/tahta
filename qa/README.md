# qa — agent-tests-the-guide harness

The authoring contract (`packages/theme/AGENTS.md`, generated from `layouts.json`)
is the single source of truth for how agents build tahta decks — and tela serves
it **verbatim** as its MCP deck-authoring guide. So the highest-leverage question
is not "is the doc well written?" but **"what does an uninstructed agent actually
do when it reads it?"**

This harness answers that. It fires a headless `claude -p` agent at a real brief
with **no visual direction**, lets it author a `slides.md` using the installed
theme, and then grades the *decisions* (the tool stream) and the *result* (the
deck) against regression gates. The agent is the user; watching it is how you learn
what the guide lands, versus what you think you wrote.

## Run

```bash
node qa/run.mjs                  # all briefs — cheap stream + adherence path
node qa/run.mjs --brief pitch    # one brief (node qa/run.mjs --list to see them)
node qa/run.mjs --export         # also render the deck to PNG via the grade CLI
node qa/run.mjs --vision         # + adversarial LLM critique of the render (implies --export)
node qa/run.mjs --keep           # keep the workdir for inspection
```

Needs the `claude` CLI on PATH and authenticated. Each run spends tokens (it drives
a real agent), so it's a manual / scheduled check, not a per-PR gate.

## What it measures

Per brief, from the saved `run.jsonl` and the authored `slides.md`:

- **discovery** — did the agent find the theme contract (`AGENTS.md`/README) before
  authoring? A "no" is a discovery gap in how the contract is surfaced.
- **adherence** — distinct layouts used, components used, slide count, and whether
  it emitted raw `<style>`/CSS (a contract violation).
- **structure** — the theme's own `lint()` (empty slides, unclosed frontmatter,
  missing required fields) — the same validator `npx tahta-lint` and grade run.
- **(opt-in) render** — `--export` builds PNGs and reuses grade's blank/broken lint.
- **(opt-in) critique** — `--vision` has a model score the render against
  `rubric.md` and list concrete weaknesses, adversarially.

## Gates (exit non-zero on any fail)

The regression assertions, tunable via flags:

| gate | default | flag |
|---|---|---|
| authored a parseable, lint-clean `slides.md` | required | — |
| distinct layouts | ≥ 5 | `--min-layouts` |
| components composed | ≥ 1 | `--min-components` |
| no raw CSS | required | — |

These encode the two things the tela notes flagged: decks should reach for **varied
layouts** (not one preset repeated) and **at least one component** (the richness
ceiling), and should never ship a malformed/blank slide.

## The loop

A failing gate is a guide bug, not just a deck bug. Close the loop: weakness →
change `layouts.json`/the generator → `npm run docs` → re-run here → confirm the
agent's behavior shifted. ("Agent never composes a component" → strengthen the
components nudge → re-run → did it now?)

## Layout

```
qa/
  run.mjs          orchestrator (scaffold → claude -p → analyze → assert)
  lib/analyze.mjs  pure inspection: parseStream, analyzeDeck, assess
  briefs/*.txt     real talks, no visual direction, avoiding the word "deck"
  rubric.md        the adversarial critique rubric for --vision
```

Briefs deliberately avoid the word "deck" and give zero styling hints — we test
whether natural wording plus the theme name leads the agent to discover and follow
the contract on its own.
