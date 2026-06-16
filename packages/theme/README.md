# slidev-theme-tahta

**A design system for [Slidev](https://sli.dev).** Tokens, components, and patterns — so a deck is something you *assemble*, not style. Seven themeable variants, keynote-grade output, authored entirely in frontmatter (no CSS, no grids, no layout HTML).

→ **Live explorer:** [tahta.cagdas.io](https://tahta.cagdas.io) (every layout × every variant) · **Repo:** [github.com/zcag/tahta](https://github.com/zcag/tahta)

→ **Agents: read [`AGENTS.md`](./AGENTS.md)** — the full authoring contract (every layout's schema + copy-paste examples), generated from `layouts.json` + `variants.json`.

→ **Optional capability modules** ([`modules/`](./modules/modules.json)) — prompt fragments a consumer appends to `AGENTS.md` only when a capability is in play, keeping the core contract lean: [`branding`](./modules/branding.md) (logo / brand color) and [`imagery`](./modules/imagery.md) (generating & placing images). A consumer reads `modules.json`, and for each entry whose `when` holds, appends the file after `AGENTS.md`. For imagery, the agent generates via its **own** image endpoint per the recipe and may palette-lock results with the bundled `tahta-imagine` (`imagine.mjs`, needs the optional `sharp`) — tahta never calls a model itself.

## Why a system, not a theme

- **Foundations as data.** A 3-tier token layer ([`tokens.json`](./tokens.json)) — primitives → semantic → variant bundles. Components read *only* semantic tokens, so a variant is a remap. One `--accent` derives the whole palette (tints, shades, chart series) via OKLCH.
- **A published contract.** [`layouts.json`](./layouts.json) + [`variants.json`](./variants.json) ship in the package; `AGENTS.md` is generated from them. A [`lint`](./lint.mjs) validator is exported for tooling.
- **Quality enforced.** CI gates a token-contract (no hardcoded values) *and* WCAG-AA contrast for every variant.

## Install

```bash
npm i slidev-theme-tahta echarts        # echarts only if you use the chart layout
```

```yaml
---
theme: slidev-theme-tahta
title: My Talk
themeConfig: { variant: editorial }
layout: cover
kicker: Team · 2026
subtitle: A one-line promise
---
```

## Variants

`themeConfig.variant` swaps the whole style — typeface, shape language, texture, density, motion, and palette:

| variant | scheme | type | feel |
|---|---|---|---|
| `editorial` *(default)* | dark | Fraunces serif + Hanken | refined keynote |
| `brutalist` | dark | Space Mono | technical / raw |
| `soft` | light | Plus Jakarta | friendly / product |
| `minimal` | light | Archivo, heavy | high-contrast editorial |
| `paper` | light | Fraunces serif | warm editorial |
| `atelier` | dark | Hanken, gradient titles | studio / premium |
| `notebook` | light | Hanken, bold | playful-clean |
| `lagoon` | dark | Hanken, heavy | moody teal + pastel role-cards |
| `press` | light | Fraunces serif | B&W editorial magazine |
| `boardroom` | dark | Hanken | navy + orange, corporate / trust |
| `signal` | dark | Hanken, heavy | true black + electric, launch |
| `muse` | light | Fraunces serif | muted stone, intellectual |
| `poster` | light | Anton condensed | cream, loud / athletic |

```yaml
themeConfig:
  variant: brutalist
  accent: '#c8f135'   # optional — override just the brand color
  lang: tr            # optional — locale casing (Turkish i→İ)
```

## Write slides by filling fields

Every layout reads structured frontmatter — a full stats slide is zero markup:

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

### Layouts
**Keynote / pitch** — `cover` · `lead` · `section` · `default` · `statement` · `bigtype` · `quote` · `stats` · `fact` · `metric` · `compare` · `chart` · `steps` · `feature` · `timeline` · `logos` · `code` · `two-cols` · `image` · `showcase` · `bleed` · `embed` · `end`

**Teaching / technical** — `agenda` · `define` · `columns` · `panels` · `reference` · `vs` · `code-explain`

Charts do `bar · line · area · donut` (ECharts), with a categorical palette derived from your accent. `code` supports Magic Move. Long bodies auto-fit to the frame. `<em>word</em>` in a title = italic accent emphasis; `class: dropcap` = drop cap.

### Components (for `default`/`statement` bodies)
`<Stat>` · `<StatCard>` · `<Plot>` · `<Figure>` · `<Meter>` · `<Person>` · `<Tags>` · `<Callout>` · `<Badge>` · `<Icon>` (Lucide, bundled) · `<Kbd>` · `<Terminal>` · `<FileTree>` · `<Reveal>` · `<Fit>` · `<Ghost>`

### Backgrounds (`bg:`)

Any slide takes a `bg:` field. The generated options are drawn by the browser (accent-derived, no assets, deterministic on export, AA-safe):

```yaml
---
layout: section
bg: aurora   # mesh | aurora | grain | dots | grid
---
```

Or pass an image path — it's painted under an automatic contrast scrim so text stays legible:

```yaml
bg: /hero.jpg
```

## Theming goes deep

Three levels, all declarative:

1. **Variant** — `themeConfig.variant` swaps the whole style bundle.
2. **Accent** — `themeConfig.accent` overrides the single brand color; the palette re-derives.
3. **Tokens** — `styles/tokens.css` is a 3-tier system. Components read only semantic tokens, so a new `:root[data-variant='…']` block restyles everything. Add a variant by copying one and remapping the semantic vars.

Variant / accent / lang are applied at runtime by `global-bottom.vue`; defaults to `editorial` if unset, so a deck with no config still looks finished.

## Gotchas baked into the contract
- Images for `bleed`/`image`/`showcase` (and `bg: /x.jpg`) go in the deck's `public/`, referenced as `/name.jpg` — use the layout's `image:` field, don't `<img>` them.
- In YAML flow rows `{ ... }`, quote any value containing a comma/colon (`"$4,200"`).
- `cover`/`section`/`statement`/`end` take the title from frontmatter — leave the body empty.

## License

MIT © Cagdas Salur
