<h1 align="center">tahta</h1>

<p align="center"><b>A pristine, themeable design system for <a href="https://sli.dev">Slidev</a>.</b><br>
Write slides by filling in fields. Switch the entire visual style — type, shape, texture, palette — with one line.</p>

<p align="center"><code>npm i slidev-theme-tahta</code></p>

<p align="center"><img src="docs/assets/variants.png" alt="The same slide in four variants: editorial, brutalist, soft, minimal" width="860"></p>

<p align="center"><em>One deck, one line changed — four complete styles. Not a recolor: different typefaces, shapes, textures, and density.</em></p>

---

Default Slidev looks generic. **Tahta** is a token-driven design system that gets a deck to keynote-grade from declarative frontmatter — no CSS, no grids, no layout HTML — and lets you reskin the whole thing by switching a variant.

- **Style variants, not just colors.** `themeConfig.variant: editorial | brutalist | soft | minimal` swaps typeface, shape language, texture, density, and palette (2 dark, 2 light). Built on a 3-tier token system, so a new variant is one block.
- **Declarative layouts.** Pick a layout, fill fields. Auto footers, auto page numbers.
- **Token-driven components.** `Stat`, `StatCard`, `Plot`/`BarChart` (ECharts), `Icon` (Lucide, bundled offline), `Callout`, `Reveal`, `Fit` (auto fit-to-frame) — all follow the active variant automatically.
- **One accent → a whole palette.** Set one color; chart series, tints and shades derive from it via OKLCH (relative color).
- **Semantic roles + i18n.** `good / warn / bad / info` tones (`Badge`, `Callout`, `Stat`), and `themeConfig.lang` for correct locale casing (e.g. Turkish `i → İ`).
- **Motion with a personality per variant.** Entrance choreography (`--motion-*` tokens) differs by style — editorial fades, brutalist snaps, soft springs — and is off in print + under reduced-motion.

## Variants

| | scheme | type | shape | feel |
|---|---|---|---|---|
| **editorial** *(default)* | dark | Fraunces serif + Hanken | hairline, grain | refined keynote |
| **brutalist** | dark | Space Mono | hard edges, grid | technical / raw |
| **soft** | light | Plus Jakarta | rounded, soft shadow | friendly / product |
| **minimal** | light | Archivo, heavy | Swiss whitespace | high-contrast editorial |
| **paper** | light | Fraunces serif | warm cream, grain | warm editorial |
| **atelier** | dark | Hanken, gradient titles | cool, refined | studio / premium |
| **notebook** | light | Hanken, bold | ruled paper, dashed rules | playful-clean |

Machine-readable contracts ship in the package: [`variants.json`](packages/theme/variants.json) (the table above as data) and [`layouts.json`](packages/theme/layouts.json) (every layout + field + component) — `AGENTS.md` is generated from them.

```yaml
themeConfig:
  variant: brutalist
  accent: '#c8f135'   # optional — override just the brand color
```

## Quick start

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

## Write slides by filling fields

Every layout reads structured frontmatter — a full stats slide is nine lines and zero markup:

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

`cover` · `section` · `default` · `statement` · `quote` · `stats` · `fact` · `compare` · `chart` · `steps` · `feature` · `timeline` · `logos` · `code` · `two-cols` · `image` · `showcase` · `bleed` · `embed` · `end`

Charts do `bar · line · area · donut` (ECharts), with a categorical palette derived from your one accent. `code` supports Magic Move. Long bodies auto-fit to the frame.

<p align="center"><img src="docs/assets/layouts.png" alt="Layout catalog" width="860"></p>

Full per-layout reference: [`packages/theme/AGENTS.md`](packages/theme/AGENTS.md).

## Theming goes deep

Three levels, all declarative:

1. **Variant** — `themeConfig.variant` swaps the whole style bundle.
2. **Accent** — `themeConfig.accent` overrides the single brand color.
3. **Tokens** — `packages/theme/styles/tokens.css` is a 3-tier system (primitives → semantic → variant bundles). Components read only semantic tokens, so a new `:root[data-variant='…']` block restyles everything.

See [`docs/design-system.md`](docs/design-system.md).

## Repo

```
packages/theme/   slidev-theme-tahta — the design system (tokens · variants · layouts · components)
packages/grade/   tahta — visual-grading CLI used to develop the theme
examples/edge/    a deck authored entirely in frontmatter
examples/gallery/ every layout + component, in one deck
docs/             design-system.md + generated images
```

## Developing tahta

The theme is the project; the tooling exists to build it well. `packages/grade` (`tahta`) is the inner loop — it exports every slide to PNG, flags blank/broken/regressed/overflowing slides, and serves a side-by-side report with a tab per variant.

```bash
npm install
npm run dev        # live-edit the example deck
npm run grade      # export + grade the example across all four variants, serve the report
npm run assets     # regenerate the README images from source
```

Editing the system, the loop is: change a token → `npx tahta examples/gallery/slides.md --variants editorial,brutalist,soft,minimal --watch` → see every slide in every variant update, with regressions flagged. Details in [`packages/grade/README.md`](packages/grade/README.md).

## License

MIT © Cagdas Salur
