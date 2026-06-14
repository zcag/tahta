# Notes from tela — agent richness + a QA system worth stealing

> Dropped here by the tela side (the main consumer of tahta via its deck feature).
> Two things: (1) a concrete guidance change to lift agent-authored decks from
> "good" to "rich", and (2) the QA loop we use to find issues like this — worth
> rebuilding inside tahta so the theme can self-test against a real agent.
>
> Context that matters: tela serves tahta's `AGENTS.md` **verbatim** as its MCP
> deck-authoring guide (only a tiny tela preamble on top: "set `deck:true` + a
> `variant` page prop; don't put `theme:` in the markdown"). So **any wording you
> change in `AGENTS.md` lands in tela's agent flow on the next version bump, with
> zero tela changes.** tahta is the single source of truth for how agents author.
> Improvements here are the leverage point.

---

## 1. Layouts vs components — raise the ceiling without lowering the floor

### What we observed (real QA run)
We had an uninstructed agent build a 15-min teaching deck on software-architecture
principles (no visual direction). Content was excellent; layout choice tracked
content shape well (`define`, `vs`, `columns`, `panels`, `compare`). **But it used
zero components** — 100% layouts. Every slide was "pick a preset, fill its fields."

### The diagnosis
- **Layouts are the floor.** They're why agent decks stopped being flat bullets —
  the design is baked in, the agent can't misalign a grid. Keep them. Do **not**
  "move away from layouts" — that hands visual design back to the LLM, which is
  exactly where decks go wrong.
- **Components are the ceiling.** Richness/bespoke slides come from composing
  `<Stat>`, `<Callout>`, `<Badge>`, `<Plot>`, `<Terminal>`, `<Kbd>`, `<Figure>`,
  `<Person>`, `<Tags>`, etc. on a flexible layout (`default`/`statement`/`two-cols`).
  The agent currently treats layouts as a closed menu and never reaches for this
  layer → consistent but slightly "mad-libs", capped richness.

### The model to encode (a hierarchy, not "either/or")
1. **Known content shape → use the matching layout.** Definition→`define`,
   comparison→`vs`, numbers→`stats`, process→`steps`. As good as bespoke,
   guaranteed consistent. ~70% of slides.
2. **Enrich with components inside flexible layouts.** A `default`/`statement`
   slide is a canvas — add a `<Callout>` aside, an inline `<Stat>`, a `<Terminal>`,
   a `<Plot>`. Richness without losing the system.
3. **No preset fits → compose on `default` with components.** The bespoke escape
   hatch.

### Concrete change (source: `packages/theme/layouts.json` → `rules`, then `gen-agents`)
Add a rule that biases toward composition. Suggested wording:

> Layouts are your default for standard content shapes — use them, the design is
> built in. But don't force every slide into a preset: on `default`/`statement`/
> `two-cols` slides, compose components (`<Stat>`, `<Callout>`, `<Badge>`,
> `<Plot>`, `<Terminal>`, `<Kbd>`, …) to add richness, and reach for them whenever
> no layout cleanly fits. A deck that mixes designed layouts with a few composed
> slides reads richer than one that only fills templates.

Optionally reinforce it where it'll actually be seen: the per-layout notes for
`default`/`statement`/`two-cols` could each end with a nudge like *"a canvas —
compose components here"*, and the Components section intro could say *"reach for
these to enrich any slide, not just when a layout lacks a field."*

(Pacing — "≈1 slide/min, prefer fewer denser slides" — is a separate, lower-pri
idea we parked; mentioning only so it's not lost.)

---

## 2. The QA loop — let a real agent test your guide

This is the method that surfaced the above. It's transferable to tahta directly
(no tela needed): the idea is to **make an uninstructed agent the test subject**,
watch its decisions, render the result, and critique it — then fix the guide.

### The loop
1. **Fire a headless agent with a real brief and NO visual direction.** Use
   `claude -p` with stream-json in/out so every step is machine-readable:
   ```bash
   printf '%s' "{\"type\":\"user\",\"message\":{\"role\":\"user\",\"content\":<json-escaped prompt>}}" \
     | claude -p --input-format stream-json --output-format stream-json \
         --verbose --dangerously-skip-permissions \
     | tee run.jsonl
   ```
   Brief tip: phrase it as a *real* talk ("teach team X about Y", "pitch Z"), and
   **avoid the word that names your tool** — say "presentation"/"slides"/"talk",
   not "deck" — so you're testing whether the agent discovers your guide from
   natural wording, not from a magic keyword.

2. **Inspect the decision stream, not just the output.** From `run.jsonl`:
   - tool-call order — did it *find and read* the guide before authoring? did it
     lint? did it render/preview and iterate?
     `jq -rs '.[]|select(.type=="assistant")|.message.content[]?|select(.type=="tool_use")|.name'`
   - the authored markdown — which layouts/components did it actually use, and how
     many slides? (This is where "zero components" jumped out.)
     `grep -oE 'layout: [a-z-]+|<[A-Z][a-zA-Z]+' deck.md | sort | uniq -c`
   - cost/turns — `jq -rs '.[]|select(.type=="result")|...'`

3. **Render the end result and CRITIQUE it — adversarially, not as a demo.** Build
   the deck (`slidev build`/`export` to PNG) and actually look. Score it on:
   content accuracy + pedagogy, visual variety, layout-to-content fit, polish.
   **Write down concrete weaknesses** ("uses no components", "6 filler statement
   slides", "whitespace on short two-col slides"). The point is to find faults,
   not to confirm it works.

4. **Close the loop into the guide.** Each weakness → a guide/generator change →
   re-run → confirm the agent's behavior shifted. ("Agent never uses `<Callout>`"
   → strengthen the components nudge → re-run → did it now?)

### Why it works
The agent *is* your user. Reading `AGENTS.md` yourself tells you what you wrote;
watching an uninstructed agent build from it tells you what actually lands. Almost
every gap we've fixed (the rich palette being invisible, flat bullet decks, the
trigger only firing on the word "deck") came from watching the stream, not from
re-reading docs.

### For tahta specifically
A standalone harness could live in `scripts/` + a CI job: prompt `claude -p` to
author a `*.md` deck using the theme (point it at `AGENTS.md`), `slidev export` it,
and either eyeball the PNGs or run a vision model over them with a rubric. Even
without the vision step, the *stream inspection* (which layouts/components got
used, did lint pass) is a cheap, high-signal regression test for the guide — e.g.
assert that across N briefs the agent uses ≥K distinct layouts and ≥1 component.

Our reference harness (adapt freely): `tela/deck/agent-deck-test.sh`.
