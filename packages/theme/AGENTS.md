<!-- GENERATED from layouts.json + variants.json by scripts/gen-agents.mjs — do not edit by hand. -->
# tahta — authoring contract for agents

Generate a Slidev deck with `slidev-theme-tahta`. **No CSS, `<style>`, grids, or layout HTML** — pick a `layout` per slide and fill its frontmatter. The theme renders kicker, title, footer (auto page numbers), background, type, color, spacing, and motion.

## Rules
1. Pick the layout that matches the content shape; fill its frontmatter fields. Do not write CSS, grids, or layout HTML.
2. One idea per slide.
3. Titles/subtitles may contain <span class="accent2">highlight</span> (accent color) or <em>highlight</em> (italic accent — the editorial emphasis). Nothing else needs HTML.
4. For varied, designed decks vary the composition: open with lead, punctuate with bigtype, and use metric/agenda/define/columns/panels/reference/vs for teaching content — not every slide as a centered title+body.
5. Choose a variant deliberately. themeConfig.variant is required — pick the one whose 'best for' fits the talk's tone, audience, and medium (see the Variants table); never omit it to coast on a default. When you hand back the deck, tell the user which variant you chose and why, and that they can switch it — the visual direction is a shared decision.
6. Layouts are your default — the design is built in, so reach for the one that matches the content shape (definition→define, comparison→vs, numbers→stats, process→steps). But don't force every slide into a preset: default/two-cols bodies (and the space under a statement) are a canvas — compose components there (<Callout>, <Stat>, <Plot>, <Terminal>, <Kbd>, <Figure>, <Meter>, <Tags>, …) to enrich a slide, and reach for them whenever no layout cleanly fits. A deck that mixes designed layouts with a few composed slides reads richer than one that only fills templates.
7. Use components liberally AND with variety — they are the main source of richness and make each deck feel bespoke rather than templated. Map content to the component it invites: a number→<Stat>/<Meter>, a status→<Badge>, a stack/skill list→<Tags>, a person→<Person>, a command/artifact→<Terminal>/<Plot>/<Kbd>, an aside→<Callout>. Aim for a component on most content slides, and reach for several different ones across the deck — leaning on a single type (e.g. only <Callout>) still reads templated. A deck where nearly every slide carries a fitting component reads custom; one that only fills layout fields reads generic.
8. Fence every slide's frontmatter with --- above and below it (--- / layout: … / ---); the separator between two slides is just the first slide's closing --- followed by the next slide's opening ---. Most tahta slides are body-less (cover, section, statement, stats, define, steps, panels, vs, metric, end…), so between two of them you'll see the closing --- then the next opening --- — two --- lines, and that is correct. Two mistakes break a deck: (a) sharing ONE --- between two frontmatter blocks — bare layout:/title: keys right after a --- with no opening fence — which makes Slidev render those keys as body text and mis-parse the rest; (b) on a slide that HAS a markdown body, a stray --- after the body before the next slide's frontmatter ---, which doubles up into a blank slide. lint_deck / `npx tahta-lint` catch both.
9. The opening --- block is both the deck headmatter and the first slide's frontmatter — don't set the same key twice in it. A deck-level title plus the first slide's title collide (duplicate YAML key) and break slidev export; let the cover's title stand as the deck title, or start with a headmatter-only block and put the cover next.
10. Before finishing, validate the deck: run `npx tahta-lint slides.md` (ships with the theme) and fix what it reports — it catches empty slides, unclosed frontmatter, missing required fields, and bad enum values.
11. class: dropcap on a default slide sets a drop cap on the first paragraph.
12. Footer label auto-fills from the deck title (override per slide with foot:). Never add page numbers.
13. Keep numeric values bare; put the symbol in unit (value: 80, unit: "%").
14. For cover/section/statement/end/fact, the title comes from frontmatter — leave the slide body empty.
15. Inside { ... } flow rows, quote any value containing a comma or colon (before: "$4,200").
16. ghost: (on default/section/stats/steps/fact) prints a faint giant background glyph.
17. Entrance motion is automatic, themeable per variant, and disabled in print + reduced-motion.
18. Keep slides scannable, not prose: at most ~6 short bullets, written as phrases not sentences. If the idea is a structure or a flow (architecture, a pipeline, a data structure, who-calls-whom), reach for the `diagram` layout (themed Mermaid) instead of describing it in bullets; numbers→`stats`/`metric`, comparisons→`vs`/`compare`. lint_deck warns on dense slides (too many or too-long bullets, the same layout 3× in a row, an empty diagram).
19. Reveal step-by-step for teaching: wrap body items in `<v-clicks>…</v-clicks>` (each child appears on a click) or put `v-click` on one element — great for building a list, or showing a diagram then its explanation. The renderer exports one frame per click-step, so the build-up survives in tela's preview/export and in PDF. Use it for pacing a teaching moment, not on every slide.
20. Add speaker notes as an HTML comment that is the LAST block of a slide's markdown body: `<!-- what you'll say out loud -->`. It never renders on the slide; tela surfaces it as the presenter note. Author notes for any talk you'll actually present — the deck is the slides plus what you say.
21. Mark tangents with `aside: true` (or `aside: "label"`): an optional deep-dive / 'under the hood' detour gets a left accent rail + a corner tag so the audience knows it's off the main spine. Use it for the curiosity slides, not the core argument.
22. Math: write `$inline$` and `$$block$$` LaTeX in a slide BODY (default/statement/two-cols/columns markdown) — Slidev renders it with KaTeX in the variant's type. Frontmatter title/field text is injected as HTML and does NOT run KaTeX, with one exception: the `define` layout renders math in its `definition`/`points`. So for a 'term = formula' slide use `define`; for heavier math, put it in a body.
23. Sections give you wayfinding for free: when a deck has `layout: section` dividers, a thin progress rail at the top edge shows the audience which part they're in. Group a longer talk into 3–6 sections so the rail (and the deck) reads as a structured arc.

## Deck header (first slide)
```yaml
theme: slidev-theme-tahta
title: My Talk
themeConfig:
  variant: editorial   # REQUIRED — one of: editorial | brutalist | soft | minimal | paper | atelier | notebook. Choose one deliberately to fit the talk's tone/audience (see the Variants table's 'best for'). Don't omit it to coast on a default.
  # accent: string  — Override the brand accent (any CSS color). NOT reproduced exactly — only the HUE is honored; lightness/saturation adapt to the variant's envelope so the color stays legible and on-style instead of clashing. So a brand color won't render as its literal hex, but its hue carries through the whole palette (tints, shades, chart series, on-accent text).
  # lang: string  — BCP-47 language tag, e.g. 'tr'. Drives correct locale casing on uppercase kickers (Turkish i→İ).
  # logo: string  — Brand logo (path/URL). Renders prominently on openers (cover/section/lead/end) and as a small footer mark on content slides (opt out per slide with `mark: false`). Supply a logo that reads on the variant's scheme. Inert if unset.
  # logoInvert: boolean  — Invert the logo (for a monochrome mark whose color is wrong for the variant's scheme — e.g. a black mark on a dark variant). Don't use on a full-color logo.
