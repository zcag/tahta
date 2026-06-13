---
theme: slidev-theme-tahta
title: Tahta Gallery
info: Every layout and component, in one deck. Grade it across variants to see the whole system at once.
themeConfig:
  variant: editorial
mdc: true
layout: cover
kicker: Design System · Catalog
subtitle: Every layout & component in one deck — grade across variants to see the whole system.
---

# Tahta — the gallery

---
layout: section
index: "A"
kicker: Layouts
title: One per slide — pick a layout, fill fields.
---

---
layout: default
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
  - { value: 80, unit: "%", label: lower p95 latency }
  - { value: 33, unit: "%", label: cost reduction }
  - { value: 0, label: seconds of downtime }
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
  - { title: Extract, desc: pull handlers out }
  - { title: Deploy,  desc: ship to the edge }
  - { title: Shift,   desc: route gradually }
  - { title: Retire,  desc: drop the origin }
---

---
layout: quote
quote: It just feels instant now. I stopped noticing the app loading.
author: layout · quote
---

---
layout: statement
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
layout: section
index: "B"
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
layout: end
title: That's the kit
subtitle: Tokens → components → layouts → grading
contact: github.com/zcag/tahta
---
