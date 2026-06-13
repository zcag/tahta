---
theme: slidev-theme-tahta
title: Shipping Faster at the Edge
description: Demo deck — generated almost entirely from frontmatter
themeConfig:
  variant: editorial
transition: slide-left
mdc: true
layout: cover
kicker: Platform Engineering · 2026
subtitle: How we cut <span class="accent2">p95 latency 80%</span> by moving compute to the edge.
---

---
layout: stats
kicker: The problem
title: Slow for anyone far from <span class="accent2">us-east-1</span>
ghost: "01"
columns: 3
stats:
  - { value: 220, unit: ms, label: average round trip, icon: "lucide:timer" }
  - { value: 480, unit: ms, label: p95 latency, icon: "lucide:gauge" }
  - { value: 900, unit: ms, label: cold start, icon: "lucide:snowflake" }
---

---
layout: chart
kicker: Before vs after
title: Latency, drawn — not tabulated
note: The 80% drop is something you <span class="accent2">see</span>, not something you parse.
chart:
  unit: ms
  categories: [p50 latency, p95 latency, cold start]
  series:
    - { name: Before, data: [120, 480, 900] }
    - { name: After,  data: [38, 95, 12] }
---

---
layout: compare
kicker: Results
title: Every metric moved the right way
rows:
  - { metric: p50 latency, before: 120ms, after: 38ms, delta: −68% }
  - { metric: p95 latency, before: 480ms, after: 95ms, delta: −80% }
  - { metric: cold start,  before: 900ms, after: 12ms, delta: −99% }
  - { metric: monthly cost, before: "$4,200", after: "$2,800", delta: −33% }
  - { metric: regions,     before: 1,     after: 18,    delta: 18× }
---

---
layout: steps
kicker: The migration
title: Incremental over six weeks — zero downtime
ghost: "→"
steps:
  - { title: Extract, desc: pull handlers out of the monolith, icon: "lucide:scissors" }
  - { title: Deploy,  desc: ship them to the edge runtime, icon: "lucide:rocket" }
  - { title: Shift,   desc: route traffic gradually, watch p95, icon: "lucide:route" }
  - { title: Retire,  desc: decommission the origin path, icon: "lucide:archive" }
---

---
layout: quote
quote: It just feels instant now. I stopped noticing the app loading.
author: A beta user · APAC
---

---
layout: stats
kicker: The numbers
title: What actually changed
ghost: "%"
columns: 3
stats:
  - { value: 80, unit: "%", label: lower p95 latency, icon: "lucide:trending-down" }
  - { value: 33, unit: "%", label: cost reduction, icon: "lucide:badge-dollar-sign" }
  - { value: 0, label: seconds of downtime, icon: "lucide:shield-check" }
---

---
layout: default
kicker: Lessons
title: What we'd tell our past selves
---

- Start with read-heavy, cacheable endpoints
- Invest in local dev parity early
- Watch p95 as you shift traffic
- Remember: not everything belongs at the edge

---
layout: bleed
image: /cover.jpg
duotone: true
kicker: Results · global edge
stat: "−80%"
title: p95 latency, worldwide — compute at 300+ locations.
---

---
layout: end
title: Thanks
subtitle: Questions welcome
contact: platform@example.com
---