```

## Variants (themeConfig.variant)
Pick the one whose **best for** fits the talk — this is a required, deliberate choice.

| id | scheme | best for | description |
|---|---|---|---|
| `editorial` | dark | Essays, keynotes, thought-leadership — refined and serious. The neutral fallback when unset. | Refined serif headlines (Fraunces), hairline rules, faint grain. The default. |
| `brutalist` | dark | Engineering, dev-tools, infra, technical deep-dives — raw and confident. | Monospace (Space Mono), hard edges, blueprint grid, lime accent. |
| `soft` | light | Product, consumer, onboarding, friendly pitches — warm and approachable. | Humanist sans (Plus Jakarta), big radius, soft shadows, coral accent. |
| `minimal` | light | Data, strategy, corporate, finance — Swiss restraint that lets content lead. | Swiss — Archivo heavy, maximum whitespace, hairline rules, red accent. |
| `paper` | light | Long-form, narrative, research, retrospectives — humane and unhurried. | Warm editorial — rust serif on cream paper, faint grain. |
| `atelier` | dark | Design-forward, launches, premium brand talks — polished and expressive. | Cool refined dark with gradient display titles, periwinkle accent. |
| `notebook` | light | Teaching, workshops, casual internal updates — informal and hand-made. | White ruled paper, navy bold sans, dashed section rules, highlighter callouts. |
| `lagoon` | dark | Modern company decks, product, creative — moody, premium, data-rich. | Dark teal depths with soft pastel role-colors (pink, sky, cream-yellow, sage), cream text, and rounded cards. Charts graduate through the pastels. |
| `press` | light | Essays, journalism, op-eds, design annuals — taste-forward and literary. | Stark black-and-white editorial magazine: high-contrast Fraunces serif, hairline rules, sharp corners, one editorial-red spot. |
| `boardroom` | dark | Sales, finance, board reviews, enterprise — trustworthy and data-forward. | Deep navy with one warm-orange accent and a clean sans. Conservative, credible; charts in a themed corporate palette. |
| `signal` | dark | Launches, demo-day, product reveals — high-energy and modern. | True black with one electric cyan accent and a strong glow; heavy tight sans. The one-saturated-accent recipe. |
| `muse` | light | Research, lectures, long-form, retrospectives — intellectual and unhurried. | A muted stone ground with cream cards and heavy Fraunces serif; earthy olive accent, faint grain. Restraint as luxury. |
| `poster` | light | Campaigns, sports, events, bold announcements — loud and confident. | Cream with oversized Anton condensed headlines, thick hard rules, and one hot red-orange. Athletic poster energy. |

Override the brand color with `themeConfig.accent`; set `themeConfig.lang` (e.g. `tr`) for correct locale casing.

## Universal per-slide fields
Per-slide frontmatter available on every layout.
  - `bg` (enum, optional) — Slide background. A generated (asset-free, accent-derived) background — mesh | aurora | grain | dots | grid — or an image path/URL, which is painted under an automatic contrast scrim. Opt-in; omit for the variant's default. — one of `mesh | aurora | grain | dots | grid`
  - `ghost` (string, optional) — Giant faint background glyph (on default/section/stats/steps/fact).
  - `glow` (boolean, optional) — Force the accent glow on (topic slides) or off (cover/section/statement).
  - `foot` (string, optional) — Override the auto footer label for this slide.
  - `aside` (boolean|string, optional) — Mark a slide as a tangent / optional deep-dive ('under the hood', an internals detour). Adds a left accent rail + a small corner tag, so the audience reads it as a side-thread, not the main spine. `aside: true` tags it 'deep dive'; `aside: "label"` sets the tag text. Use on topic/content slides.

## Layouts
| layout | use for | key fields |
|---|---|---|
| `cover` | Title / opening slide. | kicker, title*, subtitle |
| `section` | Part / chapter divider. | index, kicker, title*, subtitle |
| `default` | General content; body is markdown (bullets, prose). Auto fit-to-frame. A canvas — compose components in the body for richer slides. | kicker, title, ghost |
| `statement` | One big centered takeaway. | kicker, title* |
| `quote` | Testimonial / pull quote. | quote*, author |
| `stats` | 2–4 hero numbers. | kicker, title, ghost, columns, stats* |
| `fact` | One giant figure. | kicker, value*, unit, label |
| `compare` | Before/after table. | kicker, title, columns, rows* |
| `chart` | Data visualization (ECharts). | kicker, title, note, chart* |
| `steps` | A process / pipeline. | kicker, title, ghost, steps* |
| `feature` | Icon + title + blurb cells. | kicker, title, columns, features* |
| `timeline` | A horizontal dated sequence. | kicker, title, events* |
| `logos` | A trust / logo wall. | kicker, title, columns, logos* |
| `code` | Code, optionally Magic Move. Body is a fenced code block. | kicker, title |
| `two-cols` | Generic split; left = body, right = after ::right::. Each column is a canvas — compose components in either. | kicker, title |
| `image` | Text + a side image (markdown body is the text column). | kicker, title, image*, side |
| `showcase` | Asymmetric image hero (fixed 43/57; deterministic). | kicker, title, subtitle, image*, side |
| `bleed` | Full-bleed image hero with overlaid text. | image*, kicker, stat, title, subtitle, duotone |
| `embed` | Video or iframe. | kicker, title, video, iframe |
| `end` | Closing slide. | title, subtitle, contact |
| `lead` | Asymmetric opener — title anchored low-left, big negative space. A dramatic alternative to cover. | kicker, title*, subtitle, index |
| `bigtype` | Full-bleed type — one phrase fills the slide. A punctuation/transition moment; auto-fits to the frame. | kicker, title*, subtitle |
| `metric` | Asymmetric single metric — giant number on one side, context on the other (vs the centered `fact`). | value*, unit, kicker, label, ghost |
| `agenda` | Numbered module overview / table of contents. | kicker, title, items* |
| `define` | Term + definition ("What is X?"). | kicker, term*, definition, points |
| `columns` | 2–3 headed columns side by side (compare / parallel lists). | kicker, title, columns* |
| `panels` | 2–4 carded sub-topics in a grid. | kicker, title, panels* |
| `reference` | Cheatsheet — term → description pairs, optionally grouped. For commands, flags, config keys, shortcuts. | kicker, title, groups, items |
| `vs` | A-vs-B comparison — two panels with a centered divider. | kicker, title, left*, right*, label |
| `code-explain` | Code (in the slide body) + numbered explanation beside it. | kicker, title, notes* |
| `diagram` | A framed stage for a VISUAL — a Mermaid diagram (flowchart, sequence, ER, state, class, gantt), a <Figure>, or composed diagram markup in the slide body. Reach for it whenever the idea is a structure or flow (architecture, a pipeline, a data structure, who-calls-whom) — a drawn diagram beats bullets describing one. The Mermaid SVG is themed from the variant's tokens, so it reskins with the deck. | kicker, title, note, highlight |

*\* = required.*

## Layout details
### `cover`
Title / opening slide.

  - `kicker` (string, optional)
  - `title` (string, **required**) — HTML allowed (accent2 span).
  - `subtitle` (string, optional)

```yaml
---
layout: cover
kicker: Team · 2026
title: Shipping Faster
subtitle: How we cut <span class="accent2">p95 80%</span>
---
```

### `section`
Part / chapter divider.

  - `index` (string, optional) — Big faint background glyph + small accent label.
  - `kicker` (string, optional)
  - `title` (string, **required**)
  - `subtitle` (string, optional)

```yaml
---
layout: section
index: "02"
kicker: Part two
title: The migration
---
```

### `default`
General content; body is markdown (bullets, prose). Auto fit-to-frame. A canvas — compose components in the body for richer slides.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `ghost` (string, optional)

```yaml
---
layout: default
kicker: The problem
title: Slow far from <span class="accent2">us-east-1</span>
---

