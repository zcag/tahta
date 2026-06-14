---
theme: slidev-theme-tahta
title: Parity
info: Seed pitch — drop-in observability for edge functions.
themeConfig:
  variant: minimal
  accent: "#3b5bff"
transition: slide-left
mdc: true
routerMode: hash
layout: cover
kicker: Seed round · 2026
subtitle: Drop-in observability for edge functions — see the <span class="accent2">tail</span>, not just the average.
---

# Parity

---
layout: statement
kicker: The problem
title: Edge functions run in 300 places. Your traces stop at <span class="accent2">one</span>.
---

Teams ship to the edge for speed, then fly blind on the 1% of requests that actually churn users.

---
layout: stats
kicker: Why now
title: The edge went mainstream — tooling didn't
ghost: "01"
stats:
  - { value: 4.1, unit: "M", label: developers shipping to edge runtimes, icon: "lucide:users" }
  - { value: 68, unit: "%", label: say tail latency is their #1 blind spot, icon: "lucide:eye-off" }
  - { value: 0, label: edge-native APM tools at launch, icon: "lucide:radar" }
---

---
layout: feature
kicker: The product
title: Three things, one install
features:
  - { icon: "lucide:activity", title: Per-call tracing, desc: every edge invocation, p50→p99.9, no sampling }
  - { icon: "lucide:git-merge", title: Page-level rollups, desc: see how 50 calls add up to one slow render }
  - { icon: "lucide:bell-ring", title: Tail alerts, desc: page when p99 moves, not when the mean does }
---

---
layout: chart
kicker: Where the budget goes
title: A slow page is rarely one slow thing
chart:
  type: donut
  unit: "ms"
  categories: ["cold start", "network", "compute", "cache miss", "serialization"]
  series:
    - { data: [310, 220, 140, 90, 60] }
---

---
layout: chart
kicker: Traction
title: Revenue, last six quarters
note: <span class="accent2">$840k</span> ARR, up 4.2× year over year.
chart:
  type: area
  unit: "k"
  categories: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"]
  series:
    - { name: ARR ($k), data: [40, 95, 180, 330, 560, 840] }
---

---
layout: timeline
kicker: Roadmap
title: From tracing to autonomous tail-fixing
events:
  - { date: "NOW", title: Tracing + rollups, desc: live for Cloudflare & Vercel }
  - { date: "Q3", title: Tail alerts, desc: anomaly detection on p99 }
  - { date: "Q4", title: Auto-hedging, desc: one-click tail mitigation }
  - { date: "2027", title: Multi-cloud, desc: Deno, AWS Lambda@Edge, Fastly }
---

---
layout: compare
kicker: Why we win
title: Built for the edge, not retrofitted
rows:
  - { metric: edge-native, before: Legacy APM, after: Parity, delta: "✓" }
  - { metric: per-call tail, before: sampled, after: complete, delta: "✓" }
  - { metric: page rollups, before: "—", after: built-in, delta: "✓" }
  - { metric: setup time, before: days, after: "4 min", delta: "60×" }
---

---
layout: logos
kicker: Already trusted by
title: Teams shipping on the edge
logos:
  - { icon: "lucide:cloud", text: Northwind }
  - { icon: "lucide:zap", text: Voltcommerce }
  - { icon: "lucide:box", text: Crately }
  - { icon: "lucide:radio", text: Signalbox }
  - { icon: "lucide:orbit", text: Lumen }
---

---
layout: showcase
kicker: The product
title: The tail, finally <span class="accent2">visible</span>.
subtitle: One line of config. Every invocation, every percentile, every region — in a view your whole team reads.
image: /cover.jpg
side: right
---

---
layout: fact
kicker: The ask
value: "$3M"
label: Seed to reach <span class="accent2">$5M ARR</span> and ship auto-hedging.
---

---
layout: end
title: Parity
subtitle: See the tail. Fix the tail.
contact: founders@parity.dev
---
