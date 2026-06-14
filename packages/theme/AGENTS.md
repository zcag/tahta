<!-- GENERATED from layouts.json + variants.json by scripts/gen-agents.mjs — do not edit by hand. -->
# tahta — authoring contract for agents

Generate a Slidev deck with `slidev-theme-tahta`. **No CSS, `<style>`, grids, or layout HTML** — pick a `layout` per slide and fill its frontmatter. The theme renders kicker, title, footer (auto page numbers), background, type, color, spacing, and motion.

## Rules
1. Pick the layout that matches the content shape; fill its frontmatter fields. Do not write CSS, grids, or layout HTML.
2. One idea per slide.
3. Titles/subtitles may contain <span class="accent2">highlight</span>. Nothing else needs HTML.
4. Footer label auto-fills from the deck title (override per slide with foot:). Never add page numbers.
5. Keep numeric values bare; put the symbol in unit (value: 80, unit: "%").
6. For cover/section/statement/end/fact, the title comes from frontmatter — leave the slide body empty.
7. Inside { ... } flow rows, quote any value containing a comma or colon (before: "$4,200").
8. ghost: (on default/section/stats/steps/fact) prints a faint giant background glyph.
9. Entrance motion is automatic, themeable per variant, and disabled in print + reduced-motion.

## Deck header (first slide)
```yaml
theme: slidev-theme-tahta
title: My Talk
themeConfig:
  # variant: editorial | brutalist | soft | minimal | paper | atelier | notebook  — Visual style; see variants.json. Defaults to editorial.
  # accent: string  — Override the brand accent (any CSS color). The whole palette (tints, shades, chart series) derives from it.
  # lang: string  — BCP-47 language tag, e.g. 'tr'. Drives correct locale casing on uppercase kickers (Turkish i→İ).
```

## Variants (themeConfig.variant)
| id | scheme | description |
|---|---|---|
| `editorial` | dark | Refined serif headlines (Fraunces), hairline rules, faint grain. The default. |
| `brutalist` | dark | Monospace (Space Mono), hard edges, blueprint grid, lime accent. |
| `soft` | light | Humanist sans (Plus Jakarta), big radius, soft shadows, coral accent. |
| `minimal` | light | Swiss — Archivo heavy, maximum whitespace, hairline rules, red accent. |
| `paper` | light | Warm editorial — rust serif on cream paper, faint grain. |
| `atelier` | dark | Cool refined dark with gradient display titles, periwinkle accent. |
| `notebook` | light | White ruled paper, navy bold sans, dashed section rules, highlighter callouts. |

Override the brand color with `themeConfig.accent`; set `themeConfig.lang` (e.g. `tr`) for correct locale casing.

## Layouts
| layout | use for | key fields |
|---|---|---|
| `cover` | Title / opening slide. | kicker, title*, subtitle |
| `section` | Part / chapter divider. | index, kicker, title*, subtitle |
| `default` | General content; body is markdown (bullets, prose). Auto fit-to-frame. | kicker, title, ghost |
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
| `two-cols` | Generic split; left = body, right = after ::right::. | kicker, title |
| `image` | Text + a side image (markdown body is the text column). | kicker, title, image*, side |
| `showcase` | Asymmetric image hero (fixed 43/57; deterministic). | kicker, title, subtitle, image*, side |
| `bleed` | Full-bleed image hero with overlaid text. | image*, kicker, stat, title, subtitle, duotone |
| `embed` | Video or iframe. | kicker, title, video, iframe |
| `end` | Closing slide. | title, subtitle, contact |

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
General content; body is markdown (bullets, prose). Auto fit-to-frame.

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
Generic split; left = body, right = after ::right::.

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

## Components
For use inside `default` / `statement` bodies.

- **`<Stat>`** — Big number + label (in default/statement bodies). props: `value`, `unit`, `label`, `size` (default xl), `icon`, `tone`, `accent` (default true)
- **`<StatCard>`** — Stat in a card. props: `(same as Stat)` (default size=md, accent=false)
- **`<Plot>`** — ECharts chart (alias: BarChart). Used by the chart layout. props: `type` (default bar), `categories`, `series`, `unit`, `height`, `horizontal` (default true)
- **`<Icon>`** — Lucide icon, bundled offline. props: `name`, `size` (default 1em)
- **`<Callout>`** — Tinted aside. props: `icon` (default lucide:info), `tone` (default accent)
- **`<Badge>`** — Inline status pill. props: `tone` (default accent)
- **`<Reveal>`** — Themeable entrance wrapper for extra body content. props: `delay` (default 0)
- **`<Fit>`** — Auto fit-to-frame: scales overflowing content down. props: —
- **`<Ghost>`** — Giant faint background glyph. props: `text`
