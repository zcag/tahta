# tahta — authoring contract for agents

You are generating a Slidev deck with this theme. **Do not write CSS, `<style>`, grids, or layout HTML.** Pick a `layout` per slide and fill its frontmatter fields. The theme renders the kicker, title, footer (with auto page numbers), background, type, color, and spacing. Output a single `slides.md`.

## Global rules
1. **One idea per slide.** If a slide has >~6 lines of body text, split it.
2. **Pick the layout that matches the content shape** (table → `compare`, numbers → `stats`, a chart → `chart`, a process → `steps`, a testimonial → `quote`, an image moment → `bleed`/`image`).
3. Titles/subtitles may contain `<span class="accent2">highlight</span>` to brand a key word. Nothing else needs HTML.
4. The footer label auto-fills from the deck `title`; override per slide with `foot:` only if you want something else. **Never** add page numbers yourself.
5. Keep `value` numbers bare and put the symbol in `unit` (`value: 80, unit: "%"`).
6. For `cover`/`section`/`statement`/`end`, the title comes from frontmatter `title:` — **leave the slide body empty** (don't repeat the title as a markdown `#` heading).
7. **YAML flow-mapping gotcha:** inside `{ ... }` rows, any value with a comma or colon MUST be quoted — `before: "$4,200"`, not `before: $4,200` (the comma would split the field).

## Deck header (first slide only)
```yaml
---
theme: slidev-theme-tahta        # or a relative path to the theme
title: Shipping Faster at the Edge
# accent: rebrand by editing --accent in styles/index.css (azure by default)
transition: slide-left          # fade | slide-left | view-transition
layout: cover
kicker: Platform Engineering · 2026
subtitle: How we cut <span class="accent2">p95 latency 80%</span> by moving to the edge
---
```

## Layout reference (choose per slide)

| Layout | Use for | Key frontmatter |
|---|---|---|
| `cover` | title slide | `kicker, title, subtitle` |
| `section` | part/chapter divider | `index, kicker, title, subtitle` |
| `default` | general content (body is markdown) | `kicker, title, ghost` + markdown body |
| `statement` | one big takeaway | `kicker, title` + markdown body |
| `quote` | testimonial / pull quote | `quote, author` |
| `stats` | 2–4 hero numbers | `kicker, title, stats[], columns?` |
| `fact` | one giant figure | `kicker, value, unit?, label?` |
| `compare` | before/after table | `kicker, title, rows[], columns?` |
| `chart` | data as bars (ECharts) | `kicker, title, chart{}, note?` |
| `steps` | a process / pipeline | `kicker, title, steps[]` |
| `feature` | icon + title + blurb cells | `kicker, title, features[], columns?` |
| `two-cols` | generic split | `kicker, title` + markdown body + `::right::` |
| `image` | text + side image | `kicker, title, image, side` + markdown body |
| `bleed` | full-bleed image hero | `image, kicker, stat?, title, subtitle, duotone?` |
| `end` | closing | `title, subtitle, contact` |

`ghost:` (optional, on default/section/stats/steps/fact) prints a huge faint background glyph — pass a number or short symbol like `"03"` or `"%"`.

**Icons** — `stats[]`, `steps[]`, and `feature[]` items take an optional `icon:` ([Lucide](https://lucide.dev) name, e.g. `"lucide:zap"`), bundled offline. In a `default`/`statement` body use `<Icon name="lucide:rocket" />` directly.

**Motion** — entrance animation is automatic and themeable (each variant has its own duration/easing/transform); stats/steps/feature stagger in. It's off in print/export and under `prefers-reduced-motion`. Wrap any body element in `<Reveal :delay="120">…</Reveal>` to opt extra content in.

## Copy-paste examples

**stats** — no HTML at all:
```yaml
---
layout: stats
kicker: The numbers
title: What actually changed
ghost: "%"
stats:
  - { value: 80, unit: "%", label: lower p95 latency }
  - { value: 33, unit: "%", label: cost reduction }
  - { value: 0, label: seconds of downtime }
---
```

**compare**:
```yaml
---
layout: compare
kicker: Before vs after
title: Every metric moved the right way
rows:
  - { metric: p50 latency, before: 120ms, after: 38ms, delta: −68% }
  - { metric: p95 latency, before: 480ms, after: 95ms, delta: −80% }
  - { metric: cold start,  before: 900ms, after: 12ms, delta: −99% }
---
```

**chart**:
```yaml
---
layout: chart
kicker: Before vs after
title: Latency, drawn — not tabulated
chart:
  unit: ms
  categories: [p50 latency, p95 latency, cold start]
  series:
    - { name: Before, data: [120, 480, 900] }
    - { name: After,  data: [38, 95, 12] }
note: The 80% drop is something you <span class="accent2">see</span>.
---
```

**steps**:
```yaml
---
layout: steps
kicker: The migration
title: Incremental over six weeks — zero downtime
steps:
  - { title: Extract, desc: pull handlers out of the monolith }
  - { title: Deploy,  desc: ship them to the edge runtime }
  - { title: Shift,   desc: route traffic gradually, watch p95 }
  - { title: Retire,  desc: decommission the origin path }
---
```

**quote**:
```yaml
---
layout: quote
quote: It just feels instant now. I stopped noticing the app loading.
author: A beta user · APAC
---
```

**bleed** (image must live in the deck's `public/` folder; reference as `/name.jpg`):
```yaml
---
layout: bleed
image: /cover.jpg
duotone: true
kicker: Results · global edge
stat: "−80%"
title: p95 latency, worldwide
---
```

**default** with a markdown body (and reusable components if you want richer bits):
```markdown
---
layout: default
kicker: The problem
title: Slow for anyone far from <span class="accent2">us-east-1</span>
---

- Average round trip was 220ms
- p95 latency hit 480ms
- APAC users saw timeouts

<!-- optional components usable in any body: -->
<!-- <StatCard value="480" unit="ms" label="p95 latency" /> -->
<!-- <Stat value="80" unit="%" label="faster" /> -->
```

## Components (only needed inside `default`/`statement` bodies)
- `<Stat value unit label :accent />` — big number + label
- `<StatCard value unit label :accent />` — the same, in a card
- `<BarChart :categories :series unit height />` — if you need a chart outside the `chart` layout

## Motion (optional, live only)
Wrap body items in `<v-clicks> … </v-clicks>` to reveal them on click. Use `transition: slide-left` in the deck header. Don't overdo it.

## Minimal good deck = ~10 slides
cover → (problem: default or stats) → (chart or compare) → steps → quote → stats → (bleed hero) → end.

## New layouts — examples

**fact** — one giant figure:
```yaml
---
layout: fact
kicker: The headline number
value: "80"
unit: "%"
label: lower p95 latency, worldwide
---
```

**feature** — icon cells (icons are Lucide names):
```yaml
---
layout: feature
kicker: Why it works
title: Three reasons
features:
  - { icon: "lucide:zap", title: Fast, desc: Edge compute in 300+ locations }
  - { icon: "lucide:shield-check", title: Safe, desc: Zero-downtime migration }
  - { icon: "lucide:globe", title: Global, desc: Low p95 everywhere }
---
```

**two-cols** — split body via `::right::`:
```markdown
---
layout: two-cols
kicker: Trade-offs
title: Before vs after
---

**Before** — one region, slow tail.

::right::

**After** — 18 regions, flat p95.
```