- Average round trip was 220ms
- p95 hit 480ms
---
```

### `statement`
One big centered takeaway.

  - `kicker` (string, optional)
  - `title` (string, **required**)

```yaml
---
layout: statement
kicker: The setup
title: Your dashboard says 42ms. Your angriest user waited 1.9s.
---
```

### `quote`
Testimonial / pull quote.

  - `quote` (string, **required**)
  - `author` (string, optional)

```yaml
---
layout: quote
quote: It just feels instant now.
author: A beta user
---
```

### `stats`
2–4 hero numbers.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `ghost` (string, optional)
  - `columns` (number, optional)
  - `stats` (array, **required**) — items: `value: string|number, unit: string?, label: string?, icon: string? (lucide:*), tone: enum? good|warn|bad|info`

```yaml
---
layout: stats
kicker: The numbers
title: What changed
stats:
  - { value: 80, unit: "%", label: lower p95, icon: "lucide:trending-down", tone: good }
  - { value: 0, label: downtime, tone: good }
---
```

### `fact`
One giant figure.

  - `kicker` (string, optional)
  - `value` (string|number, **required**)
  - `unit` (string, optional)
  - `label` (string, optional)

```yaml
---
layout: fact
kicker: The takeaway
value: "80"
unit: "%"
label: lower p95 worldwide
---
```

### `compare`
Before/after table.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `columns` (array, optional) — Header labels; default [Metric, Before, After, Δ].
  - `rows` (array, **required**) — items: `metric: string, before: string, after: string, delta: string?`

```yaml
---
layout: compare
kicker: Before vs after
title: Every metric moved
rows:
  - { metric: p95, before: 480ms, after: 95ms, delta: −80% }
