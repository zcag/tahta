---
theme: slidev-theme-tahta
mdc: true
themeConfig:
  variant: brutalist
layout: cover
kicker: A developer's field guide
title: Data & <span class="accent2">Databases</span>
subtitle: Draw the structure — don't describe it.
---

---
layout: agenda
kicker: The map
title: What we'll cover
items:
  - { topic: Foundations, desc: "ACID · isolation · the seat race" }
  - { topic: Indexes & storage, desc: "B-trees · row vs column" }
  - { topic: Scale, desc: "sharding · replication" }
---

---
layout: section
index: "01"
kicker: Part one
title: Foundations
---

---
layout: diagram
kicker: Concurrency
title: Two transactions, one seat
note: Without isolation both reads see <strong>1</strong> — and both writes win.
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
layout: define
kicker: The core guarantee
term: ACID
definition: A transaction is <span class="accent2">all-or-nothing</span> and survives crashes.
points:
  - "Atomicity — every step commits, or none"
  - "Isolation — concurrent txns don't see each other's partial state"
---

---
layout: section
index: "02"
kicker: Part two
title: Indexes & storage
---

---
layout: define
kicker: Indexes
term: Big-O
definition: How lookup cost grows with rows $n$.
points:
  - "Full scan — $O(n)$"
  - "B-tree — $O(\\log n)$: ~3 hops in a billion rows"
---

---
layout: diagram
kicker: Index
title: A B-tree lookup
aside: under the hood
note: Find <strong>42</strong> in ~3 hops, not a full scan.
---

```mermaid
flowchart TD
  Root["50 · 100"] --> L["10 · 30"]
  Root --> M["60 · 80"]
  Root --> R["120 · 160"]
  M --> Hit["42 ✓"]
```

---
layout: default
kicker: Storage layout
title: A column store reads one column
---

<Grid :data="[['id','name','age','city'],['1','Ada','36','London'],['2','Lin','29','Berlin'],['3','Sam','41','Oslo']]" head highlight="col:2" />

<p class="dim mt-6">A row store keeps each record together; a column store keeps each <em>column</em> together — so an aggregate over <strong>age</strong> reads only the highlighted cells.</p>

---
layout: section
index: "03"
kicker: Part three
title: Scale
---

---
layout: diagram
kicker: Scale
title: Sharding by hash
note: The router sends each key to one shard; cross-shard queries are the cost.
---

```mermaid
flowchart TD
  C[Client] --> RT{"Router · hash(key)"}
  RT -->|0–33| S1[(Shard A)]
  RT -->|34–66| S2[(Shard B)]
  RT -->|67–99| S3[(Shard C)]
```

---
layout: diagram
kicker: Replication
title: One leader, many followers
note: Reads fan out; replication lag between them is the whole game.
---

```mermaid
flowchart LR
  C[Client] -->|write| L[(Leader)]
  L -->|stream WAL| F1[(Follower 1)]
  L -->|stream WAL| F2[(Follower 2)]
  F1 -.->|read| U1[Reader]
  F2 -.->|read| U2[Reader]
```

---
layout: statement
kicker: The takeaway
title: There's no <em>best</em> database — only trade-offs you chose on purpose.
---

---
layout: end
title: Thanks
subtitle: Questions welcome
---
