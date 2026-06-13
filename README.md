<h1 align="center">tahta</h1>

<p align="center">A pristine, themeable <a href="https://sli.dev">Slidev</a> design system — with a visual-grading CLI for local development.</p>

<p align="center">
  <code>slidev-theme-tahta</code> · the theme &nbsp;|&nbsp; <code>tahta</code> · the grader
</p>

---

Default Slidev looks generic. **Tahta** is a token-driven design system that takes a deck to keynote-grade with declarative frontmatter — and a CLI that screenshots every slide, flags the broken ones, and gives you a side-by-side review report while you work.

- **Style variants, not just colors.** One line — `themeConfig.variant: editorial | brutalist | soft | minimal` — swaps typeface, shape, texture, density, and palette (2 dark, 2 light). Built on a 3-tier token system, so adding your own variant is one block.
- **Declarative layouts.** `cover · section · stats · compare · chart · steps · quote · image · bleed · end` — pick a layout, fill fields. No CSS, no grids. Auto footers + page numbers.
- **Real components.** Token-driven `Stat`, `StatCard`, `BarChart` (ECharts), `Ghost`.
- **Visual grading built in.** `tahta` exports every slide → PNG, auto-flags blank/broken slides, and serves an HTML report with a tab per variant. `--watch` for a live inner loop; non-zero exit for CI.

## Monorepo

```
tahta/
  packages/theme/   slidev-theme-tahta — tokens, variants, layouts, components
  packages/grade/   tahta — the visual-grading CLI
  examples/edge/    a 10-slide demo, authored almost entirely in frontmatter
  docs/             design-system.md
```

## Quick start

```bash
npm install
npm run dev      # live-edit the example deck
npm run grade    # export + grade the example across all 4 variants, serve the report
```

Use the theme in your own deck:

```yaml
---
theme: slidev-theme-tahta
title: My Talk
themeConfig:
  variant: editorial
layout: cover
kicker: Team · 2026
subtitle: A one-line promise
---
```

```bash
npm i slidev-theme-tahta echarts        # echarts only if you use the chart layout
```

## Grade your deck

```bash
npx tahta slides.md --variants editorial,brutalist,soft,minimal --serve 4180
npx tahta slides.md --watch
```

See [`docs/design-system.md`](./docs/design-system.md) for tokens, variants, and how to extend, and [`packages/theme/AGENTS.md`](./packages/theme/AGENTS.md) for the full per-layout frontmatter reference.

## License

MIT © Cagdas Salur