---
```

### `chart`
Data visualization (ECharts).

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `note` (string, optional)
  - `chart` (object, **required**) — `type: enum bar|line|area|donut (default bar); unit: string?; categories: array; series: array of { name?, data[] }; horizontal: boolean? (bar); height: string?`

```yaml
---
layout: chart
kicker: Before vs after
title: Latency, drawn
chart:
  type: area
  unit: ms
  categories: [p50, p95, cold start]
  series:
    - { name: Before, data: [120, 480, 900] }
    - { name: After, data: [38, 95, 12] }
---
```

### `steps`
A process / pipeline.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `ghost` (string, optional)
  - `steps` (array, **required**) — items: `title: string, desc: string?, icon: string? (lucide:*)`

```yaml
---
layout: steps
kicker: The migration
title: Incremental, zero downtime
steps:
  - { title: Extract, desc: pull handlers out, icon: "lucide:scissors" }
---
```

### `feature`
Icon + title + blurb cells.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `columns` (number, optional)
  - `features` (array, **required**) — items: `icon: string? (lucide:*), title: string, desc: string?`

```yaml
---
layout: feature
kicker: Why it works
title: Three reasons
features:
  - { icon: "lucide:zap", title: Fast, desc: Edge in 300+ locations }
---
```

### `timeline`
A horizontal dated sequence.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `events` (array, **required**) — items: `date: string, title: string, desc: string?`

```yaml
---
layout: timeline
kicker: Roadmap
title: Next quarters
events:
  - { date: Q3, title: Alerts, desc: anomaly detection }
