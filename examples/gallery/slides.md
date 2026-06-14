---
theme: slidev-theme-tahta
title: Tahta Gallery
info: Every layout and component, in one deck. Grade it across variants to see the whole system at once.
themeConfig:
  variant: editorial
mdc: true
routerMode: hash
layout: cover
bg: mesh
kicker: Design System · Catalog
subtitle: Every layout & component in one deck — grade across variants to see the whole system.
---

# Tahta — the gallery

---
layout: section
index: "A"
bg: aurora
kicker: Layouts
title: One per slide — pick a layout, fill fields.
---

---
layout: default
bg: dots
kicker: layout · default
title: Default — body is plain markdown
ghost: "·"
---

- Bullet lists get accent markers automatically
- **Bold** uses the strong color; <span class="accent2">accent2</span> highlights a word
- Inline `code` and [links](#) are themed
- Everything below the title is vertically centered

---
layout: stats
kicker: layout · stats
title: Stats — 2–4 hero numbers
stats:
  - { value: 80, unit: "%", label: lower p95 latency, icon: "lucide:trending-down" }
  - { value: 33, unit: "%", label: cost reduction, icon: "lucide:badge-dollar-sign" }
  - { value: 0, label: seconds of downtime, icon: "lucide:shield-check" }
---

---
layout: compare
kicker: layout · compare
title: Compare — before / after table
rows:
  - { metric: p50 latency, before: 120ms, after: 38ms, delta: −68% }
  - { metric: p95 latency, before: 480ms, after: 95ms, delta: −80% }
  - { metric: cold start,  before: 900ms, after: 12ms, delta: −99% }
---

---
layout: chart
kicker: layout · chart
title: Chart — data, drawn (ECharts)
chart:
  unit: ms
  categories: [p50, p95, cold start]
  series:
    - { name: Before, data: [120, 480, 900] }
    - { name: After,  data: [38, 95, 12] }
---

---
layout: steps
kicker: layout · steps
title: Steps — a process / pipeline
steps:
  - { title: Extract, desc: pull handlers out, icon: "lucide:scissors" }
  - { title: Deploy,  desc: ship to the edge, icon: "lucide:rocket" }
  - { title: Shift,   desc: route gradually, icon: "lucide:route" }
  - { title: Retire,  desc: drop the origin, icon: "lucide:archive" }
---

---
layout: fact
kicker: layout · fact
value: "80"
unit: "%"
label: A single figure with maximum prominence — the <span class="accent2">fact</span> layout.
ghost: "%"
---

---
layout: feature
kicker: layout · feature
title: Feature — icon + title + blurb cells
features:
  - { icon: "lucide:zap", title: Fast, desc: Edge compute in 300+ locations }
  - { icon: "lucide:shield-check", title: Safe, desc: Zero-downtime migration path }
  - { icon: "lucide:globe", title: Global, desc: Low p95 everywhere, not just us-east }
---

---
layout: two-cols
kicker: layout · two-cols
title: Two-cols — a generic split
---

**Left column.** Plain markdown — bullets, prose, code.

- Authored with the default slot
- Good for compare-and-contrast

::right::

**Right column.** Filled with `::right::`.

- Independent content
- Equal-width by default

---
layout: quote
quote: It just feels instant now. I stopped noticing the app loading.
author: layout · quote
---

---
layout: statement
bg: grain
kicker: layout · statement
title: Statement — one big idea, centered.
---

A line of supporting body text sits under the centered title.

---
layout: image
side: right
image: /cover.jpg
kicker: layout · image
title: Image — text + a side image
---

- A media column plus a text column
- `side: left | right` flips it
- Good for screenshots and product shots

---
layout: bleed
image: /cover.jpg
duotone: true
kicker: layout · bleed
stat: "−80%"
title: Bleed — full-bleed image with overlaid text
---

---
layout: code
kicker: layout · code
title: Code — with Magic Move
---

````md magic-move
```js
const x = await get(url)
```
```js
const x = await cache.match(url) ?? await get(url)
```
````

---
layout: timeline
kicker: layout · timeline
title: Timeline — a horizontal sequence
events:
  - { date: "Q1", title: Discover, desc: research & scope }
  - { date: "Q2", title: Build, desc: core system }
  - { date: "Q3", title: Ship, desc: public launch }
  - { date: "Q4", title: Scale, desc: multi-cloud }
---

---
layout: logos
kicker: layout · logos
title: Logos — a trust wall
logos:
  - { icon: "lucide:cloud", text: Northwind }
  - { icon: "lucide:zap", text: Voltcommerce }
  - { icon: "lucide:box", text: Crately }
  - { icon: "lucide:orbit", text: Lumen }
---

---
layout: showcase
side: right
image: /cover.jpg
kicker: layout · showcase
title: Showcase — a deliberate <span class="accent2">asymmetric</span> hero
subtitle: Fixed 43/57 split with a full-bleed image — dramatic, but it won't reflow with content.
---

---
layout: section
index: "B"
bg: grid
kicker: Components
title: Drop-in pieces for default / statement bodies
---

---
layout: default
kicker: components
title: Stat · StatCard
---

<div class="grid grid-cols-3 gap-8 items-end">
  <Stat value="99.9" unit="%" label="uptime" />
  <Stat value="4" unit="×" label="throughput" size="lg" />
  <StatCard value="38" unit="ms" label="p95 (StatCard)" accent />
</div>

---
layout: default
kicker: components
title: Callout · Badge · Icon
---

<Callout icon="lucide:info">Callouts set off an aside, with a tone-colored rule and icon.</Callout>

<div class="mt-6 text-lg" style="display:flex; flex-direction:column; gap:0.7rem">
  <div>Status pills: <Badge tone="good">shipped</Badge> · <Badge tone="warn">at risk</Badge> · <Badge tone="bad">blocked</Badge> · <Badge tone="info">planned</Badge></div>
  <div>Inline icons: <Icon name="lucide:rocket" /> <Icon name="lucide:git-branch" /> <Icon name="lucide:database" /> <Icon name="lucide:shield-check" /> — any Lucide name, bundled offline.</div>
</div>

<Callout tone="warn" icon="lucide:triangle-alert" class="mt-6">Tones: <code>good · warn · bad · info · accent</code> — shared by Callout, Badge, and per-stat <code>tone</code>.</Callout>

---
layout: default
kicker: components
title: Figure · Meter · Person · Tags
---

<div class="grid grid-cols-2 gap-12 items-start">
  <Figure src="/cover.jpg" caption="Figure — image with a caption" credit="photo" />
  <div style="display:flex; flex-direction:column; gap:1.3rem">
    <Meter value="72" label="Migration" />
    <Meter value="3" max="5" display="3 / 5" tone="warn" label="Hardening" />
    <Person name="Ada Lovelace" role="Founder & CEO" />
    <Tags :items="['TypeScript', 'Vue', 'Vite', 'OKLCH', 'ECharts']" />
  </div>
</div>

---
layout: section
index: "C"
bg: aurora
kicker: Editorial & teaching
title: Composition, rhythm, and a technical pack
---

---
layout: lead
index: "L"
kicker: layout · lead
title: Lead — an <em>asymmetric</em> opener
subtitle: Title anchored low-left, big negative space, ghost numeral. The designed alternative to cover.
---

---
layout: bigtype
kicker: layout · bigtype
title: Bigtype — one phrase, <em>edge to edge</em>.
---

---
layout: metric
kicker: layout · metric
value: "63"
unit: "%"
ghost: "%"
label: Metric — a giant number with <em>context</em> beside it.
---

---
layout: agenda
kicker: layout · agenda
title: Agenda — numbered overview
items:
  - { topic: Getting started, desc: "install, first run" }
  - { topic: Core tools, desc: "files, search, bash" }
  - { topic: Extending, desc: "MCP, hooks, skills" }
  - { topic: Shipping, desc: "commits, PRs, review" }
---

---
layout: define
kicker: layout · define
term: Define — term + definition
definition: For <span class="accent2">"What is X?"</span> moments — a big term, a clear one-liner, optional points.
points:
  - Supporting detail one
  - Supporting detail two
---

---
layout: columns
kicker: layout · columns
title: Columns — headed, side by side
columns:
  - { title: "Pros", items: ["No CSS to write", "Variant-aware", "Auto-fits"] }
  - { title: "Use for", items: ["Compare two things", "Parallel lists", "Before / after"] }
---

---
layout: panels
kicker: layout · panels
title: Panels — carded sub-topics
panels:
  - { icon: "lucide:box", title: Tokens, items: ["3-tier", "one accent"] }
  - { icon: "lucide:layout-template", title: Layouts, items: ["30 of them", "frontmatter"] }
  - { icon: "lucide:puzzle", title: Components, items: ["drop-in", "variant-aware"] }
  - { icon: "lucide:shield-check", title: Gates, items: ["token contract", "WCAG AA"] }
---

---
layout: reference
kicker: layout · reference
title: Reference — a cheatsheet
groups:
  - { title: Essentials, items: [{ term: "/help", desc: list commands }, { term: "/clear", desc: reset }] }
  - { title: Session, items: [{ term: "/resume", desc: reopen }, { term: "/cost", desc: tokens used }] }
---

---
layout: vs
kicker: layout · vs
title: Vs — A against B
left: { title: This way, items: ["Clear", "Scannable", "Designed"] }
right: { title: That way, items: ["Dense", "Walls of text", "Templated"] }
---

---
layout: code-explain
kicker: layout · code-explain
title: Code-explain — code + notes
notes:
  - "<strong>Code</strong> goes in the slide body as a fenced block."
  - "<strong>notes</strong> render as numbered points beside it."
---

```ts
export function lint(markdown: string) {
  return validate(parse(markdown))
}
```

---
layout: default
kicker: components
title: Kbd · Terminal · FileTree
---

<div style="display:flex; flex-direction:column; gap:1.1rem">
  <div><Kbd>⌘</Kbd><Kbd>K</Kbd> &nbsp; <Kbd>Ctrl-R</Kbd> &nbsp; <Kbd>Shift</Kbd> + <Kbd>Tab</Kbd></div>
  <div class="grid grid-cols-2 gap-8">
    <Terminal title="zsh" :lines="[{ cmd: 'tahta lint deck.md' }, { out: '✓ 0 errors' }]" />
    <FileTree :items="[{ name: 'theme/', dir: true, children: [{ name: 'layouts/' , dir: true }, { name: 'tokens.css' }] }]" />
  </div>
</div>

---
layout: end
title: That's the kit
subtitle: Tokens → components → layouts → grading
contact: github.com/zcag/tahta
---
