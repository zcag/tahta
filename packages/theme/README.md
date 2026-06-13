# slidev-theme-deck

An **agent-ready** Slidev theme. The design intelligence (composition, type, color, spacing, footers, page numbers, backgrounds, charts) lives in the theme; the author — human or LLM — just picks a `layout` per slide and fills frontmatter fields. No CSS, no grids, no layout HTML.

→ **Agents: read [`AGENTS.md`](./AGENTS.md)** — it's the full authoring contract (decision tree + every layout's schema + copy-paste examples).

## Use it

Relative path (no install):
```yaml
---
theme: ../../slidev-theme-deck   # path from your slides.md to this folder
title: My Talk
layout: cover
kicker: Team · 2026
subtitle: A one-line promise
---
```
Or `npm link` / publish to npm and reference as `theme: deck`.

Requires `echarts` in the host project for the `chart` layout / `BarChart` component:
```
npm i echarts
```

## Layouts
`cover` · `section` · `default` · `statement` · `quote` · `stats` · `compare` · `chart` · `steps` · `image` · `bleed` · `end`

Each is frontmatter-driven. Example — a full stats slide, zero markup:
```yaml
---
layout: stats
kicker: The numbers
title: What actually changed
stats:
  - { value: 80, unit: "%", label: lower p95 latency }
  - { value: 33, unit: "%", label: cost reduction }
  - { value: 0, label: seconds of downtime }
---
```

## Components (for `default`/`statement` bodies)
`<Stat>` · `<StatCard>` · `<BarChart>` · `<Ghost>` · `<Foot>` (auto)

## Theming — variants, accent, tokens (style, not just color)

Three levels, all declarative (no prompt, no per-slide CSS):

**1. Variant** — switches the whole *style* (typeface, shape language, texture, density, palette). One line in the deck header:
```yaml
themeConfig:
  variant: editorial   # editorial | brutalist | soft | minimal
```
| variant | scheme | type | shape | feel |
|---|---|---|---|---|
| `editorial` (default) | dark | Fraunces serif + Hanken | hairline, grain | refined keynote |
| `brutalist` | dark | Space Mono | hard edges, grid | technical/raw |
| `soft` | light | Plus Jakarta | big radius, soft shadow | friendly/product |
| `minimal` | light | Archivo, heavy | Swiss whitespace, hairline | high-contrast editorial |

**2. Accent** — override the single brand color without touching the variant:
```yaml
themeConfig:
  variant: minimal
  accent: '#1d4ed8'
```

**3. Tokens** — deeper control lives in `styles/tokens.css` as a 3-tier system (primitives → semantic → variant bundles). Add a new variant by copying a `:root[data-variant='…']` block and changing the semantic vars. Components/layouts read only semantic vars, so a new variant restyles everything automatically.

Variant + accent are applied at runtime by `global-bottom.vue` (reads `themeConfig`); defaults to `editorial` if unset, so a deck with no config still looks finished.

## Demo
See `../decks/demo/slides.md` — a 10-slide deck written almost entirely in frontmatter. Export to grade:
```
npx slidev export ../decks/demo/slides.md --format png --output /tmp/demo
```

## Gotchas baked into the contract
- Images for `bleed`/`image` go in the deck's `public/` and are referenced as `/name.jpg` (use the layout's `image:` field — don't `<img>` them; Slidev would try to import the path).
- In YAML flow rows `{ ... }`, quote any value containing a comma/colon (`"$4,200"`).
- `cover`/`section`/`statement`/`end` take the title from frontmatter — leave the body empty.