---
```

### `logos`
A trust / logo wall.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `columns` (number, optional)
  - `logos` (array, **required**) — items: `icon: string? (lucide:*), text: string`

```yaml
---
layout: logos
kicker: Trusted by
title: Teams on the edge
logos:
  - { icon: "lucide:cloud", text: Northwind }
---
```

### `code`
Code, optionally Magic Move. Body is a fenced code block.

  - `kicker` (string, optional)
  - `title` (string, optional)

```yaml
---
layout: code
kicker: How it works
title: Cache, then render
---

````md magic-move
```js
const x = await get(url)
```
```js
const x = await cache.match(url) ?? get(url)
```
````
---
```

### `two-cols`
Generic split; left = body, right = after ::right::. Each column is a canvas — compose components in either.

  - `kicker` (string, optional)
  - `title` (string, optional)

```yaml
---
layout: two-cols
title: Before vs after
---

**Before** — one region.

::right::

**After** — 18 regions.
---
```

### `image`
Text + a side image (markdown body is the text column).

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `image` (string, **required**) — Path in the deck's public/ folder, e.g. /shot.png.
  - `side` (enum, optional) — one of `left | right`

```yaml
---
layout: image
side: right
image: /shot.png
title: The product
---

- A media column plus a text column
---
```

### `showcase`
Asymmetric image hero (fixed 43/57; deterministic).

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `subtitle` (string, optional)
  - `image` (string, **required**)
  - `side` (enum, optional) — one of `left | right`

```yaml
---
layout: showcase
side: right
image: /shot.png
kicker: The product
title: Finally <span class="accent2">visible</span>
subtitle: One line of config.
---
```

### `bleed`
Full-bleed image hero with overlaid text.

  - `image` (string, **required**)
  - `kicker` (string, optional)
  - `stat` (string, optional) — A giant overlaid figure.
  - `title` (string, optional)
  - `subtitle` (string, optional)
  - `duotone` (boolean, optional) — Grayscale + accent duotone the image (default true).

```yaml
---
layout: bleed
image: /cover.jpg
duotone: true
kicker: Results
stat: "−80%"
title: p95 latency, worldwide
---
```

### `embed`
Video or iframe.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `video` (string, optional) — mp4 URL/path.
  - `iframe` (string, optional) — Embed URL (https).

```yaml
---
layout: embed
title: Demo
video: /demo.mp4
---
```

### `end`
Closing slide.

  - `title` (string, optional)
  - `subtitle` (string, optional)
  - `contact` (string, optional)

```yaml
---
layout: end
title: Thanks
subtitle: Questions welcome
contact: team@example.com
---
```

### `lead`
Asymmetric opener — title anchored low-left, big negative space. A dramatic alternative to cover.

  - `kicker` (string, optional)
  - `title` (string, **required**) — HTML allowed: <em>word</em> = italic accent emphasis; <span class="accent2">word</span> = accent color.
  - `subtitle` (string, optional)
  - `index` (string, optional) — Big faint ghost glyph in the negative space.

```yaml
---
layout: lead
index: "01"
kicker: SREcon · 2026
title: The tail that <em>wags</em> the service.
---
```

### `bigtype`
Full-bleed type — one phrase fills the slide. A punctuation/transition moment; auto-fits to the frame.

  - `kicker` (string, optional)
  - `title` (string, **required**) — HTML allowed (em / accent2).
  - `subtitle` (string, optional)

```yaml
---
layout: bigtype
kicker: The takeaway
title: Optimize the number your <em>worst</em> customer feels.
---
```

### `metric`
Asymmetric single metric — giant number on one side, context on the other (vs the centered `fact`).

  - `value` (string, **required**) — Keep the number bare; put the symbol in unit.
  - `unit` (string, optional)
  - `kicker` (string, optional)
  - `label` (string, optional) — Context line; HTML allowed.
  - `ghost` (string, optional)

```yaml
---
layout: metric
kicker: The arithmetic of scale
value: "63"
unit: "%"
label: of renders hit at least <em>one</em> p99 call.
---
```

### `agenda`
Numbered module overview / table of contents.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `items` (array, **required**) — items: `topic: string, desc: string`

```yaml
---
layout: agenda
title: What we'll cover
items:
  - { topic: Getting started, desc: "install, first run, the loop" }
  - { topic: Core tools, desc: "files, search, bash" }
