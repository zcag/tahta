---
theme: slidev-theme-tahta
title: The Tail That Wags the Service
info: A conference talk on tail latency — why averages lie and what to do about it.
themeConfig:
  variant: editorial
transition: slide-left
mdc: true
layout: cover
kicker: SREcon · 2026
subtitle: Why your <span class="accent2">average</span> latency is a lie your worst customers don't believe.
---

# The Tail That Wags the Service

---
layout: statement
kicker: The setup
title: Your dashboard says <span class="accent2">42ms</span>. Your angriest user waited 1.9 seconds.
---

Both numbers are true. The mean just isn't the one that churns.

---
layout: stats
kicker: The arithmetic of scale
title: One slow call poisons the whole page
ghost: "×"
stats:
  - { value: 100, unit: "ms", label: typical single-call latency, icon: "lucide:timer" }
  - { value: 50, unit: "×", label: backend calls per page render, icon: "lucide:layers" }
  - { value: 63, unit: "%", label: pages that hit at least one p99 call, icon: "lucide:flame" }
---

---
layout: chart
kicker: The shape of the problem
title: Latency isn't a number — it's a long tail
note: The mean sits where almost <span class="accent2">no request</span> actually lands.
chart:
  type: area
  unit: ms
  categories: ["p50", "p75", "p90", "p95", "p99", "p99.9"]
  series:
    - { name: This service, data: [38, 70, 140, 280, 920, 1900] }
    - { name: After hedging, data: [38, 62, 96, 150, 280, 410] }
---

---
layout: compare
kicker: Same data, four lenses
title: The statistic you pick is the story you tell
rows:
  - { metric: mean, before: "—", after: "186ms", delta: "hides the tail" }
  - { metric: p50, before: "—", after: "38ms", delta: "the typical user" }
  - { metric: p99, before: "—", after: "920ms", delta: "1 in 100 requests" }
  - { metric: p99.9, before: "—", after: "1.9s", delta: "every power user, daily" }
---

---
layout: code
kicker: Measuring it honestly
title: Percentiles, three ways
---

````md magic-move
```py
# Naive: average. Smooth, comforting, wrong.
def summary(xs):
    return sum(xs) / len(xs)
```
```py
# Honest: sort and index. Correct, but O(n log n) and O(n) memory.
def summary(xs):
    xs = sorted(xs)
    return {p: xs[int(p / 100 * (len(xs) - 1))] for p in (50, 99, 99.9)}
```
```py
# At scale: a t-digest. Approximate, mergeable, O(1) memory per shard.
from tdigest import TDigest
def summary(stream):
    d = TDigest()
    for x in stream:            # merge across shards, then query
        d.update(x)
    return {p: d.percentile(p) for p in (50, 99, 99.9)}
```
````

---
layout: steps
kicker: What actually moves the tail
title: Four levers, in order of payoff
steps:
  - { title: Hedge, desc: send a 2nd request after p95, take the first answer, icon: "lucide:split" }
  - { title: Shed, desc: drop work early under load instead of queueing it, icon: "lucide:scissors" }
  - { title: Isolate, desc: bulkhead slow dependencies so they can't stall the page, icon: "lucide:shield" }
  - { title: Cache, desc: collapse the calls-per-page multiplier at the edge, icon: "lucide:database" }
---

---
layout: default
kicker: The one mental model
title: Treat latency like a budget, not an average
---

<Callout icon="lucide:wallet">
A page render spends a <strong>latency budget</strong>. With 50 calls, even a 1% chance of a slow call means most pages overspend. Optimize the <span class="accent2">99th percentile of a single call</span>, not the mean — that's the number your page actually feels.
</Callout>

- Set SLOs on p99/p99.9, never on the mean
- Measure per-call *and* per-page — they diverge fast
- Hedging buys the biggest tail reduction per line of code

---
layout: quote
quote: The service is only as fast as its slowest necessary component — and at scale, something is always slow.
author: Dean & Barroso · "The Tail at Scale"
---

---
layout: fact
kicker: The takeaway
value: "p99"
label: Optimize the number your <span class="accent2">worst</span> customer feels, not the one your dashboard loves.
---

---
layout: end
title: Mind the tail
subtitle: Slides built with tahta
contact: "@you · slides.example.com"
---