---
```

### `define`
Term + definition ("What is X?").

  - `kicker` (string, optional)
  - `term` (string, **required**)
  - `definition` (string, optional) — HTML allowed (accent2 span).
  - `points` (array, optional) — Supporting bullets (string array).

```yaml
---
layout: define
kicker: The basics
term: What is Claude Code?
definition: An <span class="accent2">agentic coding assistant</span> in your terminal.
---
```

### `columns`
2–3 headed columns side by side (compare / parallel lists).

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `columns` (array, **required**) — items: `title: string, items: string[] (bullets), body: string (html, alt to items)`

```yaml
---
layout: columns
title: One tool, many surfaces
columns:
  - { title: "It can…", items: ["Read & edit files", "Run shell & tests"] }
  - { title: "Available on…", items: ["Terminal", "VS Code", "Web"] }
---
```

### `panels`
2–4 carded sub-topics in a grid.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `panels` (array, **required**) — items: `title: string, icon: string (lucide:*), items: string[], body: string (html, alt to items)`

```yaml
---
layout: panels
title: Keep the window healthy
panels:
  - { icon: "lucide:gauge", title: Watch usage, items: ["shows % used"] }
  - { icon: "lucide:archive", title: When it fills, items: ["auto-compaction"] }
---
```

### `reference`
Cheatsheet — term → description pairs, optionally grouped. For commands, flags, config keys, shortcuts.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `groups` (array, optional) — Grouped sections. Use groups OR items. — items: `title: string, items: [{ term, desc }]`
  - `items` (array, optional) — Flat list (no grouping). — items: `term: string, desc: string`

```yaml
---
layout: reference
title: Slash commands
groups:
  - { title: Essentials, items: [{ term: "/help", desc: list commands }, { term: "/clear", desc: reset }] }
---
```

### `vs`
A-vs-B comparison — two panels with a centered divider.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `left` (object, **required**) — `title: string; items: string[]`
  - `right` (object, **required**) — `title: string; items: string[]`
  - `label` (string, optional) — Divider label (default "vs").

```yaml
---
layout: vs
title: Two ways Claude remembers
left: { title: CLAUDE.md, items: ["You write it", "Versioned in git"] }
right: { title: Auto memory, items: ["Claude writes it", "Across sessions"] }
---
```

### `code-explain`
Code (in the slide body) + numbered explanation beside it.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `notes` (array, **required**) — Numbered notes shown beside the code (string array); HTML allowed (strong).

```yaml
---
layout: code-explain
title: Auto-format on edit
notes:
  - "<strong>PostToolUse</strong> fires after a tool runs."
  - "Match Edit|Write to scope to file edits."
---

```json
{ "hooks": {} }
```
---
```

### `diagram`
A framed stage for a VISUAL — a Mermaid diagram (flowchart, sequence, ER, state, class, gantt), a <Figure>, or composed diagram markup in the slide body. Reach for it whenever the idea is a structure or flow (architecture, a pipeline, a data structure, who-calls-whom) — a drawn diagram beats bullets describing one. The Mermaid SVG is themed from the variant's tokens, so it reskins with the deck.

  - `kicker` (string, optional)
  - `title` (string, optional)
  - `note` (string, optional) — Caption under the diagram; HTML allowed.
  - `highlight` (array, optional) — FLOWCHART only — a list of node ids to accent (the answer path / the subset that matters); everything else dims. Makes the point of the diagram pop instead of every node looking equal. Use the node ids from your mermaid (e.g. `flowchart TD\n Root --> M` → `highlight: [Root, M]`); keep ids underscore-free. Edges between two highlighted nodes are accented too.

```yaml
---
layout: diagram
kicker: The race
title: Two transactions, one seat
note: Without isolation, both reads see <strong>1</strong> — and both writes win.
---

```mermaid
sequenceDiagram
  participant A as Buyer A
  participant DB
  participant B as Buyer B
  A->>DB: SELECT seats → 1
  B->>DB: SELECT seats → 1
  A->>DB: UPDATE seats = 0
  B->>DB: UPDATE seats = 0
  Note over DB: 2 bookings, 1 seat
```
---
```

## Components
Compose these inside `default` / `statement` / `two-cols` bodies to enrich any slide — not only when a layout lacks a field. A composed slide is how a deck earns its bespoke, high-richness moments; reach for them rather than filling another template.

- **`<Stat>`** — Big number + label (in default/statement bodies). props: `value`, `unit`, `label`, `size` (default xl), `icon`, `tone`, `accent` (default true)
  `<Stat value="80" unit="%" label="lower p95" tone="good" icon="lucide:trending-down" />`
- **`<StatCard>`** — Stat in a card. props: `(same as Stat)` (default size=md, accent=false)
  `<StatCard value="38" unit="ms" label="p95 (after)" accent />`
- **`<Plot>`** — ECharts chart (alias: BarChart). Used by the chart layout. props: `type` (default bar), `categories`, `series`, `unit`, `height`, `horizontal` (default true)
  `<Plot type="line" :categories="['Q1','Q2','Q3']" :series="[{name:'ARR',data:[40,95,180]}]" unit="k" />`
- **`<Icon>`** — Lucide icon, bundled offline. props: `name`, `size` (default 1em)
  `<Icon name="lucide:rocket" />`
- **`<Callout>`** — Tinted aside. props: `icon` (default lucide:info), `tone` (default accent)
  `<Callout tone="warn" icon="lucide:triangle-alert">Heads up: this is the one risk.</Callout>`
- **`<Badge>`** — Inline status pill. props: `tone` (default accent)
  `shipped <Badge tone="good">done</Badge> · <Badge tone="warn">at risk</Badge>`
- **`<Reveal>`** — Themeable entrance wrapper for extra body content. props: `delay` (default 0)
  `<Reveal :delay="120">appears second</Reveal>`
- **`<Fit>`** — Auto fit-to-frame: scales overflowing content down. props: —
  `<Fit>long body content that should never overflow</Fit>`
- **`<Ghost>`** — Giant faint background glyph. props: `text`
  `<Ghost text="03" />`
- **`<Kbd>`** — Keycap for keyboard shortcuts. props: —
  `<Kbd>⌘</Kbd><Kbd>K</Kbd> · <Kbd>Ctrl-R</Kbd>`
- **`<Terminal>`** — Shell-session window (prompt + output). props: `lines` (default []), `title`
  `<Terminal title="zsh" :lines="[{cmd:'claude --version'},{out:'2.0.1'}]" />`
- **`<FileTree>`** — Project / config tree with guides. props: `items`
  `<FileTree :items="[{name:'src', children:[{name:'main.ts'}]}, {name:'README.md'}]" />`
- **`<Figure>`** — Image (or slotted diagram) with caption + optional credit. props: `src`, `alt`, `caption`, `credit`
  `<Figure src="/dashboard.png" caption="The tail, finally visible" credit="v2 UI" />`
- **`<Meter>`** — Labeled progress / percentage bar. props: `value`, `max` (default 100), `label`, `display`, `tone`
  `<Meter value="72" label="Migration" /> · <Meter value="3" max="5" display="3 / 5" tone="warn" label="Hardening" />`
- **`<Person>`** — Avatar + name + role (bios, team, attribution). Falls back to initials with no photo. props: `name`, `role`, `photo`
  `<Person name="Ada Lovelace" role="Founder & CEO" photo="/ada.jpg" />`
- **`<Tags>`** — Row of keyword chips (tech stack, topics, skills). props: `items`
  `<Tags :items="['TypeScript', 'Vue', 'Vite', 'OKLCH']" />`
- **`<Grid>`** — Cell grid for the visuals Mermaid draws badly — memory/byte layouts, row-store vs column-store, a matrix, a small schema. `data` is a 2D array of cells (HTML allowed); `head` makes the first row a header; `highlight` accents a row/col/cell to make a point. props: `data`, `head` (default false), `highlight`
  `<Grid :data="[['id','name','age'],['1','Ada','36'],['2','Lin','29']]" head highlight="col:2" />`
